---
title: "ChatBot using Spring AI and OpenAI"
excerpt: "A conversational ChatBot built with Spring AI and OpenAI, demonstrating prompt engineering for domain-specific responses."
collection: projects
tags:
  - Java
  - SpringBoot
  - Spring AI
  - OpenAI
  - Prompt Engineering
  - ChatBot
---

# ChatBot using Spring AI and OpenAI

A conversational ChatBot built with Spring Boot and Spring AI that uses OpenAI's language models to answer domain-specific questions — demonstrated here with a movie knowledge use case.

---

## Key Concepts

- **Prompt Engineering** — crafting structured prompts to guide the model toward accurate, context-aware responses
- **Spring AI** — Spring's abstraction layer for integrating AI models cleanly into Java applications
- **OpenAI** — GPT-based language model powering the conversational responses

---

## Prerequisites

Export your OpenAI API key as an environment variable before running:

```sh
export OPENAI_API_KEY=your_key_here
```

---

## Running the App

```sh
mvn clean install spring-boot:run
```

---

## Testing the ChatBot

Send a question about a movie via the REST endpoint:

```sh
curl --location 'http://localhost:9190/movies/ai/chat?aboutMovie=lordofthering'
```

---

## Repository

[github.com/uday-bkv/chat_app_spring-ai_azure_ai](https://github.com/uday-bkv/chat_app_spring-ai_azure_ai)