---
title: "Automatic Speech Recognition — Capstone Project"
excerpt: "An end-to-end ASR system that accurately transcribes spoken language into text across diverse domains and accents, built with Kaldi, Vosk, FastAPI, and deployed on Azure AKS.<br/><a href='https://github.com/uday-bkv/Automated-Speech-Recognition'>repo link..</a>"
collection: projects
header:
  teaser: "/images/projects/asr_cap.png"
tags:
  - Python
  - Speech Recognition
  - Azure AKS
  - FastAPI
  - Kaldi
  - Vosk
  - Streamlit
---


An end-to-end Automatic Speech Recognition (ASR) system that accurately transcribes spoken language into written text across diverse domains and accents. The system is served via a FastAPI backend, presented through a Streamlit interface, and deployed on Azure Kubernetes Service (AKS).

![App screenshot](/images/projects/asr_cap.png)


---

## Key Concepts

- **Automatic Speech Recognition (ASR)** — converting spoken audio into written text with high accuracy across varied accents and subject domains
- **Kaldi** — industry-standard open source toolkit for building speech recognition pipelines
- **Vosk API** — lightweight offline speech recognition library that wraps Kaldi models for easy integration
- **FastAPI** — high-performance Python web framework used to expose the ASR model as a REST API
- **Streamlit** — Python-based UI framework for building and serving the interactive front end
- **Azure AKS** — managed Kubernetes service used to deploy and scale the containerised application

---

## Architecture

```
Audio Input (Streamlit UI)
        ↓
  FastAPI Backend
        ↓
  Vosk / Kaldi ASR Model
        ↓
  Transcribed Text Output
        ↓
  Deployed on Azure AKS
```

---

## Prerequisites

Install the required dependencies:

```sh
pip install -r requirements.txt
```

---

## Running the App

**Start the FastAPI backend:**
```sh
uvicorn main:app --reload
```

**Launch the Streamlit UI:**
```sh
streamlit run app.py
```

---

## Repository

[github.com/uday-bkv/asr-capstone-project](https://github.com/uday-bkv/Automated-Speech-Recognition)


[Presentation](../../Documents/ASR-Presentation.pdf)
