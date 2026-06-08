"use client";

import { useCallback, useEffect, useState } from "react";

export type SaveStatus = "idle" | "saving" | "saved";

// Feedback de autosave compartilhado: "Salvando…" enquanto grava, "Salvo ✓"
// ao concluir (some sozinho). Envolva a action com `track`.
export function useSaveStatus() {
  const [status, setStatus] = useState<SaveStatus>("idle");

  useEffect(() => {
    if (status !== "saved") return;
    const t = setTimeout(() => setStatus("idle"), 1800);
    return () => clearTimeout(t);
  }, [status]);

  const track = useCallback((fn: () => Promise<unknown>) => {
    setStatus("saving");
    return fn().then(
      () => setStatus("saved"),
      () => setStatus("idle"),
    );
  }, []);

  return { status, track };
}

export function SaveIndicator({ status }: { status: SaveStatus }) {
  return (
    <span className="inline-flex items-center h-5 text-xs">
      {status === "saving" && <span className="text-subtle">Salvando…</span>}
      {status === "saved" && <span className="text-solar">Salvo ✓</span>}
    </span>
  );
}
