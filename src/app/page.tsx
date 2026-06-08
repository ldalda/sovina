import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex-1 flex flex-col">
      <header className="border-b border-line px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-black tracking-tighter">SOVINA</span>
        <Link
          href="/login"
          className="text-sm border border-line px-3 py-1.5 hover:border-warning hover:text-warning transition-colors"
        >
          Entrar
        </Link>
      </header>

      <section className="flex-1 flex items-center px-6 py-20">
        <div className="max-w-3xl">
          <p className="text-warning text-xs uppercase tracking-[0.3em] mb-6">
            Gestor financeiro autoritário
          </p>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-[0.95] mb-8">
            Você não gere seu dinheiro.
            <br />
            <span className="text-warning">Você presta contas a ele.</span>
          </h1>
          <p className="text-dim text-lg leading-relaxed mb-10 max-w-2xl">
            O Sovina é a inteligência que decide o que você pode gastar — e o
            que não pode. Implacável, matemático, sem espaço pra desculpa. O
            aplicativo que dói na sua consciência hoje pra o limite do cartão
            não sangrar amanhã.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/login"
              className="bg-warning text-black px-6 py-3 font-bold tracking-tight hover:bg-warning/90 transition-colors"
            >
              Submeter-se ao julgamento →
            </Link>
            <a
              href="#como-funciona"
              className="border border-line px-6 py-3 font-bold tracking-tight hover:border-warning hover:text-warning transition-colors"
            >
              Ver como funciona
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-line px-6 py-4 text-xs text-subtle">
        SOVINA · Razão matemática sobre desejo · v0
      </footer>
    </main>
  );
}
