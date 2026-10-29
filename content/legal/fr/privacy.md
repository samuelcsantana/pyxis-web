# Politique de confidentialité de Pyxis

**Version {{terms.version}} — entrée en vigueur : {{terms.effectiveFrom}}.**

> Ceci est une traduction de courtoisie. Le texte qui fait foi est la version en portugais ([Português](/privacidade)) ; en cas de divergence entre les deux, la version portugaise prévaut.

La présente politique explique quelles données personnelles Pyxis traite **en tant que responsable
du traitement**, à quelles fins, sur quelle base légale, avec qui il les partage, combien de temps il
les conserve et comment vous exercez vos droits, conformément à la Lei Geral de Proteção de Dados
Pessoais (Lei nº 13.709/2018, la « LGPD » ; loi générale brésilienne sur la protection des données
personnelles).

Elle s’applique :

1. aux **clients** qui souscrivent à Pyxis hébergé, représentés par le **propriétaire du compte**,
   qui effectue l’inscription et administre le compte ;
2. aux **personnes ayant accès au tableau de bord** (`app.pyxis-analytics.dev`) : le propriétaire du
   compte et les personnes qu’il invite ;
3. à **ceux qui nous écrivent** à hello@pyxis-analytics.dev ;
4. aux **visiteurs de la page d’accueil** `pyxis-analytics.dev`.

Elle **ne** concerne **pas** les visiteurs des sites de nos clients. Sur ces sites, c’est le
propriétaire du site qui décide de la mesure (le responsable du traitement) ; nous agissons en tant
que sous-traitant, selon les règles de l’Accord de traitement des données personnelles. Si vous avez
visité un site qui utilise Pyxis, consultez la politique de confidentialité de ce site.

---

## 1. Qui est le responsable du traitement et comment nous contacter

1.1. Le responsable du traitement est **{{seller.name}}**, personne physique, inscrit au CPF (numéro
d’identification fiscale des personnes physiques au Brésil) sous le nº **{{seller.taxId}}**, domicilié
à **{{seller.address}}**, qui propose le service sous le nom **Pyxis**.

1.2. Canal pour tout sujet relatif à la vie privée, y compris l’exercice de vos droits :
**hello@pyxis-analytics.dev**. Les messages sont lus et traités par le responsable du traitement
lui-même.

1.3. En tant qu’agent de traitement de petite taille, nous ne désignons pas d’encarregado (délégué à
la protection des données au sens de la LGPD) ; ce canal remplit le rôle prévu à l’art. 41, § 2º, I,
de la LGPD (Resolução CD/ANPD nº 2/2022 — résolution du conseil directeur de l’ANPD, l’autorité
nationale brésilienne de protection des données —, art. 11, et Resolução CD/ANPD nº 18/2024, art. 3º,
§ 3º).

## 2. Quelles données nous traitons, à quelles fins, sur quelle base légale et pendant combien de temps

### 2.1. Personnes ayant accès au tableau de bord

| Donnée | Finalité | Base légale (LGPD) | Durée |
|---|---|---|---|
| E-mail, langue des e-mails (celle de l’écran sur lequel vous vous êtes connecté ou inscrit), projets auxquels vous avez accès, si vous êtes le propriétaire du compte ou un invité, choix concernant le récapitulatif hebdomadaire, date d’inscription | Envoyer le code de connexion et les e-mails du service, afficher vos projets et envoyer le récapitulatif hebdomadaire dans votre langue | Exécution du contrat, pour le propriétaire du compte (art. 7º, V) ; intérêt légitime, le nôtre et celui du client, à donner accès aux personnes que le propriétaire a invitées (art. 7º, IX) | Tant que vous avez accès à un projet ou êtes propriétaire d’un compte. Lorsque le propriétaire vous retire d’un projet, l’accès à celui-ci prend fin immédiatement ; si vous n’avez plus accès à aucun projet, nous supprimons votre inscription dans les 30 jours. Dans tous les cas, l’inscription est supprimée avec le compte (point 2.2) |
| Invitation : votre e-mail, le nom du projet et l’e-mail de la personne qui a invité, dans l’e-mail d’invitation | Vous informer de l’accès et de qui vous l’a donné | Intérêt légitime, le nôtre et celui du client (art. 7º, IX) | L’invitation elle-même ne reste pas dans notre base de données (seulement l’inscription de la ligne ci-dessus) ; la trace de l’envoi reste chez le prestataire d’e-mail pendant la durée qui lui est propre (point 3) |
| Codes de connexion et d’inscription : e-mail, code conservé uniquement sous forme de hash, finalité (connexion ou inscription), langue, tentatives, horaires | Permettre la connexion et l’inscription sans mot de passe et empêcher les tentatives répétées | Exécution du contrat, mesures précontractuelles et intérêt légitime en matière de sécurité (art. 7º, V et IX) | Valables 10 minutes ; supprimés par la routine quotidienne après expiration |
| Sessions : valeur conservée uniquement sous forme de hash, dates de début et de dernière utilisation, catégorie d’appareil et famille du navigateur et du système (sans version) | Vous maintenir connecté et afficher vos sessions pour que vous puissiez les fermer | Exécution du contrat et intérêt légitime en matière de sécurité (art. 7º, V et IX) | 7 jours au maximum, ou 24 heures sans utilisation ; supprimées par la routine quotidienne après leur fermeture |
| Jetons d’accès : nom que vous avez donné, valeur conservée uniquement sous forme de hash, dates de création, de dernière utilisation, d’expiration et de révocation | Permettre à des programmes et à des agents de lire vos chiffres | Exécution du contrat (art. 7º, V) | Jusqu’à la suppression de votre inscription (un jeton expiré ou révoqué cesse de fonctionner immédiatement, mais l’enregistrement demeure jusque-là) |
| Applications connectées (connecteur Claude) : l’application (Claude ou Claude Code), les dates auxquelles vous l’avez connectée, de dernière utilisation (enregistrée au plus toutes les 5 minutes et à chaque renouvellement) et de révocation ; identifiants de la connexion conservés uniquement sous forme de hash | Permettre à l’application que vous avez connectée de lire vos chiffres et afficher les connexions pour que vous puissiez les révoquer | Exécution du contrat, pour le propriétaire du compte (art. 7º, V) ; intérêt légitime, le nôtre et celui du client, à offrir cette fonctionnalité aux personnes que le propriétaire a invitées (art. 7º, IX) | Tant que la connexion est active. La routine quotidienne supprime la connexion révoquée ou inutilisée depuis 90 jours, les identifiants expirés et les identifiants de renouvellement remplacés depuis plus de 30 jours |
| Demandes de connexion : l’application, l’adresse vers laquelle la réponse est renvoyée, les données techniques que l’application envoie pour protéger la demande, les horaires, votre décision (autoriser ou annuler), qui a décidé et le code à usage unique conservé uniquement sous forme de hash | Afficher la demande sur la page de consentement et ne remettre la réponse qu’à l’application qui l’a demandée | Exécution du contrat, pour le propriétaire du compte, et intérêt légitime en matière de sécurité et pour offrir la fonctionnalité aux invités (art. 7º, V et IX) | La demande est valable 10 minutes, et le code 5. La routine quotidienne supprime la demande 1 jour après son expiration ; ensuite, seule subsiste la connexion de la ligne ci-dessus |
| Trace de l’envoi du récapitulatif hebdomadaire (projet, personne, semaine, date d’envoi) | Ne pas envoyer deux fois le même récapitulatif | Exécution du contrat (art. 7º, V) | Jusqu’à la suppression du projet ou de votre accès |
| Journaux techniques de l’API avec votre identifiant interne (par exemple, « s’est connecté », « a fermé la session », « a créé un jeton », « a connecté une application ») | Sécurité et investigation des défaillances et des incidents | Intérêt légitime en matière de sécurité (art. 7º, IX) | 14 jours |

**Adresse IP :** lorsque vous demandez un code ou vous connectez au tableau de bord, l’IP est utilisée
uniquement dans la mémoire du serveur pour limiter les tentatives (jusqu’à 5 toutes les 15 minutes) et
disparaît en 15 minutes au plus. **Elle n’est pas enregistrée** dans notre base de données ni dans nos
journaux. Vercel, qui héberge le tableau de bord, reçoit l’IP et le navigateur des personnes qui y
accèdent et les conserve dans ses journaux techniques pendant 1 jour (point 3).

### 2.2. Clients (propriétaires de compte)

| Donnée | Finalité | Base légale (LGPD) | Durée |
|---|---|---|---|
| Compte : propriétaire, forfait (gratuit ou payant), statut de l’abonnement, périodicité, identifiants du client et de l’abonnement chez Stripe (uniquement sur le forfait payant), dates (fin de l’essai, de la période, de l’accès, des avis envoyés), utilisation mensuelle des événements et avis de quota et de compte sans événements envoyés | Fournir le service, appliquer les limites du forfait, activer et désactiver l’accès selon le forfait et l’abonnement, avertir et supprimer le compte du forfait gratuit sans événements, annoncer la fin du compte | Exécution du contrat (art. 7º, V) | Jusqu’à la suppression du compte : 30 jours après la fin de l’accès ou, pour un compte du forfait gratuit sans événements, 7 jours après l’avis (Conditions d’utilisation, Clause 7.6) |
| Acceptation des conditions : version acceptée, date et heure, compte et personne qui a accepté (sans IP) | Savoir quelle version s’applique à vous et prouver l’acceptation | Exécution du contrat et exercice régulier de droits (art. 7º, V et VI) | Jusqu’à la suppression du compte. Lorsque vous souscrivez au forfait payant, Stripe conserve, en tant que responsable du traitement, la trace de l’acceptation donnée sur sa page de paiement |
| Données de facturation, uniquement de ceux qui souscrivent au forfait payant, reçues par Stripe : nom, e-mail, adresse de facturation, CPF ou CNPJ (numéro d’immatriculation des personnes morales au Brésil), s’il est indiqué, réseau, derniers chiffres et date d’expiration de la carte, historique des paiements, remboursements et contestations | Facturer l’abonnement, envoyer les reçus, traiter la rétractation, les remboursements et les contestations, respecter les obligations fiscales | Exécution du contrat (art. 7º, V) et respect d’une obligation légale (art. 7º, II) | Pendant le contrat et pendant 5 ans à compter de l’année suivant celle de chaque prélèvement (délai de conservation fiscale) |
| Configuration des projets : nom, adresses des sites, fuseau horaire, événement de conversion, clé publique, clé secrète conservée uniquement sous forme de hash, icône copiée du site lui-même | Fournir le service | Exécution du contrat (art. 7º, V) | Jusqu’à la suppression du projet par le propriétaire ou du compte (ligne « Compte » ci-dessus) |
| Demandes d’exportation : qui a demandé, quand, statut et nombre d’événements | Générer et remettre le fichier d’exportation au propriétaire du compte | Exécution du contrat (art. 7º, V) | Jusqu’à la suppression du projet. Le fichier lui-même est supprimé 7 jours après avoir été prêt |

**Sur le forfait gratuit, nous ne demandons ni carte ni données de facturation.** Sur le forfait
payant, **nous ne recevons ni ne conservons le numéro de la carte** : il reste chez Stripe. Nous ne
conservons que l’empreinte de la carte du point 2.7.

### 2.3. Ceux qui nous écrivent

| Donnée | Finalité | Base légale (LGPD) | Durée |
|---|---|---|---|
| E-mail, nom, contenu du message et pièces jointes | Répondre aux demandes d’accès, questions, demandes d’assistance, réclamations et demandes de personnes concernées | Mesures précontractuelles et exécution du contrat (art. 7º, V) ; exercice régulier de droits (art. 7º, VI) ; intérêt légitime à répondre à ceux qui nous contactent (art. 7º, IX) | S’il y a un contrat : jusqu’à 5 ans après sa fin (délai pour réclamer des dommages, Código de Defesa do Consumidor — Code brésilien de protection du consommateur —, art. 27). S’il n’y en a pas : 1 an après le dernier message |

### 2.4. Visiteurs de la page d’accueil (`pyxis-analytics.dev`)

La page d’accueil de Pyxis est mesurée par Pyxis lui-même, avec les mêmes règles que celles que nous
proposons aux clients.

| Donnée | Finalité | Base légale (LGPD) | Durée |
|---|---|---|---|
| Page vue (chemin, sans paramètres autres que ceux de campagne), actions sur la page (par exemple, ouvrir la démonstration), site d’origine (uniquement le domaine), paramètres de campagne, catégorie d’appareil, famille du navigateur et du système, pays, État et ville approximative (déduits de l’adresse IP par le réseau d’AWS, sans conserver l’IP ; la ville depuis le {{terms.effectiveFrom}}), numéro aléatoire de la visite | Comprendre comment la page est utilisée et améliorer la présentation de Pyxis | Intérêt légitime (art. 7º, IX, et art. 10) | 13 mois |

La mesure **n’utilise pas de cookies**, **ne conserve ni l’IP** ni le navigateur complet, et **n’envoie
rien** si votre navigateur demande à ne pas être suivi (Global Privacy Control ou Do Not Track). Sur la
page elle-même, le panneau « Ce que cette page a enregistré » montre chaque événement envoyé et permet
de désactiver la mesure dans ce navigateur. Vercel, qui héberge la page, conserve l’IP et le navigateur
des personnes qui y accèdent dans ses journaux techniques pendant 1 jour.

### 2.5. Cookies et stockage dans le navigateur

| Où | Nom | Type | Finalité | Durée |
|---|---|---|---|---|
| Tableau de bord (`app.`) | `__Host-pyxis_session` | Cookie nécessaire, `HttpOnly` et `Secure` | Vous maintenir connecté | 7 jours, ou jusqu’à ce que vous vous déconnectiez |
| Tableau de bord et démonstration (`app.` et `demo.`) | `pyxis_locale` | Cookie de préférence | Mémoriser la langue choisie | 1 an |
| Tableau de bord et démonstration | `pyxis_theme` | Cookie de préférence | Mémoriser le thème clair ou sombre, lorsqu’il a été choisi | 1 an |
| Tableau de bord | `pyxis:pending-sign-in` | `sessionStorage` (uniquement dans l’onglet) | Mémoriser l’e-mail saisi pendant que vous attendez le code, même si vous rechargez la page | 10 minutes, ou jusqu’à la fermeture de l’onglet |
| Page d’accueil | `pyxis:session` | `sessionStorage` (uniquement dans l’onglet) | Numéro aléatoire de la visite | Jusqu’à la fermeture de l’onglet ou 30 minutes d’inactivité |
| Page d’accueil | `pyxis:opt-out` | `localStorage` | Mémoriser que vous avez désactivé la mesure | Jusqu’à ce que vous la réactiviez ou effaciez les données du navigateur |
| Page d’accueil et écran de connexion du tableau de bord | `pyxis:theme` | `localStorage` | Mémoriser le thème choisi sur cet appareil | Jusqu’à ce que vous le changiez ou effaciez les données du navigateur |

La page d’accueil ne crée pas de cookies. Nous n’utilisons pas de cookies tiers, publicitaires ni de
réseaux sociaux, et le tableau de bord ne mesure pas l’utilisation des personnes qui s’y connectent.

### 2.6. E-mails que nous envoyons

Nous n’envoyons que des e-mails liés au service : codes de connexion et d’inscription ; invitation à un
projet ; bienvenue, avec la version des conditions acceptée ; avis d’utilisation à 80 %, à 100 % et de
la pause à 150 %, sur le forfait payant, et à 80 % et de la pause à 100 %, sur le forfait gratuit ;
avis de compte du forfait gratuit sans événements ; avis de fin de l’accès, rappel 7 jours avant la
suppression et avis de suppression
effectuée ; avis d’exportation prête ; le récapitulatif hebdomadaire (que chaque personne peut désactiver dans
Paramètres) ; et communications relatives au contrat, y compris les avertissements d’abus et de
suspension. Les e-mails de facturation sont envoyés par Stripe lui-même : rappel 7 jours avant la fin
de l’essai gratuit (pour les essais commencés avant la version 1.3 des Conditions d’utilisation),
reçus de paiements et de remboursements, avis de paiement refusé, demande de
confirmation du paiement (3D Secure) et avis de carte sur le point d’expirer. **Nos e-mails
ne comportent aucun suivi d’ouverture ni de clics.** Nous n’envoyons pas de publicité.

### 2.7. Prévention de l’essai gratuit répété

**Depuis la version 1.3 des Conditions d’utilisation, il n’y a pas d’essai gratuit** (Conditions
d’utilisation, Clause 8.3), et nous n’enregistrons pas de nouvelles empreintes de carte. Le présent
point traite des enregistrements des essais commencés auparavant, qui suivent la durée du tableau
ci-dessous et disparaissent au plus tard 12 mois après le début du dernier de ces essais.

L’essai gratuit valait une fois par client (Conditions d’utilisation, Clause 8.3). Pour détecter le cas
où la même carte démarre un second essai sur un autre compte, lorsque nous enregistrons un abonnement
avec essai gratuit (en pratique, lorsque l’essai commence), nous lisons chez Stripe l’**empreinte de la
carte** (*fingerprint*) de l’abonnement : un code que Stripe calcule à partir du numéro de la carte et
qui se répète chaque fois que le même numéro de carte est utilisé sur notre compte Stripe.
**L’empreinte n’est pas le numéro de la carte et ne permet pas de payer. Nous ne recevons ni ne
conservons le numéro de la carte.**

| Donnée | Finalité | Base légale (LGPD) | Durée |
|---|---|---|---|
| Empreinte de la carte, identifiant interne du compte et date à laquelle nous avons enregistré la carte lors de l’essai (en pratique, le début de l’essai) | Détecter la même carte démarrant un second essai gratuit sur un autre compte | Intérêt légitime à prévenir l’abus de l’essai gratuit (art. 7º, IX, et art. 10) | **12 mois à compter de cette date, y compris après la suppression du compte** ; à l’expiration du délai, la routine quotidienne supprime l’enregistrement |

1. **Ce qui se passe en cas de coïncidence.** Si la même empreinte a déjà démarré un essai sur un autre
   compte au cours des 12 mois précédents, le service consigne le fait dans les journaux techniques,
   uniquement avec les identifiants internes des comptes et jamais avec l’empreinte (ils disparaissent
   au bout de 14 jours), et une alarme nous prévient par
   e-mail.
   **Rien ne se passe automatiquement** : aucun prélèvement et aucune résiliation. Le responsable du
   traitement examine le cas, peut demander des explications au propriétaire du compte et décide selon
   les règles de la Clause 18.11 des Conditions d’utilisation, qui garantissent avertissement, motif et
   droit de contester. Il ne s’agit donc pas d’une décision prise uniquement par un moyen automatisé
   (art. 20).
2. **Pourquoi nous conservons après la suppression du compte.** L’objectif est précisément de
   reconnaître un nouveau compte ouvert après la clôture de l’ancien. Nous ne conservons que le minimum
   nécessaire à cela (sans nom, e-mail ni numéro de carte) et pendant la durée qui couvre cet usage
   (art. 10, § 1º).
3. **Limites.** Une carte utilisée via un portefeuille numérique (comme Apple Pay ou Google Pay) peut
   avoir une empreinte différente de celle de la carte physique, et une même carte peut être utilisée
   légitimement par différentes personnes d’une entreprise. Les essais de plus de 12 mois ont déjà été
   supprimés et n’entrent pas dans la comparaison. Une coïncidence est un indice, jamais une preuve à
   elle seule.
4. **Vos droits.** Vous pouvez demander la confirmation de cet enregistrement et y accéder, et vous y
   opposer (point
   6), et nous examinons l’opposition en tenant compte du motif que vous donnez.

### 2.8. Vérification d’abus

Lorsque nous vérifions un soupçon d’abus (Conditions d’utilisation, Clauses 12 et 18), nous n’utilisons
que ce que le service conserve déjà : les alertes de sécurité, les journaux techniques de l’API (qui
indiquent quand un événement ou une propriété a été refusé et par quelle règle, sans la valeur refusée,
et disparaissent au bout de 14 jours), les données du compte et de la facturation, l’enregistrement du
point 2.7, les événements du projet (consultés uniquement dans la mesure nécessaire, comme l’indique
l’Accord de traitement des données) et ce qui nous est signalé. **Nous ne conservons ni l’IP ni le
navigateur complet à cette fin, car le service ne les conserve pas.**

| Donnée | Finalité | Base légale (LGPD) | Durée |
|---|---|---|---|
| Trace de la vérification : ce qui a été constaté, les avertissements envoyés, votre réponse, la mesure prise et le motif | Appliquer les mesures de la Clause 18 des Conditions de manière équitable et pouvoir les démontrer | Intérêt légitime (art. 7º, IX) et exercice régulier de droits (art. 7º, VI) | Dans la boîte e-mail, selon les durées du point 2.3 (jusqu’à 5 ans après la fin du contrat) |

Nous ne conservons d’autres données au-delà des durées de la présente politique que si une loi, une
décision judiciaire ou une réquisition d’une autorité compétente l’impose, ou si elles sont nécessaires
pour une procédure judiciaire, administrative ou arbitrale, et uniquement les données concernées,
pendant la durée exigée (art. 7º, VI, et art. 16,
I).

## 3. Avec qui nous partageons

3.1. **Nous ne vendons pas de données personnelles** et ne les partageons pas à des fins publicitaires.

3.2. Nous faisons appel aux prestataires ci-dessous, qui traitent des données pour notre compte
(sous-traitants) ou, lorsque cela est indiqué, pour leur propre compte :

| Prestataire | Ce qu’il fait | Données reçues | Où |
|---|---|---|---|
| **Vercel Inc.** (États-Unis) | Héberge le tableau de bord et la page d’accueil | Tout ce que vous voyez et envoyez sur le tableau de bord ; IP et navigateur des personnes qui y accèdent (journaux pendant 1 jour) | Fonctions à São Paulo ; traitement principal aux États-Unis |
| **Amazon Web Services (AWS)** | API, routines automatiques, journaux techniques (14 jours), conservation des secrets, fichiers d’exportation (7 jours) | Données des points 2.1, 2.2 et 2.7, en transit ; journaux techniques sans e-mail ni IP | São Paulo (sa-east-1) ; réseau de distribution mondial devant l’API, sans conservation des requêtes |
| **Neon** (Databricks, Inc., États-Unis) | Base de données | Les données des points 2.1, 2.2 (compte, acceptation, configuration, utilisation et exportations), 2.4 et 2.7 | Serveurs à São Paulo ; entreprise aux États-Unis ; sauvegardes pendant 30 jours au plus |
| **Amazon SES** (AWS) | Envoie les e-mails du service (point 2.6), sans suivi d’ouverture ni de clic | E-mail du destinataire et contenu de l’e-mail. Les adresses qui renvoient l’e-mail ou le signalent comme spam entrent dans la liste de suppression de notre compte AWS, pour ne plus recevoir d’e-mails, jusqu’à ce qu’elles en soient retirées | São Paulo (sa-east-1) |
| **Stripe** (Stripe Brasil Soluções de Pagamento – Instituição de Pagamento Ltda. et Stripe, LLC, États-Unis) | Facturation, page de paiement, portail d’abonnement et e-mails de facturation | Données de facturation et de la carte (point 2.2) ; Stripe calcule l’empreinte de la carte (point 2.7) | Brésil et États-Unis. Stripe traite aussi des données **en tant que responsable du traitement**, pour la prévention de la fraude et le respect de ses propres obligations légales, conformément à la politique de confidentialité de Stripe |
| **ImprovMX** (ImprovMX Incorporated, États-Unis) | Transfère les e-mails envoyés à hello@pyxis-analytics.dev | Message en transit ; trace de l’expéditeur et de l’objet pendant 7 jours | Réception transitoire en France ; entreprise aux États-Unis |
| **Google** (Google LLC, États-Unis) | Boîte e-mail où sont conservés les messages envoyés à hello@pyxis-analytics.dev | Messages reçus et envoyés | États-Unis et autres pays. Il s’agit d’un compte personnel, sans contrat de sous-traitance : Google traite les messages **en tant que responsable du traitement**, conformément à la politique de confidentialité de Google |

3.3. **Autorités.** Nous ne remettons des données aux autorités qu’en présence d’une décision
judiciaire ou d’une réquisition émanant de quiconque a la compétence légale pour la formuler, et
uniquement ce qui est exigé.

3.4. **Clients et personnes ayant accès.** Les personnes ayant accès à un projet, y compris le
propriétaire du compte, voient dans Paramètres la liste des e-mails des personnes qui y ont accès.
Les sessions, les jetons, les applications connectées et le choix concernant le récapitulatif hebdomadaire
sont individuels : personne ne voit ceux d’une autre personne. Les personnes ayant accès
peuvent voir le statut du compte et l’utilisation du mois (par exemple, pour comprendre une pause liée
au quota) ; seul le propriétaire du compte ouvre le portail de facturation de Stripe.

3.5. **Succession.** Si le service vient à être fourni par une société créée par le responsable du
traitement ou par quiconque reprend le service, les données lui sont transférées, avec les mêmes règles
que la présente politique, et nous vous prévenons à l’avance.

3.6. **Applications que vous connectez.** Si vous connectez Claude ou Claude Code à Pyxis (Conditions
d’utilisation, Clause 13.10), ou utilisez un jeton d’accès dans un programme, les données que
l’application demande sortent de Pyxis vers elle, à votre demande. Par le connecteur Claude, elles vont
à **Anthropic** (Anthropic, PBC, États-Unis) : les chiffres des projets que vous pouvez ouvrir et, parce
que l’application lit qui est connecté, **votre e-mail de connexion**. Anthropic **n’est pas notre
sous-traitant** : elle traite ces données selon les conditions et la politique de confidentialité
applicables entre elle et vous. La page de consentement indique, avant le bouton **Autoriser**, que ces
données vont à Anthropic, aux États-Unis (point 4.4). Pour reconnaître
Claude et Claude Code, Pyxis lit le document public qu’Anthropic publie sur chacun d’eux ; cette
lecture ne transmet aucune de vos données. Vous voyez et révoquez vos connexions dans Paramètres →
Applications connectées.

## 4. Transfert international

4.1. Nos bases de données se trouvent à São Paulo, mais plusieurs prestataires du point 3 sont des
entreprises des États-Unis et y traitent ou y conservent une partie des données : Vercel (tableau de
bord et page d’accueil), Stripe (facturation), ImprovMX (transfert d’e-mails, avec réception
transitoire en France) et Google (boîte e-mail). Les e-mails que le service envoie partent via AWS à São Paulo. Neon (Databricks) conserve les données à São Paulo, mais c’est une
entreprise des États-Unis dont les équipes peuvent y accéder depuis ce pays. Si vous connectez Claude
ou Claude Code (point 3.6), les données que l’application demande vont également aux États-Unis, à
Anthropic, par votre choix.

4.2. **Forme, finalité et durée :** les données vont à ces prestataires pour qu’ils fournissent le
service décrit au point 3, pendant les durées du point 2, ou pendant les durées de conservation des
journaux de chaque prestataire indiquées au point 3.

4.3. **Pays de destination :** États-Unis ; France (uniquement la réception transitoire d’ImprovMX) ;
et autres pays où Google exerce des activités.

4.4. **Base :** l’envoi à Anthropic lorsque vous connectez Claude ou Claude Code (point 3.6) repose sur
votre **consentement spécifique et mis en évidence** (art. 33, VIII) : la page de consentement indique,
avant le bouton **Autoriser**, que les données que l’application demande, y compris votre e-mail, vont
à Anthropic, aux États-Unis, et la connexion n’existe que si vous l’autorisez ; vous retirez votre
consentement à tout moment en révoquant la connexion dans Paramètres → Applications connectées.
Lorsque le transfert est nécessaire à l’exécution du contrat conclu avec vous (facturation, connexion
au tableau de bord et réponses à vos messages), il repose sur l’art. 33, IX, combiné avec
l’art. 7º, V, de la LGPD. La France fait partie de l’Union européenne, reconnue par l’ANPD comme
offrant un niveau de protection adéquat (Resolução CD/ANPD nº 32/2026). Dans les autres cas, les
prestataires s’engagent, dans leurs contrats de traitement des données, à protéger les données et à ne
les traiter que pour fournir le service ; ces contrats **n’incluent pas encore les clauses
contractuelles types approuvées par l’ANPD** (Resolução CD/ANPD nº 19/2024). Nous suivons leur adoption
par les prestataires et changerons de prestataire ou de mécanisme lorsque cela sera nécessaire.

4.5. **Responsabilités et sécurité :** chaque prestataire répond de la sécurité dans son
environnement ; nous répondons envers vous du traitement dans son ensemble. Les mesures que nous
adoptons figurent au point 5.

4.6. Vous pouvez demander l’intégralité des clauses contractuelles de chaque prestataire, ce à quoi
nous répondons dans les 15 jours, et exercer vos droits par le canal du point 1, y compris celui
d’introduire une réclamation contre nous auprès de l’ANPD.

## 5. Sécurité

5.1. Parmi les mesures que nous adoptons :

1. connexions chiffrées (HTTPS avec TLS 1.2 ou supérieur) sur tout le trajet, y compris jusqu’à la
   base de données, avec vérification du certificat ;
2. données de la base chiffrées au repos par le prestataire ;
3. connexion sans mot de passe, par code à usage unique valable 10 minutes, avec limite de
   tentatives ;
4. codes, sessions, clés secrètes, jetons et identifiants des applications connectées conservés
   uniquement sous forme de hash ;
5. sessions avec durée maximale et fermeture après 24 heures sans utilisation ; vous voyez et fermez
   vos sessions dans Paramètres ;
6. journaux techniques sans e-mail, IP, jeton ni clé, conservés pendant 14 jours ;
7. alarmes pour les tentatives de connexion suspectes et les erreurs du service ;
8. code open source, avec revue automatique de sécurité et des dépendances.

5.2. Aucun système n’est parfaitement sûr. En cas d’incident de sécurité susceptible de présenter un
risque ou un dommage important pour vous, nous vous en informons, ainsi que l’ANPD, dans les délais de
la réglementation (Resolução CD/ANPD nº 15/2024).

## 6. Vos droits

6.1. Vous pouvez demander, à tout moment (LGPD, art. 18) :

1. la confirmation que nous traitons des données vous concernant ;
2. l’accès à ces données ;
3. la correction de données incomplètes, inexactes ou obsolètes (par exemple, changer l’e-mail de
   connexion) ;
4. l’anonymisation, le blocage ou la suppression de données inutiles, excessives ou traitées en
   violation de la LGPD ;
5. la portabilité, conformément à la réglementation de l’ANPD ; tant qu’elle n’existe pas, nous
   remettons vos données dans un fichier au format ouvert (JSON) ;
6. l’information sur les personnes avec qui nous partageons vos données (point 3) ;
7. le réexamen des décisions prises uniquement par des moyens automatisés (point 7) ;
8. l’opposition à un traitement fondé sur l’intérêt légitime, si vous estimez qu’il enfreint la
   LGPD ;
9. la suppression des données, dans les cas prévus par la loi. Certaines données doivent néanmoins être
   conservées, en vertu d’une obligation légale (par exemple, celles de facturation) ou pour la défense
   dans une procédure (LGPD,
   art. 16).

6.2. **Comment faire la demande :** écrivez à hello@pyxis-analytics.dev, de préférence depuis l’e-mail
enregistré. S’il n’est pas possible de confirmer que la demande émane de vous, nous vous demanderons
une confirmation simple avant d’y donner suite.

6.3. **Délai :** nous accusons réception et répondons **dans les 15 jours**.

6.4. **Personnes ayant accès à un projet :** l’accès au tableau de bord existe parce que le
propriétaire d’un compte vous a invité. Si vous demandez la suppression de votre e-mail, votre accès
prend fin ; nous en informons le propriétaire du compte. Si vous êtes le propriétaire du compte, la
suppression de votre inscription exige la clôture du compte (Conditions d’utilisation, Clause 11.6),
et les données de facturation restent conservées pendant la durée légale (point 2.2).

6.5. **Visiteurs de la page d’accueil :** comme nous ne conservons ni IP, ni cookie, ni identifiant
persistant, nous n’avons aucun moyen de retrouver vos visites anonymes. Vous pouvez désactiver la
mesure sur la page elle-même ou activer le signal Global Privacy Control dans votre navigateur.

6.6. Vous pouvez également introduire une réclamation auprès de l’**Agência Nacional de Proteção de
Dados (ANPD)**, sur `gov.br/anpd`, et auprès des organismes de protection du consommateur.

## 7. Décisions automatisées

Nous ne prenons pas à votre égard de décisions fondées uniquement sur un traitement automatisé qui
affectent vos intérêts, et nous ne créons pas de profils vous concernant. Les effets automatiques du
service sont des règles identiques pour tous, qui n’évaluent pas votre personne :

1. de sécurité : après trop de tentatives, une demande de code ou de connexion est refusée pendant
   quelques minutes ;
2. contractuels : la réception des événements est mise en pause lorsque le compte atteint 150 % de la
   limite mensuelle sur le forfait payant, ou 100 % sur le forfait gratuit ; l’accès suit le forfait
   et le statut de l’abonnement chez Stripe ; et le compte du forfait gratuit sans événements est
   supprimé après l’avis (Conditions d’utilisation, Clauses 7.2, 7.6 et 9).

La coïncidence d’empreinte de carte (point 2.7) et les mesures pour abus (Conditions d’utilisation,
Clause 18) sont toujours décidées par une personne. Si l’un de ces éléments vous gêne, contactez-nous.

## 8. Enfants et adolescents

Le service est souscrit par des personnes âgées de 18 ans ou plus, et la page d’accueil ne s’adresse ni aux
enfants ni aux adolescents. Si nous apprenons que nous traitons des données d’un enfant sans base
légale, nous les supprimons.

## 9. Modifications de la présente politique

9.1. Nous publions chaque nouvelle version avec sa date d’entrée en vigueur. Si une modification
affecte la manière dont nous traitons vos données, nous prévenons les clients et les personnes ayant
accès par e-mail au moins 30 jours à l’avance, sauf modification imposée par la loi, qui peut
s’appliquer plus tôt.

9.2. Les versions antérieures sont disponibles sur demande.

## 10. Contact

**{{seller.name}}**, responsable du traitement. **hello@pyxis-analytics.dev**. **{{seller.address}}**.
