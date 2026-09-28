/*
  LÓGICA DE LA PÁGINA
  -------------------
  Lee los datos de js/datos.js y los pinta en el HTML, usando las plantillas de js/plantillas.js.
  Aquí no hay textos del negocio: si quieres cambiar algo, cámbialo en datos.js.
  (Antes de publicar, "node construir.mjs" deja ese mismo contenido ya escrito en index.html
  para el SEO; esto sigue funcionando igual y lo mantiene al día mientras editas.)
*/

// Atajo para no escribir document.querySelector todo el rato
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

/* ---------- 1. Datos generales (nombre, teléfono, zona) ---------- */
function pintarConfig() {
  $$('[data-config="nombre"]').forEach((el) => (el.textContent = CONFIG.nombre));
  $$('[data-config="telefono"]').forEach((el) => (el.textContent = CONFIG.telefono));
  $$('[data-config="telefono-enlace"]').forEach(
    (el) => (el.href = `tel:+${CONFIG.telefonoInternacional}`)
  );
  $$('[data-config="whatsapp-enlace"]').forEach(
    (el) => (el.href = `https://wa.me/${CONFIG.telefonoInternacional}`)
  );
  $$('[data-config="lineaServicios"]').forEach((el) => (el.textContent = textoLineaServicios(CONFIG)));
  $$('[data-config="tiempoRespuesta"]').forEach((el) => (el.textContent = CONFIG.tiempoRespuesta));
  $$('[data-config="notaPrecios"]').forEach((el) => (el.textContent = CONFIG.notaPrecios));
  $$('[data-config="zona"]').forEach((el) => (el.textContent = CONFIG.zona));
  $("#anio").textContent = new Date().getFullYear();
}

/* ---------- 2. Opciones de servicio dentro del parte ---------- */
function pintarOpcionesServicio() {
  $("#opciones-servicio").innerHTML = htmlOpcionesServicio(SERVICIOS);
}

/* ---------- 2b. Consejos junto al formulario ---------- */
function pintarConsejos() {
  $("#lista-consejos").innerHTML = htmlConsejos(CONSEJOS);
}

/* ---------- 3. Lista de servicios con precios ---------- */
function pintarServicios() {
  $("#lista-servicios").innerHTML = htmlServicios(SERVICIOS);

  // Al pulsar "Pedir presupuesto", marca ese servicio en el parte y sube hasta él
  $$(".servicio__pedir").forEach((boton) => {
    boton.addEventListener("click", () => {
      const radio = $(`input[name="servicio"][value="${boton.dataset.servicio}"]`);
      radio.checked = true;
      $("#parte").scrollIntoView({ behavior: "smooth", block: "start" });
      $("#descripcion").focus({ preventScroll: true });
    });
  });
}

/* ---------- 4. Horario ---------- */
function pintarHorario() {
  $("#horario").innerHTML = htmlHorario(HORARIO);
}

/* ---------- 4b. Trabajos hechos ---------- */
function pintarTrabajos() {
  if (!TRABAJOS.length) return ocultarSeccion("trabajos");
  $("#lista-trabajos").innerHTML = htmlTrabajos(TRABAJOS);
}

/* ---------- 4b2. Confianza y habilitaciones ---------- */
function pintarConfianza() {
  $("#lista-confianza").innerHTML = htmlConfianza(CONFIANZA);

  if (HABILITACIONES.length) {
    const lista = $("#lista-habilitaciones");
    lista.innerHTML = htmlHabilitaciones(HABILITACIONES);
    lista.hidden = false;
  }
}

/* ---------- 4c. Quiénes somos ---------- */
function pintarSobre() {
  $("#sobre-titulo").textContent = SOBRE.titulo;
  $("#sobre-texto").innerHTML = htmlSobreTexto(SOBRE);
  $("#sobre-datos").innerHTML = htmlSobreDatos(SOBRE);
  if (SOBRE.foto) {
    $("#sobre-foto").style.backgroundImage = `url("${SOBRE.foto}")`;
  } else {
    $("#sobre-foto").classList.add("sobre__foto--vacia");
  }
}

/* ---------- 4d. Opiniones ---------- */
function pintarOpiniones() {
  if (!OPINIONES.length) return ocultarSeccion("opiniones");
  if (CONFIG.googleOpinionesUrl) {
    const mas = $("#opiniones-google");
    mas.querySelector("a").href = CONFIG.googleOpinionesUrl;
    mas.hidden = false;
  }
  $("#lista-opiniones").innerHTML = htmlOpiniones(OPINIONES);
}

/* ---------- 4e. Preguntas frecuentes ---------- */
function pintarPreguntas() {
  $("#lista-preguntas").innerHTML = htmlPreguntas(FAQ);
}

// Sirve para las preguntas frecuentes y para el "Ver detalle" de las tarjetas de confianza.
// <details> abre y cierra de golpe por defecto. Aquí animamos la altura con la Web Animations API:
// al abrir, el navegador ya lo tiene "open" y solo estiramos; al cerrar, animamos y luego quitamos "open".
function animarDesplegables() {
  const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const duracion = 300;
  const opciones = { duration: duracion, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" };

  $$(".pregunta, .confia__mas").forEach((detalle) => {
    const resumen = detalle.querySelector("summary");
    let animacion = null;

    const terminar = (abierto) => {
      detalle.open = abierto;
      detalle.classList.remove("pregunta--cerrando");
      detalle.style.height = detalle.style.overflow = "";
      animacion = null;
    };

    const animar = (desde, hasta, abierto) => {
      if (animacion) animacion.cancel();
      detalle.style.overflow = "hidden";
      animacion = detalle.animate({ height: [`${desde}px`, `${hasta}px`] }, opciones);
      animacion.onfinish = () => terminar(abierto);
      animacion.oncancel = () => (animacion = null);
    };

    resumen.addEventListener("click", (evento) => {
      evento.preventDefault();
      if (reducido) return void (detalle.open = !detalle.open);

      const altoActual = detalle.offsetHeight;
      if (detalle.open && !detalle.classList.contains("pregunta--cerrando")) {
        // Cerrar: de la altura actual a la del resumen
        detalle.classList.add("pregunta--cerrando"); // gira el "+" ya, sin esperar
        animar(altoActual, resumen.offsetHeight, false);
      } else {
        // Abrir: se abre ya y se estira desde el resumen hasta su altura completa
        detalle.classList.remove("pregunta--cerrando");
        detalle.open = true;
        const altoFinal = detalle.offsetHeight; // ya abierto: su altura natural, con el texto entero
        animar(Math.min(altoActual, altoFinal), altoFinal, true);
      }
    });
  });
}

// Si no hay datos para una sección, la quitamos de la página y del menú
function ocultarSeccion(id) {
  const seccion = document.getElementById(id);
  if (seccion) seccion.hidden = true;
  $$(`[data-seccion="${id}"]`).forEach((el) => (el.hidden = true));
}

/* ---------- 5. Número del parte ---------- */
// Solo es decorativo por ahora; cuando haya base de datos, será el id real de la solicitud.
function numeroDeParte() {
  const hoy = new Date();
  const dia = String(hoy.getDate()).padStart(2, "0");
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const aleatorio = String(Math.floor(Math.random() * 100)).padStart(2, "0");
  $("#parte-numero").textContent = `${dia}${mes}-${aleatorio}`;
}

/* ---------- 6. Enviar el parte por WhatsApp ---------- */
function prepararFormulario() {
  const form = $("#parte");
  const error = $("#parte-error");

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const datos = new FormData(form);
    const servicioId = datos.get("servicio");
    const descripcion = (datos.get("descripcion") || "").trim();
    const nombre = (datos.get("nombre") || "").trim();
    const localidad = (datos.get("localidad") || "").trim();
    const urgencia = datos.get("urgencia");

    // Validación mínima: sin servicio o sin descripción no se puede dar precio
    const faltan = [];
    if (!servicioId) faltan.push("elige de qué se trata");
    if (!descripcion) faltan.push("cuéntanos qué pasa");

    if (faltan.length) {
      error.textContent = `Para darte precio necesitamos que ${faltan.join(" y ")}.`;
      error.hidden = false;
      return;
    }
    error.hidden = true;

    const servicio = SERVICIOS.find((s) => s.id === servicioId);

    const mensaje = [
      `Hola, soy ${nombre || "un cliente"}${localidad ? ` de ${localidad}` : ""}.`,
      `Parte ${$("#parte-numero").textContent}`,
      `Servicio: ${servicio.nombre}`,
      `Para cuándo: ${urgencia}`,
      "",
      descripcion,
    ].join("\n");

    const url = `https://wa.me/${CONFIG.telefonoInternacional}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank", "noopener");
  });
}

/* ---------- 7. Cabecera: transparente sobre la foto, sólida al bajar ---------- */
function prepararCabecera() {
  const cabecera = $(".cabecera");
  const actualizar = () =>
    cabecera.classList.toggle("cabecera--solida", window.scrollY > 40);
  window.addEventListener("scroll", actualizar, { passive: true });
  actualizar();
}

/* ---------- 8. Menú de móvil ---------- */
function prepararMenu() {
  const cabecera = $(".cabecera");
  const boton = $("#hamburguesa");
  const cerrar = () => {
    cabecera.classList.remove("cabecera--menu");
    boton.setAttribute("aria-expanded", "false");
    boton.setAttribute("aria-label", "Abrir menú");
  };
  boton.addEventListener("click", () => {
    const abrir = !cabecera.classList.contains("cabecera--menu");
    cabecera.classList.toggle("cabecera--menu", abrir);
    boton.setAttribute("aria-expanded", String(abrir));
    boton.setAttribute("aria-label", abrir ? "Cerrar menú" : "Abrir menú");
  });
  // Se cierra al elegir una sección, con Escape, al tocar fuera del menú
  // y al pasar a una pantalla ancha (donde el menú ya va en la cabecera)
  $$("#menu a").forEach((a) => a.addEventListener("click", cerrar));
  document.addEventListener("keydown", (e) => e.key === "Escape" && cerrar());
  document.addEventListener("click", (e) => {
    if (!cabecera.contains(e.target)) cerrar();
  });
  window.matchMedia("(min-width: 60.01rem)").addEventListener("change", cerrar);
}

/* ---------- 8b. WhatsApp flotante: se esconde mientras se ve el formulario ---------- */
// El formulario ya envía por WhatsApp; el botón flotante estaría encima de los campos.
function prepararWhatsappFlotante() {
  const boton = $(".whatsapp-flotante");
  const parte = $("#parte");
  if (!boton || !parte || !("IntersectionObserver" in window)) return;
  new IntersectionObserver(
    ([entrada]) => boton.classList.toggle("whatsapp-flotante--oculto", entrada.isIntersecting),
    { threshold: 0.15 }
  ).observe(parte);
}

/* ---------- 9. Animación de aparición al hacer scroll ---------- */
// Los elementos con .revela empiezan ocultos (solo si hay JS, ver estilos.css)
// y reciben .revela--visto al entrar en pantalla. --i escalona la entrada de las tarjetas.
function prepararAnimaciones() {
  const elementos = $$(".revela");
  elementos.forEach((el) => {
    const hermanos = [...el.parentElement.children].filter((h) => h.classList.contains("revela"));
    el.style.setProperty("--i", hermanos.indexOf(el));
  });

  if (!("IntersectionObserver" in window)) {
    elementos.forEach((el) => el.classList.add("revela--visto"));
    return;
  }

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add("revela--visto");
        observador.unobserve(entrada.target);
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
  );
  elementos.forEach((el) => observador.observe(el));
}

/* ---------- Arranque ---------- */
prepararCabecera();
pintarConfig();
pintarOpcionesServicio();
pintarConsejos();
pintarServicios();
pintarHorario();
pintarConfianza();
pintarTrabajos();
pintarSobre();
pintarOpiniones();
pintarPreguntas();
animarDesplegables();
numeroDeParte();
prepararFormulario();
prepararMenu();
prepararWhatsappFlotante();
// Las animaciones van al final: hay que esperar a que todas las tarjetas existan
prepararAnimaciones();
