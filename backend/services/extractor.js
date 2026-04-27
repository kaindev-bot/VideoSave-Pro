import ytDlp from 'yt-dlp-exec';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 }); // Cache metadata for 1 hour

export async function analyzeUrl(url) {
  const cachedData = cache.get(url);
  if (cachedData) {
    return cachedData;
  }

  try {
    const output = await ytDlp(url, {
      dumpJson: true,
      noWarnings: true,
      noCheckCertificate: true,
      preferFreeFormats: true,
      noPlaylist: true,
      addHeader: [
        'referer:https://www.google.com/',
        'user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-language:en-US,en;q=0.9',
        'sec-ch-ua:"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
        'sec-ch-ua-mobile:?0',
        'sec-ch-ua-platform:"Windows"',
        'sec-fetch-dest:document',
        'sec-fetch-mode:navigate',
        'sec-fetch-site:none',
        'sec-fetch-user:?1',
        'upgrade-insecure-requests:1'
      ]
    });

    const formats = output.formats
      .filter(f => f.url && f.ext !== 'mhtml') // filter out weird formats
      .map(f => ({
        format_id: f.format_id,
        ext: f.ext,
        resolution: f.resolution || 'audio only',
        filesize: f.filesize,
        url: f.url,
        has_video: f.vcodec !== 'none',
        has_audio: f.acodec !== 'none'
      }));

    const result = {
      id: output.id,
      title: output.title,
      thumbnail: output.thumbnail,
      duration: output.duration,
      extractor: output.extractor,
      platform: output.extractor_key,
      formats: formats
    };

    cache.set(url, result);
    return result;
  } catch (err) {
    throw err;
  }
}

export async function getDownloadStream(url, formatId) {
  // Usually, the direct url is inside the formats array.
  // We re-fetch to ensure the URL hasn't expired.
  const data = await analyzeUrl(url);
  
  let selectedFormat = null;
  if (formatId) {
     selectedFormat = data.formats.find(f => f.format_id === formatId);
  } else {
     // fallback to a good default
     selectedFormat = data.formats.find(f => f.has_video && f.has_audio) || data.formats[0]; 
  }

  if (!selectedFormat) {
    throw new Error('Format not found');
  }

  return {
    downloadUrl: selectedFormat.url,
    title: data.title,
    ext: selectedFormat.ext
  };
}
