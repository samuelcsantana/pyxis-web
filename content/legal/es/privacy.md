# Política de Privacidad de Pyxis

**Versión {{terms.version}}, vigente desde {{terms.effectiveFrom}}.**

> Esta es una traducción de cortesía. El texto vinculante es la versión en portugués
> ([Português](/privacidade)); si las dos difieren, prevalece el portugués.

Esta política explica qué datos personales trata Pyxis **como controlador (responsable del
tratamiento)**, para qué, con qué base legal, con quién los comparte, durante cuánto tiempo los guarda
y cómo ejerces tus derechos, conforme a la Lei Geral de Proteção de Dados Pessoais (Ley General de
Protección de Datos Personales de Brasil; Lei n.º 13.709/2018, la "LGPD").

Se aplica a:

1. **clientes** que contratan Pyxis alojado, representados por el **dueño de la cuenta**, que
   hace el registro y administra la cuenta;
2. **personas con acceso al panel** (`app.pyxis-analytics.dev`): el dueño de la cuenta y las
   personas a las que invita;
3. **quien nos escribe** a hello@pyxis-analytics.dev;
4. **visitantes de la página de inicio** `pyxis-analytics.dev`.

**No** trata de los visitantes de los sitios de nuestros clientes. En esos sitios, quien decide sobre
la medición es el dueño del sitio (el controlador); nosotros actuamos como operador (encargado
del tratamiento), según las reglas del Acuerdo de Tratamiento de Datos Personales. Si visitaste un
sitio que usa Pyxis, consulta la política de privacidad de ese sitio.

---

## 1. Quién es el controlador y cómo contactarnos

1.1. El controlador es **{{seller.name}}**, persona física, inscrita en el CPF (registro fiscal
brasileño de personas físicas) con el n.º **{{seller.taxId}}**, con domicilio en
**{{seller.address}}**, que ofrece el servicio con el nombre **Pyxis**.

1.2. Canal para cualquier asunto de privacidad, incluido el ejercicio de tus derechos:
**hello@pyxis-analytics.dev**. Los mensajes los lee y responde el propio controlador.

1.3. Como agente de tratamiento de pequeño porte, no designamos un encargado de datos (encarregado;
delegado de protección de datos); este canal cumple la función
prevista en el art. 41, § 2.º, I, de la LGPD (Resolução CD/ANPD n.º 2/2022, art. 11, y Resolução
CD/ANPD n.º 18/2024, art. 3.º, § 3.º; resoluciones del Consejo Director de la Agencia Nacional de
Protección de Datos de Brasil).

## 2. Qué datos tratamos, para qué, con qué base legal y durante cuánto tiempo

### 2.1. Personas con acceso al panel

| Dato | Para qué | Base legal (LGPD) | Durante cuánto tiempo |
|---|---|---|---|
| Correo electrónico, idioma de los correos (el de la pantalla en la que entraste o te registraste), proyectos a los que tienes acceso, si eres el dueño de la cuenta o invitado, elección sobre el resumen semanal, fecha de registro | Enviar el código de inicio de sesión y los correos del servicio, mostrar tus proyectos y enviar el resumen semanal en tu idioma | Ejecución del contrato, para el dueño de la cuenta (art. 7.º, V); interés legítimo nuestro y del cliente en dar acceso a las personas que el dueño invitó (art. 7.º, IX) | Mientras tengas acceso a algún proyecto o seas dueño de una cuenta. Cuando el dueño te quita de un proyecto, el acceso a él termina en el acto; si te quedas sin acceso a ningún proyecto, borramos tu registro en un plazo de 30 días. En todo caso, el registro se borra junto con la cuenta (punto 2.2) |
| Invitación: tu correo electrónico, el nombre del proyecto y el correo de quien te invitó, en el correo de invitación | Avisarte del acceso y de quién te lo dio | Interés legítimo nuestro y del cliente (art. 7.º, IX) | La invitación en sí no queda en nuestra base de datos (solo el registro de la fila anterior); el registro del envío queda en manos del proveedor de correo durante su plazo (punto 3) |
| Códigos de inicio de sesión y de registro: correo electrónico, código guardado solo como hash, finalidad (inicio de sesión o registro), idioma, intentos, horarios | Permitir el inicio de sesión y el registro sin contraseña e impedir intentos repetidos | Ejecución del contrato, procedimientos preliminares a él e interés legítimo en la seguridad (art. 7.º, V y IX) | Válidos durante 10 minutos; borrados por la rutina diaria después de expirar |
| Sesiones: valor guardado solo como hash, fechas de inicio y de último uso, categoría del dispositivo y familia del navegador y del sistema (sin versión) | Mantenerte conectado y mostrarte tus sesiones para que las cierres | Ejecución del contrato e interés legítimo en la seguridad (art. 7.º, V y IX) | Como máximo 7 días, o 24 horas sin uso; borradas por la rutina diaria después de cerradas |
| Tokens de acceso: nombre que les diste, valor guardado solo como hash, fechas de creación, último uso, validez y revocación | Permitir que programas y agentes lean tus cifras | Ejecución del contrato (art. 7.º, V) | Hasta la eliminación de tu registro (un token expirado o revocado deja de funcionar en el acto, pero el registro permanece hasta entonces) |
| Aplicaciones conectadas (conector de Claude): la aplicación (Claude o Claude Code), las fechas en que conectaste, del último uso (grabada como máximo cada 5 minutos y en cada renovación) y de la revocación; credenciales de la conexión guardadas solo como hash | Permitir que la aplicación que conectaste lea tus cifras y mostrarte las conexiones para que las revoques | Ejecución del contrato, para el dueño de la cuenta (art. 7.º, V); interés legítimo nuestro y del cliente en ofrecer esta función a las personas que el dueño invitó (art. 7.º, IX) | Mientras la conexión esté activa. La rutina diaria borra la conexión revocada o inactiva desde hace 90 días, las credenciales expiradas y las de renovación ya sustituidas hace más de 30 días |
| Solicitudes de conexión: la aplicación, la dirección a la que vuelve la respuesta, los datos técnicos que la aplicación envía para proteger la solicitud, los horarios, tu decisión (permitir o cancelar), quién decidió y el código de un solo uso guardado solo como hash | Mostrar la solicitud en la página de consentimiento y entregar la respuesta solo a la aplicación que la pidió | Ejecución del contrato, para el dueño de la cuenta, e interés legítimo en la seguridad y en ofrecer la función a los invitados (art. 7.º, V y IX) | La solicitud es válida durante 10 minutos, y el código, durante 5. La rutina diaria borra la solicitud 1 día después de expirada; después de eso, solo queda la conexión de la fila anterior |
| Registro de envío del resumen semanal (proyecto, persona, semana, fecha de envío) | No enviar el mismo resumen dos veces | Ejecución del contrato (art. 7.º, V) | Hasta la eliminación del proyecto o de tu acceso |
| Registros técnicos de la API con tu identificador interno (por ejemplo, "inició sesión", "cerró la sesión", "creó un token", "conectó una aplicación") | Seguridad e investigación de fallos e incidentes | Interés legítimo en la seguridad (art. 7.º, IX) | 14 días |

**Dirección IP:** cuando pides un código o entras en el panel, la IP se usa solo en la memoria del
servidor para limitar intentos (hasta 5 cada 15 minutos) y desaparece en un máximo de 15 minutos.
**No se graba** en nuestra base de datos ni en nuestros registros. Vercel, que hospeda el panel,
recibe la IP y el navegador de quien accede y los guarda en sus registros técnicos durante 1 día
(punto 3).

### 2.2. Clientes (dueños de cuenta)

| Dato | Para qué | Base legal (LGPD) | Durante cuánto tiempo |
|---|---|---|---|
| Cuenta: dueño, plan (gratis o de pago), estado de la suscripción, periodicidad, identificadores del cliente y de la suscripción en Stripe (solo en el plan de pago), fechas (fin de la prueba, del periodo, del acceso, de los avisos enviados), uso mensual de eventos y avisos de cuota y de cuenta sin eventos enviados | Prestar el servicio, aplicar los límites del plan, activar y desactivar el acceso según el plan y la suscripción, avisar y borrar la cuenta del plan gratis sin eventos, avisar del fin de la cuenta | Ejecución del contrato (art. 7.º, V) | Hasta la eliminación de la cuenta: 30 días después del fin del acceso o, en una cuenta del plan gratis sin eventos, 7 días después del aviso (Términos de Uso, Cláusula 7.6) |
| Aceptación de los términos: versión aceptada, fecha y hora, cuenta y persona que aceptó (sin IP) | Saber qué versión se te aplica y probar la aceptación | Ejecución del contrato y ejercicio regular de derechos (art. 7.º, V y VI) | Hasta la eliminación de la cuenta. Cuando te suscribes al plan de pago, Stripe guarda, como controlador, el registro de la aceptación hecha en su página de pago |
| Datos de facturación, solo de quien se suscribe al plan de pago, recibidos a través de Stripe: nombre, correo electrónico, dirección de facturación, CPF o CNPJ (registro fiscal brasileño de personas jurídicas; si se indicó), marca, últimos dígitos y validez de la tarjeta, historial de pagos, reembolsos y disputas | Cobrar la suscripción, enviar recibos, tramitar desistimientos, reembolsos y disputas, cumplir obligaciones fiscales | Ejecución del contrato (art. 7.º, V) y cumplimiento de obligación legal (art. 7.º, II) | Durante el contrato y durante 5 años contados desde el año siguiente al de cada cobro (plazo de conservación fiscal) |
| Configuración de los proyectos: nombre, direcciones de los sitios, zona horaria, evento de conversión, clave pública, clave secreta guardada solo como hash, icono copiado del propio sitio | Prestar el servicio | Ejecución del contrato (art. 7.º, V) | Hasta la eliminación del proyecto por el dueño o de la cuenta (fila "Cuenta" anterior) |
| Solicitudes de exportación: quién la pidió, cuándo, estado y cantidad de eventos | Generar y entregar el archivo de exportación al dueño de la cuenta | Ejecución del contrato (art. 7.º, V) | Hasta la eliminación del proyecto. El archivo en sí se borra 7 días después de estar listo |

**En el plan gratis, no pedimos tarjeta ni datos de facturación.** En el plan de pago, **no recibimos
ni guardamos el número de la tarjeta**: lo conserva Stripe. Solo guardamos la huella de la tarjeta del
punto 2.7.

### 2.3. Quien nos escribe

| Dato | Para qué | Base legal (LGPD) | Durante cuánto tiempo |
|---|---|---|---|
| Correo electrónico, nombre, contenido del mensaje y adjuntos | Responder solicitudes de acceso, dudas, soporte, reclamaciones y solicitudes de titulares | Procedimientos preliminares y ejecución del contrato (art. 7.º, V); ejercicio regular de derechos (art. 7.º, VI); interés legítimo en responder a quien nos contacta (art. 7.º, IX) | Si hay contrato: hasta 5 años después de su fin (plazo para reclamar daños, Código de Defesa do Consumidor —Código de Defensa del Consumidor de Brasil—, art. 27). Si no lo hay: 1 año después del último mensaje |

### 2.4. Visitantes de la página de inicio (`pyxis-analytics.dev`)

La página de inicio de Pyxis se mide con Pyxis, con las mismas reglas que ofrecemos a los
clientes.

| Dato | Para qué | Base legal (LGPD) | Durante cuánto tiempo |
|---|---|---|---|
| Página vista (ruta, sin parámetros salvo los de campaña), acciones en la página (por ejemplo, abrir la demostración), sitio de origen (solo el dominio), parámetros de campaña, categoría del dispositivo, familia del navegador y del sistema, país y región (nunca la ciudad), número aleatorio de la visita | Entender cómo se usa la página y mejorar la presentación de Pyxis | Interés legítimo (art. 7.º, IX, y art. 10) | 13 meses |

La medición **no usa cookies**, **no guarda la IP** ni el navegador completo, y **no envía nada** si tu
navegador pide no ser rastreado (Global Privacy Control o Do Not Track). En la propia página, el panel
"Lo que registró esta página" muestra cada evento enviado y permite desactivar la medición en este
navegador. Vercel, que hospeda la página, guarda la IP y el navegador de quien accede en sus registros
técnicos durante 1 día.

### 2.5. Cookies y almacenamiento en el navegador

| Dónde | Nombre | Tipo | Para qué | Duración |
|---|---|---|---|---|
| Panel (`app.`) | `__Host-pyxis_session` | Cookie necesaria, `HttpOnly` y `Secure` | Mantenerte conectado | 7 días, o hasta que cierres la sesión |
| Panel y demostración (`app.` y `demo.`) | `pyxis_locale` | Cookie de preferencia | Recordar el idioma elegido | 1 año |
| Panel y demostración | `pyxis_theme` | Cookie de preferencia | Recordar el tema claro u oscuro, cuando se elige | 1 año |
| Panel | `pyxis:pending-sign-in` | `sessionStorage` (solo en la pestaña) | Recordar el correo electrónico escrito mientras esperas el código, aunque recargues la página | 10 minutos, o hasta cerrar la pestaña |
| Página de inicio | `pyxis:session` | `sessionStorage` (solo en la pestaña) | Número aleatorio de la visita | Hasta cerrar la pestaña o 30 minutos sin actividad |
| Página de inicio | `pyxis:opt-out` | `localStorage` | Recordar que desactivaste la medición | Hasta que la reactives o borres los datos del navegador |
| Página de inicio y pantalla de inicio de sesión del panel | `pyxis:theme` | `localStorage` | Recordar el tema elegido en este dispositivo | Hasta que lo cambies o borres los datos del navegador |

La página de inicio no crea cookies. No usamos cookies de terceros, de publicidad ni de redes sociales,
y el panel no mide el uso de las personas que entran en él.

### 2.6. Correos electrónicos que enviamos

Solo enviamos correos relacionados con el servicio: códigos de inicio de sesión y de registro;
invitación a un proyecto; bienvenida, con la versión de los términos aceptada; avisos de uso al 80 %,
al 100 % y de la pausa al 150 %, en el plan de pago, y al 80 % y de la pausa al 100 %, en el plan
gratis; aviso de cuenta del plan gratis sin eventos; aviso de fin del acceso, recordatorio 7 días antes
de la eliminación y aviso de eliminación realizada; aviso de exportación lista; el resumen semanal (que cada persona puede
desactivar en Configuración); y comunicaciones sobre el contrato, incluidos avisos de abuso y de
suspensión. Los correos de facturación los envía el propio Stripe: recordatorio 7 días antes del final
de la prueba gratuita (en las pruebas empezadas antes de la versión 1.3 de los Términos de Uso),
recibos de pagos y de reembolsos, aviso de pago rechazado, solicitud de
confirmación del pago (3D Secure) y aviso de tarjeta a punto de expirar. **Nuestros correos no tienen
seguimiento de apertura ni de clics.** No enviamos publicidad.

### 2.7. Prevención de prueba gratuita repetida

**Desde la versión 1.3 de los Términos de Uso no hay prueba gratuita** (Términos de Uso,
Cláusula 8.3), y no registramos huellas de tarjeta nuevas. Este punto trata de los registros de las
pruebas empezadas antes, que siguen el plazo de la tabla siguiente y desaparecen, como máximo,
12 meses después del inicio de la última de esas pruebas.

La prueba gratuita valía una vez por cliente (Términos de Uso, Cláusula 8.3). Para detectar cuándo la
misma tarjeta inicia una segunda prueba en otra cuenta, cuando registramos una suscripción con prueba
gratuita (en la práctica, cuando empieza la prueba) leemos en Stripe la **huella de la tarjeta**
(*fingerprint*) de la suscripción: un código que Stripe calcula a partir del número de la tarjeta y
que se repite siempre que el mismo número de tarjeta se usa en nuestra cuenta de Stripe. **La huella
no es el número de la tarjeta y no sirve para pagar. No recibimos ni guardamos el número de la
tarjeta.**

| Dato | Para qué | Base legal (LGPD) | Durante cuánto tiempo |
|---|---|---|---|
| Huella de la tarjeta, identificador interno de la cuenta y fecha en que registramos la tarjeta en la prueba (en la práctica, el inicio de la prueba) | Detectar la misma tarjeta iniciando una segunda prueba gratuita en otra cuenta | Interés legítimo en prevenir el abuso de la prueba gratuita (art. 7.º, IX, y art. 10) | **12 meses contados desde esa fecha, incluso después de la eliminación de la cuenta**; al final del plazo, la rutina diaria borra el registro |

1. **Qué ocurre ante una coincidencia.** Si la misma huella ya inició una prueba en otra cuenta en los
   12 meses anteriores, el servicio registra el hecho en los registros técnicos, solo con los
   identificadores internos de las cuentas y nunca con la huella (desaparecen en 14 días), y una alarma
   nos avisa por correo electrónico.
   **No ocurre nada automáticamente**: ningún cobro y ninguna cancelación. El controlador examina el
   caso, puede pedir explicaciones al dueño de la cuenta y decide según las reglas de la
   Cláusula 18.11 de los Términos de Uso, que garantizan aviso, motivo y derecho a impugnar. Por lo
   tanto, no es una decisión tomada únicamente por medios automatizados (art. 20).
2. **Por qué lo guardamos después de la eliminación de la cuenta.** El objetivo es precisamente
   reconocer una cuenta nueva abierta después de que la antigua se cerró. Guardamos solo lo mínimo para
   ello (sin nombre, correo electrónico ni número de tarjeta) y durante el plazo que cubre ese uso
   (art. 10, § 1.º).
3. **Límites.** Una tarjeta usada mediante una billetera digital (como Apple Pay o Google Pay) puede
   tener una huella distinta de la de la tarjeta física, y una misma tarjeta puede ser usada
   legítimamente por distintas personas de una empresa. Las pruebas con más de 12 meses ya se borraron
   y no entran en la comparación. Una coincidencia es un indicio, nunca una prueba por sí sola.
4. **Tus derechos.** Puedes pedir la confirmación y el acceso a ese registro y oponerte a él (punto 6),
   y examinamos la oposición teniendo en cuenta el motivo que des.

### 2.8. Verificación de abuso

Cuando verificamos una sospecha de abuso (Términos de Uso, Cláusulas 12 y 18), usamos solo lo que el
servicio ya guarda: las alertas de seguridad, los registros técnicos de la API (que indican cuándo se
rechazó un evento o una propiedad y por qué regla, sin el valor rechazado, y desaparecen en 14 días),
los datos de la cuenta y de la facturación, el registro del punto 2.7, los eventos del proyecto
(consultados solo en lo necesario, como indica el Acuerdo de Tratamiento de Datos) y lo que se nos
comunique. **No guardamos la IP ni el navegador completo para ello, porque el servicio no los
guarda.**

| Dato | Para qué | Base legal (LGPD) | Durante cuánto tiempo |
|---|---|---|---|
| Registro de la verificación: lo que se vio, los avisos enviados, tu respuesta, la medida tomada y el motivo | Aplicar las medidas de la Cláusula 18 de los Términos de forma justa y poder demostrarlas | Interés legítimo (art. 7.º, IX) y ejercicio regular de derechos (art. 7.º, VI) | En el buzón de correo, durante los plazos del punto 2.3 (hasta 5 años después del fin del contrato) |

Solo guardamos otros datos más allá de los plazos de esta política si una ley, una orden judicial o un
requerimiento de autoridad competente lo exige, o si son necesarios para un proceso judicial,
administrativo o arbitral, y solo los datos afectados, durante el tiempo exigido (art. 7.º, VI, y
art. 16, I).

## 3. Con quién compartimos

3.1. **No vendemos datos personales** y no los compartimos para publicidad.

3.2. Usamos los proveedores siguientes, que tratan datos por cuenta nuestra (operadores) o, cuando se
indica, por cuenta propia:

| Proveedor | Qué hace | Qué datos recibe | Dónde |
|---|---|---|---|
| **Vercel Inc.** (EE. UU.) | Hospeda el panel y la página de inicio | Todo lo que ves y envías en el panel; IP y navegador de quien accede (registros durante 1 día) | Funciones en São Paulo; procesamiento principal en EE. UU. |
| **Amazon Web Services (AWS)** | API, rutinas automáticas, registros técnicos (14 días), custodia de secretos, archivos de exportación (7 días) | Datos de los puntos 2.1, 2.2 y 2.7, de paso; registros técnicos sin correo electrónico ni IP | São Paulo (sa-east-1); red de distribución mundial delante de la API, sin guardar solicitudes |
| **Neon** (Databricks, Inc., EE. UU.) | Base de datos | Los datos de los puntos 2.1, 2.2 (cuenta, aceptación, configuración, uso y exportaciones), 2.4 y 2.7 | Servidores en São Paulo; empresa en EE. UU.; copias de seguridad durante hasta 30 días |
| **Amazon SES** (AWS) | Envía los correos del servicio (punto 2.6), sin seguimiento de apertura ni de clics | Correo electrónico del destinatario y contenido del correo. Las direcciones que devuelven el correo o lo marcan como spam entran en la lista de supresión de nuestra cuenta de AWS, para no recibir más correos, hasta que se retiren | São Paulo (sa-east-1) |
| **Stripe** (Stripe Brasil Soluções de Pagamento – Instituição de Pagamento Ltda. y Stripe, LLC, EE. UU.) | Cobro, página de pago, portal de suscripción y correos de facturación | Datos de facturación y de la tarjeta (punto 2.2); Stripe calcula la huella de la tarjeta (punto 2.7) | Brasil y EE. UU. Stripe también trata datos **como controlador**, para la prevención del fraude y el cumplimiento de sus obligaciones legales, conforme a la política de privacidad de Stripe |
| **ImprovMX** (ImprovMX Incorporated, EE. UU.) | Reenvía los correos enviados a hello@pyxis-analytics.dev | Mensaje en tránsito; registro de remitente y asunto durante 7 días | Recepción transitoria en Francia; empresa en EE. UU. |
| **Google** (Google LLC, EE. UU.) | Buzón de correo donde quedan los mensajes enviados a hello@pyxis-analytics.dev | Mensajes recibidos y enviados | EE. UU. y otros países. Es una cuenta personal, sin contrato de operador: Google trata los mensajes **como controlador**, conforme a la política de privacidad de Google |

3.3. **Autoridades.** Solo entregamos datos a autoridades cuando hay una orden judicial o un
requerimiento de quien tiene competencia legal para hacerlo, y solo lo que se exija.

3.4. **Clientes y personas con acceso.** Las personas con acceso a un proyecto, incluido el
dueño de la cuenta, ven en Configuración la lista de correos electrónicos de quienes tienen
acceso a él. Las sesiones, los tokens, las aplicaciones conectadas y la elección sobre el resumen
semanal son individuales: nadie ve los de otra persona. Las personas con acceso pueden ver el estado de
la cuenta y el uso del mes (por ejemplo, para entender una pausa por la cuota); solo el dueño de
la cuenta abre el portal de facturación de Stripe.

3.5. **Sucesión.** Si el servicio pasa a prestarlo una empresa constituida por el controlador o quien
asuma el servicio, los datos pasan a ella, con las mismas reglas de esta política, y avisamos antes.

3.6. **Aplicaciones que conectas.** Si conectas Claude o Claude Code a Pyxis (Términos de Uso,
Cláusula 13.10), o usas un token de acceso en un programa, los datos que pida la aplicación salen de
Pyxis hacia ella, a petición tuya. A través del conector de Claude, van a **Anthropic** (Anthropic,
PBC, EE. UU.): las cifras de los proyectos que puedes abrir y, porque la aplicación lee quién está
conectado, **tu correo electrónico de acceso**. Anthropic **no es operadora nuestra**: trata esos datos
según los términos y la política de privacidad vigentes entre ella y tú. La página de consentimiento
indica, antes de **Permitir**, que esos datos van a Anthropic, en los Estados Unidos (punto 4.4). Para
reconocer Claude y Claude Code, Pyxis lee el documento público que Anthropic publica sobre cada uno;
esa lectura no lleva datos tuyos. Ves y revocas tus conexiones en Configuración → Aplicaciones
conectadas.

## 4. Transferencia internacional

4.1. Nuestras bases de datos están en São Paulo, pero varios proveedores del punto 3 son empresas de
los Estados Unidos y tratan o guardan parte de los datos allí: Vercel (panel y página de inicio),
Stripe (cobro), ImprovMX (reenvío de correo, con recepción transitoria en Francia) y Google (buzón de
correo). Los correos que envía el servicio salen a través de AWS en São Paulo. Neon (Databricks) guarda
los datos en São Paulo, pero es una empresa de EE. UU. cuyos equipos pueden acceder a ellos desde allí.
Si conectas Claude o Claude Code (punto 3.6), los datos que pida la aplicación también van a los
Estados Unidos, a Anthropic, por elección tuya.

4.2. **Forma, finalidad y duración:** los datos van a esos proveedores para que presten el servicio
descrito en el punto 3, durante los plazos del punto 2, o durante los plazos de los registros de cada
proveedor indicados en el punto 3.

4.3. **Países de destino:** Estados Unidos; Francia (solo la recepción transitoria de ImprovMX); y otros
países donde Google mantiene operaciones.

4.4. **Base:** el envío a Anthropic cuando conectas Claude o Claude Code (punto 3.6) se apoya en tu
**consentimiento específico y destacado** (art. 33, VIII): la página de consentimiento informa, antes
de **Permitir**, que los datos que pida la aplicación, incluido tu correo electrónico, van a Anthropic,
en los Estados Unidos, y la conexión solo existe si la permites; retiras el consentimiento en cualquier
momento revocando la conexión en Configuración → Aplicaciones conectadas. Cuando la transferencia es
necesaria para ejecutar el contrato contigo (cobro, inicio de sesión en el panel y respuestas a tus
mensajes), se apoya en el art. 33, IX, en relación con el art. 7.º, V, de la LGPD. Francia forma parte
de la Unión Europea, reconocida por la ANPD como de nivel adecuado de protección (Resolução CD/ANPD
n.º 32/2026). En los demás casos, los proveedores se comprometen, en sus contratos de tratamiento de
datos, a proteger los datos y a tratarlos solo para prestar el servicio; esos contratos **todavía no
incluyen las cláusulas estándar aprobadas por la ANPD** (Resolução CD/ANPD n.º 19/2024). Seguimos su
adopción por parte de los proveedores y cambiaremos de proveedor o de mecanismo cuando sea necesario.

4.5. **Responsabilidades y seguridad:** cada proveedor responde de la seguridad en su entorno; nosotros
respondemos ante ti del tratamiento en su conjunto. Las medidas que adoptamos están en el punto 5.

4.6. Puedes pedir el texto íntegro de las cláusulas contractuales de cada proveedor, que respondemos en
un plazo de 15 días, y ejercer tus derechos por el canal del punto 1, incluido el de presentar una
petición contra nosotros ante la ANPD.

## 5. Seguridad

5.1. Entre las medidas que adoptamos:

1. conexiones cifradas (HTTPS con TLS 1.2 o superior) en todo el recorrido, incluso hasta la base de
   datos, con verificación de certificado;
2. datos de la base de datos cifrados en reposo por el proveedor;
3. inicio de sesión sin contraseña, mediante un código de un solo uso válido durante 10 minutos, con
   límite de intentos;
4. códigos, sesiones, claves secretas, tokens y credenciales de las aplicaciones conectadas guardados
   solo como hash;
5. sesiones con plazo máximo y cierre después de 24 horas sin uso; ves y cierras tus sesiones en
   Configuración;
6. registros técnicos sin correo electrónico, IP, token ni clave, guardados durante 14 días;
7. alarmas para intentos de inicio de sesión sospechosos y errores del servicio;
8. código abierto, con revisión automática de seguridad y de dependencias.

5.2. Ningún sistema es perfectamente seguro. Si ocurre un incidente de seguridad que pueda suponer un
riesgo o daño relevante para ti, te lo comunicamos a ti y a la ANPD en los plazos de la reglamentación
(Resolução CD/ANPD n.º 15/2024).

## 6. Tus derechos

6.1. Puedes pedir, en cualquier momento (LGPD, art. 18):

1. la confirmación de que tratamos datos tuyos;
2. el acceso a ellos;
3. la corrección de datos incompletos, inexactos o desactualizados (por ejemplo, cambiar el correo
   electrónico de acceso);
4. la anonimización, el bloqueo o la eliminación de datos innecesarios, excesivos o tratados en
   disconformidad con la LGPD;
5. la portabilidad, en los términos de la reglamentación de la ANPD; mientras no exista, entregamos tus
   datos en un archivo de formato abierto (JSON);
6. la información sobre con quién compartimos tus datos (punto 3);
7. la revisión de decisiones tomadas únicamente por medios automatizados (punto 7);
8. la oposición a un tratamiento basado en el interés legítimo, si consideras que incumple la LGPD;
9. la eliminación de los datos, en los casos previstos en la ley. Algunos datos deben guardarse aun
   así, por obligación legal (por ejemplo, los de facturación) o para la defensa en un proceso (LGPD,
   art. 16).

6.2. **Cómo pedirlo:** escribe a hello@pyxis-analytics.dev, preferentemente desde el correo electrónico
registrado. Si no es posible confirmar que la solicitud es tuya, te pediremos una confirmación sencilla
antes de atenderla.

6.3. **Plazo:** confirmamos la recepción y respondemos en un plazo de **15 días**.

6.4. **Personas con acceso a un proyecto:** el acceso al panel existe porque el dueño de una
cuenta te invitó. Si pides la eliminación de tu correo electrónico, tu acceso termina; avisamos al
dueño de la cuenta. Si eres el dueño de la cuenta, la eliminación de tu registro exige
cerrar la cuenta (Términos de Uso, Cláusula 11.6), y los datos de facturación siguen guardados durante
el plazo legal (punto 2.2).

6.5. **Visitantes de la página de inicio:** como no guardamos IP, cookie ni identificador persistente,
no tenemos forma de localizar tus visitas anónimas. Puedes desactivar la medición en la propia página
o activar la señal Global Privacy Control en tu navegador.

6.6. También puedes presentar una petición ante la **Agência Nacional de Proteção de Dados (ANPD;
Agencia Nacional de Protección de Datos de Brasil)**, en `gov.br/anpd`, y ante los órganos de defensa
del consumidor.

## 7. Decisiones automatizadas

No tomamos decisiones sobre ti basadas únicamente en un tratamiento automatizado que afecten a tus
intereses, ni creamos perfiles tuyos. Los efectos automáticos del servicio son reglas iguales para
todos, que no evalúan tu persona:

1. de seguridad: después de demasiados intentos, una solicitud de código o de inicio de sesión se
   rechaza durante unos minutos;
2. del contrato: la recepción de eventos se pausa cuando la cuenta llega al 150 % del límite mensual en
   el plan de pago, o al 100 % en el plan gratis; el acceso sigue el plan y el estado de la suscripción
   en Stripe; y la cuenta del plan gratis sin eventos se borra después del aviso (Términos de Uso,
   Cláusulas 7.2, 7.6 y 9).

La coincidencia de huella de tarjeta (punto 2.7) y las medidas por abuso (Términos de Uso,
Cláusula 18) siempre las decide una persona. Si algo de esto te causa algún problema, habla con nosotros.

## 8. Niños y adolescentes

El servicio lo contratan mayores de 18 años, y la página de inicio no está dirigida a niños ni a
adolescentes. Si sabemos que tratamos datos de un niño sin base legal, los borramos.

## 9. Cambios en esta política

9.1. Publicamos cada nueva versión con la fecha de entrada en vigor. Si un cambio afecta a la forma en
que tratamos tus datos, avisamos a los clientes y a las personas con acceso por correo electrónico con
al menos 30 días de antelación, salvo un cambio exigido por ley, que puede aplicarse antes.

9.2. Las versiones anteriores están disponibles a petición.

## 10. Contacto

**{{seller.name}}**, controlador. **hello@pyxis-analytics.dev**. **{{seller.address}}**.
