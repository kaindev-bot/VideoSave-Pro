import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const binPath = path.join(__dirname, 'node_modules', 'yt-dlp-exec', 'bin', process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp');

console.log(`Checking yt-dlp at: ${binPath}`);

if (fs.existsSync(binPath)) {
    try {
      console.log('Attempting to update yt-dlp binary to latest NIGHTLY (for best compatibility)...');
      execSync(`"${binPath}" --update-to nightly`);
      console.log('yt-dlp nightly update completed.');
    } catch (nightlyError) {
      console.log('Nightly update failed, trying stable...');
      try {
        execSync(`"${binPath}" -U`);
        console.log('yt-dlp stable update completed.');
      } catch (stableError) {
        console.log('Update failed:', stableError.message);
      }
    }
} else {
  console.log('yt-dlp binary not found at expected path. It will be downloaded on first run or by npm install.');
}
