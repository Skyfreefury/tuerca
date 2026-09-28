/*
  CONSTRUIR
  ---------
  Uso (en la carpeta del proyecto):   node construir.mjs

  Qué hace: coge los datos de js/datos.js y deja ya escrito dentro de index.html
    - el contenido (servicios, precios, FAQ, opiniones, horario...),
    - el título, la descripción y las etiquetas para redes sociales,
    - (si CONFIG.dominio está relleno) canonical y datos estructurados de negocio local,
  y crea robots.txt y sitemap.xml.

  Para qué: Google, Bing, WhatsApp y los asistentes de IA leen el HTML tal cual, sin ejecutar
  JavaScript. Sin este paso, verían una página con huecos vacíos.

  Cuándo: cada vez que cambies algo en js/datos.js y quieras publicarlo.
  Se puede ejecutar todas las veces que quieras: siempre da el mismo resultado.
  Solo modifica lo que hay entre los marcadores  <!--auto:...-->  y  <!--/auto:...-->.
*/

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const carpeta = path.dirname(fileURLToPath(import.meta.url));
const leer = (ruta) => fs.readFileSync(path.join(carpeta, ruta), "utf-8");
const escribir = (ruta, texto) => fs.writeFileSync(path.join(carpeta, ruta), texto, "utf-8");

/* ---------- 1. Cargar los datos y las plantillas (los mismos archivos que usa el navegador) ---------- */
const nombresDatos = ["CONFIG", "EMPRESA", "CONSEJOS", "SERVICIOS", "HORARIO", "TRABAJOS", "OPINIONES", "FAQ", "SOBRE", "CONFIANZA", "HABILITACIONES"];
const nombresPlantillas = [
  "esc", "textoLineaServicios", "htmlOpcionesServicio", "htmlConsejos", "htmlServicios", "htmlHorario",
  "htmlTrabajos", "htmlConfianza", "htmlHabilitaciones", "htmlSobreTexto", "htmlSobreDatos", "htmlOpiniones", "htmlPreguntas",
];
const D = new vm.Script(
  `(() => {\n${leer("js/datos.js")}\n${leer("js/plantillas.js")}\nreturn { ${[...nombresDatos, ...nombresPlantillas].join(", ")} };\n})()`,
  { filename: "datos+plantillas" }
).runInNewContext({});
const { CONFIG, EMPRESA, esc } = D;

const avisos = [];
const aviso = (texto) => avisos.push(texto);

/* ---------- 2. Valores derivados ---------- */
const nombre = CONFIG.nombre.charAt(0).toUpperCase() + CONFIG.nombre.slice(1);
const ciudad = (CONFIG.ciudad || "").trim();
let dominio = (CONFIG.dominio || "").trim().replace(/\/+$/, "");
if (dominio && !/^https:\/\/[^/\s]+$/.test(dominio)) {
  aviso(`CONFIG.dominio ("${dominio}") debe ser algo como "https://www.tuweb.es", sin barra final. Se ignora.`);
  dominio = "";
}

const titulo = `Electricista, fontanero y climatización ${ciudad ? `en ${ciudad}` : "a domicilio"} | ${nombre}`;
const descripcion =
  `Electricidad, fontanería y climatización a domicilio${ciudad ? ` en ${ciudad}` : ""}. ` +
  `Cuéntanos qué se ha roto y te damos precio cerrado antes de ir.`;

if (!ciudad) aviso("Falta CONFIG.ciudad: sin ella, la web no aparece en búsquedas locales tipo «electricista en Valencia».");
if (!dominio) aviso("Falta CONFIG.dominio: sin él no se generan canonical, imagen para compartir, sitemap ni datos estructurados.");
if (titulo.length > 65) aviso(`El título mide ${titulo.length} caracteres; Google suele cortar a partir de ~60.`);
if (descripcion.length > 160) aviso(`La descripción mide ${descripcion.length} caracteres; Google suele cortar a partir de ~155.`);
if (dominio && /^\[|correo@ejemplo/.test(`${EMPRESA.titular}${EMPRESA.email}`)) {
  aviso("EMPRESA todavía tiene marcadores [entre corchetes]: rellénalos antes de publicar con dominio.");
}
if (dominio && CONFIG.telefonoInternacional === "34600000000") {
  aviso("El teléfono sigue siendo el de ejemplo (600 000 000) y saldría en los datos estructurados.");
}

/* ---------- 3. Bloque <head> ---------- */
function bloqueHead() {
  const l = [];
  l.push(`<title>${esc(titulo)}</title>`);
  l.push(`<meta name="description" content="${esc(descripcion)}">`);
  if (dominio) l.push(`<link rel="canonical" href="${esc(dominio)}/">`);
  l.push(`<meta property="og:type" content="website">`);
  l.push(`<meta property="og:locale" content="es_ES">`);
  l.push(`<meta property="og:site_name" content="${esc(nombre)}">`);
  l.push(`<meta property="og:title" content="${esc(titulo)}">`);
  l.push(`<meta property="og:description" content="${esc(descripcion)}">`);
  if (dominio) {
    l.push(`<meta property="og:url" content="${esc(dominio)}/">`);
    // Las etiquetas para compartir exigen una dirección completa, por eso solo se ponen con dominio
    l.push(`<meta property="og:image" content="${esc(dominio)}/img/portada.jpg">`);
    l.push(`<meta property="og:image:width" content="2000">`);
    l.push(`<meta property="og:image:height" content="1125">`);
    l.push(`<meta property="og:image:alt" content="Técnico revisando un cuadro eléctrico">`);
    l.push(`<meta name="twitter:card" content="summary_large_image">`);
  }
  if (dominio) l.push(`<script type="application/ld+json">\n${JSON.stringify(datosEstructurados(), null, 2)}\n  </script>`);
  return l.map((x) => `  ${x}`).join("\n").trimStart();
}

// Datos del negocio para Google (schema.org). No se incluyen valoraciones: las opiniones de la web
// son de ejemplo y publicar estrellas falsas incumple las normas de Google.
function datosEstructurados() {
  const d = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${dominio}/#negocio`,
    name: nombre,
    url: `${dominio}/`,
    image: `${dominio}/img/portada.jpg`,
    description: descripcion,
    telephone: `+${CONFIG.telefonoInternacional}`,
  };
  if (ciudad) d.areaServed = { "@type": "City", name: ciudad };
  if (EMPRESA.domicilio && !EMPRESA.domicilio.startsWith("[")) {
    d.address = { "@type": "PostalAddress", streetAddress: EMPRESA.domicilio, addressCountry: "ES" };
  }
  d.hasOfferCatalog = {
    "@type": "OfferCatalog",
    name: "Servicios",
    itemListElement: D.SERVICIOS.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.nombre, description: s.resumen },
    })),
  };
  return d;
}

/* ---------- 4. Reemplazos sobre index.html ---------- */
let html = leer("index.html");

// Contenido entre marcadores
const trozos = {
  head: bloqueHead(),
  "opciones-servicio": D.htmlOpcionesServicio(D.SERVICIOS),
  "lista-consejos": D.htmlConsejos(D.CONSEJOS),
  "lista-servicios": D.htmlServicios(D.SERVICIOS),
  horario: D.htmlHorario(D.HORARIO),
  "lista-confianza": D.htmlConfianza(D.CONFIANZA),
  "lista-habilitaciones": D.htmlHabilitaciones(D.HABILITACIONES),
  "lista-trabajos": D.htmlTrabajos(D.TRABAJOS),
  "sobre-titulo": esc(D.SOBRE.titulo),
  "sobre-texto": D.htmlSobreTexto(D.SOBRE),
  "sobre-datos": D.htmlSobreDatos(D.SOBRE),
  "lista-opiniones": D.htmlOpiniones(D.OPINIONES),
  "lista-preguntas": D.htmlPreguntas(D.FAQ),
};
for (const [nombreTrozo, contenido] of Object.entries(trozos)) {
  const patron = new RegExp(`(<!--auto:${nombreTrozo}-->)[\\s\\S]*?(<!--/auto:${nombreTrozo}-->)`);
  if (!patron.test(html)) throw new Error(`No encuentro el marcador «${nombreTrozo}» en index.html`);
  html = html.replace(patron, (_, ini, fin) => `${ini}${contenido}${fin}`);
}

// Textos sueltos: <span data-config="telefono">...</span>
const textos = {
  nombre: CONFIG.nombre,
  telefono: CONFIG.telefono,
  zona: CONFIG.zona,
  notaPrecios: CONFIG.notaPrecios,
  tiempoRespuesta: CONFIG.tiempoRespuesta,
  lineaServicios: D.textoLineaServicios(CONFIG),
};
for (const [clave, valor] of Object.entries(textos)) {
  const patron = new RegExp(`(<([a-z0-9]+)\\b[^>]*\\bdata-config="${clave}"[^>]*>)[\\s\\S]*?(</\\2>)`, "g");
  html = html.replace(patron, (_, abre, _etiqueta, cierra) => `${abre}${esc(valor)}${cierra}`);
}

// Enlaces de teléfono y WhatsApp
html = html.replace(/(<a\b[^>]*\bdata-config="(telefono|whatsapp)-enlace"[^>]*\bhref=")[^"]*(")/g, (_, ini, tipo, fin) =>
  `${ini}${tipo === "telefono" ? `tel:+${CONFIG.telefonoInternacional}` : `https://wa.me/${CONFIG.telefonoInternacional}`}${fin}`
);

// Interruptor de un atributo "hidden" en la etiqueta que contiene cierto texto
function ocultarSi(condicion, patronEtiqueta) {
  html = html.replace(patronEtiqueta, (etiqueta) => {
    const limpia = etiqueta.replace(/\s+hidden(?=[\s>])/, "");
    return condicion ? limpia.replace(/>$/, " hidden>") : limpia;
  });
}
ocultarSi(!D.HABILITACIONES.length, /<ul class="confianza__sellos"[^>]*>/);
ocultarSi(!D.TRABAJOS.length, /<section class="trabajos"[^>]*>/);
ocultarSi(!D.OPINIONES.length, /<section class="opiniones"[^>]*>/);
ocultarSi(!D.TRABAJOS.length, /<a href="#trabajos"[^>]*>/);
ocultarSi(!D.OPINIONES.length, /<a href="#opiniones"[^>]*>/);
ocultarSi(!CONFIG.googleOpinionesUrl || !D.OPINIONES.length, /<p class="opiniones__mas"[^>]*>/);
if (CONFIG.googleOpinionesUrl) {
  html = html.replace(/(<p class="opiniones__mas"[^>]*>\s*<a href=")[^"]*(")/, (_, ini, fin) => `${ini}${esc(CONFIG.googleOpinionesUrl)}${fin}`);
}

escribir("index.html", html);

/* ---------- 5. robots.txt y sitemap.xml ---------- */
escribir("robots.txt", `User-agent: *\nAllow: /\n${dominio ? `\nSitemap: ${dominio}/sitemap.xml\n` : ""}`);
if (dominio) {
  const hoy = new Date().toISOString().slice(0, 10);
  escribir(
    "sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${dominio}/</loc>\n    <lastmod>${hoy}</lastmod>\n  </url>\n</urlset>\n`
  );
} else if (fs.existsSync(path.join(carpeta, "sitemap.xml"))) {
  fs.unlinkSync(path.join(carpeta, "sitemap.xml"));
}

/* ---------- 6. Resumen ---------- */
console.log("✔ index.html actualizado desde js/datos.js");
console.log(`  título:      ${titulo}`);
console.log(`  descripción: ${descripcion}`);
console.log(`  robots.txt${dominio ? " y sitemap.xml" : ""} escritos${dominio ? "" : " (sitemap.xml y datos estructurados esperan al dominio)"}`);
if (avisos.length) {
  console.log("\nPendiente:");
  avisos.forEach((a) => console.log("  ⚠ " + a));
}
