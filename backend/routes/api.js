import express from 'express';
import { analyzeUrl, getDownloadStream, proxyStream } from '../services/extractor.js';

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

// Route to get actual download URL/info
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

// New route for proxied download
router.get('/proxy-download', async (req, res) => {
  const { url, formatId, title, ext } = req.query;

  if (!url) {
    return res.status(400).send('URL is required');
  }

  try {
    // Set headers for file download
    const filename = `${title || 'video'}.${ext || 'mp4'}`;
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    proxyStream(url, formatId, res);
  } catch (error) {
    console.error('Proxy download error:', error.message);
    if (!res.headersSent) {
      res.status(500).send('Failed to start download stream.');
    }
  }
});

export default router;
