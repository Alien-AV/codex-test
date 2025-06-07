# Consensus App Design

## Overview
The app lets a user query an AI model multiple times with the same question,
collect the answers, and generate a short summary of the consensus and its
strength. It supports both OpenAI's API and the OpenRouter API (which mirrors
the OpenAI API scheme) so users can experiment with different models and
providers.

## Components
1. **Frontend** (static web page)
   - Form fields for API key, provider (OpenAI/OpenRouter), model name,
     question, and number of repetitions.
   - Fetches results from a backend endpoint and displays individual answers and
the consensus summary.

2. **Backend** (Node + Express)
   - `POST /ask` receives the API key, provider, model, question and the number
     of times to ask.
   - Calls the provider API repeatedly and stores each answer.
   - Calls the provider once more to summarise the list of answers (prompting the
     model to judge consensus and strength).
   - Returns the array of answers and the summary to the frontend.

## Deployment considerations
OpenAI's API does not allow CORS requests directly from the browser, so a pure
GitHub Pages site cannot call it without a server. The backend can be hosted on
a low‑maintenance platform such as Vercel, Deno Deploy or Cloudflare Workers.
The frontend (static files) can still live on GitHub Pages.

## First-phase POC
- Minimal Node/Express backend acting as a proxy and aggregation layer.
- Simple HTML+JS frontend.
- No persistence or authentication beyond the supplied API key.
- Summarisation uses the same provider/model as the main requests.
