import { translation } from '../messages';

function forms<const One extends string, const Other extends string>(one: One, other: Other) {
  return { one, many: other, other } as const;
}

export const fr = translation({
  meta: {
    description:
      'Analytique produit respectueuse de la vie privée : aucun cookie chez vos visiteurs, aucune donnée personnelle, aucun tiers.',
    screenTitle: '{screen} · {project}',
    demoShareTitle: 'Démo en direct de {app}',
  },
  screens: {
    overview: 'Vue d’ensemble',
    funnel: 'Entonnoir',
    features: 'Fonctionnalités',
    requests: 'Requêtes',
    timeline: 'Chronologie',
    visits: 'Visites',
    devices: 'Appareils',
    acquisition: 'Acquisition',
    loading: 'Chargement de {screen}…',
  },
  nav: {
    label: 'Navigation principale',
    openMenu: 'Ouvrir le menu',
    openMenuWithNews: 'Ouvrir le menu, il y a du nouveau',
    arrivals: {
      visits: forms('{count} nouvelle visite', '{count} nouvelles visites'),
      conversions: forms('{count} nouvelle conversion', '{count} nouvelles conversions'),
      namedEvents: forms('{count} nouvel événement', '{count} nouveaux événements'),
      failedRequests: forms(
        '{count} nouvelle requête en échec',
        '{count} nouvelles requêtes en échec',
      ),
      manyVisits: 'Plus de 99 nouvelles visites',
      manyConversions: 'Plus de 99 nouvelles conversions',
      manyNamedEvents: 'Plus de 99 nouveaux événements',
      manyFailedRequests: 'Plus de 99 nouvelles requêtes en échec',
      refresh: 'Actualiser',
      refreshing: 'Actualisation…',
      onTheSiteNow: '{count} sur le site en ce moment',
      moreSinceLastRead: '{count} de plus depuis votre dernier passage',
      newVisit: 'Nouvelle',
    },
    closeMenu: 'Fermer le menu',
    section: 'Analytique',
    switchProject: 'Changer de projet. Projet actuel :',
    newProject: 'Nouveau projet',
    signOut: 'Se déconnecter',
    signOutEverywhere: 'Se déconnecter partout',
    signingOut: 'Déconnexion…',
    signOutFailed: 'La déconnexion a échoué. Réessayez.',
    projectSection: 'Projet',
    settings: 'Paramètres',
    account: 'Compte et préférences',
    language: 'Langue',
    billing: 'Compte et facturation',
  },
  theme: {
    switch: 'Changer de thème',
    toLight: 'Passer au thème clair',
    toDark: 'Passer au thème sombre',
    label: 'Thème',
    light: 'Clair',
    dark: 'Sombre',
    system: 'Système',
  },
  periodSelector: {
    label: 'Période',
    presets: {
      today: 'Aujourd’hui',
      '7d': '7 jours',
      '30d': '30 jours',
    },
    custom: 'Personnalisé',
    apply: 'Appliquer',
    applying: 'Mise à jour…',
    previousMonth: 'Mois précédent',
    nextMonth: 'Mois suivant',
    pickLastDay: 'À partir du {day} : choisissez maintenant le dernier jour.',
    chosenRange: '{range} · {days}',
    dayCount: forms('{count} jour', '{count} jours'),
    limit: 'Jusqu’à {days} jours, se terminant au plus tard aujourd’hui.',
  },
  signIn: {
    title: 'Se connecter à Pyxis',
    intro:
      'Nous vous envoyons par e-mail un code à {digits} chiffres. Aucun mot de passe à retenir.',
    sessionEnded: 'Votre session a pris fin. Reconnectez-vous pour continuer.',
    email: 'E-mail',
    emailPlaceholder: 'vous@entreprise.com',
    demoEmail:
      'Mode démo : aucun e-mail n’est envoyé. N’importe quelle adresse convient, puis utilisez le code <code/>.',
    sendCode: 'Envoyer le code',
    sending: 'Envoi…',
    checkTitle: 'Consultez vos e-mails',
    checkBody:
      'Si cette adresse peut se connecter à Pyxis, un code est en route. Il expire dans 10 minutes.',
    change: 'Modifier',
    changeEmail: 'Modifier l’e-mail',
    code: 'Code à {digits} chiffres',
    codeSent: 'Code envoyé.',
    demoCode: 'Mode démo : aucun e-mail n’est envoyé. Utilisez le code <code/>.',
    demoFill: 'Remplir {code}',
    verify: 'Vérifier et continuer',
    verifying: 'Vérification…',
    resend: 'Envoyer un nouveau code',
    resendIn: 'Envoyer un nouveau code dans {time}',
    resent: 'Nouveau code envoyé. Seul le dernier fonctionne.',
    errors: {
      invalidCode:
        'Code invalide ou expiré. Vérifiez le dernier e-mail ou envoyez un nouveau code.',
      rateLimited: 'Trop de tentatives depuis ce réseau. Patientez quelques minutes et réessayez.',
      unreachable: 'Impossible de joindre Pyxis. Vérifiez votre connexion et réessayez.',
    },
    validation: {
      emailMissing: 'Saisissez votre e-mail.',
      emailMalformed: 'Saisissez une adresse e-mail complète, comme vous@entreprise.com.',
      codeIncomplete: 'Saisissez les {digits} chiffres du code.',
    },
  },
  signInPage: {
    title: 'Connexion',
    privacy:
      'Analytique produit respectueuse de la vie privée · aucun cookie chez vos visiteurs, aucune donnée personnelle',
    noAccount:
      'Pas encore de compte ? <plans>Voir les formules</plans> ou <demo>ouvrir la démo</demo>, avec des données inventées.',
    noCode:
      '<strong>Rien après quelques minutes ?</strong> Cette adresse n’a peut-être pas encore de compte Pyxis.',
    seePlans: 'Voir les formules',
    startTrial: 'Essai gratuit de 14 jours',
  },
  errorPanel: {
    title: 'Impossible de charger ces données',
    body: 'Le tableau de bord n’a pas pu lire ces données. Réessayez dans un instant.',
    retry: 'Réessayer',
    detail: 'identifiant d’erreur {digest}',
  },
  notFound: {
    title: 'Page introuvable',
    outside:
      'Cette page n’existe pas, ou ce projet ne fait pas partie de ceux que vous pouvez consulter.',
    toProjects: 'Aller à vos projets',
    inProject: 'Il n’y a rien à cette adresse dans ce projet.',
    toOverview: 'Ouvrir la vue d’ensemble',
  },
  states: {
    loading: 'Chargement…',
    emptyPeriod: {
      title: 'Rien sur cette période',
      body: 'Aucun événement n’est arrivé sur cette période.',
      bodyWithLatest:
        'Aucun événement n’est arrivé sur cette période. Le dernier est arrivé le {date}.',
      widerPeriod: 'Voir les 30 derniers jours',
    },
    noActivity: {
      title: 'Aucun événement sur cette période pour l’instant',
      install:
        'Installez le SDK sur votre site : les premières pages vues apparaissent ici en moins d’une minute.',
      guide: 'Le guide d’installation complet se trouve dans le <readme>README du SDK</readme>.',
    },
    noConversionEvent:
      'Aucun événement de conversion n’est défini pour ce projet, donc les conversions ne sont pas affichées. L’opérateur en définit un avec la commande <code>project:update</code> de l’API et son option <code>--conversion-event</code>.',
    noProjects: {
      title: 'Aucun projet pour l’instant',
      body: '<email/> peut se connecter, mais aucun projet ne lui a encore été attribué. Demandez à l’opérateur de ce Pyxis d’exécuter <code>admin:grant</code> pour votre e-mail.',
      create: 'Créer votre premier projet',
      bodyOwner: 'Votre compte est prêt. Créez un projet pour votre site, puis installez-y Pyxis.',
      finish: 'Finaliser votre abonnement',
      bodyUnfinished:
        'Votre compte attend une formule. Finalisez l’abonnement pour créer des projets.',
    },
  },
  demo: {
    label: 'Avertissement de démo',
    notice:
      'Données de démonstration : des chiffres inventés pour deux produits imaginaires. Aucun vrai visiteur n’apparaît ici.',
    homePage: 'Qu’est-ce que Pyxis ?',
    projectNames: { store: 'Mon site', docs: 'Demo Docs' },
  },
  shell: {
    skipToContent: 'Aller au contenu',
    privacy: 'Aucun cookie, aucune donnée personnelle',
  },
  language: {
    label: 'Langue',
    current: 'Langue : {name}',
  },
  settings: {
    title: 'Paramètres',
    subtitle:
      'La configuration de {project} et les e-mails que vous recevez à son sujet. Les paramètres du projet se modifient en ligne de commande.',
    subtitleOwner:
      'La configuration de {project}, ses clés et les e-mails que vous recevez à son sujet.',
    subtitleMember:
      'La configuration de {project} et les e-mails que vous recevez à son sujet. Seul le propriétaire du compte modifie le projet.',
    project: {
      heading: 'Projet',
      name: 'Nom',
      timezone: 'Fuseau horaire',
      conversionEvent: 'Événement de conversion',
      noConversionEvent: 'Aucun, donc les conversions ne sont pas affichées',
      created: 'Créé',
      createdOn: 'Créé le {date}',
    },
    activity: {
      heading: 'Activité',
      firstEvent: 'Plus ancien événement conservé',
      latestEvent: 'Dernier événement',
      waiting: 'En attente du premier événement',
      install:
        'Installez le SDK avec une clé publique ci-dessous ; les pages vues depuis les origines autorisées apparaissent en moins d’une minute.',
    },
    origins: {
      heading: 'Origines autorisées',
      note: 'Seules les pages de ces origines peuvent envoyer des événements avec une clé publique.',
      none: 'Aucune origine n’est encore autorisée, donc aucune page ne peut envoyer d’événements.',
    },
    keys: {
      heading: 'Clés',
      public: 'Clés publiques',
      publicNote:
        'Une clé publique figure dans les pages de votre site : ce n’est donc pas un secret.',
      noLiveKey: 'Ce projet n’a aucune clé publique active, donc il ne mesure rien.',
      revokedForGood:
        'Une clé révoquée ne fonctionne plus jamais. Quand l’accès d’un compte prend fin, ses clés sont révoquées, et elles le restent si le compte revient.',
      createBelow:
        'Créez une clé publique ci-dessous, puis remplacez l’ancienne par celle-ci sur votre site.',
      createInSettings:
        'Créez une clé publique dans les <settings>Paramètres</settings>, puis remplacez l’ancienne par celle-ci sur votre site.',
      ownerOnly: 'Seul le propriétaire du compte peut en créer une.',
      secret: 'Clés secrètes',
      secretNote:
        'Une clé secrète permet au backend de votre site d’effacer et d’exporter les données d’une personne. Elle est stockée sous forme de hachage et n’est jamais affichée ici.',
      noSecretKey: 'Aucune clé secrète active.',
      created: 'Créée le {date}',
    },
    deletionHeld:
      'La suppression de ce projet est bloquée : il ne peut pas être supprimé tant que Pyxis n’a pas levé le blocage. Pour en savoir plus, écrivez à <mail>hello@pyxis-analytics.dev</mail>.',
    retention: {
      heading: 'Conservation des données',
      body: 'Les événements sont conservés {months} mois, puis une tâche quotidienne les supprime.',
    },
  },
  projectForm: {
    heading: 'Projet',
    name: 'Nom',
    origins: 'Origines autorisées',
    originsNote:
      'Seules les pages de ces origines peuvent envoyer des événements avec une clé publique. Indiquez le schéma, l’hôte et le port, comme https://shop.example.com ; {max} au maximum.',
    origin: 'Origine {number}',
    originPlaceholder: 'https://shop.example.com',
    conversionEventPlaceholder: 'signup_completed',
    addOrigin: 'Ajouter une origine',
    removeOrigin: 'Retirer l’origine {number}',
    timezone: 'Fuseau horaire',
    timezoneNote:
      'Les jours et les heures des rapports et du récapitulatif hebdomadaire le suivent.',
    conversionEvent: 'Événement de conversion',
    conversionEventNote:
      'Facultatif. L’événement qui compte comme une conversion, par exemple signup_completed.',
    save: 'Enregistrer',
    saving: 'Enregistrement…',
    saved: 'Enregistré',
    nameMissing: 'Donnez un nom au projet.',
    nameTooLong: 'Utilisez {max} caractères au maximum.',
    originsMissing: 'Indiquez au moins une origine.',
    originsInvalid:
      'Écrivez chaque origine sous la forme schéma, hôte et port, comme https://shop.example.com.',
    originsTooMany: 'Utilisez {max} origines au maximum.',
    timezoneInvalid: 'Choisissez un fuseau horaire dans la liste.',
    conversionEventInvalid:
      'Utilisez des lettres minuscules, des chiffres et des tirets bas, en commençant par une lettre.',
    invalid: 'Ces paramètres ont été refusés. Vérifiez les champs et réessayez.',
    subscriptionRequired:
      'Ce compte n’a pas d’abonnement en cours, donc ses projets ne peuvent pas être modifiés.',
    failed: 'Les modifications n’ont pas été enregistrées. Réessayez.',
  },
  projectKeys: {
    newPublic: 'Nouvelle clé publique',
    newSecret: 'Nouvelle clé secrète',
    creating: 'Création…',
    publicCreated: 'Clé publique créée. Placez-la dans vos pages, puis révoquez l’ancienne.',
    tooMany:
      'Ce projet a {max} clés actives de ce type, le maximum autorisé. Révoquez-en une d’abord.',
    revoke: 'Révoquer',
    revoking: 'Révocation…',
    revoked: 'Clé révoquée',
    onlyPublicKey:
      'L’unique clé publique est conservée, sinon le site ne pourrait plus envoyer d’événements.',
    lastPublicKey:
      'La dernière clé publique est conservée, sinon le site ne pourrait plus envoyer d’événements. Créez-en d’abord une autre.',
    subscriptionRequired:
      'Ce compte n’a pas d’abonnement en cours, donc ses clés ne peuvent pas être modifiées.',
    failed: 'Cela n’a pas fonctionné. Réessayez.',
    revealHeading: 'Copiez la clé secrète maintenant',
    revealNote:
      'Elle n’est affichée qu’une seule fois : Pyxis n’en conserve qu’un hachage. Gardez-la dans l’environnement de votre backend, jamais dans une page.',
    copy: 'Copier',
    copied: 'Copié',
    selected: 'Sélectionné, appuyez sur Ctrl+C',
    done: 'Terminé',
  },
  deleteProject: {
    heading: 'Supprimer le projet',
    note: 'Supprime définitivement {project}, ses événements et ses clés, et son site cesse immédiatement d’envoyer des événements. Cette action est irréversible.',
    confirm: 'Tapez {project} pour confirmer',
    delete: 'Supprimer définitivement le projet',
    deleting: 'Suppression…',
    nameMismatch: 'Le nom saisi n’est pas celui de ce projet.',
    failed: 'Le projet n’a pas été supprimé. Réessayez.',
    deletionOnHold:
      'Rien ne peut être supprimé dans ce compte tant que Pyxis en bloque la suppression. Écrivez à hello@pyxis-analytics.dev.',
  },
  people: {
    heading: 'Personnes',
    noteOwner:
      'Qui peut ouvrir ce projet. Chaque personne se connecte avec un code envoyé à son adresse e-mail. Le compte peut accueillir {max} personnes, vous compris.',
    note: 'Qui peut ouvrir ce projet.',
    owner: 'Propriétaire',
    member: 'Membre',
    you: '{email} (vous)',
    added: 'Ajouté le {date}',
    email: 'Adresse e-mail',
    emailPlaceholder: 'ana@example.com',
    add: 'Ajouter',
    adding: 'Ajout…',
    invited: '{email} a été ajouté et a reçu un e-mail expliquant comment se connecter.',
    alreadyThere: '{email} a déjà accès à ce projet.',
    emailMissing: 'Saisissez l’adresse e-mail de la personne à ajouter.',
    emailInvalid: 'Saisissez une adresse e-mail, comme ana@example.com.',
    limitReached:
      'Le compte réunit déjà {max} personnes, vous compris. Retirez quelqu’un pour en ajouter une autre.',
    subscriptionRequired:
      'Ce compte n’a pas d’abonnement en cours, donc personne ne peut être ajouté.',
    failed: 'Personne n’a été ajouté. Réessayez.',
    remove: 'Retirer',
    removing: 'Retrait…',
    removed: 'Retiré',
    ownerStays: 'Le propriétaire garde l’accès à tous les projets du compte.',
    removeFailed: 'Cette personne n’a pas été retirée. Réessayez.',
  },
  account: {
    title: 'Compte et facturation',
    back: 'Retour au tableau de bord',
    noAccount:
      'Vous n’êtes propriétaire d’aucun compte Pyxis. La facturation des projets que vous ouvrez revient à leur propriétaire.',
    plan: 'Formule',
    planWithInterval: 'Formule : {interval}',
    monthly: 'Mensuelle',
    yearly: 'Annuelle',
    status: {
      trialing:
        'Essai gratuit jusqu’au {date}. Ensuite, la formule est facturée, sauf si vous résiliez.',
      active: 'Actif. Renouvellement le {date}.',
      past_due:
        'Le dernier prélèvement a échoué. Stripe réessaie dans les jours qui viennent ; mettez à jour la carte pour continuer la mesure.',
      ending: 'Résilié. L’accès continue jusqu’au {date}, sans autre prélèvement.',
      ended:
        'Terminé le {date}. Les projets ne mesurent plus rien, et tout sera supprimé le {deletion}.',
      incomplete:
        'L’abonnement n’a pas été finalisé. Choisissez une formule pour démarrer l’essai gratuit.',
      comped: 'Un compte gratuit, offert par Pyxis.',
      trialingUndated: 'Essai gratuit. Ensuite, la formule est facturée, sauf si vous résiliez.',
      activeUndated: 'Actif.',
      endingUndated:
        'Résilié. L’accès continue jusqu’à la fin de la période, sans autre prélèvement.',
      endedUndated:
        'Terminé. Les projets ne mesurent plus rien, et tout sera supprimé trente jours après la fin.',
      endedHeld: 'Terminé le {date}. Les projets ne mesurent plus rien.',
      endedHeldUndated: 'Terminé. Les projets ne mesurent plus rien.',
    },
    usage: 'Événements ce mois-ci',
    usageCount: '{count} sur {limit}',
    measured: 'Mesuré le {date}.',
    notMeasured: 'Pas encore mesuré ce mois-ci.',
    paused:
      'La mesure est en pause jusqu’au {date} : le compte a utilisé 150 % de ses événements mensuels.',
    limits: 'Jusqu’à {projects} projets et {people} personnes, vous compris.',
    suspended:
      'Suspendu le {date}. Ses projets ne mesurent plus rien, et leurs écrans restent fermés jusqu’à la levée de la suspension.',
    suspensionReason: 'Motif : {reason}',
    contest: 'Pour la contester, écrivez à <mail>hello@pyxis-analytics.dev</mail>.',
    deletionHeld:
      'La suppression est bloquée : rien dans ce compte n’est supprimé tant que Pyxis n’a pas levé le blocage.',
    resubscribe:
      'Abonnez-vous à nouveau avant le {date} pour garder les données : il n’y a pas de nouvel essai gratuit, la formule est facturée dès aujourd’hui et les anciennes clés restent révoquées, donc chaque projet a besoin d’une nouvelle clé publique.',
    resubscribeUndated:
      'Abonnez-vous à nouveau pour garder les données : il n’y a pas de nouvel essai gratuit, la formule est facturée dès aujourd’hui et les anciennes clés restent révoquées, donc chaque projet a besoin d’une nouvelle clé publique.',
    exempt:
      'Jusqu’au {date}, la mesure n’est pas mise en pause en cas de dépassement de la limite mensuelle.',
    notice: {
      suspended: 'Ce compte est suspendu, donc ses projets ne mesurent plus rien.',
      why: 'Voir pourquoi',
      paymentFailed:
        'Le dernier prélèvement a échoué. Mettez à jour la carte pour continuer la mesure.',
      ending: 'Votre abonnement se termine le {date}.',
      ended: 'Votre abonnement est terminé. Tout sera supprimé le {date}.',
      endedHeld: 'Votre abonnement est terminé. La suppression de ses données est bloquée.',
      paused:
        'La mesure est en pause jusqu’au {date} : le compte a dépassé ses événements mensuels.',
      nearQuota: 'Ce mois-ci, le compte a utilisé {share} de ses événements.',
      open: 'Ouvrir la facturation',
    },
  },
  accountSuspended: {
    title: 'Ce compte est suspendu',
    explanation:
      'Le compte qui détient ce projet est suspendu : ses écrans restent fermés et ses sites ne sont plus mesurés jusqu’à la levée de la suspension.',
    owner:
      'Le propriétaire du compte trouve le motif, et comment le contester, dans Compte et facturation.',
    open: 'Ouvrir Compte et facturation',
  },
  projectIngestion: {
    label: 'État du projet',
    suspended:
      'Pyxis a suspendu la réception des événements de ce projet le {date}, donc il ne mesure plus rien. Ses écrans restent ouverts.',
    reason: 'Motif : {reason}',
    contest:
      'Pour contester cette suspension, le propriétaire du compte écrit à <mail>hello@pyxis-analytics.dev</mail>.',
  },
  billing: {
    subscribeAgain: 'Se réabonner',
    resubscribeUnavailable:
      'Le réabonnement n’est pas encore ouvert dans le tableau de bord. Écrivez à hello@pyxis-analytics.dev et nous réactiverons l’abonnement.',
    manage: 'Gérer la facturation',
    finish: 'Finaliser l’abonnement',
    opening: 'Ouverture de Stripe…',
    interval: 'Facturation',
    monthly: 'Mensuelle',
    yearly: 'Annuelle',
    noBillingYet: 'Il n’y a encore aucune facturation à gérer.',
    subscriptionExists: 'Ce compte a déjà un abonnement. Rechargez la page.',
    unavailable: 'La facturation n’est pas disponible pour le moment. Réessayez plus tard.',
    failed: 'Impossible d’ouvrir Stripe. Réessayez.',
  },
  exportEvents: {
    heading: 'Exporter les événements',
    note: 'Tous les événements conservés par ce projet, dans un fichier CSV compressé. Cela prend quelques minutes : vous recevez un e-mail avec le lien, et le fichier est conservé {days} jours. Jusqu’à {max} exports par jour.',
    request: 'Exporter les événements',
    requesting: 'Demande…',
    requested: 'Le fichier est en préparation. Vous recevrez un e-mail quand il sera prêt.',
    alreadyWaiting: 'Un export de ce projet est déjà en préparation.',
    open: 'Ouvrir l’export',
    limitReached:
      'Vous avez demandé {max} exports de ce projet aujourd’hui, le maximum par jour. Réessayez demain.',
    unavailable: 'Les exports ne sont pas disponibles pour le moment. Réessayez plus tard.',
    failed: 'L’export n’a pas été demandé. Réessayez.',
  },
  exportPage: {
    title: 'Export',
    subtitle: 'Les événements de {project}, dans un fichier CSV compressé.',
    pending: 'Préparation du fichier…',
    pendingNote:
      'Cette page se met à jour automatiquement, à quelques secondes d’intervalle, et vous recevez aussi un e-mail quand le fichier est prêt.',
    done: '{count} événements, disponibles jusqu’au {date}.',
    download: 'Télécharger le fichier',
    downloadNote: 'Chaque téléchargement demande un nouveau lien, valable cinq minutes.',
    expired:
      'Le fichier a été supprimé le {date}, une semaine après sa mise à disposition. Demandez-en un autre dans les Paramètres.',
    gone: 'Le fichier n’est plus disponible. Demandez-en un autre dans les Paramètres.',
    failed: 'L’export a échoué. Demandez-en un autre dans les Paramètres.',
    settings: 'Ouvrir les Paramètres',
    requestedAt: 'Demandé le {date}',
  },
  closeAccount: {
    heading: 'Fermer le compte',
    note: 'Résilie l’abonnement immédiatement et révoque les clés de tous les projets : les sites cessent d’envoyer des événements. Tout est supprimé trente jours plus tard ; exportez d’abord ce dont vous avez besoin.',
    refundNote:
      'Un premier paiement effectué au cours des sept derniers jours est intégralement remboursé. Sinon, rien n’est remboursé.',
    confirm: 'Tapez votre adresse e-mail pour confirmer',
    close: 'Fermer définitivement le compte',
    closing: 'Fermeture…',
    closed: 'Le compte est fermé. Tout sera supprimé le {date}.',
    refunded: '{amount} ont été remboursés sur votre carte.',
    confirmationMismatch: 'Ce n’est pas votre adresse e-mail : rien n’a été fermé.',
    alreadyEnded: 'L’accès de ce compte a déjà pris fin.',
    unavailable:
      'Stripe n’a pas pu résilier l’abonnement, donc rien n’a été fermé. Réessayez plus tard.',
    failed: 'Le compte n’a pas été fermé. Réessayez.',
  },
  newProject: {
    title: 'Nouveau projet',
    intro:
      'Un projet mesure un site. Son adresse devient la seule origine autorisée à envoyer des événements ; vous pourrez en ajouter d’autres plus tard dans les Paramètres.',
    name: 'Nom du projet',
    namePlaceholder: 'Ma boutique',
    site: 'Adresse du site',
    sitePlaceholder: 'https://shop.example.com',
    timezone: 'Fuseau horaire',
    conversionEvent: 'Événement de conversion (facultatif)',
    conversionEventPlaceholder: 'signup_completed',
    create: 'Créer le projet',
    creating: 'Création…',
    nameMissing: 'Donnez un nom au projet.',
    nameTooLong: 'Utilisez {max} caractères au maximum.',
    siteMissing: 'Saisissez l’adresse du site.',
    siteInvalid: 'Écrivez l’adresse sous la forme schéma et hôte, comme https://shop.example.com.',
    timezoneInvalid: 'Choisissez un fuseau horaire dans la liste.',
    conversionEventInvalid:
      'Utilisez des lettres minuscules, des chiffres et des tirets bas, en commençant par une lettre.',
    limitReached:
      'Le compte a déjà ses {max} projets. Supprimez-en un dans ses Paramètres pour en créer un autre.',
    subscriptionRequired:
      'Ce compte n’a pas d’abonnement en cours, donc il ne peut pas créer de projets.',
    invalid: 'Ces paramètres ont été refusés. Vérifiez les champs et réessayez.',
    failed: 'Le projet n’a pas été créé. Réessayez.',
    noAccount:
      'Seul le propriétaire d’un compte avec un abonnement en cours peut créer des projets.',
    back: 'Retour au tableau de bord',
  },
  install: {
    title: 'Installation',
    subtitle: 'Envoyez les premiers événements de {project}.',
    step1: '1. Installez Pyxis sur votre site',
    npm: 'Avec un bundler (npm) :',
    script: 'Ou en HTML simple, avant la balise body fermante :',
    step2: '2. Ouvrez une page de votre site',
    step2Note:
      'Les pages vues depuis {origin} apparaissent ici en moins d’une minute. Les bloqueurs de publicité peuvent les arrêter ; essayez une fenêtre de navigation privée.',
    waiting: 'En attente du premier événement…',
    waitingNote: 'Cette page se met à jour automatiquement, à quelques secondes d’intervalle.',
    received: 'Le premier événement est arrivé.',
    open: 'Ouvrir le tableau de bord',
    copy: 'Copier',
    copied: 'Copié',
    selected: 'Sélectionné, appuyez sur Ctrl+C',
    privacy:
      'Pyxis ne dépose aucun cookie chez vos visiteurs et ne stocke ni adresse IP ni donnée personnelle. Indiquez dans votre politique de confidentialité que le site mesure son utilisation avec Pyxis.',
    how: 'Comment installer',
    yourself: 'Vous-même',
    withAgent: 'Avec un agent IA',
    agent: {
      lead: 'Ouvrez le dépôt du site dans Claude Code, dans Cursor ou dans un autre agent de code et collez cette demande. Elle contient déjà la clé publique et l’adresse de ce projet.',
      prompt:
        'Installez Pyxis sur ce site en suivant {recipe}. La clé publique du projet est {key}, l’endpoint est {endpoint} et le site se trouve à l’adresse {origin}. Mesurez les pages et enregistrez un événement à chaque action importante, sans aucune donnée personnelle. À la fin, listez les fichiers que vous avez modifiés et chaque événement que vous avez créé, avec son nom et ses propriétés, pour que je les relise.',
      promptAnySite:
        'Installez Pyxis sur ce site en suivant {recipe}. La clé publique du projet est {key} et l’endpoint est {endpoint}. Mesurez les pages et enregistrez un événement à chaque action importante, sans aucune donnée personnelle. À la fin, listez les fichiers que vous avez modifiés et chaque événement que vous avez créé, avec son nom et ses propriétés, pour que je les relise.',
      steps: {
        open: 'Ouvrez le dépôt de votre site dans Claude Code, dans Cursor ou dans un autre agent de code.',
        paste: 'Collez la demande ci-dessus et laissez l’agent travailler.',
        review:
          'Relisez ce qu’il a modifié : le paquet, l’<code>init</code> et les événements qu’il liste. Retirez ou renommez ce que vous ne voulez pas.',
        publish:
          'Publiez le site et ouvrez une de ses pages. L’étape 2, ci-dessous, indique quand le premier événement arrive.',
      },
      changes: {
        title: 'Ce que l’agent va modifier',
        package:
          '<code>package.json</code> : le paquet <code>pyxis-analytics</code>, sans aucune autre dépendance.',
        init: 'Un fichier qui s’exécute dans le navigateur sur chaque page : l’<code>init</code> avec votre clé.',
        track:
          'Un appel à <code>track</code> à chaque action importante, une fois qu’elle a réussi.',
        csp: 'La politique de sécurité (CSP), si le site en a une, avec l’adresse de l’API.',
        only: 'L’agent ne modifie que le code du site. Il n’écrit rien dans Pyxis.',
      },
      rules:
        'L’agent suit les règles de <code>llms.txt</code> : aucune donnée personnelle, des noms d’événement valides, l’adresse de l’API dans la CSP.',
    },
    step3: '3. Vérifiez avec Claude (facultatif)',
    claude: {
      body: 'Connectez Claude à Pyxis et demandez-lui si les premiers événements sont arrivés. Il lit les mêmes chiffres que ce tableau de bord, ne modifie jamais rien, et vous révoquez la connexion quand vous voulez, dans <settings>Paramètres</settings>.',
      connect:
        'Dans Claude, ouvrez <code>claude.ai/directory/pyxis</code> et choisissez Connect. Dans Claude Code, exécutez cette commande, puis /mcp pour vous connecter :',
      allow: 'Au moment de la connexion, un écran de Pyxis vous demande de l’autoriser.',
    },
    ask: {
      lead: 'Vous avez déjà connecté Claude ? Demandez-lui :',
      question: 'Combien de visites sur {project} aujourd’hui, et d’où venaient-elles ?',
    },
    phone: {
      copy: 'Copier l’adresse',
      title: 'L’installation se fait sur un ordinateur',
      body: 'Pyxis s’ajoute au code de votre site. Ouvrez cette page sur un ordinateur, ou copiez son adresse et envoyez-la à la personne qui s’occupe du site.',
    },
  },
  signUp: {
    title: 'Démarrez votre essai gratuit',
    intro:
      '{days} jours gratuits, puis la formule de votre choix. Aucun prélèvement si vous résiliez pendant l’essai.',
    oneTrial: 'Un seul essai gratuit par client.',
    plan: 'Formule',
    monthly: 'Mensuelle',
    yearly: 'Annuelle',
    email: 'E-mail',
    emailPlaceholder: 'vous@entreprise.com',
    terms:
      'J’ai lu et j’accepte les <link>Conditions d’utilisation, l’Accord de traitement des données et la Politique de confidentialité</link> (version {version}).',
    termsMissing: 'Acceptez les conditions pour continuer.',
    sendCode: 'Envoyer le code',
    sending: 'Envoi…',
    checkTitle: 'Consultez vos e-mails',
    checkBody: 'Nous avons envoyé un code à {digits} chiffres. Il expire dans 10 minutes.',
    code: 'Code à {digits} chiffres',
    change: 'Modifier',
    changeEmail: 'Modifier l’e-mail',
    verify: 'Continuer',
    verifying: 'Vérification…',
    resend: 'Envoyer un nouveau code',
    resendIn: 'Envoyer un nouveau code dans {time}',
    resent: 'Un nouveau code est en route.',
    preparing: 'Préparation du paiement…',
    invalidCode: 'Ce code est erroné ou expiré. Vérifiez-le, ou demandez-en un nouveau.',
    termsOutdated:
      'Les conditions ont changé pendant que cette page était ouverte. Lisez la nouvelle version et acceptez-la à nouveau.',
    closed: 'Les inscriptions ont fermé pendant que cette page était ouverte.',
    rateLimited:
      'Trop de tentatives depuis cette adresse. Patientez quelques minutes et réessayez.',
    unreachable: 'Impossible de joindre Pyxis. Réessayez.',
    checkoutFailed:
      'Votre compte est prêt, mais la page de paiement ne s’est pas ouverte. Finalisez le paiement dans Compte et facturation.',
    openAccount: 'Ouvrir Compte et facturation',
    demoCode: 'Ceci est la démo : le code est <code/>.',
    demoFill: 'Utiliser {code}',
    haveAccount: 'Vous avez déjà un compte ?',
    signIn: 'Se connecter',
    finishTitle: 'Finalisez votre abonnement',
    finishBody: 'Votre compte attend une formule. Choisissez-en une pour démarrer l’essai gratuit.',
  },
  signUpPage: {
    title: 'Inscription',
    closedTitle: 'Les inscriptions ne sont pas encore ouvertes',
    closedBody:
      'Pour l’instant, Pyxis est accessible sur invitation. Écrivez à hello@pyxis-analytics.dev, ou essayez la démo en direct.',
    demo: 'Ouvrir la démo en direct',
    home: 'Retour à l’accueil',
  },
  welcome: {
    activeAgain: 'Votre abonnement est de nouveau actif.',
    nextAgain:
      'Vos projets mesureront à nouveau dès que leurs sites utiliseront une nouvelle clé publique : créez-en une dans les Paramètres de chaque projet.',
    title: 'Bienvenue dans Pyxis',
    confirming: 'Confirmation de votre abonnement…',
    confirmingNote:
      'Cela prend quelques secondes et la page se met à jour toute seule. Si c’est plus long, vous recevrez un e-mail une fois l’opération terminée.',
    trial: 'Votre essai gratuit a commencé. Il dure jusqu’au {date}.',
    active: 'Votre abonnement est confirmé.',
    next: 'Ensuite, créez un projet pour votre site et installez-y Pyxis.',
    create: 'Créer votre premier projet',
    dashboard: 'Ouvrir le tableau de bord',
  },
  emailPreferences: {
    heading: 'E-mail',
    weeklyDigest: 'Récapitulatif hebdomadaire',
    weeklyDigestNote:
      'Chaque lundi, la semaine close le dimanche dans le fuseau {timezone} : visites, conversions, écritures en échec, pages et événements principaux. Chaque admin choisit pour lui-même.',
    on: 'Activé',
    off: 'Désactivé',
    saving: 'Enregistrement…',
    saved: 'Enregistré',
    failed: 'La modification n’a pas été enregistrée. Réessayez.',
  },
  connectedApps: {
    heading: 'Applications connectées',
    note: 'Les applications que vous avez autorisées à lire les chiffres de vos projets. Chacune ne fait que lire, sur tous les projets que vous pouvez ouvrir. Révoquez-la et elle s’arrête aussitôt ; l’application vous demandera de vous reconnecter.',
    empty: 'Aucune application connectée pour l’instant.',
    connected: 'Connectée',
    lastUsed: 'Dernière utilisation',
    connectHeading: 'Connecter Pyxis à Claude',
    stepOpen: 'Dans Claude, ouvrez Customize, puis Connectors, et choisissez Add custom connector.',
    stepAddress: 'Nommez-le Pyxis et collez cette adresse :',
    stepAllow:
      'Choisissez Connect, connectez-vous à Pyxis dans la fenêtre qui s’ouvre, puis choisissez Autoriser.',
    everywhere:
      'Cela fonctionne dans Claude sur le web, sur votre ordinateur et sur votre téléphone.',
    claudeCode: 'Dans Claude Code, exécutez cette commande, puis /mcp pour vous connecter :',
  },
  connections: {
    copy: 'Copier',
    copied: 'Copié',
    selected: 'Sélectionné, appuyez sur Ctrl+C',
    revoke: 'Révoquer',
    revoking: 'Révocation…',
    revoked: 'Application déconnectée',
    revokeFailed: 'L’application n’a pas été déconnectée. Réessayez.',
  },
  sessions: {
    heading: 'Sessions',
    note: 'Tous les appareils sur lesquels vous êtes connecté. Fermer une session déconnecte cet appareil à sa requête suivante.',
    thisDevice: 'Cet appareil',
    device: '{browser} sur {os}',
    unknownDevice: 'Navigateur inconnu',
    signedIn: 'Connexion',
    lastUsed: 'Dernière utilisation',
    end: 'Fermer',
    ending: 'Fermeture…',
    ended: 'Session fermée',
    failed: 'La session n’a pas été fermée. Réessayez.',
  },
  accessTokens: {
    heading: 'Jetons d’accès',
    note: 'Ils permettent à un agent IA ou à un script de lire les chiffres que vous voyez ici, sur tous les projets que vous pouvez ouvrir. Un jeton ne fait que lire : il ne modifie jamais rien, et il cesse de fonctionner dès que vous le révoquez.',
    name: 'Nom',
    namePlaceholder: 'Claude Code, Cursor…',
    nameMissing: 'Donnez un nom au jeton, pour le reconnaître plus tard.',
    nameTooLong: 'Utilisez {max} caractères au maximum.',
    lifetime: 'Expire dans',
    lifetime30: '30 jours',
    lifetime90: '90 jours',
    lifetime365: '1 an',
    create: 'Créer le jeton',
    creating: 'Création…',
    failed: 'Le jeton n’a pas été créé. Réessayez.',
    tooMany: 'Vous avez {max} jetons, le maximum autorisé. Révoquez-en un pour en créer un autre.',
    revealHeading: 'Copiez votre nouveau jeton maintenant',
    revealNote:
      'Il n’est affiché qu’une seule fois. Si vous le perdez, révoquez-le et créez-en un autre.',
    usage: 'Envoyez-le dans l’en-tête Authorization :',
    copy: 'Copier',
    copied: 'Copié',
    selected: 'Sélectionné, appuyez sur Ctrl+C',
    done: 'Terminé',
    empty: 'Aucun jeton pour l’instant.',
    created: 'Créé',
    lastUsed: 'Dernière utilisation',
    neverUsed: 'Jamais utilisé',
    expires: 'Expire',
    revoke: 'Révoquer',
    revoking: 'Révocation…',
    revoked: 'Jeton révoqué',
    revokeFailed: 'Le jeton n’a pas été révoqué. Réessayez.',
  },
  connect: {
    title: 'Connecter une application',
    heading: 'Connecter {app} à Pyxis ?',
    asks: '{app} ({host}) demande à lire les chiffres de vos projets.',
    signedInAs: 'Connecté en tant que {email}',
    accessHeading: 'Ce qu’elle peut faire',
    access:
      'Uniquement lire : les mêmes chiffres que dans ce tableau de bord, sur tous les projets que vous pouvez ouvrir. Elle ne modifie jamais rien.',
    projectsHeading: 'Vos projets',
    noProjects:
      'Vous n’avez encore aucun projet. Elle lira ceux que vous pourrez ouvrir plus tard.',
    dataHeading: 'Où vont les données',
    dataToCompany:
      'Les données que demande {app}, votre e-mail compris, sont transmises à {company}, aux États-Unis, qui les traite selon ses propres conditions. N’autorisez que si vous êtes d’accord.',
    dataToApp:
      'Les données que demande {app}, votre e-mail compris, sont transmises à l’entreprise qui l’édite ({host}), qui les traite selon ses propres conditions. N’autorisez que si vous êtes d’accord.',
    returnHeading: 'Où va cette fenêtre ensuite',
    returnTo: 'Retour à {host}.',
    loopback:
      'La réponse est transmise à un programme de cet ordinateur. N’autorisez que si vous venez de lancer la connexion dans {app} sur cet ordinateur.',
    notYou: 'Si vous n’avez pas lancé cette demande à l’instant dans {app}, choisissez Annuler.',
    revokeLater: 'Vous pouvez révoquer la connexion à tout moment dans les Paramètres.',
    goneHeading: 'Cette demande de connexion est terminée',
    back: 'Retour au tableau de bord',
  },
  consent: {
    allow: 'Autoriser',
    allowing: 'Autorisation…',
    cancel: 'Annuler',
    cancelling: 'Annulation…',
    leaving: 'Retour à {app}…',
    tooMany:
      'Vous avez déjà {max} applications connectées, le maximum autorisé. Révoquez-en une dans les <settings>Paramètres</settings> pour en connecter une autre.',
    failed: 'Rien n’a été envoyé. Réessayez.',
    gone: 'Elle a déjà reçu une réponse, ou plus de {minutes} minutes se sont écoulées. Retournez dans Claude et reconnectez Pyxis.',
  },
  chartPanel: {
    showAs: 'Afficher en',
    chart: 'Graphique',
    table: 'Tableau',
  },
  visitsLink: {
    purpose: ' : voir ses visites',
  },
  units: {
    points: '{points} pt',
  },
  counts: {
    visit: forms('{count} visite', '{count} visites'),
    matchingVisit: forms('{count} visite correspondante', '{count} visites correspondantes'),
    person: forms('{count} personne', '{count} personnes'),
    day: forms('{count} jour', '{count} jours'),
    page: forms('{count} page', '{count} pages'),
    event: forms('{count} événement', '{count} événements'),
    item: forms('{count} élément', '{count} éléments'),
    write: forms('{count} écriture', '{count} écritures'),
    request: forms('{count} requête', '{count} requêtes'),
    failure: forms('{count} échec', '{count} échecs'),
    failedRead: forms('{count} lecture en échec', '{count} lectures en échec'),
    failedRequest: forms('{count} requête en échec', '{count} requêtes en échec'),
    clientError: forms('{count} erreur client (4xx)', '{count} erreurs client (4xx)'),
    serverError: forms('{count} erreur serveur (5xx)', '{count} erreurs serveur (5xx)'),
    conversionEvent: forms('{count} événement de conversion', '{count} événements de conversion'),
  },
  period: {
    presets: {
      today: 'aujourd’hui',
      '7d': '7 derniers jours',
      '30d': '30 derniers jours',
    },
    rangeProblems: {
      notADate: 'l’une de ses dates n’existe pas dans le calendrier',
      inverted: 'elle se termine avant de commencer',
      future: 'elle se termine après aujourd’hui',
      tooLong: 'elle dépasse {days} jours',
    },
    rejectedRange:
      'Cette plage n’a pas été utilisée : {problem}. Affichage des {days} derniers jours à la place.',
  },
  glossary: {
    visit:
      'Une visite correspond à un onglet du navigateur, de son premier à son dernier événement ; deux onglets ne sont jamais reliés.',
    identifiedUser:
      'Un utilisateur identifié est un identifiant d’utilisateur distinct que le site a transmis à identify(), généralement quand quelqu’un se connecte ; une visite sans identifiant est anonyme.',
    conversion:
      'Une conversion est une visite qui a envoyé au moins une fois l’événement de conversion du projet ; les événements de conversion comptent chaque envoi.',
    write: 'Une écriture est un POST, PUT, PATCH ou DELETE envoyé avec trackRequest().',
    failure: 'Un échec est un statut supérieur ou égal à 400, ou une absence de réponse.',
    changeTone:
      'Une variation n’apparaît en vert ou en rouge que si la période précédente comptait au moins {base} et que l’écart atteint {change} ou plus ({points} points pour le taux d’erreur des écritures).',
  },
  metrics: {
    noChange: 'aucune variation',
  },
  overview: {
    subtitle: 'Comment {project} a été utilisé sur la période',
    kpiToggleHint: 'Trace ce chiffre par jour sur le graphique ci-dessous.',
    topPages: {
      title: 'Pages principales',
      empty: 'Aucune page vue sur cette période.',
      page: 'Page',
      views: 'Vues',
      visits: 'Visites',
      shareOfViews: 'Part des vues',
    },
    topEvents: {
      title: 'Événements principaux',
      empty:
        'Aucun événement nommé sur cette période. Les événements envoyés avec <code>track()</code> apparaissent ici.',
      inVisits: 'dans {visits}',
    },
    kpis: {
      visits: 'Visites',
      identifiedUsers: 'Utilisateurs identifiés',
      conversions: 'Conversions',
      writeErrorRate: 'Taux d’erreur des écritures',
    },
    notes: {
      identifiedUsers: 'connectés au moins une fois',
      writeErrors: '{failed} sur {writes} en échec',
      shareOfVisits: '{share} de {visits}',
      conversionEvents: '{event} · {share}',
      convertingVisits: '{share} ont envoyé {event} · {events}',
    },
    drillDowns: {
      visits: 'Voir les visites',
      identifiedVisits: 'Voir les visites identifiées',
      convertingVisits: 'Voir les visites avec conversion',
      failingRoutes: 'Voir les routes en échec',
    },
    spoken: {
      change: 'variation',
      better: 'en amélioration',
      worse: 'en dégradation',
    },
    comparison: {
      dayBefore: 'par rapport à la veille',
      previousDays: 'par rapport aux {days} jours précédents',
      soFarToday: 'aujourd’hui jusqu’ici par rapport à toute la journée d’hier',
      previousFullDays: 'par rapport aux {days} jours complets précédents',
      yesterdayUntil: 'par rapport à hier jusqu’à {time}',
      previousDaysUntil: 'par rapport aux {days} jours précédents, jusqu’à {time}',
    },
  },
  overviewChart: {
    activityTitle: 'Activité par jour',
    dayTitle: 'Activité de la journée',
    activitySubject: 'Pages vues et événements nommés',
    subjectInPeriod: '{subject}, {period}',
    previousPeriod: 'Période précédente',
    day: 'Jour',
    pageViews: 'Pages vues',
    namedEvents: 'Événements nommés',
    metricTitle: '{metric} par jour',
    gaps: {
      noValue: 'aucune valeur',
      noWrites: 'aucune écriture',
    },
    statistics: {
      noneOnAnyDay: '{gap}, quel que soit le jour',
      total: '{total} au total',
      range: 'entre {lowest} et {highest} par jour',
      gapDays: '{gap} sur {days}',
    },
    summary: {
      lineChart: 'Graphique en courbes sur {days}.',
      series: '{series} : {statistics}.',
      previous: 'En pointillés, la période précédente.',
    },
    caption: '{subject} par jour, {period}',
    captionWithPrevious: '{caption}, avec la période précédente',
    columns: {
      comparedWith: 'Comparé à',
      previous: '{series} (avant)',
    },
    point: '{series}, {day}',
  },
  acquisition: {
    subtitle: 'D’où viennent les visites de {project}',
    paidVisits: 'Visites payantes',
    footnote:
      'Un clic publicitaire est reconnu à l’identifiant de clic présent dans l’URL d’arrivée. Pyxis ne garde que le fait qu’il était là, jamais l’identifiant lui-même, et ne conserve que le domaine d’un site référent.',
    sources: {
      title: 'Sources',
      description:
        'La source de campagne, à défaut le site référent, de la première page de chaque visite',
      empty: 'Aucune visite avec une source sur cette période.',
      source: 'Source',
      medium: 'Support',
      visits: 'Visites',
    },
    channelChart: {
      title: 'Visites par canal',
      description: 'Toutes les visites selon le canal d’où elles viennent, {period}',
      caption: 'Visites par canal et par jour, {period}',
      day: 'Jour',
      total: 'Total',
    },
    channels: {
      paid: 'Payant',
      email: 'E-mail',
      social: 'Réseaux sociaux',
      campaign: 'Autres campagnes',
      organic: 'Recherche organique',
      referral: 'Site référent',
      direct: 'Direct',
    },
    directSource: 'Direct',
    adClickSource: '(clic publicitaire)',
    topChannel: 'Premier canal',
    topUnpaidChannel: 'Premier canal non payant',
    shareOfVisits: '{share} de {visits}',
    fromAdClicks: '{visits} via des clics publicitaires',
    conversionColumns: {
      conversions: 'Conversions',
      conversionRate: 'Taux de conversion',
      converted: '{conversions} avec conversion',
    },
    campaigns: {
      title: 'Campagnes',
      description:
        'Le tag de campagne (utm_campaign) de la première page de chaque visite, avec la source qui le portait ; les 20 qui ont apporté le plus de visites',
      empty: 'Aucune visite n’est arrivée avec un tag de campagne sur cette période.',
      campaign: 'Campagne',
      source: 'Source',
      visits: 'Visites',
      visitsLinkPurpose: ' : voir ses visites venues de {source}',
    },
    summary: {
      bars: 'Histogramme empilé sur {days},',
      range: 'entre {lowest} et {highest} visites par jour.',
      channels: 'Visites par canal : {channels}.',
      channel: '{channel} {visits}',
    },
  },
  devices: {
    types: {
      mobile: 'Mobile',
      desktop: 'Ordinateur',
      tablet: 'Tablette',
    },
    other: 'Autre',
    otherCountries: 'Autres pays',
    otherRegions: 'Autres régions',
    unknownRegion: 'Inconnue',
    convertedOfVisits: '{converted} sur {visits}',
    subtitle: 'Ce que les gens utilisent pour accéder à {project}',
    panels: {
      deviceType: 'Type d’appareil',
      browser: 'Navigateur',
      operatingSystem: 'Système d’exploitation',
    },
    columns: {
      country: 'Pays',
      region: 'Région',
      visits: 'Visites',
      share: 'Part',
      conversionRate: 'Taux de conversion',
    },
    countries: 'Pays',
    regions: 'Régions',
    conversionByDevice: {
      title: 'Conversion par appareil',
      description: 'Part des visites ayant envoyé <code/>',
    },
    footnote:
      'L’appareil, le navigateur et le système sont déduits côté serveur à partir du user agent du navigateur, qui est ensuite jeté. Le pays et la région viennent du réseau de périphérie, jamais d’une adresse IP stockée, et la ville n’est jamais enregistrée. Les visites plus anciennes n’ont que le pays.',
  },
  requests: {
    noResponse: 'Sans réponse',
    figures: {
      writes: 'Écritures',
      errorRate: 'Taux d’erreur des écritures',
      slowestRoute: 'Route la plus lente',
      failedReads: 'Lectures en échec',
      failingRoutes: 'Routes en échec',
    },
    notes: {
      writes: 'Appels POST, PUT, PATCH et DELETE depuis le navigateur',
      withNoResponse: '{count} sans réponse',
      noFailures: 'Aucun échec sur {writes}',
      failed: '{failed} en échec : {kinds}',
      noFailedRead: 'Aucune lecture en échec sur cette période',
      mostFailing: 'La plus touchée : {route}, {failures}',
      noWrites: 'Aucune écriture sur cette période',
      slowestMedian: 'médiane de {route}',
    },
    duration: '{milliseconds} ms',
    routeSummary: {
      reads: '{failedReads} · médiane {median}',
      writes: '{requests} · {errorShare} d’erreurs · médiane {median}',
    },
    failureDays: {
      title: 'Échecs par jour',
      description: {
        writes: 'Toutes les écritures en échec, selon ce qui n’a pas fonctionné, {period}',
        reads: 'Toutes les lectures en échec, selon ce qui n’a pas fonctionné, {period}',
      },
      classes: {
        clientError: 'Erreurs client (4xx)',
        serverError: 'Erreurs serveur (5xx)',
        noResponse: 'Sans réponse',
      },
      day: 'Jour',
      total: 'Total',
      caption: 'Échecs par jour selon ce qui n’a pas fonctionné, {period}',
      none: 'Rien n’a échoué sur cette période.',
      summary: {
        bars: 'Histogramme empilé sur {days},',
        range: 'entre {lowest} et {highest} échecs par jour.',
        classes: 'Selon ce qui n’a pas fonctionné : {classes}.',
        class: '{label} {count}',
      },
    },
    routeDays: {
      heading: 'Jour par jour',
      loading: 'Chargement des jours de cette route…',
      failed: 'Impossible de charger les jours de cette route.',
      retry: 'Réessayer',
      unavailable:
        'Les chiffres jour par jour nécessitent une version plus récente de l’API Pyxis.',
      none: {
        writes: 'Aucun appel à cette route sur cette période.',
        reads: 'Aucune lecture en échec de cette route sur cette période.',
      },
      quietDays: {
        writes: forms(
          '{count} jour sans appel n’est pas listé.',
          '{count} jours sans appel ne sont pas listés.',
        ),
        reads: forms(
          '{count} jour sans lecture en échec n’est pas listé.',
          '{count} jours sans lecture en échec ne sont pas listés.',
        ),
      },
      columns: {
        day: 'Jour',
        total: 'Total',
        failed: 'En échec',
        median: 'Médiane',
        p95: 'p95',
      },
    },
    page: {
      subtitle: {
        writes: 'Toutes les écritures effectuées par {project}, et leur issue',
        reads: 'Les lectures effectuées par {project} qui ont échoué',
      },
      kinds: {
        label: 'Type de requête',
        writes: 'Écritures',
        reads: 'Lectures en échec',
      },
      readsNeedApi: {
        title: 'Les lectures en échec nécessitent une version plus récente de l’API Pyxis',
        body: 'Cette API ne rapporte que les écritures. Mettez à jour pyxis-api pour lister les appels GET en échec ; les écritures se trouvent dans l’onglet Écritures.',
      },
      empty: {
        reads:
          'Aucune lecture en échec sur cette période. Les appels GET envoyés avec trackRequest() apparaissent ici quand ils échouent.',
        readsFromScreen: 'Aucune lecture en échec depuis {screen} sur cette période.',
        writesFromScreen: 'Aucune écriture depuis {screen} sur cette période.',
        failing: 'Aucune route n’a échoué sur cette période.',
        writes:
          'Aucune écriture sur cette période. Les appels envoyés avec trackRequest() apparaissent ici.',
      },
      footnote: {
        ownTab:
          'Les lectures en échec ont leur propre onglet ; Visites et Chronologie comptent ensemble les lectures et les écritures en échec.',
        failedRead:
          'Une lecture en échec est un GET envoyé avec trackRequest() qui a répondu 400 ou plus, ou n’a jamais répondu. Un site peut n’envoyer ses lectures que lorsqu’elles échouent, donc les lectures n’ont pas de taux d’erreur. Visites et Chronologie comptent ensemble les lectures et les écritures en échec.',
        source: 'Seul le modèle de route est conservé, jamais les valeurs de l’URL ni le corps.',
      },
    },
    filters: {
      label: 'Afficher',
      all: 'Toutes les routes',
      failingOnly: 'En échec uniquement',
      fromScreen: 'Depuis l’écran <screen/>',
      clearScreen: 'Effacer le filtre d’écran',
      clear: 'Effacer',
      hint: 'Sélectionnez une route pour voir ses codes de statut, les écrans où elle a échoué et ses derniers échecs.',
    },
    table: {
      heading: 'Routes',
      columns: {
        route: 'Route',
        total: 'Total',
        failed: 'En échec',
        outcomes: 'Succès · erreurs',
        statuses: 'Codes de statut',
        median: 'Médiane',
        p95: 'p95',
      },
      showDetails: '{route}, afficher les détails',
      successShare: '{share} réussies',
      errorShare: '{share} d’erreurs',
    },
    details: {
      close: 'Fermer',
      statuses: 'Codes de statut',
      whereItFailed: 'Où elle a échoué',
      screenFailed: '{failed} en échec',
      onlyThisScreen: ' : n’afficher que les requêtes faites depuis cet écran',
      latestFailures: 'Derniers échecs',
      noFailures: 'Aucun échec sur cette période.',
      failedVisits: 'Voir toutes les visites avec un {method} {route} en échec',
      noErrorCode: 'Aucun code d’erreur',
      openVisit: 'Ouvrir la visite {visit}',
    },
  },
  properties: {
    otherValues: 'Autres valeurs',
  },
  features: {
    subtitle: 'Ce que les gens utilisent le plus dans {project}',
    kindLabel: 'Type de fonctionnalité',
    kinds: {
      events: 'Événements',
      screens: 'Écrans',
    },
    search: {
      events: 'Rechercher des événements',
      screens: 'Rechercher des écrans',
      submit: 'Rechercher',
      submitting: 'Recherche…',
      clear: 'Effacer',
    },
    titles: {
      events: 'Événements les plus utilisés',
      screens: 'Écrans les plus visités',
    },
    nameHeaders: {
      events: 'Événement',
      screens: 'Écran',
    },
    nothingYet: {
      events:
        'Aucun événement nommé sur cette période. Les événements envoyés avec track() apparaissent ici.',
      screens: 'Aucune page vue sur cette période.',
    },
    noMatch: 'Aucun résultat pour « {query} ».',
    columns: {
      count: 'Nombre',
      visits: 'Visites',
      trend: 'Tendance',
      share: 'Part',
    },
    footnote:
      'Les événements sont envoyés par le site avec le SDK Pyxis ; ouvrez-en un pour voir la répartition des valeurs de ses propriétés. Les écrans sont des pages vues regroupées par modèle de chemin : /orders/8213 et /orders/8214 comptent comme /orders/:id.',
  },
  propertyBreakdown: {
    toggle: 'Propriétés de {event}',
    loading: 'Chargement des propriétés de {event}…',
    failed: 'Impossible de charger les propriétés de {event}.',
    retry: 'Réessayer',
    none: '{event} n’a porté aucune propriété sur cette période.',
    carriedBy: '· portée par {carriedBy}',
    columns: {
      value: 'Valeur',
      share: 'Part',
      count: 'Nombre',
      visits: 'Visites',
    },
    valuePurpose: ' : voir les visites où {key} vaut {value}',
  },
  funnel: {
    openedPage: 'A ouvert {path}',
    start: 'Départ',
    continued: '{share} ont continué',
    dropped: '{count} ont abandonné',
    reachedLastStep: '{reached} sur {subjects} ont atteint la dernière étape',
    noStepToCompare: 'Aucune étape à comparer',
    transition: 'Étape {from} → {to}',
    transitionNote: '{from} → {to} · {share} ont continué',
    medianTime: 'médiane de {duration} après l’étape précédente',
    timeToFinish: 'Durée médiane jusqu’au bout',
    timeToFinishNote: 'de l’étape 1 à l’étape {last}, pour ceux qui l’ont atteinte',
    page: {
      subtitle: 'Où les gens continuent et où ils abandonnent dans {project}',
      countBy: 'Compter',
      modes: {
        visit: 'Par visite',
        user: 'Par personne',
      },
      overallConversion: 'Conversion globale',
      biggestDropOff: 'Plus fort abandon',
      stepsHeading: 'Entonnoir',
      modeNotes: {
        visit: 'Par visite : une étape ne compte qu’après la précédente, dans la même visite',
        user: 'Par personne : les étapes peuvent s’étendre sur plusieurs visites une fois la personne identifiée',
      },
    },
    build: {
      title: 'Créer un entonnoir',
      body: 'Un entonnoir compte de 2 à 8 étapes, chacune un chemin de page (<code>*</code> correspond à n’importe quelle suite de caractères) ou un nom d’événement. Une étape ne compte qu’après la précédente. Les étapes sont dans l’adresse : un favori conserve donc l’entonnoir.',
      example: 'Partir d’un entonnoir d’exemple',
    },
    subjects: {
      reachedLink: '{count}, lister ceux qui ont atteint l’étape {step}',
      droppedLink: '{dropped}, lister ceux qui sont partis avant l’étape {step}',
      reached: forms(
        '{subjects} a atteint l’étape {step}',
        '{subjects} ont atteint l’étape {step}',
      ),
      dropped: forms(
        '{subjects} a atteint l’étape {previous} mais jamais l’étape {step}',
        '{subjects} ont atteint l’étape {previous} mais jamais l’étape {step}',
      ),
      columns: {
        visit: 'Visite',
        person: 'Personne',
        reachedAt: 'Dernière étape atteinte',
      },
      openVisit: '{visit}, ouvrir cette visite dans la chronologie',
      openPerson: '{user}, ouvrir la chronologie de cette personne',
      order: 'Les plus récentes d’abord, 50 à la fois.',
      older: 'Afficher les plus anciennes',
      newest: 'Revenir aux plus récentes',
      close: 'Fermer la liste',
      empty: 'Personne sur cette période.',
    },
  },
  visits: {
    problems: {
      propertyNeedsEvent: 'Un filtre de propriété nécessite un événement.',
      propertyFormat:
        'Un filtre de propriété s’écrit clé=valeur : une clé en lettres minuscules, chiffres et _, et une valeur de 1 à {max} caractères.',
      country: 'Un pays s’écrit avec son code à deux lettres, comme BR.',
      region: 'Une région s’écrit avec le code de son pays et de la région, comme BR-SP.',
      source: 'Une source compte {max} caractères au maximum.',
      campaign: 'Une campagne compte {max} caractères au maximum.',
      route: 'Une requête s’écrit avec une méthode et une route, comme POST /orders/:id.',
    },
    accountLink: '{user}, ouvrir la chronologie de cet utilisateur',
    shortAccountLink: '{shown}, ouvrir la chronologie de l’utilisateur {user}',
    noFailedRequest: 'Aucune requête en échec',
    page: {
      subtitle: 'Toutes les visites de {project} sur la période, les plus récentes d’abord',
      footnote:
        'Les temps forts sont ses cinq premiers événements nommés, dans l’ordre. Une requête en échec est une lecture ou une écriture envoyée avec trackRequest() qui a répondu 400 ou plus, ou n’a jamais répondu ; Requêtes liste les écritures et les lectures en échec dans des onglets séparés.',
      empty: {
        filtered: 'Aucune visite ne correspond à ces filtres sur cette période.',
        all: 'Aucune visite sur cette période. Une visite apparaît ici dès que votre site envoie son premier événement.',
      },
    },
    filters: {
      label: 'Filtrer les visites',
      toggle: 'Filtres',
      toggleActive: 'Filtres · actifs : {count}',
      pages: {
        legend: 'Pages parcourues',
        hint: 'Une visite doit avoir vu chacune des pages indiquées. Un * correspond à n’importe quels caractères, comme dans /blog/*.',
        path: 'Page vue',
        path2: 'Et la page',
        path3: 'Et aussi la page',
      },
      event: 'A eu l’événement',
      property: 'Avec la propriété',
      propertyHint: 'clé=valeur, sur l’événement ci-dessus',
      channel: 'Canal',
      anyChannel: 'Tous les canaux',
      device: 'Appareil',
      anyDevice: 'Tous les appareils',
      account: 'Compte',
      anyone: 'Tout le monde',
      identities: {
        identified: 'Identifiées',
        anonymous: 'Anonymes',
      },
      country: 'Pays',
      countryHint: 'Code à deux lettres',
      region: 'Région',
      regionHint: 'Code du pays et de la région',
      source: 'Source',
      sourceHint: 'Comme dans Acquisition',
      campaign: 'Campagne',
      route: 'A fait la requête',
      routeHint: 'Méthode et route',
      failed: 'Avec une requête en échec',
      placeholders: {
        path: '/pricing',
        event: 'signup_completed',
        property: 'plan=pro',
        country: 'BR',
        region: 'BR-SP',
        source: 'google',
        campaign: 'spring_sale',
        route: 'POST /orders',
      },
      leftOut: 'Certains filtres ont été ignorés :',
      apply: 'Appliquer les filtres',
      applying: 'Mise à jour…',
      clear: 'Effacer les filtres',
      applied: {
        label: 'Filtres appliqués',
        item: '{filter} : <value/>',
        remove: 'Retirer {filter} : {value}',
        removeFlag: 'Retirer {filter}',
        clearAll: 'Tout effacer',
      },
      unapplied: 'Modifications pas encore appliquées',
      undo: 'Annuler',
    },
    table: {
      heading: 'Visites',
      columns: {
        started: 'Début',
        duration: 'Durée',
        entryPage: 'Page d’entrée',
        pages: 'Pages',
        highlights: 'Temps forts',
        failed: 'Échecs<hidden> de requêtes</hidden>',
        device: 'Appareil',
        channel: 'Canal',
        account: 'Compte',
      },
      openVisit: '{started}, ouvrir la visite {visit}',
      channelNote: 'Canal : {channel}',
      anonymous: 'Anonyme',
      everyVisit: 'Ce sont toutes les visites de cette période.',
      load: 'Charger les visites plus anciennes',
      loading: 'Chargement des visites plus anciennes…',
      failed: 'Impossible de charger les visites plus anciennes. Réessayez.',
    },
  },
  timeline: {
    lookupHints: {
      visit: 'Un identifiant de visite ressemble à 94810767-edf6-4c2b-9a1d-2e3f4a5b6c01.',
      user: 'Un identifiant d’utilisateur compte de 1 à 64 lettres, chiffres, traits d’union ou tirets bas.',
    },
    openedPage: 'A ouvert {path}',
    linkedToUser: 'Visite reliée à l’utilisateur',
    visitHeading: 'Visite {visit} · {started}',
    userTitle: 'Utilisateur {user}',
    visitTitle: 'Visite {visit}',
    duration: {
      hours: '{hours} h {minutes} min',
      minutes: '{minutes} min {seconds} s',
      seconds: '{seconds} s',
    },
    page: {
      subtitle: 'Tout ce qu’une personne ou une visite a fait dans {project}, dans l’ordre',
      tryPerson: 'Essayer {user}',
    },
    lookUp: {
      title: 'Rechercher une personne ou une visite',
      body: 'Saisissez un identifiant d’utilisateur, celui que votre site transmet à identify(), pour voir toutes les visites de cette personne, ou un identifiant de visite pour voir une seule visite. Les événements, les pages vues et les requêtes s’affichent dans l’ordre où ils se sont produits, dans le fuseau horaire du projet.',
      demoPerson: 'Ouvrir la chronologie de la personne de démo {user}',
    },
    notFound: {
      title: 'Aucune visite trouvée pour {lookup}',
      body: 'L’identifiant contient peut-être une faute de frappe, les visites sont peut-être plus anciennes que la durée de conservation, ou les données de la personne ont peut-être été effacées.',
    },
    filters: {
      label: 'Afficher',
      all: 'Tout',
      pages: 'Pages vues',
      events: 'Événements',
      requests: 'Requêtes',
      errors: 'En échec uniquement',
    },
    search: {
      lookUp: 'Rechercher',
      kinds: {
        user: 'Une personne, par identifiant d’utilisateur',
        visit: 'Une visite, par identifiant de visite',
      },
      ids: {
        user: 'Identifiant d’utilisateur',
        visit: 'Identifiant de visite',
      },
      submit: 'Afficher la chronologie',
      pending: 'Recherche…',
      rejected: 'Aucune recherche n’a été faite. {hint}',
    },
    older: {
      everyVisit: 'Ce sont toutes les visites.',
      load: 'Charger les visites plus anciennes',
      loading: 'Chargement des visites plus anciennes…',
      failed: 'Impossible de charger les visites plus anciennes. Réessayez.',
    },
    card: {
      allVisitsOf: 'Toutes les visites de {user}',
      nothingOfThisKind: 'Rien de ce type dans cette visite.',
    },
  },
  funnelEditor: {
    heading: 'Étapes',
    open: 'Modifier les étapes',
    close: 'Fermer l’éditeur',
    stepType: 'Type de l’étape {step}',
    types: {
      page: 'Chemin de page',
      event: 'Nom d’événement',
    },
    stepValue: {
      page: 'Chemin de page de l’étape {step}',
      event: 'Nom d’événement de l’étape {step}',
    },
    placeholders: {
      page: '/pricing ou /blog/*',
      event: 'signup_completed',
    },
    moveUp: 'Monter l’étape {step}',
    moveDown: 'Descendre l’étape {step}',
    remove: 'Retirer l’étape {step}',
    removeShort: 'Retirer',
    add: 'Ajouter une étape',
    stepCount: '{steps} étapes sur {max}, au moins {min}',
    apply: 'Appliquer',
    applying: 'Mise à jour…',
    status: {
      ready: 'Appliquez pour compter ces {steps} étapes.',
      fillIn: 'Remplissez toutes les étapes pour appliquer.',
      fix: 'Corrigez les étapes signalées pour appliquer.',
    },
    problems: {
      pathStart: 'Un chemin de page commence par « / ».',
      pathLength: 'Un chemin de page compte {max} caractères au maximum.',
      eventName:
        'Un nom d’événement commence par une lettre minuscule et ne contient que des lettres minuscules, des chiffres et _, 64 au maximum.',
    },
  },
  timeOfDay: {
    title: 'Quand les visites commencent',
    description: 'Visites de {period} selon le jour et l’heure de leur première page vue.',
    summary: 'Pic d’affluence : {weekday}, de {from} à {to} ({visits}).',
    summaryEmpty: 'Aucune visite n’a commencé sur cette période.',
    cell: '{weekday}, {from} : {visits}',
    weekday: 'Jour de la semaine',
    table: 'Visites par jour de la semaine et par heure',
    fewer: 'Moins',
    more: 'Plus',
  },
  engagement: {
    entryTitle: 'Où les visites commencent',
    entryDescription:
      'Les pages par lesquelles les visites de {period} ont commencé, et combien sont parties juste après.',
    exitTitle: 'Où les visites se terminent',
    exitDescription: 'La dernière page vue par chaque visite de {period}.',
    page: 'Page',
    visits: 'Visites',
    singlePage: 'Parties juste après',
    lengthTitle: 'Combien de temps durent les visites',
    lengthDescription: 'Du premier au dernier événement de chaque visite de {period}.',
    length: 'Durée',
    share: 'Part',
    medianLabel: 'Visite médiane',
    singlePageLabel: 'Une seule page vue',
    summary: 'Visite médiane : {median} ; {share} des visites n’ont vu qu’une page.',
    noMedian: 'aucune visite',
    noPages: 'Aucune page vue sur cette période.',
    units: {
      seconds: '{count} s',
      minutes: '{count} min',
    },
    lengths: {
      under: 'Moins de {upper}',
      between: '{lower} à {upper}',
      atLeast: '{lower} ou plus',
    },
  },
  funnelSegments: {
    title: 'L’entonnoir par {by}',
    description: 'Visites de {period} ayant atteint chaque étape, par {by}, sur une même échelle.',
    dimensions: {
      device: 'type d’appareil',
      channel: 'canal',
    },
    tabs: {
      device: 'Par appareil',
      channel: 'Par canal',
    },
    label: 'Ventiler l’entonnoir',
    table: 'Étapes de l’entonnoir par segment',
    segment: 'Segment',
    step: 'Étape {number}',
    conversion: 'Globale',
    unknown: 'Inconnu',
    empty: 'Aucune visite n’a atteint la première étape sur cette période.',
    userMode:
      'Par personne, l’appareil et le canal ne sont pas définis : passez au mode par visite pour ventiler l’entonnoir.',
  },
  exports: {
    download: 'Télécharger le CSV',
    asCsv: '{label} en CSV',
    overview: {
      daily: 'Activité par jour',
      pages: 'Pages principales',
      events: 'Événements principaux',
    },
    acquisition: {
      sources: 'Sources',
      campaigns: 'Campagnes',
      channels: 'Visites par canal',
    },
    devices: 'Types d’appareil, navigateurs, systèmes, pays et régions',
    features: {
      events: 'Événements',
      screens: 'Écrans',
    },
    requests: {
      writes: 'Écritures',
      reads: 'Lectures en échec',
    },
    visits: 'Les {visits} visites les plus récentes',
  },
  landing: {
    meta: {
      title: 'Ce qui convertit et ce qui échoue sur votre site, sans cookies · Pyxis',
      description:
        'L’analytique produit qui montre à quelle étape de l’entonnoir les gens s’arrêtent et quelles requêtes de votre site ont échoué, sur le tableau de bord ou dans Claude. Sans cookies, sans IP, sans données personnelles. 14 jours gratuits.',
    },
    nav: {
      label: 'Principale',
      demo: 'Démo en direct',
      privacy: 'Confidentialité',
      claude: 'Demander à Claude',
      pricing: 'Tarifs',
      language: 'Langue',
      signIn: 'Connexion',
    },
    hero: {
      eyebrow: 'Sans cookies · sans IP · connecteur pour Claude',
      title:
        'Découvrez ce qui convertit et ce qui échoue sur votre site, sans collecter de données personnelles.',
      lead: 'Pyxis montre à quelle étape de l’entonnoir les gens s’arrêtent et quelles requêtes de votre site ont échoué à chaque visite. Consultez-le sur le tableau de bord ou demandez à Claude.',
      openDemo: 'Ouvrir la démo en direct',
      seePricing: 'Voir les tarifs',
      note: 'Sans inscription. Données inventées. Elle s’ouvre directement sur le tableau de bord.',
      trialNote:
        '14 jours gratuits ; la carte n’est débitée qu’au 15e jour. La démo s’ouvre sans inscription.',
      claudeTag: 'Dans l’annuaire de Claude',
      claude: 'Interrogez Claude sur vos chiffres',
    },
    forWhom: {
      eyebrow: 'Pour qui',
      title: 'Pour qui a besoin de savoir où les gens s’arrêtent',
      lead: 'Le même tableau de bord, trois façons de l’utiliser.',
      store: {
        title: 'Boutique ou commerce en ligne',
        body: 'Combien de personnes commencent une commande et à quelle étape elles abandonnent : panier, livraison ou paiement. Séparé entre mobile et ordinateur, et selon l’origine de la visite.',
        link: 'Voir un entonnoir dans la démo',
      },
      agency: {
        title: 'Développeur ou agence',
        body: 'Installez-le sur les sites de vos clients et donnez à chaque client l’accès à son seul projet, avec un code reçu par e-mail pour se connecter. Jusqu’à 3 sites et 3 personnes par compte ; au-delà, une offre sur mesure.',
        link: 'Voir les tarifs',
      },
      product: {
        title: 'Produit ou SaaS',
        body: 'Quelles fonctionnalités sont utilisées, où l’inscription perd des gens et quelles routes de votre API échouent, sans cookie chez vos utilisateurs.',
        link: 'Voir les écrans du tableau de bord',
      },
      install:
        'Vous ne codez pas ? L’installation peut être faite par un agent d’IA, par la personne qui a créé votre site ou par une agence. <link>Comment installer</link>',
    },
    preview: {
      label: 'Aperçu de l’écran Vue d’ensemble',
      range: '30 derniers jours',
      current: 'Cette période',
      previous: 'Période précédente',
      dropOff: 'Plus fort abandon dans l’entonnoir',
      failingWrite: 'Écriture qui échoue le plus souvent',
      failed: '{share} en échec',
      invented: 'Données inventées, comme dans la démo en direct.',
    },
    proof: {
      size: { value: 'moins de 5 Ko', label: 'de code Pyxis, compressé en gzip' },
      dependencies: { value: '0', label: 'dépendance d’exécution' },
      coverage: { value: '100 %', label: 'de couverture de tests dans les quatre dépôts' },
      license: { value: 'MIT', label: 'comme licence, infrastructure comprise' },
    },
    never: {
      eyebrow: 'Confidentialité',
      title: 'Ce qui n’est jamais stocké',
      raw: 'Un tag ordinaire enverrait :',
      kept: 'Ce qu’il en reste :',
      lead: 'Cinq choses qu’un tag d’analytique ordinaire enverrait, et ce qu’il reste de chacune. Le navigateur coupe d’abord ; l’API vérifie à nouveau avant que quoi que ce soit n’atteigne la base de données.',
      rows: {
        address: {
          label: 'Adresse de la page',
          where: 'Dans le navigateur',
          raw: 'https://shop.example/orders/48213?email=ana@example.com&utm_source=news',
          kept: '/orders/:id · utm_source=news',
        },
        ip: {
          label: 'Adresse IP',
          where:
            'Dans l’API : le pays et la région, puis l’adresse est supprimée. La ville n’est jamais lue.',
          raw: '203.0.113.7',
          kept: 'BR · BR-BA',
        },
        browser: {
          label: 'Navigateur',
          where: 'Dans l’API : classé, puis supprimé',
          raw: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36',
          kept: 'ordinateur · Chrome · Windows',
        },
        property: {
          label: 'Propriété d’événement',
          where:
            'Dans l’API : tout ce qui ressemble à un e-mail, un numéro de téléphone ou un numéro fiscal',
          raw: '"coupon": "ana@example.com"',
          kept: 'supprimée',
        },
        visit: {
          label: 'Visite',
          where: 'Dans le navigateur : aucun cookie, rien qui relie deux onglets',
          raw: 'cookie: visitor_id=8f2c41d0…; Max-Age=34560000',
          kept: 'sessionStorage · prend fin avec l’onglet',
        },
      },
      foot: 'Un navigateur qui envoie « ne pas me suivre » (Global Privacy Control ou Do Not Track) désactive Pyxis avant que quoi que ce soit ne soit mis en file d’attente. Les événements sont supprimés au bout de 13 mois.',
    },
    answers: {
      eyebrow: 'Tableau de bord',
      title: 'Les questions auxquelles répond le tableau de bord',
      lead: 'Huit écrans, chacun construit autour d’une question. Chaque carte ouvre cet écran dans la démo en direct.',
      open: 'Ouvrir dans la démo',
      agent:
        'Vous préférez poser la question ? Connectez Pyxis à Claude : il lit les mêmes chiffres, en lecture seule. <link>Comment connecter Pyxis</link>',
      questions: {
        overview:
          'Combien de visites, de conversions et d’écritures en échec sur cette période, par rapport à la précédente ?',
        acquisition: 'Quels canaux, sources et campagnes apportent des visites qui convertissent ?',
        devices: 'De quels appareils, navigateurs, pays et régions viennent les visites ?',
        features:
          'Quels événements et écrans sont utilisés, et comment se répartit une propriété ?',
        funnel: 'Où une inscription perd-elle des gens, et combien de temps prend chaque étape ?',
        requests:
          'Quelles routes de votre API échouent, à quelle fréquence et avec quelle lenteur ?',
        visits:
          'Quelles visites ont fait quelque chose de précis, filtrées par page, événement, canal, appareil ou échec ?',
        timeline: 'Qu’a fait une visite, ou une personne connectée, dans l’ordre ?',
      },
    },
    askClaude: {
      eyebrow: 'Connecteur MCP',
      title: 'Interrogez Claude au lieu de fouiller dans les graphiques',
      lead: 'Connectez Pyxis à Claude une fois et posez vos questions avec vos mots : comment s’est passée la semaine dernière, où l’inscription perd des gens, quelle route a commencé à échouer. Claude lit les mêmes chiffres que le tableau de bord, grâce à quinze outils en lecture seule. C’est inclus dans la formule, sans surcoût.',
      connect: 'Connecter Pyxis en une minute',
      directory: {
        badge: 'Nouveau',
        title: 'Pyxis est dans l’annuaire des connecteurs de Claude',
        body: 'Ouvrez la page de Pyxis dans l’annuaire, choisissez Connect et connectez-vous à Pyxis dans la fenêtre qui s’ouvre. Cela fonctionne dans Claude sur le web, sur votre ordinateur et sur votre téléphone.',
        open: 'Ouvrir dans l’annuaire de Claude',
        or: 'Ou ajoutez-le comme connecteur personnalisé :',
      },
      example: {
        label: 'Un exemple de conversation',
        you: 'Vous',
        claude: 'Claude',
        question:
          'Comment s’est passée la semaine dernière, et où l’inscription perd-elle des gens ?',
        used: 'Claude a lu :',
        connected: 'MCP connecté',
        replay: 'Rejouer',
        answer:
          'Les visites ont augmenté de 12 % par rapport à la semaine précédente, et les conversions de 8 %. L’inscription perd le plus de monde entre le formulaire et le code reçu par e-mail : 41 % s’arrêtent là, et 52 % sur téléphone. Sur ordinateur, cette étape en perd 23 %.',
        invented: 'Conversation et chiffres inventés, comme dans la démo en direct.',
      },
      promises: {
        reads: {
          title: 'Lecture seule',
          body: 'Chacun des quinze outils est une lecture de l’API Pyxis. Claude ne peut jamais rien modifier ni supprimer.',
        },
        revoke: {
          title: 'Révocable à tout moment',
          body: 'Chaque connexion figure dans Paramètres, Applications connectées, et s’arrête dès que vous la révoquez. Inutilisée pendant 90 jours, elle prend fin d’elle-même.',
        },
        personal: {
          title: 'Rien de personnel à transmettre',
          body: 'Les événements ne portent ni cookie, ni adresse IP, ni user agent : ce que lit Claude n’en contient donc pas non plus.',
        },
      },
      foot: 'Ce que demande Claude va de l’API Pyxis à Anthropic, qui le traite selon ses propres conditions. Cursor et les autres clients MCP se connectent avec un jeton d’accès créé dans les Paramètres. <link>Le guide complet</link>',
    },
    report: {
      eyebrow: 'Rapports',
      title: 'Chaque lundi, la semaine dans votre boîte mail',
      lead: 'Visites, conversions et écritures en échec par rapport à la semaine précédente, les pages principales et les routes qui ont le plus échoué. Sans ouvrir le tableau de bord et sans rien demander à personne.',
      items: {
        digest: {
          title: 'Activé pour chaque admin du projet',
          body: 'Il arrive chaque lundi, avec la semaine close dans le fuseau horaire de votre projet et dans la langue dans laquelle vous utilisez le tableau de bord. Il ne contient que des totaux, rien de personnel. Une semaine sans visites arrive aussi, avec la date du dernier événement : c’est ainsi qu’une installation cassée se voit sans ouvrir le tableau de bord. Il se désactive dans Paramètres.',
        },
        csv: {
          title: 'Un CSV pour chaque écran',
          body: 'Vue d’ensemble, Acquisition, Appareils, Fonctionnalités, Requêtes et Visites téléchargent en CSV ce qu’ils affichent, pour la période choisie.',
        },
        export: {
          title: 'Tous les événements, dans un fichier',
          body: 'L’export du projet réunit tout ce qu’il conserve dans un CSV compressé. Le lien arrive par e-mail en quelques minutes.',
        },
      },
      mail: {
        label: 'Un exemple de l’e-mail du récapitulatif hebdomadaire',
        kicker: 'Récapitulatif hebdomadaire',
        visits: 'Visites',
        identifiedUsers: 'Utilisateurs identifiés',
        convertingVisits: 'Visites avec conversion',
        failedWrites: 'Écritures en échec',
        visitsPerDay: 'Visites par jour',
        failingRoutes: 'Routes en échec',
        openWeek: 'Ouvrir la semaine dans le tableau de bord',
        versusWeekBefore: '{change} par rapport à la semaine précédente ({previous})',
        unchangedFromWeekBefore:
          'aucune variation par rapport à la semaine précédente ({previous})',
        weekBeforeOnly: '{previous} la semaine précédente',
        shareOfVisits: '{share} des visites',
        ofWrites: 'sur {writes} écritures, {rate}',
        noWrites: 'aucune écriture',
        failedOf: '{failed} sur {total} en échec',
      },
    },
    nudge: {
      label: 'Nouveauté : Pyxis dans Claude',
      badge: 'Nouveau',
      title: 'L’accès MCP est là !',
      tips: {
        agents:
          'Connectez Claude et d’autres agents IA à vos chiffres Pyxis, grâce au Model Context Protocol.',
        ask: 'Demandez « comment s’est passée la semaine dernière ? » et Claude lit vos chiffres.',
        connect: 'Une minute pour connecter Pyxis. En lecture seule, et révocable à tout moment.',
        privacy: 'Claude voit les mêmes chiffres que votre tableau de bord, et rien de personnel.',
      },
      another: 'Une autre astuce',
      cta: 'Voir comment connecter Pyxis',
      dismiss: 'Fermer',
    },
    install: {
      eyebrow: 'Installation',
      title: 'Ce qu’un site ajoute',
      lead: 'Un paquet et deux lignes. Les pages vues sont enregistrées automatiquement ; un événement nommé tient en un appel.',
      steps: {
        label: 'Pour commencer, en 3 étapes',
        account: {
          title: 'Créez le compte et le projet',
          body: 'Dans le tableau de bord, avec une adresse e-mail et une carte : 14 jours gratuits. Le projet arrive avec sa clé publique.',
        },
        install: {
          title: 'Installez-le, vous-même ou avec un agent d’IA',
          body: 'Un paquet et deux lignes dans le code du site, ou une demande à Claude Code, à Cursor ou à un autre agent.',
        },
        ask: {
          title: 'Posez vos questions',
          body: 'Ouvrez le tableau de bord, ou connectez Claude et demandez comment s’est passée la semaine et où les gens s’arrêtent.',
        },
      },
      copy: 'Copier',
      copied: 'Copié',
      selected: 'Sélectionné, appuyez sur Ctrl+C',
      note: 'Les clés sont délivrées par celui qui exploite l’API, et il n’y a pas d’inscription publique aujourd’hui. Les quatre dépôts sont sous licence MIT, infrastructure AWS (Terraform) comprise.',
      noteOpen:
        'Vos clés sont fournies avec votre compte : démarrez l’essai gratuit ci-dessous, ou hébergez votre propre Pyxis. Les quatre dépôts sont sous licence MIT, infrastructure AWS (Terraform) comprise.',
      requests:
        'Pour voir quels appels à votre API échouent, enveloppez une fois votre client HTTP avec <code>trackRequest()</code>. <link>Voir l’exemple</link>',
      agent: {
        title: 'Ou demandez à votre agent d’IA',
        lead: 'Ouvrez le dépôt du site dans Claude Code, dans Cursor ou dans un autre agent et collez :',
        prompt:
          'Installez Pyxis sur ce site en suivant https://pyxis-analytics.dev/llms.txt. La clé publique de mon projet est pyxis_pk_… et l’endpoint est https://api.pyxis-analytics.dev. Mesurez les pages et enregistrez un événement à chaque étape de la commande, sans aucune donnée personnelle.',
        ready:
          'Une fois le compte et le projet créés, l’écran Installation du tableau de bord propose une demande comme celle-ci, toute prête, avec la clé de votre projet à la place de <code>pyxis_pk_…</code>.',
        foot: 'L’agent suit les règles de <code>llms.txt</code> : aucune donnée personnelle, des noms d’événement valides, l’adresse de l’API dans la CSP. Connectez ensuite Claude à Pyxis pour vérifier que les premiers événements sont arrivés.',
      },
    },
    public: {
      eyebrow: 'Ingénierie',
      title: 'Construit en public',
      production:
        'Mesure de vrais sites depuis octobre 2026, <bolsoverde>bolsoverde.com</bolsoverde> et <blog>le blog de l’auteur</blog>, sans cookie sur aucun des deux.',
      items: {
        coverage:
          '100 % des instructions, branches, fonctions et lignes couvertes dans les quatre dépôts. La CI échoue en dessous.',
        realServices:
          'Des tests d’intégration sur un vrai Postgres, et des tests de bout en bout dans un vrai navigateur avec des contrôles d’accessibilité axe.',
        provenance:
          'Le code Pyxis qu’installent les sites est publié sur npm depuis GitHub Actions, avec provenance.',
        decisions:
          'Les décisions sont consignées sous forme d’ADR (architecture decision records) dans chaque dépôt.',
        storybook: 'Un Storybook où chaque story est aussi un test d’accessibilité.',
      },
      storybook: 'Chaque composant du tableau de bord et ses états',
      apiReference: 'Générée à partir des schémas des routes elles-mêmes',
      playground: 'Le vrai code Pyxis, qui montre chaque lot qu’il enverrait',
    },
    architecture: {
      eyebrow: 'Architecture',
      title: 'Comment les pièces s’assemblent',
      site: { name: 'Votre site', note: 'pyxis-analytics dans le navigateur' },
      edge: { name: 'CloudFront', note: 'Devant l’API' },
      api: { name: 'API', note: 'NestJS sur AWS Lambda, à São Paulo' },
      database: {
        name: 'Postgres',
        note: 'Neon, accessible par un rôle qui ne peut pas modifier le schéma',
      },
      dashboard: { name: 'Tableau de bord', note: 'Next.js sur Vercel, lit l’API' },
      retention: { name: 'Tâche quotidienne', note: 'Supprime les événements au bout de 13 mois' },
      digest: { name: 'Récapitulatif hebdomadaire', note: 'Un e-mail chaque lundi' },
    },
    comparison: {
      eyebrow: 'Comparaison',
      title: 'Pyxis face à un tag classique à base de cookies',
      aspect: 'Critère',
      typical: 'Tag classique à base de cookies',
      table: 'Tableau comparatif',
      rows: {
        cookie: {
          aspect: 'Cookie chez vos visiteurs',
          pyxis: 'Aucun',
          typical: 'Un cookie d’identification, souvent conservé des mois',
        },
        address: {
          aspect: 'Adresse IP',
          pyxis: 'Lue pour le pays et la région, jamais stockée',
          typical: 'Dépend de l’outil et de sa configuration',
        },
        linking: {
          aspect: 'Relie les visites d’un visiteur anonyme',
          pyxis: 'Jamais : une visite, c’est un onglet',
          typical: 'Oui, grâce au cookie',
        },
        thirdParties: {
          aspect: 'Tiers',
          pyxis: 'Aucun',
          typical: 'Dépend de l’outil ; parfois une régie publicitaire',
        },
        agents: {
          aspect: 'Interroger un agent IA sur les chiffres',
          pyxis: 'Oui : un connecteur pour Claude, en lecture seule',
          typical: 'Dépend de l’outil',
        },
        failedRequests: {
          aspect: 'Les requêtes du site en échec, à chaque visite',
          pyxis: 'Oui : route, statut et durée',
          typical: 'Dépend de l’outil',
        },
        trackerSize: {
          aspect: 'Taille du code que charge le site, compressé en gzip',
          pyxis: 'Moins de 5 Ko',
          typical: 'En général, de 30 à 150 Ko',
        },
        source: { aspect: 'Code source', pyxis: 'MIT, sur GitHub', typical: 'Variable' },
      },
      foot: '« Classique » décrit une configuration courante, pas un produit en particulier.',
    },
    pricing: {
      eyebrow: 'Tarifs',
      title: 'Une seule formule, en reais, avec tout ce que montre la démo',
      lead: 'Rien à payer par visiteur, par fonctionnalité ni par personne identifiée. Et toujours aucun cookie ni aucune donnée personnelle collectée chez vos visiteurs.',
      period: 'Période de facturation',
      monthly: 'Mensuelle',
      monthlyLabel: 'Mensuelle, 39 R$ par mois',
      yearly: 'Annuelle',
      yearlyLabel: 'Annuelle, 390 R$ par an, 2 mois offerts',
      saving: '2 mois offerts',
      monthlyPrice: '39 R$',
      perMonth: 'par mois',
      monthlyNote: 'ou 390 R$ par an, avec 2 mois offerts',
      yearlyPrice: '390 R$',
      perYear: 'par an',
      yearlyNote: 'soit 32,50 R$ par mois',
      approximateMonthly:
        'Prix en reais : environ {amount} par mois. La page de paiement affiche le montant exact dans votre devise.',
      approximateYearly:
        'Prix en reais : environ {amount} par an. La page de paiement affiche le montant exact dans votre devise.',
      included: {
        events: 'Jusqu’à 100 000 événements par mois',
        sites: 'Jusqu’à 3 sites',
        people: 'Jusqu’à 3 personnes dans le tableau de bord',
        history: '13 mois d’historique',
        digest: 'Un récapitulatif hebdomadaire par e-mail',
        agents: 'Le connecteur Claude (MCP) et des jetons d’accès pour les agents IA',
      },
      ask: 'Demander un accès',
      askTitle: 'Écrivez à',
      askIntro: 'En quelques lignes, indiquez :',
      askSite: 'l’adresse du site, ou des sites, jusqu’à 3 ;',
      askVisits: 'le nombre approximatif de visites par mois ;',
      askEmail: 'l’e-mail de la personne qui se connectera au tableau de bord.',
      askReply:
        'La réponse contient le lien de paiement. Une fois abonné, vous recevez l’accès au tableau de bord sous 2 jours ouvrés.',
      askMail: 'Ouvrir dans ma messagerie',
      mailSubject: 'Je souhaite utiliser Pyxis',
      trial:
        '14 jours gratuits. La carte n’est débitée qu’au 15e jour, et vous pouvez résilier à tout moment.',
      invite:
        'Pour l’instant, l’accès se fait sur invitation : vous en faites la demande, recevez le lien de paiement et, une fois abonné, obtenez l’accès au tableau de bord sous 2 jours ouvrés.',
      moreTitle: 'Pour les agences et les développeurs',
      more: 'Mesurez les sites de vos clients : chaque client se connecte avec sa propre adresse e-mail et ne voit que son projet. La formule comprend jusqu’à 3 sites et 3 personnes, vous compris. Pour plus de clients, indiquez combien de sites et de personnes à hello@pyxis-analytics.dev et nous répondons sous 2 jours ouvrés avec une formule sur mesure.',
      moreLink: 'Demander une formule pour agence',
      moreSubject: 'Une formule Pyxis pour agence',
      start: 'Démarrer votre essai gratuit',
      openNote:
        'Inscrivez-vous avec un e-mail et une carte ; le tableau de bord s’ouvre dès que l’abonnement est confirmé.',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Questions fréquentes',
      items: {
        cookies: {
          question: 'Pyxis dépose-t-il des cookies chez mes visiteurs ?',
          answer:
            'Non. L’identifiant d’une visite vit dans le <code>sessionStorage</code> de l’onglet et disparaît à sa fermeture. Les cookies n’existent que dans le tableau de bord Pyxis lui-même, pour les personnes qui l’utilisent, jamais sur les sites qu’il mesure.',
        },
        address: {
          question: 'Stocke-t-il les adresses IP ?',
          answer:
            'Non. CloudFront indique à l’API le pays et la région de chaque requête ; l’adresse elle-même n’est jamais écrite nulle part, et la ville n’est jamais lue.',
        },
        people: {
          question: 'Peut-il savoir que deux visites viennent de la même personne ?',
          answer:
            'Uniquement pour les personnes connectées à votre site, grâce à votre propre identifiant interne, jamais un e-mail. Les visites anonymes ne sont jamais reliées : ni d’un onglet à l’autre, ni d’un jour à l’autre.',
        },
        optOut: {
          question: 'Un visiteur peut-il refuser d’être mesuré ?',
          answer:
            'Global Privacy Control et Do Not Track désactivent Pyxis, et un site peut proposer son propre interrupteur avec <code>optOut()</code> et <code>trackingStatus()</code>.',
        },
        retention: {
          question: 'Combien de temps les données sont-elles conservées ?',
          answer:
            'Treize mois, puis une tâche quotidienne les supprime. Les événements d’une personne peuvent être exportés ou effacés depuis votre backend à tout moment.',
        },
        claude: {
          question: 'Puis-je interroger Claude sur mes chiffres ?',
          answer:
            'Oui. Pyxis est dans l’annuaire des connecteurs de Claude : ouvrez <code>claude.ai/directory/pyxis</code>, choisissez Connect et connectez-vous à Pyxis. Dans Claude Code, exécutez <code>claude mcp add</code> avec l’adresse <code>https://api.pyxis-analytics.dev/mcp</code>. Claude lit alors les chiffres de tous les projets que vous pouvez ouvrir, sans rien modifier. Vous le révoquez dans Paramètres, Applications connectées.',
        },
        use: {
          question: 'Puis-je l’utiliser sur mon site ?',
          answer:
            'Oui, de deux façons : hébergez Pyxis sur votre propre infrastructure (le code est sous licence MIT sur GitHub) ou abonnez-vous à la formule hébergée. Pour vous abonner, demandez un accès à hello@pyxis-analytics.dev.',
          answerOpen:
            'Oui, de deux façons : hébergez Pyxis sur votre propre infrastructure (le code est sous licence MIT sur GitHub) ou abonnez-vous à la formule hébergée. Toute personne au Brésil peut s’inscrire avec un e-mail et une carte : 14 jours gratuits, une fois par client, et vous résiliez à tout moment.',
        },
        agency: {
          question: 'Puis-je utiliser Pyxis sur les sites de mes clients ?',
          answer:
            'Oui. Créez un projet par site et ajoutez le client aux personnes du projet : il se connecte avec un code reçu par e-mail et ne voit que ce projet. La formule comprend jusqu’à 3 sites et 3 personnes, vous compris ; au-delà, écrivez à hello@pyxis-analytics.dev. Les <terms>Conditions d’utilisation</terms> le prévoient : mesurer, en tant qu’agence, les sites de clients qui l’ont autorisé n’est pas de la revente.',
        },
        noCode: {
          question: 'Je ne code pas. Puis-je l’installer ?',
          answer:
            'L’installation, c’est un paquet et deux lignes dans le code du site, donc quelqu’un doit toucher à ce code : vous avec un agent d’IA, la personne qui a créé votre site ou une agence. Ensuite, le tableau de bord et Claude ne demandent plus aucun code.',
        },
        aiInstall: {
          question: 'Puis-je demander à une IA de l’installer ?',
          answer:
            'Oui. Ouvrez le dépôt du site dans Claude Code, dans Cursor ou dans un autre agent et demandez-lui d’installer Pyxis en suivant <code>https://pyxis-analytics.dev/llms.txt</code>, avec la clé publique de votre projet. L’agent ajoute le paquet, l’appel <code>init</code> et les événements. Connectez ensuite Claude à Pyxis pour vérifier que les premiers événements sont arrivés.',
        },
        price: {
          question: 'Combien ça coûte ?',
          answer:
            '39 R$ par mois ou 390 R$ par an (deux mois offerts), par carte. Cela comprend jusqu’à 100 000 événements par mois, 3 sites, 3 personnes dans le tableau de bord, 13 mois d’historique, le récapitulatif hebdomadaire et le serveur MCP.',
        },
        trial: {
          question: 'Comment fonctionne l’essai gratuit ?',
          answer:
            'Vous avez 14 jours sans payer, une fois par client. La carte est demandée au départ et débitée seulement au 15e jour ; résiliez avant et rien n’est prélevé.',
        },
        cancel: {
          question: 'Comment résilier ?',
          answer:
            'À tout moment, de deux façons : résiliez dans le portail d’abonnement, et l’accès dure jusqu’à la fin de la période payée ; ou fermez le compte dans le tableau de bord, et l’accès prend fin immédiatement. Dans les 7 jours suivant le premier prélèvement, fermer le compte rembourse intégralement ce prélèvement ; au-delà, la période déjà payée n’est pas remboursée. Les données du projet sont supprimées 30 jours après la fin de l’accès.',
          answerOpen:
            'À tout moment, de deux façons : résiliez dans le portail d’abonnement, et l’accès dure jusqu’à la fin de la période payée ; ou fermez le compte dans le tableau de bord, et l’accès prend fin immédiatement. Dans les 7 jours suivant le premier prélèvement, fermer le compte rembourse intégralement ce prélèvement ; au-delà, la période déjà payée n’est pas remboursée. Les données du projet sont supprimées 30 jours après la fin de l’accès. Les <terms>Conditions d’utilisation</terms> donnent tous les détails.',
        },
        limit: {
          question: 'Et si je dépasse 100 000 événements ?',
          answer:
            'Vous recevez un e-mail à 80 % et à 100 % des événements du mois. À 150 %, le compte cesse d’accepter des événements jusqu’au 1er du mois suivant, et les événements envoyés pendant la pause sont perdus. Rien n’est jamais facturé au-delà du prix.',
        },
        payment: {
          question: 'Puis-je payer par Pix, et y a-t-il une facture ?',
          answer:
            'Pour l’instant, uniquement par carte ; Pix pour la formule annuelle dépend de son activation par Stripe. Les factures brésiliennes (nota fiscal) ne sont pas encore émises : si vous en avez besoin, écrivez-nous avant de vous abonner.',
        },
      },
    },
    story: {
      eyebrow: 'L’histoire',
      title: 'Pourquoi Pyxis existe',
      body: 'L’article de présentation explique pourquoi il a été créé et ce qu’il ne stocke jamais.',
      cta: 'Lire l’article',
    },
    measurement: {
      measured:
        'Cette page est mesurée par Pyxis lui-même : aucun cookie, aucune adresse IP stockée.',
      see: 'Voir ce qu’il a enregistré',
      optOut: 'Ne pas mesurer mes visites',
      off: 'La mesure est désactivée dans ce navigateur.',
      optIn: 'Réactiver la mesure',
      blocked: 'La mesure est désactivée par le « ne pas me suivre » de votre navigateur.',
    },
    recorded: {
      button: 'Ce que cette page a enregistré',
      title: 'Ce que cette page a enregistré',
      subtitle: 'Cette visite, en direct. Envoyée à Pyxis toutes les 5 secondes.',
      visit: 'Visite {id}… · cet onglet uniquement',
      referrer: 'référent : {host}',
      noReferrer: 'référent : aucun',
      empty: 'Rien d’envoyé pour l’instant. Le premier lot part dans les 5 secondes.',
      never:
        '<strong>Jamais envoyé :</strong> votre adresse IP, le nom complet de votre navigateur, un cookie, l’adresse complète de la page. <strong>Ajouté par le serveur :</strong> le pays et la région, d’après la requête ; puis l’adresse est supprimée.',
      close: 'Fermer',
    },
    footer: {
      tagline: 'Analytique produit respectueuse de la vie privée.',
      product: 'Produit',
      pricing: 'Tarifs',
      code: 'Code',
      author: 'Auteur',
      demo: 'Démo en direct',
      apiReference: 'Référence de l’API',
      playground: 'Bac à sable du SDK',
      madeBy: 'Réalisé par Samuel Santana · Licence MIT',
      contract: 'Contrat',
      contractLanguage: 'Traductions de courtoisie ; le texte portugais fait foi.',
    },
  },
  legal: {
    documentsLabel: 'Documents contractuels',
    versionsLabel: 'Ce document dans d’autres langues',
    terms: 'Conditions d’utilisation',
    privacy: 'Politique de confidentialité',
    agreement: 'Accord de traitement des données',
    metaDescription: '{document} de l’offre hébergée de Pyxis, version {version}.',
    seller: 'Vendu par {name} · CPF {taxId} · {address} · {email}',
  },
});
