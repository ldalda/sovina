import "server-only";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";

// Router de dois modelos:
// - Haiku 4.5 → respostas com persona (Roast, julgamento, conversas no chat).
//   Claude tem tom mais afiado e críveus a personagens autoritários.
// - GPT-4o-mini → extração estruturada (tool calling: gasto a partir de áudio,
//   categoria, valor, descrição). Mais barato, schema-following confiável.
//
// Custo mensal estimado pra 100 MAU ativos: ~R$30-50.

export const personaModel = anthropic("claude-haiku-4-5-20251001");

export const extractionModel = openai("gpt-4o-mini");

// Whisper pra transcrição de áudio do WhatsApp.
export const transcriptionModel = openai.transcription("whisper-1");
