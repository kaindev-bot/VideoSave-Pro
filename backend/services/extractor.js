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

  // Platform-specific options
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
  const isTikTok = url.includes('tiktok.com');
  const isInstagram = url.includes('instagram.com');

  const options = {
    dumpJson: true,
    noWarnings: true,
    noCheckCertificate: true,
    preferFreeFormats: true,
    noPlaylist: true,
    forceIpv4: true,
    geoBypass: true,
  };

  // Set User-Agent and Headers based on platform
  if (isYouTube) {
    options.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
    options.referer = 'https://www.google.com/';
    options.extractorArgs = 'youtube:player-client=android,ios,web;player-skip=web_embedded_client_config';
  } else if (isTikTok) {
    // TikTok often prefers mobile user agents
    options.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1';
    options.referer = 'https://www.tiktok.com/';
    options.extractorArgs = 'tiktok:api_hostname=api16-normal-c-useast1a.tiktokv.com';
  } else if (isInstagram) {
    options.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
    options.referer = 'https://www.instagram.com/';
  } else {
    options.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
  }

  if (hasCookies) {
    options.cookies = cookiesPath;
    console.log('Using cookies.txt for extraction');
  }

  try {
    const output = await ytDlp(url, options);

    if (!output || !output.formats) {
      throw new Error('Could not find any formats for this video.');
    }

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
      formats: formats.slice(0, 20)
    };

    cache.set(url, result);
    return result;
  } catch (err) {
    console.error('Extraction error:', err.message);
    if (err.message.includes('Sign in to confirm you')) {
       throw new Error('Bloqueio do YouTube detectado. O IP do servidor foi sinalizado. É necessário fornecer o arquivo cookies.txt no projeto para continuar.');
    }
    throw err;
  }
}

export async function getDownloadStream(url, formatId) {
  const data = await analyzeUrl(url);
  const selectedFormat = formatId ? data.formats.find(f => f.format_id === formatId) : (data.formats.find(f => f.has_video && f.has_audio) || data.formats[0]);

  if (!selectedFormat) throw new Error('Format not found');

  const shouldProxy = data.platform?.toLowerCase() === 'youtube' || selectedFormat.url.includes('googlevideo.com') || data.platform?.toLowerCase() === 'tiktok';

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
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
  const isTikTok = url.includes('tiktok.com');

  const args = [
    url,
    '-f', formatId || 'best',
    '-o', '-',
    '--no-playlist',
    '--no-check-certificate',
    '--force-ipv4',
    '--geo-bypass',
  ];

  if (isYouTube) {
    args.push('--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
    args.push('--referer', 'https://www.google.com/');
    args.push('--extractor-args', 'youtube:player-client=android,ios,web;player-skip=web_embedded_client_config');
  } else if (isTikTok) {
    args.push('--user-agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1');
    args.push('--referer', 'https://www.tiktok.com/');
    args.push('--extractor-args', 'tiktok:api_hostname=api16-normal-c-useast1a.tiktokv.com');
  } else {
    args.push('--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
  }

  if (hasCookies) args.push('--cookies', cookiesPath);

  const ytProcess = spawn(binPath, args);

  ytProcess.on('error', (err) => {
    console.error('Failed to start yt-dlp process:', err);
    if (!res.headersSent) res.status(500).send('Error starting download process');
  });

  ytProcess.stdout.pipe(res);
  ytProcess.on('close', () => res.end());

  return ytProcess;
}
