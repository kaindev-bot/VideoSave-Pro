import express from 'express';
import { analyzeUrl, getDownloadStream } from '../services/extractor.js';

const router = express.Router();

// Route to get video metadata
router.post('/analyze', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const data = await analyzeUrl(url);
    res.json(data);
  } catch (error) {
    console.error('Error analyzing URL:', error.message);
    res.status(500).json({ error: error.message || 'Failed to analyze the provided URL.' });
  }
});

// Route to get actual download URL/stream (mocked/simplified for this setup)
router.post('/download', async (req, res) => {
  const { url, formatId } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const downloadData = await getDownloadStream(url, formatId);
    res.json(downloadData);
  } catch (error) {
    console.error('Error getting download info:', error.message);
    res.status(500).json({ error: error.message || 'Failed to process download.' });
  }
});

export default router;
