# Conditions d’utilisation de Pyxis

**Version {{terms.version}} — entrée en vigueur : {{terms.effectiveFrom}}.**

> Ceci est une traduction de courtoisie. Le texte qui fait foi est la version en portugais ([Português](/termos)) ; en cas de divergence entre les deux, la version portugaise prévaut.

Les présentes conditions constituent le contrat entre vous et nous pour l’utilisation de **Pyxis
hébergé** : le service d’analyse de l’utilisation de sites que nous exploitons sur `pyxis-analytics.dev`,
`app.pyxis-analytics.dev` et `api.pyxis-analytics.dev`. Lisez-les attentivement, en particulier les
passages signalés par **Attention**, qui limitent des droits.

## Résumé du contrat

Ce résumé ne remplace pas le texte complet, mais il montre ce qui compte le plus avant de souscrire.

1. **Qui propose le service :** {{seller.name}}, personne physique, CPF (numéro d’identification fiscale des personnes physiques au Brésil)
   {{seller.taxId}} (Clause 1).
2. **Prix :** R$ 39,00 par mois ou R$ 390,00 par an, par carte de crédit, via Stripe, avec
   **renouvellement automatique** jusqu’à ce que vous résiliiez (Clause 8).
3. **Essai gratuit :** 14 jours, une fois par client. La carte est demandée au début, et Stripe envoie
   un rappel 7 jours avant la fin. **Si vous ne résiliez pas avant la fin de l’essai, le premier
   prélèvement a lieu le 15e jour** (Clauses 6.4 et 8.3).
4. **Limites du forfait :** jusqu’à 100 000 événements par mois, jusqu’à 3 sites, jusqu’à 3 personnes
   sur le tableau de bord (vous compris) et 13 mois d’historique. Nous vous prévenons lorsque le
   compte atteint 80 % et 100 % des événements du mois. **Attention : à 150 %, la réception des
   événements est mise en pause jusqu’au 1er du mois suivant**, et les événements envoyés pendant la
   pause sont perdus. Rien n’est facturé au-delà du prix (Clause 7).
5. **Rétractation :** remboursement intégral si vous renoncez dans les 7 jours suivant le premier
   prélèvement. Si vous clôturez le compte sur le tableau de bord dans ce délai, le remboursement est
   automatique (Clause 10).
6. **Résiliation :** à tout moment, de deux façons. Sur le portail Stripe, l’accès continue jusqu’à
   la fin de la période payée. En clôturant le compte sur le tableau de bord, **l’accès prend fin
   immédiatement**. **Attention : après les 7 jours de rétractation, il n’y a pas de remboursement
   au prorata de la période déjà payée**, dans aucun des deux cas (Clause 11).
7. **Suppression des données :** **30 jours après la fin de l’accès, le compte, les projets et tous
   les événements sont définitivement supprimés.** D’ici là, vous exportez les événements depuis le
   tableau de bord (Clause 11).
8. **Disponibilité :** **Attention : il n’y a pas de garantie de disponibilité (SLA)** ; nous faisons
   nos meilleurs efforts pour maintenir le service en ligne (Clause 15). Assistance par e-mail, avec
   réponse sous 2 jours ouvrés au plus (Clause 16).
9. **Vos principales obligations :** **ne pas envoyer de données personnelles dans les événements**
   (nom, e-mail, CPF, téléphone, etc.), informer les visiteurs de votre site de la mesure et ne pas
   utiliser le service de manière abusive (Clause 12).
10. **Attention : suspension et clôture pour abus.** En cas d’abus (par exemple, des données
    personnelles dans les événements, mesurer qui a demandé à ne pas être mesuré, trafic falsifié,
    attaque, fraude ou essai gratuit répété), nous pouvons suspendre la partie concernée du service
    et, en cas grave ou répété, mettre fin au contrat. En règle générale, nous vous prévenons
    avant et vous donnons un délai pour corriger ; nous indiquons toujours le motif et vous pouvez
    contester (Clause 18).
11. **Données personnelles :** vous êtes le responsable du traitement des données des visiteurs de
    votre site ; nous sommes le sous-traitant (Clause 14 et Accord de traitement des données). Si une
    personne ayant accès connecte Claude ou Claude Code à Pyxis, les chiffres qu’elle demande sont
    transmis à Anthropic, qui n’est pas notre fournisseur (Clause 13.10).

---

## Clause 1 — Qui propose le service et comment nous contacter

1.1. Pyxis hébergé est proposé par **{{seller.name}}**, personne physique, inscrit au CPF sous le nº **{{seller.taxId}}**, domicilié
à **{{seller.address}}** (« nous »). **Pyxis** est le nom du service.

1.2. Contact pour tout sujet, y compris la résiliation, la rétractation, l’assistance, la contestation
d’une suspension et les données personnelles : **hello@pyxis-analytics.dev**.

1.3. « Vous » désigne la personne physique ou morale qui souscrit au service pour mesurer un ou
plusieurs sites.

## Clause 2 — Termes utilisés dans les présentes conditions

2.1. **Service :** Pyxis hébergé par nous : l’API qui reçoit les données et y répond
(`api.pyxis-analytics.dev`), le tableau de bord (`app.pyxis-analytics.dev`), le récapitulatif hebdomadaire
par e-mail et l’accès par jetons et par applications connectées, y compris via le serveur MCP.

2.2. **Traceur :** le paquet `pyxis-analytics` (open source) que vous installez sur votre site pour
envoyer des événements au service.

2.3. **Projet :** la configuration d’un de vos sites dans le service (nom, adresses autorisées, fuseau
horaire, événement de conversion, clés et événements).

2.4. **Événement :** chaque enregistrement envoyé par le traceur ou par votre intégration, comme une
page vue ou une action que vous avez balisée.

2.5. **Personnes ayant accès :** le propriétaire du compte et les personnes qu’il invite à se
connecter au tableau de bord.

2.6. **Période :** le mois ou l’année payé(e) de votre abonnement.

2.7. **Consommateur :** quiconque souscrit au service en tant que destinataire final, au sens de
l’art. 2º du Código de Defesa do Consumidor (Code brésilien de protection du consommateur, Lei
nº 8.078/1990).

2.8. **Compte :** l’inscription de la personne qui souscrit, à laquelle appartiennent l’abonnement,
les projets et les personnes ayant accès.

2.9. **Propriétaire du compte :** la personne qui a effectué l’inscription (ou que vous avez désignée
lorsque nous avons créé le compte à votre demande) et qui, en votre nom, administre les projets, les
clés, les personnes, les exportations et la facturation.

2.10. **Fin de l’accès :** la date à laquelle le compte cesse de recevoir des événements et de pouvoir
modifier les projets : la fin de la période payée ou de l’essai après une résiliation (Clause 11.2),
la clôture du compte (Clauses 11.6 et 18.7) ou la fin de l’abonnement pour défaut de paiement
(Clause 9.2).

## Clause 3 — Acceptation, qui peut souscrire et documents du contrat

3.1. Vous acceptez les présentes conditions de l’une des façons suivantes :

1. **lors de l’inscription sur le tableau de bord** (`app.pyxis-analytics.dev/sign-up`), en cochant
   la case d’acceptation des Conditions d’utilisation, de l’Accord de traitement des données et de
   la Politique de confidentialité, qui indique le numéro de version. Nous conservons la version
   acceptée ainsi que la date et l’heure de l’acceptation (sans conserver votre IP). La page de
   paiement de Stripe demande à nouveau l’acceptation avant l’abonnement ;
2. **lorsque nous créons le compte à votre demande** (Clause 6.2), en répondant à notre e-mail par la
   confirmation de l’acceptation de la version qui y est indiquée, avant que nous n’ouvrions l’accès.

Si vous n’êtes pas d’accord, ne vous inscrivez pas et ne vous abonnez pas.

3.2. Pour souscrire, vous devez avoir 18 ans ou plus et la capacité civile. Si vous souscrivez au nom
d’une entreprise, vous déclarez avoir les pouvoirs pour le faire, et l’entreprise devient « vous ».

3.3. Le service est proposé à des clients au Brésil, avec un prix en reais.

3.4. Le contrat est constitué des présentes conditions et de deux annexes :

1. **Annexe 1 — Accord de traitement des données personnelles**, qui régit les données des visiteurs
   de vos sites ;
2. **Annexe 2 — Politique de confidentialité de Pyxis**, qui explique les données que nous traitons à
   votre sujet et au sujet des personnes ayant accès.

En matière de données personnelles, l’Annexe 1 prévaut sur les présentes conditions.

3.5. Après la souscription, l’e-mail de bienvenue indique la version acceptée et l’adresse
permanente de cette version, où vous pouvez enregistrer ou imprimer le texte complet. Sur demande,
nous envoyons le texte sous forme de fichier. Les versions antérieures sont disponibles sur demande.

## Clause 4 — Ce que fait le service

4.1. Le traceur installé sur votre site envoie au service les pages vues et les événements que vous
balisez. Le service conserve ces événements et présente l’analyse sur le tableau de bord, uniquement
aux personnes ayant accès : vue d’ensemble, visites, chronologie de chaque visite, entonnoir,
fonctionnalités utilisées, échecs des appels à l’API de votre site, acquisition, appareils et horaires.

4.2. Ce que le service **ne fait pas**, par conception :

1. il ne crée pas de cookies sur votre site ;
2. il ne conserve pas l’adresse IP du visiteur : l’IP est utilisée uniquement dans la mémoire du
   serveur, pendant quelques minutes, pour limiter les abus ;
3. il ne conserve pas le navigateur complet (user agent), seulement la catégorie d’appareil et la
   famille du navigateur et du système ;
4. il ne conserve pas la ville, seulement le pays et l’État ;
5. il ne conserve pas l’adresse complète de la page : seulement le chemin sous forme de modèle, sans
   paramètres, sauf ceux de campagne (`utm_source`, `utm_medium`, `utm_campaign`) ;
6. il n’envoie rien lorsque le navigateur du visiteur demande à ne pas être suivi (Global Privacy
   Control ou Do Not Track) ;
7. il ne reconnaît pas le visiteur anonyme lors d’une autre visite : chaque visite a un numéro
   aléatoire qui disparaît à la fermeture de l’onglet ou après 30 minutes d’inactivité.

4.3. **Attention :** les chiffres du tableau de bord sont une mesure, pas un comptage exact. Les
visites de ceux qui bloquent le traceur, de ceux qui demandent à ne pas être suivis, des robots et de
ceux qui étaient hors connexion n’apparaissent pas, et les événements envoyés pendant que le service
est hors ligne ou que la réception est en pause (Clauses 7.2, 15 et 18) sont perdus (le traceur
réessaie pendant quelques secondes tant que la page est ouverte, mais pas lorsque la réception est en
pause).

4.4. Font également partie du forfait :

1. le **récapitulatif hebdomadaire par e-mail**, chaque lundi, que chaque personne ayant accès peut
   désactiver dans Paramètres ;
2. des **jetons d’accès en lecture seule**, créés dans Paramètres, pour que des programmes et des
   agents d’intelligence artificielle consultent les mêmes chiffres que le tableau de bord ;
3. le **serveur MCP**, de deux façons : le programme open source `pyxis-mcp`, qui tourne sur votre
   ordinateur et utilise un jeton d’accès ; ou l’adresse `https://api.pyxis-analytics.dev/mcp`, que
   Claude et Claude Code utilisent comme connecteur après qu’une personne ayant accès a autorisé la
   connexion (Clause 13.10) et que d’autres programmes utilisent avec un jeton d’accès ;
4. les routes de l’API pour **supprimer ou copier les données d’une personne identifiée**, avec la
   clé secrète du projet ;
5. l’**exportation de tous les événements d’un projet** sous forme de fichier, depuis le tableau de
   bord (Clause 11.5).

## Clause 5 — Open source et service hébergé

5.1. Le code de Pyxis est ouvert, sous licence MIT, dans les dépôts publics `pyxis-api`, `pyxis-sdk`,
`pyxis-web` et `pyxis-mcp`. Toute personne peut lire, copier, modifier et exécuter le code par
elle-même, dans les conditions de cette licence.

5.2. Les présentes conditions ne concernent que le **service hébergé par nous**. Rien ici ne restreint
ce que la licence MIT permet. Si vous exécutez Pyxis sur votre propre infrastructure, les présentes
conditions ne s’appliquent pas à cette installation.

## Clause 6 — Comment cela commence : inscription sur le tableau de bord ou compte créé sur demande

6.1. **Inscription sur le tableau de bord.**

1. Sur `app.pyxis-analytics.dev/sign-up`, vous choisissez le forfait (mensuel ou annuel), indiquez
   votre e-mail, acceptez les conditions (Clause 3.1) et confirmez l’e-mail au moyen d’un code à
   6 chiffres qui lui est envoyé.
2. Ensuite, vous indiquez votre carte sur la page de paiement de Stripe, ce qui démarre l’essai
   gratuit (Clause 8.3).
3. Une fois l’abonnement confirmé par Stripe, le compte est prêt : vous créez vos projets sur le
   tableau de bord (jusqu’à 3), avec l’adresse du site, le fuseau horaire et, si vous le souhaitez,
   l’événement de conversion, et vous recevez la clé publique et l’extrait d’installation. La
   personne qui a effectué l’inscription est le propriétaire du compte.

Si vous ne terminez pas la page de paiement de Stripe, le compte reste incomplet, sans projets, et il
est supprimé 7 jours après l’inscription. D’ici là, vous pouvez terminer l’abonnement en vous
reconnectant au tableau de bord.

6.2. **Compte créé sur demande.** Nous pouvons aussi créer le compte pour vous, sur demande adressée
à hello@pyxis-analytics.dev, par exemple lorsqu’il n’est pas possible de terminer l’inscription sur
le tableau de bord ou pour un compte gratuit que nous proposerions. Dans ce cas, nous convenons par
e-mail du forfait et du mode de paiement, l’acceptation suit la Clause 3.1, point 2, et nous ouvrons
l’accès dans les 2 jours ouvrés suivant l’acceptation et, s’il y a facturation, l’abonnement. Pour un
compte gratuit, il n’y a pas de facturation ; le reste des présentes conditions s’applique de la même
manière, et nous pouvons mettre fin à la gratuité avec un préavis de 30 jours, après lequel vous
pouvez souscrire au forfait ou partir.

6.3. Nous ne pouvons refuser une inscription ou une demande de compte que pour un motif objectif :
(a) le site n’est pas compatible avec l’utilisation acceptable (Clause 12) ; (b) le volume attendu
dépasse largement les limites du forfait ; (c) la même personne ou entreprise a eu un compte clôturé
pour abus grave (Clause 18.7) au cours des 12 mois précédents ; ou (d) essai gratuit répété
(Clause 6.4). Si nous refusons après un prélèvement, nous remboursons le montant intégral.

6.4. **L’essai gratuit vaut une fois par client :** une fois par compte (un compte qui a déjà eu un
abonnement ne bénéficie pas d’un nouvel essai en se réabonnant) et une fois par personne ou
entreprise, même sur un autre compte, avec un autre e-mail ou une autre carte. Pour détecter un essai
répété avec la même carte, nous conservons pendant 12 mois l’« empreinte » de la carte calculée par
Stripe, jamais le numéro de la carte, comme l’explique la Politique de confidentialité (point 2.7). Ce
qui se passe en cas d’essai répété figure à la Clause 18.11.

## Clause 7 — Forfait et limites

7.1. Le forfait comprend :

| Élément | Limite |
|---|---|
| Événements reçus par mois, tous les projets du compte confondus | jusqu’à 100 000 |
| Sites (projets) | jusqu’à 3 |
| Personnes ayant accès au tableau de bord | jusqu’à 3, propriétaire du compte compris |
| Historique | 13 mois (les événements plus anciens sont supprimés chaque jour) |
| Récapitulatif hebdomadaire par e-mail | inclus |
| Jetons d’accès, serveur MCP et connecteur Claude | inclus |
| Exportation des événements d’un projet | depuis le tableau de bord, jusqu’à 3 par projet et par jour |
| Assistance | par e-mail, réponse sous 2 jours ouvrés au plus |

7.2. **Attention : utilisation au-delà de la limite.**

1. L’utilisation du mois est la somme des événements conservés dans tous les projets du compte datés
   de ce mois. Le mois est le mois civil compté en UTC (temps universel coordonné), qui, à l’heure de
   Brasília, commence à 21 h le dernier jour du mois précédent.
2. Le service mesure l’utilisation une fois par jour, pendant la nuit. L’utilisation mesurée apparaît
   dans Compte et facturation, sur le tableau de bord.
3. Lorsque la mesure quotidienne constate 80 % puis 100 % de la limite (80 000 et 100 000
   événements), nous prévenons le propriétaire du compte par e-mail, une fois par niveau et par mois.
   **Jusqu’à 150 %, rien n’est coupé.**
4. **Lorsque la mesure quotidienne constate 150 % de la limite (150 000 événements), la réception des
   événements de tous les projets du compte est mise en pause jusqu’au 1er du mois suivant**, et nous
   vous prévenons par e-mail. Pendant la pause, le service refuse les événements (réponse
   `403 quota_exceeded`), qui **ne sont pas conservés et ne peuvent pas être récupérés**. Le tableau
   de bord continue d’afficher les données déjà conservées. La réception reprend d’elle-même au début
   du mois suivant. Comme la mesure est quotidienne, le compte peut dépasser légèrement 150 % avant le
   début de la pause.
5. **Nous ne facturons rien au-delà du prix du forfait** pour l’utilisation au-delà de la limite.
6. Si le compte dépasse fréquemment la limite, nous pouvons proposer par e-mail un forfait ou un prix
   adaptés au volume. L’acceptation est facultative.

7.3. Le service comporte des limites techniques contre les abus, comme le nombre de lots d’événements
par minute par adresse et par projet et la taille de chaque lot. Ces limites peuvent changer pour
protéger le service, sans réduire la limite mensuelle d’événements de votre forfait.

7.4. La suppression des événements de plus de 13 mois est automatique et fait partie du service :
**nous ne conservons pas d’historique plus ancien**.

## Clause 8 — Prix, essai gratuit et facturation

8.1. **Prix :** R$ 39,00 par mois ou R$ 390,00 par an. Il n’y a pas de frais d’installation ni
d’autres frais.

8.2. **Mode de paiement :** carte de crédit, traitée par Stripe. **Nous ne voyons ni ne conservons le
numéro de votre carte.** À ce jour, nous n’acceptons ni Pix (paiement instantané brésilien) ni boleto
(bordereau de paiement bancaire brésilien).

8.3. **Essai gratuit :** 14 jours, comptés à partir de la confirmation de l’abonnement sur la page de
paiement de Stripe, une fois par client (Clause 6.4). La carte est obligatoire au début, et rien n’est
prélevé pendant l’essai. Stripe envoie un rappel par e-mail 7 jours avant la fin de l’essai, avec le
lien pour résilier. **Si vous ne résiliez pas avant la fin de l’essai (sur le portail Stripe ou en
clôturant le compte sur le tableau de bord), le premier prélèvement a lieu le 15e jour** puis, à
partir de là, à chaque nouvelle période ; sur le relevé de la carte, ce premier prélèvement est
indiqué comme fin de l’essai. Si vous résiliez pendant l’essai, rien n’est prélevé. Un compte qui a
déjà eu un abonnement n’a pas de nouvel essai en se
réabonnant : la facturation commence le jour du nouvel abonnement.

8.4. **Renouvellement automatique :** l’abonnement se renouvelle de lui-même à la fin de chaque
période, avec prélèvement sur la même carte, jusqu’à ce que vous résiliiez (Clause 11). La date du
prochain prélèvement apparaît dans Compte et facturation, sur le tableau de bord, et Stripe envoie le
reçu de chaque prélèvement par e-mail.

8.5. **Changement de prix :** nous vous prévenons par e-mail **au moins 30 jours à l’avance**. Le
nouveau prix ne s’applique qu’à partir du renouvellement qui suit la fin de ce délai ; **le prix de la
période déjà payée ne change pas**. Si vous n’êtes pas d’accord, résiliez avant le renouvellement,
sans frais.

8.6. **Nota fiscal (facture fiscale brésilienne) :** le reçu de chaque prélèvement est envoyé par
Stripe. L’émission d’une nota fiscal dépend de notre régime fiscal ; si vous avez besoin d’une nota
fiscal, renseignez-vous avant de souscrire.

## Clause 9 — Défaut de paiement

9.1. Si le prélèvement d’un renouvellement échoue, Stripe vous prévient par e-mail, avec un lien pour
mettre à jour la carte, et réessaie jusqu’à 8 fois au cours des 2 semaines suivantes ; le tableau de
bord affiche aussi un avertissement (Compte et facturation → Gérer la facturation). Si la banque vous
demande de confirmer le paiement (3D Secure), Stripe envoie le lien de confirmation par e-mail. Stripe
prévient aussi par e-mail lorsque la carte enregistrée est sur le point d’expirer. Pendant ce délai,
le service continue de fonctionner.

9.2. Si le paiement n’est pas effectué après ces tentatives (jusqu’à 2 semaines après le premier
échec), ou si la confirmation demandée par la banque n’est pas faite dans les 15 jours, Stripe met fin
à l’abonnement, et c’est la fin de l’accès : au plus tard le lendemain, les clés des projets sont
révoquées et les sites cessent d’envoyer des événements ; le tableau de bord reste disponible
uniquement pour la consultation et l’exportation jusqu’à la suppression.

9.3. Les données sont supprimées 30 jours après la fin de l’accès (Clause 11.4). D’ici là, vous
pouvez revenir comme l’indique la Clause 11.5, point 3, sans perdre de données.

## Clause 10 — Droit de rétractation

10.1. Comme la souscription se fait par internet, le consommateur peut renoncer au contrat dans les
7 jours suivant la souscription (Código de Defesa do Consumidor, art. 49). Pendant l’essai gratuit,
rien n’est prélevé : il suffit de résilier.

10.2. **Nous étendons ce droit à tous les clients :** si vous renoncez dans les **7 jours suivant le
premier prélèvement** (du forfait mensuel ou annuel), nous remboursons **le montant intégral** de ce
prélèvement, sans que vous ayez à en expliquer le motif.

10.3. Pour l’exercer, utilisez l’un des moyens suivants :

1. **clôturez le compte sur le tableau de bord** (Compte et facturation → Fermer le compte), le
   même canal que celui utilisé pour souscrire. Dans le délai, le remboursement du montant intégral
   est demandé automatiquement à Stripe, et l’écran affiche le montant remboursé ;
2. ou envoyez un e-mail à hello@pyxis-analytics.dev, depuis l’e-mail du propriétaire du compte, avec
   le mot « rétractation ».

Résilier l’abonnement sur le portail Stripe, à lui seul, ne déclenche pas le remboursement : utilisez
l’un des deux moyens ci-dessus.

10.4. Par le tableau de bord, la confirmation apparaît immédiatement à l’écran, et aussi par e-mail.
Par e-mail, nous accusons réception par la même voie et demandons le remboursement à Stripe dans les
2 jours ouvrés. Si le remboursement automatique échoue, nous le demandons manuellement dans les
2 jours ouvrés et vous en informons. Stripe communique le remboursement à l’émetteur de la carte ; le
délai pour qu’il apparaisse sur le relevé dépend de l’émetteur.

10.5. Avec la rétractation, le compte est clôturé comme à la Clause 11.6 : l’accès prend fin
immédiatement et les données suivent la Clause 11.4.

## Clause 11 — Résiliation et clôture du compte par vous

11.1. Vous pouvez partir à tout moment, de deux façons, aux effets différents :

1. **résilier l’abonnement sur le portail Stripe** (Compte et facturation → Gérer la facturation, ou
   par le lien des e-mails de Stripe) : prend effet à la fin de la période payée ou de l’essai
   (Clause 11.2) ;
2. **clôturer le compte sur le tableau de bord** (Compte et facturation → Fermer le compte) : prend
   effet immédiatement (Clause 11.6).

Si vous préférez, faites la demande par e-mail à hello@pyxis-analytics.dev, depuis l’e-mail du
propriétaire du compte, en indiquant laquelle des deux vous souhaitez. Sans cette indication, nous
effectuons la résiliation du point 1. Nous accusons réception par la même voie.

11.2. **Résiliation sur le portail Stripe :** l’accès continue jusqu’à la fin de la période payée (ou
de l’essai) et **il n’y a pas de nouveau prélèvement**. Au plus tard le lendemain de la fin de l’accès,
les clés des projets sont révoquées et les sites cessent d’envoyer des événements ; le tableau de bord
reste disponible uniquement pour la consultation et l’exportation jusqu’à la suppression.

11.3. **Attention : en dehors du droit de rétractation (Clause 10), il n’y a pas de remboursement au
prorata de la période déjà payée,** ni pour le forfait mensuel ni pour l’annuel, dans aucune des deux
façons de partir. Il n’y a de remboursement que dans les cas que les présentes conditions prévoient
expressément : Clauses 6.3, 15.7, 18.9, 18.10, 18.13, 20.2, 21.3 et 22.1 et Clauses 9.2 et 16.2 de
l’Annexe 1.

11.4. **Attention : suppression des données.** **30 jours après la fin de l’accès** (Clause 2.10), une
routine automatique supprime définitivement le compte, les projets et tout ce qui leur appartient,
comme décrit à la Clause 12 de l’Annexe 1. Nous prévenons le propriétaire du compte par e-mail à la
fin de l’accès, 7 jours avant la suppression et lorsqu’elle est effectuée. Après cela, **il n’est plus
possible de récupérer les données**. Restent conservés uniquement les enregistrements de facturation
que la loi impose de conserver, l’enregistrement de prévention de l’essai gratuit répété (Politique de
confidentialité, points 2.2 et 2.7) et ce qu’une loi ou un ordre d’une autorité impose de préserver
(Clause 12.6 de l’Annexe 1).

11.5. **Exporter les événements et revenir.**

1. Le propriétaire du compte exporte tous les événements d’un projet dans Paramètres du projet. Le
   fichier (CSV compressé) est prêt en quelques minutes, l’avis arrive par e-mail, et le fichier peut
   être téléchargé sur le tableau de bord pendant **7 jours**, avec un nouveau lien à chaque
   téléchargement, valable 5 minutes ; après cela, le fichier est supprimé. Il y a jusqu’à
   3 exportations par projet et par jour. L’exportation fonctionne pendant le contrat et dans les
   30 jours suivant la fin de l’accès.
2. Si l’exportation par le tableau de bord ne fonctionne pas, demandez la copie à
   hello@pyxis-analytics.dev : nous envoyons le fichier dans les 10 jours ouvrés suivant la demande
   et, si la demande arrive près de la date de suppression, nous reportons la suppression jusqu’à la
   remise de la copie.
3. Avant la suppression, vous pouvez **revenir** sans perdre de données : dans Compte et facturation,
   choisissez « Se réabonner », ou écrivez à hello@pyxis-analytics.dev et nous réactivons
   l’abonnement. Dans les deux cas, il n’y a pas de nouvel essai gratuit et la facturation commence à
   la réactivation. Les clés révoquées ne reviennent pas : vous créez de nouvelles clés sur le tableau
   de bord et les remplacez sur votre site.

11.6. **Clôturer le compte depuis le tableau de bord.** Seul le propriétaire du compte peut le
clôturer, dans Compte et facturation, en saisissant son e-mail pour confirmer. **Attention : la clôture
prend effet immédiatement et ne peut pas être annulée depuis le tableau de bord :**

1. l’abonnement est résilié immédiatement chez Stripe, sans nouveaux prélèvements ;
2. les clés de tous les projets sont révoquées immédiatement, et les sites cessent d’envoyer des
   événements ;
3. le tableau de bord reste disponible uniquement pour la consultation et l’exportation (Clause 11.5)
   jusqu’à la suppression ;
4. les données sont supprimées 30 jours après la clôture (Clause 11.4) ;
5. si la clôture est effectuée dans les 7 jours suivant le premier prélèvement, le montant de ce
   prélèvement est intégralement remboursé (Clause 10) ; en dehors de ce cas, **il n’y a pas de
   remboursement au prorata de la période payée** (Clause 11.3) ;
6. l’écran confirme la clôture, la date de la suppression et le montant remboursé, et nous envoyons la
   confirmation par e-mail.

Clôturer pendant l’essai gratuit n’entraîne aucun prélèvement. Si Stripe ne parvient pas à résilier
l’abonnement, rien n’est clôturé et l’écran vous en avertit. Si vous changez d’avis avant la
suppression, la Clause 11.5, point 3, s’applique.

## Clause 12 — Utilisation acceptable, abus et vos responsabilités

12.1. Vous vous engagez à utiliser le service de bonne foi, uniquement pour mesurer l’utilisation de
vos sites. **Constitue un abus** l’un quelconque des comportements ci-dessous, pratiqué par vous, par
les personnes ayant accès à votre compte ou par quiconque utilise vos clés, jetons ou connexions avec
votre permission :

*Données personnelles et vie privée*

1. envoyer des **données personnelles directes** dans les événements : nom, e-mail, téléphone, CPF,
   adresse, numéro de document, texte saisi par le visiteur ou toute donnée qui identifie une personne
   à elle seule ;
2. envoyer des **données personnelles sensibles** (santé, origine raciale ou ethnique, religion,
   opinion politique, affiliation syndicale, vie sexuelle, donnée génétique ou biométrique) ;
3. tenter de **contourner la barrière de données personnelles** du serveur (Clause 12.2), par exemple
   en divisant, en encodant ou en déguisant un e-mail, un document ou un téléphone pour qu’ils la
   franchissent ;
4. utiliser dans la fonction `identify` autre chose qu’un **identifiant interne et opaque** du compte
   dans votre système, comme l’e-mail, le CPF ou le téléphone ;
5. **mesurer qui a demandé à ne pas être mesuré** : désactiver, contourner ou modifier le respect par
   le traceur des signaux Global Privacy Control et Do Not Track et de l’option de ne pas être mesuré
   (`optOut`), ou envoyer des événements de ces personnes par un autre chemin ;
6. utiliser le service conjointement avec des techniques d’empreinte du navigateur (fingerprinting) ou
   d’autres moyens pour reconnaître des visiteurs anonymes ;

*Trafic et sécurité*

7. envoyer des **événements falsifiés ou automatisés** pour gonfler, fausser ou surcharger les
   chiffres ou le service (des tests raisonnables de votre propre installation ne constituent pas un
   abus) ;
8. envoyer des événements depuis des **sites qui ne sont pas les vôtres** ni ceux de quelqu’un qui
   vous y a autorisé, ou enregistrer comme origine d’un projet le site d’autrui ;
9. utiliser la **clé publique, la clé secrète, le jeton ou la connexion d’un autre client** ;
10. **attaquer le service**, tenter d’accéder aux données d’autres clients ou à des parties du
    service qui ne sont pas les vôtres, ou tester des vulnérabilités sans notre autorisation écrite
    (signaler de bonne foi une faille de sécurité à hello@pyxis-analytics.dev ne constitue pas un
    abus) ;
11. **contourner les limites** de débit, le quota mensuel (Clause 7.2) ou les limites du forfait
    (Clause 7.1), par exemple en répartissant l’envoi d’un même site entre plusieurs comptes ou
    clés ;
12. **publier ou partager** la clé secrète ou un jeton d’accès délibérément ou de manière répétée
    (dans un dépôt de code public, sur une page, sur un forum ou dans le code qui s’exécute dans le
    navigateur) ; une fuite accidentelle ne constitue pas un abus, mais la clé ou le jeton divulgués
    sont révoqués comme l’indique la Clause 13.9 ;

*Compte, forfait et paiement*

13. revendre, louer ou céder l’accès au service hébergé à des tiers, ou partager le compte pour
    dépasser les limites de personnes et de projets du forfait, sans accord écrit avec nous (mesurer,
    en tant qu’agence, les sites de vos clients qui l’ont autorisé, dans les limites du forfait, ne
    constitue pas une revente ; Clause 3.2 de l’Annexe 1) ;
14. créer plus d’un compte, ou utiliser une autre personne, un autre e-mail ou une autre carte, pour
    **répéter l’essai gratuit** ou pour échapper à une limite ou à un prélèvement ;
15. **fraude au paiement** : utiliser une carte sans l’autorisation de son titulaire ou de fausses
    données de facturation, ou contester de mauvaise foi un prélèvement auprès de l’émetteur de la
    carte, par exemple en déclarant ne pas reconnaître un prélèvement que vous avez autorisé et dont
    vous avez utilisé le service, sans nous avoir d’abord demandé la résiliation ou le remboursement
    (contester un prélèvement indu est votre droit ; Clause 18.12) ;

*Loi et tiers*

16. utiliser le service pour une activité illégale, pour mesurer des sites au contenu illégal ou pour
    violer les droits de tiers (vie privée, propriété intellectuelle, droit à l’image) ;
17. toute autre utilisation contraire à la loi ou aux présentes conditions qui cause, ou crée un risque
    concret et démontrable de causer, un dommage aux autres clients, à l’infrastructure du service,
    aux personnes concernées ou à nous, y compris une responsabilité légale.

12.2. Le serveur écarte automatiquement les valeurs ayant la forme d’un e-mail et les séquences de
10 chiffres ou plus (comme le CPF, le CNPJ — numéro d’immatriculation des personnes morales au Brésil — et le
téléphone). **Attention :** cette barrière est une
seconde couche et ne reconnaît ni les noms, ni les adresses, ni les textes libres. **La
responsabilité de ce que votre site envoie vous incombe.**

12.3. Vous vous engagez également à :

1. publier sur votre site un avis de confidentialité décrivant la mesure (un modèle figure à
   l’Annexe IV de l’Accord de traitement des données) et maintenir cet avis en conformité avec ce que
   votre site envoie ;
2. si votre site s’adresse à des enfants ou à des adolescents, évaluer au préalable la mesure au
   regard de l’art. 14 de la LGPD (Lei Geral de Proteção de Dados Pessoais, loi générale brésilienne
   sur la protection des données personnelles) ;
3. garder secrets la clé secrète et les jetons d’accès (Clause 13) ;
4. maintenir à jour les e-mails du propriétaire du compte et des personnes ayant accès (Clause 23) ;
5. répondre à nos avertissements concernant un abus dans le délai indiqué (Clause 18).

12.4. **Comment nous détectons un abus.** Nous ne surveillons pas le contenu de vos projets de manière
continue. Nous détectons un abus à partir de ce que le service conserve ou reçoit déjà : les alertes
automatiques de sécurité (Annexe II de l’Accord, point 10) ; les journaux techniques de l’API, qui
indiquent quand un événement ou une propriété a été refusé et par quelle règle, sans la valeur
refusée, et qui disparaissent au bout de 14 jours ; les événements conservés dans le projet, consultés
uniquement lorsque c’est nécessaire (Clause 7.2 de l’Accord) ; les données de facturation de Stripe ;
l’enregistrement d’essai gratuit (Politique de confidentialité, point 2.7) ; et ce qu’une autre
personne ou une autorité nous signale. **Le service ne conserve ni l’IP ni le navigateur complet, et
ne commence pas à les conserver pour enquêter sur un abus.**

## Clause 13 — Personnes ayant accès, clés et jetons

13.1. **Personnes ayant accès.** Le compte peut réunir jusqu’à 3 personnes ayant accès au tableau de bord,
propriétaire compris. Le propriétaire invite une personne par son e-mail, pour un ou plusieurs projets
du compte, dans Paramètres → Personnes. La personne reçoit un e-mail d’invitation et se connecte au
tableau de bord avec un code envoyé à son e-mail, sans mot de passe. Le propriétaire retire une
personne sur le même écran, à tout moment.

13.2. Les personnes invitées voient les chiffres, les paramètres et la liste des personnes des projets
auxquels elles ont été invitées, et gèrent leurs propres sessions, jetons, applications connectées et
récapitulatif hebdomadaire. Seul le propriétaire modifie
les projets, les clés, les personnes et la facturation, et lui seul exporte des événements ou clôture
le compte.

13.3. Lorsque le propriétaire retire une personne d’un projet, son accès à ce projet prend fin
immédiatement, y compris par les jetons d’accès qu’elle a créés et par les applications qu’elle a
connectées. Ce qu’elle a déjà vu ou transféré vers un autre programme par un jeton ou par une
application connectée échappe à notre contrôle. Son inscription suit la Politique de confidentialité
(point 2.1).

13.4. Vous êtes responsable de tenir à jour la liste des personnes (par exemple, retirer quiconque a
quitté votre équipe) et de ce que font les personnes ayant accès dans le service. En invitant une
personne, vous confirmez qu’elle sait qu’elle recevra des e-mails de Pyxis (invitation, codes de
connexion et récapitulatif hebdomadaire) et qu’elle connaît les présentes conditions.

13.5. Chaque personne voit et ferme ses propres sessions dans Paramètres, y compris « se déconnecter
partout ». Se déconnecter partout ne révoque pas les jetons et ne
déconnecte pas les applications : chacun est révoqué dans sa propre liste (Clauses 13.8 et 13.10).

13.6. **Clé publique :** elle est placée sur votre site et ne fait qu’identifier le projet. Le service
n’accepte les événements portant cette clé que s’ils proviennent des adresses enregistrées dans le
projet. Le propriétaire change la clé publique dans Paramètres.

13.7. **Clé secrète :** elle n’est nécessaire que si vous utilisez les routes de suppression et de
copie de données. Le propriétaire la crée dans Paramètres, et elle n’apparaît qu’une seule fois.
Conservez-la uniquement sur votre serveur, jamais dans le navigateur ni dans un dépôt de code. Nous ne
la conservons que sous forme de hash : si vous la perdez, révoquez-la et créez-en une autre.

13.8. **Jetons d’accès :** ils ne font que lire les chiffres du tableau de bord et sont valables 30,
90 ou 365 jours. La personne qui crée un jeton est responsable de sa conservation et peut le révoquer
à tout moment dans Paramètres. Les données qu’un jeton lit vont au programme dans lequel il a été
utilisé (par exemple, un outil d’intelligence artificielle avec le serveur MCP, sur votre ordinateur
ou par l’adresse de la Clause 4.4, point 3) ; **le choix et l’utilisation de cet outil relèvent de
votre responsabilité**.

13.9. Si une clé fuit, le propriétaire la révoque et en crée une autre immédiatement, dans
Paramètres ; s’il n’y parvient pas, prévenez-nous : nous révoquons la clé dans un délai de 1 jour
ouvré. Un jeton divulgué peut être révoqué immédiatement, par la personne qui l’a créé, dans
Paramètres. Si nous trouvons une clé secrète ou un jeton publiés, nous les révoquons immédiatement,
pour vous protéger, même sans abus, et nous vous en informons ensuite (Clause 18.4, point 4).

13.10. **Applications connectées (connecteur Claude).**

1. **Quelles applications.** À ce jour, seuls **Claude** et **Claude Code**, d’Anthropic, se
   connectent à Pyxis sans jeton, par l’adresse `https://api.pyxis-analytics.dev/mcp`. Nous
   reconnaissons chacun par le document d’identification qu’Anthropic publie et n’acceptons pas
   d’autres applications par ce chemin. D’autres programmes utilisent la même adresse avec un jeton
   d’accès (Clause 13.8).
2. **Qui connecte.** Toute personne ayant accès, en son nom propre. Lorsque l’application demande la
   connexion, la personne se connecte au tableau de bord et voit, sur une page de Pyxis,
   l’application, l’endroit où la réponse est renvoyée (avec un avertissement lorsqu’elle va vers un
   programme sur son propre ordinateur), ce que l’application pourra lire et la liste des projets. La
   connexion n’existe que si la personne choisit **Autoriser** ; la demande est valable
   10 minutes.
3. **Ce que l’application lit.** **Elle ne fait que lire**, et uniquement ce que cette personne voit
   sur le tableau de bord, dans tous les projets qu’elle peut ouvrir : les chiffres, les listes de
   visites et la chronologie de chaque visite, avec l’identifiant interne que votre site a envoyé par
   la fonction `identify`, et l’e-mail de connexion de la personne elle-même. Elle ne modifie jamais
   rien et ne lit jamais les clés secrètes, les jetons, les sessions, la liste des personnes ayant
   accès ni la facturation.
4. **Où vont les données.** Les données que l’application demande sortent de Pyxis vers
   **Anthropic**, aux États-Unis : dans Claude, directement vers ses serveurs ; dans Claude Code,
   d’abord vers l’ordinateur de la personne et de là vers Anthropic. La page de consentement en
   avertit avant le bouton **Autoriser**. **Anthropic n’est ni notre fournisseur ni notre
   sous-traitant ultérieur** : c’est la personne ayant accès qui choisit de connecter, et Anthropic
   traite ces données selon les conditions et la politique de confidentialité applicables entre elle
   et l’utilisateur de Claude. **Le choix et l’utilisation de cette application relèvent de votre
   responsabilité**, comme à la Clause 13.8.
5. **Durée.** La connexion utilise des identifiants que l’application renouvelle d’elle-même
   (l’identifiant d’accès est valable 1 heure) et que nous ne conservons que sous forme de hash. Elle
   prend fin lorsque la personne la révoque dans Paramètres → Applications connectées ; après 90 jours
   sans utilisation ; lorsque la personne perd l’accès (Clause 13.3) ou que son accès est suspendu
   (Clause 18.2) ; lorsque le compte est supprimé (Clause 11.4) ; ou d’elle-même, lorsqu’un identifiant
   déjà remplacé est réutilisé, signe qu’il a pu être copié. Après cela, l’application demande à se
   connecter de nouveau.
6. **Limites.** Jusqu’à 10 applications connectées simultanément par personne, et les limites de
   requêtes par minute de l’Annexe II de l’Accord de traitement des données.

## Clause 14 — Données personnelles

14.1. En ce qui concerne les données des visiteurs de vos sites, **vous êtes le responsable du
traitement** et **nous sommes le sous-traitant** (Lei nº 13.709/2018, la Lei Geral de Proteção de Dados
Pessoais, LGPD — loi générale brésilienne sur la protection des données personnelles —, art. 5º, VI et
VII). Les règles complètes figurent dans l’**Annexe 1 — Accord de traitement des données
personnelles**, qui fait partie du présent contrat : finalité, instructions, sécurité, sous-traitants
ultérieurs, transfert international, demandes des personnes concernées, incidents, suspension du
traitement et suppression.

14.2. En ce qui concerne vos données et celles des personnes ayant accès (e-mails, compte, acceptation
des présentes conditions, sessions, applications connectées, facturation, prévention de l’essai répété
et assistance), **nous sommes le responsable du traitement**, comme l’explique
l’**Annexe 2 — Politique de confidentialité de Pyxis**.

## Clause 15 — Disponibilité, interruptions et changements du service

15.1. **Attention : il n’y a pas de garantie de disponibilité (SLA).** Nous faisons nos meilleurs
efforts pour maintenir le service en ligne et corriger les défaillances au plus vite. Le service est
exploité par une seule personne et dépend de prestataires (AWS, qui envoie aussi les e-mails, Neon,
Vercel et Stripe) ; des interruptions peuvent se produire.

15.2. **Maintenance.** Nous annonçons par e-mail, à l’avance chaque fois que possible, les opérations
de maintenance susceptibles de rendre le service indisponible, et nous les effectuons de préférence en
dehors des heures de bureau.

15.3. **Interruptions qui ne dépendent pas de nous.** Le service peut s’arrêter, en tout ou en partie,
en raison d’une défaillance ou de la suspension d’un prestataire, d’une attaque de tiers contre le
service ou d’un cas fortuit ou de force majeure (Código Civil — Code civil brésilien —, art. 393).
Nous nous efforçons de rétablir le service au plus vite et, si l’interruption dure plus de 24 heures,
nous vous prévenons par e-mail.

15.4. **Ordre légal.** Nous interrompons ou limitons le service, en tout ou en partie, lorsqu’une loi,
une décision judiciaire ou une injonction de l’ANPD (Agência Nacional de Proteção de Dados, autorité
nationale brésilienne de protection des données) ou d’une autre autorité compétente l’exige (par
exemple, le blocage de données ou la suspension d’un traitement, LGPD, art. 52). Nous ne nous
conformons qu’à ce qui est exigé et vous prévenons, sauf si l’ordre interdit de le faire.

15.5. **Pause liée au quota.** La pause de la réception des événements lorsque 150 % de la limite
mensuelle est atteint suit la Clause 7.2.

15.6. Si vous êtes consommateur, vos droits prévus à l’art. 20 du Código de Defesa do Consumidor
continuent de s’appliquer : face à une défaillance du service, y compris une suspension qui s’avère
injustifiée (Clause 18.9), vous pouvez demander que le service soit à nouveau exécuté, le cas échéant,
une réduction proportionnelle du prix ou la restitution du montant payé.

15.7. Nous pouvons améliorer le service, modifier des écrans et ajouter des fonctionnalités. Nous ne
retirons pas, pendant la période payée, les fonctionnalités énumérées à la Clause 7.1 et ne dégradons
pas les engagements de confidentialité de la Clause 4.2. Si un changement de ce type est inévitable
(par exemple, en raison de la loi ou parce qu’un prestataire a cessé de proposer quelque chose), nous
vous prévenons 30 jours à l’avance, et vous pouvez mettre fin au contrat avec remboursement au prorata
de la période payée et non utilisée.

## Clause 16 — Assistance et service client

16.1. Le service client se fait par e-mail, à hello@pyxis-analytics.dev, pour les questions, les
réclamations, l’assistance, la contestation d’une suspension, la suspension et la résiliation.

16.2. Nous accusons réception de votre message par le même e-mail et répondons **dans les 2 jours
ouvrés** (jours ouvrés du lundi au vendredi, hors jours fériés nationaux).

16.3. L’assistance couvre l’utilisation du service hébergé et l’installation du traceur. Elle n’inclut
pas le développement sur votre site ni l’assistance aux installations propres du code open source.

16.4. Dans vos messages, n’envoyez pas de données personnelles de visiteurs. Pour montrer un cas,
utilisez l’identifiant de la visite ou de l’utilisateur.

## Clause 17 — Propriété intellectuelle et vos données

17.1. **Les données de vos projets vous appartiennent.** Nous les traitons uniquement pour fournir le
service, comme l’indique l’Accord de traitement des données. Nous ne les vendons pas, ne les utilisons
pas pour la publicité et ne les utilisons pas pour entraîner des modèles d’intelligence artificielle.

17.2. Le code de Pyxis est soumis à la licence MIT (Clause 5). Le nom Pyxis, le logo et l’identité
visuelle nous appartiennent ; vous ne pouvez pas les utiliser d’une manière qui suggère que votre
produit est le nôtre ou que nous sommes partenaires, sans notre autorisation.

17.3. Si vous nous envoyez des suggestions, nous pouvons les utiliser librement pour améliorer Pyxis,
sans obligation envers vous.

## Clause 18 — Abus : suspension et clôture par nous

18.1. **Principes.** Face à un abus (Clause 12.1), nous agissons sur la base de faits que nous pouvons
vous montrer, de manière proportionnée à la gravité et uniquement sur la partie du service concernée.
Une mesure plus forte n’est utilisée que lorsque la plus légère ne suffit pas, et toute mesure est
accompagnée de son motif par écrit.

18.2. **Mesures possibles**, de la plus légère à la plus forte :

1. avertissement par e-mail, avec un délai pour corriger ;
2. suspension partielle : révoquer une clé, un jeton ou la connexion d’une application ; mettre en
   pause la réception des événements d’un projet ;
   suspendre l’accès d’une personne au tableau de bord ;
3. suspension du compte entier : réception des événements de tous les projets, tableau de bord, clés,
   jetons et applications connectées ;
4. fin du contrat (Clause 18.7).

18.3. **Avertissement et délai pour corriger.** En dehors des cas de la Clause 18.4, avant de
suspendre, nous prévenons le propriétaire du compte par e-mail, en indiquant ce que nous avons
constaté, quelle règle a été enfreinte, ce qui doit être fait et quelle mesure nous prendrons si ce
n’est pas corrigé, et nous accordons **5 jours ouvrés** pour corriger ou pour vous expliquer. Si vous corrigez
dans le délai, rien n’est suspendu.

18.4. **Attention : suspension immédiate.** Nous ne pouvons suspendre sans avertissement préalable que
dans les cas suivants, et uniquement dans la mesure nécessaire pour contenir le problème :

1. attaque contre le service ou contre d’autres clients, ou trafic falsifié ou automatisé qui menace
   la stabilité du service (Clause 12.1, points 7, 10 et 11) ;
2. envoi de données personnelles sensibles dans les événements, ou de données personnelles directes
   d’une manière qui expose des visiteurs à un risque important (Clause 12.1, points 1 à 3) ;
3. activité ou contenu apparemment illégal (Clause 12.1, point 16) ;
4. clé secrète ou jeton publiés, pour quelque raison que ce soit, même accidentelle (Clause 13.9) : la
   mesure consiste uniquement à les révoquer, pour vous protéger ainsi que les personnes concernées ;
5. indice objectif de fraude au paiement, comme une carte utilisée sans l’autorisation de son
   titulaire ou de fausses données de facturation (Clause 12.1, point 15) ;
6. risque concret et immédiat pour d’autres clients, pour les personnes concernées ou pour
   l’infrastructure ;
7. loi, décision judiciaire ou injonction d’une autorité compétente (Clause 15.4).

Dans ces cas, nous prévenons le propriétaire du compte par e-mail **dans un délai de 1 jour ouvré**
après la suspension, en indiquant le motif, ce qui a été suspendu, ce qu’il faut faire pour revenir et
comment contester, sauf si une loi ou un ordre interdit cet avertissement.

18.5. **Durée et rétablissement.** La suspension ne dure que le temps nécessaire. Lorsque le problème
est corrigé ou que la contestation est acceptée, nous rétablissons intégralement, dans un délai de
1 jour ouvré, ce qui a été suspendu. Les clés, jetons et connexions révoqués ne reviennent pas : vous
créez de nouvelles clés et de nouveaux jetons sur le tableau de bord et connectez de nouveau
l’application.

18.6. **Droit de réponse et de contestation.** Vous pouvez répondre à tout avertissement et contester
toute mesure par e-mail à hello@pyxis-analytics.dev, depuis l’e-mail du propriétaire du compte, dans
un délai de **10 jours ouvrés** à compter de l’avertissement, en envoyant votre explication et les
preuves dont vous disposez. Nous accusons réception par la même voie et répondons par une décision
motivée **dans les 5 jours** ; en cas de suspension immédiate, nous examinons la contestation en
priorité. Ce canal ne remplace ni ne conditionne votre droit de saisir le Procon (organisme brésilien
de protection des consommateurs), les autres organismes de protection du consommateur ou la justice.

18.7. **Clôture pour abus.** Nous pouvons mettre fin au contrat, par e-mail et avec le motif,
uniquement après vous avoir donné la possibilité de répondre (Clause 18.6), sauf si une loi ou un ordre
l’empêche et sauf en cas d’essai gratuit répété, qui suit les délais propres de la Clause 18.11, et
uniquement lorsque :

1. l’abus est **grave** : attaque délibérée contre le service ou contre d’autres clients ; fraude au
   paiement ; activité ou contenu illégal ; envoi délibéré de données personnelles sensibles ; ou
   tentative délibérée de contourner la barrière de données personnelles ou le respect de ceux qui ont
   demandé à ne pas être mesurés ;
2. le même abus se **répète** après avoir été corrigé, dans les 12 mois suivant le premier
   avertissement ; ou
3. l’abus **n’est pas corrigé** dans les 30 jours suivant une suspension.

La clôture a les effets de la Clause 11.6, points 1 à 4 : l’abonnement est résilié, les clés sont
révoquées, le tableau de bord reste disponible pour la consultation et l’exportation pendant 30 jours,
sauf empêchement légal, et les données sont ensuite supprimées (Clause 11.4).

18.8. **Données pendant la suspension et après la clôture.**

1. Pendant la suspension, les données déjà conservées restent conservées et protégées, la suppression
   des événements de plus de 13 mois continue, et aucun nouvel événement n’est reçu dans la partie
   suspendue.
2. Vous pouvez continuer à exporter les événements (Clause 11.5), sauf lorsque l’accès lui-même
   constitue le risque (par exemple, une attaque menée depuis le compte) ou qu’une loi ou un ordre
   l’empêche ; dans ce cas, nous remettons la copie sur demande dès que l’empêchement prend fin, et la
   suppression l’attend.
3. Après la clôture, les Clauses 11.4 et 11.5 s’appliquent : 30 jours pour exporter, sauf empêchement
   légal, puis suppression.
4. Si une loi, une décision judiciaire ou une réquisition d’une autorité compétente impose de
   préserver des données, ou si elles sont nécessaires pour une procédure judiciaire, administrative
   ou arbitrale, nous ne préservons que ces données, sans autre usage, pendant la durée exigée, puis
   nous les supprimons (Clause 12.6 de l’Annexe 1).
5. Pour enquêter sur un abus, nous n’utilisons que ce que le service conserve déjà (Clause 12.4).

18.9. **Facturation pendant la suspension.** Une suspension partielle ne modifie pas la facturation.
Si une suspension s’avère injustifiée, nous remboursons le montant proportionnel aux jours pendant
lesquels le compte a été suspendu, en plus de vos droits prévus à la Clause 15.6.

18.10. **Remboursement en cas de clôture pour abus.**

1. Nous remboursons le montant proportionnel à la période payée et non utilisée, comptée à partir du
   début de la suspension du compte entier ou, s’il n’y en a pas eu, de la clôture. Si la clôture
   intervient dans les 7 jours de la Clause 10, nous remboursons le montant intégral du premier
   prélèvement.
2. Nous ne remboursons pas la période déjà utilisée jusqu’à la suspension du compte entier, ni les
   montants qui vous sont déjà revenus par remboursement ou par contestation acceptée par l’émetteur de
   la carte.
3. **Attention : uniquement si vous n’êtes pas consommateur**, nous pouvons déduire de ce montant les
   préjudices que l’abus nous a causés de manière prouvée, en présentant le calcul par écrit (Código
   Civil, arts. 368 et 369) ; le solde restant dû ou excédentaire est réglé selon la Clause 19.
4. Le remboursement est effectué, via Stripe, sur la carte utilisée pour le paiement, dans les 5 jours
   ouvrés suivant la clôture.

18.11. **Essai gratuit répété.** Lorsque le service indique que la carte utilisée a déjà démarré un
essai gratuit sur un autre compte au cours des 12 mois précédents (Politique de confidentialité,
point 2.7), ou qu’il existe un autre indice objectif d’essai répété par la même personne ou
entreprise (Clause 6.4) :

1. rien ne se passe automatiquement : le service se contente d’enregistrer la coïncidence et de nous
   prévenir ; aucun prélèvement et aucune résiliation ;
2. nous examinons le cas et, si nécessaire, nous vous interrogeons, avec le délai de la Clause 18.3.
   Une carte d’entreprise utilisée par des personnes différentes, ou une agence qui souscrit pour des
   clients différents, ne constitue pas un essai répété ;
3. si nous confirmons l’essai répété, nous pouvons clôturer le nouveau compte avant la fin de
   l’essai, en résiliant l’abonnement chez Stripe sans aucun prélèvement, avec avertissement et motif ;
   vous pouvez contester (Clause 18.6) et vous pouvez vous abonner sans essai gratuit, par e-mail, avec
   facturation à partir du nouvel abonnement ;
4. **nous ne prélevons jamais rien avant la date affichée sur la page de paiement de Stripe**, et nous
   ne raccourcissons pas l’essai pour prélever plus tôt.

18.12. **Contestation d’un prélèvement sur la carte.** Contester un prélèvement auprès de l’émetteur de
la carte est votre droit ; nous vous demandons de nous contacter d’abord (Clauses 10 et 16). Si la
contestation est acceptée et que le montant vous revient, la période contestée reste impayée et nous
pouvons la traiter comme un défaut de paiement, en résiliant l’abonnement avec avertissement
(Clause 9.2). Seule la contestation de mauvaise foi (Clause 12.1, point 15) est traitée comme un abus.

18.13. **Clôture sans abus.** En dehors de l’abus, nous ne mettons fin au contrat que dans les cas des
Clauses 6.2 (fin d’une gratuité), 20 (fin du service hébergé), 21.3 (changement imposé par la loi que
vous n’acceptez pas) et 22.1 (cession que vous n’acceptez pas), et nous remboursons toujours le
montant proportionnel à la période payée et non utilisée ; les données suivent les Clauses 11.4 et
11.5.

## Clause 19 — Responsabilité

19.1. Nous sommes responsables de fournir le service tel que décrit dans les présentes conditions, avec
diligence, et de respecter l’Accord de traitement des données.

19.2. Le service affiche des statistiques d’utilisation. Nous ne garantissons pas de résultats
commerciaux à partir de celles-ci, et les décisions que vous prenez sur la base des chiffres vous
appartiennent.

19.3. **Si vous êtes consommateur**, rien dans les présentes conditions ne limite les droits que le
Código de Defesa do Consumidor vous garantit, y compris celui d’obtenir réparation des dommages causés
par une défaillance du service.

19.4. **Attention : limitation de responsabilité pour qui n’est pas consommateur.** Si vous souscrivez
au service pour votre activité professionnelle ou commerciale, en dehors d’une relation de
consommation, et, dans les situations justifiables admises par l’art. 51, I, du Código de Defesa do
Consumidor, si vous êtes un consommateur personne morale :

1. notre responsabilité totale pour les dommages liés au présent contrat est limitée au montant que
   vous nous avez payé au cours des 12 mois précédant le fait générateur du dommage ;
2. nous ne répondons pas du manque à gagner, de la perte d’opportunité commerciale ni d’autres dommages
   indirects.

Cette limite tient compte du prix bas du forfait et de la taille du service, exploité par une seule
personne. Elle **ne s’applique pas** aux dommages causés par notre dol ou notre faute lourde, ni aux
obligations que la loi ne permet pas de limiter, et elle ne réduit pas les droits des personnes
concernées à notre égard (LGPD, art. 42).

19.5. Vous répondez des dommages que vous nous causez ou que vous causez à des tiers en enfreignant les présentes
conditions, par exemple en envoyant des données personnelles dans les événements, en omettant
d’informer les visiteurs de votre site de la mesure ou par un autre abus de la Clause 12.1.

19.6. Aucune des parties ne répond d’un retard ou d’une défaillance causés par un cas fortuit ou de
force majeure (Código Civil, art. 393).

## Clause 20 — Fin du service hébergé

20.1. Si nous décidons de mettre fin au service hébergé, nous vous prévenons par e-mail **au moins
30 jours à l’avance**.

20.2. Dans ce cas, nous remboursons le montant proportionnel à la période payée et non utilisée,
maintenons l’exportation des événements (Clause 11.5) jusqu’à la fin du service et supprimons les
données conformément à la Clause 12 de l’Annexe 1.

20.3. Comme le code est ouvert, vous pouvez continuer à utiliser Pyxis sur votre propre
infrastructure.

## Clause 21 — Modifications des présentes conditions

21.1. Nous pouvons modifier les présentes conditions. Nous vous prévenons par e-mail **au moins
30 jours à l’avance**, en expliquant ce qui change, et nous publions la nouvelle version avec sa date
d’entrée en vigueur. Les versions antérieures sont disponibles sur demande.

21.2. **Les modifications qui réduisent vos droits ou augmentent vos obligations ne s’appliquent à vous
qu’à partir de votre prochain renouvellement après ce délai.** Si vous n’êtes pas d’accord, résiliez
avant le renouvellement, sans frais.

21.3. Les modifications qui ne font qu’améliorer le service ou clarifier le texte s’appliquent à la
date indiquée dans l’avis. Les modifications imposées par la loi, par une décision judiciaire ou par
l’ANPD peuvent s’appliquer avant le renouvellement ; si l’une d’elles n’est pas acceptable pour vous,
vous pouvez mettre fin au contrat avec remboursement au prorata de la période payée et non utilisée.

## Clause 22 — Cession du contrat

22.1. Nous pouvons transférer le présent contrat à une société créée ou contrôlée par {{seller.name}}
(par exemple, pour que le service soit fourni sous un CNPJ) ou à quiconque reprend le service, toutes les stipulations des présentes conditions et
de l’Accord de traitement des données étant maintenues. Nous vous prévenons par e-mail au moins
30 jours à l’avance ; si vous n’êtes pas d’accord, vous pouvez mettre fin au contrat avec
remboursement au prorata de la période payée et non utilisée.

22.2. Vous ne pouvez pas transférer le présent contrat sans notre accord écrit.

## Clause 23 — Communications

23.1. Nous envoyons les communications relatives au présent contrat, y compris les avertissements
d’abus et de suspension, à l’e-mail du propriétaire du compte et, lorsque le sujet concerne
l’utilisation du tableau de bord par une personne, la suspension de son accès ou un incident de
sécurité, également aux personnes ayant accès concernées. Maintenez ces e-mails à jour.

23.2. Vos communications à notre intention sont adressées à hello@pyxis-analytics.dev.

## Clause 24 — Dispositions générales

24.1. Si une clause est jugée invalide, les autres restent en vigueur.

24.2. Si l’une des parties n’exige pas un droit, cela ne signifie pas qu’elle y a renoncé.

24.3. Le présent contrat ne crée ni société, ni lien d’emploi, ni mandat de représentation entre les
parties.

24.4. Le présent contrat est conclu en portugais, par voie électronique, et vaut contrat écrit.

## Clause 25 — Droit applicable et juridiction

25.1. Le présent contrat est régi par le droit brésilien.

25.2. Avant de saisir la justice, contactez-nous à hello@pyxis-analytics.dev : nous voulons résoudre
le problème. Il s’agit d’une invitation, non d’une condition. Si vous êtes consommateur, vous pouvez
aussi saisir le Procon et les autres organismes de protection du consommateur.

25.3. **Si vous êtes consommateur**, vous pouvez intenter une action devant le tribunal de votre
domicile (Código de Defesa do Consumidor, art. 101, I).

25.4. Dans les autres cas, la juridiction élue est celle de la comarca (ressort judiciaire) de
**Salvador/BA** (État de Bahia), domicile du prestataire du service.

---

[Annexe 1 — Accord de traitement des données personnelles](/fr/dpa).

[Annexe 2 — Politique de confidentialité de Pyxis](/fr/privacy).
