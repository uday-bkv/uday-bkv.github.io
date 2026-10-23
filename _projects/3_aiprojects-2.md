---
title: "Gen AI: Audio Generation from Imported Photos"
excerpt: "Generate meaningful audio narration from an uploaded photo using HuggingFace, LangChain, and OpenAI.<br/><a href='https://github.com/uday-bkv/image-audio-hf-openai'>repo link..</a>"
collection: projects
header:
  teaser: "/images/projects/output.png"
tags:
  - Python
  - Audio Generation
  - HuggingFace
  - LangChain
  - OpenAI
---


An end-to-end pipeline that takes an uploaded photo, generates a meaningful narrative using LangChain and ChatGPT, and converts it to spoken audio — all served through a Streamlit interface.

---

## How It Works

The pipeline runs in three stages:

**1. Image → Text** — A HuggingFace model (`salesforce/blip-image-captioning-base`) analyses the uploaded image and produces a short caption describing its content.

**2. Text → Story** — LangChain and ChatGPT expand the raw caption into a richer, more meaningful narrative.

**3. Story → Audio** — A second HuggingFace model (`kan-bayashi/ljspeech_vits`) converts the generated text into spoken audio.

![App screenshot](/images/projects/output.png)

---

## Prerequisites

Install the required dependencies:

```sh
pip install -r requirements.txt
```

---

## Running the App

```sh
streamlit run app.py
```

---

## Sample Output

Listen to a generated audio sample: [gen_audio_from_photo.flac](./images/gen_audio_from_photo.flac)

---

## Repository

[github.com/uday-bkv/image-audio-hf-openai](https://github.com/uday-bkv/image-audio-hf-openai)