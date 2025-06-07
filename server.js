import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());
app.use(express.static("public"));

function providerUrl(provider) {
  return provider === 'openrouter'
    ? 'https://openrouter.ai/api/v1/chat/completions'
    : 'https://api.openai.com/v1/chat/completions';
}

app.post('/ask', async (req, res) => {
  try {
    const { apiKey, provider, model, question, count } = req.body;
    if (!apiKey || !question || !model) {
      return res.status(400).json({ error: 'Missing parameters' });
    }
    const url = providerUrl(provider);

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    };

    const answers = [];
    for (let i = 0; i < (count || 10); i++) {
      const body = {
        model,
        messages: [{ role: 'user', content: question }],
      };
      const resp = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
      if (!resp.ok) {
        const text = await resp.text();
        return res.status(resp.status).json({ error: text });
      }
      const data = await resp.json();
      const answer = data.choices?.[0]?.message?.content || '';
      answers.push(answer.trim());
    }

    // Summarize consensus
    const summarizationPrompt = `Given the following answers, summarize any consensus and how strong it is:\n\n${answers.map((a,i)=>`${i+1}. ${a}`).join('\n')}\n`;
    const summaryBody = {
      model,
      messages: [
        { role: 'system', content: 'You summarize repeated answers.' },
        { role: 'user', content: summarizationPrompt },
      ],
    };
    const summaryResp = await fetch(url, { method: 'POST', headers, body: JSON.stringify(summaryBody) });
    let summary = '';
    if (summaryResp.ok) {
      const sdata = await summaryResp.json();
      summary = sdata.choices?.[0]?.message?.content || '';
    }

    res.json({ answers, summary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on ${port}`));
