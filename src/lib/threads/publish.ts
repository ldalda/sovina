import "server-only";

// Publicação na Threads API (Meta) — fluxo de 2 passos: criar o container e
// publicá-lo. App em modo de desenvolvimento com a conta como Threads Tester
// não exige app review para postar na própria conta.
//
// Env: THREADS_USER_ID (id numérico) e THREADS_ACCESS_TOKEN (long-lived, 60d).

const GRAPH = "https://graph.threads.net/v1.0";

type GraphResponse = { id?: string; error?: { message?: string } };

async function graphPost(
  path: string,
  params: Record<string, string>,
): Promise<string> {
  const res = await fetch(`${GRAPH}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      ...params,
      access_token: process.env.THREADS_ACCESS_TOKEN!,
    }),
  });
  const json = (await res.json().catch(() => ({}))) as GraphResponse;
  if (!res.ok || !json.id) {
    throw new Error(
      json.error?.message ?? `Threads API ${res.status} em ${path}`,
    );
  }
  return json.id;
}

/** Publica um post de texto e devolve o id do post no Threads. */
export async function publishTextPost(text: string): Promise<string> {
  const uid = process.env.THREADS_USER_ID;
  if (!uid || !process.env.THREADS_ACCESS_TOKEN) {
    throw new Error("THREADS_USER_ID/THREADS_ACCESS_TOKEN não configurados.");
  }
  const containerId = await graphPost(`/${uid}/threads`, {
    media_type: "TEXT",
    text,
  });
  return graphPost(`/${uid}/threads_publish`, { creation_id: containerId });
}
