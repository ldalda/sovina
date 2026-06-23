import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade — O Sovina",
  description:
    "Como o Sovina coleta, usa, protege e compartilha seus dados. Conformidade com a LGPD.",
};

const ATUALIZADO = "22 de junho de 2026";

export default function PrivacidadePage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-fg">
      <Link
        href="/"
        className="text-subtle text-xs uppercase tracking-[0.3em] hover:text-fg"
      >
        ← Voltar
      </Link>

      <h1 className="font-display text-3xl uppercase mt-6 mb-2">
        Política de Privacidade
      </h1>
      <p className="text-dim text-sm mb-10">
        Última atualização: {ATUALIZADO}. Esta é a parte séria — sem ironia.
        Aqui o Sovina explica, em linguagem direta, o que faz com os seus dados,
        em conformidade com a Lei Geral de Proteção de Dados (LGPD, Lei
        13.709/2018).
      </p>

      <Secao titulo="1. Quem é o controlador">
        O Sovina é o controlador dos dados tratados neste serviço. Para qualquer
        questão de privacidade ou para exercer seus direitos, fale pelo e-mail de
        contato informado no app.
      </Secao>

      <Secao titulo="2. Dados que coletamos">
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>E-mail</strong> — na lista de espera e no cadastro (via
            autenticação por link mágico). Finalidade: avisar do lançamento,
            autenticar e comunicar sobre o serviço.
          </li>
          <li>
            <strong>Dados financeiros que você declara</strong> — gastos
            (valor, descrição, categoria), renda, custos fixos, metas de reserva
            e apelido/limite de cartões. Finalidade: prestar o serviço de
            controle financeiro e gerar os vereditos.
          </li>
        </ul>
        <p className="mt-3">
          <strong>O que NÃO coletamos:</strong> não pedimos CPF, telefone nem
          endereço. Não armazenamos número de cartão, CVV nem credenciais
          bancárias — o Sovina não se conecta à sua conta bancária. Você declara
          os gastos manualmente; é o registro que importa.
        </p>
      </Secao>

      <Secao titulo="3. Base legal e consentimento">
        Tratamos a lista de espera com base no seu consentimento (ao submeter o
        e-mail) e os dados do serviço com base na execução do contrato (prestar a
        funcionalidade que você pediu) e no seu consentimento no onboarding. Você
        pode revogar o consentimento a qualquer momento, encerrando a conta.
      </Secao>

      <Secao titulo="4. Inteligência artificial e sub-processadores">
        Para gerar os vereditos e interpretar o que você registra, trechos do que
        você declara (por exemplo, a descrição de um gasto) são enviados a
        provedores de IA. Usamos os seguintes operadores/sub-processadores:
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>
            <strong>Anthropic</strong> e <strong>OpenAI</strong> (EUA) —
            processamento de linguagem para os vereditos e a leitura de
            lançamentos.
          </li>
          <li>
            <strong>Supabase</strong> — banco de dados e autenticação.
          </li>
          <li>
            <strong>Vercel</strong> — hospedagem da aplicação.
          </li>
          <li>
            <strong>Resend</strong> — envio de e-mails transacionais.
          </li>
          <li>
            <strong>Meta (Threads)</strong> — apenas conteúdo público de
            marketing; não recebe seus dados pessoais.
          </li>
        </ul>
        <p className="mt-3">
          <strong>Transferência internacional:</strong> alguns desses provedores
          processam dados fora do Brasil (ex.: EUA). Enviamos o mínimo necessário
          para a função e adotamos provedores com compromissos de proteção de
          dados. Não vendemos nem compartilhamos seus dados para publicidade.
        </p>
      </Secao>

      <Secao titulo="5. Segurança">
        Seus dados são isolados por usuário no banco (cada pessoa só acessa os
        próprios registros), com criptografia em trânsito (TLS) e em repouso. O
        acesso amplo é restrito a rotinas internas do servidor.
      </Secao>

      <Secao titulo="6. Retenção e exclusão">
        Mantemos seus dados enquanto sua conta existir. Ao encerrar a conta, os
        dados pessoais e financeiros associados são apagados em cascata do nosso
        banco. Você pode solicitar a exclusão a qualquer momento.
      </Secao>

      <Secao titulo="7. Seus direitos (LGPD, art. 18)">
        Você tem direito a acessar, corrigir, exportar e excluir seus dados, além
        de revogar consentimento. A maior parte é feita direto no app (você vê e
        edita seus registros); para exclusão total ou portabilidade, use o
        contato de privacidade.
      </Secao>

      <Secao titulo="8. Alterações">
        Esta política pode ser atualizada. Mudanças relevantes serão comunicadas
        pelos canais do serviço, com a data de atualização revista no topo.
      </Secao>

      <p className="text-subtle text-xs mt-10">
        O Sovina julga seus gastos. Seus dados, ele protege.
      </p>
    </main>
  );
}

function Secao({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h2 className="font-display text-lg uppercase tracking-wide mb-2">
        {titulo}
      </h2>
      <div className="text-dim text-sm leading-relaxed">{children}</div>
    </section>
  );
}
