# Análise de Mercado — Sovina (2026)

> Data: 22/06/2026. Fontes: EXA (panorama de mercado e imprensa) + Apify
> (reviews reais do Google Play, ordenadas por mais recentes). Foco: mobile.
> Decisão estratégica vigente: beta grátis 01/07, competir por **persona + nicho**
> (o juiz implacável), não por features. Ver [posicionamento.md](posicionamento.md).

---

## 1. O mercado se reorganizou em 3 categorias

| Categoria | Players | Proposta | Atrito de registro |
|-----------|---------|----------|--------------------|
| **Apps tradicionais** | Mobills (7-10M+ downloads), Organizze, Minhas Economias | Robustez, relatórios, Open Finance no plano pago | Alto (30-45s/lançamento manual) |
| **Open Finance + IA** | **Pierre** (CloudWalk), Guiabolso (descontinuado→PicPay), Jota | Sincroniza banco, IA "faz o trabalho pesado" | Zero — mas exige dar acesso ao banco |
| **Assistentes no WhatsApp** ⚡ | ZapGastos, Financinha, FinAI, POQT, MeuAssessor, **Graniq** | Registro por texto/áudio/foto no canal que o BR já abre | Baixíssimo (3-5s) |

**Tendência macro confirmada (Exame, fintech 2026):** consolidação da "interface
invisível" — *"a voz é o novo teclado"*. Soluções conversacionais saem de canal
alternativo para o centro da relação. A categoria WhatsApp foi a que mais cresceu
nos últimos 2 anos.

**Implicação para o Sovina:**
- A 2ª porta planejada (ingestão por WhatsApp) está no vetor certo de mercado.
- **MAS o espaço WhatsApp já está lotado** (6+ concorrentes nominais). O que
  ninguém ali tem é o **tom de juiz** — segue sendo o único fosso real.
- Graniq faz SEO agressivo se posicionando como "registro por chat 3-5s, plano
  grátis mais funcional". É o que mais se aproxima da mecânica do Sovina (sem o tom).

---

## 2. A descoberta central: os líderes de Open Finance estão sangrando AGORA

Cruzando reviews recentes (junho/2026) do Google Play, a nota oficial esconde uma
deterioração aguda no fluxo atual:

| App | Nota histórica | Nota das reviews recentes (jun/26) | Amostra |
|-----|:---:|:---:|:---:|
| **Pierre** | 4,8★ | **≈ 3,7★** (59×5★ vs 21×1★) | 101 reviews |
| **Mobills** | 4,7★ | **≈ 3,1★** (35×5★ vs 33×1★) | 100 reviews |

```
PIERRE (101 reviews, jun/26)          MOBILLS (100 reviews, jun/26)
5★ ████████████████████ 59            5★ ████████████ 35
4★ █                     4            4★ █████        16
3★ ███                   8            3★ ███           9
2★ ███                   9            2★ ██            7
1★ ███████              21            1★ ███████████   33
        média ≈ 3,7★                          média ≈ 3,1★
```

**Ambos polarizados** (muitos fãs antigos 5★ vs revolta recente 1★) e **pela mesma
causa raiz.** O fosso "Open Finance" não é só inatingível para um fundador solo —
é uma **fonte ativa de dor** que o registro manual do Sovina simplesmente não tem.

---

## 3. Dores reais por concorrente (citações dos usuários)

### Pierre (concorrente direto — o "assistente gentil")
1. **Open Finance é o calcanhar de Aquiles** — "não conecta o Itaú", "load infinito
   sincronizando", "72h sincronizando", "só funciona com Nubank".
2. **Pediram lançamento manual** — *"Poderia ter uma opção de incluir gastos manual"*.
   O que o Sovina trata como feature, o usuário do Pierre está implorando.
3. **IA imprecisa quebra a confiança** — "a IA é muito burra", "valores errados",
   "recategoriza e desfaz sozinho", *"é mais fácil usar o GPT"*.
4. **Fricção de paywall** — "diz que é grátis e é mentira", limite de 5-15 msgs/dia
   no grátis; Reclame Aqui: 30 reclamações, cancelamento difícil recorrente.
5. **Onboarding pede CPF/telefone cedo** — afasta quem preza privacidade.
6. **Bugs de retenção** — botão "voltar" fecha o app; sumiço do acompanhamento de
   parcelas na v3.0.

### Mobills (líder de mercado — o "robusto tradicional")
1. **Open Finance quebrado em escala** — dominante: "não integra Bradesco", "Itaú
   nunca finaliza", *"open finance não funciona nem pagando"*.
2. **Bugs pós-atualização jun/26** — "app não funciona", "fora do ar a semana toda",
   dados corrompidos, **despesas sumindo / criadas sem autorização**, perda de anos
   de lançamentos.
3. **Suporte inexistente** — "suporte zero", "só email", "bot não funciona".
4. **Monetização agressiva** — paywall forçado, **anúncios longos para liberar 5
   transações**, "objetivo é vender assinatura, não ajudar".
5. **Cancelamento/reembolso difícil** — violação explícita do **CDC Art. 49**
   (direito de arrependimento 7 dias) citada por usuários.
6. **Categorização ruim** — *"meu aluguel foi para alimentação"*, "não aprende".
7. **Removeram a gamificação** (moedas → mês premium) e usuários reclamaram:
   *"agora não pode mais, isso desmotiva a gente"*.
8. **Sinal revelador:** vários usuários dizem que a frustração os levou a *"criar
   um app pessoal com IA sem essas frescuras de premium"* ou voltar pro Excel.

### Graniq (rival de mecânica — o "chat IA")
- **Não tem app nativo no Google Play** — é web/PWA ("desktop e mobile sempre em
  sync"). Aposta 100% em WhatsApp + web. Sem reviews mobile para auditar.
- Implicação: há **espaço para um app mobile nativo bem-feito** no nicho IA-chat,
  e Graniq depende do WhatsApp tanto quanto a 2ª porta do Sovina dependerá.

---

## 4. As brechas validadas → o roadmap do Sovina

| # | Brecha de mercado (evidência) | Resposta do Sovina |
|---|------|------|
| 1 | Open Finance é fonte de dor nos 2 líderes (não-confiável, bugado, frustrante) | **Registro manual como bandeira**, não desculpa. Escapamos da categoria inteira de falha. |
| 2 | Usuários do Pierre *pedem* lançamento manual | Reforça o ritual de declarar o gasto = intervenção comportamental |
| 3 | IA que erra número destrói confiança (Pierre + Mobills) | **Números corretos > IA esperta.** No manual, o número é exato por definição |
| 4 | "É mentira que é grátis" / paywall e anúncios agressivos | **Grátis de verdade no beta** vira vantagem de marca |
| 5 | Mobills removeu gamificação e usuários reclamaram | Sovina é **gamificado por design** — vantagem direta |
| 6 | Suporte inexistente é dor transversal | Suporte humano/próximo no beta = diferencial barato e marcante |
| 7 | Onboarding pede dados sensíveis cedo (Pierre) | Onboarding "O Julgamento" sem exigir banco/CPF logo de cara |
| 8 | WhatsApp já lotado (6+ players), nenhum é "o juiz" | **Entrar no WhatsApp pelo TOM, não pela feature** |

---

## 5. Conclusão

A janela é real e está aberta **agora**. Os dois líderes que apostaram em Open
Finance + IA estão com a confiança do usuário em queda livre (3,1-3,7★ no fluxo
recente) por problemas que o modelo do Sovina **não tem por construção**:
sincronização que falha, números em que não se pode confiar, e monetização que
trai. A aposta da CloudWalk valida o mercado; as falhas dela e do Mobills validam
o *método* do Sovina (manual + ritual + tom). O diferencial defensável continua
sendo a persona — o juiz implacável — e o beta de 01/07 deve gritar isso.

> **Próximos monitoramentos:** Graniq (rival de mecânica, em ascensão via SEO) e a
> próxima atualização do Pierre/Mobills (se estabilizarem os bugs, a nota recente
> se recupera). Reexecutar este scrape em ~30 dias para medir a tendência.
