/*
  PLANTILLAS
  ----------
  Funciones que convierten los datos de datos.js en trozos de HTML. No tocan la página:
  solo devuelven texto. Las usan dos programas distintos:
    - js/main.js, en el navegador, para pintar la página.
    - construir.mjs, en tu ordenador, para dejar ese mismo HTML ya escrito dentro de index.html
      (así Google y las redes sociales ven el contenido sin tener que ejecutar JavaScript).
  Por eso aquí no puede haber nada de "document" ni "window".
*/

// Escapa texto antes de meterlo en HTML (cuando los datos vengan de una base de datos,
// nadie podrá colar HTML/scripts en la web).
const esc = (texto) =>
  String(texto ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// "Electricidad, fontanería y climatización en Valencia" (la ciudad solo si está rellena)
function textoLineaServicios(config) {
  return "Electricidad, fontanería y climatización" + (config.ciudad ? ` en ${config.ciudad}` : "");
}

function htmlOpcionesServicio(servicios) {
  return servicios
    .map(
      (s) => `
      <label class="opcion">
        <input type="radio" name="servicio" value="${esc(s.id)}">
        <span>${esc(s.nombre)}</span>
      </label>`
    )
    .join("");
}

function htmlConsejos(consejos) {
  return consejos.map((c) => `<li>${esc(c)}</li>`).join("");
}

function htmlServicios(servicios) {
  return servicios
    .map(
      (s) => `
      <article class="servicio revela" id="servicio-${esc(s.id)}">
        <div class="servicio__cabeza">
          <h3 class="servicio__nombre">${esc(s.nombre)}</h3>
          <p class="servicio__resumen">${esc(s.resumen)}</p>
        </div>
        <ul class="servicio__trabajos">
          ${s.trabajos.map((t) => `<li>${esc(t)}</li>`).join("")}
        </ul>
        <div class="servicio__precio">
          <span class="servicio__desde">desde</span>
          <span class="servicio__cifra">${esc(s.desde)}&nbsp;€</span>
        </div>
        <button type="button" class="servicio__pedir" data-servicio="${esc(s.id)}">
          Pedir presupuesto de ${esc(s.nombre.toLowerCase())}
        </button>
      </article>`
    )
    .join("");
}

function htmlHorario(horario) {
  return horario
    .map((h) => `<div class="horario__fila"><dt>${esc(h.dias)}</dt><dd>${esc(h.horas)}</dd></div>`)
    .join("");
}

function htmlTrabajos(trabajos) {
  return trabajos
    .map(
      (t) => `
      <figure class="trabajo revela">
        <div class="trabajo__foto ${t.foto ? "" : "trabajo__foto--vacia"}">
          ${t.foto ? `<img src="${esc(t.foto)}" alt="${esc(t.titulo)}" loading="lazy">` : "<span>Foto pendiente</span>"}
        </div>
        <figcaption>
          <strong>${esc(t.titulo)}</strong>
          <span>${esc(t.servicio)}</span>
        </figcaption>
      </figure>`
    )
    .join("");
}

function htmlConfianza(confianza) {
  return confianza
    .map(
      (c) => `
      <li class="confia revela">
        <h3>${esc(c.titulo)}</h3>
        <p>${esc(c.texto)}</p>
        ${
          c.detalle
            ? `<details class="confia__mas"><summary>Ver detalle</summary><p>${esc(c.detalle)}</p></details>`
            : ""
        }
      </li>`
    )
    .join("");
}

function htmlHabilitaciones(habilitaciones) {
  return habilitaciones.map((h) => `<li>${esc(h)}</li>`).join("");
}

function htmlSobreTexto(sobre) {
  return sobre.texto.map((p) => `<p>${esc(p)}</p>`).join("");
}

function htmlSobreDatos(sobre) {
  return sobre.datos.map((d) => `<div><dt>${esc(d.etiqueta)}</dt><dd>${esc(d.cifra)}</dd></div>`).join("");
}

function htmlOpiniones(opiniones) {
  return opiniones
    .map(
      (o) => `
      <blockquote class="opinion revela">
        <p class="opinion__estrellas" role="img" aria-label="${o.estrellas} de 5 estrellas">${"★".repeat(o.estrellas)}${"☆".repeat(5 - o.estrellas)}</p>
        <p class="opinion__texto">${esc(o.texto)}</p>
        <footer><strong>${esc(o.nombre)}</strong> · ${esc(o.lugar)}</footer>
      </blockquote>`
    )
    .join("");
}

function htmlPreguntas(faq) {
  return faq
    .map(
      (f) => `
      <details class="pregunta">
        <summary>${esc(f.pregunta)}</summary>
        <p>${esc(f.respuesta)}</p>
      </details>`
    )
    .join("");
}
