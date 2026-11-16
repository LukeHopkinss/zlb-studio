const express = require('express');
const path = require('node:path');
const { existsSync } = require('node:fs');
const cors = require('cors');
const { rateLimit } = require('express-rate-limit');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
app.disable('x-powered-by');
// Set only to the actual proxy hop count in your hosting environment.
if (process.env.TRUST_PROXY_HOPS) app.set('trust proxy', Number(process.env.TRUST_PROXY_HOPS));
const origins = (process.env.ALLOWED_ORIGINS || 'https://zlbstudio.com,https://www.zlbstudio.com,http://localhost:5173').split(',').map(value => value.trim());
app.use('/api/contact', (req, res, next) => {
  if (req.headers.origin && !origins.includes(req.headers.origin)) {
    return res.status(403).json({ success: false, error: 'Origin not allowed' });
  }
  next();
});
app.use(cors({ origin: origins }));
app.use('/api/contact', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, error: 'Too many messages. Please try again later.' },
}));
app.use(express.json({ limit: '16kb' }));
app.use('/api/contact', contactRoutes);
app.use('/api', (req, res) => res.status(404).json({ success: false, error: 'API route not found' }));
// A single Node deployment can serve both the built site and the contact API.
const frontendDist = path.resolve(__dirname, '../frontend/dist');
if (existsSync(path.join(frontendDist, 'index.html'))) {
  app.use(express.static(frontendDist));
  app.get('/{*splat}', (req, res) => res.sendFile(path.join(frontendDist, 'index.html')));
}

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err.type === 'entity.too.large' ? 413 : err.type === 'entity.parse.failed' ? 400 : 500;
  res.status(status).json({ success: false, error: status === 500 ? 'Request failed' : 'Invalid request body' });
});
module.exports = app;
