-- Seed da fila do Threads: 78 posts (4/dia × 20 dias, MENOS as 2 enquetes dos
-- dias 9 e 16 às 18h — a API não publica enquete; poste essas manualmente).
-- Fonte: docs/marketing/threads-calendario-4x20.md (D1=11/06 ... D20=30/06).
-- Horários em Brasília (-03). Rode UMA vez no SQL Editor do Supabase.
--
-- Para reagendar tudo (ex.: início atrasou 1 dia):
--   update public.threads_queue set scheduled_at = scheduled_at + interval '1 day' where status = 'pending';

insert into public.threads_queue (body, scheduled_at) values
-- ── DIA 1 — 11/06 ────────────────────────────────────────────────────
($sov$Hoje começa o expediente.
A partir de agora, eu falo quatro vezes por dia: um decreto pela manhã, um número no almoço, uma verdade à tarde e um julgamento à noite.
Seu dinheiro acaba de ganhar uma testemunha.
A fila para o julgamento está aberta — o link está na bio.$sov$, '2026-06-11 08:00:00-03'),
($sov$Uma bebida comprada na rua todo dia: R$ 6. Vinte e dois dias úteis, doze meses: R$ 1.584 por ano.
A água filtrada em casa custaria centavos. Você paga R$ 1.584 pela embalagem e pela pressa.$sov$, '2026-06-11 12:00:00-03'),
($sov$"É investimento em mim."
Era. Até o terceiro curso que você não terminou. Conhecimento parado é igual a dinheiro parado: só conta quando vira ação.
Investimento que você não usa tem outro nome: desculpa cara.$sov$, '2026-06-11 18:00:00-03'),
($sov$R$ 8 no cafezinho. Todo dia útil. São R$ 2.112 por ano que você bebeu e esqueceu.
Não é sobre o café. É sobre você nunca ter feito a conta.
Eu fiz.$sov$, '2026-06-11 21:00:00-03'),
-- ── DIA 2 — 12/06 ────────────────────────────────────────────────────
($sov$"É só R$ 50."
Não existe "só". R$ 50 por semana são R$ 2.600 por ano.
Em dez anos, sem render nada, R$ 26.000.
A palavra "só" é a desculpa mais cara da sua vida.$sov$, '2026-06-12 08:00:00-03'),
($sov$O café da cafeteria: R$ 18. Três vezes por semana. R$ 2.808 por ano.
Não é cafeína. É um ritual caro que você confunde com merecimento. O grão em casa custa um décimo disso.$sov$, '2026-06-12 12:00:00-03'),
($sov$"Tava com cupom."
Cupom não é desconto. É isca. Você não economizou 20% — gastou 100% de algo que não ia comprar.
A loja te deu um motivo, e você só precisava de um.$sov$, '2026-06-12 18:00:00-03'),
($sov$Três iFoods na semana, R$ 45 cada. R$ 7.020 por ano.
Você não está com preguiça de cozinhar. Está pagando R$ 7 mil para alguém subir a escada por você.
Negado.$sov$, '2026-06-12 21:00:00-03'),
-- ── DIA 3 — 13/06 ────────────────────────────────────────────────────
($sov$Orçamento mensal é mentira confortável. Ninguém vive um mês de uma vez.
Você vive um dia de cada vez — e gasta um dia de cada vez.
Pegue o que sobra depois das contas e da reserva. Divida pelos dias do mês.
Esse número é a sua cota. Ultrapasse e amanhã ela encolhe.$sov$, '2026-06-13 08:00:00-03'),
($sov$R$ 10 de energético por dia útil para fingir que dormiu. R$ 2.640 por ano.
Você está pagando para adiar o cansaço — com juros de saúde e de dinheiro. Durma. Sai mais barato.$sov$, '2026-06-13 12:00:00-03'),
($sov$"Todo mundo já trocou de celular."
Todo mundo também está endividado. Seguir o rebanho é confortável até a borda do precipício.
O seu aparelho ainda liga. O que quebrou foi a sua paciência com a inveja.$sov$, '2026-06-13 18:00:00-03'),
($sov$"Eu mereço."
Mérito não é desculpa para dívida. Você merece dormir tranquilo no fim do mês.
O pote de açaí de R$ 32 não te dá isso. Te dá 32 motivos a menos.$sov$, '2026-06-13 21:00:00-03'),
-- ── DIA 4 — 14/06 ────────────────────────────────────────────────────
($sov$Sentimento não paga boleto.
Anote isso onde você guarda o cartão.$sov$, '2026-06-14 08:00:00-03'),
($sov$R$ 25 de estacionamento por dia útil. R$ 6.600 por ano para deixar o carro parado enquanto você trabalha.
Some à parcela, ao seguro, à gasolina. O carro não é seu. Você é dele.$sov$, '2026-06-14 12:00:00-03'),
($sov$"Dinheiro é pra circular."
Sim — da sua conta para a dos outros. Essa frase foi inventada por quem vende, não por quem guarda.
Circular para fora é gastar. Circular de volta é investir. Saiba a diferença.$sov$, '2026-06-14 18:00:00-03'),
($sov$Quatro streamings. R$ 130 por mês. R$ 1.560 por ano.
Você assiste a um e meio.
Está pagando R$ 1.000 anuais por telas que existem só para te fazer sentir que tem opção.
Cancele dois. Hoje.$sov$, '2026-06-14 21:00:00-03'),
-- ── DIA 5 — 15/06 ────────────────────────────────────────────────────
($sov$Você ganha mais ou menos R$ 136 por dia de trabalho.
Aquela compra por impulso de R$ 408? Três dias da sua vida.
Você trocou três dias de trabalho por um pedaço de pano que vai desbotar.
Quer parar de fazer isso no escuro? A fila para o julgamento está aberta.$sov$, '2026-06-15 08:00:00-03'),
($sov$R$ 15 na padaria toda manhã. R$ 5.475 por ano em pão e frios comprados no piloto automático.
O café da manhã feito em casa custaria um terço. A diferença é pura distração.$sov$, '2026-06-15 12:00:00-03'),
($sov$Comprou o equipamento caro "para se motivar a começar".
A motivação não vem no pacote. O tênis de R$ 800 não corre por você.
Você comprou a intenção e estocou a culpa.$sov$, '2026-06-15 18:00:00-03'),
($sov$Tribunal aberto.
Confesse nos comentários o pior gasto da sua semana. Valor e desculpa.
Eu julgo um por um. Os covardes podem só assistir.$sov$, '2026-06-15 21:00:00-03'),
-- ── DIA 6 — 16/06 ────────────────────────────────────────────────────
($sov$Reserva de emergência não é luxo de rico. É a coleira da sua liberdade.
Sem ela, qualquer pneu furado vira fatura parcelada em 12x.
Eu separo o seu futuro antes de te deixar respirar. Nessa ordem. Sempre.$sov$, '2026-06-16 08:00:00-03'),
($sov$R$ 80 de cerveja por fim de semana. R$ 4.160 por ano.
Não julgo o brinde. Julgo a conta. São quatro mil reais que evaporaram em espuma e ressaca.$sov$, '2026-06-16 12:00:00-03'),
($sov$"Não dá pra viver economizando tudo."
Concordo. Eu não peço tudo. Peço a cota.
Disciplina não é miséria — é gastar de olhos abertos. Quem não controla nada chama o controle de sofrimento.$sov$, '2026-06-16 18:00:00-03'),
($sov$"Parcelei sem juros."
Você não parcelou um produto. Parcelou o seu salário dos próximos 12 meses.
Cada mês vai cobrar a sua parte. Eu não esqueço — e o seu cartão também não.$sov$, '2026-06-16 21:00:00-03'),
-- ── DIA 7 — 17/06 ────────────────────────────────────────────────────
($sov$Pergunta simples: para onde foi o seu salário do mês passado?
Se você precisou pensar mais de cinco segundos, esse é exatamente o problema.
O dinheiro que você não vigia é dinheiro que outra pessoa gasta por você.$sov$, '2026-06-17 08:00:00-03'),
($sov$R$ 30 por semana em itens de um jogo. R$ 1.560 por ano.
Você comprou poder em pixels que somem quando o servidor cair. O dinheiro, esse, sumiu de verdade.$sov$, '2026-06-17 12:00:00-03'),
($sov$"Só se vive uma vez."
Verdade. E uma boa parte dela é depois dos 60, sem salário e dependendo de quem guardou.
Viver uma vez é argumento dos dois lados. O futuro também é você.$sov$, '2026-06-17 18:00:00-03'),
($sov$Um Uber de R$ 18 para não andar 12 minutos. Dois por dia útil.
R$ 9.504 por ano para evitar caminhada.
Você paga por comodidade e ainda reclama da academia que não usa. Que custa R$ 1.200.$sov$, '2026-06-17 21:00:00-03'),
-- ── DIA 8 — 18/06 ────────────────────────────────────────────────────
($sov$Eu não invento dinheiro.
Se a sua meta não cabe na sua renda, o problema não é a meta. É a renda ou o gasto.
Corte custos ou ganhe mais. Não há terceira porta.$sov$, '2026-06-18 08:00:00-03'),
($sov$R$ 50 por mês no app de namoro premium. R$ 600 por ano.
Você está pagando para continuar sozinho — só que com mais curtidas. O algoritmo não tem pressa de te entregar.$sov$, '2026-06-18 12:00:00-03'),
($sov$"Esse rolê caro é networking."
Talvez. Ou é só uma conta dividida que você pagou inteira para parecer próspero.
Contato de verdade não cobra ingresso. Reavalie quem você está tentando impressionar.$sov$, '2026-06-18 18:00:00-03'),
($sov$Sessão noturna.
Qual gasto você está escondendo da sua própria consciência? Confesse o valor nos comentários.
Confessar aqui dói menos do que descobrir sozinho no fim do mês.$sov$, '2026-06-18 21:00:00-03'),
-- ── DIA 9 — 19/06 (18h é ENQUETE — postar manualmente) ───────────────
($sov$O rotativo do cartão cobra mais de 400% ao ano.
Você nunca aceitaria emprestar dinheiro a esse juro. Mas aceita pagar.
Pagar o mínimo da fatura não é alívio. É assinar a sua escravidão mensal.$sov$, '2026-06-19 08:00:00-03'),
($sov$R$ 12 de bobagem no caixa do mercado, quase todo dia. R$ 4.380 por ano em coisas que você nem foi buscar.
A fila do caixa é uma armadilha montada na altura dos seus olhos. E você cai sorrindo.$sov$, '2026-06-19 12:00:00-03'),
($sov$"Estava em promoção."
Desconto em algo que você não ia comprar não é economia. É gasto disfarçado de esperteza.
Você não economizou R$ 200. Você gastou R$ 600 que estavam parados na sua conta.$sov$, '2026-06-19 21:00:00-03'),
-- ── DIA 10 — 20/06 ───────────────────────────────────────────────────
($sov$Todo dia 5 você jura que esse mês vai ser diferente.
Todo dia 28 você está contando moedas.
A diferença entre os dois dias é um sistema. Eu sou esse sistema.
A lista de espera está aberta. Pare de jurar. Comece a prestar contas.$sov$, '2026-06-20 08:00:00-03'),
($sov$R$ 45 por mês de tarifa de pacote bancário. R$ 540 por ano.
O banco digital faz o mesmo de graça. Você paga meio salário por ano pela inércia de não trocar.$sov$, '2026-06-20 12:00:00-03'),
($sov$"Está barato, compro e guardo para usar depois."
Depois nunca chega. O item envelhece na caixa e o dinheiro envelhece fora da sua conta.
Promoção de algo que você não precisa hoje é despesa fingindo ser esperteza.$sov$, '2026-06-20 18:00:00-03'),
($sov$R$ 120 num happy hour. Toda sexta. R$ 6.240 por ano.
Você não comprou amizade. Comprou ressaca e um boleto.
Os amigos de verdade não somem se você pedir água.$sov$, '2026-06-20 21:00:00-03'),
-- ── DIA 11 — 21/06 ───────────────────────────────────────────────────
($sov$Quem controla a cota controla o mês.
Quem controla o mês controla o ano.
Quem não controla nada culpa o salário.$sov$, '2026-06-21 08:00:00-03'),
($sov$R$ 10 de raspadinha por dia. R$ 3.650 por ano comprando esperança a juros de desespero.
A sorte não é um plano financeiro. É o imposto que o desinformado paga voluntariamente.$sov$, '2026-06-21 12:00:00-03'),
($sov$"Trabalho duro, posso me dar esse luxo."
Trabalhar duro é exatamente por que o seu dinheiro merece respeito, não desperdício.
Cansaço não é cheque em branco. É o motivo para você não jogar fora o que custou suor.$sov$, '2026-06-21 18:00:00-03'),
($sov$Domingo é dia de balanço.
Quanto você queimou neste fim de semana? Deixe o número nos comentários.
Sem arredondar para baixo. Eu percebo.$sov$, '2026-06-21 21:00:00-03'),
-- ── DIA 12 — 22/06 ───────────────────────────────────────────────────
($sov$A ordem importa.
Errado: renda menos gastos, e guardo o que sobrar. (Nunca sobra.)
Certo: renda menos reserva, e vivo com o que restar.
Eu guardo o seu futuro antes de você ter chance de torrá-lo.$sov$, '2026-06-22 08:00:00-03'),
($sov$R$ 45 de pipoca e refri no cinema, duas vezes por mês. R$ 1.080 por ano.
O filme custou metade. O resto foi milho estourado vendido a peso de ouro. Coma antes de entrar.$sov$, '2026-06-22 12:00:00-03'),
($sov$"Comprar me faz bem, é saúde mental."
O alívio dura até a notificação da fatura. Aí a ansiedade volta — agora com dívida junto.
Terapia de varejo cobra caro e não cura nada. Procure a de verdade.$sov$, '2026-06-22 18:00:00-03'),
($sov$O Pix te deu velocidade. E tirou o seu freio.
Antes você sentia o dinheiro sair. Agora some em três toques, antes de você pensar.
Conveniência sem disciplina é só uma sangria mais rápida.$sov$, '2026-06-22 21:00:00-03'),
-- ── DIA 13 — 23/06 ───────────────────────────────────────────────────
($sov$Venderam para você que gastar é se amar.
Mentira cara. Quem te ama de verdade não te deixa no rotativo.
Autocuidado é a reserva que te protege, não o carrinho que te afunda.$sov$, '2026-06-23 08:00:00-03'),
($sov$Abra seu armário. Conte as peças com etiqueta ainda pendurada.
Para muita gente, são mais de R$ 3.000 em roupa nunca usada. Isso não é estilo. É dinheiro preso num cabide.$sov$, '2026-06-23 12:00:00-03'),
($sov$"Eu parcelo, cabe no orçamento."
Caber não é o mesmo que poder. Doze parcelas que cabem hoje engessam doze meses do seu amanhã.
Você não comprou um produto. Alugou a sua liberdade por um ano.$sov$, '2026-06-23 18:00:00-03'),
($sov$"Foi só um docinho de R$ 15."
Cinco vezes na semana. R$ 3.900 por ano em açúcar e arrependimento.
O pequeno repetido é o que te quebra. O grande você ao menos percebe.$sov$, '2026-06-23 21:00:00-03'),
-- ── DIA 14 — 24/06 ───────────────────────────────────────────────────
($sov$Eu tenho dois números para você todo dia.
O teto: o máximo que você sobrevive gastando.
A cota ideal: o que te leva à sua meta.
Viva entre os dois. Furou o teto? Amanhã eu corto. Eu avisei.$sov$, '2026-06-24 08:00:00-03'),
($sov$Você colocou mais R$ 40 no carrinho para "ganhar" o frete grátis de R$ 15.
Parabéns: gastou R$ 40 para economizar R$ 15. A loja te vendeu a matemática ao contrário, e você comprou.$sov$, '2026-06-24 12:00:00-03'),
($sov$"Vou ganhar o bônus, então já gasto."
Gastar dinheiro que ainda não entrou é a definição de dívida.
O bônus é uma promessa. A fatura é uma certeza. Não troque uma pela outra.$sov$, '2026-06-24 18:00:00-03'),
($sov$"Ano que vem eu me organizo."
Você disse isso ano passado. E no anterior.
O futuro não é onde os problemas se resolvem. É onde os juros se acumulam.
Comece hoje, ou me explique de novo em janeiro.$sov$, '2026-06-24 21:00:00-03'),
-- ── DIA 15 — 25/06 ───────────────────────────────────────────────────
($sov$Você não tem um problema de matemática. Tem um problema de testemunha.
Ninguém vê os seus gastos pequenos, então eles parecem não contar.
Eu vejo todos. E eu conto.
A fila para o julgamento está aberta.$sov$, '2026-06-25 08:00:00-03'),
($sov$Todo app já sugere 15% de gorjeta, em tudo, automaticamente.
Some os 15% de cada entrega no ano e são centenas de reais doadas no impulso de um toque. Decida você, não o botão.$sov$, '2026-06-25 12:00:00-03'),
($sov$"Todo mundo está viajando, eu também posso."
Pode. Parcelado em dez vezes, voltando para a mesma conta no vermelho que deixou.
A foto dura um story. A dívida dura até outubro.$sov$, '2026-06-25 18:00:00-03'),
($sov$O tribunal está em sessão.
Defenda UM gasto deste mês que você considera justificável. Eu julgo a defesa.
Aviso: até hoje, não absolvi ninguém.$sov$, '2026-06-25 21:00:00-03'),
-- ── DIA 16 — 26/06 (18h é ENQUETE — postar manualmente) ──────────────
($sov$Todo real tem dois preços: o que você paga e o que você deixa de ganhar.
R$ 500 por mês no que não importa, rendendo ao longo de 20 anos, seriam mais de R$ 200 mil.
Você não gastou R$ 500. Você gastou o seu eu de 50 anos.$sov$, '2026-06-26 08:00:00-03'),
($sov$R$ 120 por mês de plano de celular. Você usa 5 GB de 50. R$ 1.440 por ano por uma franquia que sobra.
Você não comprou internet. Comprou medo de faltar.$sov$, '2026-06-26 12:00:00-03'),
($sov$Você abriu o app "só para ver".
Quarenta minutos depois, R$ 58 a caminho e fome que não era real.
A fome era tédio. O prejuízo é em reais. Feche o aplicativo.$sov$, '2026-06-26 21:00:00-03'),
-- ── DIA 17 — 27/06 ───────────────────────────────────────────────────
($sov$Liberdade financeira não é poder comprar tudo.
É não precisar de nada com urgência.
Quem compra por impulso nunca é livre. É refém do próximo desejo.$sov$, '2026-06-27 08:00:00-03'),
($sov$A sobremesa de R$ 25 que você pede "porque já está aqui".
Duas vezes por semana, R$ 2.600 por ano no fim da refeição. A conta já estava paga. Esse extra é só o impulso assinando.$sov$, '2026-06-27 12:00:00-03'),
($sov$"Tiro da reserva agora e reponho depois."
A reserva não é um empréstimo que você faz a si mesmo. É a muralha. Cada tijolo que você tira, você jura repor — e nunca repõe.
Mexer na reserva por desejo é cavar o próprio fosso.$sov$, '2026-06-27 18:00:00-03'),
($sov$"Tive uma semana difícil, mereço gastar."
A semana difícil custou o seu cansaço. A recompensa de R$ 300 custa a próxima.
Você não está se premiando. Está cobrando juros de si mesmo.$sov$, '2026-06-27 21:00:00-03'),
-- ── DIA 18 — 28/06 ───────────────────────────────────────────────────
($sov$Olhe os seus débitos automáticos.
Tem ali, agora, pelo menos uma assinatura que você esqueceu que paga.
R$ 30 por mês de esquecimento é R$ 360 por ano de pura distração.
Cace os vazamentos. Eu te mostro onde eles estão.$sov$, '2026-06-28 08:00:00-03'),
($sov$R$ 90 por mês num clube de assinatura. R$ 1.080 por ano de surpresas que viram gaveta.
Você assinou a novidade mensal e esqueceu de cancelar o tédio. Eu não esqueci.$sov$, '2026-06-28 12:00:00-03'),
($sov$"É só desta vez."
Foi o que você disse das outras onze vezes este ano. "Desta vez" é o nome que o impulso usa para passar despercebido.
Eu conto todas as "desta vez". Elas somam mais do que você admite.$sov$, '2026-06-28 18:00:00-03'),
($sov$Última sessão do mês.
Confesse: qual parcela você ainda vai estar pagando em dezembro?
Eu guardo cada uma na memória. O seu cartão também.$sov$, '2026-06-28 21:00:00-03'),
-- ── DIA 19 — 29/06 ───────────────────────────────────────────────────
($sov$Eu não te dou motivação. Motivação acaba na terça.
Eu te dou um número, um limite e uma consequência.
Disciplina não é sentir vontade. É prestar contas mesmo sem vontade.$sov$, '2026-06-29 08:00:00-03'),
($sov$R$ 7 no café da esquina do trabalho, duas vezes por dia. R$ 3.696 por ano.
A máquina do escritório é grátis. Você paga quase quatro mil reais por ano pela caminhada de cinco minutos e pelo copo bonito.$sov$, '2026-06-29 12:00:00-03'),
($sov$"Prefiro aproveitar a vida a morrer rico."
Falsa escolha. O oposto de morrer rico não é aproveitar — é morrer devendo, dependente, sem opções.
Não te peço para ser avarento com a vida. Te peço para não ser idiota com o dinheiro.$sov$, '2026-06-29 18:00:00-03'),
($sov$Some tudo: café, delivery, Uber, assinatura esquecida, docinho, happy hour.
Para muita gente, passa de R$ 25.000 por ano em pequenos "só dessa vez".
Não é o aluguel que te quebra. São os centavos que você se recusa a contar.$sov$, '2026-06-29 21:00:00-03'),
-- ── DIA 20 — 30/06 ───────────────────────────────────────────────────
($sov$Vinte dias de verdades em reais.
A lição é uma só: o dinheiro que você não vigia governa você.
Inverta isso. Vigie cada real. Preste contas. Deixe a matemática decidir.
Sentimento é ruído. Número é lei.$sov$, '2026-06-30 08:00:00-03'),
($sov$Pegue um único hábito de R$ 500 por mês. Em vez de queimar, invista a 10% ao ano.
Em trinta anos, vira mais de R$ 1 milhão. Você não gasta R$ 500. Você demite o seu eu milionário, todo mês.$sov$, '2026-06-30 12:00:00-03'),
($sov$"Eu começo a guardar quando ganhar mais."
Você dizia isso ganhando metade do que ganha hoje. O salário subiu, o gasto subiu junto, a reserva continua em zero.
Quem não guarda com pouco não guarda com muito — só gasta com mais estilo. Comece agora, com o que tem.$sov$, '2026-06-30 18:00:00-03'),
($sov$Você leu vinte dias dos meus vereditos e riu reconhecendo cada um.
Rir é o primeiro passo. Prestar contas é o segundo.
O julgamento começa em breve. A fila está aberta.
Submeta-se. Ou continue contando moedas no dia 28. A escolha sempre foi sua — só agora você não tem mais desculpa.$sov$, '2026-06-30 21:00:00-03');
