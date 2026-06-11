import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/service";
import {
  approveReply,
  skipReply,
  MAX_REPLIES_PER_DAY,
} from "@/lib/threads/reply-actions";
import { Button } from "@/components/ui/button";

// Tribunal — fila de aprovação dos replies do Sovina. Protegida por ?key= que
// bate com ADMIN_KEY (chave longa). Sem a chave correta: 404 (não vaza que
// existe). Mobile-first: feita pra aprovar do celular.
export const dynamic = "force-dynamic";

function authed(key: string | undefined): boolean {
  return Boolean(process.env.ADMIN_KEY) && key === process.env.ADMIN_KEY;
}

// Fora do render: a regra de pureza do React proíbe Date.now() no corpo do componente.
function since24hAgo(): string {
  return new Date(Date.now() - 24 * 3600_000).toISOString();
}

async function decide(formData: FormData) {
  "use server";
  if (!authed(String(formData.get("key")))) return;
  const id = String(formData.get("id"));
  const action = String(formData.get("action"));
  if (action === "approve") await approveReply(id);
  else if (action === "skip") await skipReply(id);
  revalidatePath("/admin/replies");
}

export default async function AdminRepliesPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;
  if (!authed(key)) notFound();

  const supabase = createServiceClient();
  const { data: drafts } = await supabase
    .from("threads_reply_queue")
    .select("*")
    .eq("status", "draft")
    .order("created_at");
  const { count: postedToday } = await supabase
    .from("threads_reply_queue")
    .select("*", { count: "exact", head: true })
    .eq("status", "posted")
    .gte("posted_at", since24hAgo());

  const list = drafts ?? [];

  return (
    <main className="min-h-full px-4 py-8 max-w-xl mx-auto w-full">
      <p className="text-solar text-xs uppercase tracking-[0.3em] mb-1">
        O Tribunal
      </p>
      <h1 className="font-display text-3xl uppercase mb-1">
        Vereditos pendentes
      </h1>
      <p className="text-dim text-sm mb-8">
        {list.length} na fila · {postedToday ?? 0}/{MAX_REPLIES_PER_DAY} postados
        nas últimas 24h
      </p>

      {list.length === 0 && (
        <p className="text-subtle text-sm border border-line p-6">
          Nada a julgar agora. O radar volta a caçar nos próximos horários.
        </p>
      )}

      <div className="flex flex-col gap-5">
        {list.map((d) => (
          <article key={d.id} className="border border-line bg-concreto/20 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-fg text-sm font-bold">
                @{d.target_username}
              </span>
              <span className="text-subtle text-xs uppercase tracking-[0.15em]">
                {d.keyword}
              </span>
            </div>

            <p className="text-dim text-sm leading-relaxed mb-1">
              {d.target_text}
            </p>
            {d.target_permalink && (
              <a
                href={d.target_permalink}
                target="_blank"
                rel="noreferrer"
                className="text-subtle text-xs underline hover:text-fg"
              >
                ver post original ↗
              </a>
            )}

            <div className="border-l-2 border-solar pl-3 my-4">
              <p className="text-subtle text-[10px] uppercase tracking-[0.2em] mb-1">
                Rascunho do Sovina
              </p>
              <p className="text-fg text-sm leading-relaxed">{d.draft}</p>
            </div>

            <div className="flex gap-3">
              <form action={decide} className="flex-1">
                <input type="hidden" name="key" value={key} />
                <input type="hidden" name="id" value={d.id} />
                <input type="hidden" name="action" value="approve" />
                <Button type="submit" className="w-full font-bold">
                  Aprovar
                </Button>
              </form>
              <form action={decide} className="flex-1">
                <input type="hidden" name="key" value={key} />
                <input type="hidden" name="id" value={d.id} />
                <input type="hidden" name="action" value="skip" />
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full text-dim"
                >
                  Pular
                </Button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
