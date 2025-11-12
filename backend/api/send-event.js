// backend/api/send-event.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
const crypto = require('crypto');

dotenv.config();
const app = express();

// --- CORS ---
const allowedOrigin = 'https://zero7.com.br/home'; // ajuste se tiver www ou outro domínio
app.use(cors({
  origin: allowedOrigin,
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: false
}));

app.use(express.json({ limit: '1mb' }));

// (Opcional) health check rápido
app.get('/api/send-event', (_req, res) => res.status(200).send('OK'));

// Helper para remover null/undefined
function compact(obj) {
  const out = {};
  Object.keys(obj || {}).forEach(k => {
    const v = obj[k];
    if (v === undefined || v === null) return;
    if (typeof v === 'object' && !Array.isArray(v)) {
      const nested = compact(v);
      if (Object.keys(nested).length) out[k] = nested;
    } else if (Array.isArray(v)) {
      const arr = v.filter(x => x !== null && x !== undefined);
      if (arr.length) out[k] = arr;
    } else {
      out[k] = v;
    }
  });
  return out;
}

app.post('/api/send-event', async (req, res) => {
  try {
    const { event_name, event_id, fbc, fbp, email } = req.body || {};

    // Segurança: defaults mínimos
    const safeEventName = event_name || 'PageView';
    const safeEventId = event_id || ('_' + Math.random().toString(36).slice(2, 11));

    // Hash do e-mail (fallback obrigatório p/ user_data)
    const hashedEmail = crypto
      .createHash('sha256')
      .update((email || 'fallback@anonimo.com').trim().toLowerCase())
      .digest('hex');

    // IP e User-Agent do visitante (Vercel coloca em x-forwarded-for)
    const clientIp =
      (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
      req.socket?.remoteAddress ||
      null;

    const userAgent = req.headers['user-agent'] || null;

    // URL de origem do evento (página que disparou)
    const referer = req.headers['referer'] || 'https://zero7.com.br/home';

    // Monta user_data compactado (sem null/undefined)
    const user_data = compact({
      em: [hashedEmail],
      fbc: fbc || null,
      fbp: fbp || null,
      client_ip_address: clientIp,
      client_user_agent: userAgent
    });

    const payload = compact({
      event_name: safeEventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: safeEventId,
      event_source_url: referer,
      action_source: 'website',
      user_data
    });

    // Logs de debug
    console.log('➡️  Enviando para FB', {
      event_name: payload.event_name,
      event_id: payload.event_id,
      event_source_url: payload.event_source_url,
      hasFbc: !!fbc,
      hasFbp: !!fbp,
      hasIp: !!clientIp,
      hasUA: !!userAgent
    });

    const url = `https://graph.facebook.com/v19.0/${process.env.FACEBOOK_PIXEL_ID}/events`;

    const fbResp = await axios.post(
      url,
      { data: [payload], access_token: process.env.FACEBOOK_ACCESS_TOKEN },
      { timeout: 10000 }
    );

    console.log('✅ Evento enviado com sucesso:', fbResp.data);
    res.status(200).json({ success: true, fb: fbResp.data });
  } catch (err) {
    const data = err?.response?.data;
    console.error('❌ Erro ao enviar evento:', data || err.message);
    res.status(500).json({ success: false, error: data || err.message });
  }
});

module.exports = app;
