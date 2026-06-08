# SOVINA

> Você não gere seu dinheiro. Você presta contas a ele.

Gestor financeiro pessoal governado por uma IA autoritária. Ingestão de gastos via WhatsApp + áudio, leitura de fatura PDF, gamificação por disciplina diária, e a palavra final sempre vem do Sovina.

## Stack

- **Next.js 16** (App Router, Turbopack, PWA)
- **React 19**
- **Tailwind 4** (estética brutalista: preto/amarelo/vermelho, fonte mono)
- **Supabase** — Postgres + Auth (magic link) + RLS + Storage
- **Vercel AI SDK v6** com router de dois modelos:
  - **Claude Haiku 4.5** para persona (respostas com tom autoritário)
  - **GPT-4o-mini** para extração estruturada (tool calling de gastos)
- **Whisper** (OpenAI) para transcrição de áudio do WhatsApp
- **Evolution API** para WhatsApp inbound/outbound
- **Stripe** Checkout + Webhooks (plano Pro R$29,90/mês)
- **Vercel** deploy (Fluid Compute)

## Setup

```bash
cp .env.example .env.local
# preencher as 11 envs

npm install
npm run dev
```

## Estrutura

```
src/
├── app/
│   ├── (auth)/          login, callback (magic link)
│   ├── api/
│   │   ├── stripe/webhook/      assinatura → libera Pro
│   │   └── whatsapp/inbound/    Evolution API entrega áudio/texto
│   └── page.tsx         landing pública
├── lib/
│   ├── supabase/        client (browser), server (RSC), service (bypass RLS)
│   ├── ai/              router de modelos + persona system prompt
│   └── stripe/          cliente reutilizado
└── middleware.ts        refresh de sessão Supabase
```

## Posicionamento

- **Free**: dashboard manual, 30 lançamentos/mês, sem WhatsApp, Sovina mudo
- **Pro R$29,90/mês**: WhatsApp ilimitado, leitura PDF ilimitada, Modo Roast ativo

## Persona

Detalhes do system prompt em `src/lib/ai/persona.ts`. Regras críticas:
- Português brasileiro, frases curtas, verbos diretos
- Sem emojis, sem "talvez", sem condescendência
- Razão matemática como única bússola
- Pode usar metáforas felinas com parcimônia

## Decisões

- **Por que mono em vez de sans?** Números tabulares + estética de planilha financeira reforça a tese "razão matemática sobre desejo".
- **Por que dois modelos LLM?** Haiku tem tom autoritário mais crível; GPT-4o-mini é 7x mais barato pra tool calling estruturado.
- **Por que sem shadcn?** Estética brutalista quer atrito visual. Componentes shadcn são clean e suaves demais.
