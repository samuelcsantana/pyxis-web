import { translation } from '../messages';

function forms<const One extends string, const Other extends string>(one: One, other: Other) {
  return { zero: other, one, many: other, other } as const;
}

export const it = translation({
  meta: {
    description:
      'Analisi di prodotto attenta alla privacy: nessun cookie per i tuoi visitatori, nessun dato personale, nessuna terza parte.',
    screenTitle: '{screen} · {project}',
    demoShareTitle: 'Demo live di {app}',
  },
  screens: {
    overview: 'Panoramica',
    funnel: 'Funnel',
    features: 'Funzionalità',
    requests: 'Richieste',
    timeline: 'Cronologia',
    visits: 'Visite',
    devices: 'Dispositivi',
    acquisition: 'Acquisizione',
    loading: 'Caricamento: {screen}…',
  },
  nav: {
    label: 'Navigazione principale',
    openMenu: 'Apri il menu',
    openMenuWithNews: 'Apri il menu, ci sono novità',
    arrivals: {
      visits: forms('{count} nuova visita', '{count} nuove visite'),
      conversions: forms('{count} nuova conversione', '{count} nuove conversioni'),
      namedEvents: forms('{count} nuovo evento', '{count} nuovi eventi'),
      failedRequests: forms('{count} nuova richiesta fallita', '{count} nuove richieste fallite'),
      manyVisits: 'Più di 99 nuove visite',
      manyConversions: 'Più di 99 nuove conversioni',
      manyNamedEvents: 'Più di 99 nuovi eventi',
      manyFailedRequests: 'Più di 99 nuove richieste fallite',
      refresh: 'Aggiorna',
      refreshing: 'Aggiornamento…',
      onTheSiteNow: '{count} sul sito ora',
      moreSinceLastRead: '{count} in più dall’ultima volta che hai guardato',
      newVisit: 'Nuova',
    },
    closeMenu: 'Chiudi il menu',
    section: 'Analisi',
    switchProject: 'Cambia progetto. Progetto attuale:',
    newProject: 'Nuovo progetto',
    signOut: 'Esci',
    signOutEverywhere: 'Esci da tutti i dispositivi',
    signingOut: 'Uscita…',
    signOutFailed: 'Impossibile uscire. Riprova.',
    projectSection: 'Progetto',
    install: 'Installazione',
    installPending: 'In attesa',
    usage: {
      share: '{share} del mese',
      events: '{count} su {limit} eventi questo mese',
      resets: 'Il conteggio si azzera il {date}',
    },
    settings: 'Impostazioni',
    account: 'Account e preferenze',
    billing: 'Account e fatturazione',
    help: 'Aiuto e assistenza',
  },
  theme: {
    switch: 'Cambia tema',
    toLight: 'Passa al tema chiaro',
    toDark: 'Passa al tema scuro',
    label: 'Tema',
    light: 'Chiaro',
    dark: 'Scuro',
    system: 'Di sistema',
  },
  periodSelector: {
    label: 'Periodo',
    presets: {
      today: 'Oggi',
      '7d': '7 giorni',
      '30d': '30 giorni',
    },
    custom: 'Personalizzato',
    apply: 'Applica',
    applying: 'Applicazione…',
    previousMonth: 'Mese precedente',
    nextMonth: 'Mese successivo',
    pickLastDay: 'Dal giorno {day}: ora scegli l’ultimo giorno.',
    chosenRange: '{range} · {days}',
    dayCount: forms('{count} giorno', '{count} giorni'),
    limit: 'Fino a {days} giorni, con fine al massimo oggi.',
  },
  signIn: {
    title: 'Accedi a Pyxis',
    intro: 'Ti mandiamo via email un codice di {digits} cifre. Nessuna password da ricordare.',
    sessionEnded: 'La sessione è terminata. Accedi di nuovo per continuare.',
    email: 'Email',
    emailPlaceholder: 'tu@azienda.it',
    demoEmail:
      'Modalità demo: non viene inviata nessuna email. Va bene qualsiasi indirizzo, poi usa il codice <code/>.',
    sendCode: 'Invia il codice',
    sending: 'Invio…',
    checkTitle: 'Controlla la tua email',
    checkBody:
      'Se questo indirizzo può accedere a Pyxis, un codice è in arrivo. Scade tra 10 minuti.',
    change: 'Cambia',
    changeEmail: 'Cambia email',
    code: 'Codice di {digits} cifre',
    codeSent: 'Codice inviato.',
    demoCode: 'Modalità demo: non viene inviata nessuna email. Usa il codice <code/>.',
    demoFill: 'Inserisci {code}',
    verify: 'Verifica e continua',
    verifying: 'Verifica…',
    resend: 'Invia un nuovo codice',
    resendIn: 'Invia un nuovo codice tra {time}',
    resent: 'Nuovo codice inviato. Vale solo l’ultimo.',
    errors: {
      invalidCode: 'Codice non valido o scaduto. Controlla l’ultima email o invia un nuovo codice.',
      rateLimited: 'Troppi tentativi da questa rete. Aspetta qualche minuto e riprova.',
      unreachable: 'Impossibile raggiungere Pyxis. Controlla la connessione e riprova.',
    },
    validation: {
      emailMissing: 'Scrivi la tua email.',
      emailMalformed: 'Scrivi un indirizzo email completo, come tu@azienda.it.',
      codeIncomplete: 'Scrivi tutte le {digits} cifre del codice.',
    },
  },
  signInPage: {
    title: 'Accedi',
    privacy:
      'Analisi di prodotto attenta alla privacy · nessun cookie per i tuoi visitatori, nessun dato personale',
    noAccount:
      'Non hai ancora un account? <plans>Guarda i piani</plans> o <demo>apri la demo</demo>, con dati inventati.',
    noCode:
      '<strong>Niente dopo qualche minuto?</strong> Controlla la cartella dello spam. Forse a questo indirizzo non è ancora associato un account Pyxis.',
    noCodeSupport:
      'Hai già un account e il codice non arriva? Scrivi a <mail>{email}</mail> da questo indirizzo.',
    seePlans: 'Guarda i piani',
    startTrial: 'Provalo gratis per 14 giorni',
    startFree: 'Inizia gratis',
    createAccount: 'Crea un account',
  },
  errorPanel: {
    title: 'Impossibile caricare questi dati',
    body: 'La dashboard non è riuscita a leggere questi dati. Riprova tra un momento.',
    retry: 'Riprova',
    detail: 'id errore {digest}',
  },
  notFound: {
    title: 'Pagina non trovata',
    outside: 'Questa pagina non esiste, oppure non hai accesso a questo progetto.',
    toProjects: 'Vai ai tuoi progetti',
    inProject: 'A questo indirizzo non c’è niente in questo progetto.',
    toOverview: 'Apri la Panoramica',
  },
  states: {
    loading: 'Caricamento…',
    emptyPeriod: {
      title: 'Niente in questo periodo',
      body: 'Nessun evento è arrivato in questo periodo.',
      bodyWithLatest:
        'Nessun evento è arrivato in questo periodo. L’ultimo è arrivato il giorno {date}.',
      widerPeriod: 'Guarda gli ultimi 30 giorni',
    },
    noActivity: {
      title: 'Ancora nessun evento in questo periodo',
      install:
        'Installa l’SDK sul tuo sito e le prime visualizzazioni di pagina compaiono qui entro un minuto.',
      guide: 'La guida completa all’installazione è nel <readme>README dell’SDK</readme>.',
    },
    noConversionEvent:
      'Per questo progetto non è impostato nessun evento di conversione, quindi le conversioni non vengono mostrate. L’operatore ne imposta uno con il comando <code>project:update</code> dell’API e la sua opzione <code>--conversion-event</code>.',
    noProjects: {
      title: 'Ancora nessun progetto',
      body: '<email/> può accedere, ma a questo indirizzo non è stato ancora assegnato nessun progetto. Chiedi all’operatore di questo Pyxis di eseguire <code>admin:grant</code> per la tua email.',
      create: 'Crea il tuo primo progetto',
      bodyOwner: 'Il tuo account è pronto. Crea un progetto per il tuo sito, poi installaci Pyxis.',
      finish: 'Completa l’abbonamento',
      bodyUnfinished:
        'Il tuo account aspetta un piano. Completa l’abbonamento per creare progetti.',
    },
  },
  demo: {
    label: 'Avviso demo',
    notice:
      'Dati dimostrativi: numeri inventati per due prodotti immaginari. Qui non compare nessun visitatore reale.',
    homePage: 'Che cos’è Pyxis?',
    projectNames: { store: 'Il mio sito', docs: 'Demo Docs' },
  },
  shell: {
    skipToContent: 'Vai al contenuto',
    privacy: 'Nessun cookie, nessun dato personale',
  },
  language: {
    label: 'Lingua',
    current: 'Lingua: {name}',
  },
  settings: {
    title: 'Impostazioni',
    subtitle:
      'Come è configurato {project} e le email che ricevi al riguardo. Le impostazioni del progetto si cambiano dalla riga di comando.',
    subtitleOwner: 'Come è configurato {project}, le sue chiavi e le email che ricevi al riguardo.',
    subtitleMember:
      'Come è configurato {project} e le email che ricevi al riguardo. Solo il proprietario del suo account può modificare il progetto.',
    project: {
      heading: 'Progetto',
      name: 'Nome',
      timezone: 'Fuso orario',
      conversionEvent: 'Evento di conversione',
      noConversionEvent: 'Nessuno, quindi le conversioni non vengono mostrate',
      created: 'Creato',
      createdOn: 'Creato: {date}',
    },
    activity: {
      heading: 'Attività',
      firstEvent: 'Evento più vecchio conservato',
      latestEvent: 'Ultimo evento',
      waiting: 'In attesa del primo evento',
      install:
        'Installa l’SDK con una chiave pubblica qui sotto; le visualizzazioni di pagina dalle origini consentite compaiono entro un minuto.',
    },
    origins: {
      heading: 'Origini consentite',
      note: 'Solo le pagine su queste origini possono inviare eventi con una chiave pubblica.',
      none: 'Nessuna origine è ancora consentita, quindi nessuna pagina può inviare eventi.',
    },
    keys: {
      heading: 'Chiavi',
      public: 'Chiavi pubbliche',
      publicNote: 'Una chiave pubblica va nelle pagine del tuo sito, quindi non è un segreto.',
      noLiveKey: 'Questo progetto non ha nessuna chiave pubblica attiva, quindi non sta misurando.',
      revokedForGood:
        'Una chiave revocata non funziona mai più. Quando l’accesso di un account termina, le sue chiavi vengono revocate e restano revocate anche se l’account torna.',
      createBelow:
        'Crea una chiave pubblica qui sotto, poi mettila al posto di quella vecchia sul tuo sito.',
      createInSettings:
        'Crea una chiave pubblica nelle <settings>Impostazioni</settings>, poi mettila al posto di quella vecchia sul tuo sito.',
      ownerOnly: 'Solo il proprietario dell’account può crearne una.',
      secret: 'Chiavi segrete',
      secretNote:
        'Una chiave segreta permette al backend del tuo sito di cancellare ed esportare i dati di una persona. Viene salvata come hash e non è mai mostrata qui.',
      noSecretKey: 'Nessuna chiave segreta attiva.',
      created: 'Creata: {date}',
    },
    deletionHeld:
      'L’eliminazione di questo progetto è sospesa: non può essere eliminato finché Pyxis non revoca la sospensione. Per informazioni, scrivi a <mail>hello@pyxis-analytics.dev</mail>.',
    retention: {
      heading: 'Conservazione dei dati',
      body: 'Gli eventi vengono conservati per {months} mesi, poi un job giornaliero li elimina.',
    },
  },
  projectForm: {
    heading: 'Progetto',
    name: 'Nome',
    origins: 'Origini consentite',
    originsNote:
      'Solo le pagine su queste origini possono inviare eventi con una chiave pubblica. Scrivi schema, host e porta, come https://negozio.example.com; al massimo {max}.',
    origin: 'Origine {number}',
    originPlaceholder: 'https://negozio.example.com',
    conversionEventPlaceholder: 'signup_completed',
    addOrigin: 'Aggiungi un’origine',
    removeOrigin: 'Rimuovi l’origine {number}',
    timezone: 'Fuso orario',
    timezoneNote: 'Giorni e ore nei report e nel riepilogo settimanale seguono questo fuso.',
    conversionEvent: 'Evento di conversione',
    conversionEventNote:
      'Facoltativo. L’evento che conta come conversione, per esempio signup_completed.',
    save: 'Salva le modifiche',
    saving: 'Salvataggio…',
    saved: 'Salvato',
    nameMissing: 'Dai un nome al progetto.',
    nameTooLong: 'Usa al massimo {max} caratteri.',
    originsMissing: 'Indica almeno un’origine.',
    originsInvalid:
      'Scrivi ogni origine come schema, host e porta, come https://negozio.example.com.',
    originsTooMany: 'Usa al massimo {max} origini.',
    timezoneInvalid: 'Scegli un fuso orario dall’elenco.',
    conversionEventInvalid:
      'Usa lettere minuscole, cifre e trattini bassi, iniziando con una lettera.',
    invalid: 'Queste impostazioni sono state rifiutate. Controlla i campi e riprova.',
    subscriptionRequired:
      'Questo account non ha un abbonamento attivo, quindi i suoi progetti non possono cambiare.',
    failed: 'Le modifiche non sono state salvate. Riprova.',
  },
  projectKeys: {
    newPublic: 'Nuova chiave pubblica',
    newSecret: 'Nuova chiave segreta',
    creating: 'Creazione…',
    publicCreated:
      'Chiave pubblica creata. Inseriscila nelle tue pagine, poi revoca quella vecchia.',
    tooMany:
      'Questo progetto ha {max} chiavi attive di questo tipo, il massimo consentito. Revocane prima una.',
    revoke: 'Revoca',
    revoking: 'Revoca…',
    revoked: 'Chiave revocata',
    onlyPublicKey: 'L’unica chiave pubblica resta, altrimenti il sito non potrebbe inviare eventi.',
    lastPublicKey:
      'L’ultima chiave pubblica resta, altrimenti il sito non potrebbe inviare eventi. Creane prima un’altra.',
    subscriptionRequired:
      'Questo account non ha un abbonamento attivo, quindi le sue chiavi non possono cambiare.',
    failed: 'Non ha funzionato. Riprova.',
    revealHeading: 'Copia ora la chiave segreta',
    revealNote:
      'È l’unica volta che viene mostrata: Pyxis ne conserva solo un hash. Tienila nelle variabili d’ambiente del tuo backend, mai in una pagina.',
    copy: 'Copia',
    copied: 'Copiato',
    selected: 'Selezionato, premi Ctrl+C',
    done: 'Fine',
  },
  deleteProject: {
    heading: 'Elimina il progetto',
    note: 'Elimina per sempre {project}, i suoi eventi e le sue chiavi, e il suo sito smette subito di inviare eventi. Non si può annullare.',
    confirm: 'Scrivi {project} per confermare',
    delete: 'Elimina il progetto per sempre',
    deleting: 'Eliminazione…',
    nameMismatch: 'Il nome scritto non è quello di questo progetto.',
    failed: 'Il progetto non è stato eliminato. Riprova.',
    deletionOnHold:
      'In questo account non si può eliminare nulla finché Pyxis ne tiene sospesa l’eliminazione. Scrivi a hello@pyxis-analytics.dev.',
  },
  people: {
    heading: 'Persone',
    noteOwner:
      'Chi può aprire questo progetto. Ogni persona accede con un codice inviato alla sua email. L’account ha posto per {max} persone, contando anche te.',
    note: 'Chi può aprire questo progetto.',
    owner: 'Proprietario',
    member: 'Membro',
    you: '{email} (tu)',
    added: 'Aggiunta: {date}',
    email: 'Indirizzo email',
    emailPlaceholder: 'giulia@example.com',
    add: 'Aggiungi',
    adding: 'Aggiunta…',
    invited:
      '{email} ora ha accesso al progetto e ha ricevuto un’email con le istruzioni per accedere.',
    alreadyThere: '{email} ha già accesso a questo progetto.',
    emailMissing: 'Scrivi l’indirizzo email della persona da aggiungere.',
    emailInvalid: 'Scrivi un indirizzo email, come giulia@example.com.',
    limitReached:
      'L’account ha già le sue {max} persone, contando anche te. Rimuovi qualcuno per aggiungerne un’altra.',
    subscriptionRequired:
      'Questo account non ha un abbonamento attivo, quindi non si può aggiungere nessuno.',
    failed: 'Nessuno è stato aggiunto. Riprova.',
    remove: 'Rimuovi',
    removing: 'Rimozione…',
    removed: 'Persona rimossa',
    ownerStays: 'Il proprietario mantiene l’accesso a tutti i progetti dell’account.',
    removeFailed: 'Quella persona non è stata rimossa. Riprova.',
  },
  account: {
    title: 'Account e fatturazione',
    back: 'Torna alla dashboard',
    noAccount:
      'Non possiedi un account Pyxis. La fatturazione dei progetti che apri spetta al loro proprietario.',
    plan: 'Piano',
    planWithInterval: 'Piano: {interval}',
    monthly: 'Mensile',
    yearly: 'Annuale',
    status: {
      trialing:
        'Prova gratuita fino al giorno {date}. Poi il piano viene addebitato, a meno che tu non annulli.',
      active: 'Attivo. Si rinnova il giorno {date}.',
      past_due:
        'L’ultimo addebito non è riuscito. Stripe riprova nei prossimi giorni; aggiorna la carta per continuare a misurare.',
      ending: 'Annullato. L’accesso continua fino al giorno {date}, senza altri addebiti.',
      ended:
        'Terminato il giorno {date}. I progetti hanno smesso di misurare e tutto viene eliminato il giorno {deletion}.',
      incomplete:
        'L’abbonamento non è stato completato. Scegli un piano per iniziare la prova gratuita.',
      incompleteFree:
        'L’abbonamento non è stato completato. Scegli un piano per abbonarti; l’addebito parte da oggi.',
      comped: 'Un account offerto da Pyxis.',
      free: 'Piano gratuito: fino a {events} eventi al mese.',
      trialingUndated: 'Prova gratuita. Poi il piano viene addebitato, a meno che tu non annulli.',
      activeUndated: 'Attivo.',
      endingUndated:
        'Annullato. L’accesso continua fino alla fine del periodo, senza altri addebiti.',
      endedUndated:
        'Terminato. I progetti hanno smesso di misurare e tutto viene eliminato trenta giorni dopo la fine.',
      endedHeld: 'Terminato il giorno {date}. I progetti hanno smesso di misurare.',
      endedHeldUndated: 'Terminato. I progetti hanno smesso di misurare.',
    },
    usage: 'Eventi di questo mese',
    usageCount: '{count} su {limit}',
    measured: 'Misurato il giorno {date}.',
    notMeasured: 'Non ancora misurato questo mese.',
    paused:
      'La misurazione è in pausa fino al giorno {date}: l’account ha raggiunto {events} eventi questo mese.',
    limits: 'Fino a {projects} e {people}, contando anche te.',
    suspended:
      'Sospeso il giorno {date}. I suoi progetti hanno smesso di misurare e le loro schermate restano chiuse finché la sospensione non viene revocata.',
    suspensionReason: 'Motivo: {reason}',
    contest: 'Per contestarla, scrivi a <mail>hello@pyxis-analytics.dev</mail>.',
    deletionHeld:
      'L’eliminazione è sospesa: nulla di questo account viene eliminato finché Pyxis non revoca la sospensione.',
    resubscribe:
      'Abbonati di nuovo prima del giorno {date} per conservare i dati: non c’è una nuova prova gratuita, il piano viene addebitato da oggi e le vecchie chiavi restano revocate, quindi ogni progetto ha bisogno di una nuova chiave pubblica.',
    resubscribeUndated:
      'Abbonati di nuovo per conservare i dati: non c’è una nuova prova gratuita, il piano viene addebitato da oggi e le vecchie chiavi restano revocate, quindi ogni progetto ha bisogno di una nuova chiave pubblica.',
    resubscribeFree:
      'Abbonati di nuovo prima del giorno {date} per conservare i dati: il piano viene addebitato da oggi e le vecchie chiavi restano revocate, quindi ogni progetto ha bisogno di una nuova chiave pubblica.',
    resubscribeFreeUndated:
      'Abbonati di nuovo per conservare i dati: il piano viene addebitato da oggi e le vecchie chiavi restano revocate, quindi ogni progetto ha bisogno di una nuova chiave pubblica.',
    exempt:
      'Fino al giorno {date} la misurazione non va in pausa anche se si supera il limite mensile.',
    freePause:
      'Con il piano gratuito, la misurazione va in pausa quando il mese raggiunge {events} eventi e riprende il giorno 1.',
    paidPlan: {
      heading: 'Il piano a pagamento',
      offer:
        'Fino a 100.000 eventi al mese, 3 progetti e 3 persone, a R$ 39 al mese o R$ 390 all’anno. L’addebito avviene oggi e si rinnova finché non annulli.',
      resumes: 'La misurazione riprende entro un minuto dall’abbonamento.',
    },
    fit: {
      dueBy:
        'Questo account contiene più di quanto consente il piano gratuito. Adattalo entro il giorno {date}, altrimenti l’account termina quel giorno:',
      projects: 'Elimina {count}: il piano gratuito consente {limit}.',
      people: 'Rimuovi {count}: il piano gratuito consente {limit}, contando anche te.',
      where:
        'I progetti si eliminano, e le persone si rimuovono, nelle Impostazioni di ciascun progetto.',
    },
    afterCancel: {
      backToFree:
        'Se annulli, l’account torna al piano gratuito alla fine del periodo, con i suoi progetti e i suoi dati: fino a {events} eventi al mese, e oltre la misurazione va in pausa fino al giorno 1.',
      backToFreeOn:
        'Il giorno {date} l’account torna al piano gratuito, con i suoi progetti e i suoi dati: fino a {events} eventi al mese, e oltre la misurazione va in pausa fino al giorno 1.',
      backToFreeAtTheEnd:
        'Alla fine del periodo l’account torna al piano gratuito, con i suoi progetti e i suoi dati: fino a {events} eventi al mese, e oltre la misurazione va in pausa fino al giorno 1.',
      ends: 'Se annulli, l’account termina alla fine del periodo. Per tenerlo sul piano gratuito, adattalo prima:',
      endsOn: 'Il giorno {date} l’account termina. Per tenerlo sul piano gratuito, adattalo prima:',
      endsAtTheEnd:
        'Alla fine del periodo l’account termina. Per tenerlo sul piano gratuito, adattalo prima:',
    },
    notice: {
      suspended: 'Questo account è sospeso, quindi i suoi progetti hanno smesso di misurare.',
      why: 'Scopri perché',
      paymentFailed:
        'L’ultimo addebito non è riuscito. Aggiorna la carta per continuare a misurare.',
      ending: 'Il tuo abbonamento termina il giorno {date}.',
      ended: 'Il tuo abbonamento è terminato. Tutto viene eliminato il giorno {date}.',
      endedHeld: 'Il tuo abbonamento è terminato. L’eliminazione dei suoi dati è sospesa.',
      paused:
        'La misurazione è in pausa fino al giorno {date}: l’account ha superato i suoi eventi mensili.',
      freePlanPaused:
        'La misurazione è in pausa: l’account ha raggiunto questo mese i {events} eventi del piano gratuito. Riprende il giorno {date}, o entro un minuto dall’abbonamento.',
      subscribe: 'Abbonati ora',
      nearQuota: 'Eventi usati dall’account questo mese: {share}.',
      open: 'Apri la fatturazione',
    },
  },
  support: {
    title: 'Aiuto e assistenza',
    subtitle: 'Parla con chi gestisce Pyxis o trova la risposta nella documentazione.',
    copy: 'Copia',
    copied: 'Copiato',
    selected: 'Selezionato, premi Ctrl+C',
    writeHeading: 'Scrivere all’assistenza',
    fromAccount: 'Scrivi da {email}, così sappiamo di quale account si tratta.',
    paidReply:
      'Nel piano a pagamento confermiamo la ricezione del tuo messaggio e rispondiamo entro {days} giorni lavorativi.',
    freeReply:
      'Nel piano gratuito rispondiamo via email entro {days} giorni su contratto, piano e limiti, fatturazione, disdetta e dati personali. Le domande su installazione e uso passano da GitHub.',
    noPersonalData:
      'Per mostrare un caso, invia l’ID della visita, mai i dati personali dei tuoi visitatori.',
    docsHeading: 'Installazione e uso',
    install: 'Come installare',
    installBody: 'Lo snippet con la tua chiave, passo dopo passo.',
    code: 'Documentazione del codice di Pyxis',
    codeBody: 'track, identify, trackRequest e tutte le opzioni.',
    agents: 'Guida per gli agenti IA',
    agentsBody:
      'Quello che Claude Code, Cursor o un altro agente leggono prima di installare Pyxis.',
    question: 'Chiedere su GitHub',
    questionBody: 'Le domande sono pubbliche: non incollare mai chiavi o dati personali.',
    securityHeading: 'Hai trovato una falla di sicurezza?',
    securityBody: 'Segnalala in privato su GitHub, mai in una issue pubblica.',
    securityLink: 'Segnala in privato',
    accountHeading: 'Assistenza',
  },
  accountSuspended: {
    title: 'Questo account è sospeso',
    explanation:
      'L’account a cui appartiene questo progetto è sospeso, quindi le sue schermate restano chiuse e i suoi siti non vengono più misurati finché la sospensione non viene revocata.',
    owner:
      'Il proprietario dell’account trova il motivo, e come contestarlo, in Account e fatturazione.',
    open: 'Apri Account e fatturazione',
  },
  projectIngestion: {
    label: 'Stato del progetto',
    suspended:
      'Pyxis ha sospeso la ricezione degli eventi di questo progetto il giorno {date}, quindi non sta misurando. Le sue schermate restano aperte.',
    reason: 'Motivo: {reason}',
    contest:
      'Per contestarla, il proprietario dell’account scrive a <mail>hello@pyxis-analytics.dev</mail>.',
  },
  billing: {
    subscribeAgain: 'Abbonati di nuovo',
    resubscribeUnavailable:
      'Riabbonarsi dalla dashboard non è ancora possibile. Scrivi a hello@pyxis-analytics.dev e riattiviamo l’abbonamento.',
    manage: 'Gestisci la fatturazione',
    finish: 'Completa l’abbonamento',
    subscribe: 'Abbonati ora',
    opening: 'Apertura di Stripe…',
    interval: 'Fatturazione',
    monthly: 'Mensile',
    yearly: 'Annuale',
    noBillingYet: 'Non c’è ancora nessuna fatturazione da gestire.',
    subscriptionExists: 'Questo account ha già un abbonamento. Ricarica la pagina.',
    unavailable: 'La fatturazione non è disponibile in questo momento. Riprova più tardi.',
    failed: 'Impossibile aprire Stripe. Riprova.',
  },
  exportEvents: {
    heading: 'Esporta eventi',
    note: 'Tutti gli eventi che questo progetto conserva, in un file CSV compresso. Richiede qualche minuto: ricevi un’email con il link e il file resta disponibile per {days} giorni. Fino a {max} esportazioni al giorno.',
    request: 'Esporta eventi',
    requesting: 'Richiesta…',
    requested: 'Il file è in preparazione. Riceverai un’email quando sarà pronto.',
    alreadyWaiting: 'Un’esportazione di questo progetto è già in preparazione.',
    open: 'Apri l’esportazione',
    limitReached:
      'Oggi hai già richiesto {max} esportazioni di questo progetto, il massimo giornaliero. Riprova domani.',
    unavailable: 'Le esportazioni non sono disponibili in questo momento. Riprova più tardi.',
    failed: 'L’esportazione non è stata richiesta. Riprova.',
  },
  exportPage: {
    title: 'Esportazione',
    subtitle: 'Gli eventi di {project}, in un file CSV compresso.',
    pending: 'Preparazione del file…',
    pendingNote:
      'Questa pagina ricontrolla ogni pochi secondi, e ricevi anche un’email quando il file è pronto.',
    done: '{count} eventi, disponibili fino al giorno {date}.',
    download: 'Scarica il file',
    downloadNote: 'Ogni download richiede un nuovo link, valido per cinque minuti.',
    expired:
      'Il file è stato eliminato il giorno {date}, una settimana dopo che era stato preparato. Richiedine un altro nelle Impostazioni.',
    gone: 'Il file non è più disponibile. Richiedine un altro nelle Impostazioni.',
    failed: 'L’esportazione non è riuscita. Richiedine un’altra nelle Impostazioni.',
    settings: 'Apri le Impostazioni',
    requestedAt: 'Richiesta il giorno {date}',
  },
  closeAccount: {
    heading: 'Chiudi l’account',
    note: 'Annulla subito l’abbonamento e revoca le chiavi di tutti i progetti, così i siti smettono di inviare eventi. Tutto viene eliminato trenta giorni dopo; prima esporta quello che ti serve.',
    refundNote:
      'Un primo pagamento fatto negli ultimi sette giorni viene rimborsato per intero. Altrimenti non viene rimborsato nulla.',
    freeNote:
      'Revoca le chiavi di tutti i progetti, così i siti smettono di inviare eventi. Tutto viene eliminato trenta giorni dopo; prima esporta quello che ti serve.',
    confirm: 'Scrivi il tuo indirizzo email per confermare',
    close: 'Chiudi l’account per sempre',
    closing: 'Chiusura…',
    closed: 'L’account è chiuso. Tutto viene eliminato il giorno {date}.',
    refunded: '{amount} sono stati rimborsati sulla tua carta.',
    confirmationMismatch: 'Questo non è il tuo indirizzo email, quindi non è stato chiuso nulla.',
    alreadyEnded: 'Questo account è già terminato.',
    unavailable:
      'Stripe non è riuscito ad annullare l’abbonamento, quindi non è stato chiuso nulla. Riprova più tardi.',
    failed: 'L’account non è stato chiuso. Riprova.',
  },
  withdrawal: {
    heading: 'Recesso',
    note: 'Entro 7 giorni dal primo pagamento puoi recedere: l’abbonamento viene annullato subito, quel pagamento viene rimborsato per intero e l’account torna al piano gratuito, con i suoi progetti e i suoi dati.',
    start: 'Recedi dall’abbonamento',
    question:
      'Recedere ora? L’abbonamento termina subito e il primo pagamento torna sulla tua carta.',
    confirm: 'Recedi e ricevi il rimborso',
    keep: 'Mantieni l’abbonamento',
    withdrawing: 'Recesso in corso…',
    done: 'Hai receduto dall’abbonamento. L’account è tornato al piano gratuito.',
    refunded: '{amount} sono stati rimborsati sulla tua carta.',
    refundByHand:
      'Il rimborso automatico non è andato a buon fine, quindi Pyxis rimborsa il primo pagamento a mano.',
    fitBy:
      'L’account contiene più di quanto consente il piano gratuito: adattalo entro il giorno {date}, altrimenti termina quel giorno.',
    freePlanClosed:
      'Il piano gratuito è chiuso in questo momento, quindi non c’è un piano a cui tornare. Per fermare il rinnovo, annulla in Gestisci la fatturazione.',
    noPaidSubscription:
      'Questo account non ha un abbonamento a pagamento da cui recedere. Ricarica la pagina.',
    windowClosed:
      'I 7 giorni per recedere sono passati. Per fermare il rinnovo, annulla in Gestisci la fatturazione: il piano continua fino alla fine del periodo.',
    unavailable:
      'Stripe non è riuscito ad annullare l’abbonamento, quindi non è cambiato nulla. Riprova più tardi.',
    failed: 'Il recesso non è andato a buon fine. Riprova.',
  },
  newProject: {
    title: 'Nuovo progetto',
    intro:
      'Un progetto misura un sito. Il suo indirizzo diventa l’unica origine autorizzata a inviare eventi; puoi aggiungerne altre in seguito nelle Impostazioni.',
    name: 'Nome del progetto',
    namePlaceholder: 'Il mio negozio',
    site: 'Indirizzo del sito',
    sitePlaceholder: 'https://negozio.example.com',
    timezone: 'Fuso orario',
    conversionEvent: 'Evento di conversione (facoltativo)',
    conversionEventPlaceholder: 'signup_completed',
    create: 'Crea il progetto',
    creating: 'Creazione…',
    nameMissing: 'Dai un nome al progetto.',
    nameTooLong: 'Usa al massimo {max} caratteri.',
    siteMissing: 'Scrivi l’indirizzo del sito.',
    siteInvalid: 'Scrivi l’indirizzo come schema e host, come https://negozio.example.com.',
    timezoneInvalid: 'Scegli un fuso orario dall’elenco.',
    conversionEventInvalid:
      'Usa lettere minuscole, cifre e trattini bassi, iniziando con una lettera.',
    limitReached:
      'L’account ha già i suoi {max} progetti. Eliminane uno dalle sue Impostazioni per crearne un altro.',
    subscriptionRequired:
      'Questo account non ha un abbonamento attivo, quindi non può creare progetti.',
    invalid: 'Queste impostazioni sono state rifiutate. Controlla i campi e riprova.',
    failed: 'Il progetto non è stato creato. Riprova.',
    noAccount: 'Solo il proprietario di un account con un abbonamento attivo può creare progetti.',
    back: 'Torna alla dashboard',
  },
  install: {
    title: 'Installazione',
    subtitle: 'Invia i primi eventi di {project}.',
    step1: '1. Installa Pyxis sul tuo sito',
    npm: 'Con un bundler (npm):',
    script: 'Oppure in HTML semplice, prima del tag di chiusura del body:',
    step2: '2. Apri una pagina del tuo sito',
    step2Note:
      'Le visualizzazioni di pagina da {origin} compaiono qui entro un minuto. Gli ad blocker possono bloccarle; prova una finestra privata.',
    waiting: 'In attesa del primo evento…',
    waitingNote: 'Questa pagina ricontrolla ogni pochi secondi.',
    received: 'Il primo evento è arrivato.',
    open: 'Apri la dashboard',
    copy: 'Copia',
    copied: 'Copiato',
    selected: 'Selezionato, premi Ctrl+C',
    privacy:
      'Pyxis non salva nessun cookie sui tuoi visitatori, nessun indirizzo IP e nessun dato personale. Scrivi nella tua informativa sulla privacy che il sito misura il proprio utilizzo con Pyxis.',
    how: 'Come installare',
    yourself: 'Per conto tuo',
    withAgent: 'Con un agente IA',
    agent: {
      lead: 'Apri il repository del sito in Claude Code, in Cursor o in un altro agente di programmazione e incolla questa richiesta. Contiene già la chiave pubblica e l’indirizzo di questo progetto.',
      prompt:
        'Installa Pyxis su questo sito seguendo {recipe}. La chiave pubblica del progetto è {key}, l’endpoint è {endpoint} e il sito è su {origin}. Misura le pagine e registra un evento a ogni azione importante, senza alcun dato personale. Alla fine, elenca i file che hai modificato e ogni evento che hai creato, con nome e proprietà, perché io li possa rivedere.',
      promptAnySite:
        'Installa Pyxis su questo sito seguendo {recipe}. La chiave pubblica del progetto è {key} e l’endpoint è {endpoint}. Misura le pagine e registra un evento a ogni azione importante, senza alcun dato personale. Alla fine, elenca i file che hai modificato e ogni evento che hai creato, con nome e proprietà, perché io li possa rivedere.',
      steps: {
        open: 'Apri il repository del tuo sito in Claude Code, in Cursor o in un altro agente di programmazione.',
        paste: 'Incolla la richiesta qui sopra e lascia lavorare l’agente.',
        review:
          'Rivedi cosa ha modificato: il pacchetto, l’<code>init</code> e gli eventi che elenca. Togli o rinomina quello che non vuoi.',
        publish:
          'Pubblica il sito e apri una delle sue pagine. Il passo 2, qui sotto, ti avvisa quando arriva il primo evento.',
      },
      changes: {
        title: 'Cosa cambierà l’agente',
        package:
          '<code>package.json</code>: il pacchetto <code>pyxis-analytics</code>, senza altre dipendenze.',
        init: 'Un file che gira nel browser su ogni pagina: l’<code>init</code> con la tua chiave.',
        track:
          'Una chiamata a <code>track</code> a ogni azione importante, dopo che è andata a buon fine.',
        csp: 'La policy di sicurezza (CSP), se il sito ne ha una, con l’indirizzo dell’API.',
        only: 'L’agente modifica solo il codice del sito. Non scrive niente in Pyxis.',
      },
      rules:
        'L’agente segue le regole di <code>llms.txt</code>: nessun dato personale, nomi di evento validi, l’indirizzo dell’API nella CSP.',
    },
    step3: '3. Verifica con Claude (facoltativo)',
    claude: {
      body: 'Collega Claude a Pyxis e chiedigli se sono arrivati i primi eventi. Legge gli stessi numeri di questa dashboard, non modifica mai niente, e revochi il collegamento quando vuoi, in <settings>Impostazioni</settings>.',
      connect:
        'In Claude, apri <code>claude.ai/directory/pyxis</code> e scegli Connect. In Claude Code, esegui questo comando, poi /mcp per accedere:',
      allow: 'Al momento del collegamento, una schermata di Pyxis ti chiede di consentirlo.',
    },
    ask: {
      lead: 'Hai già collegato Claude? Chiedigli:',
      question: 'Quante visite ha avuto {project} oggi, e da dove sono arrivate?',
    },
    phone: {
      copy: 'Copia l’indirizzo',
      title: 'L’installazione si fa al computer',
      body: 'Pyxis va nel codice del tuo sito. Apri questa pagina al computer, oppure copia il suo indirizzo e mandalo a chi si occupa del sito.',
    },
  },
  signUp: {
    title: 'Inizia la prova gratuita',
    intro:
      '{days} giorni gratis, poi il piano che scegli. Nessun addebito se annulli durante la prova.',
    oneTrial: 'Una prova gratuita per cliente.',
    plan: 'Piano',
    monthly: 'Mensile',
    yearly: 'Annuale',
    email: 'Email',
    emailPlaceholder: 'tu@azienda.it',
    terms:
      'Ho letto e accetto i <link>Termini di utilizzo, l’Accordo sul trattamento dei dati e l’Informativa sulla privacy</link> (versione {version}).',
    termsMissing: 'Accetta i termini per continuare.',
    sendCode: 'Invia il codice',
    sending: 'Invio…',
    checkTitle: 'Controlla la tua email',
    checkBody: 'Ti abbiamo inviato un codice di {digits} cifre. Scade tra 10 minuti.',
    code: 'Codice di {digits} cifre',
    change: 'Cambia',
    changeEmail: 'Cambia l’email',
    verify: 'Continua',
    verifying: 'Verifica…',
    resend: 'Invia un nuovo codice',
    resendIn: 'Invia un nuovo codice tra {time}',
    resent: 'Un nuovo codice è in arrivo.',
    noCode:
      'Niente dopo qualche minuto? Controlla la cartella dello spam o scrivi a <mail>{email}</mail> da questo indirizzo.',
    preparing: 'Preparazione del pagamento…',
    invalidCode: 'Questo codice è sbagliato o scaduto. Controllalo o richiedine uno nuovo.',
    termsOutdated:
      'I termini sono cambiati mentre questa pagina era aperta. Leggi la nuova versione e accettala di nuovo.',
    closed: 'Le registrazioni sono state chiuse mentre questa pagina era aperta.',
    rateLimited: 'Troppi tentativi da questo indirizzo. Aspetta qualche minuto e riprova.',
    unreachable: 'Impossibile raggiungere Pyxis. Riprova.',
    checkoutFailed:
      'Il tuo account è pronto, ma la pagina di pagamento non si è aperta. Completa il pagamento in Account e fatturazione.',
    openAccount: 'Apri Account e fatturazione',
    demoCode: 'Questa è la demo: il codice è <code/>.',
    demoFill: 'Usa {code}',
    haveAccount: 'Hai già un account?',
    signIn: 'Accedi',
    finishTitle: 'Completa l’abbonamento',
    finishBody: 'Il tuo account aspetta un piano. Scegline uno per iniziare la prova gratuita.',
    freeTitle: 'Crea il tuo account gratuito',
    freeIntro: 'Gratis: fino a {events} eventi al mese, su un sito. Senza carta.',
    fullTitle: 'Crea il tuo account',
    fullIntro:
      'Il piano gratuito è pieno per ora. Crea il tuo account e aspetterà un posto, oppure abbonati al piano a pagamento subito dopo.',
    opening: 'Apertura del tuo account…',
    waitTitle: 'Il piano gratuito è pieno per ora',
    waitBody:
      'Il tuo account è pronto e aspetta un posto nel piano gratuito: ti scriviamo quando se ne libera uno, e aspetta fino a {days} giorni. Puoi anche abbonarti al piano a pagamento adesso.',
  },
  signUpPage: {
    title: 'Registrati',
    closedTitle: 'Le registrazioni non sono ancora aperte',
    closedBody:
      'Per ora Pyxis è accessibile su invito. Scrivi a hello@pyxis-analytics.dev, oppure prova la demo live.',
    demo: 'Apri la demo live',
    home: 'Torna alla home page',
  },
  welcome: {
    activeAgain: 'Il tuo abbonamento è di nuovo attivo.',
    nextAgain:
      'I tuoi progetti tornano a misurare appena i loro siti usano una nuova chiave pubblica: creane una nelle Impostazioni di ogni progetto.',
    title: 'Ti diamo il benvenuto in Pyxis',
    confirming: 'Conferma dell’abbonamento…',
    confirmingNote:
      'Ci vuole qualche secondo e la pagina ricontrolla da sola. Se ci vuole di più, riceverai un’email quando sarà fatto.',
    trial: 'La tua prova gratuita è iniziata. Dura fino al giorno {date}.',
    active: 'Il tuo abbonamento è confermato.',
    free: 'Il tuo account è nel piano gratuito.',
    freeLimits:
      'Fino a {events} eventi al mese, {projects} e {people}, con tutte le funzioni e senza carta. La misurazione va in pausa quando il mese arriva a {pauseAt} eventi e riprende il giorno 1.',
    fromFreePlan:
      'Ora l’account accetta fino a {events} eventi al mese, {projects} e {people}. Se la misurazione era in pausa, riprende entro un minuto.',
    next: 'Ora crea un progetto per il tuo sito e installaci Pyxis.',
    create: 'Crea il tuo primo progetto',
    dashboard: 'Apri la dashboard',
  },
  cityOption: {
    heading: 'Città del visitatore',
    label: 'Registra la città approssimativa del visitatore',
    note: 'Disattivata per impostazione predefinita. La rete edge ricava la città dall’indirizzo IP, che non viene conservato, e la città viene conservata solo insieme alla regione. Attivala solo se l’informativa privacy del tuo sito lo dice: con identify, la città resta legata alle persone che identifichi.',
    on: 'Attiva',
    off: 'Disattiva',
    confirmTitle: 'Disattivare la città?',
    confirmBody:
      'La città smette di essere letta entro un minuto, e le città già registrate in questo progetto vengono cancellate entro 48 ore se resta disattivata. Non si può annullare.',
    confirm: 'Disattiva e cancella',
    keep: 'Lasciala attiva',
    saving: 'Salvataggio…',
    saved: 'Salvato',
    failed: 'La modifica non è stata salvata. Riprova.',
    subscriptionRequired:
      'La modifica non è stata salvata: l’account ha bisogno di un piano attivo.',
    readOnlyOn:
      'Questo progetto registra la città approssimativa del visitatore. Solo il proprietario dell’account può cambiarlo.',
    readOnlyOff:
      'Questo progetto non registra la città del visitatore. Solo il proprietario dell’account può cambiarlo.',
  },
  emailPreferences: {
    heading: 'Email',
    weeklyDigest: 'Riepilogo settimanale',
    weeklyDigestNote:
      'Ogni lunedì, la settimana chiusa domenica nel fuso {timezone}: visite, conversioni, scritture fallite, pagine ed eventi principali. Ogni admin sceglie per sé.',
    on: 'Attivo',
    off: 'Disattivo',
    saving: 'Salvataggio…',
    saved: 'Salvato',
    failed: 'La modifica non è stata salvata. Riprova.',
  },
  connectedApps: {
    heading: 'App collegate',
    note: 'Le app a cui hai permesso di leggere i numeri dei tuoi progetti. Ognuna può solo leggere, da tutti i progetti che puoi aprire. Revocala e si ferma subito; l’app ti chiederà di collegarti di nuovo.',
    empty: 'Ancora nessuna app collegata.',
    connected: 'Collegata',
    lastUsed: 'Ultimo utilizzo',
    connectHeading: 'Collega Pyxis a Claude',
    stepOpen: 'In Claude, apri Customize, poi Connectors, e scegli Add custom connector.',
    stepAddress: 'Chiamalo Pyxis e incolla questo indirizzo:',
    stepAllow: 'Scegli Connect, accedi a Pyxis nella finestra che si apre e scegli Consenti.',
    everywhere: 'Funziona in Claude sul web, sul computer e sul telefono.',
    claudeCode: 'In Claude Code, esegui questo comando, poi /mcp per accedere:',
  },
  connections: {
    copy: 'Copia',
    copied: 'Copiato',
    selected: 'Selezionato, premi Ctrl+C',
    revoke: 'Revoca',
    revoking: 'Revoca…',
    revoked: 'App scollegata',
    revokeFailed: 'L’app non è stata scollegata. Riprova.',
  },
  sessions: {
    heading: 'Sessioni',
    note: 'Tutti i dispositivi su cui hai effettuato l’accesso. Terminare una sessione disconnette quel dispositivo alla sua richiesta successiva.',
    thisDevice: 'Questo dispositivo',
    device: '{browser} su {os}',
    unknownDevice: 'Browser sconosciuto',
    signedIn: 'Accesso',
    lastUsed: 'Ultimo utilizzo',
    end: 'Termina',
    ending: 'Chiusura…',
    ended: 'Sessione terminata',
    failed: 'La sessione non è stata terminata. Riprova.',
  },
  accessTokens: {
    heading: 'Token di accesso',
    note: 'Permetti a un agente AI o a uno script di leggere i numeri che vedi qui, da tutti i progetti che puoi aprire. Un token può solo leggere: non modifica mai nulla e smette di funzionare nel momento in cui lo revochi.',
    name: 'Nome',
    namePlaceholder: 'Claude Code, Cursor…',
    nameMissing: 'Dai un nome al token, così potrai riconoscerlo in seguito.',
    nameTooLong: 'Usa al massimo {max} caratteri.',
    lifetime: 'Scade tra',
    lifetime30: '30 giorni',
    lifetime90: '90 giorni',
    lifetime365: '1 anno',
    create: 'Crea il token',
    creating: 'Creazione…',
    failed: 'Il token non è stato creato. Riprova.',
    tooMany: 'Hai {max} token, il massimo consentito. Revocane uno per crearne un altro.',
    revealHeading: 'Copia ora il nuovo token',
    revealNote: 'È l’unica volta che viene mostrato. Se lo perdi, revocalo e creane un altro.',
    usage: 'Invialo nell’header Authorization:',
    copy: 'Copia',
    copied: 'Copiato',
    selected: 'Selezionato, premi Ctrl+C',
    done: 'Fine',
    empty: 'Ancora nessun token.',
    created: 'Creato',
    lastUsed: 'Ultimo utilizzo',
    neverUsed: 'Mai usato',
    expires: 'Scade',
    revoke: 'Revoca',
    revoking: 'Revoca…',
    revoked: 'Token revocato',
    revokeFailed: 'Il token non è stato revocato. Riprova.',
  },
  connect: {
    title: 'Collega un’app',
    heading: 'Collegare {app} a Pyxis?',
    asks: '{app} ({host}) chiede di leggere i numeri dei tuoi progetti.',
    signedInAs: 'Accesso effettuato come {email}',
    accessHeading: 'Cosa può fare',
    access:
      'Solo leggere: gli stessi numeri che vedi in questa dashboard, da tutti i progetti che puoi aprire. Non modifica mai nulla.',
    projectsHeading: 'I tuoi progetti',
    noProjects: 'Non hai ancora progetti. Leggerà quelli che potrai aprire in futuro.',
    dataHeading: 'Dove vanno i dati',
    dataToCompany:
      'I dati che {app} richiede, inclusa la tua email, vanno a {company}, negli Stati Uniti, che li tratta secondo i propri termini. Consenti solo se sei d’accordo.',
    dataToApp:
      'I dati che {app} richiede, inclusa la tua email, vanno all’azienda che lo gestisce ({host}), che li tratta secondo i propri termini. Consenti solo se sei d’accordo.',
    returnHeading: 'Dove va poi questa finestra',
    returnTo: 'Torna a {host}.',
    loopback:
      'La risposta va a un programma su questo computer. Consenti solo se hai appena avviato il collegamento in {app} su questo computer.',
    notYou: 'Se non l’hai appena avviato tu in {app}, scegli Annulla.',
    revokeLater: 'Puoi revocare il collegamento in qualsiasi momento nelle Impostazioni.',
    goneHeading: 'Questa richiesta di collegamento è terminata',
    back: 'Torna alla dashboard',
  },
  consent: {
    allow: 'Consenti',
    allowing: 'Autorizzazione…',
    cancel: 'Annulla',
    cancelling: 'Annullamento…',
    leaving: 'Ritorno a {app}…',
    tooMany:
      'Hai già {max} app collegate, il massimo consentito. Revocane una nelle <settings>Impostazioni</settings> per collegarne un’altra.',
    failed: 'Non è stato inviato nulla. Riprova.',
    gone: 'Ha già ricevuto una risposta, oppure sono passati più di {minutes} minuti. Torna su Claude e collega di nuovo Pyxis.',
  },
  chartPanel: {
    showAs: 'Mostra come',
    chart: 'Grafico',
    table: 'Tabella',
  },
  visitsLink: {
    purpose: ': vedi le sue visite',
  },
  units: {
    points: '{points} p.p.',
  },
  counts: {
    visit: forms('{count} visita', '{count} visite'),
    matchingVisit: forms('{count} visita trovata', '{count} visite trovate'),
    person: forms('{count} persona', '{count} persone'),
    project: forms('{count} progetto', '{count} progetti'),
    day: forms('{count} giorno', '{count} giorni'),
    page: forms('{count} pagina', '{count} pagine'),
    event: forms('{count} evento', '{count} eventi'),
    item: forms('{count} elemento', '{count} elementi'),
    write: forms('{count} scrittura', '{count} scritture'),
    request: forms('{count} richiesta', '{count} richieste'),
    failure: forms('{count} errore', '{count} errori'),
    failedRead: forms('{count} lettura fallita', '{count} letture fallite'),
    failedRequest: forms('{count} richiesta fallita', '{count} richieste fallite'),
    clientError: forms('{count} errore del client (4xx)', '{count} errori del client (4xx)'),
    serverError: forms('{count} errore del server (5xx)', '{count} errori del server (5xx)'),
    conversionEvent: forms('{count} evento di conversione', '{count} eventi di conversione'),
    continent: forms('{count} continente', '{count} continenti'),
    country: forms('{count} paese', '{count} paesi'),
    region: forms('{count} regione', '{count} regioni'),
    city: forms('{count} città', '{count} città'),
  },
  period: {
    presets: {
      today: 'oggi',
      '7d': 'ultimi 7 giorni',
      '30d': 'ultimi 30 giorni',
    },
    rangeProblems: {
      notADate: 'una delle sue date non è una data di calendario',
      inverted: 'finisce prima di iniziare',
      future: 'finisce dopo oggi',
      tooLong: 'è più lungo di {days} giorni',
    },
    rejectedRange:
      'Quell’intervallo non è stato usato: {problem}. Vengono mostrati invece gli ultimi {days} giorni.',
  },
  glossary: {
    visit:
      'Una visita è una scheda del browser, dal suo primo evento all’ultimo; due schede non sono mai collegate.',
    identifiedUser:
      'Un utente identificato è un ID utente distinto che il sito ha passato a identify(), di solito quando qualcuno accede; una visita senza ID è anonima.',
    conversion:
      'Una conversione è una visita che ha inviato almeno una volta l’evento di conversione del progetto; gli eventi di conversione contano ogni invio.',
    write: 'Una scrittura è un POST, PUT, PATCH o DELETE inviato con trackRequest().',
    failure: 'Un errore è un codice di stato 400 o superiore, oppure l’assenza di risposta.',
    changeTone:
      'Una variazione è verde o rossa solo quando il periodo precedente contava almeno {base} e la variazione raggiunge la soglia minima: {change} ({points} punti per il tasso di errore in scrittura).',
  },
  metrics: {
    noChange: 'nessuna variazione',
  },
  overview: {
    subtitle: 'Come è stato usato {project} nel periodo',
    kpiToggleHint: 'Mostra questo valore giorno per giorno nel grafico qui sotto.',
    topPages: {
      title: 'Pagine principali',
      empty: 'Nessuna visualizzazione di pagina in questo periodo.',
      page: 'Pagina',
      views: 'Visualizzazioni',
      visits: 'Visite',
      shareOfViews: 'Quota di visualizzazioni',
    },
    topEvents: {
      title: 'Eventi principali',
      empty:
        'Nessun evento con nome in questo periodo. Gli eventi inviati con <code>track()</code> compaiono qui.',
      inVisits: 'in {visits}',
    },
    kpis: {
      visits: 'Visite',
      identifiedUsers: 'Utenti identificati',
      conversions: 'Conversioni',
      writeErrorRate: 'Tasso di errore in scrittura',
    },
    notes: {
      identifiedUsers: 'con almeno un accesso',
      writeErrors: 'fallite: {failed} su {writes}',
      shareOfVisits: '{share} di {visits}',
      conversionEvents: '{event} · {share}',
      convertingVisits: '{share} ha inviato {event} · {events}',
    },
    drillDowns: {
      visits: 'Vedi le visite',
      identifiedVisits: 'Vedi le visite identificate',
      convertingVisits: 'Vedi le visite con conversione',
      failingRoutes: 'Vedi le rotte con errori',
    },
    spoken: {
      change: 'variazione',
      better: 'meglio',
      worse: 'peggio',
    },
    comparison: {
      dayBefore: 'rispetto al giorno prima',
      previousDays: 'rispetto ai {days} giorni precedenti',
      soFarToday: 'oggi finora rispetto a tutto ieri',
      previousFullDays: 'rispetto ai {days} giorni interi precedenti',
      yesterdayUntil: 'rispetto a ieri fino alle {time}',
      previousDaysUntil: 'rispetto ai {days} giorni precedenti, fino alle {time}',
    },
    comparisonFiltered: {
      dayBefore: 'rispetto al giorno prima, stessi filtri',
      previousDays: 'rispetto ai {days} giorni precedenti, stessi filtri',
      soFarToday: 'oggi finora rispetto a tutto ieri, stessi filtri',
      previousFullDays: 'rispetto ai {days} giorni interi precedenti, stessi filtri',
      yesterdayUntil: 'rispetto a ieri, stessi filtri, fino alle {time}',
      previousDaysUntil: 'rispetto ai {days} giorni precedenti, stessi filtri, fino alle {time}',
    },
  },
  rowFilter: {
    add: 'Filtra per {value}',
    title: 'Filtra tutte le schermate per {value}',
    remove: 'Rimuovi il filtro {value}',
  },
  propertySummary: {
    median: 'Mediana',
    middleHalf: 'Metà centrale',
    range: 'da {low} a {high}',
    splitBy: 'Dividi per',
    noSplit: 'Senza divisione',
    loading: 'Lettura della mediana di {key}…',
    failed: 'Impossibile leggere la mediana di {key}.',
    otherValues: 'Altri valori',
    columns: {
      value: 'Valore',
      median: 'Mediana',
      middleHalf: 'Metà centrale',
      events: 'Eventi',
    },
  },
  dashboardFilters: {
    label: 'Filtri',
    removeAll: 'Rimuovi i filtri',
    newsPaused: 'Le novità sono in pausa finché ci sono filtri attivi.',
    empty: {
      title: 'Nessuna visita corrisponde a questi filtri',
      body: 'Niente in {period} soddisfa tutti i filtri qui sopra. Rimuovine uno, o tutti.',
    },
    periodFiltered: '{period}, filtrato per {filters}',
  },
  overviewChart: {
    activityTitle: 'Attività al giorno',
    dayTitle: 'Attività del giorno',
    activitySubject: 'Visualizzazioni di pagina ed eventi con nome',
    subjectInPeriod: '{subject}, {period}',
    previousPeriod: 'Periodo precedente',
    day: 'Giorno',
    pageViews: 'Visualizzazioni di pagina',
    namedEvents: 'Eventi con nome',
    metricTitle: '{metric} al giorno',
    gaps: {
      noValue: 'nessun valore',
      noWrites: 'nessuna scrittura',
    },
    statistics: {
      noneOnAnyDay: '{gap} in nessun giorno',
      total: '{total} in totale',
      range: 'tra {lowest} e {highest} al giorno',
      gapDays: '{gap} in {days}',
    },
    summary: {
      lineChart: 'Grafico a linee di {days}.',
      series: '{series}: {statistics}.',
      previous: 'Tratteggiato, il periodo precedente.',
    },
    caption: '{subject} al giorno, {period}',
    captionWithPrevious: '{caption}, con il periodo precedente',
    columns: {
      comparedWith: 'Confronto con',
      previous: '{series} prima',
    },
    point: '{series}, {day}',
  },
  acquisition: {
    subtitle: 'Da dove arrivano le visite a {project}',
    paidVisits: 'Visite a pagamento',
    footnote:
      'Un clic su un annuncio viene riconosciuto dall’ID di clic nell’URL di arrivo. Pyxis conserva solo il fatto che c’era, mai l’ID stesso, e di un sito di provenienza conserva solo il dominio.',
    sources: {
      title: 'Sorgenti',
      description:
        'La sorgente della campagna, altrimenti il sito di provenienza, della prima pagina di ogni visita',
      empty: 'Nessuna visita con una sorgente in questo periodo.',
      source: 'Sorgente',
      medium: 'Mezzo',
      visits: 'Visite',
    },
    channelChart: {
      title: 'Visite per canale',
      description: 'Ogni visita secondo il canale da cui è arrivata, {period}',
      caption: 'Visite per canale al giorno, {period}',
      day: 'Giorno',
      total: 'Totale',
    },
    channels: {
      paid: 'A pagamento',
      email: 'Email',
      social: 'Social',
      campaign: 'Altre campagne',
      organic: 'Ricerca organica',
      referral: 'Referral',
      direct: 'Diretto',
    },
    directSource: 'Diretto',
    adClickSource: '(clic su annuncio)',
    topChannel: 'Canale principale',
    topUnpaidChannel: 'Canale gratuito principale',
    shareOfVisits: '{share} di {visits}',
    fromAdClicks: '{visits} da clic su annunci',
    conversionColumns: {
      conversions: 'Conversioni',
      conversionRate: 'Tasso di conversione',
      converted: '{conversions} con conversione',
    },
    campaigns: {
      title: 'Campagne',
      description:
        'Il tag di campagna (utm_campaign) della prima pagina di ogni visita, con la sorgente da cui è arrivato; i 20 che hanno portato più visite',
      empty: 'Nessuna visita è arrivata con un tag di campagna in questo periodo.',
      campaign: 'Campagna',
      source: 'Sorgente',
      visits: 'Visite',
      visitsLinkPurpose: ': vedi le sue visite da {source}',
    },
    summary: {
      bars: 'Grafico a barre impilate di {days},',
      range: 'tra {lowest} e {highest} visite al giorno.',
      channels: 'Visite per canale: {channels}.',
      channel: '{channel} {visits}',
    },
  },
  devices: {
    types: {
      mobile: 'Mobile',
      desktop: 'Desktop',
      tablet: 'Tablet',
    },
    other: 'Altro',
    otherCountries: 'Altri paesi',
    otherRegions: 'Altre regioni',
    unknownRegion: 'Sconosciuta',
    otherCities: 'Altre città',
    unknownCity: 'Sconosciuta',
    convertedOfVisits: '{converted} su {visits}',
    subtitle: 'Cosa usano le persone per raggiungere {project}',
    panels: {
      deviceType: 'Tipo di dispositivo',
      browser: 'Browser',
      operatingSystem: 'Sistema operativo',
    },
    columns: {
      country: 'Paese',
      region: 'Regione',
      city: 'Città',
      visits: 'Visite',
      share: 'Quota',
      conversionRate: 'Tasso di conversione',
    },
    countries: 'Paesi',
    regions: 'Regioni',
    cities: 'Città',
    reach: {
      title: 'Copertura',
      leadingRegion: 'Regione con più visite: {place} ({share} delle visite)',
      leadingCountry: 'Paese con più visite: {place} ({share} delle visite)',
      noKnownPlace: 'Nessuna visita di questo periodo ha un paese noto.',
      continentsNote: 'Continenti secondo il raggruppamento dei paesi dell’ONU: {continents}.',
      continents: {
        americas: 'Americhe',
        europe: 'Europa',
        asia: 'Asia',
        africa: 'Africa',
        oceania: 'Oceania',
      },
    },
    conversionByDevice: {
      title: 'Conversione per dispositivo',
      description: 'Quota di visite che hanno inviato <code/>',
    },
    footnote:
      'Dispositivo, browser e sistema vengono ricavati sul server dallo user agent del browser, che poi viene scartato. Il paese e la regione arrivano dalla rete edge, mai da un indirizzo IP salvato; la città approssimativa viene registrata solo in un progetto il cui proprietario l’ha attivata nelle Impostazioni. Le visite più vecchie hanno solo il paese.',
  },
  requests: {
    noResponse: 'Nessuna risposta',
    figures: {
      writes: 'Scritture',
      errorRate: 'Tasso di errore in scrittura',
      slowestRoute: 'Rotta più lenta',
      failedReads: 'Letture fallite',
      failingRoutes: 'Rotte con errori',
    },
    notes: {
      writes: 'Chiamate POST, PUT, PATCH e DELETE dal browser',
      withNoResponse: '{count} senza risposta',
      noFailures: 'Nessun errore su {writes}',
      failed: 'fallite: {failed}, di cui {kinds}',
      noFailedRead: 'Nessuna lettura fallita in questo periodo',
      mostFailing: 'La peggiore: {route}, {failures}',
      noWrites: 'Nessuna scrittura in questo periodo',
      slowestMedian: 'mediana di {route}',
    },
    duration: '{milliseconds} ms',
    routeSummary: {
      reads: '{failedReads} · mediana {median}',
      writes: '{requests} · {errorShare} errori · mediana {median}',
    },
    failureDays: {
      title: 'Errori al giorno',
      description: {
        writes: 'Ogni scrittura fallita, per tipo di problema, {period}',
        reads: 'Ogni lettura fallita, per tipo di problema, {period}',
      },
      classes: {
        clientError: 'Errori del client (4xx)',
        serverError: 'Errori del server (5xx)',
        noResponse: 'Nessuna risposta',
      },
      day: 'Giorno',
      total: 'Totale',
      caption: 'Errori al giorno per tipo di problema, {period}',
      none: 'Niente è fallito in questo periodo.',
      summary: {
        bars: 'Grafico a barre impilate di {days},',
        range: 'tra {lowest} e {highest} errori al giorno.',
        classes: 'Per tipo di problema: {classes}.',
        class: '{label} {count}',
      },
    },
    routeDays: {
      heading: 'Giorno per giorno',
      loading: 'Caricamento dei giorni di questa rotta…',
      failed: 'Impossibile caricare i giorni di questa rotta.',
      retry: 'Riprova',
      unavailable: 'I dati giorno per giorno richiedono un’API Pyxis più recente.',
      none: {
        writes: 'Nessuna chiamata a questa rotta in questo periodo.',
        reads: 'Nessuna lettura fallita di questa rotta in questo periodo.',
      },
      quietDays: {
        writes: forms(
          '{count} giorno senza chiamate non è elencato.',
          '{count} giorni senza chiamate non sono elencati.',
        ),
        reads: forms(
          '{count} giorno senza letture fallite non è elencato.',
          '{count} giorni senza letture fallite non sono elencati.',
        ),
      },
      columns: {
        day: 'Giorno',
        total: 'Totale',
        failed: 'Fallite',
        median: 'Mediana',
        p95: 'p95',
      },
    },
    page: {
      subtitle: {
        writes: 'Ogni scrittura fatta da {project} e come è andata a finire',
        reads: 'Le letture fatte da {project} che sono fallite',
      },
      kinds: {
        label: 'Tipo di richiesta',
        writes: 'Scritture',
        reads: 'Letture fallite',
      },
      readsNeedApi: {
        title: 'Le letture fallite richiedono un’API Pyxis più recente',
        body: 'Questa API riporta solo le scritture. Aggiorna pyxis-api per elencare le chiamate GET fallite; le scritture sono nella scheda Scritture.',
      },
      empty: {
        reads:
          'Nessuna lettura fallita in questo periodo. Le chiamate GET inviate con trackRequest() compaiono qui quando falliscono.',
        readsFromScreen: 'Nessuna lettura fallita da {screen} in questo periodo.',
        writesFromScreen: 'Nessuna scrittura da {screen} in questo periodo.',
        failing: 'Nessuna rotta ha avuto errori in questo periodo.',
        writes:
          'Nessuna scrittura in questo periodo. Le chiamate inviate con trackRequest() compaiono qui.',
      },
      footnote: {
        ownTab:
          'Le letture fallite hanno una scheda a parte; Visite e Cronologia contano insieme letture e scritture fallite.',
        failedRead:
          'Una lettura fallita è un GET inviato con trackRequest() che ha risposto 400 o più, oppure non ha mai risposto. Un sito può inviare le sue letture solo quando falliscono, quindi le letture non hanno un tasso di errore. Visite e Cronologia contano insieme letture e scritture fallite.',
        source: 'Viene conservato solo il modello della rotta, mai i valori dell’URL né il corpo.',
      },
    },
    filters: {
      label: 'Mostra',
      all: 'Tutte le rotte',
      failingOnly: 'Solo con errori',
      fromScreen: 'Dalla schermata <screen/>',
      clearScreen: 'Rimuovi il filtro per schermata',
      clear: 'Rimuovi',
      hint: 'Seleziona una rotta per vedere i suoi codici di stato, le schermate in cui è fallita e i suoi ultimi errori.',
    },
    table: {
      heading: 'Rotte',
      columns: {
        route: 'Rotta',
        total: 'Totale',
        failed: 'Fallite',
        outcomes: 'Successi · errori',
        statuses: 'Codici di stato',
        median: 'Mediana',
        p95: 'p95',
      },
      showDetails: '{route}, mostra i dettagli',
      successShare: '{share} ok',
      errorShare: '{share} errori',
    },
    details: {
      close: 'Chiudi',
      statuses: 'Codici di stato',
      whereItFailed: 'Dove è fallita',
      screenFailed: 'fallite: {failed}',
      onlyThisScreen: ': mostra solo le richieste fatte da questa schermata',
      latestFailures: 'Ultimi errori',
      noFailures: 'Nessun errore in questo periodo.',
      failedVisits: 'Vedi tutte le visite con un {method} {route} fallito',
      noErrorCode: 'Nessun codice di errore',
      openVisit: 'Apri la visita {visit}',
    },
  },
  properties: {
    otherValues: 'Altri valori',
  },
  features: {
    subtitle: 'Cosa usano di più le persone in {project}',
    kindLabel: 'Tipo di funzionalità',
    kinds: {
      events: 'Eventi',
      screens: 'Schermate',
    },
    search: {
      events: 'Cerca eventi',
      screens: 'Cerca schermate',
      submit: 'Cerca',
      submitting: 'Ricerca…',
      clear: 'Rimuovi',
    },
    titles: {
      events: 'Eventi più usati',
      screens: 'Schermate più visitate',
    },
    nameHeaders: {
      events: 'Evento',
      screens: 'Schermata',
    },
    nothingYet: {
      events:
        'Nessun evento con nome in questo periodo. Gli eventi inviati con track() compaiono qui.',
      screens: 'Nessuna visualizzazione di pagina in questo periodo.',
    },
    noMatch: 'Nessun risultato per “{query}”.',
    columns: {
      count: 'Conteggio',
      visits: 'Visite',
      trend: 'Andamento',
      share: 'Quota',
    },
    footnote:
      'Gli eventi vengono inviati dal sito con l’SDK di Pyxis; aprine uno per vedere come si distribuiscono i valori delle sue proprietà. Le schermate sono visualizzazioni di pagina raggruppate per modello di percorso, quindi /ordini/8213 e /ordini/8214 contano come /ordini/:id.',
  },
  propertyBreakdown: {
    toggle: 'Proprietà di {event}',
    loading: 'Caricamento delle proprietà di {event}…',
    failed: 'Impossibile caricare le proprietà di {event}.',
    retry: 'Riprova',
    none: '{event} non ha avuto proprietà in questo periodo.',
    carriedBy: '· presente in {carriedBy}',
    columns: {
      value: 'Valore',
      share: 'Quota',
      count: 'Conteggio',
      visits: 'Visite',
    },
    valuePurpose: ': vedi le visite in cui {key} è {value}',
  },
  funnel: {
    openedPage: 'Ha aperto {path}',
    start: 'Inizio',
    continued: '{share} prosegue',
    dropped: 'abbandoni: {count}',
    reachedLastStep: 'hanno raggiunto l’ultimo passaggio: {reached} su {subjects}',
    noStepToCompare: 'Nessun passaggio da confrontare',
    transition: 'Passaggio {from} → {to}',
    transitionNote: '{from} → {to} · {share} prosegue',
    medianTime: 'mediana {duration} dopo il passaggio precedente',
    timeToFinish: 'Tempo mediano di completamento',
    timeToFinishNote: 'dal passaggio 1 al passaggio {last}, per chi lo ha raggiunto',
    page: {
      subtitle: 'Dove le persone proseguono e dove abbandonano in {project}',
      countBy: 'Conta per',
      modes: {
        visit: 'Per visita',
        user: 'Per persona',
      },
      overallConversion: 'Conversione complessiva',
      biggestDropOff: 'Abbandono maggiore',
      stepsHeading: 'Funnel',
      modeNotes: {
        visit: 'Per visita: un passaggio conta solo dopo quello precedente, nella stessa visita',
        user: 'Per persona: i passaggi possono estendersi su più visite una volta che la persona è identificata',
      },
    },
    build: {
      title: 'Crea un funnel',
      body: 'Un funnel ha da 2 a 8 passaggi, ognuno un percorso di pagina (<code>*</code> corrisponde a qualsiasi sequenza di caratteri) o un nome di evento. Un passaggio conta solo dopo quello precedente. I passaggi stanno nell’indirizzo, quindi un segnalibro conserva il funnel.',
      example: 'Parti da un funnel di esempio',
    },
    subjects: {
      reachedLink: '{count}, elenca chi ha raggiunto il passaggio {step}',
      droppedLink: '{dropped}, elenca chi ha abbandonato prima del passaggio {step}',
      reached: forms(
        '{subjects} ha raggiunto il passaggio {step}',
        '{subjects} hanno raggiunto il passaggio {step}',
      ),
      dropped: forms(
        '{subjects} ha raggiunto il passaggio {previous} ma mai il passaggio {step}',
        '{subjects} hanno raggiunto il passaggio {previous} ma mai il passaggio {step}',
      ),
      columns: {
        visit: 'Visita',
        person: 'Persona',
        reachedAt: 'Data ultimo passaggio',
      },
      openVisit: '{visit}, apri questa visita nella cronologia',
      openPerson: '{user}, apri la cronologia di questa persona',
      order: 'Dalle più recenti, 50 alla volta.',
      older: 'Mostra le precedenti',
      newest: 'Torna alle più recenti',
      close: 'Chiudi l’elenco',
      empty: 'Nessuno in questo periodo.',
    },
  },
  visits: {
    problems: {
      propertyNeedsEvent: 'Un filtro per proprietà richiede un evento.',
      propertyFormat:
        'Un filtro per proprietà è chiave=valore: una chiave di lettere minuscole, cifre e _, e un valore da 1 a {max} caratteri.',
      country: 'Un paese si indica con il codice di due lettere, come BR.',
      region: 'Una regione si indica con il codice del paese e della regione, come BR-SP.',
      city: 'Una città ha al massimo {max} caratteri.',
      source: 'Una sorgente ha al massimo {max} caratteri.',
      campaign: 'Una campagna ha al massimo {max} caratteri.',
      route: 'Una richiesta si indica con un metodo e una rotta, come POST /orders/:id.',
    },
    accountLink: '{user}, apri la cronologia di questo utente',
    shortAccountLink: '{shown}, apri la cronologia dell’utente {user}',
    noFailedRequest: 'Nessuna richiesta fallita',
    page: {
      subtitle: 'Tutte le visite a {project} nel periodo, dalle più recenti',
      footnote:
        'In evidenza: i primi cinque eventi con nome di ogni visita, in ordine. Una richiesta fallita è una lettura o una scrittura inviata con trackRequest() che ha risposto 400 o più, oppure non ha mai risposto; Richieste elenca le scritture e le letture fallite in schede separate.',
      empty: {
        filtered: 'Nessuna visita corrisponde a questi filtri in questo periodo.',
        all: 'Nessuna visita in questo periodo. Una visita compare qui appena il tuo sito invia il primo evento.',
      },
    },
    filters: {
      label: 'Filtra le visite',
      toggle: 'Filtri',
      toggleActive: 'Filtri · attivi: {count}',
      pages: {
        legend: 'Passate per le pagine',
        hint: 'Una visita deve aver visto tutte le pagine indicate. Un * corrisponde a qualsiasi sequenza di caratteri, come in /blog/*.',
        path: 'Pagina vista',
        path2: 'E la pagina',
        path3: 'E anche la pagina',
      },
      event: 'Con l’evento',
      property: 'Con la proprietà',
      propertyHint: 'chiave=valore, sull’evento qui sopra',
      channel: 'Canale',
      anyChannel: 'Qualsiasi canale',
      device: 'Dispositivo',
      anyDevice: 'Qualsiasi dispositivo',
      browser: 'Browser',
      anyBrowser: 'Qualsiasi browser',
      os: 'Sistema',
      anySystem: 'Qualsiasi sistema',
      account: 'Account',
      anyone: 'Chiunque',
      identities: {
        identified: 'Identificate',
        anonymous: 'Anonime',
      },
      country: 'Paese',
      countryHint: 'Codice di due lettere',
      region: 'Regione',
      regionHint: 'Codice del paese e della regione',
      city: 'Città',
      cityHint: 'Nome esatto, con la sua regione',
      source: 'Sorgente',
      sourceHint: 'Come la indica Acquisizione',
      campaign: 'Campagna',
      route: 'Richiesta fatta',
      routeHint: 'Metodo e rotta',
      failed: 'Con una richiesta fallita',
      placeholders: {
        path: '/pricing',
        event: 'signup_completed',
        property: 'plan=pro',
        country: 'BR',
        region: 'BR-SP',
        city: 'Campinas',
        source: 'google',
        campaign: 'spring_sale',
        route: 'POST /orders',
      },
      leftOut: 'Alcuni filtri sono stati esclusi:',
      apply: 'Applica i filtri',
      applying: 'Applicazione…',
      clear: 'Rimuovi i filtri',
      applied: {
        label: 'Filtri applicati',
        item: '{filter}: <value/>',
        remove: 'Rimuovi {filter}: {value}',
        removeFlag: 'Rimuovi {filter}',
        clearAll: 'Rimuovi tutti',
      },
      unapplied: 'Modifiche non ancora applicate',
      undo: 'Annulla',
    },
    table: {
      heading: 'Visite',
      columns: {
        started: 'Inizio',
        duration: 'Durata',
        entryPage: 'Pagina d’ingresso',
        pages: 'Pagine',
        highlights: 'In evidenza',
        failed: '<hidden>Richieste </hidden>Fallite',
        device: 'Dispositivo',
        channel: 'Canale',
        account: 'Account',
      },
      openVisit: '{started}, apri la visita {visit}',
      channelNote: 'Canale: {channel}',
      anonymous: 'Anonima',
      everyVisit: 'Queste sono tutte le visite del periodo.',
      load: 'Carica le visite precedenti',
      loading: 'Caricamento delle visite precedenti…',
      failed: 'Impossibile caricare le visite precedenti. Riprova.',
    },
  },
  timeline: {
    lookupHints: {
      visit: 'Un ID visita ha questo aspetto: 94810767-edf6-4c2b-9a1d-2e3f4a5b6c01.',
      user: 'Un ID utente ha da 1 a 64 lettere, cifre, trattini o trattini bassi.',
    },
    openedPage: 'Ha aperto {path}',
    linkedToUser: 'Visita collegata all’utente',
    visitHeading: 'Visita {visit} · {started}',
    userTitle: 'Utente {user}',
    visitTitle: 'Visita {visit}',
    duration: {
      hours: '{hours} h {minutes} min',
      minutes: '{minutes} min {seconds} s',
      seconds: '{seconds} s',
    },
    page: {
      subtitle: 'Tutto ciò che una persona o una visita ha fatto in {project}, in ordine',
      tryPerson: 'Prova {user}',
    },
    lookUp: {
      title: 'Cerca una persona o una visita',
      body: 'Scrivi un ID utente, quello che il tuo sito passa a identify(), per vedere tutte le visite di quella persona, oppure un ID visita per vedere una sola visita. Eventi, visualizzazioni di pagina e richieste compaiono nell’ordine in cui sono avvenuti, nel fuso orario del progetto.',
      demoPerson: 'Apri la cronologia della persona demo {user}',
    },
    notFound: {
      title: 'Nessuna visita trovata per {lookup}',
      body: 'L’ID potrebbe essere scritto male, le visite potrebbero essere più vecchie del periodo di conservazione, oppure i dati della persona potrebbero essere stati cancellati.',
    },
    filters: {
      label: 'Mostra',
      all: 'Tutto',
      pages: 'Visualizzazioni',
      events: 'Eventi',
      requests: 'Richieste',
      errors: 'Solo errori',
    },
    search: {
      lookUp: 'Cerca',
      kinds: {
        user: 'Una persona, per ID utente',
        visit: 'Una visita, per ID visita',
      },
      ids: {
        user: 'ID utente',
        visit: 'ID visita',
      },
      submit: 'Mostra la cronologia',
      pending: 'Ricerca…',
      rejected: 'Non è stato cercato nulla. {hint}',
    },
    older: {
      everyVisit: 'Queste sono tutte le visite.',
      load: 'Carica le visite precedenti',
      loading: 'Caricamento delle visite precedenti…',
      failed: 'Impossibile caricare le visite precedenti. Riprova.',
    },
    card: {
      allVisitsOf: 'Tutte le visite di {user}',
      nothingOfThisKind: 'Niente di questo tipo in questa visita.',
    },
  },
  funnelEditor: {
    heading: 'Passaggi',
    open: 'Modifica i passaggi',
    close: 'Chiudi l’editor',
    stepType: 'Tipo del passaggio {step}',
    types: {
      page: 'Percorso di pagina',
      event: 'Nome di evento',
    },
    stepValue: {
      page: 'Percorso di pagina del passaggio {step}',
      event: 'Nome di evento del passaggio {step}',
    },
    placeholders: {
      page: '/pricing o /blog/*',
      event: 'signup_completed',
    },
    moveUp: 'Sposta su il passaggio {step}',
    moveDown: 'Sposta giù il passaggio {step}',
    remove: 'Rimuovi il passaggio {step}',
    removeShort: 'Rimuovi',
    add: 'Aggiungi passaggio',
    stepCount: '{steps} passaggi su {max}, almeno {min}',
    apply: 'Applica',
    applying: 'Applicazione…',
    status: {
      ready: 'Applica per contare questi {steps} passaggi.',
      fillIn: 'Compila tutti i passaggi per applicare.',
      fix: 'Correggi i passaggi evidenziati per applicare.',
    },
    problems: {
      pathStart: 'Un percorso di pagina inizia con “/”.',
      pathLength: 'Un percorso di pagina ha al massimo {max} caratteri.',
      eventName:
        'Un nome di evento inizia con una lettera minuscola e contiene solo lettere minuscole, cifre e _, al massimo 64.',
    },
  },
  timeOfDay: {
    title: 'Quando iniziano le visite',
    description:
      'Visite per giorno della settimana e ora della prima visualizzazione di pagina ({period}).',
    summary: 'Momento di punta: {weekday}, dalle {from} alle {to} ({visits}).',
    summaryEmpty: 'Nessuna visita è iniziata in questo periodo.',
    cell: '{weekday}, {from}: {visits}',
    weekday: 'Giorno',
    table: 'Visite per giorno della settimana e ora',
    fewer: 'Meno',
    more: 'Più',
  },
  engagement: {
    entryTitle: 'Dove iniziano le visite',
    entryDescription:
      'Le pagine da cui sono iniziate le visite e quante sono uscite subito dopo ({period}).',
    exitTitle: 'Dove finiscono le visite',
    exitDescription: 'L’ultima pagina vista da ogni visita ({period}).',
    page: 'Pagina',
    visits: 'Visite',
    singlePage: 'Uscite subito dopo',
    lengthTitle: 'Quanto durano le visite',
    lengthDescription: 'Dal primo all’ultimo evento di ogni visita ({period}).',
    length: 'Durata',
    share: 'Quota',
    medianLabel: 'Visita mediana',
    singlePageLabel: 'Una sola pagina vista',
    summary: 'Visita mediana {median}; visite con una sola pagina vista: {share}.',
    noMedian: 'nessuna visita',
    noPages: 'Nessuna visualizzazione di pagina in questo periodo.',
    units: {
      seconds: '{count} s',
      minutes: '{count} min',
    },
    lengths: {
      under: 'Meno di {upper}',
      between: 'Da {lower} a {upper}',
      atLeast: '{lower} o più',
    },
  },
  funnelSegments: {
    title: 'Il funnel per {by}',
    description:
      'Visite che hanno raggiunto ogni passaggio, per {by}, sulla stessa scala ({period}).',
    dimensions: {
      device: 'tipo di dispositivo',
      channel: 'canale',
    },
    tabs: {
      device: 'Per dispositivo',
      channel: 'Per canale',
    },
    label: 'Suddividi il funnel',
    table: 'Passaggi del funnel per segmento',
    segment: 'Segmento',
    step: 'Passaggio {number}',
    conversion: 'Complessiva',
    unknown: 'Sconosciuto',
    empty: 'Nessuna visita ha raggiunto il primo passaggio in questo periodo.',
    userMode:
      'In modalità Per persona, dispositivo e canale non sono definiti: passa a Per visita per suddividere il funnel.',
  },
  exports: {
    download: 'Scarica CSV',
    asCsv: '{label} in CSV',
    overview: {
      daily: 'Attività al giorno',
      pages: 'Pagine principali',
      events: 'Eventi principali',
    },
    acquisition: {
      sources: 'Sorgenti',
      campaigns: 'Campagne',
      channels: 'Visite per canale',
    },
    devices: 'Tipi di dispositivo, browser, sistemi, paesi, regioni e città',
    features: {
      events: 'Eventi',
      screens: 'Schermate',
    },
    requests: {
      writes: 'Scritture',
      reads: 'Letture fallite',
    },
    visits: 'Le {visits} visite più recenti',
  },
  landing: {
    meta: {
      title: 'Cosa converte e cosa fallisce sul tuo sito, senza cookie · Pyxis',
      descriptionFree:
        'Analisi di prodotto che mostra a quale passaggio del funnel le persone si fermano e quali richieste del tuo sito sono fallite, nella dashboard o in Claude. Senza cookie, senza IP, senza dati personali. Gratis fino a {events} eventi al mese.',
      description:
        'Analisi di prodotto che mostra a quale passaggio del funnel le persone si fermano e quali richieste del tuo sito sono fallite, nella dashboard o in Claude. Senza cookie, senza IP, senza dati personali. 14 giorni gratis.',
    },
    nav: {
      label: 'Principale',
      menu: 'Menu',
      demo: 'Demo live',
      privacy: 'Privacy',
      claude: 'Chiedi a Claude',
      install: 'Installazione',
      pricing: 'Prezzi',
      language: 'Lingua',
      signIn: 'Accedi',
    },
    hero: {
      eyebrow: 'Senza cookie · senza IP · connettore per Claude',
      title: 'Scopri cosa converte e cosa fallisce sul tuo sito, senza raccogliere dati personali.',
      lead: 'Pyxis mostra a quale passaggio del funnel le persone si fermano e quali richieste del tuo sito sono fallite in ogni visita. Guardalo nella dashboard o chiedi a Claude.',
      openDemo: 'Apri la demo live',
      seePricing: 'Guarda i prezzi',
      note: 'Nessuna registrazione. Dati inventati. Si apre direttamente sulla dashboard.',
      startFree: 'Inizia gratis',
      seePaidPlan: 'Vedi il piano a pagamento',
      freeNote:
        'Gratis fino a {events} eventi al mese su un sito, senza carta. La demo si apre senza registrazione.',
      freeFullNote:
        'Il piano gratuito è pieno per ora: registrati e il tuo account aspetta un posto, oppure abbonati al piano a pagamento.',
      trialNote:
        '14 giorni gratis; la carta viene addebitata solo il quindicesimo giorno. La demo si apre senza registrazione.',
      claudeTag: 'Nella directory di Claude',
      claude: 'Chiedi a Claude dei tuoi numeri',
    },
    forWhom: {
      eyebrow: 'Per chi è',
      title: 'Per chi ha bisogno di sapere dove le persone si fermano',
      lead: 'La stessa dashboard, tre modi di usarla.',
      store: {
        title: 'Negozio o attività online',
        body: 'Quante persone iniziano un ordine e a quale passaggio rinunciano: carrello, spedizione o pagamento. Diviso tra mobile e desktop, e per provenienza della visita.',
        link: 'Vedi un funnel nella demo',
      },
      agency: {
        title: 'Sviluppatore o agenzia',
        body: 'Installalo sui siti dei tuoi clienti e dai a ogni cliente accesso solo al suo progetto, con un codice via e-mail per entrare. Fino a 3 siti e 3 persone per account; per averne di più, un piano su misura.',
        link: 'Guarda i prezzi',
      },
      product: {
        title: 'Prodotto o SaaS',
        body: 'Quali funzionalità vengono usate, dove la registrazione perde persone e quali rotte della tua API falliscono, senza cookie sui tuoi utenti.',
        link: 'Vedi le schermate della dashboard',
      },
      install:
        'Non programmi? L’installazione può farla un agente di IA, chi ha creato il tuo sito o un’agenzia. <link>Come installare</link>',
    },
    preview: {
      label: 'Anteprima della schermata Panoramica',
      range: 'Ultimi 30 giorni',
      current: 'Questo periodo',
      previous: 'Periodo precedente',
      dropOff: 'Abbandono maggiore nel funnel',
      failingWrite: 'Scrittura che fallisce più spesso',
      failed: '{share} fallite',
      invented: 'Dati inventati, come nella demo live.',
    },
    proof: {
      size: { value: 'meno di 5 KB', label: 'di codice di Pyxis, compresso con gzip' },
      dependencies: { value: '0', label: 'dipendenze a runtime' },
      coverage: { value: '100%', label: 'copertura dei test in tutti e quattro i repository' },
      license: { value: 'MIT', label: 'licenza, infrastruttura inclusa' },
    },
    never: {
      eyebrow: 'Privacy',
      title: 'Cosa non viene mai salvato',
      raw: 'Un tag comune invierebbe:',
      kept: 'Cosa resta:',
      lead: 'Cinque cose che un comune tag di analisi invierebbe, e cosa resta di ognuna. Il browser taglia per primo; l’API ricontrolla prima che qualcosa arrivi al database.',
      rows: {
        address: {
          label: 'Indirizzo della pagina',
          where: 'Nel browser',
          raw: 'https://negozio.example/ordini/48213?email=giulia@example.com&utm_source=news',
          kept: '/ordini/:id · utm_source=news',
        },
        ip: {
          label: 'Indirizzo IP',
          where:
            'Nell’API: paese e regione, e la città solo se il sito l’ha attivata; poi l’indirizzo viene scartato.',
          raw: '203.0.113.7',
          kept: 'BR · BR-BA',
        },
        browser: {
          label: 'Browser',
          where: 'Nell’API: classificato, poi scartato',
          raw: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36',
          kept: 'desktop · Chrome · Windows',
        },
        property: {
          label: 'Proprietà dell’evento',
          where:
            'Nell’API: tutto ciò che ha la forma di un’email, di un numero di telefono o di un codice fiscale',
          raw: '"coupon": "giulia@example.com"',
          kept: 'scartata',
        },
        visit: {
          label: 'Visita',
          where: 'Nel browser: nessun cookie, niente che colleghi due schede',
          raw: 'cookie: visitor_id=8f2c41d0…; Max-Age=34560000',
          kept: 'sessionStorage · finisce con la scheda',
        },
      },
      foot: 'Un browser che chiede di non essere tracciato (Global Privacy Control o Do Not Track) spegne Pyxis prima che qualcosa venga messo in coda. Gli eventi vengono eliminati dopo 13 mesi.',
    },
    answers: {
      eyebrow: 'Dashboard',
      title: 'A cosa risponde la dashboard',
      lead: 'Otto schermate, ognuna costruita intorno a una domanda. Ogni scheda apre quella schermata nella demo live.',
      open: 'Apri nella demo',
      agent:
        'Preferisci chiedere? Collega Pyxis a Claude e leggerà gli stessi numeri, in sola lettura. <link>Come collegarlo</link>',
      questions: {
        overview:
          'Quante visite, conversioni e scritture fallite in questo periodo, rispetto al precedente?',
        acquisition: 'Quali canali, sorgenti e campagne portano visite che convertono?',
        devices: 'Da quali dispositivi, browser, paesi e regioni arrivano le visite?',
        features: 'Quali eventi e schermate vengono usati, e come si distribuisce una proprietà?',
        funnel: 'Dove una registrazione perde persone, e quanto dura ogni passaggio?',
        requests: 'Quali rotte della tua API falliscono, quanto spesso e quanto sono lente?',
        visits:
          'Quali visite hanno fatto una certa cosa, filtrate per pagina, evento, canale, dispositivo o errore?',
        timeline: 'Cosa ha fatto una visita, o una persona che ha effettuato l’accesso, in ordine?',
      },
    },
    askClaude: {
      eyebrow: 'Connettore MCP',
      title: 'Chiedi a Claude invece di scavare tra i grafici',
      lead: 'Collega Pyxis a Claude una volta e chiedi con parole tue: com’è andata la settimana scorsa, dove la registrazione perde persone, quale rotta ha iniziato a fallire. Claude legge gli stessi numeri della dashboard, tramite sedici strumenti in sola lettura. È incluso nel piano, senza costi aggiuntivi.',
      connect: 'Collegalo in un minuto',
      directory: {
        badge: 'Novità',
        title: 'Pyxis è nella directory dei connettori di Claude',
        body: 'Apri la pagina di Pyxis nella directory, scegli Connect e accedi a Pyxis nella finestra che si apre. Funziona in Claude sul web, sul computer e sul telefono.',
        open: 'Apri nella directory di Claude',
        or: 'Oppure aggiungilo come connettore personalizzato:',
      },
      example: {
        label: 'Una conversazione di esempio',
        you: 'Tu',
        claude: 'Claude',
        question: 'Com’è andata la settimana scorsa, e dove la registrazione perde persone?',
        used: 'Claude ha letto:',
        connected: 'MCP collegato',
        replay: 'Rivedi',
        answer:
          'Le visite sono cresciute del 12% rispetto alla settimana prima, e le conversioni dell’8%. La registrazione perde più persone tra il modulo e il codice via email: il 41% si ferma lì, e da telefono il 52%. Da computer quel passaggio perde il 23%.',
        invented: 'Conversazione e numeri inventati, come nella demo live.',
      },
      promises: {
        reads: {
          title: 'Solo lettura',
          body: 'Ognuno dei sedici strumenti è una lettura dell’API di Pyxis. Claude non può mai modificare né eliminare nulla.',
        },
        revoke: {
          title: 'Lo revochi tu',
          body: 'Ogni collegamento è elencato in Impostazioni, App collegate, e si ferma nel momento in cui lo revochi. Se resta inutilizzato per 90 giorni, termina da solo.',
        },
        personal: {
          title: 'Niente di personale da consegnare',
          body: 'Gli eventi non contengono cookie, indirizzi IP né user agent, quindi nemmeno quello che legge Claude.',
        },
      },
      foot: 'Ciò che Claude richiede passa dall’API di Pyxis ad Anthropic, che lo tratta secondo i propri termini. Cursor e gli altri client MCP si collegano con un token di accesso creato nelle Impostazioni. <link>La guida completa</link>',
    },
    report: {
      eyebrow: 'Report',
      title: 'Ogni lunedì, la settimana nella tua e-mail',
      lead: 'Visite, conversioni e scritture fallite rispetto alla settimana precedente, le pagine principali e le rotte che hanno fallito di più. Senza aprire la dashboard e senza chiedere a nessuno.',
      items: {
        digest: {
          title: 'Attivo per ogni admin del progetto',
          body: 'Arriva ogni lunedì, con la settimana chiusa nel fuso orario del tuo progetto e nella lingua in cui usi la dashboard. Contiene solo numeri sommati, niente di personale. Arriva anche una settimana senza visite, con la data dell’ultimo evento: è così che un’installazione rotta si nota senza aprire la dashboard. Si disattiva in Impostazioni.',
        },
        csv: {
          title: 'Un CSV per ogni schermata',
          body: 'Panoramica, Acquisizione, Dispositivi, Funzionalità, Richieste e Visite scaricano in CSV quello che mostrano, nel periodo scelto.',
        },
        export: {
          title: 'Tutti gli eventi, in un file',
          body: 'L’esportazione del progetto raccoglie tutto ciò che conserva in un CSV compresso. Il link arriva via e-mail in pochi minuti.',
        },
      },
      mail: {
        label: 'Un esempio dell’e-mail del riepilogo settimanale',
        kicker: 'Riepilogo settimanale',
        visits: 'Visite',
        identifiedUsers: 'Utenti identificati',
        convertingVisits: 'Visite con conversione',
        failedWrites: 'Scritture fallite',
        visitsPerDay: 'Visite al giorno',
        failingRoutes: 'Rotte con errori',
        openWeek: 'Apri la settimana nella dashboard',
        versusWeekBefore: '{change} rispetto alla settimana precedente ({previous})',
        unchangedFromWeekBefore:
          'nessuna variazione rispetto alla settimana precedente ({previous})',
        weekBeforeOnly: '{previous} la settimana precedente',
        shareOfVisits: '{share} delle visite',
        ofWrites: 'su {writes} scritture, {rate}',
        noWrites: 'nessuna scrittura',
        failedOf: 'fallite: {failed} su {total}',
      },
    },
    nudge: {
      label: 'Novità: Pyxis in Claude',
      badge: 'Novità',
      title: 'È arrivato l’accesso MCP!',
      tips: {
        agents:
          'Collega Claude e altri agenti AI ai tuoi numeri di Pyxis, tramite il Model Context Protocol.',
        ask: 'Chiedi “com’è andata la settimana scorsa?” e Claude legge i tuoi numeri.',
        connect: 'Un minuto per collegarlo. Legge soltanto, e lo revochi quando vuoi.',
        privacy: 'Claude vede gli stessi numeri della tua dashboard, e niente di personale.',
      },
      another: 'Un altro consiglio',
      cta: 'Scopri come collegarlo',
      dismiss: 'Chiudi',
    },
    install: {
      eyebrow: 'Installazione',
      title: 'Cosa aggiunge un sito',
      lead: 'Un pacchetto e due righe. Le visualizzazioni di pagina vengono registrate da sole; un evento con nome è una chiamata.',
      steps: {
        label: 'Come iniziare, in 3 passaggi',
        account: {
          title: 'Crea l’account e il progetto',
          bodyFree:
            'Nella dashboard, con un’e-mail e senza carta: il piano gratuito copre un sito. Il progetto arriva già con la sua chiave pubblica.',
          body: 'Nella dashboard, con un’e-mail e una carta: 14 giorni gratis. Il progetto arriva già con la sua chiave pubblica.',
        },
        install: {
          title: 'Installalo, da solo o con un agente di IA',
          body: 'Un pacchetto e due righe nel codice del sito, oppure una richiesta a Claude Code, a Cursor o a un altro agente.',
        },
        ask: {
          title: 'Chiedi',
          body: 'Apri la dashboard, oppure collega Claude e chiedi com’è andata la settimana e dove le persone si fermano.',
        },
      },
      copy: 'Copia',
      copied: 'Copiato',
      selected: 'Selezionato, premi Ctrl+C',
      note: 'Le chiavi vengono rilasciate da chi gestisce l’API, e oggi non c’è una registrazione pubblica. Tutti e quattro i repository sono con licenza MIT, infrastruttura AWS (Terraform) inclusa.',
      noteFree:
        'Le chiavi arrivano con il tuo account: inizia gratis qui sotto, oppure gestisci un tuo Pyxis. Tutti e quattro i repository sono con licenza MIT, infrastruttura AWS (Terraform) inclusa.',
      noteOpen:
        'Le chiavi arrivano con il tuo account: inizia la prova gratuita qui sotto, oppure gestisci un tuo Pyxis. Tutti e quattro i repository sono con licenza MIT, infrastruttura AWS (Terraform) inclusa.',
      requests:
        'Per vedere quali chiamate alla tua API falliscono, avvolgi una volta il tuo client HTTP con <code>trackRequest()</code>. <link>Vedi l’esempio</link>',
      agent: {
        title: 'Oppure chiedilo al tuo agente di IA',
        lead: 'Apri il repository del sito in Claude Code, in Cursor o in un altro agente e incolla:',
        prompt:
          'Installa Pyxis su questo sito seguendo https://pyxis-analytics.dev/llms.txt. La chiave pubblica del mio progetto è pyxis_pk_… e l’endpoint è https://api.pyxis-analytics.dev. Misura le pagine e registra un evento a ogni passo dell’ordine, senza alcun dato personale.',
        ready:
          'Dopo aver creato l’account e il progetto, la schermata Installazione della dashboard ha una richiesta come questa già pronta, con la chiave del tuo progetto al posto di <code>pyxis_pk_…</code>.',
        foot: 'L’agente segue le regole di <code>llms.txt</code>: nessun dato personale, nomi di evento validi, l’indirizzo dell’API nella CSP. Poi collega Claude a Pyxis per verificare che i primi eventi siano arrivati.',
        badge: 'Installa senza scrivere codice',
        agents: 'Funziona con agenti di programmazione come',
        others: 'e altri che leggono llms.txt',
        copyRequest: 'Copia la richiesta per l’agente',
        requestCopied: 'Richiesta copiata. Incollala nel tuo agente',
      },
    },
    public: {
      eyebrow: 'Ingegneria',
      title: 'Costruito in pubblico',
      production:
        'Misura siti reali da ottobre 2026, <bolsoverde>bolsoverde.com</bolsoverde> e <blog>il blog dell’autore</blog>, senza cookie su nessuno dei due.',
      items: {
        coverage:
          '100% di istruzioni, rami, funzioni e righe coperte in tutti e quattro i repository. La CI fallisce sotto quella soglia.',
        realServices:
          'Test di integrazione su un Postgres reale, e test end-to-end in un browser reale con controlli di accessibilità axe.',
        provenance:
          'Il codice di Pyxis che i siti installano è pubblicato su npm da GitHub Actions, con attestazione di provenienza.',
        decisions:
          'Decisioni messe per iscritto come architecture decision record in ogni repository.',
        storybook: 'Uno Storybook in cui ogni story è anche un test di accessibilità.',
      },
      storybook: 'Ogni componente della dashboard e i suoi stati',
      apiReference: 'Generato dagli schemi delle rotte stesse',
      playground: 'Il vero codice di Pyxis, che mostra ogni batch che invierebbe',
    },
    architecture: {
      eyebrow: 'Architettura',
      title: 'Come si incastrano i pezzi',
      site: { name: 'Il tuo sito', note: 'pyxis-analytics nel browser' },
      edge: { name: 'CloudFront', note: 'Davanti all’API' },
      api: { name: 'API', note: 'NestJS su AWS Lambda, a San Paolo' },
      database: {
        name: 'Postgres',
        note: 'Neon, con un ruolo che non può modificare lo schema',
      },
      dashboard: { name: 'Dashboard', note: 'Next.js su Vercel, legge l’API' },
      retention: { name: 'Job giornaliero', note: 'Elimina gli eventi dopo 13 mesi' },
      digest: { name: 'Riepilogo settimanale', note: 'Un’email ogni lunedì' },
    },
    comparison: {
      eyebrow: 'Confronto',
      title: 'Pyxis e un tipico tag basato sui cookie',
      aspect: 'Aspetto',
      typical: 'Tipico tag basato sui cookie',
      table: 'Tabella di confronto',
      rows: {
        cookie: {
          aspect: 'Cookie sui tuoi visitatori',
          pyxis: 'Nessuno',
          typical: 'Un cookie identificativo, di solito conservato per mesi',
        },
        address: {
          aspect: 'Indirizzo IP',
          pyxis: 'Letto per paese e regione, mai salvato',
          typical: 'Dipende dallo strumento e dalle sue impostazioni',
        },
        linking: {
          aspect: 'Collega le visite di un visitatore anonimo',
          pyxis: 'Mai: una visita è una scheda',
          typical: 'Sì, tramite il cookie',
        },
        thirdParties: {
          aspect: 'Terze parti',
          pyxis: 'Nessuna',
          typical: 'Dipende dallo strumento; a volte una rete pubblicitaria',
        },
        agents: {
          aspect: 'Chiedere a un agente AI dei numeri',
          pyxis: 'Sì: un connettore per Claude, in sola lettura',
          typical: 'Dipende dallo strumento',
        },
        failedRequests: {
          aspect: 'Le richieste del sito fallite, in ogni visita',
          pyxis: 'Sì: rotta, stato e durata',
          typical: 'Dipende dallo strumento',
        },
        trackerSize: {
          aspect: 'Dimensione del codice che il sito carica, compresso con gzip',
          pyxis: 'Meno di 5 KB',
          typical: 'In genere da 30 a 150 KB',
        },
        source: { aspect: 'Codice sorgente', pyxis: 'MIT, su GitHub', typical: 'Varia' },
      },
      foot: '“Tipico” descrive una configurazione comune, non un prodotto specifico.',
    },
    pricing: {
      eyebrow: 'Prezzi',
      title: 'Un solo piano, in real brasiliani, con tutto ciò che mostra la demo',
      titleFree: 'Due piani, in real brasiliani, con tutto ciò che mostra la demo in entrambi',
      paidName: 'A pagamento',
      paidHow:
        'Tutti iniziano dal piano gratuito: abbonati in Account e fatturazione, al mese o all’anno, con addebito immediato. Entro 7 giorni dal primo addebito puoi recedere e riavere l’intero importo.',
      freeOpenNote:
        'Registrati con un’e-mail e senza carta: la dashboard si apre subito, sul piano gratuito.',
      free: {
        name: 'Gratuito',
        price: 'R$ 0',
        note: 'Senza scadenza, finché il sito ci sta.',
        start: 'Inizia gratis',
        included: {
          events: 'Fino a {events} eventi al mese',
          sites: 'Un sito',
          people: 'Solo tu nella dashboard',
          history: '13 mesi di storico',
          digest: 'Un riepilogo settimanale via email',
          agents: 'Il connettore per Claude (MCP) e i token di accesso per agenti AI',
          pause:
            'La misurazione va in pausa a {events} eventi fino al giorno 1, con un’email all’80%',
          card: 'Senza carta',
        },
      },
      lead: 'Nessun costo per visitatore, per funzionalità o per persona identificata. Per i tuoi visitatori non cambia nulla: nessun cookie e nessun dato personale raccolto.',
      period: 'Periodo di fatturazione',
      monthly: 'Mensile',
      monthlyLabel: 'Mensile, R$ 39 al mese',
      yearly: 'Annuale',
      yearlyLabel: 'Annuale, R$ 390 all’anno, 2 mesi gratis',
      saving: '2 mesi gratis',
      monthlyPrice: 'R$ 39',
      perMonth: 'al mese',
      monthlyNote: 'oppure R$ 390 all’anno, con 2 mesi gratis',
      yearlyPrice: 'R$ 390',
      perYear: 'all’anno',
      yearlyNote: 'cioè R$ 32,50 al mese',
      approximateMonthly:
        'Prezzo in real brasiliani: circa {amount} al mese. La pagina di pagamento mostra l’importo esatto nella tua valuta.',
      approximateYearly:
        'Prezzo in real brasiliani: circa {amount} all’anno. La pagina di pagamento mostra l’importo esatto nella tua valuta.',
      included: {
        events: 'Fino a 100.000 eventi al mese',
        sites: 'Fino a 3 siti',
        people: 'Fino a 3 persone nella dashboard',
        history: '13 mesi di storico',
        digest: 'Un riepilogo settimanale via email',
        agents: 'Il connettore per Claude (MCP) e i token di accesso per agenti AI',
      },
      ask: 'Richiedi l’accesso',
      askTitle: 'Scrivi a',
      askIntro: 'In poche righe, indica:',
      askSite: 'l’indirizzo del sito, o dei siti, fino a 3;',
      askVisits: 'più o meno quante visite riceve al mese;',
      askEmail: 'l’email di chi accederà alla dashboard.',
      askReply:
        'La risposta contiene il link di pagamento. Dopo l’abbonamento, l’accesso alla dashboard arriva entro 2 giorni lavorativi.',
      askMail: 'Apri nella mia app di posta',
      mailSubject: 'Vorrei usare Pyxis',
      trial:
        '14 giorni gratis. La carta viene addebitata solo il quindicesimo giorno, e puoi annullare quando vuoi.',
      invite:
        'Per ora l’accesso è su invito: lo richiedi, ricevi il link di pagamento e, dopo l’abbonamento, ottieni l’accesso alla dashboard entro 2 giorni lavorativi.',
      moreTitle: 'Per agenzie e sviluppatori',
      moreFree:
        'Misura i siti dei tuoi clienti: ogni cliente entra con la propria e-mail e vede solo il suo progetto. Il piano a pagamento comprende fino a 3 siti e 3 persone, tu incluso. Per più clienti, scrivici quanti siti e persone a hello@pyxis-analytics.dev e rispondiamo entro 2 giorni lavorativi con un piano su misura.',
      more: 'Misura i siti dei tuoi clienti: ogni cliente entra con la propria e-mail e vede solo il suo progetto. Il piano comprende fino a 3 siti e 3 persone, tu incluso. Per più clienti, scrivici quanti siti e persone a hello@pyxis-analytics.dev e rispondiamo entro 2 giorni lavorativi con un piano su misura.',
      moreLink: 'Chiedi un piano per agenzie',
      moreSubject: 'Un piano Pyxis per agenzia',
      start: 'Inizia la prova gratuita',
      openNote:
        'Registrati con un’email e una carta; la dashboard si apre appena l’abbonamento è confermato.',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Le domande più frequenti',
      items: {
        cookies: {
          question: 'Pyxis imposta cookie sui miei visitatori?',
          answer:
            'No. L’ID di una visita vive nel <code>sessionStorage</code> della scheda e finisce quando la scheda si chiude. I cookie esistono solo nella dashboard di Pyxis, per le persone che la usano, mai sui siti che misura.',
        },
        address: {
          question: 'Salva gli indirizzi IP?',
          answer:
            'No. CloudFront comunica all’API il paese e la regione di ogni richiesta, e la città approssimativa solo in un progetto il cui proprietario l’ha attivata; l’indirizzo non viene mai scritto da nessuna parte.',
        },
        people: {
          question: 'Può capire che due visite vengono dalla stessa persona?',
          answer:
            'Solo per le persone che hanno effettuato l’accesso al tuo sito, tramite il tuo ID interno, mai un’email. Le visite anonime non vengono mai collegate: né tra schede, né tra giorni diversi.',
        },
        optOut: {
          question: 'Un visitatore può rifiutare la misurazione?',
          answer:
            'Global Privacy Control e Do Not Track spengono Pyxis, e un sito può offrire un proprio interruttore con <code>optOut()</code> e <code>trackingStatus()</code>.',
        },
        retention: {
          question: 'Per quanto tempo vengono conservati i dati?',
          answer:
            'Tredici mesi, poi un job giornaliero li elimina. Gli eventi di una persona possono essere esportati o cancellati dal tuo backend in qualsiasi momento.',
        },
        claude: {
          question: 'Posso chiedere a Claude dei miei numeri?',
          answer:
            'Sì. Pyxis è nella directory dei connettori di Claude: apri <code>claude.ai/directory/pyxis</code>, scegli Connect e accedi a Pyxis. In Claude Code, esegui <code>claude mcp add</code> con l’indirizzo <code>https://api.pyxis-analytics.dev/mcp</code>. Claude legge poi i numeri di tutti i progetti che puoi aprire, e non modifica nulla. Lo revochi in Impostazioni, App collegate.',
        },
        use: {
          question: 'Posso usarlo sul mio sito?',
          answer:
            'Sì, in due modi: esegui Pyxis sulla tua infrastruttura (il codice è su GitHub con licenza MIT) oppure abbonati al Pyxis ospitato. Per abbonarti, richiedi l’accesso a hello@pyxis-analytics.dev.',
          answerOpen:
            'Sì, in due modi: esegui Pyxis sulla tua infrastruttura (il codice è su GitHub con licenza MIT) oppure abbonati al Pyxis ospitato. Chiunque in Brasile può registrarsi con un’email e una carta: 14 giorni gratis, una volta per cliente, e annulli quando vuoi.',
          answerFree:
            'Sì, in due modi: esegui Pyxis sulla tua infrastruttura (il codice è su GitHub con licenza MIT) oppure usa il Pyxis ospitato. Chiunque in Brasile può registrarsi con un’email, senza carta, sul piano gratuito, e abbonarsi al piano a pagamento quando il sito ha bisogno di più.',
        },
        agency: {
          question: 'Posso usare Pyxis sui siti dei miei clienti?',
          answer:
            'Sì. Crea un progetto per sito e aggiungi il cliente alle persone del progetto: entra con un codice via e-mail e vede solo quel progetto. Il piano comprende fino a 3 siti e 3 persone, tu incluso; per di più, scrivi a hello@pyxis-analytics.dev. I <terms>Termini di utilizzo</terms> lo prevedono: misurare, come agenzia, i siti di clienti che l’hanno autorizzato non è rivendita.',
          answerFree:
            'Sì. Crea un progetto per sito e aggiungi il cliente alle persone del progetto: entra con un codice via e-mail e vede solo quel progetto. Il piano gratuito comprende un sito e solo te; il piano a pagamento fino a 3 siti e 3 persone, tu incluso; per di più, scrivi a hello@pyxis-analytics.dev. I <terms>Termini di utilizzo</terms> lo prevedono: misurare, come agenzia, i siti di clienti che l’hanno autorizzato non è rivendita.',
        },
        noCode: {
          question: 'Non programmo. Posso installarlo?',
          answer:
            'L’installazione è un pacchetto e due righe nel codice del sito, quindi qualcuno deve mettere mano a quel codice: tu con un agente di IA, chi ha creato il tuo sito o un’agenzia. Dopo, la dashboard e Claude non chiedono nessun codice.',
        },
        aiInstall: {
          question: 'Posso chiedere a un’IA di installarlo?',
          answer:
            'Sì. Apri il repository del sito in Claude Code, in Cursor o in un altro agente e chiedigli di installare Pyxis seguendo <code>https://pyxis-analytics.dev/llms.txt</code>, con la chiave pubblica del tuo progetto. L’agente aggiunge il pacchetto, l’<code>init</code> e gli eventi. Poi collega Claude a Pyxis per verificare che i primi eventi siano arrivati.',
        },
        price: {
          question: 'Quanto costa?',
          answer:
            'R$ 39 al mese o R$ 390 all’anno (due mesi gratis), con carta. Include fino a 100.000 eventi al mese, 3 siti, 3 persone nella dashboard, 13 mesi di storico, il riepilogo settimanale e il server MCP.',
          answerFree:
            'Entrambi i piani hanno tutte le funzioni: 13 mesi di storico, il riepilogo settimanale e il server MCP. Il piano gratuito non costa nulla e accetta fino a {events} eventi al mese, su un sito, con te solo nella dashboard. Il piano a pagamento costa R$ 39 al mese o R$ 390 all’anno (due mesi gratis), con carta, con addebito immediato, e accetta fino a 100.000 eventi al mese, 3 siti e 3 persone.',
        },
        trial: {
          question: 'Come funziona la prova gratuita?',
          answer:
            'Hai 14 giorni senza pagare, una volta per cliente. La carta viene richiesta all’inizio e addebitata solo il quindicesimo giorno; se annulli prima, non viene addebitato nulla.',
        },
        cancel: {
          question: 'Come annullo?',
          answer:
            'In qualsiasi momento, in due modi: annulla nel portale dell’abbonamento, e l’accesso dura fino alla fine del periodo pagato; oppure chiudi l’account nella dashboard, e l’accesso termina subito. Entro 7 giorni dal primo addebito, chiudere l’account rimborsa quell’addebito per intero; dopo, il periodo già pagato non viene rimborsato. I dati del progetto vengono eliminati 30 giorni dopo la fine dell’accesso.',
          answerOpen:
            'In qualsiasi momento, in due modi: annulla nel portale dell’abbonamento, e l’accesso dura fino alla fine del periodo pagato; oppure chiudi l’account nella dashboard, e l’accesso termina subito. Entro 7 giorni dal primo addebito, chiudere l’account rimborsa quell’addebito per intero; dopo, il periodo già pagato non viene rimborsato. I dati del progetto vengono eliminati 30 giorni dopo la fine dell’accesso. I <terms>Termini di utilizzo</terms> contengono i dettagli.',
          answerFree:
            'In qualsiasi momento, nel portale dell’abbonamento: il piano a pagamento dura fino alla fine del periodo già pagato, poi un account con un sito e una persona torna al piano gratuito; uno più grande termina, e i suoi dati vengono eliminati 30 giorni dopo. Entro 7 giorni dal primo addebito puoi recedere: l’addebito viene rimborsato per intero e l’account torna al piano gratuito se ci sta. Chiudere l’account nella dashboard termina tutto subito, con qualsiasi piano. I <terms>Termini di utilizzo</terms> contengono i dettagli.',
        },
        limit: {
          question: 'E se supero i 100.000 eventi?',
          answer:
            'Ricevi un’email all’80% e al 100% degli eventi del mese. Al 150%, l’account smette di accettare eventi fino al primo del mese successivo, e gli eventi inviati durante la pausa vanno persi. Non viene mai addebitato nulla oltre al prezzo.',
        },
        freeLimit: {
          question: 'E se arrivo a {events} eventi sul piano gratuito?',
          answer:
            'Sul piano gratuito, un’email avvisa all’80% degli eventi del mese. A {events}, l’account smette di accettare eventi fino al primo del mese successivo, e gli eventi inviati durante la pausa vanno persi. Abbonarsi al piano a pagamento toglie la pausa entro un minuto.',
        },
        payment: {
          question: 'Posso pagare con Pix, e c’è una fattura?',
          answer:
            'Per ora solo con carta; Pix per il piano annuale dipende dall’attivazione da parte di Stripe. Le fatture brasiliane (nota fiscal) non vengono ancora emesse: se te ne serve una, scrivici a {email} prima di abbonarti.',
        },
        support: {
          question: 'Come contatto l’assistenza?',
          answer:
            'Via email, a {email}, preferibilmente dall’email del tuo account. Nel piano a pagamento rispondiamo entro {paidDays} giorni lavorativi. Nel piano gratuito, le domande su installazione e uso passano dalle issue di GitHub e dalla documentazione; contratto, piano, limiti, fatturazione e dati personali restano via email, con risposta entro {freeDays} giorni. Per segnalare una falla di sicurezza, usa la segnalazione privata di GitHub.',
        },
      },
    },
    story: {
      eyebrow: 'La storia',
      title: 'Perché esiste Pyxis',
      body: 'L’articolo di presentazione spiega perché è stato creato e cosa non salva mai.',
      cta: 'Leggi l’articolo',
    },
    measurement: {
      measured:
        'Questa pagina è misurata da Pyxis stesso: nessun cookie, nessun indirizzo IP salvato.',
      see: 'Guarda cosa ha registrato',
      optOut: 'Non misurare le mie visite',
      off: 'La misurazione è disattivata in questo browser.',
      optIn: 'Misura di nuovo',
      blocked: 'La misurazione è disattivata dal “do not track” del tuo browser.',
    },
    recorded: {
      button: 'Cosa ha registrato questa pagina',
      title: 'Cosa ha registrato questa pagina',
      subtitle: 'Questa visita, in tempo reale. Inviata a Pyxis ogni 5 secondi.',
      visit: 'Visita {id}… · solo questa scheda',
      referrer: 'referrer: {host}',
      noReferrer: 'referrer: nessuno',
      empty: 'Ancora niente inviato. Il primo batch parte entro 5 secondi.',
      never:
        '<strong>Mai inviati:</strong> il tuo indirizzo IP, il nome completo del tuo browser, un cookie, l’indirizzo completo della pagina. <strong>Aggiunti dal server:</strong> paese, regione e città approssimativa, dalla richiesta; poi l’indirizzo viene scartato.',
      close: 'Chiudi',
    },
    footer: {
      tagline: 'Analisi di prodotto attenta alla privacy.',
      product: 'Prodotto',
      pricing: 'Prezzi',
      code: 'Codice',
      support: 'Assistenza',
      supportReply: 'Risposta entro {days} giorni lavorativi nel piano a pagamento.',
      questions: 'Domande su GitHub',
      securityReport: 'Segnala una falla di sicurezza',
      author: 'Autore: {site}',
      demo: 'Demo live',
      apiReference: 'Riferimento API',
      playground: 'Playground dell’SDK',
      madeBy: 'Realizzato da Samuel Santana · Licenza MIT',
      contract: 'Contratto',
      contractLanguage: 'Traduzioni di cortesia; prevale il testo portoghese.',
    },
  },
  legal: {
    documentsLabel: 'Documenti contrattuali',
    versionsLabel: 'Questo documento in altre lingue',
    terms: 'Termini di utilizzo',
    privacy: 'Informativa sulla privacy',
    agreement: 'Accordo sul trattamento dei dati',
    metaDescription: '{document} del Pyxis ospitato, versione {version}.',
    seller: 'Venduto da {name} · CPF {taxId} · {address} · {email}',
  },
});
