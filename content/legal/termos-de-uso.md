# Termos de Uso do Pyxis

**Versão {{terms.version}}, vigente a partir {{terms.effectiveFrom}}.**

Estes termos são o contrato entre você e nós para o uso do **Pyxis hospedado**: o serviço de
análise de uso de sites que operamos em `pyxis-analytics.dev`, `app.pyxis-analytics.dev` e
`api.pyxis-analytics.dev`. Leia com atenção, em especial os trechos marcados com **Atenção**, que
limitam direitos.

## Resumo do contrato

Este resumo não substitui o texto completo, mas mostra o que mais importa antes de contratar.

1. **Quem oferece:** {{seller.name}}, pessoa física, CPF {{seller.taxId}} (Cláusula 1).
2. **Preço:** R$ 39,00 por mês ou R$ 390,00 por ano, no cartão de crédito, pelo Stripe, com
   **renovação automática** até você cancelar (Cláusula 8).
3. **Teste grátis:** 14 dias, uma vez por cliente. O cartão é pedido no início, e o Stripe manda um
   lembrete 7 dias antes do fim. **Se você não cancelar até o fim do teste, a primeira cobrança
   acontece no 15º dia** (Cláusulas 6.4 e 8.3).
4. **Limites do plano:** até 100 mil eventos por mês, até 3 sites, até 3 pessoas no painel
   (contando com você) e 13 meses de histórico. Avisamos quando a conta chega a 80% e a 100% dos
   eventos do mês. **Atenção: a 150%, a recepção de eventos pausa até o dia 1º do mês seguinte**, e
   os eventos enviados durante a pausa se perdem. Nada é cobrado além do preço (Cláusula 7).
5. **Arrependimento:** reembolso integral se você desistir em até 7 dias depois da primeira cobrança.
   Encerrando a conta no painel nesse prazo, o estorno é automático (Cláusula 10).
6. **Cancelamento:** a qualquer momento, de dois jeitos. No portal do Stripe, o acesso continua até o
   fim do período pago. Encerrando a conta no painel, **o acesso termina na hora**. **Atenção:
   depois dos 7 dias do arrependimento, não há reembolso proporcional do período já pago** em
   nenhum dos dois (Cláusula 11).
7. **Exclusão dos dados:** **30 dias depois do fim do acesso, a conta, os projetos e todos os
   eventos são apagados de vez.** Até lá, você exporta os eventos pelo painel (Cláusula 11).
8. **Disponibilidade:** **Atenção: não há garantia de disponibilidade (SLA)**; fazemos o melhor
   esforço para manter o serviço no ar (Cláusula 15). Suporte por e-mail, com resposta em até 2 dias
   úteis (Cláusula 16).
9. **Suas principais obrigações:** **não enviar dados pessoais nos eventos** (nome, e-mail, CPF,
   telefone etc.), informar a medição aos visitantes do seu site e não usar o serviço de forma
   abusiva (Cláusula 12).
10. **Atenção: suspensão e encerramento por abuso.** Se houver abuso (por exemplo, dados pessoais
    nos eventos, medir quem pediu para não ser medido, tráfego forjado, ataque, fraude ou teste
    grátis repetido), podemos suspender a parte afetada do serviço e, em caso grave ou repetido,
    encerrar o contrato. Em regra avisamos antes e damos prazo para corrigir; sempre dizemos o
    motivo e você pode contestar (Cláusula 18).
11. **Dados pessoais:** você é o controlador dos dados dos visitantes do seu site; nós somos o
    operador (Cláusula 14 e Acordo de Tratamento de Dados).

---

## Cláusula 1 — Quem oferece o serviço e como falar conosco

1.1. O Pyxis hospedado é oferecido por **{{seller.name}}**, pessoa física, inscrito no CPF sob o
nº **{{seller.taxId}}**, com endereço em **{{seller.address}}** ("nós"). **Pyxis** é o nome do serviço.

1.2. Contato para qualquer assunto, inclusive cancelamento, arrependimento, suporte, contestação de
uma suspensão e dados pessoais: **hello@pyxis-analytics.dev**.

1.3. "Você" é a pessoa natural ou jurídica que contrata o serviço para medir um ou mais sites.

## Cláusula 2 — Palavras usadas nestes termos

2.1. **Serviço:** o Pyxis hospedado por nós: a API que recebe e responde os dados
(`api.pyxis-analytics.dev`), o painel (`app.pyxis-analytics.dev`), o resumo semanal por e-mail e o
acesso por tokens, inclusive pelo servidor MCP.

2.2. **Rastreador:** o pacote `pyxis-analytics` (código aberto) que você instala no seu site para
enviar eventos ao serviço.

2.3. **Projeto:** a configuração de um site seu no serviço (nome, endereços autorizados, fuso
horário, evento de conversão, chaves e eventos).

2.4. **Evento:** cada registro enviado pelo rastreador ou pela sua integração, como uma página vista
ou uma ação que você marcou.

2.5. **Pessoas com acesso:** o dono da conta e as pessoas que ele convida para entrar no painel.

2.6. **Período:** o mês ou o ano pago da sua assinatura.

2.7. **Consumidor:** quem contrata o serviço como destinatário final, nos termos do art. 2º do
Código de Defesa do Consumidor (Lei nº 8.078/1990).

2.8. **Conta:** o cadastro de quem contrata, ao qual pertencem a assinatura, os projetos e as
pessoas com acesso.

2.9. **Dono da conta:** a pessoa que fez o cadastro (ou que você indicou quando criamos a conta a seu
pedido) e que, em seu nome, administra projetos, chaves, pessoas, exportações e cobrança.

2.10. **Fim do acesso:** a data em que a conta deixa de receber eventos e de poder mudar os projetos:
o fim do período pago ou do teste depois de um cancelamento (Cláusula 11.2), o encerramento da conta
(Cláusulas 11.6 e 18.7) ou o fim da assinatura por falta de pagamento (Cláusula 9.2).

## Cláusula 3 — Aceite, quem pode contratar e documentos do contrato

3.1. Você aceita estes termos de um destes jeitos:

1. **no cadastro pelo painel** (`app.pyxis-analytics.dev/sign-up`), marcando a caixa de aceite dos
   Termos de Uso, do Acordo de Tratamento de Dados e da Política de Privacidade, que mostra o número
   da versão. Guardamos a versão aceita e a data e a hora do aceite (sem guardar o seu IP). A página
   de pagamento do Stripe pede de novo o aceite antes da assinatura;
2. **quando criamos a conta a seu pedido** (Cláusula 6.2), respondendo ao nosso e-mail com a
   confirmação do aceite da versão indicada nele, antes de liberarmos o acesso.

Se você não concordar, não se cadastre nem assine.

3.2. Para contratar, você precisa ter 18 anos ou mais e capacidade civil. Se contratar em nome de
uma empresa, você declara que tem poderes para isso, e a empresa passa a ser "você".

3.3. O serviço é oferecido a clientes no Brasil, com preço em reais.

3.4. O contrato é formado por estes termos e por dois anexos:

1. **Anexo 1 — Acordo de Tratamento de Dados Pessoais**, que regula os dados dos visitantes dos
   seus sites;
2. **Anexo 2 — Política de Privacidade do Pyxis**, que explica os dados que tratamos sobre você e
   sobre as pessoas com acesso.

Em assunto de dados pessoais, o Anexo 1 prevalece sobre estes termos.

3.5. Depois da contratação, o e-mail de boas-vindas traz a versão aceita e o endereço permanente
dessa versão, onde você pode salvar ou imprimir o texto completo. A pedido, mandamos o texto em
arquivo. As versões anteriores ficam disponíveis a pedido.

## Cláusula 4 — O que o serviço faz

4.1. O rastreador instalado no seu site envia ao serviço as páginas vistas e os eventos que você
marcar. O serviço guarda esses eventos e mostra a análise no painel, só para as pessoas com acesso:
visão geral, visitas, linha do tempo de cada visita, funil, funcionalidades usadas, falhas das
chamadas à API do seu site, aquisição, aparelhos e horários.

4.2. O que o serviço **não** faz, por desenho:

1. não cria cookies no seu site;
2. não guarda o endereço IP do visitante: o IP é usado só na memória do servidor, por alguns
   minutos, para limitar abusos;
3. não guarda o navegador completo (user agent), só a categoria do aparelho e a família do
   navegador e do sistema;
4. não guarda a cidade, só o país e o estado;
5. não guarda o endereço completo da página: só o caminho em forma de modelo, sem parâmetros,
   exceto os de campanha (`utm_source`, `utm_medium`, `utm_campaign`);
6. não envia nada quando o navegador do visitante pede para não ser rastreado (Global Privacy
   Control ou Do Not Track);
7. não reconhece o visitante anônimo em outra visita: cada visita tem um número aleatório que some ao
   fechar a aba ou depois de 30 minutos sem atividade.

4.3. **Atenção:** os números do painel são uma medição, não uma contagem exata. Visitas de quem
bloqueia o rastreador, de quem pede para não ser rastreado, de robôs e de quem estava sem conexão
não aparecem, e eventos enviados enquanto o serviço estiver fora do ar ou com a recepção pausada
(Cláusulas 7.2, 15 e 18) se perdem (o rastreador tenta de novo por alguns segundos enquanto a
página está aberta, mas não quando a recepção está pausada).

4.4. Também fazem parte do plano:

1. **resumo semanal por e-mail**, toda segunda-feira, que cada pessoa com acesso pode desligar em
   Configurações;
2. **tokens de acesso só de leitura**, criados em Configurações, para programas e agentes de
   inteligência artificial consultarem os mesmos números do painel;
3. o **servidor MCP** (`pyxis-mcp`), programa de código aberto que roda no seu computador e usa um
   token de acesso;
4. as rotas da API para **excluir ou copiar os dados de uma pessoa identificada**, com a chave
   secreta do projeto;
5. a **exportação de todos os eventos de um projeto** em arquivo, pelo painel (Cláusula 11.5).

## Cláusula 5 — Código aberto e serviço hospedado

5.1. O código do Pyxis é aberto, sob a licença MIT, nos repositórios públicos `pyxis-api`,
`pyxis-sdk`, `pyxis-web` e `pyxis-mcp`. Qualquer pessoa pode ler, copiar, modificar e rodar o
código por conta própria, nos termos dessa licença.

5.2. Estes termos tratam só do **serviço hospedado por nós**. Nada aqui restringe o que a licença
MIT permite. Se você rodar o Pyxis na sua própria infraestrutura, estes termos não se aplicam a
essa instalação.

## Cláusula 6 — Como começa: cadastro no painel ou conta criada a pedido

6.1. **Cadastro pelo painel.**

1. Em `app.pyxis-analytics.dev/sign-up`, você escolhe o plano (mensal ou anual), informa o seu
   e-mail, aceita os termos (Cláusula 3.1) e confirma o e-mail com um código de 6 dígitos enviado a
   ele.
2. Em seguida, você informa o cartão na página de pagamento do Stripe, que começa o teste grátis
   (Cláusula 8.3).
3. Confirmada a assinatura pelo Stripe, a conta fica pronta: você cria os seus projetos no painel
   (até 3), com o endereço do site, o fuso horário e, se quiser, o evento de conversão, e recebe a
   chave pública e o trecho de instalação. Quem fez o cadastro é o dono da conta.

Se você não concluir a página de pagamento do Stripe, a conta fica incompleta, sem projetos, e é
apagada 7 dias depois do cadastro. Até lá, você pode concluir a assinatura entrando de novo no
painel.

6.2. **Conta criada a pedido.** Também podemos criar a conta por você, a pedido feito por
hello@pyxis-analytics.dev, por exemplo quando não for possível concluir o cadastro pelo painel ou
numa conta gratuita que oferecermos. Nesse caso, combinamos por e-mail o plano e a forma de
pagamento, o aceite segue a Cláusula 3.1, item 2, e liberamos o acesso em até 2 dias úteis depois do
aceite e, se houver cobrança, da assinatura. Numa conta gratuita não há cobrança; o resto destes
termos vale igual, e podemos encerrar a gratuidade com aviso de 30 dias, depois do qual você pode
assinar o plano ou sair.

6.3. Podemos recusar um cadastro ou um pedido de conta só por motivo objetivo: (a) o site não ser
compatível com o uso aceitável (Cláusula 12); (b) o volume esperado passar muito dos limites do plano;
(c) a mesma pessoa ou empresa ter tido conta encerrada por abuso grave (Cláusula 18.7) nos 12 meses
anteriores; ou (d) teste grátis repetido (Cláusula 6.4). Se recusarmos depois de uma cobrança,
devolvemos o valor integral.

6.4. **O teste grátis vale uma vez por cliente:** uma vez por conta (uma conta que já teve
assinatura não ganha novo teste ao assinar de novo) e uma vez por pessoa ou empresa, mesmo que em
outra conta, com outro e-mail ou outro cartão. Para perceber um teste repetido com o mesmo cartão,
guardamos por 12 meses a "impressão" do cartão calculada pelo Stripe, nunca o número do cartão, como
explica a Política de Privacidade (item 2.7). O que acontece num teste repetido está na Cláusula 18.11.

## Cláusula 7 — Plano e limites

7.1. O plano inclui:

| Item | Limite |
|---|---|
| Eventos recebidos por mês, somando todos os projetos da conta | até 100.000 |
| Sites (projetos) | até 3 |
| Pessoas com acesso ao painel | até 3, contando com o dono da conta |
| Histórico | 13 meses (eventos mais antigos são apagados todos os dias) |
| Resumo semanal por e-mail | incluído |
| Tokens de acesso e servidor MCP | incluídos |
| Exportação dos eventos de um projeto | pelo painel, até 3 por projeto por dia |
| Suporte | por e-mail, resposta em até 2 dias úteis |

7.2. **Atenção: uso acima do limite.**

1. O uso do mês é a soma dos eventos guardados em todos os projetos da conta com data naquele mês.
   O mês é o mês civil contado em UTC (Tempo Universal Coordenado), que no horário de Brasília começa
   às 21h do último dia do mês anterior.
2. O serviço mede o uso uma vez por dia, de madrugada. O uso medido aparece em Conta e cobrança, no
   painel.
3. Quando a medição diária constatar 80% e, depois, 100% do limite (80 mil e 100 mil eventos),
   avisamos o dono da conta por e-mail, uma vez por nível em cada mês. **Até 150%, nada é cortado.**
4. **Quando a medição diária constatar 150% do limite (150 mil eventos), a recepção de eventos de
   todos os projetos da conta pausa até o dia 1º do mês seguinte**, e avisamos por e-mail. Durante
   a pausa, o serviço recusa os eventos (resposta `403 quota_exceeded`), que **não são guardados e
   não podem ser recuperados**. O painel continua mostrando os dados já guardados. A recepção volta
   sozinha no início do mês seguinte. Como a medição é diária, a conta pode passar um pouco de 150%
   antes da pausa começar.
5. **Não cobramos nada além do preço do plano** pelo uso acima do limite.
6. Se a conta passar do limite com frequência, podemos propor por e-mail um plano ou um preço
   adequados ao volume. Aceitar é opcional.

7.3. O serviço tem limites técnicos contra abuso, como a quantidade de lotes de eventos por minuto
por endereço e por projeto e o tamanho de cada lote. Esses limites podem mudar para proteger o
serviço, sem reduzir o limite mensal de eventos do seu plano.

7.4. O apagamento dos eventos com mais de 13 meses é automático e faz parte do serviço: **não
guardamos histórico mais antigo**.

## Cláusula 8 — Preço, teste grátis e cobrança

8.1. **Preço:** R$ 39,00 por mês ou R$ 390,00 por ano. Não há taxa de instalação nem outras
cobranças.

8.2. **Forma de pagamento:** cartão de crédito, processado pelo Stripe. **Não vemos nem guardamos
o número do seu cartão.** Hoje não aceitamos Pix nem boleto.

8.3. **Teste grátis:** 14 dias, contados da confirmação da assinatura na página de pagamento do
Stripe, uma vez por cliente (Cláusula 6.4). O cartão é obrigatório no início, e nada é cobrado
durante o teste. O Stripe manda um lembrete por e-mail 7 dias antes do fim do teste, com o link para
cancelar. **Se você não cancelar até o fim do teste (pelo portal do Stripe ou encerrando a conta no
painel), a primeira cobrança acontece no 15º dia** e, a partir daí, a cada novo período; na fatura
do cartão, essa primeira cobrança vem indicada como fim do teste. Cancelando durante o teste, nada é
cobrado. Uma conta que já teve assinatura não tem novo teste ao assinar de
novo: a cobrança começa no dia da nova assinatura.

8.4. **Renovação automática:** a assinatura se renova sozinha ao fim de cada período, com cobrança
no mesmo cartão, até que você cancele (Cláusula 11). A data da próxima cobrança aparece em Conta e
cobrança, no painel, e o Stripe envia o recibo de cada cobrança por e-mail.

8.5. **Mudança de preço:** avisamos por e-mail com **pelo menos 30 dias de antecedência**. O novo
preço só vale a partir da renovação seguinte ao fim desse prazo; **o período já pago não muda de
preço**. Se não concordar, cancele antes da renovação, sem custo.

8.6. **Nota fiscal:** o recibo de cada cobrança é enviado pelo Stripe. A emissão de nota fiscal
depende do nosso enquadramento tributário; se você precisar de nota fiscal, pergunte antes de
contratar.

## Cláusula 9 — Falta de pagamento

9.1. Se a cobrança de uma renovação falhar, o Stripe avisa você por e-mail, com um link para
atualizar o cartão, e tenta de novo até 8 vezes nas 2 semanas seguintes; o painel também mostra um
aviso (Conta e cobrança → Gerenciar cobrança). Se o banco pedir que você confirme o pagamento (3D
Secure), o Stripe manda o link de confirmação por e-mail. O Stripe também avisa por e-mail quando o
cartão cadastrado estiver para vencer. Durante esse prazo, o serviço continua funcionando.

9.2. Se o pagamento não for feito depois dessas tentativas (até 2 semanas da primeira falha), ou se
a confirmação pedida pelo banco não for feita em 15 dias, o Stripe encerra a assinatura, e esse é o
fim do acesso: até o dia seguinte, as chaves dos projetos são revogadas e os sites deixam
de enviar eventos; o painel fica disponível só para consulta e exportação até a exclusão.

9.3. Os dados são apagados 30 dias depois do fim do acesso (Cláusula 11.4). Até lá, você pode voltar
como diz a Cláusula 11.5, item 3, sem perder dados.

## Cláusula 10 — Direito de arrependimento

10.1. Como a contratação é feita pela internet, o consumidor pode desistir do contrato em até 7 dias
da contratação (Código de Defesa do Consumidor, art. 49). Durante o teste grátis, nada é cobrado:
basta cancelar.

10.2. **Ampliamos esse direito para todos os clientes:** se você desistir em até **7 dias depois da
primeira cobrança** (do plano mensal ou do anual), devolvemos **o valor integral** dessa cobrança,
sem precisar explicar o motivo.

10.3. Para exercer, use qualquer um destes meios:

1. **encerre a conta no painel** (Conta e cobrança → Encerrar a conta), o mesmo canal usado para
   contratar. Dentro do prazo, o estorno do valor integral é pedido ao Stripe automaticamente, e a
   tela mostra o valor devolvido;
2. ou mande um e-mail para hello@pyxis-analytics.dev, a partir do e-mail do dono da conta, com a
   palavra "arrependimento".

Cancelar a assinatura no portal do Stripe, sozinho, não gera o estorno: use um dos dois meios acima.

10.4. Pelo painel, a confirmação aparece na hora, na tela, e também por e-mail. Pelo e-mail,
confirmamos o recebimento pela mesma via e pedimos o estorno ao Stripe em até 2 dias úteis. Se o
estorno automático falhar, nós o pedimos à mão em até 2 dias úteis e avisamos você. O Stripe
comunica o estorno à administradora do cartão; o prazo para ele aparecer na fatura depende da
administradora.

10.5. Com o arrependimento, a conta é encerrada como na Cláusula 11.6: o acesso termina na hora e os
dados seguem a Cláusula 11.4.

## Cláusula 11 — Cancelamento e encerramento da conta por você

11.1. Você pode sair a qualquer momento, de dois jeitos, com efeitos diferentes:

1. **cancelar a assinatura no portal do Stripe** (Conta e cobrança → Gerenciar cobrança, ou pelo link
   dos e-mails do Stripe): vale ao fim do período pago ou do teste (Cláusula 11.2);
2. **encerrar a conta no painel** (Conta e cobrança → Encerrar a conta): vale na hora
   (Cláusula 11.6).

Se preferir, peça por e-mail para hello@pyxis-analytics.dev, a partir do e-mail do dono da conta,
dizendo qual dos dois quer. Sem essa indicação, fazemos o cancelamento do item 1. Confirmamos o
recebimento pela mesma via.

11.2. **Cancelamento no portal do Stripe:** o acesso continua até o fim do período pago (ou do
teste) e **não há nova cobrança**. Até o dia seguinte ao fim do acesso, as chaves dos projetos são
revogadas e os sites deixam de enviar eventos; o painel fica disponível só para consulta e
exportação até a exclusão.

11.3. **Atenção: fora do direito de arrependimento (Cláusula 10), não há reembolso proporcional do
período já pago,** nem no plano mensal nem no anual, em nenhum dos dois jeitos de sair. Há
devolução só nos casos que estes termos preveem expressamente: Cláusulas 6.3, 15.7, 18.9, 18.10,
18.13, 20.2, 21.3 e 22.1 e Cláusulas 9.2 e 16.2 do Anexo 1.

11.4. **Atenção: exclusão dos dados.** **30 dias depois do fim do acesso** (Cláusula 2.10), uma
rotina automática apaga definitivamente a conta, os projetos e tudo o que é deles, como descrito na
Cláusula 12 do Anexo 1. Avisamos o dono da conta por e-mail no fim do acesso, 7 dias antes da
exclusão e quando ela for feita. Depois disso, **não há como recuperar os dados**. Continuam
guardados só os registros de cobrança que a lei manda guardar, o registro de prevenção de teste
grátis repetido (Política de Privacidade, itens 2.2 e 2.7) e o que uma lei ou uma ordem de
autoridade mandar preservar (Cláusula 12.6 do Anexo 1).

11.5. **Exportar os eventos e voltar.**

1. O dono da conta exporta todos os eventos de um projeto em Configurações do projeto. O arquivo
   (CSV compactado) fica pronto em alguns minutos, o aviso chega por e-mail, e o arquivo pode ser
   baixado no painel por **7 dias**, com um link novo a cada download, válido por 5 minutos; depois
   disso, o arquivo é apagado. São até 3 exportações por projeto por dia. A exportação funciona
   durante o contrato e nos 30 dias depois do fim do acesso.
2. Se a exportação pelo painel não funcionar, peça a cópia por hello@pyxis-analytics.dev: enviamos o
   arquivo em até 10 dias úteis do pedido e, se o pedido chegar perto da data de exclusão, adiamos a
   exclusão até entregar a cópia.
3. Antes da exclusão, você pode **voltar** sem perder dados: em Conta e cobrança, escolha "Assinar
   de novo", ou escreva para hello@pyxis-analytics.dev e reativamos a assinatura. Em qualquer dos
   dois caminhos, não há novo teste grátis e a cobrança começa na reativação. As chaves
   revogadas não voltam: você cria chaves novas no painel e as troca no seu site.

11.6. **Encerrar a conta pelo painel.** Só o dono da conta encerra, em Conta e cobrança, digitando o
e-mail dele para confirmar. **Atenção: o encerramento vale na hora e não pode ser desfeito pelo
painel:**

1. a assinatura é cancelada no Stripe imediatamente, sem novas cobranças;
2. as chaves de todos os projetos são revogadas na hora, e os sites deixam de enviar eventos;
3. o painel fica disponível só para consulta e exportação (Cláusula 11.5) até a exclusão;
4. os dados são apagados 30 dias depois do encerramento (Cláusula 11.4);
5. se o encerramento for feito em até 7 dias da primeira cobrança, o valor dessa cobrança é estornado
   por inteiro (Cláusula 10); fora disso, **não há devolução proporcional do período pago**
   (Cláusula 11.3);
6. a tela confirma o encerramento, a data da exclusão e o valor estornado, e mandamos a confirmação
   por e-mail.

Encerrar durante o teste grátis não gera cobrança. Se o Stripe não conseguir cancelar a assinatura,
nada é encerrado e a tela avisa. Se mudar de ideia antes da exclusão, vale a Cláusula 11.5, item 3.

## Cláusula 12 — Uso aceitável, abuso e suas responsabilidades

12.1. Você se compromete a usar o serviço de boa-fé, só para medir o uso dos seus sites. **É abuso**
qualquer uma das condutas abaixo, praticada por você, pelas pessoas com acesso à sua conta ou por
quem usar as suas chaves ou tokens com a sua permissão:

*Dados pessoais e privacidade*

1. enviar **dados pessoais diretos** nos eventos: nome, e-mail, telefone, CPF, endereço, número de
   documento, texto digitado pelo visitante ou qualquer dado que identifique uma pessoa sozinho;
2. enviar **dados pessoais sensíveis** (saúde, origem racial ou étnica, religião, opinião política,
   filiação sindical, vida sexual, dado genético ou biométrico);
3. tentar **contornar a barreira de dados pessoais** do servidor (Cláusula 12.2), por exemplo
   dividindo, codificando ou disfarçando um e-mail, um documento ou um telefone para que passem por
   ela;
4. usar na função `identify` algo diferente de um **identificador interno e opaco** da conta no seu
   sistema, como o e-mail, o CPF ou o telefone;
5. **medir quem pediu para não ser medido**: desligar, contornar ou alterar o respeito do rastreador
   aos sinais Global Privacy Control e Do Not Track e à opção de não ser medido (`optOut`), ou enviar
   eventos dessas pessoas por outro caminho;
6. usar o serviço junto com técnicas de impressão digital do navegador (fingerprinting) ou outros
   meios para reconhecer visitantes anônimos;

*Tráfego e segurança*

7. enviar **eventos forjados ou automatizados** para inflar, distorcer ou sobrecarregar os números ou
   o serviço (testes razoáveis da sua própria instalação não são abuso);
8. enviar eventos a partir de **sites que não são seus** nem de quem autorizou você, ou cadastrar
   como origem de um projeto um site alheio;
9. usar a **chave pública, a chave secreta ou o token de outro cliente**;
10. **atacar o serviço**, tentar acessar dados de outros clientes ou partes do serviço que não são
    suas, ou testar vulnerabilidades sem a nossa autorização por escrito (relatar de boa-fé uma falha
    de segurança a hello@pyxis-analytics.dev não é abuso);
11. **contornar os limites** de taxa, a cota mensal (Cláusula 7.2) ou os limites do plano
    (Cláusula 7.1), por exemplo dividindo o envio de um mesmo site entre várias contas ou chaves;
12. **publicar ou compartilhar** a chave secreta ou um token de acesso de propósito ou repetidamente
    (num repositório de código público, numa página, num fórum ou no código que roda no navegador);
    um vazamento acidental não é abuso, mas a chave ou o token vazados são revogados como diz a
    Cláusula 13.9;

*Conta, plano e pagamento*

13. revender, alugar ou repassar o acesso ao serviço hospedado a terceiros, ou compartilhar a conta
    para passar dos limites de pessoas e de projetos do plano, sem acordo conosco por escrito (medir,
    como agência, sites de clientes seus que autorizaram isso, dentro dos limites do plano, não é
    revenda; Cláusula 3.2 do Anexo 1);
14. criar mais de uma conta, ou usar outra pessoa, outro e-mail ou outro cartão, para **repetir o
    teste grátis** ou para fugir de um limite ou de uma cobrança;
15. **fraude no pagamento**: usar cartão sem autorização do titular ou dados falsos de cobrança, ou
    contestar de má-fé uma cobrança junto à administradora do cartão, por exemplo dizendo não
    reconhecer uma cobrança que você autorizou e cujo serviço usou, sem antes ter pedido o
    cancelamento ou o reembolso a nós (contestar uma cobrança indevida é direito seu; Cláusula 18.12);

*Lei e terceiros*

16. usar o serviço para atividade ilegal, para medir sites com conteúdo ilegal ou para violar
    direitos de terceiros (privacidade, propriedade intelectual, imagem);
17. qualquer outro uso contrário à lei ou a estes termos que cause, ou crie risco concreto e
    demonstrável de causar, dano aos outros clientes, à infraestrutura do serviço, aos titulares dos
    dados ou a nós, inclusive responsabilidade legal.

12.2. O servidor descarta automaticamente valores com forma de e-mail e sequências com 10 ou mais
dígitos (como CPF, CNPJ e telefone). **Atenção:** essa barreira é uma segunda camada e não reconhece
nomes, endereços nem textos livres. **A responsabilidade pelo que o seu site envia é sua.**

12.3. Você também se compromete a:

1. publicar no seu site um aviso de privacidade que descreva a medição (há um modelo no Anexo IV do
   Acordo de Tratamento de Dados) e manter esse aviso de acordo com o que o seu site envia;
2. se o seu site for dirigido a crianças ou adolescentes, avaliar antes a medição à luz do art. 14
   da LGPD;
3. manter em sigilo a chave secreta e os tokens de acesso (Cláusula 13);
4. manter atualizados os e-mails do dono da conta e das pessoas com acesso (Cláusula 23);
5. responder aos nossos avisos sobre abuso no prazo indicado (Cláusula 18).

12.4. **Como percebemos um abuso.** Não monitoramos o conteúdo dos seus projetos de forma contínua.
Percebemos um abuso pelo que o serviço já guarda ou recebe: os alertas automáticos de segurança
(Anexo II do Acordo, item 10); os registros técnicos da API, que dizem quando um evento ou uma
propriedade foi recusado e por qual regra, sem o valor recusado, e que somem em 14 dias; os
eventos guardados no projeto, consultados só quando necessário (Cláusula 7.2 do Acordo); os dados
de cobrança do Stripe; o registro de teste grátis (Política de Privacidade, item 2.7); e o que
outra pessoa ou uma autoridade nos relatar. **O serviço não guarda IP nem navegador completo, e não
passa a guardá-los para investigar abuso.**

## Cláusula 13 — Pessoas com acesso, chaves e tokens

13.1. **Pessoas com acesso.** A conta tem até 3 pessoas com acesso ao painel, contando com o dono. O
dono convida uma pessoa pelo e-mail dela, para um ou mais projetos da conta, em Configurações →
Pessoas. A pessoa recebe um e-mail de convite e entra no painel com um código enviado ao e-mail
dela, sem senha. O dono tira uma pessoa na mesma tela, a qualquer momento.

13.2. As pessoas convidadas veem os números, as configurações e a lista de pessoas dos projetos para
os quais foram convidadas, e cuidam das próprias sessões, tokens e resumo semanal. Só o dono muda
projetos, chaves, pessoas e cobrança, e só ele exporta eventos ou encerra a conta.

13.3. Quando o dono tira uma pessoa de um projeto, o acesso dela a esse projeto termina na hora,
inclusive pelos tokens de acesso que ela criou. O que ela já tiver visto ou levado para outro
programa por um token fica fora do nosso alcance. O cadastro dela segue a Política de Privacidade
(item 2.1).

13.4. Você é responsável por manter a lista de pessoas atualizada (por exemplo, tirar quem deixou a
sua equipe) e pelo que as pessoas com acesso fazem no serviço. Ao convidar uma pessoa, você confirma
que ela sabe que receberá e-mails do Pyxis (convite, códigos de login e o resumo semanal) e que
conhece estes termos.

13.5. Cada pessoa vê e encerra as próprias sessões em Configurações, inclusive "sair de todos os
dispositivos".

13.6. **Chave pública:** vai no seu site e só identifica o projeto. O serviço só aceita eventos com
essa chave vindos dos endereços cadastrados no projeto. O dono troca a chave pública em
Configurações.

13.7. **Chave secreta:** só é necessária se você for usar as rotas de exclusão e de cópia de dados.
O dono a cria em Configurações, e ela aparece uma única vez. Guarde-a só no seu servidor, nunca no
navegador ou num repositório de código. Nós a guardamos só como hash: se você a perder, revogue-a e
crie outra.

13.8. **Tokens de acesso:** só leem os números do painel e valem por 30, 90 ou 365 dias. Quem cria
um token é responsável por guardá-lo e pode revogá-lo a qualquer momento em Configurações. Os dados
que um token lê vão para o programa em que ele foi usado (por exemplo, uma ferramenta de
inteligência artificial com o servidor MCP); **a escolha e o uso dessa ferramenta são de sua
responsabilidade**.

13.9. Se uma chave vazar, o dono a revoga e cria outra na hora, em Configurações; se não conseguir,
avise-nos: revogamos a chave em até 1 dia útil. Um token vazado pode ser revogado na hora, por quem o
criou, em Configurações. Se encontrarmos uma chave secreta ou um token publicados, nós os revogamos
na hora, para proteger você, mesmo sem abuso, e avisamos em seguida (Cláusula 18.4, item 4).

## Cláusula 14 — Dados pessoais

14.1. Em relação aos dados dos visitantes dos seus sites, **você é o controlador** e **nós somos o
operador** (Lei nº 13.709/2018, a LGPD, art. 5º, VI e VII). As regras completas estão no **Anexo 1 —
Acordo de Tratamento de Dados Pessoais**, que faz parte deste contrato: finalidade, instruções,
segurança, suboperadores, transferência internacional, pedidos de titulares, incidentes, suspensão
do tratamento e exclusão.

14.2. Em relação aos seus dados e aos das pessoas com acesso (e-mails, conta, aceite destes termos,
sessões, cobrança, prevenção de teste repetido e suporte), **nós somos o controlador**, como explica
o **Anexo 2 — Política de Privacidade do Pyxis**.

## Cláusula 15 — Disponibilidade, interrupções e mudanças no serviço

15.1. **Atenção: não há garantia de disponibilidade (SLA).** Fazemos o melhor esforço para manter
o serviço no ar e corrigir falhas o quanto antes. O serviço é operado por uma pessoa só e depende de
provedores (AWS, que também envia os e-mails, Neon, Vercel e Stripe); pode haver interrupções.

15.2. **Manutenção.** Avisamos por e-mail, com antecedência sempre que possível, as manutenções que
possam deixar o serviço fora do ar, e as fazemos de preferência fora do horário comercial.

15.3. **Interrupções que não dependem de nós.** O serviço pode parar, no todo ou em parte, por falha
ou suspensão de um provedor, por ataque de terceiros ao serviço ou por caso fortuito ou força maior
(Código Civil, art. 393). Trabalhamos para restabelecer o serviço o quanto antes e, se a interrupção
durar mais de 24 horas, avisamos por e-mail.

15.4. **Ordem legal.** Interrompemos ou limitamos o serviço, no todo ou em parte, quando uma lei,
uma ordem judicial ou uma determinação da ANPD ou de outra autoridade competente o exigir (por
exemplo, o bloqueio de dados ou a suspensão de um tratamento, LGPD, art. 52). Cumprimos só o que for
exigido e avisamos você, salvo se a ordem proibir o aviso.

15.5. **Pausa pela cota.** A pausa da recepção de eventos ao chegar a 150% do limite mensal segue a
Cláusula 7.2.

15.6. Se você for consumidor, continuam valendo os seus direitos do art. 20 do Código de Defesa do
Consumidor: diante de uma falha do serviço, inclusive uma suspensão que se mostre indevida
(Cláusula 18.9), você pode pedir que o serviço seja refeito, quando cabível, o abatimento
proporcional do preço ou a devolução do valor pago.

15.7. Podemos melhorar o serviço, mudar telas e acrescentar recursos. Não retiramos, durante o
período pago, os recursos listados na Cláusula 7.1 nem pioramos os compromissos de privacidade da
Cláusula 4.2. Se uma mudança desse tipo for inevitável (por exemplo, por lei ou porque um provedor
deixou de oferecer algo), avisamos com 30 dias de antecedência, e você pode encerrar com devolução
proporcional do período pago e não usado.

## Cláusula 16 — Suporte e atendimento

16.1. O atendimento é por e-mail, em hello@pyxis-analytics.dev, para dúvidas, reclamações, suporte,
contestação de uma suspensão, suspensão e cancelamento.

16.2. Confirmamos o recebimento da sua mensagem pelo mesmo e-mail e respondemos em **até 2 dias
úteis** (dias úteis de segunda a sexta-feira, exceto feriados nacionais).

16.3. O suporte cobre o uso do serviço hospedado e a instalação do rastreador. Não inclui
desenvolvimento no seu site nem suporte a instalações próprias do código aberto.

16.4. Nas mensagens, não mande dados pessoais de visitantes. Para mostrar um caso, use o identificador
da visita ou do usuário.

## Cláusula 17 — Propriedade intelectual e seus dados

17.1. **Os dados dos seus projetos são seus.** Nós os tratamos só para prestar o serviço, como diz o
Acordo de Tratamento de Dados. Não vendemos, não usamos para publicidade e não usamos para treinar
modelos de inteligência artificial.

17.2. O código do Pyxis segue a licença MIT (Cláusula 5). O nome Pyxis, o logotipo e a identidade
visual são nossos; você não pode usá-los de forma que sugira que o seu produto é nosso ou que
temos parceria, sem a nossa autorização.

17.3. Se você nos mandar sugestões, podemos usá-las livremente para melhorar o Pyxis, sem obrigação
com você.

## Cláusula 18 — Abuso: suspensão e encerramento por nós

18.1. **Princípios.** Diante de um abuso (Cláusula 12.1), agimos com base em fatos que possamos
mostrar a você, de forma proporcional à gravidade e só sobre a parte do serviço afetada. Uma medida
mais forte só é usada quando a mais leve não basta, e toda medida vem com o motivo por escrito.

18.2. **Medidas possíveis**, da mais leve para a mais forte:

1. aviso por e-mail, com prazo para corrigir;
2. suspensão parcial: revogar uma chave ou um token; pausar a recepção de eventos de um projeto;
   suspender o acesso de uma pessoa ao painel;
3. suspensão da conta inteira: recepção de eventos de todos os projetos, painel, chaves e tokens;
4. encerramento do contrato (Cláusula 18.7).

18.3. **Aviso e prazo para corrigir.** Fora dos casos da Cláusula 18.4, antes de suspender avisamos
o dono da conta por e-mail, dizendo o que vimos, qual regra foi descumprida, o que precisa ser feito
e qual medida tomaremos se não for corrigido, e damos **5 dias úteis** para corrigir ou explicar. Se
você corrigir no prazo, nada é suspenso.

18.4. **Atenção: suspensão imediata.** Podemos suspender sem aviso prévio só nestes casos, e só na
medida necessária para conter o problema:

1. ataque ao serviço ou a outros clientes, ou tráfego forjado ou automatizado que ameace a
   estabilidade do serviço (Cláusula 12.1, itens 7, 10 e 11);
2. envio de dados pessoais sensíveis nos eventos, ou de dados pessoais diretos de forma que exponha
   visitantes a risco relevante (Cláusula 12.1, itens 1 a 3);
3. atividade ou conteúdo aparentemente ilegal (Cláusula 12.1, item 16);
4. chave secreta ou token publicados, por qualquer motivo, mesmo acidental (Cláusula 13.9): a
   medida é só revogá-los, para proteger você e os titulares;
5. indício objetivo de fraude no pagamento, como cartão usado sem autorização do titular ou dados de
   cobrança falsos (Cláusula 12.1, item 15);
6. risco concreto e imediato a outros clientes, aos titulares dos dados ou à infraestrutura;
7. lei, ordem judicial ou determinação de autoridade competente (Cláusula 15.4).

Nesses casos, avisamos o dono da conta por e-mail **em até 1 dia útil** depois da suspensão, dizendo
o motivo, o que foi suspenso, o que fazer para voltar e como contestar, salvo se uma lei ou uma
ordem proibir o aviso.

18.5. **Duração e volta.** A suspensão dura só o necessário. Quando o problema for corrigido ou a
contestação for aceita, restabelecemos por inteiro, em até 1 dia útil, o que foi suspenso. Chaves e
tokens revogados não voltam: você cria novos no painel.

18.6. **Direito de resposta e de contestar.** Você pode responder a qualquer aviso e contestar
qualquer medida por e-mail para hello@pyxis-analytics.dev, a partir do e-mail do dono da conta, em
até **10 dias úteis** do aviso, mandando a sua explicação e as provas que tiver. Confirmamos o
recebimento pela mesma via e respondemos com a decisão fundamentada em **até 5 dias**; numa suspensão
imediata, examinamos a contestação com prioridade. Esse canal não substitui nem condiciona o seu
direito de procurar o Procon, os demais órgãos de defesa do consumidor ou a Justiça.

18.7. **Encerramento por abuso.** Podemos encerrar o contrato, por e-mail e com o motivo, só depois
de dar a você a chance de responder (Cláusula 18.6), salvo se uma lei ou uma ordem impedir e salvo o
teste grátis repetido, que segue os prazos próprios da Cláusula 18.11, e só quando:

1. o abuso for **grave**: ataque deliberado ao serviço ou a outros clientes; fraude no pagamento;
   atividade ou conteúdo ilegal; envio deliberado de dados pessoais sensíveis; ou tentativa
   deliberada de contornar a barreira de dados pessoais ou o respeito a quem pediu para não ser
   medido;
2. o mesmo abuso se **repetir** depois de corrigido, em até 12 meses do primeiro aviso; ou
3. o abuso **não for corrigido** em até 30 dias de uma suspensão.

O encerramento tem os efeitos da Cláusula 11.6, itens 1 a 4: a assinatura é cancelada, as chaves são
revogadas, o painel fica disponível para consulta e exportação por 30 dias, salvo impedimento legal,
e os dados são apagados depois (Cláusula 11.4).

18.8. **Dados durante a suspensão e depois do encerramento.**

1. Durante a suspensão, os dados já guardados continuam guardados e protegidos, o apagamento dos
   eventos com mais de 13 meses continua, e nenhum evento novo é recebido na parte suspensa.
2. Você continua podendo exportar os eventos (Cláusula 11.5), salvo quando o próprio acesso for o
   risco (por exemplo, um ataque feito pela conta) ou uma lei ou ordem impedir; nesse caso,
   entregamos a cópia a pedido assim que o impedimento acabar, e a exclusão espera por ela.
3. Depois do encerramento, valem as Cláusulas 11.4 e 11.5: 30 dias para exportar, salvo impedimento
   legal, e exclusão em seguida.
4. Se uma lei, uma ordem judicial ou uma requisição de autoridade competente mandar preservar dados,
   ou se eles forem necessários para um processo judicial, administrativo ou arbitral, preservamos só
   esses dados, sem outro uso, pelo tempo exigido, e depois os apagamos (Cláusula 12.6 do Anexo 1).
5. Para investigar um abuso, usamos só o que o serviço já guarda (Cláusula 12.4).

18.9. **Cobrança durante a suspensão.** Uma suspensão parcial não muda a cobrança. Se uma suspensão
se mostrar indevida, devolvemos o valor proporcional aos dias em que a conta ficou suspensa, além dos
seus direitos da Cláusula 15.6.

18.10. **Reembolso no encerramento por abuso.**

1. Devolvemos o valor proporcional ao período pago e não usado, contado do início da suspensão da
   conta inteira ou, se ela não houve, do encerramento. Se o encerramento acontecer nos 7 dias da
   Cláusula 10, devolvemos o valor integral da primeira cobrança.
2. Não devolvemos o período já usado até a suspensão da conta inteira, nem valores que já tenham
   voltado a você por estorno ou por contestação aceita pela administradora do cartão.
3. **Atenção: só se você não for consumidor**, podemos descontar desse valor os prejuízos que o abuso
   comprovadamente nos causou, mostrando por escrito o cálculo (Código Civil, arts. 368 e 369); o que
   faltar ou sobrar se resolve pela Cláusula 19.
4. O reembolso vai, pelo Stripe, para o cartão usado no pagamento, em até 5 dias úteis do
   encerramento.

18.11. **Teste grátis repetido.** Quando o serviço indicar que o cartão usado já começou um teste
grátis em outra conta nos 12 meses anteriores (Política de Privacidade, item 2.7), ou houver outro
indício objetivo de teste repetido pela mesma pessoa ou empresa (Cláusula 6.4):

1. nada acontece automaticamente: o serviço só registra a coincidência e nos avisa; nenhuma cobrança
   e nenhum cancelamento;
2. examinamos o caso e, se preciso, perguntamos a você, com o prazo da Cláusula 18.3. Um cartão de
   empresa usado por pessoas diferentes, ou uma agência que contrata para clientes diferentes, não é
   teste repetido;
3. se confirmarmos o teste repetido, podemos encerrar a conta nova antes do fim do teste, cancelando
   a assinatura no Stripe sem nenhuma cobrança, com aviso e o motivo; você pode contestar
   (Cláusula 18.6) e pode assinar sem teste grátis, por e-mail, com cobrança a partir da nova
   assinatura;
4. **nunca cobramos nada antes da data mostrada na página de pagamento do Stripe**, nem encurtamos o
   teste para cobrar antes.

18.12. **Contestação de cobrança no cartão.** Contestar uma cobrança junto à administradora do
cartão é direito seu; pedimos que fale conosco antes (Cláusulas 10 e 16). Se a contestação for
aceita e o valor voltar a você, o período contestado fica sem pagamento e podemos tratá-lo como
falta de pagamento, cancelando a assinatura com aviso (Cláusula 9.2). Só a contestação de má-fé
(Cláusula 12.1, item 15) é tratada como abuso.

18.13. **Encerramento sem abuso.** Fora do abuso, só encerramos o contrato nos casos das Cláusulas
6.2 (fim de uma gratuidade), 20 (fim do serviço hospedado), 21.3 (mudança exigida por lei que você
não aceite) e 22.1 (cessão que você não aceite), e sempre devolvemos o valor proporcional ao período
pago e não usado; os dados seguem as Cláusulas 11.4 e 11.5.

## Cláusula 19 — Responsabilidade

19.1. Respondemos por prestar o serviço como descrito nestes termos, com diligência, e por cumprir o
Acordo de Tratamento de Dados.

19.2. O serviço mostra estatísticas de uso. Não garantimos resultados de negócio a partir delas, e
as decisões que você tomar com base nos números são suas.

19.3. **Se você for consumidor**, nada nestes termos limita os direitos que o Código de Defesa do
Consumidor garante a você, inclusive o de reparação dos danos causados por falha do serviço.

19.4. **Atenção: limite de responsabilidade para quem não é consumidor.** Se você contrata o serviço
para a sua atividade profissional ou empresarial, fora de uma relação de consumo, e, nas situações
justificáveis admitidas pelo art. 51, I, do Código de Defesa do Consumidor, se você for consumidor
pessoa jurídica:

1. a nossa responsabilidade total por danos ligados a este contrato fica limitada ao valor que você
   nos pagou nos 12 meses anteriores ao fato que causou o dano;
2. não respondemos por lucros cessantes, perda de oportunidade de negócio ou outros danos indiretos.

Esse limite considera o preço baixo do plano e o porte do serviço, operado por uma pessoa só. Ele
**não se aplica** a danos causados por dolo ou culpa grave nossa, nem a obrigações que a lei não
permite limitar, nem reduz os direitos dos titulares de dados perante nós (LGPD, art. 42).

19.5. Você responde pelos danos que causar a nós ou a terceiros por descumprir estes termos, por
exemplo ao enviar dados pessoais nos eventos, ao deixar de informar a medição aos visitantes do seu
site ou por outro abuso da Cláusula 12.1.

19.6. Nenhuma das partes responde por atraso ou falha causados por caso fortuito ou força maior
(Código Civil, art. 393).

## Cláusula 20 — Encerramento do serviço hospedado

20.1. Se decidirmos encerrar o serviço hospedado, avisamos por e-mail com pelo menos **30 dias de
antecedência**.

20.2. Nesse caso, devolvemos o valor proporcional ao período pago e não usado, mantemos a exportação
dos eventos (Cláusula 11.5) até o fim do serviço e apagamos os dados conforme a Cláusula 12 do
Anexo 1.

20.3. Como o código é aberto, você pode continuar usando o Pyxis na sua própria infraestrutura.

## Cláusula 21 — Mudanças nestes termos

21.1. Podemos mudar estes termos. Avisamos por e-mail com **pelo menos 30 dias de antecedência**,
explicando o que muda, e publicamos a nova versão com a data de vigência. As versões anteriores
ficam disponíveis a pedido.

21.2. **Mudanças que reduzam direitos seus ou aumentem obrigações suas só valem para você a partir
da sua próxima renovação depois desse prazo.** Se não concordar, cancele antes da renovação, sem
custo.

21.3. Mudanças que só melhorem o serviço ou esclareçam o texto valem na data indicada no aviso.
Mudanças exigidas por lei, por decisão judicial ou pela ANPD podem valer antes da renovação; se uma
delas não for aceitável para você, você pode encerrar o contrato com devolução proporcional do
período pago e não usado.

## Cláusula 22 — Cessão do contrato

22.1. Podemos transferir este contrato para uma empresa aberta ou controlada por {{seller.name}}
(por exemplo, para que o serviço passe a ser prestado com CNPJ) ou para quem assumir o serviço,
mantidas todas as condições destes termos e do Acordo de Tratamento de Dados. Avisamos por e-mail
com pelo menos 30 dias de antecedência; se não concordar, você pode encerrar o contrato com
devolução proporcional do período pago e não usado.

22.2. Você não pode transferir este contrato sem a nossa concordância por escrito.

## Cláusula 23 — Comunicações

23.1. Mandamos as comunicações deste contrato, inclusive os avisos de abuso e de suspensão, para o
e-mail do dono da conta e, quando o assunto for o uso do painel por uma pessoa, a suspensão do acesso
dela ou um incidente de segurança, também para as pessoas com acesso envolvidas. Mantenha esses
e-mails atualizados.

23.2. As suas comunicações para nós vão para hello@pyxis-analytics.dev.

## Cláusula 24 — Disposições gerais

24.1. Se uma cláusula for considerada inválida, as demais continuam valendo.

24.2. Se uma das partes deixar de exigir um direito, isso não significa que renunciou a ele.

24.3. Este contrato não cria sociedade, vínculo de emprego nem representação entre as partes.

24.4. Este contrato é celebrado em português, por meio eletrônico, e vale como contrato escrito.

## Cláusula 25 — Lei aplicável e foro

25.1. Este contrato segue a lei brasileira.

25.2. Antes de ir à Justiça, procure-nos em hello@pyxis-analytics.dev: queremos resolver. Isso é um
convite, não uma condição. Se você for consumidor, também pode procurar o Procon e os demais órgãos
de defesa do consumidor.

25.3. **Se você for consumidor**, pode propor ação no foro do seu domicílio (Código de Defesa do
Consumidor, art. 101, I).

25.4. Nos demais casos, fica eleito o foro da comarca de **Salvador/BA**, domicílio de quem presta
o serviço.

---

[Anexo 1 — Acordo de Tratamento de Dados Pessoais](/acordo-de-tratamento).

[Anexo 2 — Política de Privacidade do Pyxis](/privacidade).
