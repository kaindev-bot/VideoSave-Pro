import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import VideoPreview from '../components/VideoPreview';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [videoData, setVideoData] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setVideoData(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${apiUrl}/api/analyze`, { url });
      setVideoData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao analisar o link. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mb-12"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold aero-title-shadow mb-6 tracking-tight">
          Baixe Vídeos com a <span className="text-[#00b4ff]">Melhor Qualidade</span>
        </h1>
        <p className="text-xl md:text-2xl text-[#0b4b8a] aero-text-shadow font-semibold mb-8">
          Cole o link de plataformas como YouTube, TikTok, Instagram e baixe em instantes. Rápido, seguro e sem marca d'água.
        </p>

        {/* Input Form */}
        <form onSubmit={handleAnalyze} className="relative w-full max-w-2xl mx-auto">
          <div className="relative flex items-center aero-glass p-2 transition-all">
            <Search className="absolute left-4 text-[#00b4ff] w-7 h-7 drop-shadow-sm" />
            <input
              type="url"
              required
              placeholder="Cole o link do vídeo aqui..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full pl-14 pr-4 py-4 bg-white/50 backdrop-blur-sm rounded-xl outline-none text-[#0b4b8a] placeholder:text-[#0b4b8a]/60 text-xl font-medium shadow-inner border border-white/50 focus:bg-white/80 transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="aero-button ml-2 px-8 py-4 text-xl font-bold transition-all disabled:opacity-70 flex items-center gap-2 h-[60px]"
            >
              {loading ? <div className="loader-spinner" /> : 'Analisar'}
            </button>
          </div>
        </form>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 text-[#d9381e] bg-white/60 backdrop-blur-md p-4 rounded-xl flex items-center justify-center gap-2 border border-red-300 shadow-md font-bold"
            >
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Video Preview & Download Options */}
      <AnimatePresence>
        {videoData && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-4xl"
          >
            <VideoPreview data={videoData} originalUrl={url} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* AdSpace Placeholder */}
      <div className="mt-16 w-full max-w-4xl h-24 aero-glass flex items-center justify-center text-[#0b4b8a] font-bold text-lg aero-text-shadow">

      </div>
    </div>
  );
}
