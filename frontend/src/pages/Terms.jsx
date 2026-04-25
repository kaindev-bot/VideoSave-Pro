export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="aero-glass p-8 md:p-12">
        <h1 className="text-4xl font-extrabold text-[#0b4b8a] aero-text-shadow mb-8 border-b-2 border-white/50 pb-4">
          Termos de Uso e Política de Privacidade
        </h1>
        
        <div className="space-y-8 text-[#1a365d] font-medium text-lg drop-shadow-sm">
          <section className="bg-white/40 p-6 rounded-2xl border border-white/60 shadow-inner">
            <h2 className="text-2xl font-bold text-[#0b4b8a] mb-4 drop-shadow-md">
              1. Aceitação dos Termos
            </h2>
            <p>
              Ao acessar e utilizar o VideoSave Pro, você concorda em cumprir e ficar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deve usar nosso serviço.
            </p>
          </section>

          <section className="bg-white/40 p-6 rounded-2xl border border-white/60 shadow-inner">
            <h2 className="text-2xl font-bold text-[#0b4b8a] mb-4 drop-shadow-md">
              2. Uso Permitido
            </h2>
            <p>
              O VideoSave Pro é uma ferramenta desenvolvida para permitir o download de conteúdo para uso pessoal, pesquisa ou conteúdo do qual você possui os direitos autorais. 
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2 marker:text-[#00b4ff]">
              <li>Você não deve usar o serviço para baixar conteúdo protegido por direitos autorais sem permissão.</li>
              <li>É estritamente proibido o uso comercial do conteúdo baixado.</li>
              <li>O serviço não deve ser utilizado para contornar mecanismos de DRM ou outras proteções.</li>
            </ul>
          </section>

          <section className="bg-white/40 p-6 rounded-2xl border border-white/60 shadow-inner">
            <h2 className="text-2xl font-bold text-[#0b4b8a] mb-4 drop-shadow-md">
              3. Isenção de Responsabilidade
            </h2>
            <p>
              O VideoSave Pro não hospeda, não possui e não transmite nenhum conteúdo protegido. Nós apenas fornecemos uma ferramenta técnica para processar links publicamente disponíveis na internet. Qualquer violação de direitos autorais resultante do uso de nossa ferramenta é de inteira responsabilidade do usuário.
            </p>
          </section>

          <section className="bg-white/40 p-6 rounded-2xl border border-white/60 shadow-inner">
            <h2 className="text-2xl font-bold text-[#0b4b8a] mb-4 drop-shadow-md">
              4. Privacidade
            </h2>
            <p>
              Nós respeitamos sua privacidade. Não armazenamos os vídeos que você baixa, nem mantemos registros permanentes associando seu IP ao conteúdo baixado. Utilizamos cache temporário (máximo de 1 hora) apenas para otimização de performance e redução de carga nos servidores.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
