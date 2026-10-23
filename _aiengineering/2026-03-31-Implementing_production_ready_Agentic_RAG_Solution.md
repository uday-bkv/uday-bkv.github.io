---
title: "Building a Production ready Agentic RAG Pipeline: TF-IDF, HNSW, LSH, CAG, guardrails and More"
collection: aiengineering
permalink: /aiengineering/s_rag_agentic_rag
excerpt: '**TL;DR**
This post outlines a potentially effective approach to user queries by implementing a Agentic Retrieval-Augmented Generation (RAG) strategy,and 10-guardrail safety system.'
date: 2026-04-02


tags:
  - caching 
  - mcp 
  - chunking 
  - semantic-search 
  - rag-pipeline 
  - rag-chatbot 
  - agentic-rag 
---
**TL;DR**

> This post outlines a potentially effective approach to user queries by implementing a Agentic Retrieval-Augmented Generation (RAG) strategy, and 10-guardrail safety system.. The proposed solutions involve utilizing Cache-Augmented Generation alongside Context Engineering, Semantic Search, Embeddings, Chunking, Page Indexing, a Web Chat User Interface, and large language models such as Olama and Gemeni. Additionally, it incorporates Hugging Face's Chain and the MCP Server for Claude Desktop.
> - User Query → Agent Brain (LLM as orchestrator)
  - 5-tool belt: search_chunks, search_pages, filter_by_file, summarise_doc, answer
  - ToolExecutor → ChromaDB → Observation
  - Self-Reflection: "Enough? YES → answer / NO → loop back"
  - Loop-back arrow on the right showing max 5 iterations
  - Real example trace at the bottom showing a 3-iteration comparison query

# How it works?

<img src="/images/posts/agentic_rag.svg" style="border-radius: 15px;box-shadow: 0px 0px 5px 5px #000000;">



# Agentic RAG: The LLM That Chooses Its Own Context

Standard RAG retrieves blindly. Agentic RAG makes the language model an active participant — planning which documents to retrieve, deciding when it has enough, and reflecting on its own answers before committing.

---

## The Problem with Standard RAG

Every RAG tutorial follows the same script: embed documents, store in a vector database, retrieve top-k chunks, pass to an LLM. It works for simple factual lookups. It breaks down the moment questions get complex.

Ask *"What is HNSW?"* and standard RAG is fine — retrieve three chunks, generate an answer. Ask *"Compare how HNSW and LSH are applied across all my technical documentation"* and you have a problem. The system retrieves three chunks and hopes they cover everything. Often they don't.

The deeper issue: standard RAG treats retrieval as a **one-shot, passive operation**. The LLM receives whatever chunks the vector database decided were most similar to the query — it has no say in the matter.

---

## Do we need Agentic RAG?

Agentic RAG is built on the **ReAct framework** (Reason + Act). The language model alternates between reasoning about what to do and taking actions — in this case, calling retrieval tools.

Each iteration has three phases:

1. **Reason** — "What do I need to answer this? What do I have so far?"
2. **Act** — Call a tool with specific parameters, get ranked chunks back
3. **Reflect** — "Is this enough? YES → produce answer. NO → plan next tool call."

The loop runs up to 5 iterations. The agent outputs pure JSON at each step:

```json
{
  "thought": "I need HNSW information first, then LSH separately to compare them",
  "tool": "search_chunks",
  "args": {
    "query": "HNSW hierarchical navigable small world graph index",
    "top_k": 4
  }
}
```

---

## The Five Tools

The agent has access to five tools. Four interact with ChromaDB. The fifth ends the loop.

| Tool | Parameters | Best for |
||||
| `search_chunks` | query, top_k | Facts, definitions, code — fine-grained retrieval |
| `search_pages` | query, top_k | Overviews, multi-section topics — broad context |
| `filter_by_file` | filename, query, top_k | When you know which document has the answer |
| `summarise_doc` | filename | High-level overview of an entire document |
| `answer` | answer, confident | **Ends the loop** — call when ready |

The `answer()` tool is the exit condition. When the agent decides it has enough context, it calls `answer()` with the final text and a confidence flag. The framework detects this and terminates the loop.

---



## Implementation

### Core Loop

```python
class AgenticRAG:
    def run(self, query: str) -> AgentResult:

        # 0. Input guardrails
        if _GUARDRAILS:
            gr = _GUARDRAILS.check_input(query)
            if not gr.passed:
                return AgentResult(answer=f"Blocked: {gr.block_reason}", ...)
            if gr.redacted_input:
                query = gr.redacted_input

        # 1. Redis cache
        cached = self.cache.get(f"agent:{query}", 0)
        if cached:
            return AgentResult(**cached, cache_hit=True)

        collected = []  # context accumulated across iterations

        for iteration in range(1, self.max_iterations + 1):

            # 2. Build prompt with accumulated context
            messages = [system_msg, {"role": "user", "content": ITERATION_PROMPT.format(
                trace=format_trace(trace),
                context="\n\n".join(collected[-6:]),
                query=query,
            )}]

            # 3. LLM decides next action
            raw       = _call_llm(messages, self.llm_provider, ...)
            tool_call = _parse_tool_call(raw)

            # 4. Execute — or terminate if answer()
            if tool_call.name == "answer":
                answer = tool_call.args["answer"]
                break

            observation = self.executor.execute(tool_call)
            collected.append(observation)
```

### System Prompt (key excerpt)

```
You are an intelligent research agent with access to a document knowledge base.

Rules:
1. Think step by step. Analyse the question, then choose the right tool.
2. You may call multiple tools across iterations to build a complete answer.
3. Always cite sources using [Source: filename].
4. If results are not relevant, try a different query or tool.
5. Call `answer` when you have enough — do NOT over-search.
6. Respond ONLY with valid JSON:
   {"thought": "...", "tool": "tool_name", "args": {...}}
```

### Parsing LLM Output

LLMs sometimes wrap JSON in markdown fences. The parser handles this:

```python
def _parse_tool_call(raw: str) -> Optional[ToolCall]:
    # Strip markdown fences
    raw = re.sub(r"```(?:json)?", "", raw).strip().strip("`")
    try:
        data = json.loads(raw)
        return ToolCall(name=data["tool"], args=data["args"])
    except Exception:
        # Try extracting JSON from messy response
        match = re.search(r'\{.*\}', raw, re.DOTALL)
        if match:
            data = json.loads(match.group())
            return ToolCall(name=data["tool"], args=data["args"])
    return None  # caller will retry
```

---

---

## Standard vs Agentic: When to Use Each

| | Standard RAG | Agentic RAG |
||||
| Retrieval | Fixed top-k, single pass | Dynamic, LLM-directed, multi-pass |
| Latency | ~1 second | ~3–10 seconds |
| Simple factual Q&A | ✅ Excellent | ❌ Overkill |
| Multi-doc synthesis | ❌ Often incomplete | ✅ Iterates to completeness |
| Complex comparisons | ❌ Struggles | ✅ Handles well |
| Transparency | None | Full reasoning trace |
| LLM calls per query | 1 | 1–5 |
| Redis cache hit rate | ~40% | ~40% (same cache) |

**Rule of thumb:** use Standard RAG as your default. Switch to Agentic RAG when the question contains words like *compare*, *across all*, *summarise everything about*, or *step by step*.

---

## Guardrails in the Agent Loop

Input guardrails run **once before** the loop. Output guardrails run **once on the final answer**. The agent never sees blocked or unredacted input.

```python
# Input: runs BEFORE the agent loop (once)
gr = guardrails.check_input(query)
if not gr.passed:
    return {"answer": f"Blocked: {gr.block_reason}"}
if gr.redacted_input:
    query = gr.redacted_input  # agent sees clean query

# ... 1–5 agent iterations ...

# Output: runs on final answer (once)
og = guardrails.check_output(answer, collected_sources)
answer = og.redacted_output or answer
warnings = og.warnings  # attached to response
```

Both pipelines (Standard and Agentic) share the same `guardrails.py` module.

---

## Usage

```bash
# Simple query
python src/generation/agentic_rag.py "What is RAG?"

# Show full reasoning trace
python src/generation/agentic_rag.py "Compare HNSW and LSH" --trace

# Limit iterations
python src/generation/agentic_rag.py "Summarise all documents" --iter 3
```

```python
# As a library
from agentic_rag import AgenticRAG

agent = AgenticRAG(
    chunk_col     = chunk_col,
    page_col      = page_col,
    cache         = cache,
    llm_provider  = "ollama",   # or "gemini"
    max_iterations= 5,
)
result = agent.run("What are the key differences between HNSW and LSH?")
agent.print_trace(result)
print(result.answer)
```


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

# Agentic RAG (agentic_rag.py)
MAX_ITERATIONS        = 5
TOP_K_DEFAULT         = 4
CONFIDENCE_THRESHOLD  = 0.5      # min chunk score to include
```

---

## Source Code

```
src/
├── ingestion/create_vector_db.py   TF-IDF chunking + dual index
├── retrieval/search.py             semantic search CLI
├── generation/
│   ├── agentic_rag.py              Agentic RAG + ReAct loop
│   └── guardrails.py               10-guardrail safety layer
├── context/context_engine.py       MMR, compress, budget, memory
└── server/
    ├── chat_server.py              FastAPI + WebSocket UI
    └── mcp_server.py               Claude Desktop MCP tools
```

---

References are available at: 
- [GitHub Repo ](https://github.com/uday-bkv/production-ready-rag-solution)

---

## Key Takeaway

The shift from Standard to Agentic RAG is about **who controls the retrieval strategy**. In standard RAG, the developer hardcodes it (top-3 chunks, cosine similarity). In Agentic RAG, the language model decides at runtime, adapting to each question's structure.

Run both. Use Standard RAG for speed and caching. Use Agentic RAG when the question genuinely needs it.

---