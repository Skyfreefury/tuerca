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
      // Repite el meneo del aviso aunque ya estuviera a la vista (ver .parte__error en estilos.css)
      error.style.animation = "none";
      void error.offsetWidth;
      error.style.animation = "";
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

/* ---------- 7a. La tuerca en 3D de la portada ---------- */
// Monta las caras de un prisma hexagonal (ver .tuerca3d en estilos.css), las ilumina y la mueve:
// - al cargar llega girando desde lejos y se aprieta en su sitio con un pequeño rebote;
// - con el scroll se afloja (gira) y baja más despacio que la página;
// - en escritorio se inclina un poco hacia el ratón.
// Todo se dibuja en un único requestAnimationFrame que se para solo cuando no hay nada que mover.
function prepararTuerca3d() {
  const caja = $(".portada__tuerca");
  const pieza = $(".tuerca3d");
  if (!caja || !pieza || !window.DOMMatrix) return;
  const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1. Las caras. Medidas relativas al ancho S: radio del hexágono S/2, agujero 0,44 · S/2.
  const S = caja.offsetWidth;
  const R = S / 2;
  const apotema = R * Math.cos(Math.PI / 6);
  const grosor = S * 0.21;
  const radioAgujero = R * 0.44;
  const tiras = 18;
  const caras = [];
  const cara = (clase, transform, tipo) => {
    const el = document.createElement("div");
    el.className = clase;
    el.style.transform = transform;
    pieza.append(el);
    // La normal de la cara (hacia dónde mira), calculada con la misma matriz que usa el navegador
    const m = new DOMMatrix(transform);
    const a = m.transformPoint(new DOMPoint(0, 0, 0));
    const b = m.transformPoint(new DOMPoint(0, 0, 1));
    caras.push({ el, tipo, n: [b.x - a.x, b.y - a.y, b.z - a.z] });
  };
  cara("tuerca3d__cara", `translateZ(${grosor / 2}px)`, "metal");
  cara("tuerca3d__cara", `rotateY(180deg) translateZ(${grosor / 2}px)`, "metal");
  for (let i = 0; i < 6; i++) {
    cara("tuerca3d__lado", `rotateZ(${30 + i * 60}deg) translateY(${-apotema}px) rotateX(90deg)`, "metal");
  }
  pieza.style.setProperty("--w", `${((2 * Math.PI * radioAgujero) / tiras) * 1.08}px`);
  for (let i = 0; i < tiras; i++) {
    cara("tuerca3d__rosca", `rotateZ(${(i * 360) / tiras}deg) translateY(${-radioAgujero}px) rotateX(-90deg)`, "rosca");
  }

  // 2. La luz: viene de arriba a la izquierda y un poco de delante (x derecha, y abajo, z hacia ti)
  const luz = (() => {
    const v = [-0.5, -0.75, 0.9];
    const l = Math.hypot(...v);
    return v.map((c) => c / l);
  })();
  const amarillo = [246, 201, 69];
  const oscuro = [58, 44, 12];
  const roscaClara = [120, 98, 40];
  const roscaOscura = [12, 18, 28];
  const mezcla = (a, b, t) => a.map((c, i) => Math.round(c + (b[i] - c) * t));

  // 3. El estado y el dibujo
  const reposo = { rx: -22, ry: 28, rz: 0 };
  const estado = { rx: reposo.rx, ry: reposo.ry, rz: 0, escala: 1, opacidad: 1 };
  const raton = { x: 0, y: 0, ax: 0, ay: 0 }; // destino y valor actual (suavizado)
  let scrollGiro = 0;
  let inicioEntrada = reducido ? null : performance.now();
  const DURACION = 1800;

  const dibujar = () => {
    const rx = estado.rx + raton.ay;
    const ry = estado.ry + raton.ax;
    const rz = estado.rz + scrollGiro;
    pieza.style.setProperty("--rx", `${rx}deg`);
    pieza.style.setProperty("--ry", `${ry}deg`);
    pieza.style.setProperty("--rz", `${rz}deg`);
    caja.style.setProperty("--escala", estado.escala);
    caja.style.setProperty("--opacidad", estado.opacidad);

    const giro = new DOMMatrix(`rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`);
    for (const c of caras) {
      const p = giro.transformPoint(new DOMPoint(c.n[0], c.n[1], c.n[2]));
      const d = p.x * luz[0] + p.y * luz[1] + p.z * luz[2];
      const difusa = Math.max(0, d);
      let color;
      if (c.tipo === "metal") {
        color = mezcla(oscuro, amarillo, 0.3 + 0.7 * difusa);
        color = mezcla(color, [255, 250, 230], Math.pow(difusa, 12) * 0.6); // brillo metálico
      } else {
        // La rosca recibe la luz de dentro hacia fuera: más apagada
        color = mezcla(roscaOscura, roscaClara, 0.15 + 0.85 * Math.max(0, -d) * 0.8 + difusa * 0.4);
      }
      c.el.style.setProperty("--c", `rgb(${color.join(",")})`);
    }
  };

  // Curvas: la entrada se frena al final (salida cúbica) y el giro se pasa un poco y vuelve (el "clic")
  const salida = (t) => 1 - Math.pow(1 - t, 3);
  const rebote = (t) => {
    const k = 1.6;
    return 1 + (k + 1) * Math.pow(t - 1, 3) + k * Math.pow(t - 1, 2);
  };

  let pedido = false;
  const fotograma = (ahora) => {
    pedido = false;
    let seguir = false;

    if (inicioEntrada !== null) {
      const t = Math.min((ahora - inicioEntrada) / DURACION, 1);
      const e = salida(t);
      estado.rx = -75 + (reposo.rx + 75) * e;
      estado.ry = 160 + (reposo.ry - 160) * e;
      estado.rz = -540 * (1 - rebote(t));
      estado.escala = 0.35 + 0.65 * salida(Math.min(t * 1.4, 1));
      estado.opacidad = Math.min(t * 4, 1);
      if (t < 1) seguir = true;
      else inicioEntrada = null;
    }

    // El ratón: se acerca un 12 % del camino en cada fotograma
    raton.ax += (raton.x - raton.ax) * 0.12;
    raton.ay += (raton.y - raton.ay) * 0.12;
    if (Math.abs(raton.x - raton.ax) > 0.05 || Math.abs(raton.y - raton.ay) > 0.05) seguir = true;

    dibujar();
    if (seguir) pedir();
  };
  const pedir = () => {
    if (pedido) return;
    pedido = true;
    requestAnimationFrame(fotograma);
  };

  dibujar();
  if (reducido) return; // quieta, en su postura de reposo, ya iluminada

  pedir();

  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      if (y > window.innerHeight * 1.5) return; // pasada la portada no se ve
      scrollGiro = y * -0.3; // se afloja: gira al revés que al apretarla
      caja.style.setProperty("--baja", `${y * 0.35}px`);
      pedir();
    },
    { passive: true }
  );

  // Inclinación hacia el ratón, solo con ratón de verdad (no en pantallas táctiles)
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    $(".portada").addEventListener("pointermove", (e) => {
      raton.x = (e.clientX / window.innerWidth - 0.5) * 24;
      raton.y = -(e.clientY / window.innerHeight - 0.5) * 18;
      pedir();
    });
    $(".portada").addEventListener("pointerleave", () => {
      raton.x = raton.y = 0;
      pedir();
    });
  }
}

/* ---------- 7b. La tuerca del logo gira con el scroll ---------- */
// Un cuarto de grado por píxel: una vuelta entera cada 1440 px. Solo se toca una variable CSS
// y una vez por fotograma (requestAnimationFrame), así el scroll no se resiente.
function prepararTuerca() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const icono = $(".marca__icono");
  if (!icono) return;
  let pendiente = false;
  const girar = () => {
    icono.style.setProperty("--giro", `${(window.scrollY * 0.25) % 360}deg`);
    pendiente = false;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(girar);
    },
    { passive: true }
  );
  girar();
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

/* ---------- 10. Cifras que cuentan hacia arriba ---------- */
// "10+", "500+", "24 h": se anima solo el número del principio y se deja el resto tal cual.
// El texto final ya está en el HTML (lo ven Google y quien no tenga JS); aquí solo se cuenta hasta él.
function prepararContadores() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!("IntersectionObserver" in window)) return;

  const contar = (el) => {
    const final = el.textContent;
    const partes = final.match(/^(\d+)(.*)$/s);
    if (!partes) return;
    const objetivo = Number(partes[1]);
    const resto = partes[2];
    const duracion = 1200;
    // Se fija el ancho para que el texto de al lado no baile mientras cambian las cifras
    el.style.minWidth = `${el.offsetWidth}px`;
    const inicio = performance.now();
    const paso = (ahora) => {
      const t = Math.min((ahora - inicio) / duracion, 1);
      const suave = 1 - Math.pow(1 - t, 3); // ease-out cúbico: rápido al principio, se posa al final
      el.textContent = `${Math.round(objetivo * suave)}${resto}`;
      if (t < 1) requestAnimationFrame(paso);
      else {
        el.textContent = final;
        el.style.minWidth = "";
      }
    };
    requestAnimationFrame(paso);
  };

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        contar(entrada.target);
        observador.unobserve(entrada.target);
      });
    },
    { threshold: 0.6 }
  );
  $$(".sobre__datos dd").forEach((el) => observador.observe(el));
}

/* ---------- Arranque ---------- */
prepararCabecera();
prepararTuerca();
prepararTuerca3d();
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
prepararContadores();
