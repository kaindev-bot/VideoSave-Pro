import { analyzeUrl } from './backend/services/extractor.js';

async function test() {
  try {
    const data = await analyzeUrl('https://www.tiktok.com/@tiktok/video/7106594312292453675');
    console.log("TIKTOK DATA:", data.id ? "OK" : data);
  } catch (err) {
    console.error("TIKTOK ERROR:", err.message);
  }
}
test();
