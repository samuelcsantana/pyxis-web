# Acordo de Tratamento de Dados Pessoais do Pyxis

**Versão {{terms.version}}, vigente a partir {{terms.effectiveFrom}}.**

Este acordo é o **Anexo 1 dos Termos de Uso do Pyxis** e faz parte do contrato entre você e nós.
Ele explica como tratamos os dados pessoais que chegam ao Pyxis a partir dos seus sites, seguindo
a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018, a "LGPD"). Se algo aqui contrariar
os Termos de Uso, vale este acordo no que se refere a dados pessoais.

---

## Cláusula 1 — Quem são as partes

1.1. **Nós:** {{seller.name}}, pessoa física, inscrito no CPF sob o nº {{seller.taxId}}, com endereço em
{{seller.address}}, que oferece o serviço com o nome **Pyxis**. Contato:
**hello@pyxis-analytics.dev**.

1.2. **Você:** a pessoa ou a empresa que contratou o Pyxis hospedado, aceitando os Termos de Uso,
representada no painel pelo dono da conta (Termos de Uso, Cláusula 2.9). Este acordo vale do mesmo
jeito no plano grátis e no plano pago (Termos de Uso, Cláusula 7.1).

## Cláusula 2 — Palavras usadas neste acordo

2.1. As palavras **dado pessoal**, **tratamento**, **titular**, **controlador**, **operador**,
**anonimização**, **eliminação**, **transferência internacional** e **incidente de segurança** têm o
sentido da LGPD (art. 5º) e das resoluções da Agência Nacional de Proteção de Dados (ANPD).

2.2. **Visitante** é a pessoa que acessa um site ou aplicativo seu em que o rastreador do Pyxis
está instalado.

2.3. **Evento** é cada registro que o rastreador envia ao Pyxis, como uma página vista ou uma ação
que você marcou.

2.4. **Projeto** é a configuração de um site seu no Pyxis: nome, endereços (origens) autorizados,
fuso horário, evento de conversão, chaves e eventos.

2.5. **Suboperador** é o provedor que contratamos e que trata, por nossa conta, dados pessoais
deste acordo.

## Cláusula 3 — Papéis de cada parte

3.1. Em relação aos dados dos visitantes dos seus sites, **você é o controlador** e **nós somos o
operador** (LGPD, art. 5º, VI e VII). Você decide se e como medir; nós tratamos os dados para
prestar o serviço que você contratou.

3.2. Se você usa o Pyxis para medir sites de terceiros (por exemplo, como agência), você declara
que tem autorização do controlador desses sites para nos contratar e para dar as instruções deste
acordo. Nesse caso, nós atuamos como suboperador, e você repassa ao controlador as informações
deste acordo de que ele precisar.

3.3. Em relação aos dados da sua conta (os e-mails de quem acessa o painel, a conta e a assinatura,
o aceite dos termos, o histórico de cobrança, a prevenção de teste grátis repetido, os registros das
conexões de aplicativos e as mensagens de suporte), **nós somos o controlador**. Esse tratamento está na
**Política de Privacidade do Pyxis** (Anexo 2 dos Termos de Uso), não neste acordo.

## Cláusula 4 — O que tratamos, para quê e por quanto tempo

4.1. O **Anexo I** deste acordo descreve o tratamento: finalidades, titulares, categorias de
dados, o que **não** é guardado, onde os dados ficam e por quanto tempo.

4.2. Tratamos os dados dos visitantes **somente** para:

1. receber os eventos enviados pelo rastreador e guardá-los no seu projeto;
2. mostrar a análise a você e às pessoas que você autorizou, no painel, na API de consulta, no
   servidor MCP (inclusive aos aplicativos que elas conectarem; Anexo I, item 10) e no resumo
   semanal por e-mail;
3. atender aos pedidos de exclusão e de cópia de dados de titulares (Cláusula 10);
4. manter o serviço seguro e funcionando (limites contra abuso, correção de falhas, cópias de
   segurança dos provedores);
5. cumprir obrigação legal ou ordem de autoridade competente (Cláusula 15);
6. gerar, a pedido do dono da conta, o arquivo de exportação dos eventos de um projeto (Anexo I,
   item 11);
7. verificar e conter suspeita de abuso ou de uso contrário aos Termos de Uso (Cláusulas 12 e 18
   dos Termos), só com os dados que o serviço já guarda e só na medida necessária (Cláusula 7.2).

4.3. **Não usamos os dados dos seus projetos para nenhuma outra finalidade.** Não vendemos, não
alugamos, não usamos para publicidade, não usamos para treinar modelos de inteligência artificial
e não combinamos com dados de outros clientes. Os únicos números que tiramos dos seus projetos
para uso próprio são contagens de operação, como a quantidade de eventos por mês de cada conta e o
tamanho do banco, usadas para aplicar o limite mensal do plano (Termos de Uso, Cláusula 7.2), saber
se uma conta do plano grátis ficou sem receber eventos (Termos de Uso, Cláusula 7.6) e conferir a
capacidade do serviço.

## Cláusula 5 — Suas instruções

5.1. Suas instruções para o tratamento são, em conjunto:

1. os Termos de Uso e este acordo;
2. a configuração dos seus projetos (origens autorizadas, fuso horário, evento de conversão, chaves
   e pessoas com acesso), feita pelo dono da conta no painel ou, a pedido, por nós;
3. o que o rastreador instalado no seu site envia (quais eventos, propriedades e se você usa a
   função `identify`);
4. as ações do dono da conta no painel (por exemplo, exportar os eventos, apagar um projeto ou
   encerrar a conta), as chamadas que você faz à API com a sua chave secreta ou com um token de
   acesso, e as conexões de aplicativos que as pessoas com acesso permitem no painel (Anexo I,
   item 10);
5. os pedidos que você nos manda por escrito, pelo e-mail hello@pyxis-analytics.dev.

5.2. Se uma instrução sua nos parecer contrária à LGPD ou a outra lei, avisamos você por escrito e
não a cumprimos até que a questão seja resolvida: o operador que segue uma instrução ilícita responde
junto com o controlador (LGPD, art. 42, § 1º, I).

5.3. Uma instrução que exija mudar o funcionamento do serviço para todos os clientes (por exemplo,
guardar um dado que o Pyxis não guarda) não é obrigatória para nós; nesse caso, você pode encerrar
o contrato pelos Termos de Uso.

5.4. **Suspensão do tratamento.** Podemos suspender, no todo ou em parte, o tratamento de um
projeto (normalmente, a recepção de novos eventos), pelo procedimento da Cláusula 18 dos Termos de
Uso, quando:

1. o projeto enviar dados pessoais diretos ou sensíveis, contra a Cláusula 6.1, itens 3 e 4;
2. o projeto enviar eventos de quem pediu para não ser medido, contra a Cláusula 6.1, item 5;
3. uma instrução sua for ilícita (Cláusula 5.2);
4. for necessário para conter um incidente de segurança (Cláusula 11.6); ou
5. uma lei ou uma autoridade competente mandar (Cláusula 15).

Durante a suspensão, os dados já recebidos continuam guardados, com as mesmas medidas de segurança
(Anexo II); nenhum dado novo é recebido na parte suspensa; os prazos de guarda e de eliminação da
Cláusula 12 continuam valendo; e os dados recebidos em desacordo com este acordo são apagados por
instrução sua (Cláusula 10.6). A suspensão não muda os seus deveres de controlador perante os
titulares.

## Cláusula 6 — O que você garante como controlador

6.1. Você garante que:

1. tem uma base legal válida (LGPD, art. 7º) para medir o uso dos seus sites com o Pyxis. Para a
   medição sem cookies e sem dado pessoal direto que o Pyxis faz, a base mais comum é o legítimo
   interesse (art. 7º, IX, e art. 10), que exige transparência e respeito às expectativas do
   visitante; a avaliação é sua;
2. informa os visitantes sobre a medição, no aviso de privacidade do seu site, de forma clara. O
   **Anexo IV** traz um modelo;
3. **não envia ao Pyxis dados pessoais diretos nem dados pessoais sensíveis**: nada de nome, e-mail,
   telefone, CPF, endereço, número de documento, texto digitado pelo visitante, dado de saúde,
   origem racial, religião, opinião política, vida sexual, dado genético ou biométrico, nem qualquer
   dado que identifique uma pessoa sozinho;
4. se usar a função `identify`, envia só um **identificador interno e opaco** da conta no seu
   sistema (por exemplo, um número de registro aleatório), nunca o e-mail, o CPF, o telefone ou outro
   dado que identifique a pessoa diretamente;
5. não desliga nem contorna o respeito aos sinais "não rastrear" do navegador (Global Privacy
   Control e Do Not Track) nem a opção de não ser medido (`optOut`) que o rastreador oferece, nem
   envia por outro caminho eventos de quem pediu para não ser medido;
6. se o seu site for dirigido a crianças ou adolescentes, avaliou o tratamento à luz do art. 14 da
   LGPD e do melhor interesse deles antes de instalar o rastreador;
7. responde aos pedidos dos titulares dos seus sites, com o nosso apoio (Cláusula 10);
8. publica, quando for o caso, as informações sobre transferência internacional exigidas pelo
   art. 17, § 2º, do Regulamento aprovado pela Resolução CD/ANPD nº 19/2024, usando as informações
   da Cláusula 9 e do Anexo III;
9. instala o rastreador e cadastra como origem de um projeto só sites seus ou de quem autorizou
   você (Cláusula 3.2).

6.2. O servidor do Pyxis descarta automaticamente valores que tenham forma de e-mail ou sequências
com 10 ou mais dígitos (como CPF, CNPJ e telefone) nas propriedades dos eventos, nos parâmetros de
campanha e no identificador de usuário. Essa barreira é uma **segunda camada**: ela não reconhece
nomes, endereços nem textos livres. **A responsabilidade pelo que o seu site envia é sua.**

6.3. Se você perceber que enviou dados pessoais diretos ao Pyxis, avise-nos. Ajudamos a apagá-los
(Cláusula 10.6). Se nós percebermos, pelos registros de recusa da barreira ou de outro modo,
avisamos você.

## Cláusula 7 — Confidencialidade

7.1. Hoje o Pyxis é operado por uma pessoa só: o titular indicado na Cláusula 1.1. Ele é a única
pessoa com acesso administrativo aos sistemas e ao banco de dados.

7.2. Só acessamos os dados de um projeto quando é necessário para: (a) o suporte que você pediu;
(b) investigar ou corrigir uma falha ou um incidente de segurança; (c) manutenção do serviço;
(d) cumprir obrigação legal ou ordem de autoridade; ou (e) verificar uma suspeita concreta de abuso
(Cláusula 18 dos Termos de Uso), olhando só o necessário para confirmá-la ou afastá-la.

7.3. Se, no futuro, outra pessoa passar a operar o serviço conosco, ela só terá acesso depois de
assumir por escrito o mesmo dever de sigilo deste acordo, e avisaremos você.

7.4. O dever de sigilo e de segurança continua valendo depois do fim do contrato (LGPD, art. 47).

## Cláusula 8 — Segurança

8.1. Adotamos medidas técnicas e administrativas para proteger os dados contra acessos não
autorizados e contra destruição, perda, alteração, comunicação ou qualquer tratamento inadequado
ou ilícito (LGPD, art. 46). As medidas em vigor estão no **Anexo II**.

8.2. Podemos trocar uma medida por outra equivalente ou melhor. Não reduzimos o nível geral de
proteção descrito no Anexo II durante o contrato.

8.3. O código-fonte do Pyxis é público (licença MIT). Você pode conferir como o serviço trata os
dados nos repositórios `pyxis-api`, `pyxis-sdk`, `pyxis-web` e `pyxis-mcp`, no GitHub.

## Cláusula 9 — Suboperadores e transferência internacional

9.1. **Autorização.** Você autoriza que usemos os suboperadores listados no **Anexo III**. Cada um
trata só o necessário para a parte do serviço que presta.

9.2. **Mudanças.** Antes de acrescentar ou trocar um suboperador que trate dados dos visitantes,
avisamos você por e-mail com **pelo menos 30 dias de antecedência**, dizendo quem é, o que fará e
onde. Se você não concordar, pode encerrar o contrato antes da mudança e recebe de volta o valor
proporcional ao período pago e não usado. Numa emergência (por exemplo, um provedor que deixou de
funcionar ou que se tornou inseguro), a troca pode ser imediata; avisamos em até 5 dias úteis, e
você tem o mesmo direito de encerrar com reembolso proporcional.

9.3. **Contratos com os suboperadores.** Os provedores do Anexo III são empresas grandes que
contratam por termos padronizados, que não negociamos. Escolhemos provedores cujos termos incluem
compromissos de segurança, confidencialidade e tratamento conforme as nossas instruções. O
Anexo III indica o contrato de cada um.

9.4. **Onde os dados ficam.** Os eventos dos seus projetos são **guardados no Brasil**: no banco de
dados da Neon, que roda na região de São Paulo da AWS, e processados pela API na região de São
Paulo da AWS (sa-east-1).

9.5. **Onde há elemento estrangeiro.** Mesmo com os dados guardados no Brasil, há quatro situações
que você deve conhecer:

1. **Rede de distribuição da AWS (CloudFront).** As requisições do navegador do visitante chegam
   ao ponto de presença da AWS mais próximo dele, que pode ficar fora do Brasil quando o visitante
   está fora do Brasil. Esse ponto só repassa a requisição para São Paulo: o cache está desligado e
   não guardamos registros de acesso do CloudFront.
2. **Empresas sediadas nos Estados Unidos.** A Neon é parte da Databricks, Inc.; a Vercel Inc. hospeda
   o painel. As duas são empresas dos EUA, e suas equipes e sistemas podem acessar dados a partir de
   fora do Brasil para operar, dar suporte e fazer cópias de segurança.
3. **Painel.** As páginas do painel são montadas em funções da Vercel na região de São Paulo
   (gru1), mas a Vercel declara que o seu processamento principal fica nos EUA. Os registros
   técnicos das requisições ao painel ficam com a Vercel por 1 dia.
4. **Aplicativos conectados.** Se uma pessoa com acesso conectar o Claude ou o Claude Code, os
   dados que ela pedir ao aplicativo vão para a Anthropic, nos EUA, por instrução sua (Cláusula 5.1,
   item 4, e Anexo I, item 10). A Anthropic não é nossa suboperadora.

Os e-mails do serviço, inclusive o resumo semanal (que leva só números agregados do projeto, sem
dados de visitantes identificáveis; Anexo I, item 6), saem pelo Amazon SES, na região de São Paulo
da AWS (Anexo III).

9.6. **Mecanismo de transferência.** Na data desta versão, os contratos de tratamento de dados
(DPA) da AWS, da Databricks (Neon) e da Vercel preveem cláusulas-padrão da União Europeia e
compromissos de segurança, mas **não incorporam as cláusulas-padrão contratuais aprovadas pela
ANPD** (Resolução CD/ANPD nº 19/2024). Para reduzir ao mínimo o que sai do Brasil (art. 9º,
parágrafo único, do Regulamento), o Pyxis não guarda IP, não guarda o navegador completo, não usa
cookies nos seus sites e reduz os endereços das páginas a modelos (Anexo II). Nós nos comprometemos
a: (a) adotar as cláusulas-padrão da ANPD ou outro mecanismo válido do art. 33 da LGPD assim que
algum desses provedores o oferecer, ou trocar de provedor se for preciso; (b) avisar você de
qualquer mudança neste ponto; e (c) dar a você, quando pedir, as informações de que precisar para
avaliar a transferência (art. 4º, § 1º, do Regulamento).

## Cláusula 10 — Pedidos dos titulares

10.1. **Quem responde.** Como controlador, você responde aos visitantes e aos usuários dos seus
sites que pedirem confirmação, acesso, correção, exclusão ou outra providência do art. 18 da LGPD.
Nós ajudamos como descrito abaixo.

10.2. **Só é possível achar quem foi identificado.** O Pyxis não guarda cookies, IP nem
identificador persistente do visitante anônimo. O identificador de visita é aleatório, fica só na
aba do navegador e é trocado ao fechar a aba ou depois de 30 minutos sem atividade. Por isso,
**não há como encontrar as visitas anônimas de uma pessoa**. Só dá para localizar os eventos de
alguém que o seu site identificou com a função `identify`, pelo identificador interno que você
enviou.

10.3. **Excluir os dados de uma pessoa (você mesmo, pela API).** Chame
`DELETE https://api.pyxis-analytics.dev/v1/subjects/{userId}` com a chave secreta do projeto
(cabeçalho `Authorization: Bearer`). O Pyxis apaga **todos os eventos com aquele identificador e
também as visitas em que a pessoa foi identificada**, inclusive os eventos anônimos dessa mesma
visita que vieram antes da identificação (por exemplo, a página de entrada e a origem da visita). A
resposta diz quantos eventos foram apagados. Chamar de novo responde zero; é seguro repetir.

10.4. **Copiar os dados de uma pessoa (você mesmo, pela API).** Chame
`GET https://api.pyxis-analytics.dev/v1/subjects/{userId}/events` com a chave secreta. A resposta
traz os mesmos eventos que a exclusão apagaria, em ordem, até 1.000 por página, em JSON. Se houver
mais, a resposta indica o próximo cursor (`next_after`), que você passa como `?after=` para buscar a
página seguinte. Cada evento vem com nome, data e hora, identificador da visita, página, origem,
aparelho, país, estado e propriedades.

10.5. **Limites dessas rotas.** As duas rotas aceitam até 60 chamadas por minuto por chave e por
endereço de origem. A chave secreta só deve ser usada no seu servidor, nunca no navegador.

10.6. **Pedindo a nós.** Se preferir, mande o pedido para hello@pyxis-analytics.dev, a partir do
e-mail de uma pessoa com acesso ao projeto, com o identificador do usuário e o que deseja (exclusão
ou cópia). Fazemos em **até 5 dias úteis** e respondemos com o resultado (a quantidade de eventos
apagados ou o arquivo com a cópia). O mesmo vale se você enviou dados pessoais por engano e precisa
apagá-los.

10.7. **Pedido que chega direto a nós.** Se um titular dos seus sites nos procurar, não
respondemos o mérito por você: em **até 2 dias úteis**, encaminhamos o pedido a você e informamos ao
titular que o controlador é você e qual é o seu canal, quando o conhecermos.

10.8. **Prazos da lei.** Os prazos para responder ao titular são seus, como controlador (por
exemplo, até 15 dias para a declaração completa do art. 19, II, da LGPD, ou o prazo diferenciado
de agente de pequeno porte, se você se enquadrar). Os nossos prazos acima foram pensados para caber
dentro deles.

## Cláusula 11 — Incidentes de segurança

11.1. Se tomarmos conhecimento de um incidente de segurança que afetou ou pode ter afetado dados
pessoais de um projeto seu, avisamos você **sem demora injustificada e em até 48 horas** contadas
desse conhecimento, pelo e-mail das pessoas com acesso ao projeto.

11.2. O aviso diz o que soubermos até então, e completamos depois, assim que tivermos mais
informações:

1. o que aconteceu, quando aconteceu (se for possível saber) e quando soubemos;
2. a natureza e as categorias dos dados afetados e, quando for possível estimar, quantos titulares;
3. as medidas de segurança que protegiam os dados antes do incidente;
4. os riscos e os impactos possíveis para os titulares;
5. o que já fizemos e o que faremos para conter o incidente e reduzir os efeitos;
6. um contato para acompanhar o caso.

11.3. Esse prazo foi escolhido para que você consiga cumprir o seu: o controlador deve comunicar à
ANPD e aos titulares o incidente que possa causar risco ou dano relevante em até 3 dias úteis do
conhecimento (Resolução CD/ANPD nº 15/2024, arts. 6º e 9º), prazo que é contado em dobro para
agentes de pequeno porte.

11.4. A comunicação à ANPD e aos titulares dos seus sites cabe a você, como controlador (LGPD,
art. 48). Nós colaboramos com as informações que tivermos e não fazemos comunicação pública sobre
os dados do seu projeto sem falar com você antes, salvo obrigação legal.

11.5. Mantemos o registro de todo incidente de segurança com dados pessoais, inclusive dos que não
precisaram ser comunicados, por **pelo menos 5 anos**.

11.6. Para conter um incidente ou um ataque em andamento, podemos suspender na hora partes do
serviço (por exemplo, revogar uma chave ou pausar a recepção de eventos de um projeto), na medida
necessária. Avisamos como na Cláusula 11.1, quando houver dados pessoais envolvidos, ou como na
Cláusula 18.4 dos Termos de Uso, e restabelecemos assim que o risco passar.

## Cláusula 12 — Guarda e eliminação

12.1. **Durante o contrato.** Os eventos ficam guardados por **13 meses**. Uma rotina diária apaga
os eventos com mais de 13 meses, de todos os projetos.

12.2. **Fim do contrato.** **30 dias depois do fim do acesso** (o fim do período pago depois de um
cancelamento ou o fim da assinatura por falta de pagamento, quando a conta não volta ao plano grátis;
o encerramento da conta pelo painel; o fim do plano grátis; ou o encerramento por nós; Termos de Uso,
Cláusulas 2.10 e 11.4), uma rotina diária apaga definitivamente a conta, os projetos e tudo o que é
deles: eventos, chaves, configurações, ícone do
site, registros de envio do resumo semanal, pedidos de exportação e os acessos das pessoas aos
projetos. Apagamos também o cadastro (e-mail, sessões, tokens e aplicativos conectados) do dono da
conta e das pessoas que só
tinham acesso a projetos da sua conta. Se você apagar um projeto pelo painel antes disso, os eventos
e tudo o que é dele são apagados na hora.

12.3. **Cópia antes da exclusão.** Até a data da exclusão, o dono da conta exporta os eventos de
cada projeto pelo painel, num arquivo CSV compactado que fica disponível por 7 dias (Termos de Uso,
Cláusula 11.5; Anexo I, item 11). Se a exportação pelo painel não funcionar, enviamos o arquivo em
**até 10 dias úteis** do pedido feito por e-mail; se o pedido chegar perto da data de exclusão,
adiamos a exclusão até entregar a cópia.

12.4. **Cópias dos provedores.** Depois da exclusão, os dados ainda podem existir por um tempo
limitado nas cópias de segurança automáticas do provedor do banco: o histórico de recuperação da
Neon guarda as mudanças por até 7 dias, e as cópias de segurança da Neon são mantidas por até
30 dias. Essas cópias não são usadas para nada além de recuperação de desastre e somem sozinhas
nesses prazos. Um arquivo de exportação ainda não vencido some, no máximo, 7 dias depois de ficar
pronto. Os registros técnicos da API (que não contêm dados dos visitantes; Anexo II, item 9) somem
em 14 dias.

12.5. **Confirmação.** O dono da conta recebe um e-mail quando a exclusão é feita. Se você pedir,
confirmamos também a data e o que foi apagado.

12.6. **Exceção: preservação por lei ou ordem.** Só guardamos dados dos seus projetos depois desses
prazos quando uma lei, uma ordem judicial ou uma requisição de autoridade competente nos obrigar, ou
quando forem necessários para um processo judicial, administrativo ou arbitral (LGPD, arts. 7º, VI,
e 16, I). Nesse caso, preservamos só os dados alcançados, sem nenhum outro uso, pelo tempo exigido,
e os apagamos depois; avisamos você, salvo se a lei ou a ordem proibir o aviso.

12.7. **Conta do plano grátis sem eventos.** Uma conta do plano grátis que não receber nenhum evento
nos 30 dias depois da criação, ou que ficar 90 dias seguidos sem receber eventos, é apagada como diz a
Cláusula 7.6 dos Termos de Uso: o dono da conta recebe um aviso por e-mail e, se a conta continuar
sem eventos 7 dias depois, uma rotina diária apaga a conta, os projetos e tudo o que é deles, como no
item 12.2, sem o prazo de 30 dias desse item. Até lá, o dono da conta pode exportar os eventos
(item 12.3). Valem também os itens 12.4 (cópias dos provedores), 12.5 (confirmação por e-mail) e
12.6 (preservação por lei ou ordem).

## Cláusula 13 — Informações e auditoria

13.1. Se você pedir por escrito, damos as informações necessárias para mostrar que cumprimos este
acordo, em **até 15 dias**. Isso inclui responder a um questionário razoável de segurança e de
privacidade, sem custo, uma vez por ano e depois de qualquer incidente.

13.2. Como o código do Pyxis é público, você pode conferir o funcionamento do serviço diretamente.
Pelo porte do serviço, não oferecemos auditoria presencial nem acesso aos sistemas de produção;
os relatórios e certificações dos provedores (AWS, Databricks/Neon, Vercel) estão disponíveis nos
sites deles.

13.3. Colaboramos com a ANPD e com outras autoridades competentes nas fiscalizações que envolverem
os dados dos seus projetos.

## Cláusula 14 — Responsabilidade

14.1. Cada parte responde pelos danos que causar por descumprir a LGPD ou este acordo. Nós, como
operador, respondemos perante os titulares nos termos do art. 42 da LGPD: quando descumprirmos a
legislação de proteção de dados ou não seguirmos as suas instruções lícitas.

14.2. Entre você e nós, vale a Cláusula 19 (Responsabilidade) dos Termos de Uso. Nada nela reduz
os direitos dos titulares nem o direito de regresso do art. 42, § 4º, da LGPD.

## Cláusula 15 — Pedidos de autoridades

15.1. Só entregamos dados dos seus projetos a uma autoridade quando houver ordem judicial ou
requisição feita por quem tem competência legal para fazê-la (Marco Civil da Internet, Lei
nº 12.965/2014, art. 10).

15.2. Antes de entregar, avisamos você, salvo se a lei ou a ordem proibirem o aviso. Entregamos só
o que for exigido.

## Cláusula 16 — Vigência e mudanças

16.1. Este acordo vale enquanto vigorarem os Termos de Uso e, depois deles, até que os dados sejam
eliminados conforme a Cláusula 12.

16.2. Mudanças neste acordo seguem a regra de mudança dos Termos de Uso (aviso de 30 dias e
direito de encerrar). Mudanças exigidas por lei ou pela ANPD podem valer antes; nesse caso, você
pode encerrar o contrato com reembolso proporcional do período pago e não usado.

---

## Anexo I — Descrição do tratamento

**1. Finalidade.** Medir o uso dos sites e aplicativos do cliente e mostrar a análise ao cliente;
atender pedidos de titulares; manter a segurança e o funcionamento do serviço.

**2. Titulares.** (a) Visitantes dos sites e aplicativos do cliente; (b) usuários do sistema do
cliente que ele identifica com a função `identify`.

**3. Dados de cada evento guardado.**

| Dado | Como é |
|---|---|
| Identificador do evento | Número aleatório gerado no navegador |
| Nome do evento | `page_view` (página vista), `api_request` (chamada à API do site), `identify` ou um nome que o cliente define |
| Data e hora | A do navegador, corrigida pela diferença de relógio, e a de recebimento no servidor |
| Identificador da visita | Número aleatório guardado no `sessionStorage` da aba; trocado ao fechar a aba ou depois de 30 minutos sem atividade |
| Identificador de usuário | Só se o cliente usar `identify`: o identificador interno da conta no sistema do cliente, com até 64 letras, números, `-` ou `_` (não aceita `@`, logo não aceita e-mail) |
| Página | Só o caminho, em forma de modelo: trechos que parecem identificadores (números, códigos longos, e-mails) viram `:id`; sem domínio e sem parâmetros |
| Origem da visita | Só o domínio de onde o visitante veio (por exemplo, `google.com`), sem o endereço completo |
| Campanha | `utm_source`, `utm_medium` e `utm_campaign`, se estiverem no endereço; o canal (pago, e-mail, social, campanha, busca orgânica, outro site ou direto) calculado a partir deles e da origem |
| Clique em anúncio | Só verdadeiro ou falso. O código do clique (como `gclid`) não é guardado |
| Aparelho | Categoria: celular, tablet, computador ou outro |
| Navegador e sistema | Só a família (por exemplo, `chrome`, `safari`, `android`, `ios`), sem versão |
| País e estado | Código do país (2 letras) e estado (código e nome), informados pela rede da AWS na hora da requisição. **Nunca a cidade** |
| Propriedades | Até 10 por evento, definidas pelo cliente: chave com até 40 caracteres (`a-z`, `0-9`, `_`) e valor curto (texto de até 100 caracteres, número ou verdadeiro/falso) |
| Chamadas à API do site (`api_request`) | Método, rota em forma de modelo, código de resposta, duração e, se houver, o código do erro |

**4. O que o Pyxis não guarda.**

- **Endereço IP:** usado só na memória da função da API, para limitar abusos, pelo tempo da janela
  do limite (1 minuto no envio de eventos; 15 minutos no login do painel). Nunca é gravado no banco
  nem nos registros.
- **Navegador completo (user agent):** lido na hora para descobrir a categoria do aparelho, a família
  do navegador e a do sistema; depois descartado. Visitas de robôs conhecidos são descartadas.
- **Cookies:** o rastreador não cria cookies nos sites do cliente.
- **Cidade, endereço completo da página, parâmetros do endereço (fora os de campanha),
  impressão digital do navegador:** nunca.

**5. Dados pessoais sensíveis.** Não devem ser enviados (Cláusula 6.1, item 3). O Pyxis não foi
feito para tratá-los.

**6. Resumo semanal por e-mail.** Toda segunda-feira, cada pessoa com acesso ao projeto que não
desligou o resumo recebe números agregados da semana: visitas, pessoas identificadas (só a
contagem), conversões, falhas de gravação, visitas por dia, páginas e eventos mais frequentes e as
rotas com mais falhas. O resumo não leva identificadores de visitantes nem de usuários.

**7. Operações de tratamento.** Recepção, validação, classificação, armazenamento, consulta,
agregação, exibição no painel, entrega pela API de consulta, pelo servidor MCP e aos aplicativos
conectados, envio do resumo
agregado por e-mail, cópia (exportação), suspensão da recepção (Cláusula 5.4) e eliminação.

**8. Frequência e duração.** Contínua, enquanto o rastreador estiver instalado e o contrato
estiver em vigor. Eventos guardados por 13 meses; eliminação ao fim do contrato conforme a
Cláusula 12.

**9. Onde.** Banco de dados e API em São Paulo (Brasil). Painel em funções na região de São Paulo.
Situações com elemento estrangeiro na Cláusula 9.5.

**10. Acesso pelo servidor MCP, por tokens e por aplicativos conectados.** Os dados do painel saem
do Pyxis por três caminhos, todos escolhidos por uma pessoa com acesso ao projeto, que os usa em nome
próprio:

1. **Token no servidor MCP local ou em outro programa:** a pessoa cria um token de acesso e o usa
   no servidor MCP do Pyxis (`pyxis-mcp`), que roda no computador dela, ou em outro programa. Os
   dados vão para esse computador e para a ferramenta de inteligência artificial que ela escolheu.
2. **Token no endereço `https://api.pyxis-analytics.dev/mcp`:** o mesmo, com o servidor MCP
   rodando dentro da nossa API; os dados vão para o programa que a pessoa configurou com o token.
3. **Aplicativo conectado (conector do Claude):** a pessoa conecta o Claude ou o Claude Code, da
   Anthropic, e permite a conexão numa página do painel (Termos de Uso, Cláusula 13.10). Os dados
   que o aplicativo pedir vão da nossa API direto para os servidores da Anthropic, nos Estados
   Unidos (Claude), ou para o computador da pessoa e dali para a Anthropic (Claude Code).

Por qualquer desses caminhos, o aplicativo só lê, e só o que a pessoa vê no painel: os números
agregados e também as listas de visitas e a linha do tempo de cada visita, com o identificador de
usuário enviado pela função `identify` (item 3). Esse envio é uma instrução sua (Cláusula 5.1,
item 4) e acontece a pedido da pessoa, dentro do aplicativo que ela escolheu: esse aplicativo,
inclusive a Anthropic, **não** é nosso suboperador, trata os dados pelos termos que valem entre ele
e quem o usa, e cabe a você avaliar o uso dele, inclusive se há transferência internacional e com
que mecanismo (art. 4º do Regulamento aprovado pela Resolução CD/ANPD nº 19/2024), e o aviso aos
visitantes (Cláusula 6.1, itens 2 e 8, e Anexo IV). Damos a você as informações de que dispusermos
para essa avaliação (art. 4º, § 1º, do mesmo Regulamento; Cláusula 9.6). Cada pessoa revoga as suas conexões em
Configurações → Aplicativos conectados, e o dono da conta pode tirar uma pessoa de um projeto
(Termos de Uso, Cláusula 13.3).

**11. Exportação dos eventos.** A pedido do dono da conta, uma rotina gera um arquivo CSV compactado
com todos os eventos que o projeto guarda, com os campos do item 3. O arquivo fica num repositório
privado e cifrado da AWS na região de São Paulo e é apagado automaticamente 7 dias depois de ficar
pronto. Só o dono da conta baixa o arquivo, pelo painel, com um link novo a cada download, válido por
5 minutos. Depois de baixado, o arquivo fica sob a sua responsabilidade.

---

## Anexo II — Medidas de segurança em vigor

Conferidas no código do serviço e na configuração da infraestrutura em 14/10/2026 e 15/10/2026.

**1. Privacidade desde a concepção.** Sem cookies nos sites medidos; IP e navegador completo nunca
guardados; páginas reduzidas a modelos; barreira no servidor que descarta valores com forma de
e-mail e números com 10 ou mais dígitos nas propriedades, nos parâmetros de campanha e no
identificador de usuário; estado do visitante, nunca a cidade; sinais "não rastrear" do navegador
(Global Privacy Control e Do Not Track) respeitados pelo rastreador, que não envia nada quando eles
estão ligados; opção de não ser medido (`optOut`) para o visitante; eventos apagados depois de
13 meses.

**2. Criptografia em trânsito.** Navegador → API: HTTPS com TLS 1.2 ou superior e HSTS de 2 anos.
Rede de distribuição → função da API: só HTTPS (TLS 1.2). Função → banco de dados: TLS com
verificação do certificado do servidor (`sslmode=verify-full`). Painel: só HTTPS.

**3. Criptografia em repouso.** Banco de dados da Neon com AES-256; registros (logs) da AWS
cifrados por padrão; segredos (senhas do banco e chaves de serviços) no AWS Systems Manager
Parameter Store, cifrados, nunca no código.

**4. Acesso ao painel.**

- Login sem senha: um código de 6 dígitos enviado ao e-mail autorizado, válido por 10 minutos,
  guardado só como hash (SHA-256), com até 5 tentativas por código e até 5 códigos por hora por
  e-mail; pedidos de código limitados a 5 a cada 15 minutos por endereço de origem. Um e-mail sem
  acesso não recebe código e não é gravado.
- Sessão: valor aleatório de 256 bits guardado no banco só como hash; cookie `__Host-` com
  `HttpOnly`, `Secure` e `SameSite=Lax`; duração máxima de 7 dias e fim automático depois de
  24 horas sem uso; a pessoa vê as sessões abertas, encerra uma a uma ou todas de uma vez.
- Ações de escrita do painel só aceitas da origem do próprio painel.
- Só o dono da conta muda projetos, origens, chaves e pessoas, pede exportações e encerra a conta;
  as pessoas convidadas só leem.

**5. Isolamento entre clientes.** Toda consulta é filtrada pelo projeto e pela lista de pessoas
com acesso a ele. Pedir um projeto alheio responde como se ele não existisse. Há testes
automáticos para isso.

**6. Chaves e tokens.**

- Chave pública (vai no site): só identifica o projeto e só é aceita quando a requisição vem de uma
  origem cadastrada no projeto.
- Chave secreta (só no servidor do cliente): mostrada uma única vez ao ser criada, guardada só como
  hash, comparada em tempo constante, revogável; limitada a 60 chamadas por minuto.
- Tokens de acesso (para agentes e programas): **só leitura**; guardados só como hash; validade de
  30, 90 ou 365 dias; até 10 ativos por pessoa; revogáveis a qualquer momento no painel; limitados a
  60 consultas por minuto e, no servidor MCP da API, a 120 mensagens por minuto. Não servem para
  login, para escrita nem para exclusão.
- Conexões de aplicativos (conector do Claude): só o Claude e o Claude Code, reconhecidos pelos
  documentos de identificação que a Anthropic publica, com o endereço de retorno conferido com
  esses documentos; consentimento explícito numa página do painel, que mostra o aplicativo, o
  endereço de retorno e os projetos; código de uso único válido por 5 minutos e ligado a uma prova
  criptográfica (PKCE, S256); credencial de acesso de 1 hora e credencial de renovação trocada a
  cada uso, as duas guardadas só como hash; uma credencial de renovação reapresentada depois de
  trocada encerra a conexão; **só leitura**, pelas mesmas consultas do painel; até 10 conexões
  ativas por pessoa; fim depois de 90 dias sem uso; revogáveis a qualquer momento no painel;
  limitadas a 120 mensagens por minuto no servidor MCP e a 60 consultas por minuto. Não servem para
  login, para escrita nem para exclusão.

**7. Proteção contra abuso.** Limite de envio de lotes por endereço de origem e por projeto; lote
com no máximo 50 eventos e 32 KB; validação estrita de cada campo; eventos inválidos descartados;
recepção pausada quando a conta chega a 150% do limite mensal de eventos no plano pago, ou a 100% no
plano grátis; os registros técnicos dizem quando um evento ou uma propriedade foi recusado e por qual
regra, sem guardar o valor recusado.

**8. Infraestrutura.** A função da API recusa chamadas que não passem pela rede de distribuição
(segredo de borda conferido em tempo constante). O usuário de banco da aplicação não pode alterar a
estrutura do banco; as migrações usam um usuário separado. Cada função tem o seu próprio papel de
permissões na AWS, com o mínimo necessário.

**9. Registros (logs).** Os registros da API são estruturados e trazem um identificador da
requisição, identificadores internos (do projeto, da pessoa do painel e da conexão), nomes de
eventos e, nas conexões, qual aplicativo se conectou; **não
trazem e-mail, IP, token, chave nem dados de visitantes**. Ficam 14 dias e somem.

**10. Monitoramento.** Alarmes por e-mail para: muitas tentativas de login com código errado,
muitos pedidos de código recusados, erros inesperados da API, falhas e estrangulamento da função
da API e tamanho do banco.

**11. Desenvolvimento.** Código público com revisão automática de segurança (CodeQL), varredura de
segredos com bloqueio de envio, alertas e atualizações de dependências, auditoria de dependências e
testes automáticos com cobertura total em cada mudança. A publicação em produção é feita só pelo
responsável, depois dos testes aprovados.

**12. Cópias de segurança.** As da Neon: histórico de recuperação de até 7 dias e cópias de
segurança cifradas mantidas por até 30 dias.

**13. Resposta a incidentes.** Conforme a Cláusula 11, com registro de cada incidente por 5 anos.

---

## Anexo III — Suboperadores

Situação em 15/10/2026.

**Suboperadores que tratam dados dos visitantes dos seus sites:**

| Provedor | O que faz no Pyxis | Onde | Contrato de tratamento | Prazo das cópias e registros |
|---|---|---|---|---|
| **Amazon Web Services (AWS)** | API que recebe os eventos e responde às consultas; rotinas diárias (limpeza de 13 meses, uso mensal, ícones, fim das contas) e semanais (resumo); arquivos de exportação dos eventos (Amazon S3); registros técnicos; guarda de segredos; rede de distribuição (CloudFront) na frente da API | Região de São Paulo (sa-east-1). A rede de distribuição recebe as requisições em pontos de presença no mundo todo, sem guardá-las | Contrato de Cliente da AWS e o Adendo de Tratamento de Dados da AWS. A AWS se compromete a não tirar os dados da região escolhida, salvo o necessário para prestar o serviço ou cumprir a lei | Registros da API: 14 dias. Arquivos de exportação: 7 dias |
| **Neon** (Databricks, Inc., EUA) | Banco de dados (Postgres) onde ficam os eventos e a configuração dos projetos | Servidores na região de São Paulo da AWS (aws-sa-east-1); empresa nos EUA | Termos da Neon/Databricks e o Adendo de Tratamento de Dados da Databricks | Histórico de recuperação: até 7 dias. Cópias de segurança: até 30 dias |
| **Vercel Inc.** (EUA) | Hospeda o painel (`app.pyxis-analytics.dev`): monta as páginas que mostram os seus números a quem está logado | Funções na região de São Paulo (gru1); empresa e processamento principal nos EUA | Adendo de Tratamento de Dados da Vercel | Registros técnicos das requisições ao painel: 1 dia |

**Provedores que não recebem dados dos visitantes** (listados para transparência; o tratamento que
fazem está na Política de Privacidade do Pyxis):

| Provedor | O que faz | Onde |
|---|---|---|
| **Amazon SES** (Amazon Web Services) | Envia os e-mails do serviço: códigos de login e de cadastro, convites, boas-vindas, avisos de uso e de fim da conta, aviso de exportação pronta (com o link do painel, não o arquivo) e o resumo semanal com números agregados | Região de São Paulo (sa-east-1) |
| **Stripe** (Stripe Brasil Soluções de Pagamento – Instituição de Pagamento Ltda. e Stripe, LLC, EUA) | Cobrança da assinatura | Brasil e EUA |
| **ImprovMX** (ImprovMX Incorporated, EUA) | Encaminha os e-mails enviados a hello@pyxis-analytics.dev | Recepção transitória na França; empresa nos EUA |
| **Google** (Google LLC, EUA) | Caixa de e-mail onde ficam as mensagens de suporte (conta pessoal, sem contrato de operador: o Google trata as mensagens como controlador, conforme a própria política de privacidade) | EUA e outros países |

**Aplicativos que as pessoas com acesso conectam** (não são suboperadores; Anexo I, item 10):

| Aplicativo | Quem é | O que recebe | Onde |
|---|---|---|---|
| **Claude** e **Claude Code** | Anthropic, PBC (EUA) | Os dados que o aplicativo pedir, quando uma pessoa com acesso o conectou e o usa | EUA |

Não mande dados de visitantes nas mensagens de suporte. Se precisar mostrar um caso, use o
identificador da visita ou do usuário, nunca o nome ou o e-mail da pessoa.

---

## Anexo IV — Modelo de aviso para o seu site

Texto sugerido para a política de privacidade do seu site. Ajuste ao que o seu site realmente
envia. Ele não substitui a sua própria análise.

> **Medição de uso do site**
>
> Usamos o Pyxis para entender como o site é usado: quais páginas são vistas, de onde vêm as
> visitas e quais recursos são usados. A medição **não usa cookies**, **não guarda o seu endereço
> IP** e **não guarda o seu navegador completo**. Registramos a página vista (sem os parâmetros do
> endereço, exceto os de campanha), o site de onde você veio, o tipo de aparelho, a família do
> navegador e do sistema, o país e o estado (nunca a cidade) e as ações que marcamos no site. Cada
> visita recebe um número aleatório que fica só na aba do navegador e é descartado ao fechar a aba
> ou depois de 30 minutos sem atividade; não há identificador que reconheça você em outra visita.
>
> *(Inclua o parágrafo abaixo só se o seu site usar a função `identify`.)* Quando você entra na sua
> conta, ligamos os eventos daquela visita ao número interno da sua conta, nunca ao seu nome ou
> e-mail. Se você excluir a sua conta ou pedir, apagamos esses eventos.
>
> *(Opcional: inclua se a sua equipe conectar ferramentas de inteligência artificial ao Pyxis.)*
> Podemos consultar esses números com ferramentas de inteligência artificial que escolhemos, como o
> Claude, da Anthropic, que recebem só o que pedirmos a elas.
>
> Os dados ficam guardados no Brasil e são apagados depois de 13 meses. O Pyxis trata esses dados
> por nossa conta, como operador. Se o seu navegador enviar o sinal Global Privacy Control ou "Do
> Not Track", nada é enviado. Para exercer os seus direitos previstos na LGPD, fale conosco pelo
> canal indicado nesta política.
