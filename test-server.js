import express from 'express';
import { analyzeUrl } from './backend/services/extractor.js';

const app = express();
app.use(express.json());

app.post('/test', async (req, res) => {
  try {
    const data = await analyzeUrl(req.body.url);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

app.listen(5001, () => {
  console.log('Test server on 5001');
});
