import { Link } from 'react-router-dom';
import { DownloadCloud, Crown } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full aero-glass rounded-none border-t-0 border-x-0 border-b border-white/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="aero-button px-2 py-1 flex items-center justify-center shadow-md">
            <DownloadCloud className="w-6 h-6 text-white drop-shadow-md" />
          </div>
          <span className="text-2xl font-extrabold aero-title-shadow tracking-tight">
            VideoSave Pro
          </span>
        </Link>
        
        <nav className="hidden md:flex gap-6 items-center">
          <Link to="/" className="text-[#0b4b8a] hover:text-[#00b4ff] font-bold text-lg aero-text-shadow transition-colors">
            Início
          </Link>
          <a href="#features" className="text-[#0b4b8a] hover:text-[#00b4ff] font-bold text-lg aero-text-shadow transition-colors">
            Recursos
          </a>
        </nav>
      </div>
    </header>
  );
}
