# Consensus App POC

This repository contains a small proof of concept for querying an AI model
multiple times and summarising the consensus among the answers.

## Running locally
1. Install Node.js (18+).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Open `http://localhost:3000` in your browser.

Enter your API key, provider, model, question and how many times to ask. The
app will display each answer and a summary of the consensus.
