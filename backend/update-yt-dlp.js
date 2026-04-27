import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const binPath = path.join(__dirname, 'node_modules', 'yt-dlp-exec', 'bin', process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp');

console.log(`Checking yt-dlp at: ${binPath}`);

if (fs.existsSync(binPath)) {
  try {
    console.log('Attempting to update yt-dlp binary...');
    execSync(`"${binPath}" -U`);
    console.log('yt-dlp update check completed.');
  } catch (error) {
    console.log('yt-dlp update failed or not needed:', error.message);
  }
} else {
  console.log('yt-dlp binary not found at expected path. It will be downloaded on first run or by npm install.');
}
