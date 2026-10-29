# Acuerdo de Tratamiento de Datos Personales de Pyxis

**Versión {{terms.version}}, vigente desde {{terms.effectiveFrom}}.**

> Esta es una traducción de cortesía. El texto vinculante es la versión en portugués
> ([Português](/acordo-de-tratamento)); si las dos difieren, prevalece el portugués.

Este acuerdo es el **Anexo 1 de los Términos de Uso de Pyxis** y forma parte del contrato entre tú y
nosotros. Explica cómo tratamos los datos personales que llegan a Pyxis desde tus sitios, conforme a
la Lei Geral de Proteção de Dados Pessoais (Ley General de Protección de Datos Personales de Brasil;
Lei n.º 13.709/2018, la "LGPD"). Si algo de lo aquí dispuesto contradice los Términos de Uso, prevalece
este acuerdo en lo que se refiere a datos personales.

---

## Cláusula 1 — Quiénes son las partes

1.1. **Nosotros:** {{seller.name}}, persona física, inscrita en el CPF (registro fiscal brasileño de
personas físicas) con el n.º {{seller.taxId}}, con domicilio en {{seller.address}}, que ofrece el
servicio con el nombre **Pyxis**. Contacto: **hello@pyxis-analytics.dev**.

1.2. **Tú:** la persona o la empresa que contrató Pyxis alojado, aceptando los Términos de Uso,
representada en el panel por el dueño de la cuenta (Términos de Uso, Cláusula 2.9). Este acuerdo se
aplica del mismo modo en el plan gratis y en el plan de pago (Términos de Uso, Cláusula 7.1).

## Cláusula 2 — Palabras usadas en este acuerdo

2.1. Las palabras **dato personal**, **tratamiento**, **titular**, **controlador** (responsable del
tratamiento), **operador** (encargado del tratamiento), **anonimización**, **eliminación**,
**transferencia internacional** e **incidente de seguridad** tienen el sentido de la LGPD (art. 5.º) y
de las resoluciones de la Agência Nacional de Proteção de Dados (ANPD; Agencia Nacional de Protección
de Datos de Brasil).

2.2. **Visitante** es la persona que accede a un sitio o aplicación tuyos en los que está instalado el
rastreador de Pyxis.

2.3. **Evento** es cada registro que el rastreador envía a Pyxis, como una página vista o una acción
que marcaste.

2.4. **Proyecto** es la configuración de un sitio tuyo en Pyxis: nombre, direcciones (orígenes)
autorizadas, zona horaria, evento de conversión, la opción de guardar la ciudad, claves y eventos.

2.5. **Suboperador** (subencargado del tratamiento) es el proveedor que contratamos y que trata, por
cuenta nuestra, datos personales de este acuerdo.

## Cláusula 3 — Funciones de cada parte

3.1. Con respecto a los datos de los visitantes de tus sitios, **tú eres el controlador** y
**nosotros somos el operador** (LGPD, art. 5.º, VI y VII). Tú decides si medir y cómo; nosotros
tratamos los datos para prestar el servicio que contrataste.

3.2. Si usas Pyxis para medir sitios de terceros (por ejemplo, como agencia), declaras que tienes
autorización del controlador de esos sitios para contratarnos y para dar las instrucciones de este
acuerdo. En ese caso, nosotros actuamos como suboperador, y tú trasladas al controlador la información
de este acuerdo que necesite.

3.3. Con respecto a los datos de tu cuenta (los correos electrónicos de quienes acceden al panel, la
cuenta y la suscripción, la aceptación de los términos, el historial de facturación, la prevención de
prueba gratuita repetida, los registros de las conexiones de aplicaciones y los mensajes de soporte),
**nosotros somos el controlador**. Ese tratamiento está en la **Política de Privacidad de Pyxis**
(Anexo 2 de los Términos de Uso), no en este acuerdo.

## Cláusula 4 — Qué tratamos, para qué y durante cuánto tiempo

4.1. El **Anexo I** de este acuerdo describe el tratamiento: finalidades, titulares, categorías de
datos, lo que **no** se guarda, dónde están los datos y durante cuánto tiempo.

4.2. Tratamos los datos de los visitantes **únicamente** para:

1. recibir los eventos enviados por el rastreador y guardarlos en tu proyecto;
2. mostrar el análisis a ti y a las personas que autorizaste, en el panel, en la API de consulta, en el
   servidor MCP (incluso a las aplicaciones que ellas conecten; Anexo I, punto 10) y en el resumen
   semanal por correo electrónico;
3. atender las solicitudes de eliminación y de copia de datos de titulares (Cláusula 10);
4. mantener el servicio seguro y en funcionamiento (límites contra el abuso, corrección de fallos,
   copias de seguridad de los proveedores);
5. cumplir una obligación legal o una orden de autoridad competente (Cláusula 15);
6. generar, a petición del dueño de la cuenta, el archivo de exportación de los eventos de un proyecto
   (Anexo I, punto 11);
7. verificar y contener una sospecha de abuso o de uso contrario a los Términos de Uso (Cláusulas 12 y
   18 de los Términos), solo con los datos que el servicio ya guarda y solo en la medida necesaria
   (Cláusula 7.2).

4.3. **No usamos los datos de tus proyectos para ninguna otra finalidad.** No los vendemos, no los
alquilamos, no los usamos para publicidad, no los usamos para entrenar modelos de inteligencia
artificial y no los combinamos con datos de otros clientes. Las únicas cifras que extraemos de tus
proyectos para uso propio son recuentos operativos, como la cantidad de eventos al mes de cada cuenta y
el tamaño de la base de datos, usados para aplicar el límite mensual del plan (Términos de Uso,
Cláusula 7.2), saber si una cuenta del plan gratis se quedó sin recibir eventos (Términos de Uso,
Cláusula 7.6) y comprobar la capacidad del servicio.

## Cláusula 5 — Tus instrucciones

5.1. Tus instrucciones para el tratamiento son, en conjunto:

1. los Términos de Uso y este acuerdo;
2. la configuración de tus proyectos (orígenes autorizados, zona horaria, evento de conversión, la
   opción de guardar la ciudad, claves y personas con acceso), hecha por el dueño de la cuenta en el
   panel o, a petición, por nosotros;
3. lo que envía el rastreador instalado en tu sitio (qué eventos, qué propiedades y si usas la función
   `identify`);
4. las acciones del dueño de la cuenta en el panel (por ejemplo, exportar los eventos, borrar un
   proyecto o cerrar la cuenta), las llamadas que haces a la API con tu clave secreta o con un token de
   acceso, y las conexiones de aplicaciones que las personas con acceso permiten en el panel (Anexo I,
   punto 10);
5. las solicitudes que nos envías por escrito, al correo electrónico hello@pyxis-analytics.dev.

5.2. Si una instrucción tuya nos parece contraria a la LGPD o a otra ley, te avisamos por escrito y no
la cumplimos hasta que la cuestión se resuelva: el operador que sigue una instrucción ilícita responde
junto con el controlador (LGPD, art. 42, § 1.º, I).

5.3. Una instrucción que exija cambiar el funcionamiento del servicio para todos los clientes (por
ejemplo, guardar un dato que Pyxis no guarda) no es obligatoria para nosotros; en ese caso, puedes
rescindir el contrato conforme a los Términos de Uso.

5.4. **Suspensión del tratamiento.** Podemos suspender, total o parcialmente, el tratamiento de un
proyecto (normalmente, la recepción de nuevos eventos), mediante el procedimiento de la Cláusula 18 de
los Términos de Uso, cuando:

1. el proyecto envíe datos personales directos o sensibles, en contra de la Cláusula 6.1, puntos 3
   y 4;
2. el proyecto envíe eventos de quien pidió no ser medido, en contra de la Cláusula 6.1, punto 5;
3. una instrucción tuya sea ilícita (Cláusula 5.2);
4. sea necesario para contener un incidente de seguridad (Cláusula 11.6); o
5. una ley o una autoridad competente lo ordene (Cláusula 15).

Durante la suspensión, los datos ya recibidos siguen guardados, con las mismas medidas de seguridad
(Anexo II); no se recibe ningún dato nuevo en la parte suspendida; los plazos de conservación y de
eliminación de la Cláusula 12 siguen vigentes; y los datos recibidos en contra de este acuerdo se
borran por instrucción tuya (Cláusula 10.6). La suspensión no cambia tus deberes de controlador frente
a los titulares.

## Cláusula 6 — Lo que garantizas como controlador

6.1. Garantizas que:

1. tienes una base legal válida (LGPD, art. 7.º) para medir el uso de tus sitios con Pyxis. Para la
   medición sin cookies y sin datos personales directos que hace Pyxis, la base más común es el interés
   legítimo (art. 7.º, IX, y art. 10), que exige transparencia y respeto a las expectativas del
   visitante; la evaluación es tuya;
2. informas a los visitantes sobre la medición, en el aviso de privacidad de tu sitio, de forma clara.
   El **Anexo IV** incluye un modelo;
3. **no envías a Pyxis datos personales directos ni datos personales sensibles**: nada de nombre,
   correo electrónico, teléfono, CPF, dirección, número de documento, texto escrito por el visitante,
   dato de salud, origen racial, religión, opinión política, vida sexual, dato genético o biométrico,
   ni ningún dato que identifique a una persona por sí solo;
4. si usas la función `identify`, envías solo un **identificador interno y opaco** de la cuenta en tu
   sistema (por ejemplo, un número de registro aleatorio), nunca el correo electrónico, el CPF, el
   teléfono u otro dato que identifique a la persona directamente;
5. no desactivas ni eludes el respeto a las señales de "no rastrear" del navegador (Global Privacy
   Control y Do Not Track) ni la opción de no ser medido (`optOut`) que ofrece el rastreador, ni envías
   por otro camino eventos de quien pidió no ser medido;
6. si tu sitio está dirigido a niños o adolescentes, evaluaste el tratamiento a la luz del art. 14 de
   la LGPD y de su interés superior antes de instalar el rastreador;
7. respondes a las solicitudes de los titulares de tus sitios, con nuestro apoyo (Cláusula 10);
8. publicas, cuando corresponda, la información sobre transferencia internacional exigida por el
   art. 17, § 2.º, del Reglamento aprobado por la Resolução CD/ANPD n.º 19/2024 (resolución del Consejo
   Director de la ANPD), usando la información de la Cláusula 9 y del Anexo III;
9. instalas el rastreador y registras como origen de un proyecto solo sitios tuyos o de quien te
   autorizó (Cláusula 3.2);
10. si activas la ciudad en un proyecto (Términos de Uso, Cláusula 4.5), evaluaste antes si es
    necesaria para la finalidad de la medición y si encaja en la base legal del punto 1; actualizaste
    antes el aviso del punto 2, destacando el cambio; y, si el proyecto usa la función `identify`,
    sabes que pasa a registrarse la ciudad aproximada de cada visita de las personas identificadas y
    lo informas en el aviso.

6.2. El servidor de Pyxis descarta automáticamente los valores que tengan forma de correo electrónico
o las secuencias de 10 o más dígitos (como CPF, CNPJ —registro fiscal brasileño de personas jurídicas— y teléfono) en las propiedades de los eventos, en
los parámetros de campaña y en el identificador de usuario. Esa barrera es una **segunda capa**: no
reconoce nombres, direcciones ni textos libres. **La responsabilidad por lo que envía tu sitio es
tuya.**

6.3. Si te das cuenta de que enviaste datos personales directos a Pyxis, avísanos. Te ayudamos a
borrarlos (Cláusula 10.6). Si nosotros nos damos cuenta, por los registros de rechazo de la barrera o
de otro modo, te avisamos.

## Cláusula 7 — Confidencialidad

7.1. Actualmente, Pyxis lo opera una sola persona: la persona física indicada en la Cláusula 1.1. Es la
única persona con acceso administrativo a los sistemas y a la base de datos.

7.2. Solo accedemos a los datos de un proyecto cuando es necesario para: (a) el soporte que pediste;
(b) investigar o corregir un fallo o un incidente de seguridad; (c) el mantenimiento del servicio;
(d) cumplir una obligación legal o una orden de autoridad; o (e) verificar una sospecha concreta de
abuso (Cláusula 18 de los Términos de Uso), mirando solo lo necesario para confirmarla o descartarla.

7.3. Si, en el futuro, otra persona pasa a operar el servicio con nosotros, solo tendrá acceso después
de asumir por escrito el mismo deber de confidencialidad de este acuerdo, y te avisaremos.

7.4. El deber de confidencialidad y de seguridad sigue vigente después del fin del contrato (LGPD,
art. 47).

## Cláusula 8 — Seguridad

8.1. Adoptamos medidas técnicas y administrativas para proteger los datos contra accesos no autorizados
y contra destrucción, pérdida, alteración, comunicación o cualquier tratamiento inadecuado o ilícito
(LGPD, art. 46). Las medidas vigentes están en el **Anexo II**.

8.2. Podemos sustituir una medida por otra equivalente o mejor. No reducimos el nivel general de
protección descrito en el Anexo II durante el contrato.

8.3. El código fuente de Pyxis es público (licencia MIT). Puedes comprobar cómo trata el servicio los
datos en los repositorios `pyxis-api`, `pyxis-sdk`, `pyxis-web` y `pyxis-mcp`, en GitHub.

## Cláusula 9 — Suboperadores y transferencia internacional

9.1. **Autorización.** Autorizas que usemos los suboperadores enumerados en el **Anexo III**. Cada uno
trata solo lo necesario para la parte del servicio que presta.

9.2. **Cambios.** Antes de agregar o sustituir un suboperador que trate datos de los visitantes, te
avisamos por correo electrónico con **al menos 30 días de antelación**, indicando quién es, qué hará y
dónde. Si no estás de acuerdo, puedes rescindir el contrato antes del cambio y recibes la devolución
del importe proporcional al periodo pagado y no usado. En una emergencia (por ejemplo, un proveedor que
dejó de funcionar o que se volvió inseguro), la sustitución puede ser inmediata; te avisamos en un
plazo de 5 días hábiles, y tienes el mismo derecho a rescindir con reembolso proporcional.

9.3. **Contratos con los suboperadores.** Los proveedores del Anexo III son grandes empresas que
contratan con términos estandarizados, que no negociamos. Elegimos proveedores cuyos términos incluyen
compromisos de seguridad, confidencialidad y tratamiento conforme a nuestras instrucciones. El
Anexo III indica el contrato de cada uno.

9.4. **Dónde están los datos.** Los eventos de tus proyectos se **guardan en Brasil**: en la base de
datos de Neon, que funciona en la región de São Paulo de AWS, y los procesa la API en la región de São
Paulo de AWS (sa-east-1).

9.5. **Dónde hay un elemento extranjero.** Aun con los datos guardados en Brasil, hay cuatro situaciones
que debes conocer:

1. **Red de distribución de AWS (CloudFront).** Las solicitudes del navegador del visitante llegan al
   punto de presencia de AWS más cercano a él, que puede estar fuera de Brasil cuando el visitante está
   fuera de Brasil. Ese punto solo reenvía la solicitud a São Paulo: la caché está desactivada y no
   guardamos registros de acceso de CloudFront.
2. **Empresas con sede en los Estados Unidos.** Neon forma parte de Databricks, Inc.; Vercel Inc. aloja
   el panel. Ambas son empresas de EE. UU., y sus equipos y sistemas pueden acceder a datos desde fuera
   de Brasil para operar, dar soporte y hacer copias de seguridad.
3. **Panel.** Las páginas del panel se generan en funciones de Vercel en la región de São Paulo
   (gru1), pero Vercel declara que su procesamiento principal está en EE. UU. Los registros técnicos de
   las solicitudes al panel los conserva Vercel durante 1 día.
4. **Aplicaciones conectadas.** Si una persona con acceso conecta Claude o Claude Code, los datos que
   pida a la aplicación van a Anthropic, en EE. UU., por instrucción tuya (Cláusula 5.1, punto 4, y
   Anexo I, punto 10). Anthropic no es suboperadora nuestra.

Los correos electrónicos del servicio, incluido el resumen semanal (que lleva solo cifras agregadas del
proyecto, sin datos de visitantes identificables; Anexo I, punto 6), salen a través de Amazon SES, en
la región de São Paulo de AWS (Anexo III).

9.6. **Mecanismo de transferencia.** En la fecha de esta versión, los contratos de tratamiento de datos
(DPA) de AWS, de Databricks (Neon) y de Vercel prevén cláusulas tipo de la Unión Europea y compromisos
de seguridad, pero **no incorporan las cláusulas contractuales estándar aprobadas por la ANPD**
(Resolução CD/ANPD n.º 19/2024). Para reducir al mínimo lo que sale de Brasil (art. 9.º, párrafo único,
del Reglamento), Pyxis no guarda la IP, no guarda el navegador completo, no usa cookies en tus sitios y
reduce las direcciones de las páginas a plantillas (Anexo II). Nos comprometemos a: (a) adoptar las
cláusulas estándar de la ANPD u otro mecanismo válido del art. 33 de la LGPD en cuanto alguno de esos
proveedores lo ofrezca, o cambiar de proveedor si es necesario; (b) avisarte de cualquier cambio en este
punto; y (c) darte, cuando lo pidas, la información que necesites para evaluar la transferencia
(art. 4.º, § 1.º, del Reglamento).

## Cláusula 10 — Solicitudes de los titulares

10.1. **Quién responde.** Como controlador, tú respondes a los visitantes y a los usuarios de tus
sitios que pidan confirmación, acceso, corrección, eliminación u otra medida del art. 18 de la LGPD.
Nosotros ayudamos como se describe a continuación.

10.2. **Solo es posible encontrar a quien fue identificado.** Pyxis no guarda cookies, IP ni
identificador persistente del visitante anónimo. El identificador de visita es aleatorio, queda solo en
la pestaña del navegador y se cambia al cerrar la pestaña o después de 30 minutos sin actividad. Por
eso, **no hay forma de encontrar las visitas anónimas de una persona**. Solo se pueden localizar los
eventos de alguien a quien tu sitio identificó con la función `identify`, mediante el identificador
interno que enviaste.

10.3. **Eliminar los datos de una persona (tú mismo, mediante la API).** Llama a
`DELETE https://api.pyxis-analytics.dev/v1/subjects/{userId}` con la clave secreta del proyecto
(cabecera `Authorization: Bearer`). Pyxis borra **todos los eventos con ese identificador y también las
visitas en las que la persona fue identificada**, incluidos los eventos anónimos de esa misma visita
anteriores a la identificación (por ejemplo, la página de entrada y el origen de la visita). La
respuesta indica cuántos eventos se borraron. Volver a llamar responde cero; es seguro repetirlo.

10.4. **Copiar los datos de una persona (tú mismo, mediante la API).** Llama a
`GET https://api.pyxis-analytics.dev/v1/subjects/{userId}/events` con la clave secreta. La respuesta
trae los mismos eventos que borraría la eliminación, en orden, hasta 1000 por página, en JSON. Si hay
más, la respuesta indica el siguiente cursor (`next_after`), que pasas como `?after=` para obtener la
página siguiente. Cada evento viene con nombre, fecha y hora, identificador de la visita, página,
origen, dispositivo, país, región, ciudad (vacía en los proyectos con la opción desactivada; Términos
de Uso, Cláusula 4.5) y propiedades.

10.5. **Límites de estas rutas.** Las dos rutas aceptan hasta 60 llamadas por minuto por clave y por
dirección de origen. La clave secreta solo debe usarse en tu servidor, nunca en el navegador.

10.6. **Pidiéndonoslo a nosotros.** Si lo prefieres, envía la solicitud a hello@pyxis-analytics.dev,
desde el correo electrónico de una persona con acceso al proyecto, con el identificador del usuario y lo
que deseas (eliminación o copia). Lo hacemos en un plazo de **5 días hábiles** y respondemos con el
resultado (la cantidad de eventos borrados o el archivo con la copia). Lo mismo vale si enviaste datos
personales por error y necesitas borrarlos.

10.7. **Solicitud que nos llega directamente.** Si un titular de tus sitios nos contacta, no
respondemos sobre el fondo en tu lugar: en un plazo de **2 días hábiles**, te reenviamos la solicitud e informamos
al titular de que el controlador eres tú y de cuál es tu canal, cuando lo conozcamos.

10.8. **Plazos de la ley.** Los plazos para responder al titular son tuyos, como controlador (por
ejemplo, hasta 15 días para la declaración completa del art. 19, II, de la LGPD, o el plazo diferenciado
de agente de pequeño porte, si te corresponde). Nuestros plazos anteriores se pensaron para caber dentro
de ellos.

## Cláusula 11 — Incidentes de seguridad

11.1. Si tenemos conocimiento de un incidente de seguridad que afectó o pudo afectar a datos personales
de un proyecto tuyo, te avisamos **sin demora injustificada y en un plazo de 48 horas** contadas desde
ese conocimiento, por el correo electrónico de las personas con acceso al proyecto.

11.2. El aviso indica lo que sepamos hasta ese momento, y lo completamos después, en cuanto tengamos más
información:

1. qué ocurrió, cuándo ocurrió (si es posible saberlo) y cuándo lo supimos;
2. la naturaleza y las categorías de los datos afectados y, cuando sea posible estimarlo, cuántos
   titulares;
3. las medidas de seguridad que protegían los datos antes del incidente;
4. los riesgos y los posibles impactos para los titulares;
5. lo que ya hicimos y lo que haremos para contener el incidente y reducir sus efectos;
6. un contacto para seguir el caso.

11.3. Este plazo se eligió para que puedas cumplir el tuyo: el controlador debe comunicar a la ANPD y a
los titulares el incidente que pueda causar un riesgo o daño relevante en un plazo de 3 días hábiles
desde el conocimiento (Resolução CD/ANPD n.º 15/2024, arts. 6.º y 9.º), plazo que se duplica
para los agentes de pequeño porte.

11.4. La comunicación a la ANPD y a los titulares de tus sitios te corresponde a ti, como controlador
(LGPD, art. 48). Nosotros colaboramos con la información que tengamos y no hacemos comunicaciones
públicas sobre los datos de tu proyecto sin hablar antes contigo, salvo obligación legal.

11.5. Mantenemos el registro de todo incidente de seguridad con datos personales, incluidos los que no
tuvieron que comunicarse, durante **al menos 5 años**.

11.6. Para contener un incidente o un ataque en curso, podemos suspender en el acto partes del servicio
(por ejemplo, revocar una clave o pausar la recepción de eventos de un proyecto), en la medida
necesaria. Avisamos como en la Cláusula 11.1, cuando haya datos personales involucrados, o como en la
Cláusula 18.4 de los Términos de Uso, y restablecemos en cuanto pase el riesgo.

## Cláusula 12 — Conservación y eliminación

12.1. **Durante el contrato.** Los eventos se guardan durante **13 meses**. Una rutina diaria borra los
eventos con más de 13 meses, de todos los proyectos.

12.2. **Fin del contrato.** **30 días después del fin del acceso** (el final del periodo pagado después
de una cancelación o el fin de la suscripción por falta de pago, cuando la cuenta no vuelve al plan
gratis; el cierre de la cuenta desde el panel; el fin del plan gratis; o la rescisión por nuestra parte;
Términos de Uso, Cláusulas 2.10 y 11.4), una rutina diaria borra definitivamente la cuenta, los proyectos y todo lo que les pertenece: eventos, claves,
configuraciones, icono del sitio, registros de envío del resumen semanal, solicitudes de exportación y
los accesos de las personas a los proyectos. También borramos el registro (correo electrónico,
sesiones, tokens y aplicaciones conectadas) del dueño de la cuenta y de las personas que solo tenían
acceso a proyectos de tu cuenta. Si borras un proyecto desde el panel antes de eso, los eventos y todo
lo que le pertenece se borran en el acto.

12.3. **Copia antes de la eliminación.** Hasta la fecha de la eliminación, el dueño de la cuenta
exporta los eventos de cada proyecto desde el panel, en un archivo CSV comprimido que está disponible
durante 7 días (Términos de Uso, Cláusula 11.5; Anexo I, punto 11). Si la exportación desde el panel no
funciona, enviamos el archivo en un plazo de **10 días hábiles** desde la solicitud hecha por correo
electrónico; si la solicitud llega cerca de la fecha de eliminación, aplazamos la eliminación hasta
entregar la copia.

12.4. **Copias de los proveedores.** Después de la eliminación, los datos todavía pueden existir durante
un tiempo limitado en las copias de seguridad automáticas del proveedor de la base de datos: el
historial de recuperación de Neon guarda los cambios durante hasta 7 días, y las copias de seguridad de
Neon se mantienen durante hasta 30 días. Esas copias no se usan para nada más que la recuperación ante
desastres y desaparecen solas en esos plazos. Un archivo de exportación todavía no expirado desaparece,
como máximo, 7 días después de estar listo. Los registros técnicos de la API (que no contienen datos de
los visitantes; Anexo II, punto 9) desaparecen en 14 días.

12.5. **Confirmación.** El dueño de la cuenta recibe un correo electrónico cuando se realiza la
eliminación. Si lo pides, también confirmamos la fecha y lo que se borró.

12.6. **Excepción: preservación por ley u orden.** Solo guardamos datos de tus proyectos después de esos
plazos cuando una ley, una orden judicial o un requerimiento de autoridad competente nos obligue, o
cuando sean necesarios para un proceso judicial, administrativo o arbitral (LGPD, arts. 7.º, VI, y 16,
I). En ese caso, preservamos solo los datos afectados, sin ningún otro uso, durante el tiempo exigido,
y los borramos después; te avisamos, salvo que la ley o la orden prohíba el aviso.

12.7. **Cuenta del plan gratis sin eventos.** Una cuenta del plan gratis que no reciba ningún evento en
los 30 días posteriores a su creación, o que pase 90 días seguidos sin recibir eventos, se borra como
indica la Cláusula 7.6 de los Términos de Uso: el dueño de la cuenta recibe un aviso por correo
electrónico y, si la cuenta sigue sin eventos 7 días después, una rutina diaria borra la cuenta, los
proyectos y todo lo que les pertenece, como en el punto 12.2, sin el plazo de 30 días de ese punto.
Hasta entonces, el dueño de la cuenta puede exportar los eventos (punto 12.3). También se aplican los
puntos 12.4 (copias de los proveedores), 12.5 (confirmación por correo electrónico) y 12.6
(preservación por ley u orden).

12.8. **Ciudad desactivada.** Cuando el dueño de la cuenta desactiva la ciudad en un proyecto
(Términos de Uso, Cláusula 4.5), la recepción deja de leer la ciudad en un plazo de hasta un minuto.
La siguiente rutina diaria borra la ciudad de todos los eventos ya guardados en el proyecto, y eso
termina en un plazo de hasta 48 horas después de la desactivación, siempre que la opción siga
desactivada hasta entonces. Se aplican los puntos 12.4 (las copias de seguridad del proveedor y los
archivos de exportación todavía no expirados desaparecen en los plazos de ese punto) y 12.6 (en un
proyecto con datos preservados por ley u orden, las ciudades se mantienen durante el tiempo de la
preservación). Los archivos que ya descargaste y lo que las personas con acceso ya llevaron a
aplicaciones conectadas (Anexo I, punto 10) quedan bajo tu responsabilidad.

## Cláusula 13 — Información y auditoría

13.1. Si lo pides por escrito, te damos la información necesaria para demostrar que cumplimos este
acuerdo, en un plazo de **15 días**. Esto incluye responder a un cuestionario razonable de seguridad y
de privacidad, sin coste, una vez al año y después de cualquier incidente.

13.2. Como el código de Pyxis es público, puedes comprobar el funcionamiento del servicio directamente.
Por el tamaño del servicio, no ofrecemos auditoría presencial ni acceso a los sistemas de producción;
los informes y certificaciones de los proveedores (AWS, Databricks/Neon, Vercel) están disponibles en
sus sitios.

13.3. Colaboramos con la ANPD y con otras autoridades competentes en las fiscalizaciones que involucren
los datos de tus proyectos.

## Cláusula 14 — Responsabilidad

14.1. Cada parte responde de los daños que cause por incumplir la LGPD o este acuerdo. Nosotros, como
operador, respondemos ante los titulares en los términos del art. 42 de la LGPD: cuando incumplamos la
legislación de protección de datos o no sigamos tus instrucciones lícitas.

14.2. Entre tú y nosotros, se aplica la Cláusula 19 (Responsabilidad) de los Términos de Uso. Nada en
ella reduce los derechos de los titulares ni el derecho de repetición del art. 42, § 4.º, de la LGPD.

## Cláusula 15 — Solicitudes de autoridades

15.1. Solo entregamos datos de tus proyectos a una autoridad cuando hay una orden judicial o un
requerimiento hecho por quien tiene competencia legal para hacerlo (Marco Civil da Internet —Marco
Civil de Internet de Brasil—, Lei n.º 12.965/2014, art. 10).

15.2. Antes de entregarlos, te avisamos, salvo que la ley o la orden prohíban el aviso. Entregamos solo
lo que se exija.

## Cláusula 16 — Vigencia y cambios

16.1. Este acuerdo está vigente mientras lo estén los Términos de Uso y, después de ellos, hasta que
los datos se eliminen conforme a la Cláusula 12.

16.2. Los cambios en este acuerdo siguen la regla de cambios de los Términos de Uso (aviso de 30 días y
derecho a rescindir). Los cambios exigidos por ley o por la ANPD pueden aplicarse antes; en ese caso,
puedes rescindir el contrato con reembolso proporcional del periodo pagado y no usado.

---

## Anexo I — Descripción del tratamiento

**1. Finalidad.** Medir el uso de los sitios y aplicaciones del cliente y mostrar el análisis al
cliente; atender solicitudes de titulares; mantener la seguridad y el funcionamiento del servicio.

**2. Titulares.** (a) Visitantes de los sitios y aplicaciones del cliente; (b) usuarios del sistema del
cliente a quienes este identifica con la función `identify`.

**3. Datos de cada evento guardado.**

| Dato | Cómo es |
|---|---|
| Identificador del evento | Número aleatorio generado en el navegador |
| Nombre del evento | `page_view` (página vista), `api_request` (llamada a la API del sitio), `identify` o un nombre que define el cliente |
| Fecha y hora | La del navegador, corregida por la diferencia de reloj, y la de recepción en el servidor |
| Identificador de la visita | Número aleatorio guardado en el `sessionStorage` de la pestaña; se cambia al cerrar la pestaña o después de 30 minutos sin actividad |
| Identificador de usuario | Solo si el cliente usa `identify`: el identificador interno de la cuenta en el sistema del cliente, con hasta 64 letras, números, `-` o `_` (no acepta `@`, por lo tanto no acepta un correo electrónico) |
| Página | Solo la ruta, en forma de plantilla: los fragmentos que parecen identificadores (números, códigos largos, correos electrónicos) pasan a ser `:id`; sin dominio y sin parámetros |
| Origen de la visita | Solo el dominio del que vino el visitante (por ejemplo, `google.com`), sin la dirección completa |
| Campaña | `utm_source`, `utm_medium` y `utm_campaign`, si están en la dirección; el canal (de pago, correo electrónico, redes sociales, campaña, búsqueda orgánica, otro sitio o directo) calculado a partir de ellos y del origen |
| Clic en anuncio | Solo verdadero o falso. El código del clic (como `gclid`) no se guarda |
| Dispositivo | Categoría: móvil, tableta, escritorio u otro |
| Navegador y sistema | Solo la familia (por ejemplo, `chrome`, `safari`, `android`, `ios`), sin versión |
| País, región y ciudad | Código del país (2 letras) y región (código y nombre del estado), informados por la red de AWS en el momento de la solicitud. La **ciudad** (nombre aproximado, deducido de la dirección IP por la red de AWS), solo en los proyectos en los que el dueño de la cuenta activó esa opción (Términos de Uso, Cláusula 4.5), que viene desactivada, y solo cuando también se informó la región |
| Propiedades | Hasta 10 por evento, definidas por el cliente: clave de hasta 40 caracteres (`a-z`, `0-9`, `_`) y valor corto (texto de hasta 100 caracteres, número o verdadero/falso) |
| Llamadas a la API del sitio (`api_request`) | Método, ruta en forma de plantilla, código de respuesta, duración y, si lo hay, el código del error |

**4. Lo que Pyxis no guarda.**

- **Dirección IP:** se usa solo en la memoria de la función de la API, para limitar abusos, durante el
  tiempo de la ventana del límite (1 minuto en el envío de eventos; 15 minutos en el inicio de sesión
  del panel). Nunca se graba en la base de datos ni en los registros.
- **Navegador completo (user agent):** se lee en el momento para determinar la categoría del
  dispositivo, la familia del navegador y la del sistema; después se descarta. Las visitas de robots
  conocidos se descartan.
- **Cookies:** el rastreador no crea cookies en los sitios del cliente.
- **Dirección completa de la página, parámetros de la dirección (salvo los de campaña), huella
  digital del navegador, código postal y coordenadas:** nunca.
- **Ciudad:** solo en los proyectos en los que el dueño de la cuenta activó esa opción. Al
  desactivarla, deja de leerse, y las ya guardadas se borran en los plazos de la Cláusula 12.8.

**5. Datos personales sensibles.** No deben enviarse (Cláusula 6.1, punto 3). Pyxis no está hecho para
tratarlos.

**6. Resumen semanal por correo electrónico.** Todos los lunes, cada persona con acceso al proyecto que
no desactivó el resumen recibe cifras agregadas de la semana: visitas, personas identificadas (solo el
recuento), conversiones, fallos de escritura, visitas por día, páginas y eventos más frecuentes y las
rutas con más fallos. El resumen no lleva identificadores de visitantes ni de usuarios.

**7. Operaciones de tratamiento.** Recepción, validación, clasificación, almacenamiento, consulta,
agregación, visualización en el panel, entrega mediante la API de consulta, mediante el servidor MCP y
a las aplicaciones conectadas, envío del resumen agregado por correo electrónico, copia (exportación),
suspensión de la recepción (Cláusula 5.4) y eliminación.

**8. Frecuencia y duración.** Continua, mientras el rastreador esté instalado y el contrato esté en
vigor. Eventos guardados durante 13 meses; eliminación al final del contrato conforme a la
Cláusula 12.

**9. Dónde.** Base de datos y API en São Paulo (Brasil). Panel en funciones en la región de São Paulo.
Situaciones con elemento extranjero en la Cláusula 9.5.

**10. Acceso mediante el servidor MCP, tokens y aplicaciones conectadas.** Los datos del panel salen de
Pyxis por tres caminos, todos elegidos por una persona con acceso al proyecto, que los usa en nombre
propio:

1. **Token en el servidor MCP local o en otro programa:** la persona crea un token de acceso y lo usa
   en el servidor MCP de Pyxis (`pyxis-mcp`), que se ejecuta en su computadora, o en otro programa. Los
   datos van a esa computadora y a la herramienta de inteligencia artificial que eligió.
2. **Token en la dirección `https://api.pyxis-analytics.dev/mcp`:** lo mismo, con el servidor MCP
   ejecutándose dentro de nuestra API; los datos van al programa que la persona configuró con el token.
3. **Aplicación conectada (conector de Claude):** la persona conecta Claude o Claude Code, de
   Anthropic, y permite la conexión en una página del panel (Términos de Uso, Cláusula 13.10). Los datos
   que pida la aplicación van de nuestra API directamente a los servidores de Anthropic, en los Estados
   Unidos (Claude), o a la computadora de la persona y desde allí a Anthropic (Claude Code).

Por cualquiera de esos caminos, la aplicación solo lee, y solo lo que la persona ve en el panel: las
cifras agregadas y también las listas de visitas y la línea de tiempo de cada visita, con el
identificador de usuario enviado mediante la función `identify` (punto 3). Ese envío es una instrucción
tuya (Cláusula 5.1, punto 4) y ocurre a petición de la persona, dentro de la aplicación que eligió: esa
aplicación, incluida Anthropic, **no** es suboperadora nuestra, trata los datos según los términos
vigentes entre ella y quien la usa, y te corresponde a ti evaluar su uso, incluido si hay transferencia
internacional y con qué mecanismo (art. 4.º del Reglamento aprobado por la Resolução CD/ANPD
n.º 19/2024), y el aviso a los visitantes (Cláusula 6.1, puntos 2 y 8, y Anexo IV). Te damos la
información de que dispongamos para esa evaluación (art. 4.º, § 1.º, del mismo Reglamento;
Cláusula 9.6). Cada persona revoca sus conexiones en Configuración → Aplicaciones conectadas, y el dueño
de la cuenta puede quitar a una persona de un proyecto (Términos de Uso, Cláusula 13.3).

**11. Exportación de los eventos.** A petición del dueño de la cuenta, una rutina genera un archivo CSV
comprimido con todos los eventos que guarda el proyecto, con los campos del punto 3. El archivo queda en
un repositorio privado y cifrado de AWS en la región de São Paulo y se borra automáticamente 7 días
después de estar listo. Solo el dueño de la cuenta descarga el archivo, desde el panel, con un enlace
nuevo en cada descarga, válido durante 5 minutos. Una vez descargado, el archivo queda bajo tu
responsabilidad.

---

## Anexo II — Medidas de seguridad vigentes

Comprobadas en el código del servicio y en la configuración de la infraestructura el 14/10/2026 y el
15/10/2026; el punto 1 (ciudad), el 29/10/2026.

**1. Privacidad desde el diseño.** Sin cookies en los sitios medidos; IP y navegador completo nunca
guardados; páginas reducidas a plantillas; barrera en el servidor que descarta valores con forma de
correo electrónico y números de 10 o más dígitos en las propiedades, en los parámetros de campaña y en
el identificador de usuario; región del visitante, y la ciudad solo cuando el cliente activa esa
opción en el proyecto, que viene desactivada; señales de "no rastrear" del navegador (Global Privacy
Control y Do Not Track) respetadas por el rastreador, que no envía nada cuando están activadas; opción
de no ser medido (`optOut`) para el visitante; eventos borrados después de 13 meses.

**2. Cifrado en tránsito.** Navegador → API: HTTPS con TLS 1.2 o superior y HSTS de 2 años. Red de
distribución → función de la API: solo HTTPS (TLS 1.2). Función → base de datos: TLS con verificación
del certificado del servidor (`sslmode=verify-full`). Panel: solo HTTPS.

**3. Cifrado en reposo.** Base de datos de Neon con AES-256; registros (logs) de AWS cifrados por
defecto; secretos (contraseñas de la base de datos y claves de servicios) en AWS Systems Manager
Parameter Store, cifrados, nunca en el código.

**4. Acceso al panel.**

- Inicio de sesión sin contraseña: un código de 6 dígitos enviado al correo electrónico autorizado,
  válido durante 10 minutos, guardado solo como hash (SHA-256), con hasta 5 intentos por código y hasta
  5 códigos por hora por correo electrónico; solicitudes de código limitadas a 5 cada 15 minutos por
  dirección de origen. Un correo electrónico sin acceso no recibe código y no se graba.
- Sesión: valor aleatorio de 256 bits guardado en la base de datos solo como hash; cookie `__Host-`
  con `HttpOnly`, `Secure` y `SameSite=Lax`; duración máxima de 7 días y fin automático después de
  24 horas sin uso; la persona ve las sesiones abiertas y las cierra una a una o todas a la vez.
- Acciones de escritura del panel aceptadas solo desde el origen del propio panel.
- Solo el dueño de la cuenta modifica proyectos, orígenes, claves y personas, solicita exportaciones y
  cierra la cuenta; las personas invitadas solo leen.

**5. Aislamiento entre clientes.** Toda consulta se filtra por el proyecto y por la lista de personas
con acceso a él. Pedir un proyecto ajeno responde como si no existiera. Hay pruebas automáticas para
ello.

**6. Claves y tokens.**

- Clave pública (va en el sitio): solo identifica el proyecto y solo se acepta cuando la solicitud
  viene de un origen registrado en el proyecto.
- Clave secreta (solo en el servidor del cliente): se muestra una única vez al crearse, se guarda solo
  como hash, se compara en tiempo constante, es revocable; limitada a 60 llamadas por minuto.
- Tokens de acceso (para agentes y programas): **solo lectura**; guardados solo como hash; validez de
  30, 90 o 365 días; hasta 10 activos por persona; revocables en cualquier momento en el panel;
  limitados a 60 consultas por minuto y, en el servidor MCP de la API, a 120 mensajes por minuto. No
  sirven para iniciar sesión, para escribir ni para eliminar.
- Conexiones de aplicaciones (conector de Claude): solo Claude y Claude Code, reconocidos por los
  documentos de identificación que publica Anthropic, con la dirección de retorno comprobada con esos
  documentos; consentimiento explícito en una página del panel, que muestra la aplicación, la dirección
  de retorno y los proyectos; código de un solo uso válido durante 5 minutos y vinculado a una prueba
  criptográfica (PKCE, S256); credencial de acceso de 1 hora y credencial de renovación sustituida en
  cada uso, ambas guardadas solo como hash; una credencial de renovación presentada de nuevo después de
  sustituida cierra la conexión; **solo lectura**, mediante las mismas consultas del panel; hasta
  10 conexiones activas por persona; fin después de 90 días sin uso; revocables en cualquier momento en
  el panel; limitadas a 120 mensajes por minuto en el servidor MCP y a 60 consultas por minuto. No
  sirven para iniciar sesión, para escribir ni para eliminar.

**7. Protección contra el abuso.** Límite de envío de lotes por dirección de origen y por proyecto; lote
con un máximo de 50 eventos y 32 KB; validación estricta de cada campo; eventos inválidos descartados;
recepción pausada cuando la cuenta llega al 150 % del límite mensual de eventos en el plan de pago, o
al 100 % en el plan gratis; los registros técnicos indican cuándo se rechazó un evento o una propiedad y por qué regla, sin guardar el valor rechazado.

**8. Infraestructura.** La función de la API rechaza las llamadas que no pasen por la red de
distribución (secreto de borde comprobado en tiempo constante). El usuario de base de datos de la
aplicación no puede alterar la estructura de la base de datos; las migraciones usan un usuario
separado. Cada función tiene su propio rol de permisos en AWS, con el mínimo necesario.

**9. Registros (logs).** Los registros de la API son estructurados y llevan un identificador de la
solicitud, identificadores internos (del proyecto, de la persona del panel y de la conexión), nombres de
eventos y, en las conexiones, qué aplicación se conectó; **no llevan correo electrónico, IP, token,
clave ni datos de visitantes**. Se conservan 14 días y desaparecen.

**10. Monitorización.** Alarmas por correo electrónico para: muchos intentos de inicio de sesión con
código erróneo, muchas solicitudes de código rechazadas, errores inesperados de la API, fallos y
limitación (throttling) de la función de la API y tamaño de la base de datos.

**11. Desarrollo.** Código público con revisión automática de seguridad (CodeQL), escaneo de secretos
con bloqueo del envío, alertas y actualizaciones de dependencias, auditoría de dependencias y pruebas
automáticas con cobertura total en cada cambio. La publicación en producción la hace solo el
responsable, después de que las pruebas se aprueben.

**12. Copias de seguridad.** Las de Neon: historial de recuperación de hasta 7 días y copias de
seguridad cifradas mantenidas durante hasta 30 días.

**13. Respuesta a incidentes.** Conforme a la Cláusula 11, con registro de cada incidente durante
5 años.

---

## Anexo III — Suboperadores

Situación a 15/10/2026.

**Suboperadores que tratan datos de los visitantes de tus sitios:**

| Proveedor | Qué hace en Pyxis | Dónde | Contrato de tratamiento | Plazo de las copias y registros |
|---|---|---|---|---|
| **Amazon Web Services (AWS)** | API que recibe los eventos y responde a las consultas; rutinas diarias (limpieza de 13 meses, uso mensual, iconos, fin de las cuentas) y semanales (resumen); archivos de exportación de los eventos (Amazon S3); registros técnicos; custodia de secretos; red de distribución (CloudFront) delante de la API | Región de São Paulo (sa-east-1). La red de distribución recibe las solicitudes en puntos de presencia de todo el mundo, sin guardarlas | Contrato de Cliente de AWS y el Anexo de Tratamiento de Datos de AWS. AWS se compromete a no sacar los datos de la región elegida, salvo lo necesario para prestar el servicio o cumplir la ley | Registros de la API: 14 días. Archivos de exportación: 7 días |
| **Neon** (Databricks, Inc., EE. UU.) | Base de datos (Postgres) donde están los eventos y la configuración de los proyectos | Servidores en la región de São Paulo de AWS (aws-sa-east-1); empresa en EE. UU. | Términos de Neon/Databricks y el Anexo de Tratamiento de Datos de Databricks | Historial de recuperación: hasta 7 días. Copias de seguridad: hasta 30 días |
| **Vercel Inc.** (EE. UU.) | Aloja el panel (`app.pyxis-analytics.dev`): genera las páginas que muestran tus cifras a quien ha iniciado sesión | Funciones en la región de São Paulo (gru1); empresa y procesamiento principal en EE. UU. | Anexo de Tratamiento de Datos de Vercel | Registros técnicos de las solicitudes al panel: 1 día |

**Proveedores que no reciben datos de los visitantes** (enumerados por transparencia; el tratamiento
que hacen está en la Política de Privacidad de Pyxis):

| Proveedor | Qué hace | Dónde |
|---|---|---|
| **Amazon SES** (Amazon Web Services) | Envía los correos electrónicos del servicio: códigos de inicio de sesión y de registro, invitaciones, bienvenida, avisos de uso y de fin de la cuenta, aviso de exportación lista (con el enlace del panel, no el archivo) y el resumen semanal con cifras agregadas | Región de São Paulo (sa-east-1) |
| **Stripe** (Stripe Brasil Soluções de Pagamento – Instituição de Pagamento Ltda. y Stripe, LLC, EE. UU.) | Cobro de la suscripción | Brasil y EE. UU. |
| **ImprovMX** (ImprovMX Incorporated, EE. UU.) | Reenvía los correos enviados a hello@pyxis-analytics.dev | Recepción transitoria en Francia; empresa en EE. UU. |
| **Google** (Google LLC, EE. UU.) | Buzón de correo donde quedan los mensajes de soporte (cuenta personal, sin contrato de operador: Google trata los mensajes como controlador, conforme a su propia política de privacidad) | EE. UU. y otros países |

**Aplicaciones que conectan las personas con acceso** (no son suboperadores; Anexo I, punto 10):

| Aplicación | Quién es | Qué recibe | Dónde |
|---|---|---|---|
| **Claude** y **Claude Code** | Anthropic, PBC (EE. UU.) | Los datos que pida la aplicación, cuando una persona con acceso la conectó y la usa | EE. UU. |

No envíes datos de visitantes en los mensajes de soporte. Si necesitas mostrar un caso, usa el
identificador de la visita o del usuario, nunca el nombre o el correo electrónico de la persona.

---

## Anexo IV — Modelo de aviso para tu sitio

Texto sugerido para la política de privacidad de tu sitio. Ajústalo a lo que tu sitio realmente envía.
No sustituye tu propio análisis.

> **Medición del uso del sitio**
>
> Usamos Pyxis para entender cómo se usa el sitio: qué páginas se ven, de dónde vienen las visitas y
> qué funciones se usan. La medición **no usa cookies**, **no guarda tu dirección IP** y **no guarda
> tu navegador completo**. Registramos la página vista (sin los parámetros de la dirección, salvo los
> de campaña), el sitio del que viniste, el tipo de dispositivo, la familia del navegador y del
> sistema, el país y la región (nunca la ciudad) y las acciones que marcamos en el sitio. Cada visita
> recibe un número aleatorio que queda solo en la pestaña del navegador y se descarta al cerrar la
> pestaña o después de 30 minutos sin actividad; no hay ningún identificador que te reconozca en otra
> visita.
>
> *(Si activaste la ciudad en el proyecto, sustituye "el país y la región (nunca la ciudad)" por "el
> país, la región y la ciudad aproximada, deducidos de tu dirección IP en el momento del acceso, sin
> guardar la IP". Si tu sitio también usa la función `identify`, sustituye, en el párrafo siguiente,
> "vinculamos los eventos de esa visita al número interno de tu cuenta" por "vinculamos los eventos
> de esa visita, incluida la ciudad aproximada, al número interno de tu cuenta". Si este aviso ya
> estaba publicado sin la ciudad, destaca el cambio y la fecha en que empieza a aplicarse.)*
>
> *(Incluye el párrafo siguiente solo si tu sitio usa la función `identify`.)* Cuando inicias sesión
> en tu cuenta, vinculamos los eventos de esa visita al número interno de tu cuenta, nunca a tu nombre
> ni a tu correo electrónico. Si eliminas tu cuenta o lo pides, borramos esos eventos.
>
> *(Opcional: inclúyelo si tu equipo conecta herramientas de inteligencia artificial a Pyxis.)*
> Podemos consultar esas cifras con herramientas de inteligencia artificial que elegimos, como Claude,
> de Anthropic, que reciben solo lo que les pidamos.
>
> Los datos se guardan en Brasil y se borran después de 13 meses. Pyxis trata esos datos por cuenta
> nuestra, como operador. Si tu navegador envía la señal Global Privacy Control o "Do Not Track", no se
> envía nada. Para ejercer tus derechos previstos en la LGPD, contáctanos a través del canal indicado
> en esta política.
