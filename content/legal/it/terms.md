# Termini di utilizzo di Pyxis

**Versione {{terms.version}}, in vigore con decorrenza {{terms.effectiveFrom}}.**

> Questa è una traduzione di cortesia. Il testo vincolante è la versione in portoghese
> ([Português](/termos)); in caso di differenze tra le due, prevale il testo portoghese.

Questi termini sono il contratto tra te e noi per l'uso del **Pyxis ospitato**: il servizio di
analisi dell'utilizzo dei siti che gestiamo su `pyxis-analytics.dev`, `app.pyxis-analytics.dev` e
`api.pyxis-analytics.dev`. Leggili con attenzione, in particolare i passaggi contrassegnati con
**Attenzione**, che limitano diritti.

## Sintesi del contratto

Questa sintesi non sostituisce il testo completo, ma mostra ciò che conta di più prima di sottoscrivere.

1. **Chi offre il servizio:** {{seller.name}}, persona fisica, CPF (codice fiscale brasiliano delle
   persone fisiche) {{seller.taxId}} (Clausola 1).
2. **Prezzo:** R$ 39,00 al mese o R$ 390,00 all'anno, con carta di credito, tramite Stripe, con
   **rinnovo automatico** finché non disdici (Clausola 8).
3. **Prova gratuita:** 14 giorni, una sola volta per cliente. La carta viene richiesta all'inizio e
   Stripe invia un promemoria 7 giorni prima della fine. **Se non disdici entro la fine della prova,
   il primo addebito avviene il 15º giorno** (Clausole 6.4 e 8.3).
4. **Limiti del piano:** fino a 100.000 eventi al mese, fino a 3 siti, fino a 3 persone nel pannello
   (te compreso) e 13 mesi di storico. Ti avvisiamo quando l'account raggiunge l'80% e il 100% degli
   eventi del mese. **Attenzione: al 150%, la ricezione degli eventi si interrompe fino al giorno 1
   del mese successivo**, e gli eventi inviati durante l'interruzione vanno persi. Non viene
   addebitato nulla oltre al prezzo (Clausola 7).
5. **Ripensamento:** rimborso integrale se recedi entro 7 giorni dal primo addebito. Se chiudi
   l'account nel pannello entro questo termine, lo storno è automatico (Clausola 10).
6. **Disdetta:** in qualsiasi momento, in due modi. Nel portale di Stripe, l'accesso continua fino
   alla fine del periodo pagato. Chiudendo l'account nel pannello, **l'accesso termina subito**.
   **Attenzione: trascorsi i 7 giorni del ripensamento, non c'è rimborso proporzionale del periodo
   già pagato** in nessuno dei due casi (Clausola 11).
7. **Eliminazione dei dati:** **30 giorni dopo la fine dell'accesso, l'account, i progetti e tutti
   gli eventi vengono cancellati definitivamente.** Fino ad allora, puoi esportare gli eventi dal
   pannello (Clausola 11).
8. **Disponibilità:** **Attenzione: non c'è alcuna garanzia di disponibilità (SLA)**; facciamo del
   nostro meglio per mantenere il servizio attivo (Clausola 15). Assistenza via e-mail, con risposta
   entro 2 giorni lavorativi (Clausola 16).
9. **I tuoi obblighi principali:** **non inviare dati personali negli eventi** (nome, e-mail, CPF,
   telefono ecc.), informare i visitatori del tuo sito della misurazione e non usare il servizio in
   modo abusivo (Clausola 12).
10. **Attenzione: sospensione e chiusura per abuso.** In caso di abuso (per esempio, dati personali
    negli eventi, misurare chi ha chiesto di non essere misurato, traffico falsificato, attacco,
    frode o prova gratuita ripetuta), possiamo sospendere la parte del servizio interessata e, nei
    casi gravi o ripetuti, risolvere il contratto. Di regola avvisiamo prima e concediamo un termine
    per rimediare; indichiamo sempre il motivo e puoi contestare (Clausola 18).
11. **Dati personali:** sei il titolare del trattamento dei dati dei visitatori del tuo sito; noi
    siamo il responsabile del trattamento (Clausola 14 e Accordo sul trattamento dei dati). Se una
    persona con accesso collega Claude o Claude Code a Pyxis, i numeri che richiede vanno ad
    Anthropic, che non è nostra fornitrice (Clausola 13.10).

---

## Clausola 1 — Chi offre il servizio e come contattarci

1.1. Il Pyxis ospitato è offerto da **{{seller.name}}**, persona fisica, iscritto al CPF con il n. **{{seller.taxId}}**, con
indirizzo in **{{seller.address}}** ("noi"). **Pyxis** è il nome del servizio.

1.2. Contatto per qualsiasi questione, compresi disdetta, ripensamento, assistenza, contestazione di
una sospensione e dati personali: **hello@pyxis-analytics.dev**.

1.3. "Tu" sei la persona fisica o giuridica che sottoscrive il servizio per misurare uno o più siti.

## Clausola 2 — Termini usati in questo contratto

2.1. **Servizio:** il Pyxis ospitato da noi: l'API che riceve e restituisce i dati
(`api.pyxis-analytics.dev`), il pannello (dashboard, `app.pyxis-analytics.dev`), il riepilogo settimanale via
e-mail e l'accesso tramite token e tramite app collegate, anche attraverso il server MCP.

2.2. **Tracker:** il pacchetto `pyxis-analytics` (open source) che installi sul tuo sito per
inviare eventi al servizio.

2.3. **Progetto:** la configurazione di un tuo sito nel servizio (nome, indirizzi autorizzati, fuso
orario, evento di conversione, chiavi ed eventi).

2.4. **Evento:** ciascun record inviato dal tracker o dalla tua integrazione, come una pagina vista
o un'azione che hai contrassegnato.

2.5. **Persone con accesso:** il proprietario dell'account e le persone che invita a entrare nel
pannello.

2.6. **Periodo:** il mese o l'anno pagato del tuo abbonamento.

2.7. **Consumatore:** chi sottoscrive il servizio come destinatario finale, ai sensi dell'art. 2 del
Código de Defesa do Consumidor (Codice brasiliano di tutela del consumatore, Lei nº 8.078/1990).

2.8. **Account:** la registrazione di chi sottoscrive, a cui appartengono l'abbonamento, i progetti
e le persone con accesso.

2.9. **Proprietario dell'account:** la persona che ha effettuato la registrazione (o che hai indicato
quando abbiamo creato l'account su tua richiesta) e che, per tuo conto, gestisce progetti, chiavi,
persone, esportazioni e fatturazione.

2.10. **Fine dell'accesso:** la data in cui l'account smette di ricevere eventi e di poter modificare
i progetti: la fine del periodo pagato o della prova dopo una disdetta (Clausola 11.2), la chiusura
dell'account (Clausole 11.6 e 18.7) o la fine dell'abbonamento per mancato pagamento (Clausola 9.2).

## Clausola 3 — Accettazione, chi può sottoscrivere e documenti del contratto

3.1. Accetti questi termini in uno di questi modi:

1. **nella registrazione dal pannello** (`app.pyxis-analytics.dev/sign-up`), spuntando la casella di
   accettazione dei Termini di utilizzo, dell'Accordo sul trattamento dei dati e dell'Informativa
   sulla privacy, che mostra il numero della versione. Conserviamo la versione accettata e la data e
   l'ora dell'accettazione (senza conservare il tuo IP). La pagina di pagamento di Stripe chiede di
   nuovo l'accettazione prima dell'abbonamento;
2. **quando creiamo l'account su tua richiesta** (Clausola 6.2), rispondendo alla nostra e-mail con
   la conferma dell'accettazione della versione in essa indicata, prima che attiviamo l'accesso.

Se non sei d'accordo, non registrarti e non abbonarti.

3.2. Per sottoscrivere, devi avere almeno 18 anni e la capacità di agire. Se sottoscrivi per conto
di un'azienda, dichiari di avere i poteri per farlo, e l'azienda diventa "tu".

3.3. Il servizio è offerto a clienti in Brasile, con prezzo in reais.

3.4. Il contratto è composto da questi termini e da due allegati:

1. **Allegato 1 — Accordo sul trattamento dei dati personali**, che disciplina i dati dei visitatori
   dei tuoi siti;
2. **Allegato 2 — Informativa sulla privacy di Pyxis**, che spiega i dati che trattiamo su di te e
   sulle persone con accesso.

In materia di dati personali, l'Allegato 1 prevale su questi termini.

3.5. Dopo la sottoscrizione, l'e-mail di benvenuto riporta la versione accettata e l'indirizzo
permanente di quella versione, dove puoi salvare o stampare il testo completo. Su richiesta, ti
inviamo il testo come file. Le versioni precedenti sono disponibili su richiesta.

## Clausola 4 — Che cosa fa il servizio

4.1. Il tracker installato sul tuo sito invia al servizio le pagine viste e gli eventi che
contrassegni. Il servizio conserva questi eventi e mostra l'analisi nel pannello, solo alle persone
con accesso: panoramica, visite, cronologia di ciascuna visita, funnel, funzionalità usate, errori
delle chiamate all'API del tuo sito, acquisizione, dispositivi e orari.

4.2. Che cosa il servizio **non** fa, per progettazione:

1. non crea cookie sul tuo sito;
2. non conserva l'indirizzo IP del visitatore: l'IP è usato solo nella memoria del server, per
   qualche minuto, per limitare gli abusi;
3. non conserva il browser completo (user agent), solo la categoria del dispositivo e la famiglia del
   browser e del sistema;
4. non conserva la città, solo il paese e la regione;
5. non conserva l'indirizzo completo della pagina: solo il percorso in forma di modello, senza
   parametri, tranne quelli di campagna (`utm_source`, `utm_medium`, `utm_campaign`);
6. non invia nulla quando il browser del visitatore chiede di non essere tracciato (Global Privacy
   Control o Do Not Track);
7. non riconosce il visitatore anonimo in un'altra visita: ogni visita ha un numero casuale che
   scompare alla chiusura della scheda o dopo 30 minuti di inattività.

4.3. **Attenzione:** i numeri del pannello sono una misurazione, non un conteggio esatto. Le visite
di chi blocca il tracker, di chi chiede di non essere tracciato, dei robot e di chi era senza
connessione non compaiono, e gli eventi inviati mentre il servizio non è disponibile o con la
ricezione sospesa (Clausole 7.2, 15 e 18) vanno persi (il tracker riprova per qualche secondo
finché la pagina è aperta, ma non quando la ricezione è sospesa).

4.4. Fanno parte del piano anche:

1. il **riepilogo settimanale via e-mail**, ogni lunedì, che ciascuna persona con accesso può
   disattivare in Impostazioni;
2. i **token di accesso in sola lettura**, creati in Impostazioni, con cui programmi e agenti di
   intelligenza artificiale consultano gli stessi numeri del pannello;
3. il **server MCP**, in due modi: il programma open source `pyxis-mcp`, che gira sul tuo computer e
   usa un token di accesso; oppure l'indirizzo `https://api.pyxis-analytics.dev/mcp`, che Claude e
   Claude Code usano come connettore dopo che una persona con accesso autorizza il collegamento
   (Clausola 13.10) e che altri programmi usano con un token di accesso;
4. le rotte dell'API per **eliminare o copiare i dati di una persona identificata**, con la chiave
   segreta del progetto;
5. l'**esportazione di tutti gli eventi di un progetto** in un file, dal pannello (Clausola 11.5).

## Clausola 5 — Open source e servizio ospitato

5.1. Il codice di Pyxis è open source, sotto licenza MIT, nei repository pubblici `pyxis-api`,
`pyxis-sdk`, `pyxis-web` e `pyxis-mcp`. Chiunque può leggere, copiare, modificare ed eseguire il
codice in autonomia, nei termini di tale licenza.

5.2. Questi termini riguardano solo il **servizio ospitato da noi**. Nulla qui limita ciò che la
licenza MIT consente. Se esegui Pyxis sulla tua infrastruttura, questi termini non si applicano a
quell'installazione.

## Clausola 6 — Come si inizia: registrazione dal pannello o account creato su richiesta

6.1. **Registrazione dal pannello.**

1. Su `app.pyxis-analytics.dev/sign-up`, scegli il piano (mensile o annuale), indichi la tua
   e-mail, accetti i termini (Clausola 3.1) e confermi l'e-mail con un codice di 6 cifre inviato a
   quell'indirizzo.
2. Poi inserisci la carta nella pagina di pagamento di Stripe, che avvia la prova gratuita
   (Clausola 8.3).
3. Confermato l'abbonamento da Stripe, l'account è pronto: crei i tuoi progetti nel pannello (fino a
   3), con l'indirizzo del sito, il fuso orario e, se vuoi, l'evento di conversione, e ricevi la
   chiave pubblica e lo snippet di installazione. Chi ha effettuato la registrazione è il
   proprietario dell'account.

Se non completi la pagina di pagamento di Stripe, l'account resta incompleto, senza progetti, e
viene cancellato 7 giorni dopo la registrazione. Fino ad allora, puoi completare l'abbonamento
accedendo di nuovo al pannello.

6.2. **Account creato su richiesta.** Possiamo anche creare l'account per te, su richiesta inviata a
hello@pyxis-analytics.dev, per esempio quando non è possibile completare la registrazione dal
pannello o per un account gratuito che offriamo. In tal caso, concordiamo via e-mail il piano e il
metodo di pagamento, l'accettazione segue la Clausola 3.1, punto 2, e attiviamo l'accesso entro 2
giorni lavorativi dall'accettazione e, se è previsto un addebito, dall'abbonamento. In un account
gratuito non c'è addebito; il resto di questi termini vale allo stesso modo, e possiamo porre fine
alla gratuità con un preavviso di 30 giorni, trascorso il quale puoi abbonarti al piano o uscire.

6.3. Possiamo rifiutare una registrazione o una richiesta di account solo per un motivo oggettivo:
(a) il sito non è compatibile con l'uso accettabile (Clausola 12); (b) il volume previsto supera di
molto i limiti del piano; (c) la stessa persona o azienda ha avuto un account chiuso per abuso grave
(Clausola 18.7) nei 12 mesi precedenti; oppure (d) prova gratuita ripetuta (Clausola 6.4). Se
rifiutiamo dopo un addebito, restituiamo l'importo integrale.

6.4. **La prova gratuita vale una sola volta per cliente:** una volta per account (un account che ha
già avuto un abbonamento non ottiene una nuova prova quando si abbona di nuovo) e una volta per
persona o azienda, anche in un altro account, con un'altra e-mail o un'altra carta. Per accorgerci di
una prova ripetuta con la stessa carta, conserviamo per 12 mesi l'"impronta" della carta calcolata da
Stripe, mai il numero della carta, come spiega l'Informativa sulla privacy (punto 2.7). Che cosa
accade in caso di prova ripetuta è indicato nella Clausola 18.11.

## Clausola 7 — Piano e limiti

7.1. Il piano include:

| Voce | Limite |
|---|---|
| Eventi ricevuti al mese, sommando tutti i progetti dell'account | fino a 100.000 |
| Siti (progetti) | fino a 3 |
| Persone con accesso al pannello | fino a 3, compreso il proprietario dell'account |
| Storico | 13 mesi (gli eventi più vecchi vengono cancellati ogni giorno) |
| Riepilogo settimanale via e-mail | incluso |
| Token di accesso, server MCP e connettore di Claude | inclusi |
| Esportazione degli eventi di un progetto | dal pannello, fino a 3 per progetto al giorno |
| Assistenza | via e-mail, risposta entro 2 giorni lavorativi |

7.2. **Attenzione: uso oltre il limite.**

1. L'uso del mese è la somma degli eventi conservati in tutti i progetti dell'account con data in
   quel mese. Il mese è il mese solare calcolato in UTC (Tempo coordinato universale), che
   nell'orario di Brasília inizia alle 21:00 dell'ultimo giorno del mese precedente.
2. Il servizio misura l'uso una volta al giorno, di notte. L'uso misurato compare in Account e
   fatturazione, nel pannello.
3. Quando la misurazione giornaliera rileva l'80% e, poi, il 100% del limite (80.000 e 100.000
   eventi), avvisiamo il proprietario dell'account via e-mail, una volta per livello in ciascun
   mese. **Fino al 150%, nulla viene interrotto.**
4. **Quando la misurazione giornaliera rileva il 150% del limite (150.000 eventi), la ricezione degli
   eventi di tutti i progetti dell'account si interrompe fino al giorno 1 del mese successivo**, e
   avvisiamo via e-mail. Durante l'interruzione, il servizio rifiuta gli eventi (risposta
   `403 quota_exceeded`), che **non vengono conservati e non possono essere recuperati**. Il pannello
   continua a mostrare i dati già conservati. La ricezione riprende da sola all'inizio del mese
   successivo. Poiché la misurazione è giornaliera, l'account può superare di poco il 150% prima che
   l'interruzione inizi.
5. **Non addebitiamo nulla oltre al prezzo del piano** per l'uso oltre il limite.
6. Se l'account supera spesso il limite, possiamo proporre via e-mail un piano o un prezzo adeguati
   al volume. Accettare è facoltativo.

7.3. Il servizio ha limiti tecnici contro gli abusi, come il numero di lotti di eventi al minuto per
indirizzo e per progetto e la dimensione di ciascun lotto. Questi limiti possono cambiare per
proteggere il servizio, senza ridurre il limite mensile di eventi del tuo piano.

7.4. La cancellazione degli eventi con più di 13 mesi è automatica e fa parte del servizio: **non
conserviamo uno storico più vecchio**.

## Clausola 8 — Prezzo, prova gratuita e addebito

8.1. **Prezzo:** R$ 39,00 al mese o R$ 390,00 all'anno. Non ci sono costi di attivazione né altri
addebiti.

8.2. **Metodo di pagamento:** carta di credito, elaborata da Stripe. **Non vediamo né conserviamo il
numero della tua carta.** Al momento non accettiamo Pix (sistema brasiliano di pagamento istantaneo)
né boleto (bollettino bancario brasiliano).

8.3. **Prova gratuita:** 14 giorni, contati dalla conferma dell'abbonamento nella pagina di pagamento
di Stripe, una sola volta per cliente (Clausola 6.4). La carta è obbligatoria all'inizio, e durante
la prova non viene addebitato nulla. Stripe invia un promemoria via e-mail 7 giorni prima della fine
della prova, con il link per disdire. **Se non disdici entro la fine della prova (dal portale di
Stripe o chiudendo l'account nel pannello), il primo addebito avviene il 15º giorno** e, da quel
momento, a ogni nuovo periodo; nell'estratto conto della carta, questo primo addebito è indicato come
fine della prova. Se disdici durante la prova, non viene addebitato nulla. Un account che ha già
avuto un abbonamento non ha una nuova prova quando si abbona di
nuovo: l'addebito inizia il giorno del nuovo abbonamento.

8.4. **Rinnovo automatico:** l'abbonamento si rinnova da solo alla fine di ciascun periodo, con
addebito sulla stessa carta, finché non disdici (Clausola 11). La data del prossimo addebito compare
in Account e fatturazione, nel pannello, e Stripe invia la ricevuta di ogni addebito via e-mail.

8.5. **Modifica del prezzo:** avvisiamo via e-mail con **almeno 30 giorni di anticipo**. Il nuovo
prezzo vale solo dal rinnovo successivo alla fine di tale termine; **il periodo già pagato non cambia
prezzo**. Se non sei d'accordo, disdici prima del rinnovo, senza costi.

8.6. **Documento fiscale:** la ricevuta di ogni addebito è inviata da Stripe. L'emissione della nota
fiscal (documento fiscale brasiliano) dipende dal nostro regime fiscale; se ti serve la nota fiscal,
chiedi informazioni prima di sottoscrivere.

## Clausola 9 — Mancato pagamento

9.1. Se l'addebito di un rinnovo non va a buon fine, Stripe ti avvisa via e-mail, con un link per
aggiornare la carta, e riprova fino a 8 volte nelle 2 settimane successive; anche il pannello mostra
un avviso (Account e fatturazione → Gestisci la fatturazione). Se la banca chiede di confermare il
pagamento (3D Secure), Stripe invia il link di conferma via e-mail. Stripe avvisa anche via e-mail
quando la carta registrata è in scadenza. Durante questo periodo, il servizio continua a funzionare.

9.2. Se il pagamento non viene effettuato dopo questi tentativi (fino a 2 settimane dal primo
mancato addebito), o se la conferma richiesta dalla banca non viene data entro 15 giorni, Stripe
chiude l'abbonamento, e questa è la fine dell'accesso: entro il giorno successivo, le chiavi dei
progetti vengono revocate e i siti smettono di inviare eventi; il pannello resta disponibile solo
per consultazione ed esportazione fino all'eliminazione.

9.3. I dati vengono cancellati 30 giorni dopo la fine dell'accesso (Clausola 11.4). Fino ad allora,
puoi tornare come indicato nella Clausola 11.5, punto 3, senza perdere dati.

## Clausola 10 — Diritto di recesso (ripensamento)

10.1. Poiché la sottoscrizione avviene via internet, il consumatore può recedere dal contratto entro
7 giorni dalla sottoscrizione (Código de Defesa do Consumidor, art. 49). Durante la prova gratuita,
non viene addebitato nulla: basta disdire.

10.2. **Estendiamo questo diritto a tutti i clienti:** se recedi entro **7 giorni dal primo
addebito** (del piano mensile o di quello annuale), restituiamo **l'importo integrale** di tale
addebito, senza bisogno di spiegare il motivo.

10.3. Per esercitarlo, usa uno qualsiasi di questi mezzi:

1. **chiudi l'account nel pannello** (Account e fatturazione → Chiudi l'account), lo stesso canale
   usato per sottoscrivere. Entro il termine, lo storno dell'importo integrale viene richiesto a
   Stripe automaticamente, e la schermata mostra l'importo restituito;
2. oppure invia un'e-mail a hello@pyxis-analytics.dev, dall'e-mail del proprietario dell'account,
   con la parola "arrependimento" (ripensamento).

Disdire l'abbonamento nel portale di Stripe, da solo, non genera lo storno: usa uno dei due mezzi
sopra indicati.

10.4. Dal pannello, la conferma compare subito, sullo schermo, e anche via e-mail. Via e-mail,
confermiamo la ricezione con lo stesso mezzo e richiediamo lo storno a Stripe entro 2 giorni
lavorativi. Se lo storno automatico non va a buon fine, lo richiediamo manualmente entro 2 giorni
lavorativi e ti avvisiamo. Stripe comunica lo storno all'emittente della carta; il tempo necessario
perché compaia nell'estratto conto dipende dall'emittente.

10.5. Con il ripensamento, l'account viene chiuso come nella Clausola 11.6: l'accesso termina subito
e i dati seguono la Clausola 11.4.

## Clausola 11 — Disdetta e chiusura dell'account da parte tua

11.1. Puoi uscire in qualsiasi momento, in due modi, con effetti diversi:

1. **disdire l'abbonamento nel portale di Stripe** (Account e fatturazione → Gestisci la fatturazione,
   o dal link nelle e-mail di Stripe): ha effetto alla fine del periodo pagato o della prova
   (Clausola 11.2);
2. **chiudere l'account nel pannello** (Account e fatturazione → Chiudi l'account): ha effetto
   subito (Clausola 11.6).

Se preferisci, chiedilo via e-mail a hello@pyxis-analytics.dev, dall'e-mail del proprietario
dell'account, indicando quale dei due vuoi. In mancanza di questa indicazione, effettuiamo la
disdetta del punto 1. Confermiamo la ricezione con lo stesso mezzo.

11.2. **Disdetta nel portale di Stripe:** l'accesso continua fino alla fine del periodo pagato (o
della prova) e **non c'è un nuovo addebito**. Entro il giorno successivo alla fine dell'accesso, le
chiavi dei progetti vengono revocate e i siti smettono di inviare eventi; il pannello resta
disponibile solo per consultazione ed esportazione fino all'eliminazione.

11.3. **Attenzione: al di fuori del diritto di recesso (Clausola 10), non c'è rimborso proporzionale
del periodo già pagato,** né nel piano mensile né in quello annuale, in nessuno dei due modi di
uscire. La restituzione avviene solo nei casi espressamente previsti da questi termini: Clausole
6.3, 15.7, 18.9, 18.10, 18.13, 20.2, 21.3 e 22.1 e Clausole 9.2 e 16.2 dell'Allegato 1.

11.4. **Attenzione: eliminazione dei dati.** **30 giorni dopo la fine dell'accesso** (Clausola 2.10),
una procedura automatica cancella definitivamente l'account, i progetti e tutto ciò che appartiene
loro, come descritto nella Clausola 12 dell'Allegato 1. Avvisiamo il proprietario dell'account via
e-mail alla fine dell'accesso, 7 giorni prima dell'eliminazione e quando questa viene effettuata.
Dopo, **non è possibile recuperare i dati**. Restano conservati solo i registri di fatturazione che
la legge impone di conservare, il registro di prevenzione della prova gratuita ripetuta
(Informativa sulla privacy, punti 2.2 e 2.7) e ciò che una legge o un ordine dell'autorità impone di
preservare (Clausola 12.6 dell'Allegato 1).

11.5. **Esportare gli eventi e tornare.**

1. Il proprietario dell'account esporta tutti gli eventi di un progetto in Impostazioni del
   progetto. Il file (CSV compresso) è pronto in pochi minuti, l'avviso arriva via e-mail, e il file
   può essere scaricato dal pannello per **7 giorni**, con un nuovo link a ogni download, valido per
   5 minuti; dopo, il file viene cancellato. Sono consentite fino a 3 esportazioni per progetto al
   giorno. L'esportazione funziona durante il contratto e nei 30 giorni successivi alla fine
   dell'accesso.
2. Se l'esportazione dal pannello non funziona, chiedi la copia a hello@pyxis-analytics.dev:
   inviamo il file entro 10 giorni lavorativi dalla richiesta e, se la richiesta arriva vicino alla
   data di eliminazione, rinviamo l'eliminazione fino alla consegna della copia.
3. Prima dell'eliminazione, puoi **tornare** senza perdere dati: in Account e fatturazione, scegli
   "Abbonati di nuovo", oppure scrivi a hello@pyxis-analytics.dev e riattiviamo l'abbonamento. In
   entrambi i casi, non c'è una nuova prova gratuita e l'addebito inizia alla riattivazione. Le
   chiavi revocate non tornano: crei chiavi nuove nel pannello e le sostituisci sul tuo sito.

11.6. **Chiudere l'account dal pannello.** Solo il proprietario dell'account può chiuderlo, in
Account e fatturazione, digitando la propria e-mail per confermare. **Attenzione: la chiusura ha
effetto immediato e non può essere annullata dal pannello:**

1. l'abbonamento viene disdetto su Stripe immediatamente, senza nuovi addebiti;
2. le chiavi di tutti i progetti vengono revocate subito, e i siti smettono di inviare eventi;
3. il pannello resta disponibile solo per consultazione ed esportazione (Clausola 11.5) fino
   all'eliminazione;
4. i dati vengono cancellati 30 giorni dopo la chiusura (Clausola 11.4);
5. se la chiusura avviene entro 7 giorni dal primo addebito, l'importo di tale addebito viene
   stornato per intero (Clausola 10); in caso contrario, **non c'è restituzione proporzionale del
   periodo pagato** (Clausola 11.3);
6. la schermata conferma la chiusura, la data dell'eliminazione e l'importo stornato, e inviamo la
   conferma via e-mail.

Chiudere durante la prova gratuita non genera addebiti. Se Stripe non riesce a disdire
l'abbonamento, nulla viene chiuso e la schermata lo segnala. Se cambi idea prima dell'eliminazione,
vale la Clausola 11.5, punto 3.

## Clausola 12 — Uso accettabile, abuso e tue responsabilità

12.1. Ti impegni a usare il servizio in buona fede, solo per misurare l'uso dei tuoi siti. **È
abuso** qualsiasi delle condotte seguenti, posta in essere da te, dalle persone con accesso al tuo
account o da chi usa le tue chiavi, i tuoi token o i tuoi collegamenti con il tuo permesso:

*Dati personali e privacy*

1. inviare **dati personali diretti** negli eventi: nome, e-mail, telefono, CPF, indirizzo, numero
   di documento, testo digitato dal visitatore o qualsiasi dato che identifichi da solo una persona;
2. inviare **dati personali sensibili** (salute, origine razziale o etnica, religione, opinione
   politica, appartenenza sindacale, vita sessuale, dato genetico o biometrico);
3. tentare di **aggirare la barriera ai dati personali** del server (Clausola 12.2), per esempio
   dividendo, codificando o camuffando un'e-mail, un documento o un telefono affinché la superino;
4. usare nella funzione `identify` qualcosa di diverso da un **identificativo interno e opaco**
   dell'account nel tuo sistema, come l'e-mail, il CPF o il telefono;
5. **misurare chi ha chiesto di non essere misurato**: disattivare, aggirare o alterare il rispetto
   del tracker per i segnali Global Privacy Control e Do Not Track e per l'opzione di non essere
   misurati (`optOut`), oppure inviare eventi di queste persone per un'altra via;
6. usare il servizio insieme a tecniche di impronta digitale del browser (fingerprinting) o ad altri
   mezzi per riconoscere visitatori anonimi;

*Traffico e sicurezza*

7. inviare **eventi falsificati o automatizzati** per gonfiare, distorcere o sovraccaricare i numeri
   o il servizio (test ragionevoli della tua installazione non sono abuso);
8. inviare eventi da **siti che non sono tuoi** né di chi ti ha autorizzato, o registrare come
   origine di un progetto un sito altrui;
9. usare la **chiave pubblica, la chiave segreta, il token o il collegamento di un altro cliente**;
10. **attaccare il servizio**, tentare di accedere a dati di altri clienti o a parti del servizio che
    non sono tue, o testare vulnerabilità senza la nostra autorizzazione scritta (segnalare in buona
    fede una falla di sicurezza a hello@pyxis-analytics.dev non è abuso);
11. **aggirare i limiti** di frequenza, la quota mensile (Clausola 7.2) o i limiti del piano
    (Clausola 7.1), per esempio dividendo l'invio di uno stesso sito tra più account o chiavi;
12. **pubblicare o condividere** la chiave segreta o un token di accesso di proposito o ripetutamente
    (in un repository di codice pubblico, in una pagina, in un forum o nel codice che gira nel
    browser); una fuga accidentale non è abuso, ma la chiave o il token divulgati vengono revocati
    come indicato nella Clausola 13.9;

*Account, piano e pagamento*

13. rivendere, noleggiare o cedere a terzi l'accesso al servizio ospitato, o condividere l'account
    per superare i limiti di persone e di progetti del piano, senza un accordo scritto con noi
    (misurare, come agenzia, siti di tuoi clienti che lo hanno autorizzato, entro i limiti del piano,
    non è rivendita; Clausola 3.2 dell'Allegato 1);
14. creare più di un account, o usare un'altra persona, un'altra e-mail o un'altra carta, per
    **ripetere la prova gratuita** o per sottrarti a un limite o a un addebito;
15. **frode nel pagamento**: usare una carta senza l'autorizzazione dell'intestatario o dati di
    fatturazione falsi, oppure contestare in malafede un addebito presso l'emittente della carta, per
    esempio dichiarando di non riconoscere un addebito che hai autorizzato e il cui servizio hai
    usato, senza aver prima chiesto a noi la disdetta o il rimborso (contestare un addebito indebito
    è un tuo diritto; Clausola 18.12);

*Legge e terzi*

16. usare il servizio per attività illecite, per misurare siti con contenuti illeciti o per violare
    diritti di terzi (privacy, proprietà intellettuale, immagine);
17. qualsiasi altro uso contrario alla legge o a questi termini che causi, o crei un rischio concreto
    e dimostrabile di causare, un danno agli altri clienti, all'infrastruttura del servizio, agli
    interessati o a noi, inclusa la responsabilità legale.

12.2. Il server scarta automaticamente valori con forma di e-mail e sequenze di 10 o più cifre (come
CPF, CNPJ — codice fiscale brasiliano delle persone giuridiche — e telefono). **Attenzione:** questa barriera è un secondo livello e non riconosce nomi,
indirizzi né testi liberi. **La responsabilità per ciò che il tuo sito invia è tua.**

12.3. Ti impegni inoltre a:

1. pubblicare sul tuo sito un'informativa sulla privacy che descriva la misurazione (c'è un modello
   nell'Allegato IV dell'Accordo sul trattamento dei dati) e mantenerla coerente con ciò che il tuo
   sito invia;
2. se il tuo sito è rivolto a bambini o adolescenti, valutare prima la misurazione alla luce
   dell'art. 14 della LGPD (Lei Geral de Proteção de Dados Pessoais, legge generale brasiliana sulla
   protezione dei dati personali);
3. mantenere riservati la chiave segreta e i token di accesso (Clausola 13);
4. mantenere aggiornate le e-mail del proprietario dell'account e delle persone con accesso
   (Clausola 23);
5. rispondere ai nostri avvisi di abuso entro il termine indicato (Clausola 18).

12.4. **Come ci accorgiamo di un abuso.** Non monitoriamo in modo continuo il contenuto dei tuoi
progetti. Ci accorgiamo di un abuso da ciò che il servizio già conserva o riceve: gli allarmi
automatici di sicurezza (Allegato II dell'Accordo, punto 10); i registri tecnici dell'API, che
indicano quando un evento o una proprietà è stato rifiutato e in base a quale regola, senza il valore
rifiutato, e che scompaiono in 14 giorni; gli eventi conservati nel progetto, consultati solo quando
necessario (Clausola 7.2 dell'Accordo); i dati di fatturazione di Stripe; il registro della prova
gratuita (Informativa sulla privacy, punto 2.7); e ciò che un'altra persona o un'autorità ci
segnala. **Il servizio non conserva l'IP né il browser completo, e non inizia a conservarli per
indagare su un abuso.**

## Clausola 13 — Persone con accesso, chiavi e token

13.1. **Persone con accesso.** L'account ha fino a 3 persone con accesso al pannello, compreso il
proprietario. Il proprietario invita una persona tramite la sua e-mail, per uno o più progetti
dell'account, in Impostazioni → Persone. La persona riceve un'e-mail di invito ed entra nel pannello
con un codice inviato alla sua e-mail, senza password. Il proprietario rimuove una persona dalla
stessa schermata, in qualsiasi momento.

13.2. Le persone invitate vedono i numeri, le impostazioni e l'elenco delle persone dei progetti per
cui sono state invitate, e gestiscono le proprie sessioni, i propri token, le proprie app collegate
e il proprio riepilogo settimanale. Solo il proprietario modifica
progetti, chiavi, persone e fatturazione, e solo lui esporta eventi o chiude l'account.

13.3. Quando il proprietario rimuove una persona da un progetto, il suo accesso a quel progetto
termina subito, anche tramite i token di accesso che ha creato e le app che ha collegato. Ciò che
ha già visto o portato in un altro programma tramite un token o un'app collegata è fuori dalla
nostra portata. La sua registrazione segue l'Informativa sulla privacy (punto 2.1).

13.4. Sei responsabile di mantenere aggiornato l'elenco delle persone (per esempio, rimuovere chi ha
lasciato il tuo team) e di ciò che le persone con accesso fanno nel servizio. Quando inviti una
persona, confermi che sa che riceverà e-mail da Pyxis (invito, codici di accesso e il riepilogo
settimanale) e che conosce questi termini.

13.5. Ogni persona vede e chiude le proprie sessioni in Impostazioni, compreso "esci da tutti i
dispositivi". Uscire da tutti i dispositivi non revoca i token né scollega le app: ciascuno viene
revocato nel proprio elenco (Clausole 13.8 e 13.10).

13.6. **Chiave pubblica:** va sul tuo sito e identifica solo il progetto. Il servizio accetta eventi
con questa chiave solo se provengono dagli indirizzi registrati nel progetto. Il proprietario cambia
la chiave pubblica in Impostazioni.

13.7. **Chiave segreta:** è necessaria solo se userai le rotte di eliminazione e di copia dei dati.
Il proprietario la crea in Impostazioni, ed essa viene mostrata una sola volta. Conservala solo sul
tuo server, mai nel browser o in un repository di codice. Noi la conserviamo solo come hash: se la
perdi, revocala e creane un'altra.

13.8. **Token di accesso:** leggono solo i numeri del pannello e valgono 30, 90 o 365 giorni. Chi
crea un token è responsabile di custodirlo e può revocarlo in qualsiasi momento in Impostazioni. I
dati che un token legge vanno al programma in cui è stato usato (per esempio, uno strumento di
intelligenza artificiale con il server MCP, sul tuo computer o tramite l'indirizzo della Clausola
4.4, punto 3); **la scelta e l'uso di tale strumento sono sotto la tua responsabilità**.

13.9. Se una chiave viene divulgata, il proprietario la revoca e ne crea un'altra subito, in
Impostazioni; se non ci riesce, avvisaci: revochiamo la chiave entro 1 giorno lavorativo. Un token
divulgato può essere revocato subito, da chi lo ha creato, in Impostazioni. Se troviamo una chiave
segreta o un token pubblicati, li revochiamo subito, per proteggerti, anche in assenza di abuso, e
ti avvisiamo subito dopo (Clausola 18.4, punto 4).

13.10. **App collegate (connettore di Claude).**

1. **Quali app.** Al momento, solo **Claude** e **Claude Code**, di Anthropic, si collegano a
   Pyxis senza token, tramite l'indirizzo `https://api.pyxis-analytics.dev/mcp`. Riconosciamo
   ciascuna dal documento di identificazione che Anthropic pubblica e non accettiamo altre app per
   questa via. Altri programmi usano lo stesso indirizzo con un token di accesso (Clausola 13.8).
2. **Chi collega.** Qualsiasi persona con accesso, in nome proprio. Quando l'app richiede il
   collegamento, la persona entra nel pannello e vede, in una pagina di Pyxis, l'app, dove torna la
   risposta (con un avviso quando va a un programma sul proprio computer), che cosa potrà leggere e
   l'elenco dei progetti. Il collegamento esiste solo se la persona sceglie **Consenti**; la
   richiesta vale 10 minuti.
3. **Che cosa legge l'app.** **Legge soltanto**, e solo ciò che quella persona vede nel pannello, di
   tutti i progetti che può aprire: i numeri, gli elenchi delle visite e la cronologia di ciascuna
   visita, con l'identificativo interno che il tuo sito ha inviato tramite la funzione `identify`, e
   l'e-mail di accesso della persona stessa. Non modifica mai nulla e non legge mai chiavi segrete,
   token, sessioni, l'elenco delle persone con accesso né la fatturazione.
4. **Dove vanno i dati.** I dati che l'app richiede escono da Pyxis verso **Anthropic**, negli Stati
   Uniti: in Claude, direttamente ai suoi server; in Claude Code, prima al computer della persona e da
   lì ad Anthropic. La pagina di consenso lo segnala prima di **Consenti**. **Anthropic non è nostra
   fornitrice né nostra sub-responsabile del trattamento**: chi
   sceglie di collegarsi è la persona con accesso, e Anthropic tratta questi dati secondo i termini e
   l'informativa sulla privacy che valgono tra essa e chi usa Claude. **La scelta e l'uso di questa
   app sono sotto la tua responsabilità**, come nella Clausola 13.8.
5. **Quanto dura.** Il collegamento usa credenziali che l'app rinnova da sola (quella di accesso vale
   1 ora) e che conserviamo solo come hash. Termina quando la persona lo revoca in Impostazioni → App
   collegate; dopo 90 giorni di inutilizzo; quando la persona perde l'accesso (Clausola 13.3) o ha
   l'accesso sospeso (Clausola 18.2); quando l'account viene cancellato (Clausola 11.4); oppure da
   solo, quando una credenziale già sostituita viene usata di nuovo, segno che potrebbe essere stata
   copiata. Dopo, l'app chiede di collegarsi di nuovo.
6. **Limiti.** Fino a 10 app collegate contemporaneamente per persona, e i limiti di consultazioni
   al minuto dell'Allegato II dell'Accordo sul trattamento dei dati.

## Clausola 14 — Dati personali

14.1. Rispetto ai dati dei visitatori dei tuoi siti, **tu sei il titolare del trattamento** e **noi
siamo il responsabile del trattamento** (Lei nº 13.709/2018, la LGPD, art. 5, VI e VII).
Le regole complete sono nell'**Allegato 1 — Accordo sul trattamento dei dati personali**, che fa
parte di questo contratto: finalità, istruzioni, sicurezza, sub-responsabili, trasferimento
internazionale, richieste degli interessati, incidenti, sospensione del trattamento ed eliminazione.

14.2. Rispetto ai tuoi dati e a quelli delle persone con accesso (e-mail, account, accettazione di
questi termini, sessioni, app collegate, fatturazione, prevenzione della prova ripetuta e
assistenza), **noi siamo il titolare del trattamento**, come spiega
l'**Allegato 2 — Informativa sulla privacy di Pyxis**.

## Clausola 15 — Disponibilità, interruzioni e modifiche al servizio

15.1. **Attenzione: non c'è alcuna garanzia di disponibilità (SLA).** Facciamo del nostro meglio per
mantenere il servizio attivo e correggere i guasti il prima possibile. Il servizio è gestito da una
sola persona e dipende da fornitori (AWS, che invia anche le e-mail, Neon, Vercel e Stripe); possono
verificarsi interruzioni.

15.2. **Manutenzione.** Comunichiamo via e-mail, con anticipo ogni volta che è possibile, le
manutenzioni che possono rendere il servizio non disponibile, e le eseguiamo preferibilmente fuori
dall'orario lavorativo.

15.3. **Interruzioni che non dipendono da noi.** Il servizio può fermarsi, in tutto o in parte, per
guasto o sospensione di un fornitore, per attacco di terzi al servizio o per caso fortuito o forza
maggiore (Código Civil, Codice civile brasiliano, art. 393). Lavoriamo per ripristinare il servizio
il prima possibile e, se l'interruzione dura più di 24 ore, avvisiamo via e-mail.

15.4. **Ordine legale.** Interrompiamo o limitiamo il servizio, in tutto o in parte, quando una
legge, un ordine giudiziario o una decisione dell'ANPD (Agência Nacional de Proteção de Dados,
Autorità nazionale brasiliana per la protezione dei dati) o di un'altra autorità competente lo
richiede (per esempio, il blocco dei dati o la sospensione di un trattamento, LGPD, art. 52).
Eseguiamo solo quanto richiesto e ti avvisiamo, salvo che l'ordine vieti l'avviso.

15.5. **Interruzione per quota.** L'interruzione della ricezione degli eventi al raggiungimento del
150% del limite mensile segue la Clausola 7.2.

15.6. Se sei un consumatore, restano validi i tuoi diritti di cui all'art. 20 del Código de Defesa
do Consumidor: in caso di difetto del servizio, inclusa una sospensione che si riveli indebita
(Clausola 18.9), puoi chiedere che il servizio sia eseguito di nuovo, ove applicabile, la riduzione
proporzionale del prezzo o la restituzione dell'importo pagato.

15.7. Possiamo migliorare il servizio, cambiare schermate e aggiungere funzionalità. Durante il
periodo pagato, non rimuoviamo le funzionalità elencate nella Clausola 7.1 né peggioriamo gli impegni
di privacy della Clausola 4.2. Se una modifica di questo tipo è inevitabile (per esempio, per legge
o perché un fornitore ha smesso di offrire qualcosa), avvisiamo con 30 giorni di anticipo, e puoi
risolvere il contratto con restituzione proporzionale del periodo pagato e non usato.

## Clausola 16 — Assistenza e supporto

16.1. L'assistenza avviene via e-mail, all'indirizzo hello@pyxis-analytics.dev, per domande,
reclami, supporto, contestazione di una sospensione, sospensione e disdetta.

16.2. Confermiamo la ricezione del tuo messaggio con la stessa e-mail e rispondiamo **entro 2 giorni
lavorativi** (giorni lavorativi dal lunedì al venerdì, esclusi i giorni festivi nazionali).

16.3. L'assistenza copre l'uso del servizio ospitato e l'installazione del tracker. Non include lo
sviluppo sul tuo sito né il supporto a installazioni autonome del codice open source.

16.4. Nei messaggi, non inviare dati personali dei visitatori. Per mostrare un caso, usa
l'identificativo della visita o dell'utente.

## Clausola 17 — Proprietà intellettuale e tuoi dati

17.1. **I dati dei tuoi progetti sono tuoi.** Li trattiamo solo per prestare il servizio, come
indicato nell'Accordo sul trattamento dei dati. Non li vendiamo, non li usiamo per pubblicità e non
li usiamo per addestrare modelli di intelligenza artificiale.

17.2. Il codice di Pyxis segue la licenza MIT (Clausola 5). Il nome Pyxis, il logo e l'identità
visiva sono nostri; non puoi usarli in modo da suggerire che il tuo prodotto sia nostro o che
abbiamo una partnership, senza la nostra autorizzazione.

17.3. Se ci invii suggerimenti, possiamo usarli liberamente per migliorare Pyxis, senza obblighi nei
tuoi confronti.

## Clausola 18 — Abuso: sospensione e risoluzione da parte nostra

18.1. **Principi.** Di fronte a un abuso (Clausola 12.1), agiamo sulla base di fatti che possiamo
mostrarti, in modo proporzionato alla gravità e solo sulla parte del servizio interessata. Una misura
più forte viene usata solo quando quella più lieve non basta, e ogni misura è accompagnata dal motivo
per iscritto.

18.2. **Misure possibili**, dalla più lieve alla più forte:

1. avviso via e-mail, con un termine per rimediare;
2. sospensione parziale: revocare una chiave, un token o il collegamento di un'app; interrompere la
   ricezione degli eventi di un progetto;
   sospendere l'accesso di una persona al pannello;
3. sospensione dell'intero account: ricezione degli eventi di tutti i progetti, pannello, chiavi,
   token e app collegate;
4. risoluzione del contratto (Clausola 18.7).

18.3. **Avviso e termine per rimediare.** Al di fuori dei casi della Clausola 18.4, prima di
sospendere avvisiamo il proprietario dell'account via e-mail, indicando che cosa abbiamo visto, quale
regola è stata violata, che cosa occorre fare e quale misura adotteremo se non si rimedia, e
concediamo **5 giorni lavorativi** per rimediare o spiegare. Se rimedi entro il termine, nulla viene
sospeso.

18.4. **Attenzione: sospensione immediata.** Possiamo sospendere senza preavviso solo in questi casi,
e solo nella misura necessaria per contenere il problema:

1. attacco al servizio o ad altri clienti, o traffico falsificato o automatizzato che minacci la
   stabilità del servizio (Clausola 12.1, punti 7, 10 e 11);
2. invio di dati personali sensibili negli eventi, o di dati personali diretti in modo da esporre i
   visitatori a un rischio rilevante (Clausola 12.1, punti da 1 a 3);
3. attività o contenuto apparentemente illecito (Clausola 12.1, punto 16);
4. chiave segreta o token pubblicati, per qualsiasi motivo, anche accidentale (Clausola 13.9): la
   misura consiste solo nel revocarli, per proteggere te e gli interessati;
5. indizio oggettivo di frode nel pagamento, come una carta usata senza l'autorizzazione
   dell'intestatario o dati di fatturazione falsi (Clausola 12.1, punto 15);
6. rischio concreto e immediato per altri clienti, per gli interessati o per l'infrastruttura;
7. legge, ordine giudiziario o decisione di un'autorità competente (Clausola 15.4).

In questi casi, avvisiamo il proprietario dell'account via e-mail **entro 1 giorno lavorativo** dalla
sospensione, indicando il motivo, che cosa è stato sospeso, che cosa fare per tornare e come
contestare, salvo che una legge o un ordine vieti l'avviso.

18.5. **Durata e ripristino.** La sospensione dura solo il necessario. Quando il problema è risolto o
la contestazione è accolta, ripristiniamo per intero, entro 1 giorno lavorativo, ciò che è stato
sospeso. Chiavi, token e collegamenti revocati non tornano: crei chiavi e token nuovi nel pannello e
colleghi di nuovo l'app.

18.6. **Diritto di replica e di contestazione.** Puoi rispondere a qualsiasi avviso e contestare
qualsiasi misura via e-mail a hello@pyxis-analytics.dev, dall'e-mail del proprietario dell'account,
entro **10 giorni lavorativi** dall'avviso, inviando la tua spiegazione e le prove di cui disponi.
Confermiamo la ricezione con lo stesso mezzo e rispondiamo con una decisione motivata **entro 5
giorni**; in caso di sospensione immediata, esaminiamo la contestazione con priorità. Questo canale
non sostituisce né condiziona il tuo diritto di rivolgerti al Procon (organismo brasiliano di tutela
dei consumatori), agli altri organismi di tutela dei consumatori o all'autorità giudiziaria.

18.7. **Risoluzione per abuso.** Possiamo risolvere il contratto, via e-mail e con il motivo, solo
dopo averti dato la possibilità di rispondere (Clausola 18.6), salvo che una legge o un ordine lo
impedisca e salvo la prova gratuita ripetuta, che segue i termini propri della Clausola 18.11, e
solo quando:

1. l'abuso è **grave**: attacco deliberato al servizio o ad altri clienti; frode nel pagamento;
   attività o contenuto illecito; invio deliberato di dati personali sensibili; oppure tentativo
   deliberato di aggirare la barriera ai dati personali o il rispetto per chi ha chiesto di non
   essere misurato;
2. lo stesso abuso si **ripete** dopo essere stato corretto, entro 12 mesi dal primo avviso; oppure
3. l'abuso **non viene corretto** entro 30 giorni da una sospensione.

La risoluzione ha gli effetti della Clausola 11.6, punti da 1 a 4: l'abbonamento viene disdetto, le
chiavi vengono revocate, il pannello resta disponibile per consultazione ed esportazione per 30
giorni, salvo impedimento legale, e i dati vengono cancellati in seguito (Clausola 11.4).

18.8. **Dati durante la sospensione e dopo la risoluzione.**

1. Durante la sospensione, i dati già conservati restano conservati e protetti, la cancellazione
   degli eventi con più di 13 mesi continua, e nessun nuovo evento viene ricevuto nella parte
   sospesa.
2. Puoi continuare a esportare gli eventi (Clausola 11.5), salvo quando l'accesso stesso è il
   rischio (per esempio, un attacco compiuto tramite l'account) o una legge o un ordine lo
   impediscono; in tal caso, consegniamo la copia su richiesta non appena l'impedimento cessa, e
   l'eliminazione la attende.
3. Dopo la risoluzione, valgono le Clausole 11.4 e 11.5: 30 giorni per esportare, salvo impedimento
   legale, ed eliminazione successiva.
4. Se una legge, un ordine giudiziario o una richiesta di un'autorità competente impone di
   preservare dati, o se questi sono necessari per un procedimento giudiziario, amministrativo o
   arbitrale, preserviamo solo tali dati, senza altro uso, per il tempo richiesto, e poi li
   cancelliamo (Clausola 12.6 dell'Allegato 1).
5. Per indagare su un abuso, usiamo solo ciò che il servizio già conserva (Clausola 12.4).

18.9. **Addebito durante la sospensione.** Una sospensione parziale non modifica l'addebito. Se una
sospensione si rivela indebita, restituiamo l'importo proporzionale ai giorni in cui l'account è
rimasto sospeso, oltre ai tuoi diritti di cui alla Clausola 15.6.

18.10. **Rimborso in caso di risoluzione per abuso.**

1. Restituiamo l'importo proporzionale al periodo pagato e non usato, calcolato dall'inizio della
   sospensione dell'intero account o, se questa non c'è stata, dalla risoluzione. Se la risoluzione
   avviene nei 7 giorni della Clausola 10, restituiamo l'importo integrale del primo addebito.
2. Non restituiamo il periodo già usato fino alla sospensione dell'intero account, né importi che ti
   siano già tornati tramite storno o tramite contestazione accolta dall'emittente della carta.
3. **Attenzione: solo se non sei un consumatore**, possiamo detrarre da tale importo i danni che
   l'abuso ci ha causato in modo comprovato, mostrando per iscritto il calcolo (Código Civil, artt.
   368 e 369); ciò che manca o che avanza si risolve secondo la Clausola 19.
4. Il rimborso va, tramite Stripe, sulla carta usata per il pagamento, entro 5 giorni lavorativi
   dalla risoluzione.

18.11. **Prova gratuita ripetuta.** Quando il servizio indica che la carta usata ha già avviato una
prova gratuita in un altro account nei 12 mesi precedenti (Informativa sulla privacy, punto 2.7), o
c'è un altro indizio oggettivo di prova ripetuta da parte della stessa persona o azienda
(Clausola 6.4):

1. non accade nulla automaticamente: il servizio registra solo la coincidenza e ci avvisa; nessun
   addebito e nessuna disdetta;
2. esaminiamo il caso e, se necessario, ti chiediamo spiegazioni, con il termine della Clausola 18.3.
   Una carta aziendale usata da persone diverse, o un'agenzia che sottoscrive per clienti diversi,
   non è una prova ripetuta;
3. se confermiamo la prova ripetuta, possiamo chiudere il nuovo account prima della fine della
   prova, disdicendo l'abbonamento su Stripe senza alcun addebito, con avviso e motivo; puoi
   contestare (Clausola 18.6) e puoi abbonarti senza prova gratuita, via e-mail, con addebito a
   partire dal nuovo abbonamento;
4. **non addebitiamo mai nulla prima della data mostrata nella pagina di pagamento di Stripe**, né
   accorciamo la prova per addebitare prima.

18.12. **Contestazione dell'addebito sulla carta.** Contestare un addebito presso l'emittente della
carta è un tuo diritto; ti chiediamo di parlarne prima con noi (Clausole 10 e 16). Se la
contestazione viene accolta e l'importo ti torna, il periodo contestato resta non pagato e possiamo
trattarlo come mancato pagamento, disdicendo l'abbonamento con avviso (Clausola 9.2). Solo la
contestazione in malafede (Clausola 12.1, punto 15) è trattata come abuso.

18.13. **Risoluzione senza abuso.** Al di fuori dell'abuso, risolviamo il contratto solo nei casi
delle Clausole 6.2 (fine di una gratuità), 20 (fine del servizio ospitato), 21.3 (modifica imposta
dalla legge che non accetti) e 22.1 (cessione che non accetti), e restituiamo sempre l'importo
proporzionale al periodo pagato e non usato; i dati seguono le Clausole 11.4 e 11.5.

## Clausola 19 — Responsabilità

19.1. Rispondiamo della prestazione del servizio come descritto in questi termini, con diligenza, e
del rispetto dell'Accordo sul trattamento dei dati.

19.2. Il servizio mostra statistiche di utilizzo. Non garantiamo risultati commerciali a partire da
esse, e le decisioni che prendi sulla base dei numeri sono tue.

19.3. **Se sei un consumatore**, nulla in questi termini limita i diritti che il Código de Defesa do
Consumidor ti garantisce, incluso quello al risarcimento dei danni causati da un difetto del
servizio.

19.4. **Attenzione: limite di responsabilità per chi non è consumatore.** Se sottoscrivi il servizio
per la tua attività professionale o imprenditoriale, al di fuori di un rapporto di consumo, e, nelle
situazioni giustificabili ammesse dall'art. 51, I, del Código de Defesa do Consumidor, se sei un
consumatore persona giuridica:

1. la nostra responsabilità complessiva per danni connessi a questo contratto è limitata all'importo
   che ci hai pagato nei 12 mesi precedenti al fatto che ha causato il danno;
2. non rispondiamo per lucro cessante, perdita di opportunità commerciali o altri danni indiretti.

Questo limite tiene conto del prezzo basso del piano e delle dimensioni del servizio, gestito da una
sola persona. Esso **non si applica** ai danni causati da nostro dolo o colpa grave, né agli obblighi
che la legge non consente di limitare, né riduce i diritti degli interessati nei nostri confronti
(LGPD, art. 42).

19.5. Rispondi dei danni che causi a noi o a terzi violando questi termini, per esempio inviando
dati personali negli eventi, omettendo di informare i visitatori del tuo sito della misurazione o con
un altro abuso di cui alla Clausola 12.1.

19.6. Nessuna delle parti risponde di ritardi o inadempimenti causati da caso fortuito o forza
maggiore (Código Civil, art. 393).

## Clausola 20 — Cessazione del servizio ospitato

20.1. Se decidiamo di cessare il servizio ospitato, avvisiamo via e-mail con almeno **30 giorni di
anticipo**.

20.2. In tal caso, restituiamo l'importo proporzionale al periodo pagato e non usato, manteniamo
l'esportazione degli eventi (Clausola 11.5) fino alla fine del servizio e cancelliamo i dati secondo
la Clausola 12 dell'Allegato 1.

20.3. Poiché il codice è open source, puoi continuare a usare Pyxis sulla tua infrastruttura.

## Clausola 21 — Modifiche a questi termini

21.1. Possiamo modificare questi termini. Avvisiamo via e-mail con **almeno 30 giorni di anticipo**,
spiegando che cosa cambia, e pubblichiamo la nuova versione con la data di entrata in vigore. Le
versioni precedenti sono disponibili su richiesta.

21.2. **Le modifiche che riducono i tuoi diritti o aumentano i tuoi obblighi valgono per te solo dal
tuo prossimo rinnovo successivo a tale termine.** Se non sei d'accordo, disdici prima del rinnovo,
senza costi.

21.3. Le modifiche che si limitano a migliorare il servizio o a chiarire il testo valgono dalla data
indicata nell'avviso. Le modifiche imposte dalla legge, da una decisione giudiziaria o dall'ANPD
possono valere prima del rinnovo; se una di esse non è accettabile per te, puoi risolvere il
contratto con restituzione proporzionale del periodo pagato e non usato.

## Clausola 22 — Cessione del contratto

22.1. Possiamo trasferire questo contratto a un'azienda costituita o controllata da {{seller.name}}
(per esempio, affinché il servizio sia prestato con un CNPJ) o a chi subentra nel servizio, mantenendo tutte
le condizioni di questi termini e dell'Accordo sul trattamento dei dati. Avvisiamo via e-mail con
almeno 30 giorni di anticipo; se non sei d'accordo, puoi risolvere il contratto con restituzione
proporzionale del periodo pagato e non usato.

22.2. Non puoi trasferire questo contratto senza il nostro consenso scritto.

## Clausola 23 — Comunicazioni

23.1. Inviamo le comunicazioni relative a questo contratto, compresi gli avvisi di abuso e di
sospensione, all'e-mail del proprietario dell'account e, quando l'argomento è l'uso del pannello da
parte di una persona, la sospensione del suo accesso o un incidente di sicurezza, anche alle persone
con accesso interessate. Mantieni aggiornate queste e-mail.

23.2. Le tue comunicazioni a noi vanno a hello@pyxis-analytics.dev.

## Clausola 24 — Disposizioni generali

24.1. Se una clausola viene ritenuta invalida, le altre restano valide.

24.2. Se una delle parti omette di esigere un diritto, ciò non significa che vi abbia rinunciato.

24.3. Questo contratto non crea società, rapporto di lavoro né rappresentanza tra le parti.

24.4. Questo contratto è concluso in portoghese, per via elettronica, e vale come contratto scritto.

## Clausola 25 — Legge applicabile e foro competente

25.1. Questo contratto è regolato dalla legge brasiliana.

25.2. Prima di rivolgerti all'autorità giudiziaria, contattaci a hello@pyxis-analytics.dev: vogliamo
risolvere. È un invito, non una condizione. Se sei un consumatore, puoi rivolgerti anche al Procon e
agli altri organismi di tutela dei consumatori.

25.3. **Se sei un consumatore**, puoi agire in giudizio presso il foro del tuo domicilio (Código de
Defesa do Consumidor, art. 101, I).

25.4. Negli altri casi, è eletto il foro della comarca (circoscrizione giudiziaria) di
**Salvador/BA**, domicilio di chi presta il servizio.

---

[Allegato 1 — Accordo sul trattamento dei dati personali](/it/dpa).

[Allegato 2 — Informativa sulla privacy di Pyxis](/it/privacy).
