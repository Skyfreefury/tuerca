# tuerca · notas para Claude Code

Web estática de un manitas a domicilio: HTML, CSS y JavaScript sin librerías ni dependencias.
Lee `README.md` para la estructura y el flujo de trabajo.

- **Contenido**: todo lo que el negocio cambia vive en `js/datos.js`. Las plantillas están en
  `js/plantillas.js`. Tras cambiar datos o plantillas, ejecuta `node construir.mjs` para volcarlo a `index.html`.
- **Estilos**: un solo archivo, `css/estilos.css`. Colores, radio y tokens de movimiento están en `:root`;
  usa siempre esas variables.
- **Animaciones**: antes de añadir o cambiar cualquier animación, lee y sigue
  [`docs/animaciones.md`](docs/animaciones.md). Sin librerías, solo `transform`/`opacity`, tokens del `:root`
  y `prefers-reduced-motion` siempre.
- **Idioma**: el código, los comentarios y los textos van en español, como el resto del proyecto.
- **Sin cookies ni servicios externos**: no añadas CDNs, analítica ni Google Fonts.
- **Pendientes del negocio**: `docs/pendientes.md`.
