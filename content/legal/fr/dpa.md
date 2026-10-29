# Accord de traitement des données personnelles de Pyxis

**Version {{terms.version}} — entrée en vigueur : {{terms.effectiveFrom}}.**

> Ceci est une traduction de courtoisie. Le texte qui fait foi est la version en portugais ([Português](/acordo-de-tratamento)) ; en cas de divergence entre les deux, la version portugaise prévaut.

Le présent accord constitue l’**Annexe 1 des Conditions d’utilisation de Pyxis** et fait partie du
contrat entre vous et nous. Il explique comment nous traitons les données personnelles qui parviennent
à Pyxis depuis vos sites, conformément à la Lei Geral de Proteção de Dados Pessoais (Lei
nº 13.709/2018, la « LGPD » ; loi générale brésilienne sur la protection des données personnelles).
Si quelque chose ici contredit les Conditions d’utilisation, le présent accord prévaut en ce qui
concerne les données personnelles.

---

## Clause 1 — Qui sont les parties

1.1. **Nous :** {{seller.name}}, personne physique, inscrit au CPF (numéro d’identification fiscale
des personnes physiques au Brésil) sous le nº {{seller.taxId}}, domicilié à
{{seller.address}}, qui propose le service sous le nom **Pyxis**. Contact :
**hello@pyxis-analytics.dev**.

1.2. **Vous :** la personne ou l’entreprise qui a souscrit à Pyxis hébergé, en acceptant les
Conditions d’utilisation, représentée sur le tableau de bord par le propriétaire du compte (Conditions
d’utilisation, Clause 2.9). Le présent accord s’applique de la même manière au forfait gratuit et au
forfait payant (Conditions d’utilisation, Clause 7.1).

## Clause 2 — Termes utilisés dans le présent accord

2.1. Les termes **donnée personnelle**, **traitement**, **personne concernée**, **responsable du
traitement**, **sous-traitant**, **anonymisation**, **suppression**, **transfert international** et
**incident de sécurité** ont le sens que leur donnent la LGPD (art. 5º) et les résolutions de
l’Agência Nacional de Proteção de Dados (ANPD ; autorité nationale brésilienne de protection des
données).

2.2. **Visiteur** désigne la personne qui accède à l’un de vos sites ou applications sur lequel le
traceur de Pyxis est installé.

2.3. **Événement** désigne chaque enregistrement que le traceur envoie à Pyxis, comme une page vue ou
une action que vous avez balisée.

2.4. **Projet** désigne la configuration d’un de vos sites dans Pyxis : nom, adresses (origines)
autorisées, fuseau horaire, événement de conversion, l’option de conserver la ville, clés et
événements.

2.5. **Sous-traitant ultérieur** désigne le prestataire que nous engageons et qui traite, pour notre
compte, des données personnelles visées par le présent accord.

## Clause 3 — Rôles de chaque partie

3.1. En ce qui concerne les données des visiteurs de vos sites, **vous êtes le responsable du
traitement** et **nous sommes le sous-traitant** (LGPD, art. 5º, VI et VII). Vous décidez si et
comment mesurer ; nous traitons les données pour fournir le service que vous avez souscrit.

3.2. Si vous utilisez Pyxis pour mesurer des sites de tiers (par exemple, en tant qu’agence), vous
déclarez avoir l’autorisation du responsable du traitement de ces sites pour nous engager et pour
donner les instructions du présent accord. Dans ce cas, nous agissons en tant que sous-traitant
ultérieur, et vous transmettez au responsable du traitement les informations du présent accord dont
il a besoin.

3.3. En ce qui concerne les données de votre compte (les e-mails des personnes qui accèdent au tableau
de bord, le compte et l’abonnement, l’acceptation des conditions, l’historique de facturation, la
prévention de l’essai gratuit répété, les enregistrements des connexions d’applications et les
messages d’assistance), **nous sommes le responsable du traitement**. Ce traitement relève de la
**Politique de confidentialité de Pyxis** (Annexe 2 des Conditions d’utilisation), et non du présent
accord.

## Clause 4 — Ce que nous traitons, à quelles fins et pendant combien de temps

4.1. L’**Annexe I** du présent accord décrit le traitement : finalités, personnes concernées,
catégories de données, ce qui n’est **pas** conservé, où se trouvent les données et pendant combien de
temps.

4.2. Nous traitons les données des visiteurs **uniquement** pour :

1. recevoir les événements envoyés par le traceur et les conserver dans votre projet ;
2. présenter l’analyse à vous-même et aux personnes que vous avez autorisées, sur le tableau de bord, dans
   l’API de consultation, dans le serveur MCP (y compris aux applications qu’elles connectent ;
   Annexe I, point 10) et dans le récapitulatif hebdomadaire par e-mail ;
3. donner suite aux demandes de suppression et de copie de données de personnes concernées
   (Clause 10) ;
4. maintenir le service sûr et en état de fonctionnement (limites contre les abus, correction des
   défaillances, sauvegardes des prestataires) ;
5. respecter une obligation légale ou un ordre d’une autorité compétente (Clause 15) ;
6. générer, à la demande du propriétaire du compte, le fichier d’exportation des événements d’un
   projet (Annexe I, point 11) ;
7. vérifier et contenir un soupçon d’abus ou d’utilisation contraire aux Conditions d’utilisation
   (Clauses 12 et 18 des Conditions), uniquement avec les données que le service conserve déjà et
   uniquement dans la mesure nécessaire (Clause 7.2).

4.3. **Nous n’utilisons les données de vos projets pour aucune autre finalité.** Nous ne les vendons
pas, ne les louons pas, ne les utilisons pas pour la publicité, ne les utilisons pas pour entraîner des
modèles d’intelligence artificielle et ne les combinons pas avec des données d’autres clients. Les
seuls chiffres que nous tirons de vos projets pour notre propre usage sont des comptages
d’exploitation, comme le nombre d’événements par mois de chaque compte et la taille de la base,
utilisés pour appliquer la limite mensuelle du forfait (Conditions d’utilisation, Clause 7.2), savoir
si un compte du forfait gratuit est resté sans recevoir d’événements (Conditions d’utilisation,
Clause 7.6) et vérifier la capacité du service.

## Clause 5 — Vos instructions

5.1. Vos instructions pour le traitement sont, ensemble :

1. les Conditions d’utilisation et le présent accord ;
2. la configuration de vos projets (origines autorisées, fuseau horaire, événement de conversion,
   l’option de conserver la ville, clés et personnes ayant accès), effectuée par le propriétaire du
   compte sur le tableau de bord ou, sur demande, par nous ;
3. ce que le traceur installé sur votre site envoie (quels événements, quelles propriétés et si vous
   utilisez la fonction `identify`) ;
4. les actions du propriétaire du compte sur le tableau de bord (par exemple, exporter les événements,
   supprimer un projet ou clôturer le compte), les appels que vous faites à l’API avec votre clé
   secrète ou avec un jeton d’accès, et les connexions d’applications que les personnes ayant accès
   autorisent sur le tableau de bord (Annexe I, point 10) ;
5. les demandes que vous nous adressez par écrit, par e-mail à hello@pyxis-analytics.dev.

5.2. Si l’une de vos instructions nous semble contraire à la LGPD ou à une autre loi, nous vous en
avertissons par écrit et ne l’exécutons pas tant que la question n’est pas résolue : le sous-traitant
qui suit une instruction illicite répond solidairement avec le responsable du traitement (LGPD,
art. 42, § 1º, I).

5.3. Une instruction qui exige de modifier le fonctionnement du service pour tous les clients (par
exemple, conserver une donnée que Pyxis ne conserve pas) ne nous oblige pas ; dans ce cas, vous pouvez
mettre fin au contrat conformément aux Conditions d’utilisation.

5.4. **Suspension du traitement.** Nous pouvons suspendre, en tout ou en partie, le traitement d’un
projet (normalement, la réception de nouveaux événements), selon la procédure de la Clause 18 des
Conditions d’utilisation, lorsque :

1. le projet envoie des données personnelles directes ou sensibles, en violation de la Clause 6.1,
   points 3 et 4 ;
2. le projet envoie des événements de personnes qui ont demandé à ne pas être mesurées, en violation
   de la Clause 6.1, point 5 ;
3. l’une de vos instructions est illicite (Clause 5.2) ;
4. c’est nécessaire pour contenir un incident de sécurité (Clause 11.6) ; ou
5. une loi ou une autorité compétente l’ordonne (Clause 15).

Pendant la suspension, les données déjà reçues restent conservées, avec les mêmes mesures de sécurité
(Annexe II) ; aucune nouvelle donnée n’est reçue dans la partie suspendue ; les durées de conservation
et de suppression de la Clause 12 continuent de s’appliquer ; et les données reçues en violation du
présent accord sont supprimées sur votre instruction (Clause 10.6). La suspension ne modifie pas vos
obligations de responsable du traitement envers les personnes concernées.

## Clause 6 — Ce que vous garantissez en tant que responsable du traitement

6.1. Vous garantissez que vous :

1. disposez d’une base légale valable (LGPD, art. 7º) pour mesurer l’utilisation de vos sites avec
   Pyxis. Pour la mesure sans cookies et sans donnée personnelle directe que réalise Pyxis, la base la
   plus courante est l’intérêt légitime (art. 7º, IX, et art. 10), qui exige transparence et respect
   des attentes du visiteur ; l’évaluation vous incombe ;
2. informez les visiteurs de la mesure, dans l’avis de confidentialité de votre site, de manière
   claire. L’**Annexe IV** fournit un modèle ;
3. **n’envoyez à Pyxis ni données personnelles directes ni données personnelles sensibles** : aucun
   nom, e-mail, téléphone, CPF, adresse, numéro de document, texte saisi par le visiteur, donnée de
   santé, origine raciale, religion, opinion politique, vie sexuelle, donnée génétique ou biométrique,
   ni aucune donnée qui identifie une personne à elle seule ;
4. si vous utilisez la fonction `identify`, n’envoyez qu’un **identifiant interne et opaque** du compte
   dans votre système (par exemple, un numéro d’enregistrement aléatoire), jamais l’e-mail, le CPF, le
   téléphone ou une autre donnée qui identifie directement la personne ;
5. ne désactivez ni ne contournez le respect des signaux « ne pas suivre » du navigateur (Global
   Privacy Control et Do Not Track) ni l’option de ne pas être mesuré (`optOut`) que le traceur
   propose, et n’envoyez pas par un autre chemin des événements de personnes qui ont demandé à ne pas
   être mesurées ;
6. si votre site s’adresse à des enfants ou à des adolescents, avez évalué le traitement au regard de
   l’art. 14 de la LGPD et de leur intérêt supérieur avant d’installer le traceur ;
7. répondez aux demandes des personnes concernées de vos sites, avec notre appui (Clause 10) ;
8. publiez, le cas échéant, les informations sur le transfert international exigées par l’art. 17,
   § 2º, du Règlement approuvé par la Resolução CD/ANPD nº 19/2024 (résolution du conseil directeur de
   l’ANPD), en utilisant les informations de la Clause 9 et de l’Annexe III ;
9. n’installez le traceur et n’enregistrez comme origine d’un projet que des sites qui vous
   appartiennent ou appartiennent à quelqu’un qui vous y a autorisé (Clause 3.2) ;
10. si vous activez la ville dans un projet (Conditions d’utilisation, Clause 4.5), avez évalué au
    préalable si elle est nécessaire à la finalité de la mesure et si elle est couverte par la base
    légale du point 1 ; avez mis à jour au préalable l’avis du point 2, en mettant le changement en
    évidence ; et, si le projet utilise la fonction `identify`, savez qu’il enregistre dès lors la
    ville approximative de chaque visite des personnes identifiées et l’indiquez dans l’avis.

6.2. Le serveur de Pyxis écarte automatiquement les valeurs qui ont la forme d’un e-mail ou les
séquences de 10 chiffres ou plus (comme le CPF, le CNPJ — numéro d’immatriculation des personnes
morales au Brésil — et le téléphone) dans les propriétés des événements, dans les paramètres de
campagne et dans l’identifiant d’utilisateur. Cette barrière est une **seconde couche** : elle ne
reconnaît ni les noms, ni les adresses, ni les textes libres. **La responsabilité de ce que votre site
envoie vous incombe.**

6.3. Si vous vous rendez compte que vous avez envoyé des données personnelles directes à Pyxis,
prévenez-nous. Nous vous aidons à les supprimer (Clause 10.6). Si nous nous en rendons compte, par les
journaux de refus de la barrière ou autrement, nous vous prévenons.

## Clause 7 — Confidentialité

7.1. À ce jour, Pyxis est exploité par une seule personne : la personne physique indiquée à la
Clause 1.1. Elle est la seule personne disposant d’un accès administratif aux systèmes et à la base de
données.

7.2. Nous n’accédons aux données d’un projet que lorsque c’est nécessaire pour : (a) l’assistance que
vous avez demandée ; (b) enquêter sur une défaillance ou un incident de sécurité ou les corriger ;
(c) la maintenance du service ; (d) respecter une obligation légale ou un ordre d’une autorité ; ou
(e) vérifier un soupçon concret d’abus (Clause 18 des Conditions d’utilisation), en n’examinant que ce
qui est nécessaire pour le confirmer ou l’écarter.

7.3. Si, à l’avenir, une autre personne vient à exploiter le service avec nous, elle n’aura accès
qu’après s’être engagée par écrit au même devoir de confidentialité que celui du présent accord, et
nous vous en informerons.

7.4. Le devoir de confidentialité et de sécurité continue de s’appliquer après la fin du contrat
(LGPD, art. 47).

## Clause 8 — Sécurité

8.1. Nous adoptons des mesures techniques et administratives pour protéger les données contre les
accès non autorisés et contre la destruction, la perte, l’altération, la communication ou tout
traitement inadéquat ou illicite (LGPD, art. 46). Les mesures en vigueur figurent à l’**Annexe II**.

8.2. Nous pouvons remplacer une mesure par une autre équivalente ou meilleure. Nous ne réduisons pas
le niveau général de protection décrit à l’Annexe II pendant le contrat.

8.3. Le code source de Pyxis est public (licence MIT). Vous pouvez vérifier comment le service traite
les données dans les dépôts `pyxis-api`, `pyxis-sdk`, `pyxis-web` et `pyxis-mcp`, sur GitHub.

## Clause 9 — Sous-traitants ultérieurs et transfert international

9.1. **Autorisation.** Vous autorisez le recours aux sous-traitants ultérieurs énumérés à
l’**Annexe III**. Chacun ne traite que ce qui est nécessaire pour la partie du service qu’il fournit.

9.2. **Changements.** Avant d’ajouter ou de remplacer un sous-traitant ultérieur qui traite des données
des visiteurs, nous vous prévenons par e-mail **au moins 30 jours à l’avance**, en indiquant de qui il
s’agit, ce qu’il fera et où. Si vous n’êtes pas d’accord, vous pouvez mettre fin au contrat avant le
changement et recevez le remboursement du montant proportionnel à la période payée et non utilisée. En
cas d’urgence (par exemple, un prestataire qui a cessé de fonctionner ou qui est devenu peu sûr), le
remplacement peut être immédiat ; nous vous prévenons dans les 5 jours ouvrés, et vous avez le même
droit de mettre fin au contrat avec remboursement au prorata.

9.3. **Contrats avec les sous-traitants ultérieurs.** Les prestataires de l’Annexe III sont de grandes
entreprises qui contractent selon des conditions standardisées, que nous ne négocions pas. Nous
choisissons des prestataires dont les conditions comprennent des engagements de sécurité, de
confidentialité et de traitement conforme à nos instructions. L’Annexe III indique le contrat de
chacun.

9.4. **Où se trouvent les données.** Les événements de vos projets sont **conservés au Brésil** : dans
la base de données de Neon, qui fonctionne dans la région de São Paulo d’AWS, et traités par l’API dans
la région de São Paulo d’AWS (sa-east-1).

9.5. **Là où il existe un élément étranger.** Même si les données sont conservées au Brésil, il existe
quatre situations que vous devez connaître :

1. **Réseau de distribution d’AWS (CloudFront).** Les requêtes du navigateur du visiteur arrivent au
   point de présence d’AWS le plus proche de lui, qui peut se trouver hors du Brésil lorsque le
   visiteur est hors du Brésil. Ce point ne fait que relayer la requête vers São Paulo : le cache est
   désactivé et nous ne conservons pas de journaux d’accès de CloudFront.
2. **Entreprises ayant leur siège aux États-Unis.** Neon fait partie de Databricks, Inc. ; Vercel Inc.
   héberge le tableau de bord. Les deux sont des entreprises des États-Unis, et leurs équipes et
   systèmes peuvent accéder aux données depuis l’extérieur du Brésil pour exploiter le service, fournir
   une assistance et effectuer des sauvegardes.
3. **Tableau de bord.** Les pages du tableau de bord sont générées dans des fonctions de Vercel dans la
   région de São Paulo (gru1), mais Vercel déclare que son traitement principal a lieu aux États-Unis.
   Les journaux techniques des requêtes au tableau de bord restent chez Vercel pendant 1 jour.
4. **Applications connectées.** Si une personne ayant accès connecte Claude ou Claude Code, les
   données qu’elle demande à l’application vont à Anthropic, aux États-Unis, sur votre instruction
   (Clause 5.1, point 4, et Annexe I, point 10). Anthropic n’est pas notre sous-traitant ultérieur.

Les e-mails du service, y compris le récapitulatif hebdomadaire (qui ne contient que des chiffres agrégés du
projet, sans données de visiteurs identifiables ; Annexe I, point 6), partent via Amazon SES, dans la
région de São Paulo d’AWS (Annexe III).

9.6. **Mécanisme de transfert.** À la date de la présente version, les contrats de traitement des
données (DPA) d’AWS, de Databricks (Neon) et de Vercel prévoient des clauses types de l’Union
européenne et des engagements de sécurité, mais **n’intègrent pas les clauses contractuelles types
approuvées par l’ANPD** (Resolução CD/ANPD nº 19/2024). Pour réduire au minimum ce qui sort du Brésil
(art. 9º, paragraphe unique, du Règlement), Pyxis ne conserve pas l’IP, ne conserve pas le navigateur
complet, n’utilise pas de cookies sur vos sites et réduit les adresses des pages à des modèles
(Annexe II). Nous nous engageons à : (a) adopter les clauses types de l’ANPD ou un autre mécanisme
valable de l’art. 33 de la LGPD dès que l’un de ces prestataires le proposera, ou changer de
prestataire si nécessaire ; (b) vous informer de tout changement sur ce point ; et (c) vous fournir,
sur demande, les informations dont vous avez besoin pour évaluer le transfert (art. 4º, § 1º, du
Règlement).

## Clause 10 — Demandes des personnes concernées

10.1. **Qui répond.** En tant que responsable du traitement, vous répondez aux visiteurs et aux
utilisateurs de vos sites qui demandent la confirmation, l’accès, la correction, la suppression ou une
autre mesure de l’art. 18 de la LGPD. Nous vous aidons comme décrit ci-dessous.

10.2. **Seules les personnes identifiées peuvent être retrouvées.** Pyxis ne conserve ni cookies, ni
IP, ni identifiant persistant du visiteur anonyme. L’identifiant de visite est aléatoire, reste
uniquement dans l’onglet du navigateur et est remplacé à la fermeture de l’onglet ou après 30 minutes
d’inactivité. Par conséquent, **il n’est pas possible de retrouver les visites anonymes d’une
personne**. Seuls peuvent être localisés les événements d’une personne que votre site a identifiée
avec la fonction `identify`, au moyen de l’identifiant interne que vous avez envoyé.

10.3. **Supprimer les données d’une personne (vous-même, par l’API).** Appelez
`DELETE https://api.pyxis-analytics.dev/v1/subjects/{userId}` avec la clé secrète du projet (en-tête
`Authorization: Bearer`). Pyxis supprime **tous les événements portant cet identifiant ainsi que les
visites au cours desquelles la personne a été identifiée**, y compris les événements anonymes de cette
même visite qui ont précédé l’identification (par exemple, la page d’entrée et l’origine de la visite).
La réponse indique combien d’événements ont été supprimés. Un nouvel appel répond zéro ; il est sans
risque de le répéter.

10.4. **Copier les données d’une personne (vous-même, par l’API).** Appelez
`GET https://api.pyxis-analytics.dev/v1/subjects/{userId}/events` avec la clé secrète. La réponse
contient les mêmes événements que ceux que la suppression effacerait, dans l’ordre, jusqu’à 1 000 par
page, en JSON. S’il y en a davantage, la réponse indique le curseur suivant (`next_after`), que vous
passez comme `?after=` pour obtenir la page suivante. Chaque événement comporte le nom, la date et
l’heure, l’identifiant de la visite, la page, l’origine, l’appareil, le pays, l’État, la ville (vide
dans les projets où l’option est désactivée ; Conditions d’utilisation, Clause 4.5) et les
propriétés.

10.5. **Limites de ces routes.** Les deux routes acceptent jusqu’à 60 appels par minute par clé et par
adresse d’origine. La clé secrète ne doit être utilisée que sur votre serveur, jamais dans le
navigateur.

10.6. **En nous le demandant.** Si vous préférez, envoyez la demande à hello@pyxis-analytics.dev,
depuis l’e-mail d’une personne ayant accès au projet, avec l’identifiant de l’utilisateur et ce que
vous souhaitez (suppression ou copie). Nous l’exécutons **dans les 5 jours ouvrés** et répondons avec
le résultat (le nombre d’événements supprimés ou le fichier contenant la copie). Il en va de même si
vous avez envoyé des données personnelles par erreur et devez les supprimer.

10.7. **Demande qui nous parvient directement.** Si une personne concernée de vos sites nous contacte,
nous ne répondons pas sur le fond à votre place : **dans les 2 jours ouvrés**, nous vous transmettons
la demande et informons la personne concernée que vous êtes le responsable du traitement et quel est
votre canal, lorsque nous le connaissons.

10.8. **Délais légaux.** Les délais pour répondre à la personne concernée sont les vôtres, en tant que
responsable du traitement (par exemple, 15 jours au plus pour la déclaration complète de l’art. 19, II,
de la LGPD, ou le délai spécifique applicable aux agents de petite taille, si vous en relevez). Nos
délais ci-dessus ont été conçus pour s’inscrire dans ces délais.

## Clause 11 — Incidents de sécurité

11.1. Si nous prenons connaissance d’un incident de sécurité qui a affecté ou a pu affecter des données
personnelles de l’un de vos projets, nous vous prévenons **sans retard injustifié et dans un délai de
48 heures** à compter de cette prise de connaissance, à l’e-mail des personnes ayant accès au projet.

11.2. L’avis indique ce que nous savons à ce moment-là, et nous le complétons ensuite, dès que nous
disposons de plus d’informations :

1. ce qui s’est passé, quand cela s’est passé (si cela peut être déterminé) et quand nous l’avons
   appris ;
2. la nature et les catégories des données affectées et, lorsqu’il est possible de l’estimer, le
   nombre de personnes concernées ;
3. les mesures de sécurité qui protégeaient les données avant l’incident ;
4. les risques et les impacts possibles pour les personnes concernées ;
5. ce que nous avons déjà fait et ce que nous ferons pour contenir l’incident et en réduire les
   effets ;
6. un contact pour suivre le dossier.

11.3. Ce délai a été choisi pour que vous puissiez respecter le vôtre : le responsable du traitement
doit communiquer à l’ANPD et aux personnes concernées l’incident susceptible de causer un risque ou un
dommage important dans les 3 jours ouvrés suivant sa prise de connaissance (Resolução CD/ANPD
nº 15/2024, arts. 6º et 9º), délai qui est doublé pour les agents de petite taille.

11.4. La communication à l’ANPD et aux personnes concernées de vos sites vous incombe, en tant que
responsable du traitement (LGPD, art. 48). Nous collaborons en fournissant les informations dont nous
disposons et ne faisons aucune communication publique sur les données de votre projet sans vous en
parler au préalable, sauf obligation légale.

11.5. Nous tenons un registre de tout incident de sécurité impliquant des données personnelles, y
compris ceux qui n’ont pas eu à être communiqués, pendant **au moins 5 ans**.

11.6. Pour contenir un incident ou une attaque en cours, nous pouvons suspendre immédiatement des
parties du service (par exemple, révoquer une clé ou mettre en pause la réception des événements d’un
projet), dans la mesure nécessaire. Nous vous prévenons comme à la Clause 11.1, lorsque des données
personnelles sont en jeu, ou comme à la Clause 18.4 des Conditions d’utilisation, et nous rétablissons
le service dès que le risque est passé.

## Clause 12 — Conservation et suppression

12.1. **Pendant le contrat.** Les événements sont conservés pendant **13 mois**. Une routine
quotidienne supprime les événements de plus de 13 mois, dans tous les projets.

12.2. **Fin du contrat.** **30 jours après la fin de l’accès** (la fin de la période payée après une
résiliation ou la fin de l’abonnement pour défaut de paiement, lorsque le compte ne revient pas au
forfait gratuit ; la clôture du compte depuis le tableau de bord ; la fin du forfait gratuit ; ou la
clôture par nous ; Conditions d’utilisation, Clauses 2.10 et 11.4), une routine quotidienne
supprime définitivement le compte, les projets et tout ce qui leur appartient :
événements, clés, configurations, icône du site, traces d’envoi du récapitulatif hebdomadaire, demandes
d’exportation et accès des personnes aux projets. Nous supprimons également l’inscription (e-mail,
sessions, jetons et applications connectées) du propriétaire du compte et des personnes qui
n’avaient accès qu’à des projets de votre compte. Si vous supprimez un projet depuis le tableau de bord
avant cela, les événements et tout ce qui lui appartient sont supprimés immédiatement.

12.3. **Copie avant la suppression.** Jusqu’à la date de la suppression, le propriétaire du compte
exporte les événements de chaque projet depuis le tableau de bord, dans un fichier CSV compressé qui
reste disponible pendant 7 jours (Conditions d’utilisation, Clause 11.5 ; Annexe I, point 11). Si
l’exportation par le tableau de bord ne fonctionne pas, nous envoyons le fichier **dans les 10 jours
ouvrés** suivant la demande faite par e-mail ; si la demande arrive près de la date de suppression,
nous reportons la suppression jusqu’à la remise de la copie.

12.4. **Copies des prestataires.** Après la suppression, les données peuvent encore exister pendant une
durée limitée dans les sauvegardes automatiques du prestataire de la base de données : l’historique de
restauration de Neon conserve les modifications pendant 7 jours au plus, et les sauvegardes de Neon
sont conservées pendant 30 jours au plus. Ces copies ne servent à rien d’autre qu’à la reprise après
sinistre et disparaissent d’elles-mêmes dans ces délais. Un fichier d’exportation non encore expiré
disparaît au plus tard 7 jours après avoir été prêt. Les journaux techniques de l’API (qui ne
contiennent pas de données des visiteurs ; Annexe II, point 9) disparaissent au bout de 14 jours.

12.5. **Confirmation.** Le propriétaire du compte reçoit un e-mail lorsque la suppression est
effectuée. Si vous le demandez, nous confirmons également la date et ce qui a été supprimé.

12.6. **Exception : préservation en vertu de la loi ou d’un ordre.** Nous ne conservons des données de
vos projets au-delà de ces délais que lorsqu’une loi, une décision judiciaire ou une réquisition d’une
autorité compétente nous y oblige, ou lorsqu’elles sont nécessaires pour une procédure judiciaire,
administrative ou arbitrale (LGPD, arts. 7º, VI, et 16, I). Dans ce cas, nous ne préservons que les
données concernées, sans aucun autre usage, pendant la durée exigée, puis nous les supprimons ; nous
vous prévenons, sauf si la loi ou l’ordre interdit cet avertissement.

12.7. **Compte du forfait gratuit sans événements.** Un compte du forfait gratuit qui ne reçoit aucun
événement dans les 30 jours suivant sa création, ou qui reste 90 jours consécutifs sans recevoir
d’événements, est supprimé comme l’indique la Clause 7.6 des Conditions d’utilisation : le
propriétaire du compte reçoit un avis par e-mail et, si le compte reste sans événements 7 jours plus
tard, une routine quotidienne supprime le compte, les projets et tout ce qui leur appartient, comme au
point 12.2, sans le délai de 30 jours de ce point. D’ici là, le propriétaire du compte peut exporter
les événements (point 12.3). Les points 12.4 (copies des prestataires), 12.5 (confirmation par
e-mail) et 12.6 (préservation en vertu de la loi ou d’un ordre) s’appliquent également.

12.8. **Ville désactivée.** Lorsque le propriétaire du compte désactive la ville dans un projet
(Conditions d’utilisation, Clause 4.5), la réception cesse de lire la ville dans un délai d’une
minute. La routine quotidienne suivante supprime la ville de tous les événements déjà conservés dans
le projet, et cette suppression s’achève au plus tard 48 heures après la désactivation, à condition
que l’option reste désactivée jusque-là. Les points 12.4 (les sauvegardes du prestataire et les
fichiers d’exportation non encore expirés disparaissent dans les délais de ce point) et 12.6 (dans
un projet dont les données sont préservées en vertu de la loi ou d’un ordre, les villes restent
conservées pendant la durée de la préservation) s’appliquent. Les fichiers que vous avez déjà
téléchargés et ce que les personnes ayant accès ont déjà transféré vers des applications connectées
(Annexe I, point 10) relèvent de votre responsabilité.

## Clause 13 — Informations et audit

13.1. Si vous le demandez par écrit, nous fournissons les informations nécessaires pour démontrer que
nous respectons le présent accord, **dans les 15 jours**. Cela comprend la réponse à un questionnaire
raisonnable de sécurité et de confidentialité, sans frais, une fois par an et après tout incident.

13.2. Comme le code de Pyxis est public, vous pouvez vérifier directement le fonctionnement du service.
Compte tenu de la taille du service, nous ne proposons ni audit sur site ni accès aux systèmes de
production ; les rapports et certifications des prestataires (AWS, Databricks/Neon, Vercel) sont
disponibles sur leurs sites.

13.3. Nous collaborons avec l’ANPD et avec les autres autorités compétentes lors des contrôles portant
sur les données de vos projets.

## Clause 14 — Responsabilité

14.1. Chaque partie répond des dommages qu’elle cause en enfreignant la LGPD ou le présent accord.
Nous, en tant que sous-traitant, répondons envers les personnes concernées dans les conditions de
l’art. 42 de la LGPD : lorsque nous enfreignons la législation sur la protection des données ou ne
suivons pas vos instructions licites.

14.2. Entre vous et nous, la Clause 19 (Responsabilité) des Conditions d’utilisation s’applique. Rien
dans celle-ci ne réduit les droits des personnes concernées ni le droit de recours de l’art. 42, § 4º,
de la LGPD.

## Clause 15 — Demandes des autorités

15.1. Nous ne remettons des données de vos projets à une autorité qu’en présence d’une décision
judiciaire ou d’une réquisition émanant de quiconque a la compétence légale pour la formuler (Marco
Civil da Internet — cadre civil brésilien de l’internet —, Lei nº 12.965/2014, art. 10).

15.2. Avant de les remettre, nous vous prévenons, sauf si la loi ou l’ordre interdisent cet
avertissement. Nous ne remettons que ce qui est exigé.

## Clause 16 — Durée et modifications

16.1. Le présent accord s’applique tant que les Conditions d’utilisation sont en vigueur et, après
celles-ci, jusqu’à ce que les données soient supprimées conformément à la Clause 12.

16.2. Les modifications du présent accord suivent la règle de modification des Conditions
d’utilisation (préavis de 30 jours et droit de mettre fin au contrat). Les modifications imposées par
la loi ou par l’ANPD peuvent s’appliquer plus tôt ; dans ce cas, vous pouvez mettre fin au contrat avec
remboursement au prorata de la période payée et non utilisée.

---

## Annexe I — Description du traitement

**1. Finalité.** Mesurer l’utilisation des sites et applications du client et présenter l’analyse au
client ; donner suite aux demandes des personnes concernées ; maintenir la sécurité et le bon
fonctionnement du service.

**2. Personnes concernées.** (a) Visiteurs des sites et applications du client ; (b) utilisateurs du
système du client qu’il identifie avec la fonction `identify`.

**3. Données de chaque événement conservé.**

| Donnée | Description |
|---|---|
| Identifiant de l’événement | Numéro aléatoire généré dans le navigateur |
| Nom de l’événement | `page_view` (page vue), `api_request` (appel à l’API du site), `identify` ou un nom que le client définit |
| Date et heure | Celle du navigateur, corrigée de l’écart d’horloge, et celle de réception sur le serveur |
| Identifiant de la visite | Numéro aléatoire conservé dans le `sessionStorage` de l’onglet ; remplacé à la fermeture de l’onglet ou après 30 minutes d’inactivité |
| Identifiant d’utilisateur | Uniquement si le client utilise `identify` : l’identifiant interne du compte dans le système du client, d’au plus 64 lettres, chiffres, `-` ou `_` (n’accepte pas `@`, donc n’accepte pas d’e-mail) |
| Page | Uniquement le chemin, sous forme de modèle : les segments qui ressemblent à des identifiants (nombres, codes longs, e-mails) deviennent `:id` ; sans domaine et sans paramètres |
| Origine de la visite | Uniquement le domaine d’où vient le visiteur (par exemple, `google.com`), sans l’adresse complète |
| Campagne | `utm_source`, `utm_medium` et `utm_campaign`, s’ils figurent dans l’adresse ; le canal (payant, e-mail, social, campagne, recherche organique, autre site ou direct) calculé à partir de ceux-ci et de l’origine |
| Clic sur une annonce | Uniquement vrai ou faux. Le code du clic (comme `gclid`) n’est pas conservé |
| Appareil | Catégorie : mobile, tablette, ordinateur ou autre |
| Navigateur et système | Uniquement la famille (par exemple, `chrome`, `safari`, `android`, `ios`), sans version |
| Pays, État et ville | Code du pays (2 lettres) et État (code et nom), fournis par le réseau d’AWS au moment de la requête. La **ville** (nom approximatif, déduit de l’adresse IP par le réseau d’AWS), uniquement dans les projets où le propriétaire du compte a activé cette option (Conditions d’utilisation, Clause 4.5), désactivée par défaut, et uniquement lorsque l’État a également été fourni |
| Propriétés | Jusqu’à 10 par événement, définies par le client : clé d’au plus 40 caractères (`a-z`, `0-9`, `_`) et valeur courte (texte d’au plus 100 caractères, nombre ou vrai/faux) |
| Appels à l’API du site (`api_request`) | Méthode, route sous forme de modèle, code de réponse, durée et, le cas échéant, le code d’erreur |

**4. Ce que Pyxis ne conserve pas.**

- **Adresse IP :** utilisée uniquement dans la mémoire de la fonction de l’API, pour limiter les abus,
  pendant la durée de la fenêtre de limitation (1 minute pour l’envoi d’événements ; 15 minutes pour la
  connexion au tableau de bord). Elle n’est jamais enregistrée dans la base ni dans les journaux.
- **Navigateur complet (user agent) :** lu sur le moment pour déterminer la catégorie d’appareil, la
  famille du navigateur et celle du système ; ensuite écarté. Les visites de robots connus sont
  écartées.
- **Cookies :** le traceur ne crée pas de cookies sur les sites du client.
- **Adresse complète de la page, paramètres de l’adresse (autres que ceux de campagne), empreinte
  du navigateur, code postal et coordonnées géographiques :** jamais.
- **Ville :** uniquement dans les projets où le propriétaire du compte a activé cette option. Lorsque
  l’option est désactivée, la ville cesse d’être lue, et les villes déjà conservées sont supprimées
  dans les délais de la Clause 12.8.

**5. Données personnelles sensibles.** Elles ne doivent pas être envoyées (Clause 6.1, point 3). Pyxis
n’a pas été conçu pour les traiter.

**6. Récapitulatif hebdomadaire par e-mail.** Chaque lundi, chaque personne ayant accès au projet qui n’a pas
désactivé le récapitulatif reçoit des chiffres agrégés de la semaine : visites, personnes identifiées
(uniquement le décompte), conversions, écritures en échec, visites par jour, pages et événements
les plus fréquents et routes présentant le plus d’échecs. Le récapitulatif ne contient pas d’identifiants de
visiteurs ni d’utilisateurs.

**7. Opérations de traitement.** Réception, validation, classification, stockage, consultation,
agrégation, affichage sur le tableau de bord, mise à disposition par l’API de consultation, par le
serveur MCP et aux applications connectées, envoi du récapitulatif
agrégé par e-mail, copie (exportation), suspension de la réception (Clause 5.4) et suppression.

**8. Fréquence et durée.** Continue, tant que le traceur est installé et que le contrat est en vigueur.
Événements conservés pendant 13 mois ; suppression à la fin du contrat conformément à la Clause 12.

**9. Où.** Base de données et API à São Paulo (Brésil). Tableau de bord dans des fonctions de la région
de São Paulo. Situations comportant un élément étranger à la Clause 9.5.

**10. Accès par le serveur MCP, par des jetons et par des applications connectées.** Les données du
tableau de bord sortent de Pyxis par trois chemins, tous choisis par une personne ayant accès au
projet, qui les utilise en son nom propre :

1. **Jeton dans le serveur MCP local ou dans un autre programme :** la personne crée un jeton d’accès
   et l’utilise dans le serveur MCP de Pyxis (`pyxis-mcp`), qui tourne sur son ordinateur, ou dans un
   autre programme. Les données vont vers cet ordinateur et vers l’outil d’intelligence artificielle
   qu’elle a choisi.
2. **Jeton à l’adresse `https://api.pyxis-analytics.dev/mcp` :** la même chose, avec le serveur MCP
   fonctionnant au sein de notre API ; les données vont au programme que la personne a configuré avec
   le jeton.
3. **Application connectée (connecteur Claude) :** la personne connecte Claude ou Claude Code,
   d’Anthropic, et autorise la connexion sur une page du tableau de bord (Conditions d’utilisation,
   Clause 13.10). Les données que l’application demande vont de notre API directement aux serveurs
   d’Anthropic, aux États-Unis (Claude), ou à l’ordinateur de la personne et de là à Anthropic
   (Claude Code).

Par l’un quelconque de ces chemins, l’application ne fait que lire, et uniquement ce que la personne
voit sur le tableau de bord : les chiffres agrégés ainsi que les listes de visites et la chronologie de
chaque visite, avec l’identifiant d’utilisateur envoyé par la fonction `identify` (point 3). Cet envoi
constitue une instruction de votre part (Clause 5.1, point 4) et a lieu à la demande de la personne,
au sein de l’application qu’elle a choisie : cette application, y compris Anthropic, **n’est pas**
notre sous-traitant ultérieur, traite les données selon les conditions applicables entre elle et son
utilisateur, et il vous appartient d’évaluer son utilisation, y compris s’il y a transfert
international et selon quel mécanisme (art. 4º du Règlement approuvé par la Resolução CD/ANPD
nº 19/2024), ainsi que l’information des visiteurs (Clause 6.1, points 2 et 8, et Annexe IV). Nous
vous fournissons les informations dont nous disposons pour cette évaluation (art. 4º, § 1º, du même
Règlement ; Clause 9.6). Chaque personne révoque ses connexions dans
Paramètres → Applications connectées, et le propriétaire du compte peut retirer une personne d’un
projet (Conditions d’utilisation, Clause 13.3).

**11. Exportation des événements.** À la demande du propriétaire du compte, une routine génère un
fichier CSV compressé contenant tous les événements que le projet conserve, avec les champs du
point 3. Le fichier est placé dans un espace de stockage privé et chiffré d’AWS dans la région de
São Paulo et est supprimé automatiquement 7 jours après avoir été prêt. Seul le propriétaire du compte
télécharge le fichier, depuis le tableau de bord, avec un nouveau lien à chaque téléchargement,
valable 5 minutes. Une fois téléchargé, le fichier est sous votre responsabilité.

---

## Annexe II — Mesures de sécurité en vigueur

Vérifiées dans le code du service et dans la configuration de l’infrastructure le 14/10/2026 et le
15/10/2026 ; le point 1 (ville), le 29/10/2026.

**1. Protection de la vie privée dès la conception.** Pas de cookies sur les sites mesurés ; IP et
navigateur complet jamais conservés ; pages réduites à des modèles ; barrière sur le serveur qui écarte
les valeurs ayant la forme d’un e-mail et les nombres de 10 chiffres ou plus dans les propriétés, les
paramètres de campagne et l’identifiant d’utilisateur ; État du visiteur, et la ville uniquement
lorsque le client active cette option dans le projet, désactivée par défaut ; signaux
« ne pas suivre » du navigateur (Global Privacy Control et Do Not Track) respectés par le traceur, qui
n’envoie rien lorsqu’ils sont activés ; option de ne pas être mesuré (`optOut`) pour le visiteur ;
événements supprimés après 13 mois.

**2. Chiffrement en transit.** Navigateur → API : HTTPS avec TLS 1.2 ou supérieur et HSTS de 2 ans.
Réseau de distribution → fonction de l’API : HTTPS uniquement (TLS 1.2). Fonction → base de données :
TLS avec vérification du certificat du serveur (`sslmode=verify-full`). Tableau de bord : HTTPS
uniquement.

**3. Chiffrement au repos.** Base de données de Neon en AES-256 ; journaux (logs) d’AWS chiffrés par
défaut ; secrets (mots de passe de la base et clés de services) dans AWS Systems Manager Parameter
Store, chiffrés, jamais dans le code.

**4. Accès au tableau de bord.**

- Connexion sans mot de passe : un code à 6 chiffres envoyé à l’e-mail autorisé, valable 10 minutes,
  conservé uniquement sous forme de hash (SHA-256), avec jusqu’à 5 tentatives par code et jusqu’à
  5 codes par heure par e-mail ; demandes de code limitées à 5 toutes les 15 minutes par adresse
  d’origine. Un e-mail sans accès ne reçoit pas de code et n’est pas enregistré.
- Session : valeur aléatoire de 256 bits conservée dans la base uniquement sous forme de hash ; cookie
  `__Host-` avec `HttpOnly`, `Secure` et `SameSite=Lax` ; durée maximale de 7 jours et fin automatique
  après 24 heures sans utilisation ; la personne voit les sessions ouvertes, les ferme une par une ou
  toutes à la fois.
- Actions d’écriture du tableau de bord acceptées uniquement depuis l’origine du tableau de bord
  lui-même.
- Seul le propriétaire du compte modifie les projets, les origines, les clés et les personnes, demande
  des exportations et clôture le compte ; les personnes invitées ne font que lire.

**5. Isolation entre clients.** Toute requête est filtrée par le projet et par la liste des personnes
y ayant accès. Demander le projet d’autrui produit la même réponse que s’il n’existait pas. Des tests
automatiques le vérifient.

**6. Clés et jetons.**

- Clé publique (placée sur le site) : ne fait qu’identifier le projet et n’est acceptée que lorsque la
  requête provient d’une origine enregistrée dans le projet.
- Clé secrète (uniquement sur le serveur du client) : affichée une seule fois lors de sa création,
  conservée uniquement sous forme de hash, comparée en temps constant, révocable ; limitée à 60 appels
  par minute.
- Jetons d’accès (pour les agents et les programmes) : **lecture seule** ; conservés uniquement sous
  forme de hash ; validité de 30, 90 ou 365 jours ; jusqu’à 10 actifs par personne ; révocables à tout
  moment sur le tableau de bord ; limités à 60 requêtes par minute et, dans le serveur MCP de l’API, à
  120 messages par minute. Ils ne permettent ni la connexion, ni l’écriture, ni la suppression.
- Connexions d’applications (connecteur Claude) : uniquement Claude et Claude Code, reconnus par les
  documents d’identification qu’Anthropic publie, avec l’adresse de retour vérifiée par rapport à ces
  documents ; consentement explicite sur une page du tableau de bord, qui affiche l’application,
  l’adresse de retour et les projets ; code à usage unique valable 5 minutes et lié à une preuve
  cryptographique (PKCE, S256) ; identifiant d’accès de 1 heure et identifiant de renouvellement
  remplacé à chaque utilisation, tous deux conservés uniquement sous forme de hash ; un identifiant de
  renouvellement présenté à nouveau après avoir été remplacé met fin à la connexion ; **lecture
  seule**, par les mêmes requêtes que le tableau de bord ; jusqu’à 10 connexions actives par
  personne ; fin après 90 jours sans utilisation ; révocables à tout moment sur le tableau de bord ;
  limitées à 120 messages par minute dans le serveur MCP et à 60 requêtes par minute. Elles ne
  permettent ni la connexion, ni l’écriture, ni la suppression.

**7. Protection contre les abus.** Limite d’envoi de lots par adresse d’origine et par projet ; lot de
50 événements et 32 Ko au maximum ; validation stricte de chaque champ ; événements invalides écartés ;
réception mise en pause lorsque le compte atteint 150 % de la limite mensuelle d’événements sur le
forfait payant, ou 100 % sur le forfait gratuit ; les journaux techniques indiquent quand un
événement ou une propriété a été refusé et par quelle règle, sans conserver la valeur refusée.

**8. Infrastructure.** La fonction de l’API refuse les appels qui ne passent pas par le réseau de
distribution (secret de périphérie vérifié en temps constant). L’utilisateur de base de données de
l’application ne peut pas modifier la structure de la base ; les migrations utilisent un utilisateur
distinct. Chaque fonction possède son propre rôle de permissions sur AWS, avec le minimum nécessaire.

**9. Journaux (logs).** Les journaux de l’API sont structurés et comportent un identifiant de la
requête, des identifiants internes (du projet, de la personne du tableau de bord et de la connexion),
des noms d’événements et, pour les connexions, l’application qui s’est connectée ; **ils ne
contiennent ni e-mail, ni IP, ni jeton, ni clé, ni données de visiteurs**. Ils sont conservés 14 jours
puis disparaissent.

**10. Surveillance.** Alarmes par e-mail pour : de nombreuses tentatives de connexion avec un code
erroné, de nombreuses demandes de code refusées, des erreurs inattendues de l’API, des défaillances et
la limitation de débit (throttling) de la fonction de l’API et la taille de la base.

**11. Développement.** Code public avec revue automatique de sécurité (CodeQL), analyse des secrets
avec blocage de l’envoi, alertes et mises à jour des dépendances, audit des dépendances et tests
automatiques avec couverture totale à chaque modification. La mise en production est effectuée
uniquement par le responsable, après la réussite des tests.

**12. Sauvegardes.** Celles de Neon : historique de restauration de 7 jours au plus et sauvegardes
chiffrées conservées pendant 30 jours au plus.

**13. Réponse aux incidents.** Conformément à la Clause 11, avec enregistrement de chaque incident
pendant 5 ans.

---

## Annexe III — Sous-traitants ultérieurs

Situation au 15/10/2026.

**Sous-traitants ultérieurs qui traitent des données des visiteurs de vos sites :**

| Prestataire | Ce qu’il fait dans Pyxis | Où | Contrat de traitement | Durée des copies et des journaux |
|---|---|---|---|---|
| **Amazon Web Services (AWS)** | API qui reçoit les événements et répond aux requêtes ; routines quotidiennes (nettoyage à 13 mois, utilisation mensuelle, icônes, fin des comptes) et hebdomadaires (récapitulatif) ; fichiers d’exportation des événements (Amazon S3) ; journaux techniques ; conservation des secrets ; réseau de distribution (CloudFront) devant l’API | Région de São Paulo (sa-east-1). Le réseau de distribution reçoit les requêtes dans des points de présence dans le monde entier, sans les conserver | Contrat client AWS et Avenant relatif au traitement des données d’AWS. AWS s’engage à ne pas sortir les données de la région choisie, sauf dans la mesure nécessaire pour fournir le service ou respecter la loi | Journaux de l’API : 14 jours. Fichiers d’exportation : 7 jours |
| **Neon** (Databricks, Inc., États-Unis) | Base de données (Postgres) où se trouvent les événements et la configuration des projets | Serveurs dans la région de São Paulo d’AWS (aws-sa-east-1) ; entreprise aux États-Unis | Conditions de Neon/Databricks et Avenant relatif au traitement des données de Databricks | Historique de restauration : 7 jours au plus. Sauvegardes : 30 jours au plus |
| **Vercel Inc.** (États-Unis) | Héberge le tableau de bord (`app.pyxis-analytics.dev`) : génère les pages qui affichent vos chiffres aux personnes connectées | Fonctions dans la région de São Paulo (gru1) ; entreprise et traitement principal aux États-Unis | Avenant relatif au traitement des données de Vercel | Journaux techniques des requêtes au tableau de bord : 1 jour |

**Prestataires qui ne reçoivent pas de données des visiteurs** (énumérés par souci de transparence ;
le traitement qu’ils effectuent figure dans la Politique de confidentialité de Pyxis) :

| Prestataire | Ce qu’il fait | Où |
|---|---|---|
| **Amazon SES** (Amazon Web Services) | Envoie les e-mails du service : codes de connexion et d’inscription, invitations, bienvenue, avis d’utilisation et de fin du compte, avis d’exportation prête (avec le lien du tableau de bord, pas le fichier) et le récapitulatif hebdomadaire avec des chiffres agrégés | Région de São Paulo (sa-east-1) |
| **Stripe** (Stripe Brasil Soluções de Pagamento – Instituição de Pagamento Ltda. et Stripe, LLC, États-Unis) | Facturation de l’abonnement | Brésil et États-Unis |
| **ImprovMX** (ImprovMX Incorporated, États-Unis) | Transfère les e-mails envoyés à hello@pyxis-analytics.dev | Réception transitoire en France ; entreprise aux États-Unis |
| **Google** (Google LLC, États-Unis) | Boîte e-mail où sont conservés les messages d’assistance (compte personnel, sans contrat de sous-traitance : Google traite les messages en tant que responsable du traitement, conformément à sa propre politique de confidentialité) | États-Unis et autres pays |

**Applications que les personnes ayant accès connectent** (ce ne sont pas des sous-traitants
ultérieurs ; Annexe I, point 10) :

| Application | Qui | Ce qu’elle reçoit | Où |
|---|---|---|---|
| **Claude** et **Claude Code** | Anthropic, PBC (États-Unis) | Les données que l’application demande, lorsqu’une personne ayant accès l’a connectée et l’utilise | États-Unis |

N’envoyez pas de données de visiteurs dans les messages d’assistance. Si vous devez montrer un cas,
utilisez l’identifiant de la visite ou de l’utilisateur, jamais le nom ou l’e-mail de la personne.

---

## Annexe IV — Modèle d’avis pour votre site

Texte suggéré pour la politique de confidentialité de votre site. Adaptez-le à ce que votre site envoie
réellement. Il ne remplace pas votre propre analyse.

> **Mesure de l’utilisation du site**
>
> Nous utilisons Pyxis pour comprendre comment le site est utilisé : quelles pages sont vues, d’où
> viennent les visites et quelles fonctionnalités sont utilisées. La mesure **n’utilise pas de
> cookies**, **ne conserve pas votre adresse IP** et **ne conserve pas votre navigateur complet**. Nous
> enregistrons la page vue (sans les paramètres de l’adresse, sauf ceux de campagne), le site d’où vous
> venez, le type d’appareil, la famille du navigateur et du système, le pays et l’État (jamais la
> ville) et les actions que nous avons balisées sur le site. Chaque visite reçoit un numéro aléatoire
> qui reste uniquement dans l’onglet du navigateur et est écarté à la fermeture de l’onglet ou après
> 30 minutes d’inactivité ; aucun identifiant ne vous reconnaît lors d’une autre visite.
>
> *(Si vous avez activé la ville dans le projet, remplacez « le pays et l’État (jamais la ville) » par
> « le pays, l’État et la ville approximative, déduits de votre adresse IP au moment de l’accès, sans
> conserver l’IP ». Si votre site utilise aussi la fonction `identify`, remplacez, dans le paragraphe
> suivant, « nous relions les événements de cette visite au numéro interne de votre compte » par
> « nous relions les événements de cette visite, y compris la ville approximative, au numéro interne
> de votre compte ». Si cet avis était déjà publié sans la ville, mettez en évidence le changement et
> la date à laquelle il prend effet.)*
>
> *(N’incluez le paragraphe ci-dessous que si votre site utilise la fonction `identify`.)* Lorsque vous
> vous connectez à votre compte, nous relions les événements de cette visite au numéro interne de votre
> compte, jamais à votre nom ou à votre e-mail. Si vous supprimez votre compte ou si vous le demandez,
> nous supprimons ces événements.
>
> *(Facultatif : à inclure si votre équipe connecte des outils d’intelligence artificielle à Pyxis.)*
> Nous pouvons consulter ces chiffres avec des outils d’intelligence artificielle que nous choisissons,
> comme Claude, d’Anthropic, qui ne reçoivent que ce que nous leur demandons.
>
> Les données sont conservées au Brésil et supprimées après 13 mois. Pyxis traite ces données pour
> notre compte, en tant que sous-traitant. Si votre navigateur envoie le signal Global Privacy Control
> ou « Do Not Track », rien n’est envoyé. Pour exercer les droits que vous confère la LGPD (loi générale
> brésilienne sur la protection des données personnelles), contactez-nous par le canal indiqué dans la
> présente politique.
