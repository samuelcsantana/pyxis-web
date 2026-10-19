# Términos de Uso de Pyxis

**Versión {{terms.version}}, vigente desde {{terms.effectiveFrom}}.**

> Esta es una traducción de cortesía. El texto vinculante es la versión en portugués
> ([Português](/termos)); si las dos difieren, prevalece el portugués.

Estos términos son el contrato entre tú y nosotros para el uso de **Pyxis alojado**: el servicio de
análisis de uso de sitios web que operamos en `pyxis-analytics.dev`, `app.pyxis-analytics.dev` y
`api.pyxis-analytics.dev`. Léelos con atención, en especial los fragmentos marcados con **Atención**,
que limitan derechos.

## Resumen del contrato

Este resumen no sustituye el texto completo, pero muestra lo más importante antes de contratar.

1. **Quién ofrece:** {{seller.name}}, persona física, CPF {{seller.taxId}} (Cláusula 1).
2. **Precio:** R$ 39,00 al mes o R$ 390,00 al año, con tarjeta de crédito, a través de Stripe, con
   **renovación automática** hasta que canceles (Cláusula 8).
3. **Prueba gratuita:** 14 días, una vez por cliente. La tarjeta se pide al inicio, y Stripe envía un
   recordatorio 7 días antes del final. **Si no cancelas antes del final de la prueba, el primer cobro
   se realiza el día 15** (Cláusulas 6.4 y 8.3).
4. **Límites del plan:** hasta 100.000 eventos al mes, hasta 3 sitios, hasta 3 personas en el panel
   (contándote a ti) y 13 meses de historial. Te avisamos cuando la cuenta llega al 80 % y al 100 % de
   los eventos del mes. **Atención: al 150 %, la recepción de eventos se pausa hasta el día 1 del mes
   siguiente**, y los eventos enviados durante la pausa se pierden. No se cobra nada aparte del precio
   (Cláusula 7).
5. **Desistimiento:** reembolso íntegro si desistes en un plazo de 7 días después del primer cobro.
   Si cierras la cuenta en el panel dentro de ese plazo, el reembolso es automático (Cláusula 10).
6. **Cancelación:** en cualquier momento, de dos maneras. En el portal de Stripe, el acceso continúa
   hasta el final del periodo pagado. Si cierras la cuenta en el panel, **el acceso termina en el
   acto**. **Atención: pasados los 7 días del desistimiento, no hay reembolso proporcional del periodo
   ya pagado** en ninguna de las dos (Cláusula 11).
7. **Eliminación de los datos:** **30 días después del fin del acceso, la cuenta, los proyectos y
   todos los eventos se borran definitivamente.** Hasta entonces, puedes exportar los eventos desde
   el panel (Cláusula 11).
8. **Disponibilidad:** **Atención: no hay garantía de disponibilidad (SLA)**; hacemos nuestro mejor
   esfuerzo para mantener el servicio en funcionamiento (Cláusula 15). Soporte por correo
   electrónico, con respuesta en un plazo de 2 días hábiles (Cláusula 16).
9. **Tus principales obligaciones:** **no enviar datos personales en los eventos** (nombre, correo
   electrónico, CPF, teléfono, etc.), informar de la medición a los visitantes de tu sitio y no usar el
   servicio de forma abusiva (Cláusula 12).
10. **Atención: suspensión y rescisión por abuso.** Si hay abuso (por ejemplo, datos personales en los
    eventos, medir a quien pidió no ser medido, tráfico falsificado, ataque, fraude o prueba gratuita
    repetida), podemos suspender la parte afectada del servicio y, en caso grave o repetido, rescindir
    el contrato. Por regla general avisamos antes y damos un plazo para corregir; siempre indicamos el
    motivo y puedes impugnar la medida (Cláusula 18).
11. **Datos personales:** tú eres el controlador (responsable del tratamiento) de los datos de los
    visitantes de tu sitio; nosotros somos el operador (encargado del tratamiento) (Cláusula 14 y
    Acuerdo de Tratamiento de Datos). Si una persona con acceso conecta Claude o Claude Code a Pyxis,
    las cifras que pida van a Anthropic, que no es proveedora nuestra (Cláusula 13.10).

---

## Cláusula 1 — Quién ofrece el servicio y cómo contactarnos

1.1. Pyxis alojado lo ofrece **{{seller.name}}**, persona física, inscrita en el CPF (registro
fiscal brasileño de personas físicas) con el n.º **{{seller.taxId}}**, con domicilio en
**{{seller.address}}** ("nosotros"). **Pyxis** es el nombre del servicio.

1.2. Contacto para cualquier asunto, incluidos cancelación, desistimiento, soporte, impugnación de una
suspensión y datos personales: **hello@pyxis-analytics.dev**.

1.3. "Tú" es la persona física o jurídica que contrata el servicio para medir uno o más sitios.

## Cláusula 2 — Palabras usadas en estos términos

2.1. **Servicio:** Pyxis alojado por nosotros: la API que recibe y responde los datos
(`api.pyxis-analytics.dev`), el panel (`app.pyxis-analytics.dev`), el resumen semanal por correo
electrónico y el acceso mediante tokens y aplicaciones conectadas, incluido el servidor MCP.

2.2. **Rastreador:** el paquete `pyxis-analytics` (código abierto) que instalas en tu sitio para
enviar eventos al servicio.

2.3. **Proyecto:** la configuración de un sitio tuyo en el servicio (nombre, direcciones autorizadas,
zona horaria, evento de conversión, claves y eventos).

2.4. **Evento:** cada registro enviado por el rastreador o por tu integración, como una página vista
o una acción que marcaste.

2.5. **Personas con acceso:** el dueño de la cuenta y las personas a las que invita a entrar en
el panel.

2.6. **Periodo:** el mes o el año pagado de tu suscripción.

2.7. **Consumidor:** quien contrata el servicio como destinatario final, en los términos del art. 2.º
del Código de Defesa do Consumidor (Código de Defensa del Consumidor de Brasil; Lei n.º 8.078/1990).

2.8. **Cuenta:** el registro de quien contrata, al que pertenecen la suscripción, los proyectos y las
personas con acceso.

2.9. **Dueño de la cuenta:** la persona que hizo el registro (o la que indicaste cuando creamos
la cuenta a petición tuya) y que, en tu nombre, administra proyectos, claves, personas, exportaciones
y facturación.

2.10. **Fin del acceso:** la fecha en que la cuenta deja de recibir eventos y de poder modificar los
proyectos: el final del periodo pagado o de la prueba después de una cancelación (Cláusula 11.2), el
cierre de la cuenta (Cláusulas 11.6 y 18.7) o el fin de la suscripción por falta de pago
(Cláusula 9.2).

## Cláusula 3 — Aceptación, quién puede contratar y documentos del contrato

3.1. Aceptas estos términos de una de estas maneras:

1. **en el registro desde el panel** (`app.pyxis-analytics.dev/sign-up`), marcando la casilla de
   aceptación de los Términos de Uso, del Acuerdo de Tratamiento de Datos y de la Política de
   Privacidad, que muestra el número de la versión. Guardamos la versión aceptada y la fecha y la hora
   de la aceptación (sin guardar tu IP). La página de pago de Stripe vuelve a pedir la aceptación antes
   de la suscripción;
2. **cuando creamos la cuenta a petición tuya** (Cláusula 6.2), respondiendo a nuestro correo con la
   confirmación de la aceptación de la versión indicada en él, antes de que habilitemos el acceso.

Si no estás de acuerdo, no te registres ni te suscribas.

3.2. Para contratar, necesitas tener 18 años o más y capacidad civil. Si contratas en nombre de una
empresa, declaras que tienes poderes para ello, y la empresa pasa a ser "tú".

3.3. El servicio se ofrece a clientes en Brasil, con precio en reales.

3.4. El contrato está formado por estos términos y por dos anexos:

1. **Anexo 1 — Acuerdo de Tratamiento de Datos Personales**, que regula los datos de los visitantes
   de tus sitios;
2. **Anexo 2 — Política de Privacidad de Pyxis**, que explica los datos que tratamos sobre ti y sobre
   las personas con acceso.

En materia de datos personales, el Anexo 1 prevalece sobre estos términos.

3.5. Después de la contratación, el correo de bienvenida incluye la versión aceptada y la dirección
permanente de esa versión, donde puedes guardar o imprimir el texto completo. A petición, enviamos el
texto en un archivo. Las versiones anteriores están disponibles a petición.

## Cláusula 4 — Qué hace el servicio

4.1. El rastreador instalado en tu sitio envía al servicio las páginas vistas y los eventos que
marques. El servicio guarda esos eventos y muestra el análisis en el panel, solo a las personas con
acceso: vista general, visitas, línea de tiempo de cada visita, embudo, funcionalidades usadas, fallos
de las llamadas a la API de tu sitio, adquisición, dispositivos y horarios.

4.2. Lo que el servicio **no** hace, por diseño:

1. no crea cookies en tu sitio;
2. no guarda la dirección IP del visitante: la IP se usa solo en la memoria del servidor, durante
   unos minutos, para limitar abusos;
3. no guarda el navegador completo (user agent), solo la categoría del dispositivo y la familia del
   navegador y del sistema;
4. no guarda la ciudad, solo el país y la región;
5. no guarda la dirección completa de la página: solo la ruta en forma de plantilla, sin parámetros,
   salvo los de campaña (`utm_source`, `utm_medium`, `utm_campaign`);
6. no envía nada cuando el navegador del visitante pide no ser rastreado (Global Privacy Control o Do
   Not Track);
7. no reconoce al visitante anónimo en otra visita: cada visita tiene un número aleatorio que
   desaparece al cerrar la pestaña o después de 30 minutos sin actividad.

4.3. **Atención:** las cifras del panel son una medición, no un recuento exacto. Las visitas de quien
bloquea el rastreador, de quien pide no ser rastreado, de robots y de quien estaba sin conexión no
aparecen, y los eventos enviados mientras el servicio esté caído o con la recepción pausada
(Cláusulas 7.2, 15 y 18) se pierden (el rastreador vuelve a intentarlo durante unos segundos mientras
la página está abierta, pero no cuando la recepción está pausada).

4.4. También forman parte del plan:

1. el **resumen semanal por correo electrónico**, todos los lunes, que cada persona con acceso puede
   desactivar en Configuración;
2. **tokens de acceso de solo lectura**, creados en Configuración, para que programas y agentes de
   inteligencia artificial consulten las mismas cifras del panel;
3. el **servidor MCP**, de dos maneras: el programa de código abierto `pyxis-mcp`, que se ejecuta en
   tu computadora y usa un token de acceso; o la dirección `https://api.pyxis-analytics.dev/mcp`, que
   Claude y Claude Code usan como conector después de que una persona con acceso permita la conexión
   (Cláusula 13.10) y que otros programas usan con un token de acceso;
4. las rutas de la API para **eliminar o copiar los datos de una persona identificada**, con la clave
   secreta del proyecto;
5. la **exportación de todos los eventos de un proyecto** en un archivo, desde el panel
   (Cláusula 11.5).

## Cláusula 5 — Código abierto y servicio alojado

5.1. El código de Pyxis es abierto, bajo la licencia MIT, en los repositorios públicos `pyxis-api`,
`pyxis-sdk`, `pyxis-web` y `pyxis-mcp`. Cualquier persona puede leer, copiar, modificar y ejecutar el
código por su cuenta, en los términos de esa licencia.

5.2. Estos términos tratan solo del **servicio alojado por nosotros**. Nada de lo aquí dispuesto
restringe lo que la licencia MIT permite. Si ejecutas Pyxis en tu propia infraestructura, estos
términos no se aplican a esa instalación.

## Cláusula 6 — Cómo empieza: registro en el panel o cuenta creada a petición

6.1. **Registro desde el panel.**

1. En `app.pyxis-analytics.dev/sign-up`, eliges el plan (mensual o anual), indicas tu correo
   electrónico, aceptas los términos (Cláusula 3.1) y confirmas el correo con un código de 6 dígitos
   enviado a él.
2. A continuación, indicas la tarjeta en la página de pago de Stripe, que inicia la prueba gratuita
   (Cláusula 8.3).
3. Una vez que Stripe confirma la suscripción, la cuenta queda lista: creas tus proyectos en el panel
   (hasta 3), con la dirección del sitio, la zona horaria y, si quieres, el evento de conversión, y
   recibes la clave pública y el fragmento de instalación. Quien hizo el registro es el dueño de
   la cuenta.

Si no completas la página de pago de Stripe, la cuenta queda incompleta, sin proyectos, y se borra
7 días después del registro. Hasta entonces, puedes completar la suscripción volviendo a entrar en el
panel.

6.2. **Cuenta creada a petición.** También podemos crear la cuenta por ti, a petición hecha a
hello@pyxis-analytics.dev, por ejemplo cuando no sea posible completar el registro desde el panel o en
una cuenta gratuita que ofrezcamos. En ese caso, acordamos por correo electrónico el plan y la forma de
pago, la aceptación sigue la Cláusula 3.1, punto 2, y habilitamos el acceso en un plazo de 2 días
hábiles después de la aceptación y, si hay cobro, de la suscripción. En una cuenta gratuita no hay
cobro; el resto de estos términos se aplica igual, y podemos poner fin a la gratuidad con un aviso de
30 días, después del cual puedes suscribirte al plan o salir.

6.3. Podemos rechazar un registro o una solicitud de cuenta solo por un motivo objetivo: (a) que el
sitio no sea compatible con el uso aceptable (Cláusula 12); (b) que el volumen esperado supere en mucho
los límites del plan; (c) que la misma persona o empresa haya tenido una cuenta cerrada por abuso grave
(Cláusula 18.7) en los 12 meses anteriores; o (d) una prueba gratuita repetida (Cláusula 6.4). Si
rechazamos después de un cobro, devolvemos el importe íntegro.

6.4. **La prueba gratuita vale una vez por cliente:** una vez por cuenta (una cuenta que ya tuvo
suscripción no obtiene una nueva prueba al volver a suscribirse) y una vez por persona o empresa,
aunque sea en otra cuenta, con otro correo electrónico u otra tarjeta. Para detectar una prueba
repetida con la misma tarjeta, guardamos durante 12 meses la "huella" de la tarjeta calculada por
Stripe, nunca el número de la tarjeta, como explica la Política de Privacidad (punto 2.7). Lo que
ocurre en una prueba repetida está en la Cláusula 18.11.

## Cláusula 7 — Plan y límites

7.1. El plan incluye:

| Elemento | Límite |
|---|---|
| Eventos recibidos al mes, sumando todos los proyectos de la cuenta | hasta 100.000 |
| Sitios (proyectos) | hasta 3 |
| Personas con acceso al panel | hasta 3, contando al dueño de la cuenta |
| Historial | 13 meses (los eventos más antiguos se borran todos los días) |
| Resumen semanal por correo electrónico | incluido |
| Tokens de acceso, servidor MCP y conector de Claude | incluidos |
| Exportación de los eventos de un proyecto | desde el panel, hasta 3 por proyecto al día |
| Soporte | por correo electrónico, respuesta en un plazo de 2 días hábiles |

7.2. **Atención: uso por encima del límite.**

1. El uso del mes es la suma de los eventos guardados en todos los proyectos de la cuenta con fecha de
   ese mes. El mes es el mes natural contado en UTC (Tiempo Universal Coordinado), que en el horario
   de Brasilia comienza a las 21:00 del último día del mes anterior.
2. El servicio mide el uso una vez al día, de madrugada. El uso medido aparece en Cuenta y
   facturación, en el panel.
3. Cuando la medición diaria constate el 80 % y, después, el 100 % del límite (80.000 y 100.000
   eventos), avisamos al dueño de la cuenta por correo electrónico, una vez por nivel en cada
   mes. **Hasta el 150 %, no se corta nada.**
4. **Cuando la medición diaria constate el 150 % del límite (150.000 eventos), la recepción de eventos
   de todos los proyectos de la cuenta se pausa hasta el día 1 del mes siguiente**, y avisamos por
   correo electrónico. Durante la pausa, el servicio rechaza los eventos (respuesta
   `403 quota_exceeded`), que **no se guardan y no pueden recuperarse**. El panel sigue mostrando los
   datos ya guardados. La recepción se reanuda sola al inicio del mes siguiente. Como la medición es
   diaria, la cuenta puede superar un poco el 150 % antes de que empiece la pausa.
5. **No cobramos nada aparte del precio del plan** por el uso por encima del límite.
6. Si la cuenta supera el límite con frecuencia, podemos proponer por correo electrónico un plan o un
   precio adecuados al volumen. Aceptar es opcional.

7.3. El servicio tiene límites técnicos contra el abuso, como la cantidad de lotes de eventos por
minuto por dirección y por proyecto y el tamaño de cada lote. Esos límites pueden cambiar para
proteger el servicio, sin reducir el límite mensual de eventos de tu plan.

7.4. El borrado de los eventos con más de 13 meses es automático y forma parte del servicio: **no
guardamos historial más antiguo**.

## Cláusula 8 — Precio, prueba gratuita y cobro

8.1. **Precio:** R$ 39,00 al mes o R$ 390,00 al año. No hay tarifa de instalación ni otros cargos.

8.2. **Forma de pago:** tarjeta de crédito, procesada por Stripe. **No vemos ni guardamos el número
de tu tarjeta.** Actualmente no aceptamos Pix ni boleto.

8.3. **Prueba gratuita:** 14 días, contados desde la confirmación de la suscripción en la página de
pago de Stripe, una vez por cliente (Cláusula 6.4). La tarjeta es obligatoria al inicio, y no se cobra
nada durante la prueba. Stripe envía un recordatorio por correo electrónico 7 días antes del final de
la prueba, con el enlace para cancelar. **Si no cancelas antes del final de la prueba (en el portal de
Stripe o cerrando la cuenta en el panel), el primer cobro se realiza el día 15** y, a partir de
entonces, en cada nuevo periodo; en el extracto de la tarjeta, ese primer cobro aparece indicado como
fin de la prueba. Si cancelas durante la prueba, no se cobra nada. Una cuenta que ya tuvo suscripción
no tiene nueva prueba al volver a suscribirse: el cobro empieza el día de la nueva suscripción.

8.4. **Renovación automática:** la suscripción se renueva sola al final de cada periodo, con cobro en
la misma tarjeta, hasta que canceles (Cláusula 11). La fecha del próximo cobro aparece en Cuenta y
facturación, en el panel, y Stripe envía el recibo de cada cobro por correo electrónico.

8.5. **Cambio de precio:** avisamos por correo electrónico con **al menos 30 días de antelación**. El
nuevo precio solo se aplica a partir de la renovación siguiente al final de ese plazo; **el periodo ya
pagado no cambia de precio**. Si no estás de acuerdo, cancela antes de la renovación, sin coste.

8.6. **Factura fiscal:** el recibo de cada cobro lo envía Stripe. La emisión de factura fiscal (nota
fiscal) depende de nuestro régimen tributario; si necesitas factura fiscal, pregunta antes de
contratar.

## Cláusula 9 — Falta de pago

9.1. Si el cobro de una renovación falla, Stripe te avisa por correo electrónico, con un enlace para
actualizar la tarjeta, y vuelve a intentarlo hasta 8 veces en las 2 semanas siguientes; el panel
también muestra un aviso (Cuenta y facturación → Gestionar la facturación). Si el banco pide que
confirmes el pago (3D Secure), Stripe envía el enlace de confirmación por correo electrónico. Stripe
también avisa por correo electrónico cuando la tarjeta registrada esté a punto de expirar. Durante ese
plazo, el servicio sigue funcionando.

9.2. Si el pago no se realiza después de esos intentos (hasta 2 semanas desde el primer fallo), o si
la confirmación pedida por el banco no se hace en 15 días, Stripe da por terminada la suscripción, y
ese es el fin del acceso: a más tardar el día siguiente, las claves de los proyectos se revocan y los
sitios dejan de enviar eventos; el panel queda disponible solo para consulta y exportación hasta la
eliminación.

9.3. Los datos se borran 30 días después del fin del acceso (Cláusula 11.4). Hasta entonces, puedes
volver como indica la Cláusula 11.5, punto 3, sin perder datos.

## Cláusula 10 — Derecho de desistimiento

10.1. Como la contratación se realiza por internet, el consumidor puede desistir del contrato en un
plazo de 7 días desde la contratación (Código de Defesa do Consumidor, art. 49). Durante la prueba
gratuita no se cobra nada: basta con cancelar.

10.2. **Ampliamos este derecho a todos los clientes:** si desistes en un plazo de **7 días después del
primer cobro** (del plan mensual o del anual), devolvemos **el importe íntegro** de ese cobro, sin
necesidad de explicar el motivo.

10.3. Para ejercerlo, usa cualquiera de estos medios:

1. **cierra la cuenta en el panel** (Cuenta y facturación → Cerrar la cuenta), el mismo canal usado
   para contratar. Dentro del plazo, el reembolso del importe íntegro se solicita a Stripe
   automáticamente, y la pantalla muestra el importe devuelto;
2. o envía un correo electrónico a hello@pyxis-analytics.dev, desde el correo del dueño de la
   cuenta, con la palabra "arrependimento" (desistimiento).

Cancelar la suscripción en el portal de Stripe, por sí solo, no genera el reembolso: usa uno de los
dos medios anteriores.

10.4. Desde el panel, la confirmación aparece en el acto, en la pantalla, y también por correo
electrónico. Por correo electrónico, confirmamos la recepción por la misma vía y solicitamos el
reembolso a Stripe en un plazo de 2 días hábiles. Si el reembolso automático falla, lo solicitamos
manualmente en un plazo de 2 días hábiles y te avisamos. Stripe comunica el reembolso al emisor de la
tarjeta; el plazo para que aparezca en el extracto depende del emisor.

10.5. Con el desistimiento, la cuenta se cierra como en la Cláusula 11.6: el acceso termina en el acto
y los datos siguen la Cláusula 11.4.

## Cláusula 11 — Cancelación y cierre de la cuenta por tu parte

11.1. Puedes salir en cualquier momento, de dos maneras, con efectos diferentes:

1. **cancelar la suscripción en el portal de Stripe** (Cuenta y facturación → Gestionar la facturación,
   o mediante el enlace de los correos de Stripe): surte efecto al final del periodo pagado o de la
   prueba (Cláusula 11.2);
2. **cerrar la cuenta en el panel** (Cuenta y facturación → Cerrar la cuenta): surte efecto en el
   acto (Cláusula 11.6).

Si lo prefieres, pídelo por correo electrónico a hello@pyxis-analytics.dev, desde el correo del
dueño de la cuenta, indicando cuál de las dos quieres. Sin esa indicación, hacemos la
cancelación del punto 1. Confirmamos la recepción por la misma vía.

11.2. **Cancelación en el portal de Stripe:** el acceso continúa hasta el final del periodo pagado (o
de la prueba) y **no hay nuevo cobro**. A más tardar el día siguiente al fin del acceso, las claves de
los proyectos se revocan y los sitios dejan de enviar eventos; el panel queda disponible solo para
consulta y exportación hasta la eliminación.

11.3. **Atención: fuera del derecho de desistimiento (Cláusula 10), no hay reembolso proporcional del
periodo ya pagado,** ni en el plan mensual ni en el anual, en ninguna de las dos maneras de salir. Solo
hay devolución en los casos que estos términos prevén expresamente: Cláusulas 6.3, 15.7, 18.9, 18.10,
18.13, 20.2, 21.3 y 22.1 y Cláusulas 9.2 y 16.2 del Anexo 1.

11.4. **Atención: eliminación de los datos.** **30 días después del fin del acceso** (Cláusula 2.10),
una rutina automática borra definitivamente la cuenta, los proyectos y todo lo que les pertenece, como
se describe en la Cláusula 12 del Anexo 1. Avisamos al dueño de la cuenta por correo electrónico
al fin del acceso, 7 días antes de la eliminación y cuando se realice. Después de eso, **no hay forma
de recuperar los datos**. Solo siguen guardados los registros de facturación que la ley obliga a
conservar, el registro de prevención de prueba gratuita repetida (Política de Privacidad, puntos 2.2 y
2.7) y lo que una ley o una orden de autoridad obligue a preservar (Cláusula 12.6 del Anexo 1).

11.5. **Exportar los eventos y volver.**

1. El dueño de la cuenta exporta todos los eventos de un proyecto en la Configuración del proyecto.
   El archivo (CSV comprimido) está listo en unos minutos, el aviso llega por correo electrónico, y el
   archivo puede descargarse en el panel durante **7 días**, con un enlace nuevo en cada descarga,
   válido durante 5 minutos; después, el archivo se borra. Se permiten hasta 3 exportaciones por
   proyecto al día. La exportación funciona durante el contrato y en los 30 días posteriores al fin
   del acceso.
2. Si la exportación desde el panel no funciona, pide la copia a hello@pyxis-analytics.dev: enviamos el
   archivo en un plazo de 10 días hábiles desde la solicitud y, si la solicitud llega cerca de la
   fecha de eliminación, aplazamos la eliminación hasta entregar la copia.
3. Antes de la eliminación, puedes **volver** sin perder datos: en Cuenta y facturación, elige
   "Suscribirse de nuevo", o escribe a hello@pyxis-analytics.dev y reactivamos la suscripción. En
   cualquiera de los dos caminos, no hay nueva prueba gratuita y el cobro empieza con la reactivación.
   Las claves revocadas no vuelven: creas claves nuevas en el panel y las cambias en tu sitio.

11.6. **Cerrar la cuenta desde el panel.** Solo el dueño de la cuenta puede cerrarla, en Cuenta
y facturación, escribiendo su correo electrónico para confirmar. **Atención: el cierre surte efecto en
el acto y no puede deshacerse desde el panel:**

1. la suscripción se cancela en Stripe inmediatamente, sin nuevos cobros;
2. las claves de todos los proyectos se revocan en el acto, y los sitios dejan de enviar eventos;
3. el panel queda disponible solo para consulta y exportación (Cláusula 11.5) hasta la eliminación;
4. los datos se borran 30 días después del cierre (Cláusula 11.4);
5. si el cierre se hace en un plazo de 7 días desde el primer cobro, el importe de ese cobro se
   reembolsa íntegramente (Cláusula 10); fuera de eso, **no hay devolución proporcional del periodo
   pagado** (Cláusula 11.3);
6. la pantalla confirma el cierre, la fecha de la eliminación y el importe reembolsado, y enviamos la
   confirmación por correo electrónico.

Cerrar durante la prueba gratuita no genera cobro. Si Stripe no consigue cancelar la suscripción, no se
cierra nada y la pantalla lo avisa. Si cambias de opinión antes de la eliminación, se aplica la
Cláusula 11.5, punto 3.

## Cláusula 12 — Uso aceptable, abuso y tus responsabilidades

12.1. Te comprometes a usar el servicio de buena fe, solo para medir el uso de tus sitios. **Es
abuso** cualquiera de las conductas siguientes, realizada por ti, por las personas con acceso a tu
cuenta o por quien use tus claves, tokens o conexiones con tu permiso:

*Datos personales y privacidad*

1. enviar **datos personales directos** en los eventos: nombre, correo electrónico, teléfono, CPF,
   dirección, número de documento, texto escrito por el visitante o cualquier dato que identifique a
   una persona por sí solo;
2. enviar **datos personales sensibles** (salud, origen racial o étnico, religión, opinión política,
   afiliación sindical, vida sexual, dato genético o biométrico);
3. intentar **eludir la barrera de datos personales** del servidor (Cláusula 12.2), por ejemplo
   dividiendo, codificando o disfrazando un correo electrónico, un documento o un teléfono para que
   pasen por ella;
4. usar en la función `identify` algo distinto de un **identificador interno y opaco** de la cuenta en
   tu sistema, como el correo electrónico, el CPF o el teléfono;
5. **medir a quien pidió no ser medido**: desactivar, eludir o alterar el respeto del rastreador a las
   señales Global Privacy Control y Do Not Track y a la opción de no ser medido (`optOut`), o enviar
   eventos de esas personas por otro camino;
6. usar el servicio junto con técnicas de huella digital del navegador (fingerprinting) u otros medios
   para reconocer a visitantes anónimos;

*Tráfico y seguridad*

7. enviar **eventos falsificados o automatizados** para inflar, distorsionar o sobrecargar las cifras o
   el servicio (las pruebas razonables de tu propia instalación no son abuso);
8. enviar eventos desde **sitios que no son tuyos** ni de quien te autorizó, o registrar como origen de
   un proyecto un sitio ajeno;
9. usar la **clave pública, la clave secreta, el token o la conexión de otro cliente**;
10. **atacar el servicio**, intentar acceder a datos de otros clientes o a partes del servicio que no
    son tuyas, o probar vulnerabilidades sin nuestra autorización por escrito (informar de buena fe un
    fallo de seguridad a hello@pyxis-analytics.dev no es abuso);
11. **eludir los límites** de tasa, la cuota mensual (Cláusula 7.2) o los límites del plan
    (Cláusula 7.1), por ejemplo dividiendo el envío de un mismo sitio entre varias cuentas o claves;
12. **publicar o compartir** la clave secreta o un token de acceso a propósito o repetidamente (en un
    repositorio de código público, en una página, en un foro o en el código que se ejecuta en el
    navegador); una filtración accidental no es abuso, pero la clave o el token filtrados se revocan
    como indica la Cláusula 13.9;

*Cuenta, plan y pago*

13. revender, alquilar o ceder el acceso al servicio alojado a terceros, o compartir la cuenta para
    superar los límites de personas y de proyectos del plan, sin un acuerdo por escrito con nosotros
    (medir, como agencia, sitios de clientes tuyos que lo hayan autorizado, dentro de los límites del
    plan, no es reventa; Cláusula 3.2 del Anexo 1);
14. crear más de una cuenta, o usar otra persona, otro correo electrónico u otra tarjeta, para
    **repetir la prueba gratuita** o para eludir un límite o un cobro;
15. **fraude en el pago**: usar una tarjeta sin autorización de su titular o datos de facturación
    falsos, o disputar de mala fe un cargo ante el emisor de la tarjeta, por ejemplo alegando no
    reconocer un cargo que autorizaste y cuyo servicio usaste, sin haber pedido antes la cancelación o
    el reembolso a nosotros (disputar un cargo indebido es tu derecho; Cláusula 18.12);

*Ley y terceros*

16. usar el servicio para una actividad ilegal, para medir sitios con contenido ilegal o para violar
    derechos de terceros (privacidad, propiedad intelectual, imagen);
17. cualquier otro uso contrario a la ley o a estos términos que cause, o cree un riesgo concreto y
    demostrable de causar, daño a los demás clientes, a la infraestructura del servicio, a los
    titulares de los datos o a nosotros, incluida la responsabilidad legal.

12.2. El servidor descarta automáticamente los valores con forma de correo electrónico y las secuencias
de 10 o más dígitos (como CPF, CNPJ —registro fiscal brasileño de personas jurídicas— y teléfono). **Atención:** esa barrera es una segunda capa y no
reconoce nombres, direcciones ni textos libres. **La responsabilidad por lo que envía tu sitio es
tuya.**

12.3. También te comprometes a:

1. publicar en tu sitio un aviso de privacidad que describa la medición (hay un modelo en el Anexo IV
   del Acuerdo de Tratamiento de Datos) y mantener ese aviso conforme a lo que envía tu sitio;
2. si tu sitio está dirigido a niños o adolescentes, evaluar antes la medición a la luz del art. 14 de
   la Lei Geral de Proteção de Dados Pessoais (LGPD; Ley General de Protección de Datos Personales de
   Brasil);
3. mantener la confidencialidad de la clave secreta y los tokens de acceso (Cláusula 13);
4. mantener actualizados los correos electrónicos del dueño de la cuenta y de las personas con
   acceso (Cláusula 23);
5. responder a nuestros avisos sobre abuso en el plazo indicado (Cláusula 18).

12.4. **Cómo detectamos un abuso.** No supervisamos el contenido de tus proyectos de forma continua.
Detectamos un abuso por lo que el servicio ya guarda o recibe: las alertas automáticas de seguridad
(Anexo II del Acuerdo, punto 10); los registros técnicos de la API, que indican cuándo se rechazó un
evento o una propiedad y por qué regla, sin el valor rechazado, y que desaparecen en 14 días; los
eventos guardados en el proyecto, consultados solo cuando sea necesario (Cláusula 7.2 del Acuerdo); los
datos de facturación de Stripe; el registro de prueba gratuita (Política de Privacidad, punto 2.7); y
lo que otra persona o una autoridad nos comunique. **El servicio no guarda la IP ni el navegador
completo, y no empieza a guardarlos para investigar un abuso.**

## Cláusula 13 — Personas con acceso, claves y tokens

13.1. **Personas con acceso.** La cuenta tiene hasta 3 personas con acceso al panel, contando al
dueño. El dueño invita a una persona mediante su correo electrónico, a uno o más proyectos
de la cuenta, en Configuración → Personas. La persona recibe un correo de invitación y entra en el panel
con un código enviado a su correo, sin contraseña. El dueño puede quitar a una persona en la misma
pantalla, en cualquier momento.

13.2. Las personas invitadas ven las cifras, la configuración y la lista de personas de los proyectos a
los que fueron invitadas, y gestionan sus propias sesiones, tokens, aplicaciones conectadas y resumen
semanal. Solo el dueño modifica proyectos, claves, personas y facturación, y solo él exporta
eventos o cierra la cuenta.

13.3. Cuando el dueño quita a una persona de un proyecto, el acceso de esa persona a ese
proyecto termina en el acto, incluido el acceso mediante los tokens de acceso que creó y las
aplicaciones que conectó. Lo que ya haya visto o llevado a otro programa mediante un token o una
aplicación conectada queda fuera de nuestro alcance. Su registro sigue la Política de Privacidad
(punto 2.1).

13.4. Eres responsable de mantener actualizada la lista de personas (por ejemplo, quitar a quien dejó
tu equipo) y de lo que las personas con acceso hacen en el servicio. Al invitar a una persona,
confirmas que sabe que recibirá correos de Pyxis (invitación, códigos de inicio de sesión y el resumen
semanal) y que conoce estos términos.

13.5. Cada persona ve y cierra sus propias sesiones en Configuración, incluido "cerrar sesión en todos
los dispositivos". Cerrar sesión en todos los dispositivos no revoca los tokens ni desconecta las
aplicaciones: cada uno se revoca en su propia lista (Cláusulas 13.8 y 13.10).

13.6. **Clave pública:** va en tu sitio y solo identifica el proyecto. El servicio solo acepta eventos
con esa clave procedentes de las direcciones registradas en el proyecto. El dueño cambia la clave
pública en Configuración.

13.7. **Clave secreta:** solo es necesaria si vas a usar las rutas de eliminación y de copia de datos.
El dueño la crea en Configuración, y aparece una única vez. Guárdala solo en tu servidor, nunca en
el navegador ni en un repositorio de código. Nosotros la guardamos solo como hash: si la pierdes,
revócala y crea otra.

13.8. **Tokens de acceso:** solo leen las cifras del panel y son válidos durante 30, 90 o 365 días.
Quien crea un token es responsable de guardarlo y puede revocarlo en cualquier momento en
Configuración. Los datos que lee un token van al programa en el que se usó (por ejemplo, una
herramienta de inteligencia artificial con el servidor MCP, en tu computadora o mediante la dirección
de la Cláusula 4.4, punto 3); **la elección y el uso de esa herramienta son responsabilidad tuya**.

13.9. Si una clave se filtra, el dueño la revoca y crea otra en el acto, en Configuración; si no
puede, avísanos: revocamos la clave en un plazo de 1 día hábil. Un token filtrado puede revocarlo en el
acto, en Configuración, quien lo creó. Si encontramos una clave secreta o un token publicados, los
revocamos en el acto, para protegerte, aunque no haya abuso, y avisamos a continuación (Cláusula 18.4,
punto 4).

13.10. **Aplicaciones conectadas (conector de Claude).**

1. **Qué aplicaciones.** Actualmente, solo **Claude** y **Claude Code**, de Anthropic, se conectan a
   Pyxis sin token, mediante la dirección `https://api.pyxis-analytics.dev/mcp`. Reconocemos cada una
   por el documento de identificación que publica Anthropic y no aceptamos otras aplicaciones por ese
   camino. Otros programas usan la misma dirección con un token de acceso (Cláusula 13.8).
2. **Quién conecta.** Cualquier persona con acceso, en nombre propio. Cuando la aplicación pide la
   conexión, la persona entra en el panel y ve, en una página de Pyxis, la aplicación, adónde vuelve la
   respuesta (con un aviso cuando va a un programa en su propia computadora), lo que podrá leer y la
   lista de los proyectos. La conexión solo existe si la persona elige **Permitir**; la solicitud es
   válida durante 10 minutos.
3. **Qué lee la aplicación.** **Solo lee**, y solo lo que esa persona ve en el panel, de todos los
   proyectos que puede abrir: las cifras, las listas de visitas y la línea de tiempo de cada visita,
   con el identificador interno que tu sitio envió mediante la función `identify`, y el correo de
   acceso de la propia persona. Nunca modifica nada y nunca lee claves secretas, tokens, sesiones, la
   lista de personas con acceso ni la facturación.
4. **Adónde van los datos.** Los datos que pida la aplicación salen de Pyxis hacia **Anthropic**, en
   los Estados Unidos: en Claude, directamente a sus servidores; en Claude Code, primero a la
   computadora de la persona y desde allí a Anthropic. La página de consentimiento lo advierte antes de
   **Permitir**. **Anthropic no es proveedora nuestra ni suboperadora (subencargada del tratamiento)
   nuestra**: quien elige conectar es la persona con acceso, y Anthropic trata esos datos según los
   términos y la política de privacidad vigentes entre ella y quien usa Claude. **La elección y el uso
   de esa aplicación son responsabilidad tuya**, como en la Cláusula 13.8.
5. **Cuánto dura.** La conexión usa credenciales que la aplicación renueva sola (la de acceso es
   válida durante 1 hora) y que guardamos solo como hash. Termina cuando la persona la revoca en
   Configuración → Aplicaciones conectadas; después de 90 días sin uso; cuando la persona pierde el
   acceso (Cláusula 13.3) o tiene el acceso suspendido (Cláusula 18.2); cuando la cuenta se borra
   (Cláusula 11.4); o sola, cuando una credencial ya sustituida vuelve a usarse, señal de que puede
   haber sido copiada. Después de eso, la aplicación pide conectarse de nuevo.
6. **Límites.** Hasta 10 aplicaciones conectadas al mismo tiempo por persona, y los límites de
   consultas por minuto del Anexo II del Acuerdo de Tratamiento de Datos.

## Cláusula 14 — Datos personales

14.1. Con respecto a los datos de los visitantes de tus sitios, **tú eres el controlador** y
**nosotros somos el operador** (Lei n.º 13.709/2018, la LGPD, art. 5.º, VI y VII). Las reglas
completas están en el **Anexo 1 — Acuerdo de Tratamiento de Datos Personales**, que forma parte de este
contrato: finalidad, instrucciones, seguridad, suboperadores, transferencia internacional, solicitudes
de titulares, incidentes, suspensión del tratamiento y eliminación.

14.2. Con respecto a tus datos y a los de las personas con acceso (correos electrónicos, cuenta,
aceptación de estos términos, sesiones, aplicaciones conectadas, facturación, prevención de prueba
repetida y soporte), **nosotros somos el controlador**, como explica el **Anexo 2 — Política de
Privacidad de Pyxis**.

## Cláusula 15 — Disponibilidad, interrupciones y cambios en el servicio

15.1. **Atención: no hay garantía de disponibilidad (SLA).** Hacemos nuestro mejor esfuerzo para
mantener el servicio en funcionamiento y corregir los fallos lo antes posible. El servicio lo opera una
sola persona y depende de proveedores (AWS, que también envía los correos electrónicos, Neon, Vercel y
Stripe); puede haber interrupciones.

15.2. **Mantenimiento.** Avisamos por correo electrónico, con antelación siempre que sea posible, de
los mantenimientos que puedan interrumpir el servicio, y los hacemos preferentemente fuera
del horario laboral.

15.3. **Interrupciones que no dependen de nosotros.** El servicio puede detenerse, total o
parcialmente, por fallo o suspensión de un proveedor, por un ataque de terceros al servicio o por caso
fortuito o fuerza mayor (Código Civil brasileño, art. 393). Trabajamos para restablecer el servicio lo
antes posible y, si la interrupción dura más de 24 horas, avisamos por correo electrónico.

15.4. **Orden legal.** Interrumpimos o limitamos el servicio, total o parcialmente, cuando una ley, una
orden judicial o una determinación de la ANPD (Agencia Nacional de Protección de Datos de Brasil) o de
otra autoridad competente lo exija (por ejemplo, el bloqueo de datos o la suspensión de un tratamiento,
LGPD, art. 52). Cumplimos solo lo exigido y te avisamos, salvo que la orden prohíba el aviso.

15.5. **Pausa por la cuota.** La pausa de la recepción de eventos al llegar al 150 % del límite
mensual sigue la Cláusula 7.2.

15.6. Si eres consumidor, siguen vigentes tus derechos del art. 20 del Código de Defesa do Consumidor:
ante un fallo del servicio, incluida una suspensión que resulte indebida (Cláusula 18.9), puedes pedir
que el servicio se vuelva a prestar, cuando proceda, la reducción proporcional del precio o la
devolución del importe pagado.

15.7. Podemos mejorar el servicio, cambiar pantallas y agregar funciones. Durante el periodo pagado, no
retiramos las funciones enumeradas en la Cláusula 7.1 ni empeoramos los compromisos de privacidad de la
Cláusula 4.2. Si un cambio de ese tipo es inevitable (por ejemplo, por ley o porque un proveedor dejó
de ofrecer algo), avisamos con 30 días de antelación, y puedes rescindir con devolución proporcional
del periodo pagado y no usado.

## Cláusula 16 — Soporte y atención

16.1. La atención es por correo electrónico, en hello@pyxis-analytics.dev, para dudas, reclamaciones,
soporte, impugnación de una suspensión, suspensión y cancelación.

16.2. Confirmamos la recepción de tu mensaje por el mismo correo y respondemos en un plazo de **2 días
hábiles** (días hábiles de lunes a viernes, excepto feriados nacionales de Brasil).

16.3. El soporte cubre el uso del servicio alojado y la instalación del rastreador. No incluye
desarrollo en tu sitio ni soporte a instalaciones propias del código abierto.

16.4. En los mensajes, no envíes datos personales de visitantes. Para mostrar un caso, usa el
identificador de la visita o del usuario.

## Cláusula 17 — Propiedad intelectual y tus datos

17.1. **Los datos de tus proyectos son tuyos.** Los tratamos solo para prestar el servicio, como indica
el Acuerdo de Tratamiento de Datos. No los vendemos, no los usamos para publicidad y no los usamos para
entrenar modelos de inteligencia artificial.

17.2. El código de Pyxis se rige por la licencia MIT (Cláusula 5). El nombre Pyxis, el logotipo y la
identidad visual son nuestros; no puedes usarlos de forma que sugiera que tu producto es nuestro o que
tenemos una alianza, sin nuestra autorización.

17.3. Si nos envías sugerencias, podemos usarlas libremente para mejorar Pyxis, sin obligación alguna
contigo.

## Cláusula 18 — Abuso: suspensión y rescisión por nuestra parte

18.1. **Principios.** Ante un abuso (Cláusula 12.1), actuamos con base en hechos que podamos mostrarte,
de forma proporcional a la gravedad y solo sobre la parte del servicio afectada. Una medida más fuerte
solo se usa cuando la más leve no basta, y toda medida viene con el motivo por escrito.

18.2. **Medidas posibles**, de la más leve a la más fuerte:

1. aviso por correo electrónico, con plazo para corregir;
2. suspensión parcial: revocar una clave, un token o la conexión de una aplicación; pausar la
   recepción de eventos de un proyecto;
   suspender el acceso de una persona al panel;
3. suspensión de toda la cuenta: recepción de eventos de todos los proyectos, panel, claves, tokens y
   aplicaciones conectadas;
4. rescisión del contrato (Cláusula 18.7).

18.3. **Aviso y plazo para corregir.** Fuera de los casos de la Cláusula 18.4, antes de suspender
avisamos al dueño de la cuenta por correo electrónico, indicando lo que vimos, qué regla se
incumplió, qué debe hacerse y qué medida tomaremos si no se corrige, y damos **5 días hábiles** para
corregir o explicar. Si corriges dentro del plazo, no se suspende nada.

18.4. **Atención: suspensión inmediata.** Podemos suspender sin aviso previo solo en estos casos, y
solo en la medida necesaria para contener el problema:

1. ataque al servicio o a otros clientes, o tráfico falsificado o automatizado que amenace la
   estabilidad del servicio (Cláusula 12.1, puntos 7, 10 y 11);
2. envío de datos personales sensibles en los eventos, o de datos personales directos de forma que
   exponga a los visitantes a un riesgo relevante (Cláusula 12.1, puntos 1 a 3);
3. actividad o contenido aparentemente ilegal (Cláusula 12.1, punto 16);
4. clave secreta o token publicados, por cualquier motivo, incluso accidental (Cláusula 13.9): la
   medida consiste solo en revocarlos, para protegerte a ti y a los titulares;
5. indicio objetivo de fraude en el pago, como una tarjeta usada sin autorización de su titular o datos
   de facturación falsos (Cláusula 12.1, punto 15);
6. riesgo concreto e inmediato para otros clientes, para los titulares de los datos o para la
   infraestructura;
7. ley, orden judicial o determinación de autoridad competente (Cláusula 15.4).

En esos casos, avisamos al dueño de la cuenta por correo electrónico **en un plazo de 1 día
hábil** después de la suspensión, indicando el motivo, qué se suspendió, qué hacer para volver y cómo
impugnar, salvo que una ley o una orden prohíba el aviso.

18.5. **Duración y restablecimiento.** La suspensión dura solo lo necesario. Cuando el problema se
corrija o la impugnación sea aceptada, restablecemos íntegramente, en un plazo de 1 día hábil, lo que se
suspendió. Las claves, los tokens y las conexiones revocados no vuelven: creas claves y tokens nuevos en
el panel y vuelves a conectar la aplicación.

18.6. **Derecho de respuesta e impugnación.** Puedes responder a cualquier aviso e impugnar cualquier
medida por correo electrónico a hello@pyxis-analytics.dev, desde el correo del dueño de la
cuenta, en un plazo de **10 días hábiles** desde el aviso, enviando tu explicación y las pruebas que
tengas. Confirmamos la recepción por la misma vía y respondemos con la decisión fundamentada en un
plazo de **5 días**; en una suspensión inmediata, examinamos la impugnación con prioridad. Este canal no
sustituye ni condiciona tu derecho a acudir al Procon (órgano estatal brasileño de defensa del
consumidor), a los demás órganos de defensa del consumidor o a la Justicia.

18.7. **Rescisión por abuso.** Podemos rescindir el contrato, por correo electrónico y con el motivo,
solo después de darte la oportunidad de responder (Cláusula 18.6), salvo que una ley o una orden lo
impida y salvo la prueba gratuita repetida, que sigue los plazos propios de la Cláusula 18.11, y solo
cuando:

1. el abuso sea **grave**: ataque deliberado al servicio o a otros clientes; fraude en el pago;
   actividad o contenido ilegal; envío deliberado de datos personales sensibles; o intento deliberado
   de eludir la barrera de datos personales o el respeto a quien pidió no ser medido;
2. el mismo abuso se **repita** después de corregido, en un plazo de 12 meses desde el primer aviso; o
3. el abuso **no se corrija** en un plazo de 30 días desde una suspensión.

La rescisión tiene los efectos de la Cláusula 11.6, puntos 1 a 4: la suscripción se cancela, las claves
se revocan, el panel queda disponible para consulta y exportación durante 30 días, salvo impedimento
legal, y los datos se borran después (Cláusula 11.4).

18.8. **Datos durante la suspensión y después de la rescisión.**

1. Durante la suspensión, los datos ya guardados siguen guardados y protegidos, el borrado de los
   eventos con más de 13 meses continúa, y no se recibe ningún evento nuevo en la parte suspendida.
2. Sigues pudiendo exportar los eventos (Cláusula 11.5), salvo cuando el propio acceso sea el riesgo
   (por ejemplo, un ataque hecho desde la cuenta) o una ley u orden lo impida; en ese caso, entregamos
   la copia a petición en cuanto cese el impedimento, y la eliminación espera a esa entrega.
3. Después de la rescisión, se aplican las Cláusulas 11.4 y 11.5: 30 días para exportar, salvo
   impedimento legal, y eliminación a continuación.
4. Si una ley, una orden judicial o un requerimiento de autoridad competente obliga a preservar datos,
   o si son necesarios para un proceso judicial, administrativo o arbitral, preservamos solo esos datos,
   sin otro uso, durante el tiempo exigido, y después los borramos (Cláusula 12.6 del Anexo 1).
5. Para investigar un abuso, usamos solo lo que el servicio ya guarda (Cláusula 12.4).

18.9. **Cobro durante la suspensión.** Una suspensión parcial no cambia el cobro. Si una suspensión
resulta indebida, devolvemos el importe proporcional a los días en que la cuenta estuvo suspendida,
además de tus derechos de la Cláusula 15.6.

18.10. **Reembolso en la rescisión por abuso.**

1. Devolvemos el importe proporcional al periodo pagado y no usado, contado desde el inicio de la
   suspensión de toda la cuenta o, si no la hubo, desde la rescisión. Si la rescisión ocurre dentro de
   los 7 días de la Cláusula 10, devolvemos el importe íntegro del primer cobro.
2. No devolvemos el periodo ya usado hasta la suspensión de toda la cuenta, ni importes que ya te hayan
   sido devueltos por reembolso o por una disputa aceptada por el emisor de la tarjeta.
3. **Atención: solo si no eres consumidor**, podemos descontar de ese importe los perjuicios que el
   abuso nos haya causado de forma comprobada, mostrando por escrito el cálculo (Código Civil, arts. 368
   y 369); lo que falte o sobre se resuelve conforme a la Cláusula 19.
4. El reembolso se hace, a través de Stripe, a la tarjeta usada en el pago, en un plazo de 5 días
   hábiles desde la rescisión.

18.11. **Prueba gratuita repetida.** Cuando el servicio indique que la tarjeta usada ya inició una
prueba gratuita en otra cuenta en los 12 meses anteriores (Política de Privacidad, punto 2.7), o haya
otro indicio objetivo de prueba repetida por la misma persona o empresa (Cláusula 6.4):

1. no ocurre nada automáticamente: el servicio solo registra la coincidencia y nos avisa; ningún cobro
   y ninguna cancelación;
2. examinamos el caso y, si es necesario, te preguntamos, con el plazo de la Cláusula 18.3. Una tarjeta
   de empresa usada por personas diferentes, o una agencia que contrata para clientes diferentes, no es
   una prueba repetida;
3. si confirmamos la prueba repetida, podemos cerrar la cuenta nueva antes del final de la prueba,
   cancelando la suscripción en Stripe sin ningún cobro, con aviso y el motivo; puedes impugnarlo
   (Cláusula 18.6) y puedes suscribirte sin prueba gratuita, por correo electrónico, con cobro a partir
   de la nueva suscripción;
4. **nunca cobramos nada antes de la fecha mostrada en la página de pago de Stripe**, ni acortamos la
   prueba para cobrar antes.

18.12. **Disputa de un cargo en la tarjeta.** Disputar un cargo ante el emisor de la tarjeta es tu
derecho; te pedimos que hables con nosotros antes (Cláusulas 10 y 16). Si la disputa es aceptada y el
importe te es devuelto, el periodo disputado queda sin pagar y podemos tratarlo como falta de pago,
cancelando la suscripción con aviso (Cláusula 9.2). Solo la disputa de mala fe (Cláusula 12.1,
punto 15) se trata como abuso.

18.13. **Rescisión sin abuso.** Fuera del abuso, solo rescindimos el contrato en los casos de las
Cláusulas 6.2 (fin de una gratuidad), 20 (fin del servicio alojado), 21.3 (cambio exigido por ley que
no aceptes) y 22.1 (cesión que no aceptes), y siempre devolvemos el importe proporcional al periodo
pagado y no usado; los datos siguen las Cláusulas 11.4 y 11.5.

## Cláusula 19 — Responsabilidad

19.1. Somos responsables de prestar el servicio como se describe en estos términos, con diligencia, y de
cumplir el Acuerdo de Tratamiento de Datos.

19.2. El servicio muestra estadísticas de uso. No garantizamos resultados de negocio a partir de ellas,
y las decisiones que tomes con base en las cifras son tuyas.

19.3. **Si eres consumidor**, nada de estos términos limita los derechos que te garantiza el Código de
Defesa do Consumidor, incluido el de reparación de los daños causados por un fallo del servicio.

19.4. **Atención: límite de responsabilidad para quien no es consumidor.** Si contratas el servicio
para tu actividad profesional o empresarial, fuera de una relación de consumo, y, en las situaciones
justificables admitidas por el art. 51, I, del Código de Defesa do Consumidor, si eres un consumidor
persona jurídica:

1. nuestra responsabilidad total por daños relacionados con este contrato queda limitada al importe que
   nos pagaste en los 12 meses anteriores al hecho que causó el daño;
2. no respondemos del lucro cesante, la pérdida de oportunidad de negocio ni otros daños indirectos.

Este límite tiene en cuenta el precio bajo del plan y el tamaño del servicio, operado por una sola
persona. **No se aplica** a los daños causados por dolo o culpa grave nuestra, ni a las obligaciones que
la ley no permite limitar, ni reduce los derechos de los titulares de los datos frente a nosotros
(LGPD, art. 42).

19.5. Respondes de los daños que nos causes a nosotros o a terceros por incumplir estos términos, por
ejemplo al enviar datos personales en los eventos, al dejar de informar de la medición a los visitantes
de tu sitio o por otro abuso de la Cláusula 12.1.

19.6. Ninguna de las partes responde de retrasos o fallos causados por caso fortuito o fuerza mayor
(Código Civil, art. 393).

## Cláusula 20 — Fin del servicio alojado

20.1. Si decidimos poner fin al servicio alojado, avisamos por correo electrónico con al menos
**30 días de antelación**.

20.2. En ese caso, devolvemos el importe proporcional al periodo pagado y no usado, mantenemos la
exportación de los eventos (Cláusula 11.5) hasta el fin del servicio y borramos los datos conforme a la
Cláusula 12 del Anexo 1.

20.3. Como el código es abierto, puedes seguir usando Pyxis en tu propia infraestructura.

## Cláusula 21 — Cambios en estos términos

21.1. Podemos cambiar estos términos. Avisamos por correo electrónico con **al menos 30 días de
antelación**, explicando lo que cambia, y publicamos la nueva versión con la fecha de entrada en vigor.
Las versiones anteriores están disponibles a petición.

21.2. **Los cambios que reduzcan tus derechos o aumenten tus obligaciones solo se te aplican a partir
de tu próxima renovación después de ese plazo.** Si no estás de acuerdo, cancela antes de la
renovación, sin coste.

21.3. Los cambios que solo mejoren el servicio o aclaren el texto se aplican en la fecha indicada en el
aviso. Los cambios exigidos por ley, por decisión judicial o por la ANPD pueden aplicarse antes de la
renovación; si alguno de ellos no te resulta aceptable, puedes rescindir el contrato con devolución
proporcional del periodo pagado y no usado.

## Cláusula 22 — Cesión del contrato

22.1. Podemos transferir este contrato a una empresa constituida o controlada por {{seller.name}} (por
ejemplo, para que el servicio pase a prestarse con CNPJ, el registro fiscal brasileño de personas
jurídicas) o a quien asuma el servicio, manteniendo todas las condiciones de estos términos y del
Acuerdo de Tratamiento de Datos. Avisamos por correo electrónico con al menos 30 días de antelación; si
no estás de acuerdo, puedes rescindir el contrato con devolución proporcional del periodo pagado y no
usado.

22.2. No puedes transferir este contrato sin nuestro consentimiento por escrito.

## Cláusula 23 — Comunicaciones

23.1. Enviamos las comunicaciones de este contrato, incluidos los avisos de abuso y de suspensión, al
correo electrónico del dueño de la cuenta y, cuando el asunto sea el uso del panel por una
persona, la suspensión de su acceso o un incidente de seguridad, también a las personas con acceso
involucradas. Mantén esos correos actualizados.

23.2. Tus comunicaciones para nosotros van a hello@pyxis-analytics.dev.

## Cláusula 24 — Disposiciones generales

24.1. Si una cláusula se considera inválida, las demás siguen vigentes.

24.2. Si una de las partes deja de exigir un derecho, eso no significa que haya renunciado a él.

24.3. Este contrato no crea sociedad, relación laboral ni representación entre las partes.

24.4. Este contrato se celebra en portugués, por medios electrónicos, y vale como contrato escrito.

## Cláusula 25 — Ley aplicable y fuero

25.1. Este contrato se rige por la ley brasileña.

25.2. Antes de acudir a la Justicia, contáctanos en hello@pyxis-analytics.dev: queremos resolverlo.
Esto es una invitación, no una condición. Si eres consumidor, también puedes acudir al Procon y a los
demás órganos de defensa del consumidor.

25.3. **Si eres consumidor**, puedes presentar una demanda en el fuero de tu domicilio (Código de Defesa
do Consumidor, art. 101, I).

25.4. En los demás casos, se elige el fuero de la comarca de **Salvador/BA**, domicilio de quien presta
el servicio.

---

[Anexo 1 — Acuerdo de Tratamiento de Datos Personales](/es/dpa).

[Anexo 2 — Política de Privacidad de Pyxis](/es/privacy).
