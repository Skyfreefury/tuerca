# Tuerca · web de manitas a domicilio

Web de una sola página para un servicio de reparaciones del hogar: electricidad, fontanería,
climatización y pequeños arreglos. HTML, CSS y JavaScript sin librerías ni dependencias.

Los clientes describen el problema en un "parte de trabajo" y se abre WhatsApp con el mensaje ya escrito.
No hay servidor ni base de datos por ahora.

## Estructura

```
tuerca/
├── index.html            Página principal (una sola página con secciones)
├── aviso-legal.html      Aviso legal (obligatorio por la LSSI)
├── privacidad.html       Política de privacidad y cookies (RGPD)
├── 404.html              Página de "no encontrada"
├── construir.mjs         Script que vuelca el contenido de datos.js al HTML (para el SEO)
├── favicon.svg           Icono de la pestaña
├── robots.txt            Instrucciones para buscadores (sitemap.xml se genera con el dominio)
├── package.json          Atajos: npm run construir / npm run servir
├── css/
│   ├── estilos.css       Todos los estilos, con las variables de color al principio
│   └── fuentes/          Tipografía Archivo alojada en local (sin Google Fonts)
├── js/
│   ├── datos.js          ★ TODO lo que el negocio puede cambiar: nombre, precios, textos, horario
│   ├── plantillas.js     Convierten los datos en HTML (las usan main.js y construir.mjs)
│   ├── main.js           Lógica de la página: menú, formulario, animaciones, desplegables
│   └── legal.js          Rellena las páginas legales con los datos de datos.js
├── img/
│   ├── portada.jpg/.webp Foto de portada (webp para la web, jpg para compartir el enlace)
│   ├── portada-900.webp  Portada reducida para móvil
│   ├── trabajos/         Fotos de trabajos hechos (se enlazan desde TRABAJOS en datos.js)
│   └── equipo/           Fotos de las personas del negocio
└── docs/
    └── pendientes.md     Datos que faltan por pedir al negocio
```

## Cómo se trabaja

1. **Ver la web en local.** Abre `index.html` con la extensión *Live Server* de VS Code, o ejecuta
   `npm run servir`. (Abrirlo con doble clic también funciona.)
2. **Cambiar contenido.** Edita solo [`js/datos.js`](js/datos.js): textos, precios, servicios, horario, FAQ...
3. **Publicar.** Antes de subir la web, ejecuta:

   ```
   node construir.mjs
   ```

   Deja el contenido ya escrito en `index.html` (Google y WhatsApp no ejecutan JavaScript), y genera título,
   descripción, `robots.txt` y, si hay dominio, `sitemap.xml` y datos estructurados. El script avisa de lo
   que falta. Si te olvidas de ejecutarlo, los visitantes ven lo nuevo pero los buscadores ven lo anterior.
4. **Subir a un alojamiento estático** (GitHub Pages, Netlify, Cloudflare Pages): basta con subir la
   carpeta entera. No hace falta compilar nada más.

## Qué falta antes de publicar

Mira [`docs/pendientes.md`](docs/pendientes.md).

## Decisiones de diseño

- **Un solo sitio para los datos.** `datos.js` mantiene la estructura de lo que luego serán tablas de base
  de datos (`CONFIG`, `SERVICIOS`, `HORARIO`...), para migrar sin reescribir la web.
- **Sin cookies ni servicios externos.** Fuentes en local y sin analítica: no hace falta banner de cookies.
  Si se añade algo que use cookies, hay que actualizar `privacidad.html`.
- **WhatsApp sin API.** El formulario abre un enlace `wa.me` con el texto escrito; la web no recibe ni guarda
  nada. Una API o backend solo hará falta para guardar solicitudes, mandar avisos o gestionar citas.
