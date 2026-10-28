# Accordo sul trattamento dei dati personali di Pyxis

**Versione {{terms.version}}, in vigore con decorrenza {{terms.effectiveFrom}}.**

> Questa è una traduzione di cortesia. Il testo vincolante è la versione in portoghese
> ([Português](/acordo-de-tratamento)); in caso di differenze tra le due, prevale il testo
> portoghese.

Questo accordo è l'**Allegato 1 dei Termini di utilizzo di Pyxis** e fa parte del contratto tra te e
noi. Spiega come trattiamo i dati personali che arrivano a Pyxis dai tuoi siti, secondo la Lei Geral
de Proteção de Dados Pessoais (Lei nº 13.709/2018, la "LGPD"; legge generale brasiliana sulla
protezione dei dati personali). Se qualcosa qui contrasta con i Termini di utilizzo, prevale questo
accordo per quanto riguarda i dati personali.

---

## Clausola 1 — Chi sono le parti

1.1. **Noi:** {{seller.name}}, persona fisica, iscritto al CPF (codice fiscale brasiliano delle
persone fisiche) con il n. {{seller.taxId}}, con indirizzo in
{{seller.address}}, che offre il servizio con il nome **Pyxis**. Contatto:
**hello@pyxis-analytics.dev**.

1.2. **Tu:** la persona o l'azienda che ha sottoscritto il Pyxis ospitato, accettando i Termini di
utilizzo, rappresentata nel pannello (dashboard) dal proprietario dell'account (Termini di utilizzo,
Clausola 2.9). Questo accordo vale allo stesso modo nel piano gratuito e nel piano a pagamento
(Termini di utilizzo, Clausola 7.1).

## Clausola 2 — Termini usati in questo accordo

2.1. I termini **dato personale**, **trattamento**, **interessato**, **titolare del trattamento**,
**responsabile del trattamento**, **anonimizzazione**, **eliminazione**, **trasferimento
internazionale** e **incidente di sicurezza** hanno il significato della LGPD (art. 5) e delle
delibere dell'Agência Nacional de Proteção de Dados (ANPD; Autorità nazionale brasiliana per la
protezione dei dati).

2.2. **Visitatore** è la persona che accede a un tuo sito o a una tua app in cui è installato il
tracker di Pyxis.

2.3. **Evento** è ciascun record che il tracker invia a Pyxis, come una pagina vista o un'azione
che hai contrassegnato.

2.4. **Progetto** è la configurazione di un tuo sito in Pyxis: nome, indirizzi (origini)
autorizzati, fuso orario, evento di conversione, chiavi ed eventi.

2.5. **Sub-responsabile del trattamento** è il fornitore che incarichiamo e che tratta, per nostro
conto, dati personali oggetto di questo accordo.

## Clausola 3 — Ruoli di ciascuna parte

3.1. Rispetto ai dati dei visitatori dei tuoi siti, **tu sei il titolare del trattamento** e **noi
siamo il responsabile del trattamento** (LGPD, art. 5, VI e VII). Tu decidi se e come misurare; noi
trattiamo i dati per prestare il servizio che hai sottoscritto.

3.2. Se usi Pyxis per misurare siti di terzi (per esempio, come agenzia), dichiari di avere
l'autorizzazione del titolare del trattamento di tali siti per incaricarci e per impartire le
istruzioni di questo accordo. In tal caso, agiamo come sub-responsabile del trattamento, e tu
trasmetti al titolare le informazioni di questo accordo di cui ha bisogno.

3.3. Rispetto ai dati del tuo account (le e-mail di chi accede al pannello, l'account e
l'abbonamento, l'accettazione dei termini, lo storico della fatturazione, la prevenzione della prova
gratuita ripetuta, i registri dei collegamenti delle app e i messaggi di assistenza), **noi siamo il
titolare del trattamento**. Tale trattamento è descritto nell'**Informativa sulla privacy di Pyxis**
(Allegato 2 dei Termini di utilizzo), non in questo accordo.

## Clausola 4 — Che cosa trattiamo, per quale scopo e per quanto tempo

4.1. L'**Allegato I** di questo accordo descrive il trattamento: finalità, interessati, categorie di
dati, ciò che **non** viene conservato, dove si trovano i dati e per quanto tempo.

4.2. Trattiamo i dati dei visitatori **esclusivamente** per:

1. ricevere gli eventi inviati dal tracker e conservarli nel tuo progetto;
2. mostrare l'analisi a te e alle persone che hai autorizzato, nel pannello, nell'API di
   consultazione, nel server MCP (anche alle app che esse collegano; Allegato I, punto 10) e nel
   riepilogo settimanale via e-mail;
3. dare seguito alle richieste di eliminazione e di copia dei dati degli interessati (Clausola 10);
4. mantenere il servizio sicuro e funzionante (limiti contro gli abusi, correzione dei guasti, copie
   di backup dei fornitori);
5. adempiere a un obbligo di legge o a un ordine di un'autorità competente (Clausola 15);
6. generare, su richiesta del proprietario dell'account, il file di esportazione degli eventi di un
   progetto (Allegato I, punto 11);
7. verificare e contenere un sospetto di abuso o di uso contrario ai Termini di utilizzo (Clausole 12
   e 18 dei Termini), solo con i dati che il servizio già conserva e solo nella misura necessaria
   (Clausola 7.2).

4.3. **Non usiamo i dati dei tuoi progetti per nessun'altra finalità.** Non li vendiamo, non li
noleggiamo, non li usiamo per pubblicità, non li usiamo per addestrare modelli di intelligenza
artificiale e non li combiniamo con dati di altri clienti. Gli unici numeri che ricaviamo dai tuoi
progetti per uso proprio sono conteggi operativi, come il numero di eventi al mese di ciascun account
e la dimensione del database, usati per applicare il limite mensile del piano (Termini di utilizzo,
Clausola 7.2), sapere se un account del piano gratuito è rimasto senza ricevere eventi (Termini di
utilizzo, Clausola 7.6) e verificare la capacità del servizio.

## Clausola 5 — Le tue istruzioni

5.1. Le tue istruzioni per il trattamento sono, nel loro insieme:

1. i Termini di utilizzo e questo accordo;
2. la configurazione dei tuoi progetti (origini autorizzate, fuso orario, evento di conversione,
   chiavi e persone con accesso), effettuata dal proprietario dell'account nel pannello o, su
   richiesta, da noi;
3. ciò che il tracker installato sul tuo sito invia (quali eventi, proprietà e se usi la funzione
   `identify`);
4. le azioni del proprietario dell'account nel pannello (per esempio, esportare gli eventi,
   cancellare un progetto o chiudere l'account), le chiamate che fai all'API con la tua chiave
   segreta o con un token di accesso, e i collegamenti di app che le persone con accesso consentono
   nel pannello (Allegato I, punto 10);
5. le richieste che ci invii per iscritto, all'e-mail hello@pyxis-analytics.dev.

5.2. Se una tua istruzione ci sembra contraria alla LGPD o a un'altra legge, te lo segnaliamo per
iscritto e non la eseguiamo finché la questione non è risolta: il responsabile del trattamento che
segue un'istruzione illecita risponde in solido con il titolare (LGPD, art. 42, § 1, I).

5.3. Un'istruzione che richieda di modificare il funzionamento del servizio per tutti i clienti (per
esempio, conservare un dato che Pyxis non conserva) non è vincolante per noi; in tal caso, puoi
risolvere il contratto secondo i Termini di utilizzo.

5.4. **Sospensione del trattamento.** Possiamo sospendere, in tutto o in parte, il trattamento di
un progetto (normalmente, la ricezione di nuovi eventi), secondo la procedura della Clausola 18 dei
Termini di utilizzo, quando:

1. il progetto invia dati personali diretti o sensibili, in violazione della Clausola 6.1, punti 3
   e 4;
2. il progetto invia eventi di chi ha chiesto di non essere misurato, in violazione della
   Clausola 6.1, punto 5;
3. una tua istruzione è illecita (Clausola 5.2);
4. è necessario per contenere un incidente di sicurezza (Clausola 11.6); oppure
5. una legge o un'autorità competente lo impone (Clausola 15).

Durante la sospensione, i dati già ricevuti restano conservati, con le stesse misure di sicurezza
(Allegato II); nessun nuovo dato viene ricevuto nella parte sospesa; i termini di conservazione e di
eliminazione della Clausola 12 continuano a valere; e i dati ricevuti in violazione di questo accordo
vengono cancellati su tua istruzione (Clausola 10.6). La sospensione non modifica i tuoi doveri di
titolare del trattamento nei confronti degli interessati.

## Clausola 6 — Che cosa garantisci come titolare del trattamento

6.1. Garantisci di:

1. avere una base giuridica valida (LGPD, art. 7) per misurare l'uso dei tuoi siti con Pyxis. Per la
   misurazione senza cookie e senza dati personali diretti che Pyxis effettua, la base più comune è
   il legittimo interesse (art. 7, IX, e art. 10), che richiede trasparenza e rispetto delle
   aspettative del visitatore; la valutazione spetta a te;
2. informare i visitatori della misurazione, nell'informativa sulla privacy del tuo sito, in modo
   chiaro. L'**Allegato IV** contiene un modello;
3. **non inviare a Pyxis dati personali diretti né dati personali sensibili**: niente nome, e-mail,
   telefono, CPF, indirizzo, numero di documento, testo digitato dal visitatore, dato sanitario,
   origine razziale, religione, opinione politica, vita sessuale, dato genetico o biometrico, né
   qualsiasi dato che identifichi da solo una persona;
4. se usi la funzione `identify`, inviare solo un **identificativo interno e opaco** dell'account
   nel tuo sistema (per esempio, un numero di registrazione casuale), mai l'e-mail, il CPF, il
   telefono o un altro dato che identifichi direttamente la persona;
5. non disattivare né aggirare il rispetto dei segnali "non tracciare" del browser (Global Privacy
   Control e Do Not Track) né l'opzione di non essere misurati (`optOut`) offerta dal tracker, né
   inviare per un'altra via eventi di chi ha chiesto di non essere misurato;
6. se il tuo sito è rivolto a bambini o adolescenti, aver valutato il trattamento alla luce
   dell'art. 14 della LGPD e del loro superiore interesse prima di installare il tracker;
7. rispondere alle richieste degli interessati dei tuoi siti, con il nostro supporto (Clausola 10);
8. pubblicare, ove applicabile, le informazioni sul trasferimento internazionale richieste
   dall'art. 17, § 2, del Regolamento approvato dalla Resolução CD/ANPD nº 19/2024 (delibera del
   Consiglio direttivo dell'ANPD), usando le informazioni della Clausola 9 e dell'Allegato III;
9. installare il tracker e registrare come origine di un progetto solo siti tuoi o di chi ti ha
   autorizzato (Clausola 3.2).

6.2. Il server di Pyxis scarta automaticamente valori che hanno forma di e-mail o sequenze di 10 o
più cifre (come CPF, CNPJ — codice fiscale brasiliano delle persone giuridiche — e telefono) nelle
proprietà degli eventi, nei parametri di campagna e nell'identificativo utente. Questa barriera è un
**secondo livello**: non riconosce nomi, indirizzi né testi liberi. **La responsabilità per ciò che
il tuo sito invia è tua.**

6.3. Se ti accorgi di aver inviato dati personali diretti a Pyxis, avvisaci. Ti aiutiamo a
cancellarli (Clausola 10.6). Se ce ne accorgiamo noi, dai registri di rifiuto della barriera o in
altro modo, ti avvisiamo.

## Clausola 7 — Riservatezza

7.1. Oggi Pyxis è gestito da una sola persona: la persona indicata nella Clausola 1.1. È l'unica
persona con accesso amministrativo ai sistemi e al database.

7.2. Accediamo ai dati di un progetto solo quando è necessario per: (a) l'assistenza che hai
richiesto; (b) indagare su o correggere un guasto o un incidente di sicurezza; (c) la manutenzione
del servizio; (d) adempiere a un obbligo di legge o a un ordine dell'autorità; oppure (e) verificare
un sospetto concreto di abuso (Clausola 18 dei Termini di utilizzo), esaminando solo quanto
necessario per confermarlo o escluderlo.

7.3. Se, in futuro, un'altra persona inizierà a gestire il servizio con noi, avrà accesso solo dopo
aver assunto per iscritto lo stesso dovere di riservatezza di questo accordo, e te lo comunicheremo.

7.4. Il dovere di riservatezza e di sicurezza continua a valere dopo la fine del contratto (LGPD,
art. 47).

## Clausola 8 — Sicurezza

8.1. Adottiamo misure tecniche e amministrative per proteggere i dati da accessi non autorizzati e
da distruzione, perdita, alterazione, comunicazione o qualsiasi trattamento inadeguato o illecito
(LGPD, art. 46). Le misure in vigore sono nell'**Allegato II**.

8.2. Possiamo sostituire una misura con un'altra equivalente o migliore. Durante il contratto non
riduciamo il livello generale di protezione descritto nell'Allegato II.

8.3. Il codice sorgente di Pyxis è pubblico (licenza MIT). Puoi verificare come il servizio tratta i
dati nei repository `pyxis-api`, `pyxis-sdk`, `pyxis-web` e `pyxis-mcp`, su GitHub.

## Clausola 9 — Sub-responsabili del trattamento e trasferimento internazionale

9.1. **Autorizzazione.** Autorizzi l'uso dei sub-responsabili del trattamento elencati
nell'**Allegato III**. Ciascuno tratta solo quanto necessario per la parte del servizio che presta.

9.2. **Modifiche.** Prima di aggiungere o sostituire un sub-responsabile che tratti dati dei
visitatori, ti avvisiamo via e-mail con **almeno 30 giorni di anticipo**, indicando chi è, che cosa
farà e dove. Se non sei d'accordo, puoi risolvere il contratto prima della modifica e ricevi in
restituzione l'importo proporzionale al periodo pagato e non usato. In un'emergenza (per esempio, un
fornitore che ha smesso di funzionare o che è diventato insicuro), la sostituzione può essere
immediata; ti avvisiamo entro 5 giorni lavorativi, e hai lo stesso diritto di risolvere il contratto
con rimborso proporzionale.

9.3. **Contratti con i sub-responsabili.** I fornitori dell'Allegato III sono grandi aziende che
contrattano con condizioni standard, che non negoziamo. Scegliamo fornitori le cui condizioni
includono impegni di sicurezza, riservatezza e trattamento conforme alle nostre istruzioni.
L'Allegato III indica il contratto di ciascuno.

9.4. **Dove si trovano i dati.** Gli eventi dei tuoi progetti sono **conservati in Brasile**: nel
database di Neon, che gira nella regione di San Paolo di AWS, ed elaborati dall'API nella regione di
San Paolo di AWS (sa-east-1).

9.5. **Dove c'è un elemento estero.** Anche con i dati conservati in Brasile, ci sono quattro
situazioni che devi conoscere:

1. **Rete di distribuzione di AWS (CloudFront).** Le richieste del browser del visitatore arrivano
   al punto di presenza AWS più vicino a lui, che può trovarsi fuori dal Brasile quando il visitatore
   è fuori dal Brasile. Questo punto si limita a inoltrare la richiesta a San Paolo: la cache è
   disattivata e non conserviamo i registri di accesso di CloudFront.
2. **Società con sede negli Stati Uniti.** Neon fa parte di Databricks, Inc.; Vercel Inc. ospita
   il pannello. Entrambe sono società degli USA, e i loro team e sistemi possono accedere ai dati da
   fuori del Brasile per operare, fornire assistenza ed effettuare copie di backup.
3. **Pannello.** Le pagine del pannello sono generate in funzioni di Vercel nella regione di San
   Paolo (gru1), ma Vercel dichiara che la sua elaborazione principale avviene negli USA. I registri
   tecnici delle richieste al pannello restano presso Vercel per 1 giorno.
4. **App collegate.** Se una persona con accesso collega Claude o Claude Code, i dati che richiede
   all'app vanno ad Anthropic, negli USA, su tua istruzione (Clausola 5.1, punto 4, e Allegato I,
   punto 10). Anthropic non è nostra sub-responsabile del trattamento.

Le e-mail del servizio, compreso il riepilogo settimanale (che contiene solo numeri aggregati del
progetto, senza dati di visitatori identificabili; Allegato I, punto 6), partono tramite Amazon SES,
nella regione di San Paolo di AWS (Allegato III).

9.6. **Meccanismo di trasferimento.** Alla data di questa versione, i contratti di trattamento dei
dati (DPA) di AWS, di Databricks (Neon) e di Vercel prevedono clausole contrattuali tipo dell'Unione
europea e impegni di sicurezza, ma **non incorporano le clausole contrattuali tipo approvate
dall'ANPD** (Resolução CD/ANPD nº 19/2024). Per ridurre al minimo ciò che esce dal Brasile (art. 9,
paragrafo unico, del Regolamento), Pyxis non conserva l'IP, non conserva il browser completo, non usa
cookie sui tuoi siti e riduce gli indirizzi delle pagine a modelli (Allegato II). Ci impegniamo a:
(a) adottare le clausole contrattuali tipo dell'ANPD o un altro meccanismo valido dell'art. 33 della
LGPD non appena uno di questi fornitori lo offra, o cambiare fornitore se necessario; (b) avvisarti
di qualsiasi modifica su questo punto; e (c) fornirti, su richiesta, le informazioni di cui hai
bisogno per valutare il trasferimento (art. 4, § 1, del Regolamento).

## Clausola 10 — Richieste degli interessati

10.1. **Chi risponde.** In qualità di titolare del trattamento, rispondi tu ai visitatori e agli
utenti dei tuoi siti che chiedono conferma, accesso, rettifica, eliminazione o un altro provvedimento
dell'art. 18 della LGPD. Noi ti aiutiamo come descritto di seguito.

10.2. **È possibile trovare solo chi è stato identificato.** Pyxis non conserva cookie, IP né
identificativi persistenti del visitatore anonimo. L'identificativo della visita è casuale, resta
solo nella scheda del browser e viene sostituito alla chiusura della scheda o dopo 30 minuti di
inattività. Per questo, **non è possibile trovare le visite anonime di una persona**. Si possono
individuare solo gli eventi di qualcuno che il tuo sito ha identificato con la funzione `identify`,
tramite l'identificativo interno che hai inviato.

10.3. **Eliminare i dati di una persona (da te, tramite l'API).** Chiama
`DELETE https://api.pyxis-analytics.dev/v1/subjects/{userId}` con la chiave segreta del progetto
(intestazione `Authorization: Bearer`). Pyxis cancella **tutti gli eventi con quell'identificativo e
anche le visite in cui la persona è stata identificata**, compresi gli eventi anonimi di quella
stessa visita precedenti all'identificazione (per esempio, la pagina di ingresso e la provenienza
della visita). La risposta indica quanti eventi sono stati cancellati. Una nuova chiamata risponde
zero; ripetere è sicuro.

10.4. **Copiare i dati di una persona (da te, tramite l'API).** Chiama
`GET https://api.pyxis-analytics.dev/v1/subjects/{userId}/events` con la chiave segreta. La risposta
restituisce gli stessi eventi che l'eliminazione cancellerebbe, in ordine, fino a 1.000 per pagina,
in JSON. Se ce ne sono di più, la risposta indica il cursore successivo (`next_after`), che passi
come `?after=` per ottenere la pagina seguente. Ogni evento include nome, data e ora, identificativo
della visita, pagina, provenienza, dispositivo, paese, regione e proprietà.

10.5. **Limiti di queste rotte.** Le due rotte accettano fino a 60 chiamate al minuto per chiave e
per indirizzo di origine. La chiave segreta va usata solo sul tuo server, mai nel browser.

10.6. **Chiedendo a noi.** Se preferisci, invia la richiesta a hello@pyxis-analytics.dev,
dall'e-mail di una persona con accesso al progetto, con l'identificativo dell'utente e ciò che
desideri (eliminazione o copia). Provvediamo **entro 5 giorni lavorativi** e rispondiamo con il
risultato (il numero di eventi cancellati o il file con la copia). Lo stesso vale se hai inviato dati
personali per errore e devi cancellarli.

10.7. **Richiesta che arriva direttamente a noi.** Se un interessato dei tuoi siti ci contatta, non
rispondiamo nel merito al posto tuo: **entro 2 giorni lavorativi**, ti inoltriamo la richiesta e
informiamo l'interessato che il titolare del trattamento sei tu e qual è il tuo canale, quando lo
conosciamo.

10.8. **Termini di legge.** I termini per rispondere all'interessato sono tuoi, in qualità di
titolare del trattamento (per esempio, fino a 15 giorni per la dichiarazione completa dell'art. 19,
II, della LGPD, o il termine differenziato per gli agenti di piccole dimensioni, se rientri in tale
categoria). I nostri termini sopra indicati sono stati pensati per rientrare in essi.

## Clausola 11 — Incidenti di sicurezza

11.1. Se veniamo a conoscenza di un incidente di sicurezza che ha interessato o può aver interessato
dati personali di un tuo progetto, ti avvisiamo **senza ingiustificato ritardo ed entro 48 ore** da
tale conoscenza, all'e-mail delle persone con accesso al progetto.

11.2. L'avviso indica ciò che sappiamo fino a quel momento, e lo completiamo in seguito, non appena
abbiamo più informazioni:

1. che cosa è successo, quando è successo (se è possibile saperlo) e quando lo abbiamo saputo;
2. la natura e le categorie dei dati interessati e, quando è possibile stimarlo, quanti interessati;
3. le misure di sicurezza che proteggevano i dati prima dell'incidente;
4. i rischi e gli impatti possibili per gli interessati;
5. ciò che abbiamo già fatto e ciò che faremo per contenere l'incidente e ridurne gli effetti;
6. un contatto per seguire il caso.

11.3. Questo termine è stato scelto affinché tu possa rispettare il tuo: il titolare del trattamento
deve comunicare all'ANPD e agli interessati l'incidente che può causare un rischio o un danno
rilevante entro 3 giorni lavorativi dalla conoscenza (Resolução CD/ANPD nº 15/2024, artt. 6 e 9),
termine che è raddoppiato per gli agenti di piccole dimensioni.

11.4. La comunicazione all'ANPD e agli interessati dei tuoi siti spetta a te, in qualità di titolare
del trattamento (LGPD, art. 48). Noi collaboriamo con le informazioni di cui disponiamo e non
facciamo comunicazioni pubbliche sui dati del tuo progetto senza prima parlarne con te, salvo obbligo
di legge.

11.5. Conserviamo il registro di ogni incidente di sicurezza con dati personali, compresi quelli che
non è stato necessario comunicare, per **almeno 5 anni**.

11.6. Per contenere un incidente o un attacco in corso, possiamo sospendere immediatamente parti del
servizio (per esempio, revocare una chiave o interrompere la ricezione degli eventi di un progetto),
nella misura necessaria. Avvisiamo come nella Clausola 11.1, quando sono coinvolti dati personali, o
come nella Clausola 18.4 dei Termini di utilizzo, e ripristiniamo non appena il rischio è passato.

## Clausola 12 — Conservazione ed eliminazione

12.1. **Durante il contratto.** Gli eventi restano conservati per **13 mesi**. Una procedura
giornaliera cancella gli eventi con più di 13 mesi, di tutti i progetti.

12.2. **Fine del contratto.** **30 giorni dopo la fine dell'accesso** (la fine del periodo pagato
dopo una disdetta o la fine dell'abbonamento per mancato pagamento, quando l'account non torna al
piano gratuito; la chiusura dell'account dal pannello; la fine del piano gratuito; oppure la
risoluzione da parte nostra; Termini di utilizzo, Clausole 2.10 e 11.4), una procedura giornaliera
cancella definitivamente l'account, i progetti e tutto ciò che appartiene loro:
eventi, chiavi, configurazioni, icona del sito, registri di invio del riepilogo settimanale,
richieste di esportazione e gli accessi delle persone ai progetti. Cancelliamo anche la registrazione
(e-mail, sessioni, token e app collegate) del proprietario dell'account e delle persone che avevano
accesso solo
a progetti del tuo account. Se cancelli un progetto dal pannello prima di allora, gli eventi e
tutto ciò che gli appartiene vengono cancellati subito.

12.3. **Copia prima dell'eliminazione.** Fino alla data dell'eliminazione, il proprietario
dell'account esporta gli eventi di ciascun progetto dal pannello, in un file CSV compresso che resta
disponibile per 7 giorni (Termini di utilizzo, Clausola 11.5; Allegato I, punto 11). Se
l'esportazione dal pannello non funziona, inviamo il file **entro 10 giorni lavorativi** dalla
richiesta fatta via e-mail; se la richiesta arriva vicino alla data dell'eliminazione, rinviamo
l'eliminazione fino alla consegna della copia.

12.4. **Copie dei fornitori.** Dopo l'eliminazione, i dati possono ancora esistere per un tempo
limitato nelle copie di backup automatiche del fornitore del database: lo storico di ripristino di
Neon conserva le modifiche fino a 7 giorni, e le copie di backup di Neon sono mantenute fino a
30 giorni. Queste copie non sono usate per nient'altro che per il ripristino in caso di disastro e
scompaiono da sole entro questi termini. Un file di esportazione non ancora scaduto scompare, al
massimo, 7 giorni dopo essere stato pronto. I registri tecnici dell'API (che non contengono dati dei
visitatori; Allegato II, punto 9) scompaiono in 14 giorni.

12.5. **Conferma.** Il proprietario dell'account riceve un'e-mail quando l'eliminazione è
effettuata. Su tua richiesta, confermiamo anche la data e che cosa è stato cancellato.

12.6. **Eccezione: conservazione per legge o per ordine.** Conserviamo dati dei tuoi progetti oltre
questi termini solo quando una legge, un ordine giudiziario o una richiesta di un'autorità competente
ci obbliga, o quando sono necessari per un procedimento giudiziario, amministrativo o arbitrale
(LGPD, artt. 7, VI, e 16, I). In tal caso, conserviamo solo i dati interessati, senza alcun altro
uso, per il tempo richiesto, e poi li cancelliamo; ti avvisiamo, salvo che la legge o l'ordine vieti
l'avviso.

12.7. **Account del piano gratuito senza eventi.** Un account del piano gratuito che non riceve alcun
evento nei 30 giorni successivi alla creazione, o che resta 90 giorni consecutivi senza ricevere
eventi, viene cancellato come indicato nella Clausola 7.6 dei Termini di utilizzo: il proprietario
dell'account riceve un avviso via e-mail e, se l'account è ancora senza eventi 7 giorni dopo, una
procedura giornaliera cancella l'account, i progetti e tutto ciò che appartiene loro, come al punto
12.2, senza il termine di 30 giorni di tale punto. Fino ad allora, il proprietario dell'account può
esportare gli eventi (punto 12.3). Valgono anche i punti 12.4 (copie dei fornitori), 12.5 (conferma
via e-mail) e 12.6 (conservazione per legge o per ordine).

## Clausola 13 — Informazioni e audit

13.1. Se lo chiedi per iscritto, forniamo le informazioni necessarie a dimostrare che rispettiamo
questo accordo, **entro 15 giorni**. Ciò include rispondere a un questionario ragionevole di
sicurezza e di privacy, senza costi, una volta all'anno e dopo qualsiasi incidente.

13.2. Poiché il codice di Pyxis è pubblico, puoi verificare direttamente il funzionamento del
servizio. Date le dimensioni del servizio, non offriamo audit in loco né accesso ai sistemi di
produzione; i rapporti e le certificazioni dei fornitori (AWS, Databricks/Neon, Vercel) sono
disponibili sui loro siti.

13.3. Collaboriamo con l'ANPD e con le altre autorità competenti nelle attività di controllo che
riguardano i dati dei tuoi progetti.

## Clausola 14 — Responsabilità

14.1. Ciascuna parte risponde dei danni che causa violando la LGPD o questo accordo. Noi, in qualità
di responsabile del trattamento, rispondiamo nei confronti degli interessati ai sensi dell'art. 42
della LGPD: quando violiamo la normativa sulla protezione dei dati o non seguiamo le tue istruzioni
lecite.

14.2. Tra te e noi, vale la Clausola 19 (Responsabilità) dei Termini di utilizzo. Nulla in essa
riduce i diritti degli interessati né il diritto di regresso dell'art. 42, § 4, della LGPD.

## Clausola 15 — Richieste delle autorità

15.1. Consegniamo dati dei tuoi progetti a un'autorità solo in presenza di un ordine giudiziario o
di una richiesta fatta da chi ha la competenza legale per farla (Marco Civil da Internet — quadro
normativo brasiliano di Internet —, Lei nº 12.965/2014, art. 10).

15.2. Prima di consegnarli, ti avvisiamo, salvo che la legge o l'ordine vietino l'avviso.
Consegniamo solo quanto richiesto.

## Clausola 16 — Durata e modifiche

16.1. Questo accordo vale finché sono in vigore i Termini di utilizzo e, dopo di essi, finché i dati
non sono eliminati secondo la Clausola 12.

16.2. Le modifiche a questo accordo seguono la regola di modifica dei Termini di utilizzo (preavviso
di 30 giorni e diritto di risolvere il contratto). Le modifiche imposte dalla legge o dall'ANPD
possono valere prima; in tal caso, puoi risolvere il contratto con rimborso proporzionale del periodo
pagato e non usato.

---

## Allegato I — Descrizione del trattamento

**1. Finalità.** Misurare l'uso dei siti e delle app del cliente e mostrare l'analisi al cliente;
dare seguito alle richieste degli interessati; mantenere la sicurezza e il funzionamento del
servizio.

**2. Interessati.** (a) Visitatori dei siti e delle app del cliente; (b) utenti del sistema del
cliente che questi identifica con la funzione `identify`.

**3. Dati di ciascun evento conservato.**

| Dato | Com'è |
|---|---|
| Identificativo dell'evento | Numero casuale generato nel browser |
| Nome dell'evento | `page_view` (pagina vista), `api_request` (chiamata all'API del sito), `identify` o un nome definito dal cliente |
| Data e ora | Quella del browser, corretta per la differenza di orologio, e quella di ricezione sul server |
| Identificativo della visita | Numero casuale conservato nel `sessionStorage` della scheda; sostituito alla chiusura della scheda o dopo 30 minuti di inattività |
| Identificativo utente | Solo se il cliente usa `identify`: l'identificativo interno dell'account nel sistema del cliente, con fino a 64 lettere, numeri, `-` o `_` (non accetta `@`, quindi non accetta e-mail) |
| Pagina | Solo il percorso, in forma di modello: le parti che sembrano identificativi (numeri, codici lunghi, e-mail) diventano `:id`; senza dominio e senza parametri |
| Provenienza della visita | Solo il dominio da cui proviene il visitatore (per esempio, `google.com`), senza l'indirizzo completo |
| Campagna | `utm_source`, `utm_medium` e `utm_campaign`, se presenti nell'indirizzo; il canale (a pagamento, e-mail, social, campagna, ricerca organica, altro sito o diretto) calcolato a partire da essi e dalla provenienza |
| Clic su annuncio | Solo vero o falso. Il codice del clic (come `gclid`) non viene conservato |
| Dispositivo | Categoria: cellulare, tablet, computer o altro |
| Browser e sistema | Solo la famiglia (per esempio, `chrome`, `safari`, `android`, `ios`), senza versione |
| Paese e regione | Codice del paese (2 lettere) e regione (codice e nome), forniti dalla rete di AWS al momento della richiesta. **Mai la città** |
| Proprietà | Fino a 10 per evento, definite dal cliente: chiave con fino a 40 caratteri (`a-z`, `0-9`, `_`) e valore breve (testo fino a 100 caratteri, numero o vero/falso) |
| Chiamate all'API del sito (`api_request`) | Metodo, rotta in forma di modello, codice di risposta, durata e, se presente, il codice dell'errore |

**4. Che cosa Pyxis non conserva.**

- **Indirizzo IP:** usato solo nella memoria della funzione dell'API, per limitare gli abusi, per la
  durata della finestra del limite (1 minuto nell'invio degli eventi; 15 minuti nell'accesso al
  pannello). Non viene mai registrato nel database né nei registri.
- **Browser completo (user agent):** letto al momento per ricavare la categoria del dispositivo, la
  famiglia del browser e quella del sistema; poi scartato. Le visite di robot noti vengono scartate.
- **Cookie:** il tracker non crea cookie sui siti del cliente.
- **Città, indirizzo completo della pagina, parametri dell'indirizzo (tranne quelli di campagna),
  impronta digitale del browser:** mai.

**5. Dati personali sensibili.** Non devono essere inviati (Clausola 6.1, punto 3). Pyxis non è
stato progettato per trattarli.

**6. Riepilogo settimanale via e-mail.** Ogni lunedì, ciascuna persona con accesso al progetto che
non ha disattivato il riepilogo riceve numeri aggregati della settimana: visite, persone identificate
(solo il conteggio), conversioni, scritture fallite, visite per giorno, pagine ed eventi più
frequenti e le rotte con più errori. Il riepilogo non contiene identificativi di visitatori né di
utenti.

**7. Operazioni di trattamento.** Ricezione, convalida, classificazione, archiviazione,
consultazione, aggregazione, visualizzazione nel pannello, consegna tramite l'API di consultazione,
tramite il server MCP e alle app
collegate, invio del riepilogo
aggregato via e-mail, copia (esportazione), sospensione della ricezione (Clausola 5.4) ed
eliminazione.

**8. Frequenza e durata.** Continua, finché il tracker è installato e il contratto è in vigore.
Eventi conservati per 13 mesi; eliminazione alla fine del contratto secondo la Clausola 12.

**9. Dove.** Database e API a San Paolo (Brasile). Pannello in funzioni nella regione di San Paolo.
Situazioni con elemento estero nella Clausola 9.5.

**10. Accesso tramite il server MCP, tramite token e tramite app collegate.** I dati del pannello
escono da Pyxis per tre vie, tutte scelte da una persona con accesso al progetto, che le usa in nome
proprio:

1. **Token nel server MCP locale o in un altro programma:** la persona crea un token di accesso e lo
   usa nel server MCP di Pyxis (`pyxis-mcp`), che gira sul suo computer, o in un altro programma. I
   dati vanno a quel computer e allo strumento di intelligenza artificiale che ha scelto.
2. **Token all'indirizzo `https://api.pyxis-analytics.dev/mcp`:** lo stesso, con il server MCP in
   esecuzione all'interno della nostra API; i dati vanno al programma che la persona ha configurato
   con il token.
3. **App collegata (connettore di Claude):** la persona collega Claude o Claude Code, di Anthropic,
   e consente il collegamento in una pagina del pannello (Termini di utilizzo, Clausola 13.10). I
   dati che l'app richiede vanno dalla nostra API direttamente ai server di Anthropic, negli Stati
   Uniti (Claude), oppure al computer della persona e da lì ad Anthropic (Claude Code).

Per qualsiasi di queste vie, l'app legge soltanto, e solo ciò che la persona vede nel pannello: i
numeri aggregati e anche gli elenchi delle visite e la cronologia di ciascuna visita, con
l'identificativo utente inviato tramite la funzione `identify` (punto 3). Questo invio è una tua
istruzione (Clausola 5.1, punto 4) e avviene su richiesta della persona, all'interno dell'app che ha
scelto: tale app, compresa Anthropic, **non** è nostra sub-responsabile del trattamento, tratta i
dati secondo i termini che valgono tra essa e chi la usa, e spetta a te valutarne l'uso, compreso se
vi sia un trasferimento internazionale e con quale meccanismo (art. 4 del Regolamento approvato dalla
Resolução CD/ANPD nº 19/2024), e l'informativa ai visitatori (Clausola 6.1, punti 2 e 8, e
Allegato IV). Ti forniamo le informazioni di cui disponiamo per tale valutazione (art. 4, § 1, dello
stesso Regolamento; Clausola 9.6). Ciascuna persona revoca i propri collegamenti in
Impostazioni → App collegate, e il proprietario dell'account può rimuovere una persona da un progetto
(Termini di utilizzo, Clausola 13.3).

**11. Esportazione degli eventi.** Su richiesta del proprietario dell'account, una procedura genera
un file CSV compresso con tutti gli eventi che il progetto conserva, con i campi del punto 3. Il file
resta in un archivio privato e cifrato di AWS nella regione di San Paolo e viene cancellato
automaticamente 7 giorni dopo essere stato pronto. Solo il proprietario dell'account scarica il
file, dal pannello, con un nuovo link a ogni download, valido per 5 minuti. Una volta scaricato, il
file è sotto la tua responsabilità.

---

## Allegato II — Misure di sicurezza in vigore

Verificate nel codice del servizio e nella configurazione dell'infrastruttura il 14/10/2026 e il
15/10/2026.

**1. Privacy fin dalla progettazione.** Nessun cookie sui siti misurati; IP e browser completo mai
conservati; pagine ridotte a modelli; barriera sul server che scarta valori con forma di e-mail e
numeri di 10 o più cifre nelle proprietà, nei parametri di campagna e nell'identificativo utente;
regione del visitatore, mai la città; segnali "non tracciare" del browser (Global Privacy Control e Do
Not Track) rispettati dal tracker, che non invia nulla quando sono attivi; opzione di non essere
misurati (`optOut`) per il visitatore; eventi cancellati dopo 13 mesi.

**2. Crittografia in transito.** Browser → API: HTTPS con TLS 1.2 o superiore e HSTS di 2 anni.
Rete di distribuzione → funzione dell'API: solo HTTPS (TLS 1.2). Funzione → database: TLS con
verifica del certificato del server (`sslmode=verify-full`). Pannello: solo HTTPS.

**3. Crittografia a riposo.** Database di Neon con AES-256; registri (log) di AWS cifrati per
impostazione predefinita; segreti (password del database e chiavi dei servizi) in AWS Systems
Manager Parameter Store, cifrati, mai nel codice.

**4. Accesso al pannello.**

- Accesso senza password: un codice di 6 cifre inviato all'e-mail autorizzata, valido 10 minuti,
  conservato solo come hash (SHA-256), con fino a 5 tentativi per codice e fino a 5 codici all'ora
  per e-mail; richieste di codice limitate a 5 ogni 15 minuti per indirizzo di origine. Un'e-mail
  senza accesso non riceve il codice e non viene registrata.
- Sessione: valore casuale di 256 bit conservato nel database solo come hash; cookie `__Host-` con
  `HttpOnly`, `Secure` e `SameSite=Lax`; durata massima di 7 giorni e fine automatica dopo
  24 ore di inutilizzo; la persona vede le sessioni aperte, le chiude una per una o tutte insieme.
- Azioni di scrittura del pannello accettate solo dall'origine del pannello stesso.
- Solo il proprietario dell'account modifica progetti, origini, chiavi e persone, richiede
  esportazioni e chiude l'account; le persone invitate hanno solo accesso in lettura.

**5. Isolamento tra clienti.** Ogni consultazione è filtrata per progetto e per l'elenco delle
persone con accesso a esso. Richiedere un progetto altrui produce una risposta come se non
esistesse. Ci sono test automatici per questo.

**6. Chiavi e token.**

- Chiave pubblica (va sul sito): identifica solo il progetto ed è accettata solo quando la richiesta
  proviene da un'origine registrata nel progetto.
- Chiave segreta (solo sul server del cliente): mostrata una sola volta alla creazione, conservata
  solo come hash, confrontata in tempo costante, revocabile; limitata a 60 chiamate al minuto.
- Token di accesso (per agenti e programmi): **sola lettura**; conservati solo come hash; validità di
  30, 90 o 365 giorni; fino a 10 attivi per persona; revocabili in qualsiasi momento nel pannello;
  limitati a 60 consultazioni al minuto e, nel server MCP dell'API, a 120 messaggi al minuto. Non
  servono per l'accesso, per la scrittura né per l'eliminazione.
- Collegamenti di app (connettore di Claude): solo Claude e Claude Code, riconosciuti dai
  documenti di identificazione che Anthropic pubblica, con l'indirizzo di ritorno verificato rispetto
  a tali documenti; consenso esplicito in una pagina del pannello, che mostra l'app, l'indirizzo di
  ritorno e i progetti; codice monouso valido 5 minuti e legato a una prova crittografica (PKCE,
  S256); credenziale di accesso di 1 ora e credenziale di rinnovo sostituita a ogni uso, entrambe
  conservate solo come hash; una credenziale di rinnovo ripresentata dopo essere stata sostituita
  chiude il collegamento; **sola lettura**, tramite le stesse consultazioni del pannello; fino a 10
  collegamenti attivi per persona; fine dopo 90 giorni di inutilizzo; revocabili in qualsiasi
  momento nel pannello; limitati a 120 messaggi al minuto nel server MCP e a 60 consultazioni al
  minuto. Non servono per l'accesso, per la scrittura né per l'eliminazione.

**7. Protezione contro gli abusi.** Limite di invio di lotti per indirizzo di origine e per progetto;
lotto con al massimo 50 eventi e 32 KB; convalida rigorosa di ogni campo; eventi non validi scartati;
ricezione interrotta quando l'account raggiunge il 150% del limite mensile di eventi nel piano a
pagamento, o il 100% nel piano gratuito; i registri tecnici indicano quando un evento o una
proprietà è stato rifiutato e in base a quale regola, senza conservare il valore rifiutato.

**8. Infrastruttura.** La funzione dell'API rifiuta le chiamate che non passano dalla rete di
distribuzione (segreto di edge verificato in tempo costante). L'utente del database
dell'applicazione non può modificare la struttura del database; le migrazioni usano un utente
separato. Ogni funzione ha il proprio ruolo di permessi in AWS, con il minimo necessario.

**9. Registri (log).** I registri dell'API sono strutturati e contengono un identificativo della
richiesta, identificativi interni (del progetto, della persona del pannello e del collegamento), nomi
di eventi e, nei collegamenti, quale app si è collegata; **non
contengono e-mail, IP, token, chiavi né dati dei visitatori**. Restano 14 giorni e poi scompaiono.

**10. Monitoraggio.** Allarmi via e-mail per: molti tentativi di accesso con codice errato, molte
richieste di codice rifiutate, errori imprevisti dell'API, guasti e throttling della funzione
dell'API e dimensione del database.

**11. Sviluppo.** Codice pubblico con revisione automatica della sicurezza (CodeQL), scansione dei
segreti con blocco dell'invio, avvisi e aggiornamenti delle dipendenze, audit delle dipendenze e
test automatici con copertura totale a ogni modifica. La pubblicazione in produzione è effettuata
solo dal responsabile, dopo il superamento dei test.

**12. Copie di backup.** Quelle di Neon: storico di ripristino fino a 7 giorni e copie di backup
cifrate mantenute fino a 30 giorni.

**13. Risposta agli incidenti.** Secondo la Clausola 11, con registro di ogni incidente per 5 anni.

---

## Allegato III — Sub-responsabili del trattamento

Situazione al 15/10/2026.

**Sub-responsabili che trattano dati dei visitatori dei tuoi siti:**

| Fornitore | Che cosa fa in Pyxis | Dove | Contratto di trattamento | Durata delle copie e dei registri |
|---|---|---|---|---|
| **Amazon Web Services (AWS)** | API che riceve gli eventi e risponde alle consultazioni; procedure giornaliere (pulizia a 13 mesi, uso mensile, icone, fine degli account) e settimanali (riepilogo); file di esportazione degli eventi (Amazon S3); registri tecnici; custodia dei segreti; rete di distribuzione (CloudFront) davanti all'API | Regione di San Paolo (sa-east-1). La rete di distribuzione riceve le richieste in punti di presenza in tutto il mondo, senza conservarle | Contratto Cliente AWS e Addendum sul trattamento dei dati di AWS. AWS si impegna a non trasferire i dati fuori dalla regione scelta, salvo quanto necessario per prestare il servizio o rispettare la legge | Registri dell'API: 14 giorni. File di esportazione: 7 giorni |
| **Neon** (Databricks, Inc., USA) | Database (Postgres) in cui si trovano gli eventi e la configurazione dei progetti | Server nella regione di San Paolo di AWS (aws-sa-east-1); società negli USA | Termini di Neon/Databricks e Addendum sul trattamento dei dati di Databricks | Storico di ripristino: fino a 7 giorni. Copie di backup: fino a 30 giorni |
| **Vercel Inc.** (USA) | Ospita il pannello (`app.pyxis-analytics.dev`): genera le pagine che mostrano i tuoi numeri a chi ha effettuato l'accesso | Funzioni nella regione di San Paolo (gru1); società ed elaborazione principale negli USA | Addendum sul trattamento dei dati di Vercel | Registri tecnici delle richieste al pannello: 1 giorno |

**Fornitori che non ricevono dati dei visitatori** (elencati per trasparenza; il trattamento che
effettuano è descritto nell'Informativa sulla privacy di Pyxis):

| Fornitore | Che cosa fa | Dove |
|---|---|---|
| **Amazon SES** (Amazon Web Services) | Invia le e-mail del servizio: codici di accesso e di registrazione, inviti, benvenuto, avvisi di uso e di fine dell'account, avviso di esportazione pronta (con il link del pannello, non il file) e il riepilogo settimanale con numeri aggregati | Regione di San Paolo (sa-east-1) |
| **Stripe** (Stripe Brasil Soluções de Pagamento – Instituição de Pagamento Ltda. e Stripe, LLC, USA) | Fatturazione dell'abbonamento | Brasile e USA |
| **ImprovMX** (ImprovMX Incorporated, USA) | Inoltra le e-mail inviate a hello@pyxis-analytics.dev | Ricezione transitoria in Francia; società negli USA |
| **Google** (Google LLC, USA) | Casella di posta in cui restano i messaggi di assistenza (account personale, senza contratto da responsabile del trattamento: Google tratta i messaggi in qualità di titolare del trattamento, secondo la propria informativa sulla privacy) | USA e altri paesi |

**App che le persone con accesso collegano** (non sono sub-responsabili del trattamento;
Allegato I, punto 10):

| App | Chi è | Che cosa riceve | Dove |
|---|---|---|---|
| **Claude** e **Claude Code** | Anthropic, PBC (USA) | I dati che l'app richiede, quando una persona con accesso l'ha collegata e la usa | USA |

Non inviare dati dei visitatori nei messaggi di assistenza. Se hai bisogno di mostrare un caso, usa
l'identificativo della visita o dell'utente, mai il nome o l'e-mail della persona.

---

## Allegato IV — Modello di informativa per il tuo sito

Testo suggerito per l'informativa sulla privacy del tuo sito. Adattalo a ciò che il tuo sito invia
realmente. Non sostituisce la tua analisi.

> **Misurazione dell'uso del sito**
>
> Usiamo Pyxis per capire come viene usato il sito: quali pagine vengono viste, da dove provengono le
> visite e quali funzionalità vengono usate. La misurazione **non usa cookie**, **non conserva il tuo
> indirizzo IP** e **non conserva il tuo browser completo**. Registriamo la pagina vista (senza i
> parametri dell'indirizzo, tranne quelli di campagna), il sito da cui provieni, il tipo di
> dispositivo, la famiglia del browser e del sistema, il paese e la regione (mai la città) e le azioni
> che abbiamo contrassegnato sul sito. Ogni visita riceve un numero casuale che resta solo nella
> scheda del browser e viene scartato alla chiusura della scheda o dopo 30 minuti di inattività; non
> esiste un identificativo che ti riconosca in un'altra visita.
>
> *(Includi il paragrafo seguente solo se il tuo sito usa la funzione `identify`.)* Quando accedi al
> tuo account, colleghiamo gli eventi di quella visita al numero interno del tuo account, mai al tuo
> nome o alla tua e-mail. Se elimini il tuo account o lo chiedi, cancelliamo questi eventi.
>
> *(Facoltativo: includilo se il tuo team collega strumenti di intelligenza artificiale a Pyxis.)*
> Possiamo consultare questi numeri con strumenti di intelligenza artificiale da noi scelti, come
> Claude, di Anthropic, che ricevono solo ciò che chiediamo loro.
>
> I dati sono conservati in Brasile e vengono cancellati dopo 13 mesi. Pyxis tratta questi dati per
> nostro conto, in qualità di responsabile del trattamento. Se il tuo browser invia il segnale Global
> Privacy Control o "Do Not Track", non viene inviato nulla. Per esercitare i tuoi diritti previsti
> dalla LGPD, contattaci tramite il canale indicato in questa informativa.
