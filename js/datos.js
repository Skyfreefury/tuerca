/*
  DATOS DE LA WEB
  ---------------
  Todo lo que tu tío pueda querer cambiar (nombre, teléfono, servicios, precios, horario)
  vive aquí y no en el HTML. Cuando montes la base de datos, cada bloque de este archivo
  será una tabla:  CONFIG -> tabla "ajustes",  SERVICIOS -> tabla "servicios",
  HORARIO -> tabla "horario".

  ⚠️ Todo es PROVISIONAL: nombre, teléfono, precios y zona están inventados.
*/

const CONFIG = {
  nombre: "tuerca",
  // SEO. La ciudad sale en el título de Google, en la portada y en los datos del negocio: una
  // búsqueda como "electricista en Valencia" solo encuentra webs que digan "Valencia".
  // El dominio (con https://, sin barra final) activa canonical, sitemap y datos estructurados.
  // Tras cambiar cualquier dato, ejecuta:  node construir.mjs
  ciudad: "",                           // Ej.: "Valencia"
  dominio: "",                          // Ej.: "https://www.tuerca.es"
  telefono: "600 000 000",              // Cómo se ve en la web
  telefonoInternacional: "34600000000", // Sin espacios ni "+", para WhatsApp y llamadas
  zona: "Ciudad y alrededores, hasta 20 km. Si estás más lejos, pregunta.",
  // ⚠️ Pendiente de confirmar con el gestor: ¿los precios que ve el cliente llevan IVA?
  notaPrecios: "Precios orientativos de mano de obra, IVA incluido. El precio final te lo decimos antes de empezar, nunca después.",
  // ⚠️ Pendiente de confirmar con tu tío: en cuánto tiempo responde de verdad.
  tiempoRespuesta: "Te respondemos el mismo día laborable con un precio o con las preguntas que falten.",
  // Enlace a la ficha de Google del negocio para "Ver más opiniones". Vacío = no se muestra.
  googleOpinionesUrl: "",
};

/* Datos legales del titular. Salen en el aviso legal (aviso-legal.html) y en la política
   de privacidad (privacidad.html). Son obligatorios por la LSSI: hay que rellenarlos con los
   datos reales del autónomo o de la sociedad antes de publicar. */
const EMPRESA = {
  titular: "[Nombre y apellidos o razón social]",
  nif: "[NIF/CIF]",
  domicilio: "[Dirección completa]",
  email: "[correo@ejemplo.com]",
  actividad: "Servicios de reparación y mantenimiento del hogar",
  registro: "", // Solo si es sociedad: "Inscrita en el Registro Mercantil de …". Vacío = no se muestra.
};

/* Bloque de confianza ("Contratar con nosotros"). Cada punto es un compromiso real:
   no pongas nada que tu tío no pueda cumplir.
   - "texto": una frase corta, siempre visible. Es lo que convence de un vistazo.
   - "detalle": opcional. La letra pequeña; sale detrás de un "Ver detalle" desplegable.
   Los marcados "Pendiente" hay que confirmarlos con tu tío. */
const CONFIANZA = [
  { titulo: "Precio cerrado antes de ir",
    texto: "Te decimos el total antes de empezar. Si el problema resulta ser otro, decides tú." },
  { titulo: "Qué incluye el precio",
    texto: "Mano de obra y pequeño material, sin sorpresas.",
    detalle: "Pequeño material significa tacos, tornillos, silicona y similares. Las piezas grandes van aparte y siempre con tu visto bueno. (Pendiente: confirmar si hay desplazamiento y recargo fuera de zona.)" },
  { titulo: "Seguro de responsabilidad civil",
    texto: "Si algo se daña por error al trabajar, lo cubre el seguro. (Pendiente: confirmar que existe la póliza.)" },
  { titulo: "Garantía en los trabajos",
    texto: "Si lo que hemos arreglado falla, se vuelve a arreglar sin coste.",
    detalle: "La garantía cubre el trabajo realizado durante el plazo indicado en la factura. (Pendiente: indicar el plazo real y qué queda fuera, por ejemplo el mal uso o el desgaste normal.)" },
  { titulo: "Factura de todo",
    texto: "Con IVA desglosado, para que puedas justificarla o reclamar. (Pendiente de confirmar.)" },
  { titulo: "Personas con nombre y cara",
    texto: "Sabes quién va a tu casa antes de que llegue. Y si algo no va bien, sabes a quién llamar." },
];

/* Instalador autorizado: hay instalaciones (eléctricas, de gas, de climatización) que exigen
   carnet o empresa autorizada. Rellena el texto con lo que tu tío tenga realmente; si lo
   dejas vacío, no se muestra nada. Ej.: "Instalador eléctrico autorizado nº 1234". */
const HABILITACIONES = [
  // "Instalador eléctrico autorizado nº ____",
];

/* Lo que ayuda a dar precio rápido (sale junto al formulario) */
const CONSEJOS = [
  "Una foto o un vídeo corto del problema",
  "Marca y modelo, si es un aparato: termo, aire, cuadro eléctrico…",
  "Desde cuándo pasa y si has probado algo",
];

const SERVICIOS = [
  {
    id: "electricidad",
    nombre: "Electricidad",
    resumen: "Enchufes, luces, cuadros y averías.",
    trabajos: [
      "Enchufes e interruptores",
      "Lámparas y focos",
      "Saltan los plomos",
      "Cambio de cuadro eléctrico",
      "Puntos de luz nuevos",
    ],
    desde: 40,
  },
  {
    id: "fontaneria",
    nombre: "Fontanería",
    resumen: "Fugas, atascos, grifos y cisternas.",
    trabajos: [
      "Fugas de agua",
      "Grifos que gotean",
      "Cisternas",
      "Desatascos",
      "Termos eléctricos",
    ],
    desde: 45,
  },
  {
    id: "climatizacion",
    nombre: "Climatización",
    resumen: "Aire acondicionado y calefacción.",
    trabajos: [
      "Instalar aire acondicionado",
      "Limpieza y mantenimiento",
      "No enfría o no calienta",
      "Radiadores y purgado",
    ],
    desde: 60,
  },
  {
    id: "reparaciones",
    nombre: "Pequeños arreglos",
    resumen: "Todo lo demás que se rompe en casa.",
    trabajos: [
      "Colgar cuadros y estanterías",
      "Montar muebles",
      "Puertas que no cierran",
      "Persianas",
      "Silicona de baño y cocina",
    ],
    desde: 35,
  },
];

const HORARIO = [
  { dias: "Lunes a viernes", horas: "8:00 – 20:00" },
  { dias: "Sábados",         horas: "9:00 – 14:00" },
  { dias: "Urgencias",       horas: "Todos los días, llamando" },
];

/* Trabajos hechos (galería). "foto" es la ruta a una imagen, por ejemplo "img/trabajos/cuadro.jpg".
   Mientras sea null se muestra un hueco marcado como "foto pendiente". */
const TRABAJOS = [
  { titulo: "Cuadro eléctrico renovado",   servicio: "Electricidad",  foto: null },
  { titulo: "Fuga bajo el fregadero",      servicio: "Fontanería",    foto: null },
  { titulo: "Split instalado en salón",    servicio: "Climatización", foto: null },
  { titulo: "Estantería a medida",         servicio: "Pequeños arreglos", foto: null },
  { titulo: "Cambio de grifo de baño",     servicio: "Fontanería",    foto: null },
  { titulo: "Focos empotrados en cocina",  servicio: "Electricidad",  foto: null },
];

/* ⚠️ OPINIONES DE EJEMPLO: son inventadas para ver cómo queda el diseño.
   Antes de publicar la web hay que sustituirlas por opiniones reales de clientes
   (o borrar este bloque y la sección desaparece). Estrellas: de 1 a 5. */
const OPINIONES = [
  { nombre: "Nombre del cliente", lugar: "Barrio", estrellas: 5, texto: "Texto de ejemplo: vinieron el mismo día, me dijeron el precio antes y lo dejaron todo limpio." },
  { nombre: "Nombre del cliente", lugar: "Barrio", estrellas: 5, texto: "Texto de ejemplo: puntuales y sin sorpresas al pagar. Los volveré a llamar." },
  { nombre: "Nombre del cliente", lugar: "Barrio", estrellas: 4, texto: "Texto de ejemplo: arreglaron la avería que otros no encontraban." },
];

const FAQ = [
  { pregunta: "¿Cuánto cuesta venir a casa?",
    respuesta: "Los precios de la tarifa son de mano de obra. Te decimos el total cerrado antes de ir, así que no hay sorpresas. (Pendiente: confirmar si se cobra desplazamiento.)" },
  { pregunta: "¿Dais factura?",
    respuesta: "Sí. (Pendiente de confirmar con el negocio.)" },
  { pregunta: "¿Hay garantía en los trabajos?",
    respuesta: "Sí, todos los trabajos tienen garantía. (Pendiente: indicar el plazo real.)" },
  { pregunta: "¿Cómo puedo pagar?",
    respuesta: "Al terminar el trabajo, en efectivo, con tarjeta o por Bizum." },
  { pregunta: "¿Atendéis urgencias?",
    respuesta: "Sí, llámanos y vamos el mismo día siempre que podamos. Las urgencias fuera de horario pueden tener recargo." },
  { pregunta: "¿Trabajáis con comunidades de vecinos o empresas?",
    respuesta: "Sí. Cuéntanos qué necesitas y te preparamos un presupuesto. (Pendiente de confirmar.)" },
];

/* Sección "Quiénes somos" */
const SOBRE = {
  titulo: "Una persona, no un call center",
  texto: [
    "Texto de ejemplo: somos un pequeño negocio de reparaciones para el hogar. Cuando llamas, contesta la misma persona que luego va a tu casa.",
    "Texto de ejemplo: llevamos años arreglando enchufes, fugas y aires acondicionados, y preferimos que te ahorres una visita si se puede resolver de otra forma.",
  ],
  datos: [
    { cifra: "10+", etiqueta: "años de experiencia" },
    { cifra: "500+", etiqueta: "arreglos hechos" },
    { cifra: "24 h", etiqueta: "para dar precio" },
  ],
  foto: null, // por ejemplo "img/equipo.jpg"
};
