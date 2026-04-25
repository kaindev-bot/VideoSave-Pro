# VideoSave Pro

Um sistema completo (Frontend + Backend) para download de vídeos de múltiplas plataformas (YouTube, TikTok, Instagram, etc) utilizando Node.js, Express, React, Vite e TailwindCSS.

## Requisitos

- Node.js (v18+)
- Python (necessário para o yt-dlp executar internamente, embora o wrapper tente contornar quando possível)

## Estrutura do Projeto

- `/frontend`: Aplicação em React + Vite.
- `/backend`: API em Express que gerencia a extração via `yt-dlp`.

## Como Rodar Localmente

### 1. Backend

Abra um terminal e execute:
```bash
cd backend
npm install
npm run dev
```
O servidor rodará em `http://localhost:5000`.

### 2. Frontend

Abra um novo terminal e execute:
```bash
cd frontend
npm install
npm run dev
```
Acesse o aplicativo pelo link gerado pelo Vite (geralmente `http://localhost:5173`).

## Deploy

**Frontend (Vercel ou Netlify):**
1. Conecte o repositório.
2. Defina o diretório raiz como `frontend`.
3. Comando de build: `npm run build`
4. Diretório de saída: `dist`

**Backend (Render, Railway, Heroku):**
1. Crie um Web Service apontando para o diretório `backend`.
2. Comando de start: `npm start`
3. Certifique-se de que o ambiente de hospedagem permita a execução do binário do `yt-dlp` (a maioria dos ambientes Linux Node.js padrão funciona perfeitamente, mas se estiver usando Docker, instale o Python e FFmpeg).

## Aviso Legal

Este projeto deve ser usado apenas para fins educacionais ou para baixar conteúdo do qual você possui permissão explícita. Não nos responsabilizamos pelo mau uso.
