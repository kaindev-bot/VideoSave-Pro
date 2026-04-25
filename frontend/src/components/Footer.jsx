import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full aero-glass rounded-none border-b-0 border-x-0 border-t border-white/50 py-8 mt-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-[#0b4b8a] font-medium aero-text-shadow text-sm">
          &copy; {new Date().getFullYear()} VideoSave Pro. Todos os direitos reservados.
        </div>
        
        <div className="flex gap-6 text-sm">
          <Link to="/terms" className="text-[#0b4b8a] hover:text-[#00b4ff] font-bold aero-text-shadow transition-colors">
            Termos de Uso & Privacidade
          </Link>
          <a href="#" className="text-[#0b4b8a] hover:text-[#00b4ff] font-bold aero-text-shadow transition-colors">
            Contato
          </a>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-6 text-center text-xs text-[#1a365d] max-w-2xl font-medium drop-shadow-sm">
        Aviso: Esta ferramenta destina-se apenas ao download de conteúdo para o qual você possui os direitos autorais ou permissão explícita do criador. Não apoiamos a pirataria ou a violação de direitos autorais de qualquer plataforma.
      </div>
    </footer>
  );
}
