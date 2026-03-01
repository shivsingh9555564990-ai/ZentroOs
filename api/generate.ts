import type { VercelRequest, VercelResponse } from '@vercel/node';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: 'OPENROUTER_API_KEY not set in Vercel environment variables.',
    });
  }

  try {
    const { model, messages, max_tokens, temperature } = req.body || {};

    if (!model || !messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Missing model or messages.' });
    }

    const orRes = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://zentroos.app',
        'X-Title': 'ZentroOS',
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: max_tokens || 1000,
        temperature: temperature ?? 0.7,
        stream: false,
      }),
    });

    const rawText = await orRes.text();

    if (!orRes.ok) {
      let errMsg = `OpenRouter error ${orRes.status}`;
      try {
        const errData = JSON.parse(rawText);
        errMsg = errData?.error?.message || errData?.error || errMsg;
      } catch {}
      return res.status(orRes.status).json({ error: errMsg });
    }

    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      return res.status(502).json({ error: 'Invalid JSON from OpenRouter.' });
    }

    if (data.error) {
      return res.status(400).json({
        error: data.error.message || data.error.type || 'Model returned error.',
      });
    }

    // Try multiple response paths
    let content = '';

    // Path 1: Standard chat completion
    if (data.choices && data.choices.length > 0) {
      const choice = data.choices[0];
      // Path 1a: message.content (most common)
      if (choice.message && choice.message.content) {
        content = choice.message.content;
      }
      // Path 1b: text (completion format)
      else if (choice.text) {
        content = choice.text;
      }
      // Path 1c: delta.content (streaming leftover)
      else if (choice.delta && choice.delta.content) {
        content = choice.delta.content;
      }
    }

    // Path 2: Direct output field
    if (!content && data.output) {
      content = typeof data.output === 'string' ? data.output : JSON.stringify(data.output);
    }

    // Path 3: Direct response field
    if (!content && data.response) {
      content = typeof data.response === 'string' ? data.response : JSON.stringify(data.response);
    }

    content = (content || '').trim();

    if (!content) {
      return res.status(502).json({
        error: `Model "${model}" returned empty content. This model may not support chat. Try a different model.`,
        debug: JSON.stringify(data).slice(0, 300),
      });
    }

    return res.status(200).json({
      success: true,
      result: content,
      model: data.model || model,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error';
    return res.status(500).json({ error: message });
  }
}
