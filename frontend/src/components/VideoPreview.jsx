import { motion } from 'framer-motion';
import { Download, Film, Music, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

export default function VideoPreview({ data, originalUrl }) {
  const [downloadingId, setDownloadingId] = useState(null);

  const formatDuration = (seconds) => {
    if (!seconds) return 'Desconhecido';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleDownload = async (formatId) => {
    setDownloadingId(formatId);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${apiUrl}/api/download`, {
        url: originalUrl,
        formatId: formatId
      });

      const { downloadUrl, title, ext } = res.data;

      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${title}.${ext}`;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    } catch (error) {
      alert('Erro ao iniciar o download. Tente novamente.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="aero-glass p-6 md:p-8 flex flex-col lg:flex-row gap-8">
      {/* Thumbnail */}
      <div className="lg:w-1/3 flex-shrink-0 relative overflow-hidden rounded-2xl group border-4 border-white/80 shadow-lg bg-white">
        <img
          src={data.thumbnail}
          alt={data.title}
          className="w-full h-auto object-cover aspect-video group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-md text-white text-sm px-3 py-1 rounded-full font-bold shadow-md border border-white/30">
          {formatDuration(data.duration)}
        </div>
      </div>

      {/* Info & Formats */}
      <div className="flex-grow flex flex-col">
        <div className="mb-6">
          <h2 className="text-3xl font-extrabold text-[#0b4b8a] aero-text-shadow mb-3 line-clamp-2">
            {data.title}
          </h2>
          <div className="flex items-center gap-3 text-sm text-[#1a365d] font-bold">
            <span className="capitalize bg-white/70 backdrop-blur-md border border-white px-4 py-1.5 rounded-full shadow-sm drop-shadow-sm">
              {data.platform}
            </span>
          </div>
        </div>

        <h3 className="font-extrabold text-xl text-[#0b4b8a] aero-text-shadow mb-4 flex items-center gap-2">
          <Download className="w-6 h-6 text-[#00b4ff] drop-shadow-sm" />
          Opções de Download
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          {data.formats.slice(0, 8).map((format) => (
            <button
              key={format.format_id}
              onClick={() => handleDownload(format.format_id)}
              disabled={downloadingId === format.format_id}
              className="aero-button flex items-center justify-between p-3 text-left disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full shadow-inner ${format.has_video ? 'bg-blue-900/20 text-white' : 'bg-green-900/20 text-white'}`}>
                  {format.has_video ? <Film className="w-5 h-5 drop-shadow-md" /> : <Music className="w-5 h-5 drop-shadow-md" />}
                </div>
                <div>
                  <div className="font-bold text-white text-base drop-shadow-md">
                    {format.resolution === 'audio only' ? 'Apenas Áudio' : format.resolution}
                  </div>
                  <div className="text-xs text-white/90 font-medium drop-shadow-sm">
                    {format.ext.toUpperCase()} • {format.filesize ? (format.filesize / 1024 / 1024).toFixed(1) + ' MB' : 'Tam. Desconhecido'}
                  </div>
                </div>
              </div>

              {downloadingId === format.format_id ? (
                <div className="loader-spinner" />
              ) : (
                <CheckCircle className="w-6 h-6 text-white drop-shadow-md" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
