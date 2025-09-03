// /api/proxy.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const apiUrl = 'https://your-bo-api.example.com/data'; // replace with your API
  const response = await fetch(apiUrl, {
    method: req.method,
    headers: { 'Content-Type': 'application/json' },
    body: req.method !== 'GET' ? req.body : undefined
  });

  const data = await response.json();

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  res.status(200).json(data);
}
