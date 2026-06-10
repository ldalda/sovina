import "server-only";

// Busca pública por palavra-chave na Threads API (escopo threads_keyword_search).
// search_type TOP = ranking de popularidade da própria Meta — nosso proxy de
// engajamento, já que a API não expõe views de posts alheios.
// Limite da API: 2.200 consultas/24h (usamos ~12/dia).

const GRAPH = "https://graph.threads.net/v1.0";

export interface FoundPost {
  id: string;
  text?: string;
  username?: string;
  permalink?: string;
  timestamp?: string;
  is_reply?: boolean;
}

export async function keywordSearch(q: string): Promise<FoundPost[]> {
  const params = new URLSearchParams({
    q,
    search_type: "TOP",
    fields: "id,text,username,permalink,timestamp,is_reply",
    access_token: process.env.THREADS_ACCESS_TOKEN!,
  });
  const res = await fetch(`${GRAPH}/keyword_search?${params}`);
  const json = (await res.json().catch(() => ({}))) as {
    data?: FoundPost[];
    error?: { message?: string };
  };
  if (!res.ok || json.error) {
    throw new Error(json.error?.message ?? `keyword_search ${res.status}`);
  }
  return json.data ?? [];
}
