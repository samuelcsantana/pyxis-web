# Datenschutzerklärung von Pyxis

**Version {{terms.version}}, gültig ab {{terms.effectiveFrom}}.**

> Dies ist eine Höflichkeitsübersetzung. Verbindlich ist die portugiesische Fassung
> ([Português](/privacidade)); weichen die beiden voneinander ab, gilt die portugiesische Fassung.

Diese Erklärung erläutert, welche personenbezogenen Daten Pyxis **als Verantwortlicher** verarbeitet,
wofür, auf welcher Rechtsgrundlage, an wen sie weitergegeben werden, wie lange sie aufbewahrt werden
und wie du deine Rechte ausübst, gemäß der Lei Geral de Proteção de Dados Pessoais (LGPD;
brasilianisches allgemeines Datenschutzgesetz; Lei nº 13.709/2018).

Sie gilt für:

1. **Kunden**, die das gehostete Pyxis beauftragen, vertreten durch den **Kontoinhaber**, der die
   Registrierung vornimmt und das Konto verwaltet;
2. **Personen mit Zugriff auf das Dashboard** (`app.pyxis-analytics.dev`): den Kontoinhaber und die
   Personen, die er einlädt;
3. **Personen, die uns schreiben**, an hello@pyxis-analytics.dev;
4. **Besucher der Startseite** `pyxis-analytics.dev`.

Sie betrifft **nicht** die Besucher der Websites unserer Kunden. Auf diesen Websites entscheidet der
Inhaber der Website über die Messung (der Verantwortliche); wir handeln als Auftragsverarbeiter, nach
den Regeln des Auftragsverarbeitungsvertrags. Wenn du eine Website besucht hast, die Pyxis nutzt, lies
die Datenschutzerklärung dieser Website.

---

## 1. Wer der Verantwortliche ist und wie du uns erreichst

1.1. Verantwortlicher ist **{{seller.name}}**, natürliche Person, eingetragen im CPF (Cadastro de
Pessoas Físicas; brasilianisches Steuerregister für natürliche Personen) unter der Nr.
**{{seller.taxId}}**, mit Anschrift in **{{seller.address}}**, der den Dienst unter dem Namen
**Pyxis** anbietet.

1.2. Kanal für jedes Datenschutzanliegen, auch die Ausübung deiner Rechte:
**hello@pyxis-analytics.dev**. Die Nachrichten werden vom Verantwortlichen selbst gelesen und
beantwortet.

1.3. Als kleiner Verarbeitungsakteur (agente de tratamento de pequeno porte) benennen wir keinen
Datenschutzbeauftragten (encarregado pelo tratamento de dados pessoais im Sinne der LGPD); dieser
Kanal erfüllt die in Art. 41 § 2 I der LGPD vorgesehene Funktion (Resolução CD/ANPD nº 2/2022, Art. 11,
und Resolução CD/ANPD nº 18/2024, Art. 3 § 3; Beschlüsse der ANPD — Agência Nacional de Proteção de
Dados, brasilianische nationale Datenschutzbehörde).

## 2. Welche Daten wir verarbeiten, wofür, auf welcher Rechtsgrundlage und wie lange

### 2.1. Personen mit Zugriff auf das Dashboard

| Datenfeld | Wofür | Rechtsgrundlage (LGPD) | Wie lange |
|---|---|---|---|
| E-Mail-Adresse, Sprache der E-Mails (die des Bildschirms, auf dem du dich angemeldet oder registriert hast), Projekte, auf die du Zugriff hast, ob du Kontoinhaber oder Eingeladener bist, Entscheidung über die wöchentliche Zusammenfassung, Registrierungsdatum | Den Anmeldecode und die E-Mails des Dienstes senden, deine Projekte anzeigen und die wöchentliche Zusammenfassung in deiner Sprache senden | Vertragserfüllung, für den Kontoinhaber (Art. 7 V); berechtigtes Interesse von uns und dem Kunden, den vom Inhaber eingeladenen Personen Zugriff zu geben (Art. 7 IX) | Solange du Zugriff auf irgendein Projekt hast oder Inhaber eines Kontos bist. Wenn der Inhaber dich aus einem Projekt entfernt, endet der Zugriff darauf sofort; hast du auf kein Projekt mehr Zugriff, löschen wir deine Registrierung innerhalb von 30 Tagen. In jedem Fall wird die Registrierung zusammen mit dem Konto gelöscht (Punkt 2.2) |
| Einladung: deine E-Mail-Adresse, der Name des Projekts und die E-Mail-Adresse der einladenden Person, in der Einladungs-E-Mail | Dich über den Zugriff informieren und darüber, wer ihn gewährt hat | Berechtigtes Interesse von uns und dem Kunden (Art. 7 IX) | Die Einladung selbst bleibt nicht in unserer Datenbank (nur die Registrierung aus der Zeile oben); der Versandeintrag bleibt beim E-Mail-Anbieter für dessen Frist (Punkt 3) |
| Anmelde- und Registrierungscodes: E-Mail-Adresse, nur als Hash gespeicherter Code, Zweck (Anmeldung oder Registrierung), Sprache, Versuche, Uhrzeiten | Die Anmeldung und die Registrierung ohne Passwort ermöglichen und wiederholte Versuche verhindern | Vertragserfüllung, vorvertragliche Maßnahmen und berechtigtes Interesse an Sicherheit (Art. 7 V und IX) | Gelten 10 Minuten; werden nach Ablauf vom täglichen Vorgang gelöscht |
| Sitzungen: nur als Hash gespeicherter Wert, Datum des Beginns und der letzten Nutzung, Gerätekategorie und Familie des Browsers und des Betriebssystems (ohne Version) | Dich angemeldet halten und dir deine Sitzungen anzeigen, damit du sie beenden kannst | Vertragserfüllung und berechtigtes Interesse an Sicherheit (Art. 7 V und IX) | Höchstens 7 Tage oder 24 Stunden ohne Nutzung; werden nach ihrem Ende vom täglichen Vorgang gelöscht |
| Zugriffstokens: von dir vergebener Name, nur als Hash gespeicherter Wert, Datum der Erstellung, der letzten Nutzung, der Gültigkeit und des Widerrufs | Programmen und Agenten ermöglichen, deine Zahlen zu lesen | Vertragserfüllung (Art. 7 V) | Bis zur Löschung deiner Registrierung (ein abgelaufenes oder widerrufenes Token funktioniert sofort nicht mehr, aber der Eintrag bleibt bis dahin) |
| Verbundene Apps (Claude-Connector): die App (Claude oder Claude Code), das Datum, an dem du sie verbunden hast, der letzten Nutzung (höchstens alle 5 Minuten und bei jeder Erneuerung gespeichert) und des Widerrufs; Zugangsdaten der Verbindung, nur als Hash gespeichert | Der von dir verbundenen App erlauben, deine Zahlen zu lesen, und dir die Verbindungen anzeigen, damit du sie widerrufen kannst | Vertragserfüllung, für den Kontoinhaber (Art. 7 V); berechtigtes Interesse von uns und dem Kunden, diese Funktion den vom Inhaber eingeladenen Personen zu bieten (Art. 7 IX) | Solange die Verbindung aktiv ist. Der tägliche Vorgang löscht die widerrufene oder seit 90 Tagen ungenutzte Verbindung, die abgelaufenen Zugangsdaten und die bereits vor mehr als 30 Tagen ausgetauschten Erneuerungs-Zugangsdaten |
| Verbindungsanfragen: die App, die Adresse, an die die Antwort zurückgeht, die technischen Daten, die die App zum Schutz der Anfrage sendet, die Uhrzeiten, deine Entscheidung (zulassen oder abbrechen), wer entschieden hat, und der nur als Hash gespeicherte Einmalcode | Die Anfrage auf der Einwilligungsseite anzeigen und die Antwort nur an die anfragende App liefern | Vertragserfüllung, für den Kontoinhaber, und berechtigtes Interesse an Sicherheit und daran, den Eingeladenen die Funktion zu bieten (Art. 7 V und IX) | Die Anfrage gilt 10 Minuten, der Code 5. Der tägliche Vorgang löscht die Anfrage 1 Tag nach ihrem Ablauf; danach bleibt nur die Verbindung aus der Zeile oben |
| Versandeintrag der wöchentlichen Zusammenfassung (Projekt, Person, Woche, Versanddatum) | Dieselbe Zusammenfassung nicht zweimal senden | Vertragserfüllung (Art. 7 V) | Bis zur Löschung des Projekts oder deines Zugriffs |
| Technische Protokolle der API mit deiner internen Kennung (zum Beispiel „hat sich angemeldet“, „hat die Sitzung beendet“, „hat ein Token erstellt“, „hat eine App verbunden“) | Sicherheit und Untersuchung von Fehlern und Vorfällen | Berechtigtes Interesse an Sicherheit (Art. 7 IX) | 14 Tage |

**IP-Adresse:** wenn du einen Code anforderst oder dich im Dashboard anmeldest, wird die IP nur im
Arbeitsspeicher des Servers verwendet, um Versuche zu begrenzen (bis zu 5 alle 15 Minuten), und
verschwindet nach höchstens 15 Minuten. Sie **wird weder** in unserer Datenbank noch in unseren
Protokollen **gespeichert**. Vercel, das das Dashboard hostet, empfängt die IP und den Browser der
Zugreifenden und speichert sie 1 Tag lang in seinen technischen Protokollen (Punkt 3).

### 2.2. Kunden (Kontoinhaber)

| Datenfeld | Wofür | Rechtsgrundlage (LGPD) | Wie lange |
|---|---|---|---|
| Konto: Inhaber, Tarif (kostenlos oder kostenpflichtig), Status des Abonnements, Abrechnungsintervall, Kennungen des Kunden und des Abonnements bei Stripe (nur im kostenpflichtigen Tarif), Daten (Ende der Testphase, des Zeitraums, des Zugriffs, der versandten Hinweise), monatliche Ereignisnutzung und versandte Hinweise zum Kontingent und zu Konten ohne Ereignisse | Den Dienst erbringen, die Grenzen des Tarifs anwenden, den Zugriff entsprechend dem Tarif und dem Abonnement ein- und ausschalten, Konten des kostenlosen Tarifs ohne Ereignisse benachrichtigen und löschen, über das Ende des Kontos informieren | Vertragserfüllung (Art. 7 V) | Bis zur Löschung des Kontos: 30 Tage nach dem Ende des Zugriffs oder, bei einem Konto des kostenlosen Tarifs ohne Ereignisse, 7 Tage nach der Benachrichtigung (Nutzungsbedingungen, Klausel 7.6) |
| Annahme der Bedingungen: angenommene Version, Datum und Uhrzeit, Konto und annehmende Person (ohne IP) | Wissen, welche Version für dich gilt, und die Annahme nachweisen | Vertragserfüllung und regelmäßige Ausübung von Rechten (Art. 7 V und VI) | Bis zur Löschung des Kontos. Wenn du den kostenpflichtigen Tarif abonnierst, speichert Stripe als Verantwortlicher den Eintrag der auf seiner Zahlungsseite erfolgten Annahme |
| Abrechnungsdaten, nur von denjenigen, die den kostenpflichtigen Tarif abonnieren, von Stripe erhalten: Name, E-Mail-Adresse, Rechnungsanschrift, CPF oder CNPJ (Cadastro Nacional da Pessoa Jurídica; brasilianische Steuernummer für Unternehmen; falls angegeben), Kartenmarke, Endziffern und Ablaufdatum der Karte, Zahlungsverlauf, Erstattungen und Rückbuchungsanträge | Das Abonnement abrechnen, Quittungen senden, Widerruf, Erstattungen und Rückbuchungsanträge bearbeiten, steuerliche Pflichten erfüllen | Vertragserfüllung (Art. 7 V) und Erfüllung einer rechtlichen Verpflichtung (Art. 7 II) | Während des Vertrags und 5 Jahre lang, gerechnet ab dem Jahr nach dem jeweiligen Belastungsjahr (steuerliche Aufbewahrungsfrist) |
| Konfiguration der Projekte: Name, Adressen der Websites, Zeitzone, Conversion-Ereignis, öffentlicher Schlüssel, nur als Hash gespeicherter geheimer Schlüssel, von der Website selbst kopiertes Icon | Den Dienst erbringen | Vertragserfüllung (Art. 7 V) | Bis zur Löschung des Projekts durch den Inhaber oder des Kontos (Zeile „Konto“ oben) |
| Exportanfragen: wer angefragt hat, wann, Status und Anzahl der Ereignisse | Die Exportdatei erzeugen und dem Kontoinhaber liefern | Vertragserfüllung (Art. 7 V) | Bis zur Löschung des Projekts. Die Datei selbst wird 7 Tage nach ihrer Fertigstellung gelöscht |

**Im kostenlosen Tarif verlangen wir weder eine Karte noch Abrechnungsdaten.** Im kostenpflichtigen
Tarif **empfangen und speichern wir die Kartennummer nicht**: sie bleibt bei Stripe. Wir speichern nur
den Kartenfingerabdruck aus Punkt 2.7.

### 2.3. Personen, die uns schreiben

| Datenfeld | Wofür | Rechtsgrundlage (LGPD) | Wie lange |
|---|---|---|---|
| E-Mail-Adresse, Name, Inhalt der Nachricht und Anhänge | Zugangsanfragen, Fragen, Support, Beschwerden und Anfragen betroffener Personen beantworten | Vorvertragliche Maßnahmen und Vertragserfüllung (Art. 7 V); regelmäßige Ausübung von Rechten (Art. 7 VI); berechtigtes Interesse, denjenigen zu antworten, die sich an uns wenden (Art. 7 IX) | Bei bestehendem Vertrag: bis 5 Jahre nach dessen Ende (Frist für Schadensersatzansprüche, Código de Defesa do Consumidor — brasilianisches Verbraucherschutzgesetzbuch —, Art. 27). Ohne Vertrag: 1 Jahr nach der letzten Nachricht |

### 2.4. Besucher der Startseite (`pyxis-analytics.dev`)

Die Startseite von Pyxis wird von Pyxis selbst gemessen, mit denselben Regeln, die wir den Kunden
anbieten.

| Datenfeld | Wofür | Rechtsgrundlage (LGPD) | Wie lange |
|---|---|---|---|
| Aufgerufene Seite (Pfad, ohne Parameter außer den Kampagnenparametern), Aktionen auf der Seite (zum Beispiel das Öffnen der Demo), Herkunftswebsite (nur die Domain), Kampagnenparameter, Gerätekategorie, Familie des Browsers und des Betriebssystems, Land und Bundesstaat (nie die Stadt), Zufallsnummer des Besuchs | Verstehen, wie die Seite genutzt wird, und die Präsentation von Pyxis verbessern | Berechtigtes Interesse (Art. 7 IX und Art. 10) | 13 Monate |

Die Messung **verwendet keine Cookies**, **speichert weder IP** noch den vollständigen Browser und
**sendet nichts**, wenn dein Browser verlangt, nicht verfolgt zu werden (Global Privacy Control oder
Do Not Track). Auf der Seite selbst zeigt der Bereich „Was diese Seite erfasst hat“ jedes gesendete
Ereignis und ermöglicht es, die Messung in diesem Browser abzuschalten. Vercel, das die Seite hostet,
speichert die IP und den Browser der Zugreifenden 1 Tag lang in seinen technischen Protokollen.

### 2.5. Cookies und Speicherung im Browser

| Wo | Name | Art | Wofür | Dauer |
|---|---|---|---|---|
| Dashboard (`app.`) | `__Host-pyxis_session` | Notwendiges Cookie, `HttpOnly` und `Secure` | Dich angemeldet halten | 7 Tage oder bis du dich abmeldest |
| Dashboard und Demo (`app.` und `demo.`) | `pyxis_locale` | Präferenz-Cookie | Die gewählte Sprache speichern | 1 Jahr |
| Dashboard und Demo | `pyxis_theme` | Präferenz-Cookie | Das helle oder dunkle Design speichern, wenn gewählt | 1 Jahr |
| Dashboard | `pyxis:pending-sign-in` | `sessionStorage` (nur im Tab) | Die eingegebene E-Mail-Adresse speichern, während du auf den Code wartest, auch wenn du die Seite neu lädst | 10 Minuten oder bis zum Schließen des Tabs |
| Startseite | `pyxis:session` | `sessionStorage` (nur im Tab) | Zufallsnummer des Besuchs | Bis zum Schließen des Tabs oder 30 Minuten ohne Aktivität |
| Startseite | `pyxis:opt-out` | `localStorage` | Speichern, dass du die Messung abgeschaltet hast | Bis du sie wieder einschaltest oder die Browserdaten löschst |
| Startseite und Anmeldebildschirm des Dashboards | `pyxis:theme` | `localStorage` | Das auf diesem Gerät gewählte Design speichern | Bis du es änderst oder die Browserdaten löschst |

Die Startseite setzt keine Cookies. Wir verwenden keine Cookies von Dritten, für Werbung oder von
sozialen Netzwerken, und das Dashboard misst nicht die Nutzung der Personen, die sich darin anmelden.

### 2.6. E-Mails, die wir senden

Wir senden nur E-Mails im Zusammenhang mit dem Dienst: Anmelde- und Registrierungscodes; Einladung zu
einem Projekt; Willkommens-E-Mail mit der angenommenen Version der Bedingungen; Nutzungshinweise bei 80 %,
bei 100 % und zur Pause bei 150 % im kostenpflichtigen Tarif und bei 80 % und zur Pause bei 100 % im
kostenlosen Tarif; Hinweis auf ein Konto des kostenlosen Tarifs ohne Ereignisse; Hinweis auf das Ende
des Zugriffs, Erinnerung 7 Tage vor der
Löschung und Hinweis auf die erfolgte Löschung; Hinweis auf einen fertigen Export; die wöchentliche
Zusammenfassung (die jede Person in den Einstellungen unter „Wochenbericht“ abschalten kann); und Mitteilungen zum Vertrag,
einschließlich Hinweisen zu Missbrauch und Sperrung. Die Abrechnungs-E-Mails werden von Stripe selbst
gesendet: Erinnerung 7 Tage vor dem Ende der kostenlosen Testphase (bei Testphasen, die vor der
Version 1.3 der Nutzungsbedingungen begonnen haben), Quittungen über Zahlungen und
Erstattungen, Hinweis auf abgelehnte Zahlung, Aufforderung zur Bestätigung der Zahlung (3D Secure) und
Hinweis auf eine bald ablaufende Karte. **Unsere E-Mails enthalten keine Öffnungs- oder
Klickverfolgung.** Wir senden keine Werbung.

### 2.7. Verhinderung wiederholter kostenloser Testphasen

**Seit der Version 1.3 der Nutzungsbedingungen gibt es keine kostenlose Testphase**
(Nutzungsbedingungen, Klausel 8.3), und wir erfassen keine neuen Kartenfingerabdrücke. Dieser Punkt
betrifft die Einträge der zuvor begonnenen Testphasen, die der Frist aus der Tabelle unten folgen und
spätestens 12 Monate nach dem Beginn der letzten dieser Testphasen verschwinden.

Die kostenlose Testphase galt einmal pro Kunde (Nutzungsbedingungen, Klausel 8.3). Um zu erkennen,
wenn dieselbe Karte eine zweite Testphase in einem anderen Konto beginnt, lesen wir, wenn wir ein
Abonnement mit kostenloser Testphase erfassen (in der Praxis, wenn die Testphase beginnt), bei Stripe
den **Kartenfingerabdruck** (*Fingerprint*) des Abonnements: einen Code, den Stripe aus der
Kartennummer berechnet und der sich jedes Mal wiederholt, wenn dieselbe Kartennummer in unserem
Stripe-Konto verwendet wird. **Der Fingerabdruck ist nicht die Kartennummer und kann nicht zum
Bezahlen verwendet werden. Wir empfangen und speichern die Kartennummer nicht.**

| Datenfeld | Wofür | Rechtsgrundlage (LGPD) | Wie lange |
|---|---|---|---|
| Kartenfingerabdruck, interne Kennung des Kontos und Datum, an dem wir die Karte in der Testphase erfasst haben (in der Praxis der Beginn der Testphase) | Erkennen, wenn dieselbe Karte eine zweite kostenlose Testphase in einem anderen Konto beginnt | Berechtigtes Interesse an der Verhinderung des Missbrauchs der kostenlosen Testphase (Art. 7 IX und Art. 10) | **12 Monate ab diesem Datum, auch nach der Löschung des Kontos**; nach Ablauf der Frist löscht der tägliche Vorgang den Eintrag |

1. **Was bei einer Übereinstimmung geschieht.** Hat derselbe Fingerabdruck in den vorangegangenen
   12 Monaten bereits eine Testphase in einem anderen Konto begonnen, erfasst der Dienst dies in den
   technischen Protokollen, nur mit den internen Kennungen der Konten und nie mit dem Fingerabdruck
   (sie verschwinden nach 14 Tagen), und ein Alarm benachrichtigt uns per E-Mail.
   **Nichts geschieht automatisch**: keine Belastung und keine Kündigung. Der Verantwortliche prüft
   den Fall, kann den Kontoinhaber um eine Erklärung bitten und entscheidet nach den Regeln von
   Klausel 18.11 der Nutzungsbedingungen, die Hinweis, Begründung und Widerspruchsrecht garantieren.
   Es handelt sich daher nicht um eine ausschließlich automatisierte Entscheidung (Art. 20).
2. **Warum wir nach der Löschung des Kontos aufbewahren.** Ziel ist gerade, ein neues Konto zu
   erkennen, das eröffnet wurde, nachdem das alte geschlossen wurde. Wir bewahren nur das dafür
   Notwendige auf (ohne Name, E-Mail-Adresse oder Kartennummer) und für die Frist, die diese Nutzung
   abdeckt (Art. 10 § 1).
3. **Grenzen.** Eine über eine digitale Wallet (wie Apple Pay oder Google Pay) genutzte Karte kann
   einen anderen Fingerabdruck haben als die physische Karte, und dieselbe Karte kann rechtmäßig von
   verschiedenen Personen eines Unternehmens genutzt werden. Testphasen, die älter als 12 Monate
   sind, wurden bereits gelöscht und fließen nicht in den Vergleich ein. Eine Übereinstimmung ist ein
   Indiz, für sich allein nie ein Beweis.
4. **Deine Rechte.** Du kannst die Bestätigung und den Zugang zu diesem Eintrag verlangen und ihm
   widersprechen (Punkt 6), und wir prüfen den Widerspruch unter Berücksichtigung des von dir
   angegebenen Grundes.

### 2.8. Überprüfung von Missbrauch

Wenn wir einen Missbrauchsverdacht überprüfen (Nutzungsbedingungen, Klauseln 12 und 18), verwenden
wir nur das, was der Dienst ohnehin speichert: die Sicherheitsalarme, die technischen Protokolle der
API (die angeben, wann ein Ereignis oder eine Eigenschaft abgelehnt wurde und nach welcher Regel, ohne
den abgelehnten Wert, und nach 14 Tagen verschwinden), die Konto- und Abrechnungsdaten, den Eintrag
aus Punkt 2.7, die Ereignisse des Projekts (nur soweit nötig eingesehen, wie es der
Auftragsverarbeitungsvertrag vorsieht) und das, was uns gemeldet wird. **Wir speichern dafür weder IP
noch vollständigen Browser, weil der Dienst sie nicht speichert.**

| Datenfeld | Wofür | Rechtsgrundlage (LGPD) | Wie lange |
|---|---|---|---|
| Eintrag der Überprüfung: was gesehen wurde, die versandten Hinweise, deine Antwort, die ergriffene Maßnahme und der Grund | Die Maßnahmen von Klausel 18 der Bedingungen gerecht anwenden und sie nachweisen können | Berechtigtes Interesse (Art. 7 IX) und regelmäßige Ausübung von Rechten (Art. 7 VI) | Im E-Mail-Postfach, für die Fristen aus Punkt 2.3 (bis 5 Jahre nach dem Ende des Vertrags) |

Andere Daten bewahren wir über die Fristen dieser Erklärung hinaus nur auf, wenn ein Gesetz, eine
gerichtliche Anordnung oder ein Ersuchen einer zuständigen Behörde dies vorschreibt oder wenn sie für
ein gerichtliches, behördliches oder schiedsgerichtliches Verfahren erforderlich sind, und nur die
betroffenen Daten, für die verlangte Dauer (Art. 7 VI und Art. 16 I).

## 3. An wen wir Daten weitergeben

3.1. **Wir verkaufen keine personenbezogenen Daten** und geben sie nicht für Werbung weiter.

3.2. Wir nutzen die unten genannten Anbieter, die Daten in unserem Auftrag (Auftragsverarbeiter) oder,
wenn angegeben, in eigener Verantwortung verarbeiten:

| Anbieter | Was er tut | Welche Daten er erhält | Wo |
|---|---|---|---|
| **Vercel Inc.** (USA) | Hostet das Dashboard und die Startseite | Alles, was du im Dashboard siehst und sendest; IP und Browser der Zugreifenden (Protokolle 1 Tag) | Funktionen in São Paulo; Hauptverarbeitung in den USA |
| **Amazon Web Services (AWS)** | API, automatische Vorgänge, technische Protokolle (14 Tage), Aufbewahrung von Geheimnissen, Exportdateien (7 Tage) | Daten aus den Punkten 2.1, 2.2 und 2.7, im Durchlauf; technische Protokolle ohne E-Mail-Adresse und ohne IP | São Paulo (sa-east-1); weltweites Verteilnetz vor der API, ohne Speicherung von Anfragen |
| **Neon** (Databricks, Inc., USA) | Datenbank | Die Daten aus den Punkten 2.1, 2.2 (Konto, Annahme, Konfiguration, Nutzung und Exporte), 2.4 und 2.7 | Server in São Paulo; Unternehmen in den USA; Sicherungskopien bis zu 30 Tage |
| **Amazon SES** (AWS) | Versendet die E-Mails des Dienstes (Punkt 2.6), ohne Öffnungs- oder Klickverfolgung | E-Mail-Adresse des Empfängers und Inhalt der E-Mail. Adressen, die die E-Mail zurückweisen oder als Spam markieren, kommen auf die Unterdrückungsliste unseres AWS-Kontos, damit sie keine E-Mails mehr erhalten, bis sie entfernt werden | São Paulo (sa-east-1) |
| **Stripe** (Stripe Brasil Soluções de Pagamento – Instituição de Pagamento Ltda. und Stripe, LLC, USA) | Abrechnung, Zahlungsseite, Abonnementportal und Abrechnungs-E-Mails | Abrechnungs- und Kartendaten (Punkt 2.2); Stripe berechnet den Kartenfingerabdruck (Punkt 2.7) | Brasilien und USA. Stripe verarbeitet Daten auch **als Verantwortlicher**, zur Betrugsprävention und zur Erfüllung seiner rechtlichen Pflichten, gemäß der Datenschutzerklärung von Stripe |
| **ImprovMX** (ImprovMX Incorporated, USA) | Leitet die an hello@pyxis-analytics.dev gesendeten E-Mails weiter | Nachricht im Transit; Eintrag von Absender und Betreff für 7 Tage | Vorübergehender Empfang in Frankreich; Unternehmen in den USA |
| **Google** (Google LLC, USA) | E-Mail-Postfach, in dem die an hello@pyxis-analytics.dev gesendeten Nachrichten liegen | Empfangene und gesendete Nachrichten | USA und andere Länder. Es ist ein persönliches Konto, ohne Auftragsverarbeitungsvertrag: Google verarbeitet die Nachrichten **als Verantwortlicher**, gemäß der Datenschutzerklärung von Google |

3.3. **Behörden.** Wir geben Daten an Behörden nur heraus, wenn eine gerichtliche Anordnung oder ein
Ersuchen von jemandem vorliegt, der gesetzlich dafür zuständig ist, und nur das Verlangte.

3.4. **Kunden und Personen mit Zugriff.** Die Personen mit Zugriff auf ein Projekt, einschließlich des
Kontoinhabers, sehen in den Einstellungen die Liste der E-Mail-Adressen derjenigen, die Zugriff darauf
haben. Sitzungen, Tokens, verbundene Apps und die Entscheidung über die wöchentliche Zusammenfassung
sind individuell: niemand sieht die einer anderen Person. Die Personen mit Zugriff
können den Status des Kontos und die Nutzung des Monats sehen (zum Beispiel, um eine Pause wegen des
Kontingents zu verstehen); nur der Kontoinhaber öffnet das Abrechnungsportal von Stripe.

3.5. **Nachfolge.** Wird der Dienst künftig von einem vom Verantwortlichen gegründeten Unternehmen
oder von demjenigen erbracht, der den Dienst übernimmt, gehen die Daten auf dieses über, mit denselben
Regeln dieser Erklärung, und wir informieren vorher.

3.6. **Apps, die du verbindest.** Wenn du Claude oder Claude Code mit Pyxis verbindest
(Nutzungsbedingungen, Klausel 13.10) oder ein Zugriffstoken in einem Programm verwendest, verlassen
die Daten, die die App anfragt, Pyxis und gehen auf deine Veranlassung an sie. Über den
Claude-Connector gehen sie an **Anthropic** (Anthropic, PBC, USA): die Zahlen der Projekte, die du
öffnen kannst, und, weil die App liest, wer verbunden ist, **deine Zugangs-E-Mail-Adresse**. Anthropic
**ist nicht unser Auftragsverarbeiter**: Anthropic verarbeitet diese Daten nach den Bedingungen und
der Datenschutzerklärung, die zwischen Anthropic und dir gelten. Die Einwilligungsseite sagt vor dem
**Zulassen**, dass diese Daten an Anthropic in den Vereinigten Staaten gehen (Punkt 4.4). Um
Claude und Claude Code zu erkennen, liest Pyxis das öffentliche Dokument, das Anthropic über jede der
beiden veröffentlicht; dieses Lesen überträgt keine Daten von dir. Du siehst und widerrufst deine
Verbindungen unter Einstellungen → Verbundene Apps.

## 4. Internationale Übermittlung

4.1. Unsere Datenbanken befinden sich in São Paulo, aber mehrere Anbieter aus Punkt 3 sind
Unternehmen aus den Vereinigten Staaten und verarbeiten oder speichern einen Teil der Daten dort:
Vercel (Dashboard und Startseite), Stripe (Abrechnung), ImprovMX (E-Mail-Weiterleitung, mit
vorübergehendem Empfang in Frankreich) und Google (E-Mail-Postfach). Die E-Mails, die der Dienst
versendet, werden über AWS in São Paulo verschickt. Neon (Databricks) speichert die Daten in São Paulo, ist
aber ein US-Unternehmen, dessen Teams von dort darauf zugreifen können. Wenn du Claude oder Claude
Code verbindest (Punkt 3.6), gehen die Daten, die die App anfragt, ebenfalls in die Vereinigten
Staaten, an Anthropic, nach deiner Wahl.

4.2. **Form, Zweck und Dauer:** die Daten gehen an diese Anbieter, damit sie den in Punkt 3
beschriebenen Dienst erbringen, für die Fristen aus Punkt 2 oder für die in Punkt 3 angegebenen
Fristen der Protokolle jedes Anbieters.

4.3. **Zielländer:** Vereinigte Staaten; Frankreich (nur der vorübergehende Empfang durch ImprovMX);
und andere Länder, in denen Google Betriebsstätten unterhält.

4.4. **Grundlage:** die Übermittlung an Anthropic, wenn du Claude oder Claude Code verbindest
(Punkt 3.6), stützt sich auf deine **spezifische und hervorgehobene Einwilligung** (Art. 33 VIII):
die Einwilligungsseite informiert vor dem **Zulassen** darüber, dass die Daten, die die App anfragt,
einschließlich deiner E-Mail-Adresse, an Anthropic in den Vereinigten Staaten gehen, und die
Verbindung besteht nur, wenn du sie zulässt; du widerrufst die Einwilligung jederzeit, indem du die
Verbindung unter Einstellungen → Verbundene Apps widerrufst. Ist die Übermittlung zur Erfüllung des
Vertrags mit dir erforderlich (Abrechnung, Anmeldung im Dashboard und Antworten auf deine Nachrichten),
stützt sie sich auf Art. 33 IX in Verbindung mit Art. 7 V der LGPD. Frankreich ist Teil der
Europäischen Union, der die ANPD ein angemessenes Schutzniveau zuerkannt hat (Resolução CD/ANPD
nº 32/2026). In den übrigen Fällen verpflichten sich die Anbieter in ihren
Datenverarbeitungsverträgen, die Daten zu schützen und nur zur Erbringung des Dienstes zu
verarbeiten; diese Verträge **enthalten noch nicht die von der ANPD genehmigten
Standardvertragsklauseln** (Resolução CD/ANPD nº 19/2024). Wir verfolgen deren Einführung durch die
Anbieter und wechseln den Anbieter oder den Mechanismus, wenn es nötig ist.

4.5. **Verantwortlichkeiten und Sicherheit:** jeder Anbieter haftet für die Sicherheit in seiner
Umgebung; wir haften dir gegenüber für die Verarbeitung als Ganzes. Die von uns ergriffenen Maßnahmen
stehen in Punkt 5.

4.6. Du kannst den vollständigen Wortlaut der Vertragsklauseln jedes Anbieters verlangen, worauf wir
innerhalb von 15 Tagen antworten, und deine Rechte über den Kanal aus Punkt 1 ausüben, einschließlich
des Rechts, bei der ANPD gegen uns Beschwerde einzulegen.

## 5. Sicherheit

5.1. Zu den Maßnahmen, die wir ergreifen, gehören:

1. verschlüsselte Verbindungen (HTTPS mit TLS 1.2 oder höher) auf dem gesamten Weg, auch bis zur
   Datenbank, mit Zertifikatsprüfung;
2. Daten der Datenbank im Ruhezustand vom Anbieter verschlüsselt;
3. Anmeldung ohne Passwort, mit einem 10 Minuten gültigen Einmalcode und begrenzter Anzahl von
   Versuchen;
4. Codes, Sitzungen, geheime Schlüssel, Tokens und Zugangsdaten der verbundenen Apps nur als Hash
   gespeichert;
5. Sitzungen mit Höchstdauer und Beendigung nach 24 Stunden ohne Nutzung; du siehst und beendest
   deine Sitzungen in den Einstellungen;
6. technische Protokolle ohne E-Mail-Adresse, IP, Token oder Schlüssel, 14 Tage aufbewahrt;
7. Alarme für verdächtige Anmeldeversuche und Fehler des Dienstes;
8. offener Code, mit automatischer Prüfung der Sicherheit und der Abhängigkeiten.

5.2. Kein System ist vollkommen sicher. Tritt ein Sicherheitsvorfall ein, der für dich ein erhebliches Risiko
oder einen erheblichen Schaden mit sich bringen kann, benachrichtigen wir dich und die ANPD innerhalb
der Fristen der Regelung (Resolução CD/ANPD nº 15/2024).

## 6. Deine Rechte

6.1. Du kannst jederzeit verlangen (LGPD, Art. 18):

1. die Bestätigung, dass wir Daten von dir verarbeiten;
2. den Zugang zu ihnen;
3. die Berichtigung unvollständiger, unrichtiger oder veralteter Daten (zum Beispiel die Änderung der
   Zugangs-E-Mail-Adresse);
4. die Anonymisierung, Sperrung oder Löschung unnötiger, übermäßiger oder nicht im Einklang mit der
   LGPD verarbeiteter Daten;
5. die Übertragbarkeit, nach Maßgabe der Regelung der ANPD; solange es sie nicht gibt, liefern wir
   deine Daten in einer Datei in einem offenen Format (JSON);
6. die Auskunft darüber, an wen wir deine Daten weitergeben (Punkt 3);
7. die Überprüfung von ausschließlich automatisiert getroffenen Entscheidungen (Punkt 7);
8. den Widerspruch gegen eine auf berechtigtem Interesse beruhende Verarbeitung, wenn du der Ansicht
   bist, dass sie gegen die LGPD verstößt;
9. die Löschung der Daten, in den gesetzlich vorgesehenen Fällen. Manche Daten müssen trotzdem
   aufbewahrt werden, aufgrund einer rechtlichen Verpflichtung (zum Beispiel die Abrechnungsdaten)
   oder zur Verteidigung in einem Verfahren (LGPD, Art. 16).

6.2. **Wie du sie verlangst:** schreibe an hello@pyxis-analytics.dev, vorzugsweise von der
registrierten E-Mail-Adresse. Wenn sich nicht bestätigen lässt, dass die Anfrage von dir stammt,
bitten wir vor der Bearbeitung um eine einfache Bestätigung.

6.3. **Frist:** wir bestätigen den Eingang und antworten **innerhalb von 15 Tagen**.

6.4. **Personen mit Zugriff auf ein Projekt:** der Zugriff auf das Dashboard besteht, weil der Inhaber
eines Kontos dich eingeladen hat. Wenn du die Löschung deiner E-Mail-Adresse verlangst, endet dein
Zugriff; wir informieren den Kontoinhaber. Bist du der Kontoinhaber, erfordert die Löschung deiner
Registrierung die Schließung des Kontos (Nutzungsbedingungen, Klausel 11.6), und die Abrechnungsdaten
bleiben für die gesetzliche Frist gespeichert (Punkt 2.2).

6.5. **Besucher der Startseite:** da wir weder IP noch Cookie noch dauerhafte Kennung speichern,
können wir deine anonymen Besuche nicht auffinden. Du kannst die Messung auf der Seite selbst
abschalten oder das Signal Global Privacy Control in deinem Browser einschalten.

6.6. Du kannst dich auch an die **Agência Nacional de Proteção de Dados (ANPD)** unter `gov.br/anpd`
und an die Verbraucherschutzstellen wenden.

## 7. Automatisierte Entscheidungen

Wir treffen keine Entscheidungen über dich, die ausschließlich auf automatisierter Verarbeitung
beruhen und deine Interessen beeinträchtigen, und erstellen keine Profile über dich. Die automatischen
Wirkungen des Dienstes sind Regeln, die für alle gleich sind und deine Person nicht bewerten:

1. zur Sicherheit: nach zu vielen Versuchen wird eine Code- oder Anmeldeanfrage für einige Minuten
   abgelehnt;
2. aus dem Vertrag: der Ereignisempfang wird pausiert, wenn das Konto 150 % der Monatsgrenze im
   kostenpflichtigen Tarif oder 100 % im kostenlosen Tarif erreicht; der Zugriff folgt dem Tarif und
   dem Status des Abonnements bei Stripe; und das Konto des kostenlosen Tarifs ohne Ereignisse wird
   nach der Benachrichtigung gelöscht (Nutzungsbedingungen, Klauseln 7.2, 7.6 und 9).

Die Übereinstimmung eines Kartenfingerabdrucks (Punkt 2.7) und die Maßnahmen wegen Missbrauchs
(Nutzungsbedingungen, Klausel 18) werden immer von einem Menschen entschieden. Wenn dich etwas davon
beeinträchtigt, sprich mit uns.

## 8. Kinder und Jugendliche

Der Dienst wird von Personen ab 18 Jahren beauftragt, und die Startseite richtet sich weder an
Kinder noch an Jugendliche. Erfahren wir, dass wir Daten eines Kindes ohne Rechtsgrundlage
verarbeiten, löschen wir sie.

## 9. Änderungen dieser Erklärung

9.1. Wir veröffentlichen jede neue Version mit dem Datum des Inkrafttretens. Betrifft eine Änderung
die Art, wie wir deine Daten verarbeiten, benachrichtigen wir die Kunden und die Personen mit Zugriff
per E-Mail mindestens 30 Tage im Voraus, außer bei einer gesetzlich vorgeschriebenen Änderung, die
früher gelten kann.

9.2. Frühere Versionen sind auf Anfrage erhältlich.

## 10. Kontakt

**{{seller.name}}**, Verantwortlicher. **hello@pyxis-analytics.dev**. **{{seller.address}}**.
