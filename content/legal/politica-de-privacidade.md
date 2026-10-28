# Política de Privacidade do Pyxis

**Versão {{terms.version}}, vigente a partir {{terms.effectiveFrom}}.**

Esta política explica quais dados pessoais o Pyxis trata **como controlador**, para quê, com que
base legal, com quem compartilha, por quanto tempo guarda e como você exerce os seus direitos,
conforme a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018, a "LGPD").

Ela vale para:

1. **clientes** que contratam o Pyxis hospedado, representados pelo **dono da conta**, que faz o
   cadastro e administra a conta;
2. **pessoas com acesso ao painel** (`app.pyxis-analytics.dev`): o dono da conta e as pessoas que
   ele convida;
3. **quem nos escreve** em hello@pyxis-analytics.dev;
4. **visitantes da página inicial** `pyxis-analytics.dev`.

Ela **não** trata dos visitantes dos sites dos nossos clientes. Nesses sites, quem decide sobre a
medição é o dono do site (o controlador); nós atuamos como operador, pelas regras do Acordo de
Tratamento de Dados Pessoais. Se você visitou um site que usa o Pyxis, consulte a política de
privacidade desse site.

---

## 1. Quem é o controlador e como falar conosco

1.1. O controlador é **{{seller.name}}**, pessoa física, inscrito no CPF sob o nº **{{seller.taxId}}**, com
endereço em **{{seller.address}}**, que oferece o serviço com o nome **Pyxis**.

1.2. Canal para qualquer assunto de privacidade, inclusive o exercício dos seus direitos:
**hello@pyxis-analytics.dev**. As mensagens são lidas e respondidas pelo próprio controlador.

1.3. Como agente de tratamento de pequeno porte, não indicamos um encarregado pelo tratamento de
dados pessoais; este canal cumpre o papel previsto no art. 41, § 2º, I, da LGPD (Resolução CD/ANPD
nº 2/2022, art. 11, e Resolução CD/ANPD nº 18/2024, art. 3º, § 3º).

## 2. Que dados tratamos, para quê, com que base legal e por quanto tempo

### 2.1. Pessoas com acesso ao painel

| Dado | Para quê | Base legal (LGPD) | Por quanto tempo |
|---|---|---|---|
| E-mail, idioma dos e-mails (o da tela em que você entrou ou se cadastrou), projetos a que você tem acesso, se você é o dono da conta ou convidado, escolha sobre o resumo semanal, data de cadastro | Mandar o código de login e os e-mails do serviço, mostrar os seus projetos e mandar o resumo semanal no seu idioma | Execução do contrato, para o dono da conta (art. 7º, V); legítimo interesse nosso e do cliente em dar acesso às pessoas que o dono convidou (art. 7º, IX) | Enquanto você tiver acesso a algum projeto ou for dono de uma conta. Quando o dono tira você de um projeto, o acesso a ele termina na hora; se você ficar sem acesso a nenhum projeto, apagamos o seu cadastro em até 30 dias. Em todo caso, o cadastro é apagado junto com a conta (item 2.2) |
| Convite: o seu e-mail, o nome do projeto e o e-mail de quem convidou, no e-mail de convite | Avisar você do acesso e de quem o deu | Legítimo interesse nosso e do cliente (art. 7º, IX) | O convite em si não fica no nosso banco (só o cadastro da linha acima); o registro do envio fica com o provedor de e-mail pelo prazo dele (item 3) |
| Códigos de login e de cadastro: e-mail, código guardado só como hash, finalidade (login ou cadastro), idioma, tentativas, horários | Permitir o login e o cadastro sem senha e impedir tentativas repetidas | Execução do contrato, procedimentos preliminares a ele e legítimo interesse em segurança (art. 7º, V e IX) | Valem 10 minutos; apagados pela rotina diária depois de vencidos |
| Sessões: valor guardado só como hash, datas de início e de último uso, categoria do aparelho e família do navegador e do sistema (sem versão) | Manter você conectado e mostrar as suas sessões para você encerrá-las | Execução do contrato e legítimo interesse em segurança (art. 7º, V e IX) | No máximo 7 dias, ou 24 horas sem uso; apagadas pela rotina diária depois de encerradas |
| Tokens de acesso: nome que você deu, valor guardado só como hash, datas de criação, último uso, validade e revogação | Permitir que programas e agentes leiam os seus números | Execução do contrato (art. 7º, V) | Até a exclusão do seu cadastro (um token vencido ou revogado para de funcionar na hora, mas o registro fica até lá) |
| Aplicativos conectados (conector do Claude): o aplicativo (Claude ou Claude Code), as datas em que você conectou, do último uso (gravada no máximo a cada 5 minutos e a cada renovação) e da revogação; credenciais da conexão guardadas só como hash | Deixar o aplicativo que você conectou ler os seus números e mostrar as conexões para você revogá-las | Execução do contrato, para o dono da conta (art. 7º, V); legítimo interesse nosso e do cliente em dar esse recurso às pessoas que o dono convidou (art. 7º, IX) | Enquanto a conexão estiver ativa. A rotina diária apaga a conexão revogada ou parada há 90 dias, as credenciais vencidas e as de renovação já trocadas há mais de 30 dias |
| Pedidos de conexão: o aplicativo, o endereço para onde a resposta volta, os dados técnicos que o aplicativo manda para proteger o pedido, os horários, a sua decisão (permitir ou cancelar), quem decidiu e o código de uso único guardado só como hash | Mostrar o pedido na página de consentimento e entregar a resposta só ao aplicativo que pediu | Execução do contrato, para o dono da conta, e legítimo interesse em segurança e em dar o recurso aos convidados (art. 7º, V e IX) | O pedido vale 10 minutos, e o código, 5. A rotina diária apaga o pedido 1 dia depois de vencido; depois disso, fica só a conexão da linha acima |
| Registro de envio do resumo semanal (projeto, pessoa, semana, data de envio) | Não mandar o mesmo resumo duas vezes | Execução do contrato (art. 7º, V) | Até a exclusão do projeto ou do seu acesso |
| Registros técnicos da API com o seu identificador interno (por exemplo, "entrou", "encerrou a sessão", "criou um token", "conectou um aplicativo") | Segurança e investigação de falhas e incidentes | Legítimo interesse em segurança (art. 7º, IX) | 14 dias |

**Endereço IP:** quando você pede um código ou entra no painel, o IP é usado só na memória do
servidor para limitar tentativas (até 5 a cada 15 minutos) e some em no máximo 15 minutos. **Não é
gravado** no nosso banco de dados nem nos nossos registros. A Vercel, que hospeda o painel, recebe
o IP e o navegador de quem acessa e os guarda nos registros técnicos dela por 1 dia (item 3).

### 2.2. Clientes (donos de conta)

| Dado | Para quê | Base legal (LGPD) | Por quanto tempo |
|---|---|---|---|
| Conta: dono, plano (grátis ou pago), situação da assinatura, periodicidade, identificadores do cliente e da assinatura no Stripe (só no plano pago), datas (fim do teste, do período, do acesso, dos avisos enviados), uso mensal de eventos e avisos de cota e de conta sem eventos enviados | Prestar o serviço, aplicar os limites do plano, ligar e desligar o acesso conforme o plano e a assinatura, avisar e apagar a conta do plano grátis sem eventos, avisar o fim da conta | Execução do contrato (art. 7º, V) | Até a exclusão da conta: 30 dias depois do fim do acesso ou, numa conta do plano grátis sem eventos, 7 dias depois do aviso (Termos de Uso, Cláusula 7.6) |
| Aceite dos termos: versão aceita, data e hora, conta e pessoa que aceitou (sem IP) | Saber qual versão vale para você e provar o aceite | Execução do contrato e exercício regular de direitos (art. 7º, V e VI) | Até a exclusão da conta. Quando você assina o plano pago, o Stripe guarda, como controlador, o registro do aceite feito na página de pagamento dele |
| Dados de cobrança, só de quem assina o plano pago, recebidos pelo Stripe: nome, e-mail, endereço de cobrança, CPF ou CNPJ (se informado), bandeira, final e validade do cartão, histórico de pagamentos, reembolsos e contestações | Cobrar a assinatura, enviar recibos, tratar arrependimento, reembolsos e contestações, cumprir obrigações fiscais | Execução do contrato (art. 7º, V) e cumprimento de obrigação legal (art. 7º, II) | Durante o contrato e por 5 anos contados do ano seguinte ao de cada cobrança (prazo de guarda fiscal) |
| Configuração dos projetos: nome, endereços dos sites, fuso horário, evento de conversão, chave pública, chave secreta guardada só como hash, ícone copiado do próprio site | Prestar o serviço | Execução do contrato (art. 7º, V) | Até a exclusão do projeto pelo dono ou da conta (linha "Conta" acima) |
| Pedidos de exportação: quem pediu, quando, situação e quantidade de eventos | Gerar e entregar o arquivo de exportação ao dono da conta | Execução do contrato (art. 7º, V) | Até a exclusão do projeto. O arquivo em si é apagado 7 dias depois de pronto |

**No plano grátis, não pedimos cartão nem dados de cobrança.** No plano pago, **não recebemos nem
guardamos o número do cartão**: ele fica com o Stripe. Guardamos só a impressão do cartão do item 2.7.

### 2.3. Quem nos escreve

| Dado | Para quê | Base legal (LGPD) | Por quanto tempo |
|---|---|---|---|
| E-mail, nome, conteúdo da mensagem e anexos | Responder pedidos de acesso, dúvidas, suporte, reclamações e pedidos de titulares | Procedimentos preliminares e execução do contrato (art. 7º, V); exercício regular de direitos (art. 7º, VI); legítimo interesse em responder a quem nos procura (art. 7º, IX) | Se houver contrato: até 5 anos depois do fim dele (prazo para reclamar danos, Código de Defesa do Consumidor, art. 27). Se não houver: 1 ano depois da última mensagem |

### 2.4. Visitantes da página inicial (`pyxis-analytics.dev`)

A página inicial do Pyxis é medida pelo próprio Pyxis, com as mesmas regras que oferecemos aos
clientes.

| Dado | Para quê | Base legal (LGPD) | Por quanto tempo |
|---|---|---|---|
| Página vista (caminho, sem parâmetros fora os de campanha), ações na página (por exemplo, abrir a demonstração), site de origem (só o domínio), parâmetros de campanha, categoria do aparelho, família do navegador e do sistema, país e estado (nunca a cidade), número aleatório da visita | Entender como a página é usada e melhorar a apresentação do Pyxis | Legítimo interesse (art. 7º, IX, e art. 10) | 13 meses |

A medição **não usa cookies**, **não guarda IP** nem o navegador completo, e **não envia nada** se o
seu navegador pedir para não ser rastreado (Global Privacy Control ou Do Not Track). Na própria
página, o painel "O que esta página registrou" mostra cada evento enviado e permite desligar a
medição neste navegador. A Vercel, que hospeda a página, guarda o IP e o navegador de quem acessa nos
registros técnicos dela por 1 dia.

### 2.5. Cookies e armazenamento no navegador

| Onde | Nome | Tipo | Para quê | Duração |
|---|---|---|---|---|
| Painel (`app.`) | `__Host-pyxis_session` | Cookie necessário, `HttpOnly` e `Secure` | Manter você conectado | 7 dias, ou até você sair |
| Painel e demonstração (`app.` e `demo.`) | `pyxis_locale` | Cookie de preferência | Lembrar o idioma escolhido | 1 ano |
| Painel e demonstração | `pyxis_theme` | Cookie de preferência | Lembrar o tema claro ou escuro, quando escolhido | 1 ano |
| Painel | `pyxis:pending-sign-in` | `sessionStorage` (só na aba) | Lembrar o e-mail digitado enquanto você espera o código, mesmo se recarregar a página | 10 minutos, ou até fechar a aba |
| Página inicial | `pyxis:session` | `sessionStorage` (só na aba) | Número aleatório da visita | Até fechar a aba ou 30 minutos sem atividade |
| Página inicial | `pyxis:opt-out` | `localStorage` | Lembrar que você desligou a medição | Até você religar ou limpar os dados do navegador |
| Página inicial e tela de login do painel | `pyxis:theme` | `localStorage` | Lembrar o tema escolhido neste aparelho | Até você trocar ou limpar os dados do navegador |

A página inicial não cria cookies. Não usamos cookies de terceiros, de publicidade nem de redes
sociais, e o painel não mede o uso das pessoas que entram nele.

### 2.6. E-mails que enviamos

Mandamos só e-mails ligados ao serviço: códigos de login e de cadastro; convite para um projeto;
boas-vindas, com a versão dos termos aceita; avisos de uso a 80%, a 100% e da pausa a 150%, no plano
pago, e a 80% e da pausa a 100%, no plano grátis; aviso de conta do plano grátis sem eventos; aviso de
fim do acesso, lembrete 7 dias antes da exclusão e aviso de exclusão feita; aviso de exportação
pronta; o resumo semanal (que cada pessoa pode desligar em Configurações); e comunicações sobre o
contrato, inclusive avisos de abuso e de suspensão. Os e-mails de cobrança são enviados pelo próprio
Stripe: lembrete 7 dias antes do fim do teste grátis (nos testes começados antes da versão 1.3 dos
Termos de Uso), recibos de pagamentos e de reembolsos, aviso de
pagamento recusado, pedido de confirmação do pagamento (3D Secure) e aviso de cartão perto de vencer. **Os nossos e-mails
não têm rastreamento de abertura nem de cliques.** Não mandamos publicidade.

### 2.7. Prevenção de teste grátis repetido

**Desde a versão 1.3 dos Termos de Uso não há teste grátis** (Termos de Uso, Cláusula 8.3), e não
registramos impressões de cartão novas. Este item trata dos registros dos testes começados antes, que
seguem o prazo da tabela abaixo e somem, no máximo, 12 meses depois do início do último desses testes.

O teste grátis valia uma vez por cliente (Termos de Uso, Cláusula 8.3). Para perceber quando o mesmo
cartão começa um segundo teste em outra conta, quando registramos uma assinatura com teste grátis
(na prática, quando o teste começa) lemos no Stripe a **impressão do cartão** (*fingerprint*) da
assinatura: um código que o Stripe calcula a partir do número do cartão e que se repete sempre que o
mesmo número de cartão é usado na nossa conta do Stripe. **A impressão não é o número do cartão e
não serve para pagar. Não recebemos nem guardamos o número do cartão.**

| Dado | Para quê | Base legal (LGPD) | Por quanto tempo |
|---|---|---|---|
| Impressão do cartão, identificador interno da conta e data em que registramos o cartão no teste (na prática, o início do teste) | Perceber o mesmo cartão começando um segundo teste grátis em outra conta | Legítimo interesse em prevenir o abuso do teste grátis (art. 7º, IX, e art. 10) | **12 meses contados dessa data, inclusive depois da exclusão da conta**; ao fim do prazo, a rotina diária apaga o registro |

1. **O que acontece numa coincidência.** Se a mesma impressão já começou um teste em outra conta nos
   12 meses anteriores, o serviço registra o fato nos registros técnicos, só com os identificadores
   internos das contas e nunca com a impressão (eles somem em 14 dias), e um alarme nos avisa por
   e-mail.
   **Nada acontece automaticamente**: nenhuma cobrança e nenhum cancelamento. O controlador examina o
   caso, pode pedir explicação ao dono da conta e decide pelas regras da Cláusula 18.11 dos Termos de
   Uso, que garantem aviso, motivo e direito de contestar. Não é, portanto, uma decisão tomada só por
   meio automatizado (art. 20).
2. **Por que guardamos depois da exclusão da conta.** O objetivo é justamente reconhecer uma conta
   nova aberta depois que a antiga foi encerrada. Guardamos só o mínimo para isso (sem nome, e-mail
   ou número do cartão) e pelo prazo que cobre esse uso (art. 10, § 1º).
3. **Limites.** Um cartão usado por carteira digital (como Apple Pay ou Google Pay) pode ter
   impressão diferente da do cartão físico, e um mesmo cartão pode ser usado legitimamente por
   pessoas diferentes de uma empresa. Testes com mais de 12 meses já foram apagados e não entram
   na comparação. Uma coincidência é um indício, nunca uma prova sozinha.
4. **Seus direitos.** Você pode pedir a confirmação e o acesso a esse registro e se opor a ele (item
   6), e examinamos a oposição considerando o motivo que você der.

### 2.8. Verificação de abuso

Quando verificamos uma suspeita de abuso (Termos de Uso, Cláusulas 12 e 18), usamos só o que o
serviço já guarda: os alertas de segurança, os registros técnicos da API (que dizem quando um evento
ou uma propriedade foi recusado e por qual regra, sem o valor recusado, e somem em 14 dias), os
dados da conta e da cobrança, o registro do item 2.7, os eventos do projeto (consultados só no
necessário, como diz o Acordo de Tratamento de Dados) e o que nos for relatado. **Não guardamos IP
nem navegador completo para isso, porque o serviço não os guarda.**

| Dado | Para quê | Base legal (LGPD) | Por quanto tempo |
|---|---|---|---|
| Registro da verificação: o que foi visto, os avisos enviados, a sua resposta, a medida tomada e o motivo | Aplicar as medidas da Cláusula 18 dos Termos de forma justa e poder demonstrá-las | Legítimo interesse (art. 7º, IX) e exercício regular de direitos (art. 7º, VI) | Na caixa de e-mail, pelos prazos do item 2.3 (até 5 anos depois do fim do contrato) |

Só guardamos outros dados além dos prazos desta política se uma lei, uma ordem judicial ou uma
requisição de autoridade competente mandar, ou se forem necessários para um processo judicial,
administrativo ou arbitral, e só os dados alcançados, pelo tempo exigido (art. 7º, VI, e art. 16,
I).

## 3. Com quem compartilhamos

3.1. **Não vendemos dados pessoais** e não os compartilhamos para publicidade.

3.2. Usamos os provedores abaixo, que tratam dados por nossa conta (operadores) ou, quando indicado,
por conta própria:

| Provedor | O que faz | Que dados recebe | Onde |
|---|---|---|---|
| **Vercel Inc.** (EUA) | Hospeda o painel e a página inicial | Tudo o que você vê e envia no painel; IP e navegador de quem acessa (registros por 1 dia) | Funções em São Paulo; processamento principal nos EUA |
| **Amazon Web Services (AWS)** | API, rotinas automáticas, registros técnicos (14 dias), guarda de segredos, arquivos de exportação (7 dias) | Dados dos itens 2.1, 2.2 e 2.7, de passagem; registros técnicos sem e-mail nem IP | São Paulo (sa-east-1); rede de distribuição mundial na frente da API, sem guardar requisições |
| **Neon** (Databricks, Inc., EUA) | Banco de dados | Os dados dos itens 2.1, 2.2 (conta, aceite, configuração, uso e exportações), 2.4 e 2.7 | Servidores em São Paulo; empresa nos EUA; cópias de segurança por até 30 dias |
| **Amazon SES** (AWS) | Envia os e-mails do serviço (item 2.6), sem rastreamento de abertura ou clique | E-mail do destinatário e conteúdo do e-mail. Endereços que devolvem o e-mail ou o marcam como spam entram na lista de supressão da nossa conta da AWS, para não receberem mais e-mails, até serem retirados | São Paulo (sa-east-1) |
| **Stripe** (Stripe Brasil Soluções de Pagamento – Instituição de Pagamento Ltda. e Stripe, LLC, EUA) | Cobrança, página de pagamento, portal de assinatura e e-mails de cobrança | Dados de cobrança e do cartão (item 2.2); o Stripe calcula a impressão do cartão (item 2.7) | Brasil e EUA. O Stripe também trata dados **como controlador**, para prevenção a fraude e cumprimento de obrigações legais dele, conforme a política de privacidade do Stripe |
| **ImprovMX** (ImprovMX Incorporated, EUA) | Encaminha os e-mails enviados a hello@pyxis-analytics.dev | Mensagem em trânsito; registro de remetente e assunto por 7 dias | Recepção transitória na França; empresa nos EUA |
| **Google** (Google LLC, EUA) | Caixa de e-mail onde ficam as mensagens enviadas a hello@pyxis-analytics.dev | Mensagens recebidas e enviadas | EUA e outros países. É uma conta pessoal, sem contrato de operador: o Google trata as mensagens **como controlador**, conforme a política de privacidade do Google |

3.3. **Autoridades.** Só entregamos dados a autoridades quando houver ordem judicial ou requisição
de quem tem competência legal para fazê-la, e só o que for exigido.

3.4. **Clientes e pessoas com acesso.** As pessoas com acesso a um projeto, inclusive o dono da
conta, veem em Configurações a lista de e-mails de quem tem acesso a ele. Sessões, tokens,
aplicativos conectados e a escolha sobre o resumo semanal são individuais: ninguém vê os de outra
pessoa. As pessoas com acesso
podem ver a situação da conta e o uso do mês (por exemplo, para entender uma pausa pela cota); só o
dono da conta abre o portal de cobrança do Stripe.

3.5. **Sucessão.** Se o serviço passar a ser prestado por uma empresa aberta pelo controlador ou por
quem assumir o serviço, os dados passam a ela, com as mesmas regras desta política, e avisamos antes.

3.6. **Aplicativos que você conecta.** Se você conectar o Claude ou o Claude Code ao Pyxis (Termos
de Uso, Cláusula 13.10), ou usar um token de acesso num programa, os dados que o aplicativo pedir
saem do Pyxis para ele, a seu pedido. Pelo conector do Claude, eles vão para a **Anthropic**
(Anthropic, PBC, EUA): os números dos projetos que você pode abrir e, porque o aplicativo lê quem
está conectado, **o seu e-mail de acesso**. A Anthropic **não é nossa operadora**: ela trata esses
dados pelos termos e pela política de privacidade que valem entre ela e você. A página de
consentimento diz, antes do **Permitir**, que esses dados vão para a Anthropic, nos Estados Unidos
(item 4.4). Para reconhecer o
Claude e o Claude Code, o Pyxis lê o documento público que a Anthropic publica sobre cada um; essa
leitura não leva dados seus. Você vê e revoga as suas conexões em Configurações → Aplicativos
conectados.

## 4. Transferência internacional

4.1. Os nossos bancos de dados ficam em São Paulo, mas vários provedores do item 3 são empresas dos
Estados Unidos e tratam ou guardam parte dos dados lá: a Vercel (painel e página inicial), o Stripe
(cobrança), o ImprovMX (encaminhamento de e-mail, com recepção transitória na França) e o Google
(caixa de e-mail). Os e-mails que o serviço envia saem pela AWS em São Paulo. A Neon (Databricks) guarda os dados em São Paulo, mas é uma
empresa dos EUA cujas equipes podem acessá-los de lá. Se você conectar o Claude ou o Claude Code
(item 3.6), os dados que o aplicativo pedir também vão para os Estados Unidos, para a Anthropic, por
escolha sua.

4.2. **Forma, finalidade e duração:** os dados vão a esses provedores para que eles prestem o
serviço descrito no item 3, pelos prazos do item 2, ou pelos prazos dos registros de cada provedor
indicados no item 3.

4.3. **Países de destino:** Estados Unidos; França (só a recepção transitória do ImprovMX); e outros
países onde o Google mantém operações.

4.4. **Base:** o envio à Anthropic quando você conecta o Claude ou o Claude Code (item 3.6) se
apoia no seu **consentimento específico e em destaque** (art. 33, VIII): a página de consentimento
informa, antes do **Permitir**, que os dados que o aplicativo pedir, inclusive o seu e-mail, vão
para a Anthropic, nos Estados Unidos, e a conexão só existe se você permitir; você retira o
consentimento a qualquer momento revogando a conexão em Configurações → Aplicativos conectados.
Quando a transferência é necessária para executar o contrato com você (cobrança, login no painel e
respostas às suas mensagens), ela se apoia no art. 33, IX, combinado com
o art. 7º, V, da LGPD. A França faz parte da União Europeia, reconhecida pela ANPD como de nível
adequado de proteção (Resolução CD/ANPD nº 32/2026). Nos demais casos, os provedores se comprometem,
nos seus contratos de tratamento de dados, a proteger os dados e a tratá-los só para prestar o
serviço; esses contratos **ainda não incluem as cláusulas-padrão aprovadas pela ANPD** (Resolução
CD/ANPD nº 19/2024). Acompanhamos a adoção delas pelos provedores e trocaremos de provedor ou de
mecanismo quando for preciso.

4.5. **Responsabilidades e segurança:** cada provedor responde pela segurança no seu ambiente; nós
respondemos perante você pelo tratamento como um todo. As medidas que adotamos estão no item 5.

4.6. Você pode pedir a íntegra das cláusulas contratuais de cada provedor, que respondemos em até
15 dias, e exercer os seus direitos pelo canal do item 1, inclusive o de peticionar contra nós à
ANPD.

## 5. Segurança

5.1. Entre as medidas que adotamos:

1. conexões cifradas (HTTPS com TLS 1.2 ou superior) em todo o caminho, inclusive até o banco de
   dados, com verificação de certificado;
2. dados do banco cifrados em repouso pelo provedor;
3. login sem senha, por código de uso único válido por 10 minutos, com limite de tentativas;
4. códigos, sessões, chaves secretas, tokens e credenciais dos aplicativos conectados guardados só
   como hash;
5. sessões com prazo máximo e encerramento depois de 24 horas sem uso; você vê e encerra as suas
   sessões em Configurações;
6. registros técnicos sem e-mail, IP, token ou chave, guardados por 14 dias;
7. alarmes para tentativas de login suspeitas e erros do serviço;
8. código aberto, com revisão automática de segurança e de dependências.

5.2. Nenhum sistema é perfeitamente seguro. Se ocorrer um incidente de segurança que possa trazer
risco ou dano relevante a você, comunicamos você e a ANPD nos prazos da regulamentação (Resolução
CD/ANPD nº 15/2024).

## 6. Seus direitos

6.1. Você pode pedir, a qualquer momento (LGPD, art. 18):

1. a confirmação de que tratamos dados seus;
2. o acesso a eles;
3. a correção de dados incompletos, inexatos ou desatualizados (por exemplo, trocar o e-mail de
   acesso);
4. a anonimização, o bloqueio ou a eliminação de dados desnecessários, excessivos ou tratados em
   desconformidade com a LGPD;
5. a portabilidade, nos termos da regulamentação da ANPD; enquanto ela não existir, entregamos os
   seus dados em arquivo de formato aberto (JSON);
6. a informação sobre com quem compartilhamos os seus dados (item 3);
7. a revisão de decisões tomadas só por meios automatizados (item 7);
8. a oposição a um tratamento baseado em legítimo interesse, se você entender que ele descumpre a
   LGPD;
9. a eliminação dos dados, nos casos previstos na lei. Alguns dados precisam ser guardados mesmo
   assim, por obrigação legal (por exemplo, os de cobrança) ou para defesa em processo (LGPD,
   art. 16).

6.2. **Como pedir:** escreva para hello@pyxis-analytics.dev, de preferência a partir do e-mail
cadastrado. Se não for possível confirmar que o pedido é seu, pediremos uma confirmação simples
antes de atender.

6.3. **Prazo:** confirmamos o recebimento e respondemos em **até 15 dias**.

6.4. **Pessoas com acesso a um projeto:** o acesso ao painel existe porque o dono de uma conta
convidou você. Se você pedir a eliminação do seu e-mail, o seu acesso termina; avisamos o dono da
conta. Se você for o dono da conta, a eliminação do seu cadastro exige encerrar a conta (Termos de
Uso, Cláusula 11.6), e os dados de cobrança continuam guardados pelo prazo legal (item 2.2).

6.5. **Visitantes da página inicial:** como não guardamos IP, cookie nem identificador persistente,
não temos como localizar as suas visitas anônimas. Você pode desligar a medição na própria página ou
ligar o sinal Global Privacy Control no seu navegador.

6.6. Você também pode peticionar à **Agência Nacional de Proteção de Dados (ANPD)**, em
`gov.br/anpd`, e aos órgãos de defesa do consumidor.

## 7. Decisões automatizadas

Não tomamos decisões sobre você baseadas só em tratamento automatizado que afetem os seus interesses,
nem criamos perfis seus. Os efeitos automáticos do serviço são regras iguais para todos, que não
avaliam a sua pessoa:

1. de segurança: depois de tentativas demais, um pedido de código ou de login é recusado por alguns
   minutos;
2. do contrato: a recepção de eventos pausa quando a conta chega a 150% do limite mensal no plano
   pago, ou a 100% no plano grátis; o acesso acompanha o plano e a situação da assinatura no Stripe;
   e a conta do plano grátis sem eventos é apagada depois do aviso (Termos de Uso, Cláusulas 7.2,
   7.6 e 9).

A coincidência de impressão de cartão (item 2.7) e as medidas por abuso (Termos de Uso,
Cláusula 18) são sempre decididas por uma pessoa. Se algo disso atrapalhar você, fale conosco.

## 8. Crianças e adolescentes

O serviço é contratado por maiores de 18 anos, e a página inicial não se dirige a crianças nem a
adolescentes. Se soubermos que tratamos dados de uma criança sem base legal, apagamos.

## 9. Mudanças nesta política

9.1. Publicamos cada nova versão com a data de vigência. Se uma mudança afetar a forma como tratamos
os seus dados, avisamos os clientes e as pessoas com acesso por e-mail com pelo menos 30 dias de
antecedência, salvo mudança exigida por lei, que pode valer antes.

9.2. As versões anteriores ficam disponíveis a pedido.

## 10. Contato

**{{seller.name}}**, controlador. **hello@pyxis-analytics.dev**. **{{seller.address}}**.
