import ytDlp from 'yt-dlp-exec';
import NodeCache from 'node-cache';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const cache = new NodeCache({ stdTTL: 3600 }); // Cache metadata for 1 hour

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const binPath = path.join(__dirname, '..', 'node_modules', 'yt-dlp-exec', 'bin', process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp');

export async function analyzeUrl(url) {
  const cachedData = cache.get(url);
  if (cachedData) {
    return cachedData;
  }

  const cookiesPath = path.join(__dirname, '..', 'cookies.txt');
  const hasCookies = fs.existsSync(cookiesPath);

  const options = {
    dumpJson: true,
    noWarnings: true,
    noCheckCertificate: true,
    preferFreeFormats: true,
    noPlaylist: true,
    forceIpv4: true,
    geoBypass: true,
    addHeader: [
      'referer:https://www.google.com/',
      'user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-language:en-US,en;q=0.9',
    ]
  };

  // Add cookies if available
  if (hasCookies) {
    options.cookies = cookiesPath;
    console.log('Using cookies.txt for extraction');
  }

  // Specific flags for YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    options.extractorArgs = 'youtube:player-client=web,android;player-skip=web_embedded_client_config';
  }

  // Specific flags for TikTok
  if (url.includes('tiktok.com')) {
    options.addHeader.push('referer:https://www.tiktok.com/');
  }

  try {
    const output = await ytDlp(url, options);

    if (!output || !output.formats) {
      throw new Error('Could not find any formats for this video.');
    }

    // Filter and sort formats
    const formats = output.formats
      .filter(f => f.url && f.ext !== 'mhtml')
      .map(f => ({
        format_id: f.format_id,
        ext: f.ext,
        resolution: f.resolution || (f.height ? `${f.height}p` : 'audio only'),
        filesize: f.filesize || f.filesize_approx || null,
        url: f.url,
        has_video: f.vcodec !== 'none',
        has_audio: f.acodec !== 'none',
        protocol: f.protocol
      }))
      .sort((a, b) => {
        // Prefer formats with both video and audio
        if ((a.has_video && a.has_audio) && !(b.has_video && b.has_audio)) return -1;
        if (!(a.has_video && a.has_audio) && (b.has_video && b.has_audio)) return 1;
        return 0;
      });

    const result = {
      id: output.id,
      title: output.title,
      thumbnail: output.thumbnail,
      duration: output.duration,
      extractor: output.extractor,
      platform: output.extractor_key,
      formats: formats.slice(0, 20) // Limit to top 20 formats
    };

    cache.set(url, result);
    return result;
  } catch (err) {
    console.error('Extraction error:', err.message);
    throw err;
  }
}

export async function getDownloadStream(url, formatId) {
  const data = await analyzeUrl(url);
  
  let selectedFormat = null;
  if (formatId) {
     selectedFormat = data.formats.find(f => f.format_id === formatId);
  } else {
     selectedFormat = data.formats.find(f => f.has_video && f.has_audio) || data.formats[0]; 
  }

  if (!selectedFormat) {
    throw new Error('Format not found');
  }

  // Check if we should proxy (YouTube usually needs proxying for direct URLs)
  const shouldProxy = data.platform?.toLowerCase() === 'youtube' || selectedFormat.url.includes('googlevideo.com');

  return {
    downloadUrl: selectedFormat.url,
    title: data.title,
    ext: selectedFormat.ext,
    formatId: selectedFormat.format_id,
    shouldProxy: shouldProxy
  };
}

export function proxyStream(url, formatId, res) {
  const cookiesPath = path.join(__dirname, '..', 'cookies.txt');
  const hasCookies = fs.existsSync(cookiesPath);

  const args = [
    url,
    '-f', formatId || 'best',
    '-o', '-', // output to stdout
    '--no-playlist',
    '--no-check-certificate',
    '--force-ipv4',
    '--geo-bypass',
    '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
  ];

  if (hasCookies) {
    args.push('--cookies', cookiesPath);
  }

  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    args.push('--extractor-args', 'youtube:player-client=web,android;player-skip=web_embedded_client_config');
  }

  if (url.includes('tiktok.com')) {
    args.push('--add-header', 'referer:https://www.tiktok.com/');
  }

  console.log(`Starting proxy stream for ${url} with format ${formatId}`);
  
  const ytProcess = spawn(binPath, args);

  ytProcess.stdout.pipe(res);

  ytProcess.stderr.on('data', (data) => {
    // console.log(`yt-dlp stderr: ${data}`);
  });

  ytProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`yt-dlp process exited with code ${code}`);
      if (!res.headersSent) {
        res.status(500).send('Error streaming video');
      }
    }
    res.end();
  });

  return ytProcess;
}
