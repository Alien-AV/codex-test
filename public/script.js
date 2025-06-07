const form = document.getElementById('ask-form');
const output = document.getElementById('output');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  output.textContent = 'Querying...';
  const body = {
    apiKey: document.getElementById('apiKey').value,
    provider: document.getElementById('provider').value,
    model: document.getElementById('model').value,
    question: document.getElementById('question').value,
    count: parseInt(document.getElementById('count').value, 10)
  };

  const res = await fetch('/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const t = await res.text();
    output.textContent = 'Error: ' + t;
    return;
  }

  const data = await res.json();
  output.textContent = data.answers.map((a,i)=>`Answer ${i+1}: ${a}`).join('\n\n') +
    '\n\nConsensus Summary:\n' + data.summary;
});
