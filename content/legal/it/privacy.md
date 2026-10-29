# Informativa sulla privacy di Pyxis

**Versione {{terms.version}}, in vigore con decorrenza {{terms.effectiveFrom}}.**

> Questa è una traduzione di cortesia. Il testo vincolante è la versione in portoghese
> ([Português](/privacidade)); in caso di differenze tra le due, prevale il testo portoghese.

Questa informativa spiega quali dati personali Pyxis tratta **in qualità di titolare del
trattamento**, per quale scopo, con quale base giuridica, con chi li condivide, per quanto tempo li
conserva e come eserciti i tuoi diritti, ai sensi della Lei Geral de Proteção de Dados Pessoais
(Lei nº 13.709/2018, la "LGPD"; legge generale brasiliana sulla protezione dei dati personali).

Si applica a:

1. **clienti** che sottoscrivono il Pyxis ospitato, rappresentati dal **proprietario dell'account**,
   che effettua la registrazione e gestisce l'account;
2. **persone con accesso al pannello** (dashboard, `app.pyxis-analytics.dev`): il proprietario dell'account e
   le persone che invita;
3. **chi ci scrive** a hello@pyxis-analytics.dev;
4. **visitatori della pagina iniziale** `pyxis-analytics.dev`.

**Non** riguarda i visitatori dei siti dei nostri clienti. In quei siti, chi decide sulla
misurazione è il proprietario del sito (il titolare del trattamento); noi agiamo come responsabile
del trattamento, secondo le regole dell'Accordo sul trattamento dei dati personali. Se hai visitato
un sito che usa Pyxis, consulta l'informativa sulla privacy di quel sito.

---

## 1. Chi è il titolare del trattamento e come contattarci

1.1. Il titolare del trattamento è **{{seller.name}}**, persona fisica, iscritto al CPF (codice
fiscale brasiliano delle persone fisiche) con il n. **{{seller.taxId}}**, con
indirizzo in **{{seller.address}}**, che offre il servizio con il nome **Pyxis**.

1.2. Canale per qualsiasi questione di privacy, compreso l'esercizio dei tuoi diritti:
**hello@pyxis-analytics.dev**. I messaggi sono letti e riscontrati personalmente dal titolare del
trattamento.

1.3. In quanto agente di trattamento di piccole dimensioni, non nominiamo un encarregado (figura
della LGPD equivalente al responsabile della protezione dei dati); questo canale svolge la funzione
prevista dall'art. 41, § 2, I, della LGPD (Resolução CD/ANPD nº 2/2022, art. 11, e Resolução CD/ANPD
nº 18/2024, art. 3, § 3 — delibere del Consiglio direttivo dell'ANPD, Autorità nazionale brasiliana
per la protezione dei dati).

## 2. Quali dati trattiamo, per quale scopo, con quale base giuridica e per quanto tempo

### 2.1. Persone con accesso al pannello

| Dato | Per quale scopo | Base giuridica (LGPD) | Per quanto tempo |
|---|---|---|---|
| E-mail, lingua delle e-mail (quella della schermata in cui hai effettuato l'accesso o la registrazione), progetti a cui hai accesso, se sei il proprietario dell'account o un invitato, scelta sul riepilogo settimanale, data di registrazione | Inviare il codice di accesso e le e-mail del servizio, mostrare i tuoi progetti e inviare il riepilogo settimanale nella tua lingua | Esecuzione del contratto, per il proprietario dell'account (art. 7, V); legittimo interesse nostro e del cliente a dare accesso alle persone invitate dal proprietario (art. 7, IX) | Finché hai accesso a qualche progetto o sei proprietario di un account. Quando il proprietario ti rimuove da un progetto, l'accesso a quel progetto termina subito; se resti senza accesso ad alcun progetto, cancelliamo la tua registrazione entro 30 giorni. In ogni caso, la registrazione viene cancellata insieme all'account (punto 2.2) |
| Invito: la tua e-mail, il nome del progetto e l'e-mail di chi ti ha invitato, nell'e-mail di invito | Avvisarti dell'accesso e di chi te lo ha dato | Legittimo interesse nostro e del cliente (art. 7, IX) | L'invito in sé non resta nel nostro database (solo la registrazione della riga precedente); il registro dell'invio resta presso il fornitore di e-mail per il tempo da esso previsto (punto 3) |
| Codici di accesso e di registrazione: e-mail, codice conservato solo come hash, finalità (accesso o registrazione), lingua, tentativi, orari | Consentire l'accesso e la registrazione senza password e impedire tentativi ripetuti | Esecuzione del contratto, misure precontrattuali e legittimo interesse alla sicurezza (art. 7, V e IX) | Valgono 10 minuti; cancellati dalla procedura giornaliera dopo la scadenza |
| Sessioni: valore conservato solo come hash, date di inizio e di ultimo utilizzo, categoria del dispositivo e famiglia del browser e del sistema (senza versione) | Mantenerti connesso e mostrarti le tue sessioni perché tu possa chiuderle | Esecuzione del contratto e legittimo interesse alla sicurezza (art. 7, V e IX) | Al massimo 7 giorni, o 24 ore di inutilizzo; cancellate dalla procedura giornaliera dopo la chiusura |
| Token di accesso: nome che hai assegnato, valore conservato solo come hash, date di creazione, ultimo utilizzo, scadenza e revoca | Consentire a programmi e agenti di leggere i tuoi numeri | Esecuzione del contratto (art. 7, V) | Fino all'eliminazione della tua registrazione (un token scaduto o revocato smette subito di funzionare, ma il registro resta fino ad allora) |
| App collegate (connettore di Claude): l'app (Claude o Claude Code), le date in cui hai effettuato il collegamento, dell'ultimo utilizzo (registrata al massimo ogni 5 minuti e a ogni rinnovo) e della revoca; credenziali del collegamento conservate solo come hash | Consentire all'app che hai collegato di leggere i tuoi numeri e mostrarti i collegamenti perché tu possa revocarli | Esecuzione del contratto, per il proprietario dell'account (art. 7, V); legittimo interesse nostro e del cliente a offrire questa funzionalità alle persone invitate dal proprietario (art. 7, IX) | Finché il collegamento è attivo. La procedura giornaliera cancella il collegamento revocato o inattivo da 90 giorni, le credenziali scadute e quelle di rinnovo già sostituite da più di 30 giorni |
| Richieste di collegamento: l'app, l'indirizzo a cui torna la risposta, i dati tecnici che l'app invia per proteggere la richiesta, gli orari, la tua decisione (consentire o annullare), chi ha deciso e il codice monouso conservato solo come hash | Mostrare la richiesta nella pagina di consenso e consegnare la risposta solo all'app che l'ha richiesta | Esecuzione del contratto, per il proprietario dell'account, e legittimo interesse alla sicurezza e a offrire la funzionalità agli invitati (art. 7, V e IX) | La richiesta vale 10 minuti, e il codice 5. La procedura giornaliera cancella la richiesta 1 giorno dopo la scadenza; dopo, resta solo il collegamento della riga precedente |
| Registro di invio del riepilogo settimanale (progetto, persona, settimana, data di invio) | Non inviare due volte lo stesso riepilogo | Esecuzione del contratto (art. 7, V) | Fino all'eliminazione del progetto o del tuo accesso |
| Registri tecnici dell'API con il tuo identificativo interno (per esempio, "ha effettuato l'accesso", "ha chiuso la sessione", "ha creato un token", "ha collegato un'app") | Sicurezza e indagine su guasti e incidenti | Legittimo interesse alla sicurezza (art. 7, IX) | 14 giorni |

**Indirizzo IP:** quando richiedi un codice o accedi al pannello, l'IP è usato solo nella memoria
del server per limitare i tentativi (fino a 5 ogni 15 minuti) e scompare al massimo in 15 minuti.
**Non viene registrato** nel nostro database né nei nostri registri. Vercel, che ospita il pannello,
riceve l'IP e il browser di chi accede e li conserva nei propri registri tecnici per 1 giorno
(punto 3).

### 2.2. Clienti (proprietari dell'account)

| Dato | Per quale scopo | Base giuridica (LGPD) | Per quanto tempo |
|---|---|---|---|
| Account: proprietario, piano (gratuito o a pagamento), stato dell'abbonamento, periodicità, identificativi del cliente e dell'abbonamento su Stripe (solo nel piano a pagamento), date (fine della prova, del periodo, dell'accesso, degli avvisi inviati), uso mensile di eventi e avvisi di quota e di account senza eventi inviati | Prestare il servizio, applicare i limiti del piano, attivare e disattivare l'accesso in base al piano e all'abbonamento, avvisare e cancellare l'account del piano gratuito senza eventi, comunicare la fine dell'account | Esecuzione del contratto (art. 7, V) | Fino all'eliminazione dell'account: 30 giorni dopo la fine dell'accesso o, per un account del piano gratuito senza eventi, 7 giorni dopo l'avviso (Termini di utilizzo, Clausola 7.6) |
| Accettazione dei termini: versione accettata, data e ora, account e persona che ha accettato (senza IP) | Sapere quale versione vale per te e provare l'accettazione | Esecuzione del contratto ed esercizio regolare dei diritti (art. 7, V e VI) | Fino all'eliminazione dell'account. Quando ti abboni al piano a pagamento, Stripe conserva, in qualità di titolare del trattamento, il registro dell'accettazione effettuata nella sua pagina di pagamento |
| Dati di fatturazione, solo di chi si abbona al piano a pagamento, ricevuti da Stripe: nome, e-mail, indirizzo di fatturazione, CPF o CNPJ (codice fiscale brasiliano delle persone giuridiche; se indicato), circuito, ultime cifre e scadenza della carta, storico dei pagamenti, rimborsi e contestazioni | Addebitare l'abbonamento, inviare ricevute, gestire ripensamento, rimborsi e contestazioni, adempiere agli obblighi fiscali | Esecuzione del contratto (art. 7, V) e adempimento di un obbligo di legge (art. 7, II) | Per la durata del contratto e per 5 anni a partire dall'anno successivo a quello di ciascun addebito (termine di conservazione fiscale) |
| Configurazione dei progetti: nome, indirizzi dei siti, fuso orario, evento di conversione, chiave pubblica, chiave segreta conservata solo come hash, icona copiata dal sito stesso | Prestare il servizio | Esecuzione del contratto (art. 7, V) | Fino all'eliminazione del progetto da parte del proprietario o dell'account (riga "Account" sopra) |
| Richieste di esportazione: chi l'ha richiesta, quando, stato e numero di eventi | Generare e consegnare il file di esportazione al proprietario dell'account | Esecuzione del contratto (art. 7, V) | Fino all'eliminazione del progetto. Il file in sé viene cancellato 7 giorni dopo essere stato pronto |

**Nel piano gratuito, non chiediamo la carta né dati di fatturazione.** Nel piano a pagamento, **non
riceviamo né conserviamo il numero della carta**: resta presso Stripe. Conserviamo solo l'impronta
della carta di cui al punto 2.7.

### 2.3. Chi ci scrive

| Dato | Per quale scopo | Base giuridica (LGPD) | Per quanto tempo |
|---|---|---|---|
| E-mail, nome, contenuto del messaggio e allegati | Rispondere a richieste di accesso, domande, assistenza, reclami e richieste degli interessati | Misure precontrattuali ed esecuzione del contratto (art. 7, V); esercizio regolare dei diritti (art. 7, VI); legittimo interesse a rispondere a chi ci contatta (art. 7, IX) | Se c'è un contratto: fino a 5 anni dopo la sua fine (termine per chiedere il risarcimento dei danni, Código de Defesa do Consumidor — Codice brasiliano di tutela del consumatore —, art. 27). Se non c'è: 1 anno dopo l'ultimo messaggio |

### 2.4. Visitatori della pagina iniziale (`pyxis-analytics.dev`)

La pagina iniziale di Pyxis è misurata da Pyxis stesso, con le stesse regole che offriamo ai
clienti.

| Dato | Per quale scopo | Base giuridica (LGPD) | Per quanto tempo |
|---|---|---|---|
| Pagina vista (percorso, senza parametri tranne quelli di campagna), azioni sulla pagina (per esempio, aprire la demo), sito di provenienza (solo il dominio), parametri di campagna, categoria del dispositivo, famiglia del browser e del sistema, paese, regione e città approssimativa (ricavati dalla rete di AWS a partire dall'indirizzo IP, senza conservare l'IP; la città {{terms.effectiveFrom}}), numero casuale della visita | Capire come viene usata la pagina e migliorare la presentazione di Pyxis | Legittimo interesse (art. 7, IX, e art. 10) | 13 mesi |

La misurazione **non usa cookie**, **non conserva l'IP** né il browser completo, e **non invia
nulla** se il tuo browser chiede di non essere tracciato (Global Privacy Control o Do Not Track).
Nella pagina stessa, il riquadro "Cosa ha registrato questa pagina" mostra ogni evento inviato e
consente di disattivare la misurazione in questo browser. Vercel, che ospita la pagina, conserva l'IP
e il browser di chi accede nei propri registri tecnici per 1 giorno.

### 2.5. Cookie e archiviazione nel browser

| Dove | Nome | Tipo | Per quale scopo | Durata |
|---|---|---|---|---|
| Pannello (`app.`) | `__Host-pyxis_session` | Cookie necessario, `HttpOnly` e `Secure` | Mantenerti connesso | 7 giorni, o finché non esci |
| Pannello e demo (`app.` e `demo.`) | `pyxis_locale` | Cookie di preferenza | Ricordare la lingua scelta | 1 anno |
| Pannello e demo | `pyxis_theme` | Cookie di preferenza | Ricordare il tema chiaro o scuro, quando scelto | 1 anno |
| Pannello | `pyxis:pending-sign-in` | `sessionStorage` (solo nella scheda) | Ricordare l'e-mail digitata mentre attendi il codice, anche se ricarichi la pagina | 10 minuti, o fino alla chiusura della scheda |
| Pagina iniziale | `pyxis:session` | `sessionStorage` (solo nella scheda) | Numero casuale della visita | Fino alla chiusura della scheda o 30 minuti di inattività |
| Pagina iniziale | `pyxis:opt-out` | `localStorage` | Ricordare che hai disattivato la misurazione | Finché non la riattivi o non cancelli i dati del browser |
| Pagina iniziale e schermata di accesso del pannello | `pyxis:theme` | `localStorage` | Ricordare il tema scelto su questo dispositivo | Finché non lo cambi o non cancelli i dati del browser |

La pagina iniziale non crea cookie. Non usiamo cookie di terze parti, pubblicitari né di social
network, e il pannello non misura l'uso delle persone che vi accedono.

### 2.6. E-mail che inviamo

Inviamo solo e-mail legate al servizio: codici di accesso e di registrazione; invito a un progetto;
benvenuto, con la versione dei termini accettata; avvisi di uso all'80%, al 100% e dell'interruzione
al 150%, nel piano a pagamento, e all'80% e dell'interruzione al 100%, nel piano gratuito; avviso di
account del piano gratuito senza eventi; avviso di fine dell'accesso, promemoria 7 giorni prima
dell'eliminazione e avviso di eliminazione effettuata; avviso di esportazione pronta; il riepilogo
settimanale (che ciascuna persona può disattivare in Impostazioni); e comunicazioni sul contratto,
compresi gli avvisi di abuso e di sospensione. Le e-mail di fatturazione sono inviate direttamente da
Stripe: promemoria 7 giorni prima della fine della prova gratuita (nelle prove iniziate prima della
versione 1.3 dei Termini di utilizzo), ricevute di pagamenti e di rimborsi, avviso di pagamento rifiutato,
richiesta di conferma del pagamento (3D Secure) e avviso di carta in scadenza. **Le nostre e-mail
non tracciano aperture né clic.** Non inviamo pubblicità.

### 2.7. Prevenzione della prova gratuita ripetuta

**Dalla versione 1.3 dei Termini di utilizzo non c'è una prova gratuita** (Termini di utilizzo,
Clausola 8.3), e non registriamo nuove impronte di carte. Questo punto riguarda i registri delle prove
iniziate prima, che seguono il termine della tabella qui sotto e scompaiono, al massimo, 12 mesi dopo
l'inizio dell'ultima di tali prove.

La prova gratuita valeva una sola volta per cliente (Termini di utilizzo, Clausola 8.3). Per accorgerci
di quando la stessa carta avvia una seconda prova in un altro account, quando registriamo un
abbonamento con prova gratuita (in pratica, quando la prova inizia) leggiamo su Stripe l'**impronta
della carta** (*fingerprint*) dell'abbonamento: un codice che Stripe calcola a partire dal numero della
carta e che si ripete ogni volta che lo stesso numero di carta viene usato nel nostro account Stripe.
**L'impronta non è il numero della carta e non serve per pagare. Non riceviamo né conserviamo il
numero della carta.**

| Dato | Per quale scopo | Base giuridica (LGPD) | Per quanto tempo |
|---|---|---|---|
| Impronta della carta, identificativo interno dell'account e data in cui abbiamo registrato la carta nella prova (in pratica, l'inizio della prova) | Accorgerci che la stessa carta avvia una seconda prova gratuita in un altro account | Legittimo interesse a prevenire l'abuso della prova gratuita (art. 7, IX, e art. 10) | **12 mesi a partire da tale data, anche dopo l'eliminazione dell'account**; alla scadenza, la procedura giornaliera cancella il registro |

1. **Che cosa accade in caso di coincidenza.** Se la stessa impronta ha già avviato una prova in un
   altro account nei 12 mesi precedenti, il servizio registra il fatto nei registri tecnici, solo con
   gli identificativi interni degli account e mai con l'impronta (scompaiono in 14 giorni), e un
   allarme ci avvisa via e-mail.
   **Non accade nulla automaticamente**: nessun addebito e nessuna disdetta. Il titolare del
   trattamento esamina il caso, può chiedere spiegazioni al proprietario dell'account e decide
   secondo le regole della Clausola 18.11 dei Termini di utilizzo, che garantiscono avviso, motivo e
   diritto di contestare. Non si tratta, quindi, di una decisione presa unicamente con mezzi
   automatizzati (art. 20).
2. **Perché lo conserviamo dopo l'eliminazione dell'account.** Lo scopo è proprio riconoscere un
   nuovo account aperto dopo la chiusura di quello vecchio. Conserviamo solo il minimo necessario
   (senza nome, e-mail o numero della carta) e per il tempo che copre tale uso (art. 10, § 1).
3. **Limiti.** Una carta usata tramite portafoglio digitale (come Apple Pay o Google Pay) può avere
   un'impronta diversa da quella della carta fisica, e una stessa carta può essere usata
   legittimamente da persone diverse di un'azienda. Le prove con più di 12 mesi sono già state
   cancellate e non entrano nel confronto. Una coincidenza è un indizio, mai una prova di per sé.
4. **I tuoi diritti.** Puoi chiedere la conferma e l'accesso a questo registro e opporti a esso
   (punto 6), ed esaminiamo l'opposizione tenendo conto del motivo che indichi.

### 2.8. Verifica degli abusi

Quando verifichiamo un sospetto di abuso (Termini di utilizzo, Clausole 12 e 18), usiamo solo ciò che
il servizio già conserva: gli allarmi di sicurezza, i registri tecnici dell'API (che indicano quando
un evento o una proprietà è stato rifiutato e in base a quale regola, senza il valore rifiutato, e
scompaiono in 14 giorni), i dati dell'account e della fatturazione, il registro del punto 2.7, gli
eventi del progetto (consultati solo nella misura necessaria, come indicato nell'Accordo sul
trattamento dei dati) e ciò che ci viene segnalato. **Non conserviamo l'IP né il browser completo a
questo scopo, perché il servizio non li conserva.**

| Dato | Per quale scopo | Base giuridica (LGPD) | Per quanto tempo |
|---|---|---|---|
| Registro della verifica: che cosa è stato visto, gli avvisi inviati, la tua risposta, la misura adottata e il motivo | Applicare le misure della Clausola 18 dei Termini in modo equo e poterle dimostrare | Legittimo interesse (art. 7, IX) ed esercizio regolare dei diritti (art. 7, VI) | Nella casella di posta, per i termini del punto 2.3 (fino a 5 anni dopo la fine del contratto) |

Conserviamo altri dati oltre i termini di questa informativa solo se una legge, un ordine giudiziario
o una richiesta di un'autorità competente lo impone, o se sono necessari per un procedimento
giudiziario, amministrativo o arbitrale, e solo i dati interessati, per il tempo richiesto (art. 7,
VI, e art. 16, I).

## 3. Con chi condividiamo i dati

3.1. **Non vendiamo dati personali** e non li condividiamo per pubblicità.

3.2. Ci avvaliamo dei fornitori indicati di seguito, che trattano dati per nostro conto
(responsabili del trattamento) o, ove indicato, per conto proprio:

| Fornitore | Che cosa fa | Quali dati riceve | Dove |
|---|---|---|---|
| **Vercel Inc.** (USA) | Ospita il pannello e la pagina iniziale | Tutto ciò che vedi e invii nel pannello; IP e browser di chi accede (registri per 1 giorno) | Funzioni a San Paolo; elaborazione principale negli USA |
| **Amazon Web Services (AWS)** | API, procedure automatiche, registri tecnici (14 giorni), custodia dei segreti, file di esportazione (7 giorni) | Dati dei punti 2.1, 2.2 e 2.7, in transito; registri tecnici senza e-mail né IP | San Paolo (sa-east-1); rete di distribuzione mondiale davanti all'API, senza conservare le richieste |
| **Neon** (Databricks, Inc., USA) | Database | I dati dei punti 2.1, 2.2 (account, accettazione, configurazione, uso ed esportazioni), 2.4 e 2.7 | Server a San Paolo; società negli USA; copie di backup fino a 30 giorni |
| **Amazon SES** (AWS) | Invia le e-mail del servizio (punto 2.6), senza tracciamento di aperture o clic | E-mail del destinatario e contenuto dell'e-mail. Gli indirizzi che respingono l'e-mail o la segnalano come spam entrano nell'elenco di soppressione del nostro account AWS, per non ricevere più e-mail, finché non vengono rimossi | San Paolo (sa-east-1) |
| **Stripe** (Stripe Brasil Soluções de Pagamento – Instituição de Pagamento Ltda. e Stripe, LLC, USA) | Fatturazione, pagina di pagamento, portale dell'abbonamento ed e-mail di fatturazione | Dati di fatturazione e della carta (punto 2.2); Stripe calcola l'impronta della carta (punto 2.7) | Brasile e USA. Stripe tratta dati anche **in qualità di titolare del trattamento**, per la prevenzione delle frodi e l'adempimento dei propri obblighi di legge, secondo l'informativa sulla privacy di Stripe |
| **ImprovMX** (ImprovMX Incorporated, USA) | Inoltra le e-mail inviate a hello@pyxis-analytics.dev | Messaggio in transito; registro di mittente e oggetto per 7 giorni | Ricezione transitoria in Francia; società negli USA |
| **Google** (Google LLC, USA) | Casella di posta in cui restano i messaggi inviati a hello@pyxis-analytics.dev | Messaggi ricevuti e inviati | USA e altri paesi. È un account personale, senza contratto da responsabile del trattamento: Google tratta i messaggi **in qualità di titolare del trattamento**, secondo l'informativa sulla privacy di Google |

3.3. **Autorità.** Consegniamo dati alle autorità solo in presenza di un ordine giudiziario o di una
richiesta di chi ha la competenza legale per farla, e solo quanto richiesto.

3.4. **Clienti e persone con accesso.** Le persone con accesso a un progetto, compreso il
proprietario dell'account, vedono in Impostazioni l'elenco delle e-mail di chi vi ha accesso.
Sessioni, token, app collegate e la scelta sul riepilogo settimanale sono individuali: nessuno vede
quelli di un'altra persona. Le persone con accesso
possono vedere lo stato dell'account e l'uso del mese (per esempio, per capire un'interruzione per
quota); solo il proprietario dell'account apre il portale di fatturazione di Stripe.

3.5. **Successione.** Se il servizio passa a essere prestato da un'azienda costituita dal titolare
del trattamento o da chi subentra nel servizio, i dati passano a essa, con le stesse regole di
questa informativa, e avvisiamo prima.

3.6. **App che colleghi.** Se colleghi Claude o Claude Code a Pyxis (Termini di utilizzo, Clausola
13.10), o usi un token di accesso in un programma, i dati che l'app richiede escono da Pyxis verso di
essa, su tua richiesta. Tramite il connettore di Claude, vanno ad **Anthropic** (Anthropic, PBC,
USA): i numeri dei progetti che puoi aprire e, poiché l'app legge chi è collegato, **la tua e-mail
di accesso**. Anthropic **non è nostra responsabile del trattamento**: tratta questi dati secondo i
termini e l'informativa sulla privacy che valgono tra essa e te. La pagina di consenso indica, prima
di **Consenti**, che questi dati vanno ad Anthropic, negli Stati Uniti (punto 4.4). Per riconoscere
Claude e Claude Code, Pyxis legge il documento pubblico che Anthropic pubblica su ciascuno; questa
lettura non trasmette tuoi dati. Vedi e revochi i tuoi collegamenti in Impostazioni → App
collegate.

## 4. Trasferimento internazionale

4.1. I nostri database si trovano a San Paolo, ma diversi fornitori del punto 3 sono società degli
Stati Uniti e trattano o conservano lì parte dei dati: Vercel (pannello e pagina iniziale), Stripe
(fatturazione), ImprovMX (inoltro e-mail, con ricezione transitoria in Francia) e Google (casella di
posta). Le e-mail che il servizio invia partono tramite AWS a San Paolo. Neon (Databricks) conserva i dati a San Paolo, ma è una
società degli USA i cui team possono accedervi da lì. Se colleghi Claude o Claude Code
(punto 3.6), i dati che l'app richiede vanno anch'essi negli Stati Uniti, ad Anthropic, per tua
scelta.

4.2. **Modalità, finalità e durata:** i dati vanno a questi fornitori affinché prestino il servizio
descritto al punto 3, per i termini del punto 2, o per i termini dei registri di ciascun fornitore
indicati al punto 3.

4.3. **Paesi di destinazione:** Stati Uniti; Francia (solo la ricezione transitoria di ImprovMX); e
altri paesi in cui Google ha attività.

4.4. **Base:** l'invio ad Anthropic quando colleghi Claude o Claude Code (punto 3.6) si basa sul tuo
**consenso specifico e in evidenza** (art. 33, VIII): la pagina di consenso informa, prima di
**Consenti**, che i dati richiesti dall'app, compresa la tua e-mail, vanno ad Anthropic, negli Stati
Uniti, e il collegamento esiste solo se lo consenti; puoi revocare il consenso in qualsiasi momento
revocando il collegamento in Impostazioni → App collegate.
Quando il trasferimento è necessario per eseguire il contratto con te (fatturazione, accesso al
pannello e risposte ai tuoi messaggi), si basa sull'art. 33, IX, in combinato disposto con
l'art. 7, V, della LGPD. La Francia fa parte dell'Unione europea, riconosciuta dall'ANPD come avente
un livello adeguato di protezione (Resolução CD/ANPD nº 32/2026). Negli altri casi, i fornitori si
impegnano, nei loro contratti di trattamento dei dati, a proteggere i dati e a trattarli solo per
prestare il servizio; questi contratti **non includono ancora le clausole contrattuali tipo approvate
dall'ANPD** (Resolução CD/ANPD nº 19/2024). Seguiamo la loro adozione da parte dei fornitori e
cambieremo fornitore o meccanismo quando sarà necessario.

4.5. **Responsabilità e sicurezza:** ciascun fornitore risponde della sicurezza nel proprio
ambiente; noi rispondiamo nei tuoi confronti del trattamento nel suo complesso. Le misure che
adottiamo sono al punto 5.

4.6. Puoi chiedere il testo integrale delle clausole contrattuali di ciascun fornitore, a cui
rispondiamo entro 15 giorni, ed esercitare i tuoi diritti tramite il canale del punto 1, compreso
quello di presentare un reclamo contro di noi all'ANPD.

## 5. Sicurezza

5.1. Tra le misure che adottiamo:

1. connessioni cifrate (HTTPS con TLS 1.2 o superiore) lungo tutto il percorso, anche fino al
   database, con verifica del certificato;
2. dati del database cifrati a riposo dal fornitore;
3. accesso senza password, tramite codice monouso valido 10 minuti, con limite di tentativi;
4. codici, sessioni, chiavi segrete, token e credenziali delle app collegate conservati solo
   come hash;
5. sessioni con durata massima e chiusura dopo 24 ore di inutilizzo; vedi e chiudi le tue
   sessioni in Impostazioni;
6. registri tecnici senza e-mail, IP, token o chiave, conservati per 14 giorni;
7. allarmi per tentativi di accesso sospetti ed errori del servizio;
8. codice open source, con revisione automatica della sicurezza e delle dipendenze.

5.2. Nessun sistema è perfettamente sicuro. Se si verifica un incidente di sicurezza che può
comportare un rischio o un danno rilevante per te, lo comunichiamo a te e all'ANPD nei termini della
normativa (Resolução CD/ANPD nº 15/2024).

## 6. I tuoi diritti

6.1. Puoi chiedere, in qualsiasi momento (LGPD, art. 18):

1. la conferma che trattiamo tuoi dati;
2. l'accesso a essi;
3. la rettifica di dati incompleti, inesatti o non aggiornati (per esempio, cambiare l'e-mail di
   accesso);
4. l'anonimizzazione, il blocco o l'eliminazione di dati non necessari, eccessivi o trattati in
   modo non conforme alla LGPD;
5. la portabilità, nei termini della regolamentazione dell'ANPD; finché questa non esiste,
   consegniamo i tuoi dati in un file in formato aperto (JSON);
6. l'informazione su con chi condividiamo i tuoi dati (punto 3);
7. il riesame di decisioni prese unicamente con mezzi automatizzati (punto 7);
8. l'opposizione a un trattamento basato sul legittimo interesse, se ritieni che violi la
   LGPD;
9. l'eliminazione dei dati, nei casi previsti dalla legge. Alcuni dati devono comunque essere
   conservati, per obbligo di legge (per esempio, quelli di fatturazione) o per la difesa in giudizio
   (LGPD, art. 16).

6.2. **Come chiedere:** scrivi a hello@pyxis-analytics.dev, preferibilmente dall'e-mail registrata.
Se non è possibile confermare che la richiesta è tua, ti chiederemo una semplice conferma prima di
darvi seguito.

6.3. **Termine:** confermiamo la ricezione e rispondiamo **entro 15 giorni**.

6.4. **Persone con accesso a un progetto:** l'accesso al pannello esiste perché il proprietario di un
account ti ha invitato. Se chiedi l'eliminazione della tua e-mail, il tuo accesso termina; avvisiamo
il proprietario dell'account. Se sei il proprietario dell'account, l'eliminazione della tua
registrazione richiede la chiusura dell'account (Termini di utilizzo, Clausola 11.6), e i dati di
fatturazione restano conservati per il termine di legge (punto 2.2).

6.5. **Visitatori della pagina iniziale:** poiché non conserviamo IP, cookie né identificativi
persistenti, non abbiamo modo di individuare le tue visite anonime. Puoi disattivare la misurazione
nella pagina stessa o attivare il segnale Global Privacy Control nel tuo browser.

6.6. Puoi anche presentare un reclamo all'**Agência Nacional de Proteção de Dados (ANPD)**, su
`gov.br/anpd`, e agli organismi di tutela dei consumatori.

## 7. Decisioni automatizzate

Non prendiamo decisioni su di te basate unicamente su un trattamento automatizzato che incidano sui
tuoi interessi, né creiamo tuoi profili. Gli effetti automatici del servizio sono regole uguali per
tutti, che non valutano la tua persona:

1. di sicurezza: dopo troppi tentativi, una richiesta di codice o di accesso viene rifiutata per
   qualche minuto;
2. contrattuali: la ricezione degli eventi si interrompe quando l'account raggiunge il 150% del
   limite mensile nel piano a pagamento, o il 100% nel piano gratuito; l'accesso segue il piano e lo
   stato dell'abbonamento su Stripe; e l'account del piano gratuito senza eventi viene cancellato
   dopo l'avviso (Termini di utilizzo, Clausole 7.2, 7.6 e 9).

La coincidenza di impronta della carta (punto 2.7) e le misure per abuso (Termini di utilizzo,
Clausola 18) sono sempre decise da una persona. Se qualcosa di tutto ciò ti crea problemi, contattaci.

## 8. Bambini e adolescenti

Il servizio è sottoscritto da maggiorenni (18 anni o più), e la pagina iniziale non si rivolge a
bambini né ad adolescenti. Se veniamo a sapere che trattiamo dati di un bambino senza base giuridica,
li cancelliamo.

## 9. Modifiche a questa informativa

9.1. Pubblichiamo ogni nuova versione con la data di entrata in vigore. Se una modifica incide sul
modo in cui trattiamo i tuoi dati, avvisiamo i clienti e le persone con accesso via e-mail con
almeno 30 giorni di anticipo, salvo modifiche imposte dalla legge, che possono valere prima.

9.2. Le versioni precedenti sono disponibili su richiesta.

## 10. Contatti

**{{seller.name}}**, titolare del trattamento. **hello@pyxis-analytics.dev**. **{{seller.address}}**.
