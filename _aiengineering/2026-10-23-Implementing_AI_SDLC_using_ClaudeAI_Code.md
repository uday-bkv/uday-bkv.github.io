<!-- ---
title: "Building a Production ready application, using Claude Code, following AI SDLC"
collection: aiengineering
permalink: /aiengineering/s_rag
excerpt: '**TL;DR**
This post outlines a potentially effective approach to user queries by implementing a Retrieval-Augmented Generation (RAG) strategy, and 10-guardrail safety system.'
date: 2026-10-23


tags:
  - caching 
  - mcp 
  - chunking 
  - semantic-search 
  - rag-pipeline 
  - rag-chatbot 
---
**TL;DR**

> This post outlines a potentially effective approach to user queries by implementing a Retrieval-Augmented Generation (RAG) strategy, and 10-guardrail safety system.. The proposed solutions involve utilizing Cache-Augmented Generation alongside Context Engineering, Semantic Search, Embeddings, Chunking, Page Indexing, a Web Chat User Interface, and large language models such as Olama and Gemeni. Additionally, it incorporates Hugging Face's Chain and the MCP Server for Claude Desktop.
>   - Raw Documents → /data/
  - Agentic Chunking + TF-IDF (semantic boundaries + vocabulary scoring)
  - Sentence Transformers — BGE model, dim=384, normalize
  - ChromaDB + HNSW + LSH — O(log n) ANN with the layer graph visualised
  - CAG (Redis) + Context Engine (7 steps) + LLM (Gemini/Ollama)
  

# How it works?


<img src="/images/posts/standard_rag.svg" style="border-radius: 15px;box-shadow: 0px 0px 5px 5px #000000;">


# Building a Production RAG Pipeline with Guardrails

*A complete guide to every layer — TF-IDF, HNSW, LSH, Sentence Transformers, Cache-Augmented Generation, Context Engineering, Agentic RAG, and a 10-guardrail safety system.*

---


## Part 1: Guardrails — Safety First

Most RAG tutorials bolt on safety as an afterthought. We put it at the centre. Every query passes through six input guards before touching the vector database, and every generated answer passes through four output guards before reaching the user.

### Architecture

```
User Query
    │
    ▼
INPUT GUARDRAILS (6 checks, ordered fail-fast)
    ├── ① QueryLengthGuard    — reject 3-2000 chars violation
    ├── ② InjectionGuard      — block jailbreaks, prompt injection
    ├── ③ ToxicityGuard       — block weapons, CSAM, harm instructions
    ├── ④ PIIDetector         — redact emails, phones, SSNs in query
    ├── ⑤ TopicBoundaryGuard  — warn/block off-topic queries
    └── ⑥ RateLimitGuard      — 20 req/60s Redis-backed rate limiting
    │
    ▼  (blocked → return error, redacted → sanitised query)
    │
[RAG or Agentic pipeline runs here]
    │
    ▼
OUTPUT GUARDRAILS (4 checks)
    ├── ⑦ ConfidenceGuard     — warn if top retrieval score < 0.3
    ├── ⑧ HallucinationGuard  — warn if answer/source overlap < 15%
    ├── ⑨ CitationGuard       — warn if long answer has no citations
    └── ⑩ PIIScrubber         — redact PII that leaked into answer
    │
    ▼
Final Answer (possibly with warnings)
```



Guards are ordered from cheapest to most expensive and from hardest blocks to soft warnings. `QueryLengthGuard` runs first because it's a single `len()` call. `InjectionGuard` uses compiled regex patterns:

```python
INJECTION_PATTERNS = [
    r"ignore\s+(all\s+)?(previous|prior|above)\s+instructions?",
    r"act\s+as\s+(?:an?\s+)?(?:evil|uncensored|jailbroken|DAN)",
    r"print\s+your\s+(system\s+)?prompt",
    r"<\s*/?(?:script|iframe|img|svg)",   # XSS attempts
    r"__import__\s*\(",                    # code injection
]
```

`PIIDetector` uses named regex patterns for seven PII types (email, phone, SSN, credit card, IP, passport, UK NINO) and **redacts rather than blocks** — the query continues with `[REDACTED:EMAIL]` replacing sensitive values. This preserves usability while protecting privacy.



Output guards never block a response — they attach warnings that are shown to the user. The most technically interesting is `HallucinationGuard`:

```python
def check(self, answer, chunks):
    source_words = set(re.findall(r"\b[a-z]{4,}\b", all_source_text))
    answer_words = set(re.findall(r"\b[a-z]{4,}\b", answer)) - STOPWORDS
    overlap = answer_words & source_words
    ratio   = len(overlap) / len(answer_words)
    if ratio < 0.15:
        return warn("Answer has low overlap with sources — possible hallucination")
```

15% vocabulary overlap threshold catches answers where the LLM invents content not present in any retrieved chunk.

---

## Part 2: TF-IDF 

**TF-IDF** (Term Frequency × Inverse Document Frequency) is pre-neural NLP that we use in three places:

**1. Offline fallback embedder** — when the HuggingFace model can't download, TF-IDF provides working vector embeddings without any network call.

**2. Agentic chunking** — vocabulary overlap between adjacent sentences signals topic transitions. When overlap drops sharply, the chunker inserts a boundary. Results: chunks containing complete thoughts rather than mid-sentence breaks.

**3. Context compression** — before the LLM sees retrieved chunks, low-TF-IDF sentences are stripped:

```python
def _relevance(self, sentence, query_words):
    words   = set(sentence.lower().split())
    overlap = len(words & query_words)
    length_pen = math.log(max(len(words), 1) + 1)
    return overlap / length_pen
```

A 200-word chunk compresses to ~130 words of genuinely relevant content, reducing LLM prompt size by ~35%.

---

## Part 3: Sentence Transformers and BGE

`BAAI/bge-small-en-v1.5` outperforms `all-MiniLM-L6-v2` on MTEB retrieval benchmarks at the same parameter count. The key difference is training objective: BGE uses contrastive learning specifically for retrieval, pulling (query, relevant-doc) pairs together in embedding space.

```python
self.model.encode(input, normalize_embeddings=True)
```

`normalize_embeddings=True` is critical — it makes cosine similarity equivalent to dot product, which ChromaDB's HNSW index exploits for maximum speed.

---

## Part 4: HNSW and LSH — How Vector Search Works

### HNSW (Hierarchical Navigable Small World)

HNSW builds a multi-layer graph where each layer is progressively sparser. Higher layers enable long-range navigation; lower layers enable local refinement.

```
Layer 2 (sparse):  A ────────────────── G
Layer 1 (medium):  A ──── C ──── E ──── G
Layer 0 (dense):   A─B─C─D─E─F─G─H─I─J
```

At query time, HNSW enters at the top layer and greedily navigates toward the query vector, descending layers until it reaches a dense local neighbourhood. **O(log n)** retrieval instead of O(n) brute force — 1 million vectors in under a millisecond.

### LSH (Locality Sensitive Hashing)

LSH applies hash functions where similar vectors collide with high probability. Multiple hash tables generate a candidate set which HNSW then refines. Together they make semantic search practically instant at any scale.

---

## Part 5: Two-Stage Semantic Search

Two ChromaDB collections are queried in parallel:

- **Chunk index** (`documents`) — 200-word overlapping windows, precise
- **Page index** (`page_index`) — 500-word virtual pages, broad context

Results are merged, deduplicated by source location, and sorted by cosine similarity score. This gives both pin-point precision and contextual breadth from a single retrieval step.

---

## Part 6: Cache-Augmented Generation (CAG)

**CAG** intercepts the pipeline before the LLM using a SHA256-keyed Redis cache:

```python
key = f"rag:cache:{hashlib.sha256(json.dumps({'q': query.lower(), 'k': top_k})).hexdigest()[:16]}"
```

Cache hits take ~2ms. Full RAG takes 1–4 seconds. In practice, 40%+ of queries in a chat session are cache hits — rephrases, follow-ups, and repeat questions are essentially free. The cached payload includes `guardrail_warnings` from the original run, so warnings are preserved on cache hits.

---

## Part 7: Context Engineering Pipeline

Six steps transform raw retrieved chunks into a clean LLM prompt:

**① QueryRewriter** — resolves pronouns using conversation history. "What does it do?" becomes "What does ChromaDB do?"

**② Two-Stage Retrieval** — queries both page and chunk indexes, merges by score.

**③ MMR Re-ranking** — Maximal Marginal Relevance penalises similar chunks:
```python
score = 0.7 * relevance - 0.3 * max_similarity_to_already_selected
```

**④ ContextCompressor** — TF-IDF sentence scoring removes irrelevant content from each chunk.

**⑤ TokenBudgetManager** — fits everything within 3000 tokens, truncating gracefully.

**⑥ SystemPromptBuilder** — assembles a structured prompt with explicit `=== CONTEXT ===`, `=== HISTORY ===`, and `=== QUESTION ===` sections.

**⑦ ConversationMemory** — rolling 6-turn window with auto-summary compression for multi-turn coherence.

---

## Part 8: Ollama — Local LLM, No Quota

One config line switches between providers:

```python
LLM_PROVIDER = "ollama"   # llama3.2 / mistral / phi3 — local, free, private
LLM_PROVIDER = "gemini"   # gemini-2.0-flash-lite — cloud, free tier + retry on 429
```

Ollama is the recommended default: no API key, no quota limits, no data leaving your machine. The pipeline passes the full messages list to Ollama for proper multi-turn support including conversation history.

---



## Part 9: MCP Integration

Exposing the full pipeline to Claude Desktop as MCP tools required one non-obvious fix: MCP uses **stdout as a JSON-RPC channel**, and any `print()` before the handshake corrupts the stream with a `EOF while parsing` error.

```python
_stdout_fd = os.dup(1)   # save real stdout fd
os.dup2(2, 1)            # redirect fd1 → stderr
# ... all imports and setup ...
os.dup2(_stdout_fd, 1)   # restore before FastMCP takes over
mcp.run(transport="stdio")
```

Five tools are exposed: `rag_query`, `semantic_search`, `list_documents`, `cache_stats`, `flush_cache`. Claude Desktop can now search your documents, get guardrailed answers, and manage the cache using natural language.

---

## The Full Stack

| Layer | Technology | Role |
||||
| Safety | Guardrails (10 checks) | Block, redact, warn on every query and answer |
| Chunking | TF-IDF + Agentic | Semantic boundaries, vocabulary-aware splits |
| Embeddings | Sentence Transformers | Dense vector representations |
| Vector DB | ChromaDB + HNSW + LSH | Sub-linear nearest-neighbor search |
| Retrieval | Semantic Search (2-stage) | Page index + chunk index |
| Context | MMR + Compression + Budget | Clean, diverse, token-efficient context |
| Cache | Redis (CAG) | Near-instant repeat queries |
| LLM | Ollama + Gemini | Local + cloud dual provider |
| Memory | ConversationMemory | Multi-turn coherence |
| Agentic | Tool Use + ReAct Loop | Dynamic, self-directed retrieval |
| Server | FastAPI + WebSocket | Real-time web chat |
| Integration | MCP + FastMCP | Claude Desktop tools |

---

## Configuration Reference

```python
# Guardrails (guardrails.py)
GUARDRAILS_ENABLED    = True
TOPIC_WHITELIST       = []       # empty = allow all topics
TOPIC_BLOCK_OFF_TOPIC = False    # False = warn, True = hard block
PII_REDACT            = True
RATE_LIMIT_ENABLED    = False
MIN_CONFIDENCE_SCORE  = 0.3

# Context Engineering (rag.py)
MAX_CONTEXT_TOKENS    = 3000
MMR_LAMBDA            = 0.7      # 1.0=relevance, 0.0=diversity
COMPRESS_RATIO        = 0.7      # sentence keep fraction

```

---

## Source Code

```
src/
├── ingestion/create_vector_db.py   TF-IDF chunking + dual index
├── retrieval/search.py             semantic search CLI
├── generation/
│   ├── rag.py                      Standard RAG + CAG + context engine
│   └── guardrails.py               10-guardrail safety layer
├── context/context_engine.py       MMR, compress, budget, memory
└── server/
    ├── chat_server.py              FastAPI + WebSocket UI
    └── mcp_server.py               Claude Desktop MCP tools
```

---

References are available at: 
- [GitHub Repo ](https://github.com/uday-bkv/production-ready-rag-solution) -->