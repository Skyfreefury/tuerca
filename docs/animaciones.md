# Guía de animación · tuerca

Cómo se mueve esta web y cómo añadir animaciones nuevas sin perder calidad. Vale para personas
y para Claude Code: si vas a animar algo, sigue esto antes de escribir una línea.

## La idea

La web es **la hoja de trabajo del manitas** (ver la cabecera de `css/estilos.css`). Las animaciones
cuentan esa misma historia con objetos de taller, no con efectos genéricos:

| Metáfora | Qué hace | Dónde está |
| --- | --- | --- |
| **La tuerca se aprieta** | una tuerca en 3D en la portada: llega girando y se aprieta con un "clic"; con el scroll se afloja y baja en parallax; en escritorio se inclina hacia el ratón. El hexágono del logo también gira con el scroll | `.portada__tuerca`, `.tuerca3d` · `prepararTuerca3d()`, `prepararTuerca()` |
| **La hoja cae en la mesa** | el parte llega torcido y se posa | `.solicitud .parte` · `@keyframes parte-aterriza` |
| **Se escribe a boli** | ticks y renglones se trazan de izquierda a derecha | `@keyframes tick`, `@keyframes renglones` |
| **El sello** | algo cae grande y girado, y se posa con un pequeño rebote | números de "Cómo funciona", X de las casillas (`@keyframes sello`) |
| **El interruptor** | los botones se hunden 1 px al pulsar | `.boton:active` |
| **Se destapa** | el titular aparece de abajo arriba, como al levantar una tapa | `@keyframes destapa` |

Si una animación nueva no encaja en ninguna de estas metáforas, probablemente no hace falta.

## Reglas

1. **Sin librerías.** Ni GSAP, ni AOS, ni Lottie. CSS (transiciones y `@keyframes`) y, cuando haga falta,
   `IntersectionObserver` o `requestAnimationFrame` en `js/main.js`. La web no tiene dependencias y así sigue.
2. **Solo `transform` y `opacity`** para lo que se mueve. Son las dos propiedades que el navegador anima
   sin recalcular la página. Excepciones aceptadas, porque son de una sola vez y cortas:
   `clip-path` (destapar) y `background-size` (renglones). Nunca animes `width`, `height`, `top`, `margin`
   ni `font-stretch`: provocan saltos de maquetación. (Los desplegables animan `height` con la Web
   Animations API porque no hay otra forma; es el único caso.)
3. **Valores del `:root`, nunca a mano.** Duraciones y curvas salen de los tokens:

   | Token | Valor | Para qué |
   | --- | --- | --- |
   | `--dur-rapida` | 160ms | respuesta a un clic, marcar una casilla |
   | `--dur-media` | 320ms | abrir, cerrar, cambiar de estado |
   | `--dur-lenta` | 700ms | entradas al hacer scroll y al cargar |
   | `--escalon` | 120ms | retraso entre hermanos (tarjetas, pasos) |
   | `--ease-salida` | `cubic-bezier(0.2, 0.7, 0.2, 1)` | la normal: arranca rápido y se posa |
   | `--ease-sello` | `cubic-bezier(0.3, 1.4, 0.5, 1)` | se pasa un poco y vuelve: sellos, casillas |
   | `--ease-mecanica` | `cubic-bezier(0.4, 0, 0.2, 1)` | botones, meneos, cosas mecánicas |

   Si de verdad hace falta un valor nuevo, añádelo como token con su comentario.
4. **Las cosas entran, no salen.** Una animación de entrada se ejecuta una vez (`unobserve` tras verse).
   Nada se vuelve a esconder al subir el scroll.
5. **Nada se mueve solo en bucle.** Ni pulsos, ni rebotes infinitos, ni carruseles automáticos.
   Lo que se mueve lo provoca el usuario (scroll, clic) o la carga de la página, y una sola vez.
6. **Menos de un segundo por pieza.** La entrada completa de la portada acaba en ~1,6 s.
   Lo que el usuario necesita (botón principal, teléfono) es visible antes de 1 s.
7. **Sin JS, todo se ve.** Lo que empieza oculto va bajo `.js` (la clase la pone el `<head>`), así sin JS
   o si el script falla, la página está entera. Las animaciones de carga usan
   `animation-fill-mode: backwards`: al acabar no queda ningún estilo aplicado.
8. **`prefers-reduced-motion` es obligatorio.** Al final de `estilos.css` hay una red de seguridad que
   desactiva toda animación y transición. En JS, cualquier movimiento con `requestAnimationFrame` o
   contadores empieza con:

   ```js
   if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
   ```
9. **El contenido final está en el HTML.** Los contadores (`prepararContadores()`) cuentan hasta el texto
   que ya hay en la página, no lo inventan: Google y WhatsApp leen el HTML sin ejecutar JS.
10. **Nada crea scroll horizontal.** Si algo se escala o se desplaza hacia fuera, su contenedor lleva
    `overflow: clip` (ver `.portada`).

## Recetas

### Que algo aparezca al hacer scroll

Ponle la clase `revela`. Ya está: `prepararAnimaciones()` le añade `revela--visto` al entrar en pantalla, y
los hermanos con `revela` se escalonan solos con `--i` × `--escalon`. Si el HTML lo genera
`js/plantillas.js`, pon la clase allí (lo usan tanto `main.js` como `construir.mjs`).

Para una variante (algo que se dibuja dentro del elemento), engánchate a `.revela--visto` como hace `.paso`:

```css
.js .mi-cosa::before { transform: scaleX(0); transition: transform var(--dur-lenta) var(--ease-salida); }
.js .mi-cosa.revela--visto::before { transform: none; }
```

### Una entrada al cargar la página

```css
.js .mi-pieza {
  animation: sube var(--dur-lenta) var(--ease-salida) 400ms backwards;
}
```

`sube`, `destapa`, `tick`, `sello` y `meneo` ya existen; reutilízalos antes de crear otro `@keyframes`.
Escribe solo el `from` cuando el final sea el estilo normal del elemento (así respeta las variantes de móvil;
mira `parte-aterriza`).

### Respuesta a un clic

Transición corta en el estado (`:active`, `:checked`, una clase), con `--dur-rapida` y `--ease-mecanica`.
Si hay que repetir una animación que ya se ha visto (el meneo del error), reiníciala en JS:

```js
el.style.animation = "none";
void el.offsetWidth; // fuerza al navegador a "olvidarla"
el.style.animation = "";
```

### Una pieza en 3D

Se hace con CSS 3D, sin WebGL ni librerías: un contenedor con `perspective`, la pieza con
`transform-style: preserve-3d` y cada cara como un `div` con su propio `transform` (ejemplo completo: la tuerca,
`.tuerca3d` y `prepararTuerca3d()`).

- Las caras con `backface-visibility: hidden`, así no se ve la de detrás a través de la de delante.
- La luz se calcula en JS: la normal de cada cara se saca con `DOMMatrix` a partir del mismo `transform`
  que usa el navegador, se gira con la postura actual y su producto con la dirección de la luz da el color.
- Nunca pongas `filter`, `opacity` < 1 ni `overflow: hidden` en un elemento con `preserve-3d`: aplanan la pieza.
  Las sombras van en un elemento aparte (`.tuerca3d__sombra`).
- Un solo bucle `requestAnimationFrame` que se para solo cuando ya no hay nada que mover; con
  `prefers-reduced-motion` se dibuja una vez en su postura de reposo.
- Tamaño contenido (la tuerca no pasa de 15rem) y siempre por detrás del texto (`z-index: -1`).

### Algo ligado al scroll

Escucha `scroll` con `{ passive: true }`, agrupa en un `requestAnimationFrame` y cambia **una variable CSS**;
el CSS decide qué hacer con ella. Ejemplo completo: `prepararTuerca()`.

## Cómo comprobarlo antes de subir

1. Abre la web y recárgala varias veces: la entrada no debe dar tirones ni saltos de texto.
2. En las DevTools de Chrome, *Rendering → Emulate CSS prefers-reduced-motion: reduce*: todo debe verse
   quieto y completo.
3. Prueba a 390 px de ancho (móvil) y comprueba que no aparece scroll horizontal.
4. *Performance*: graba un scroll por toda la página; no debe haber fotogramas rojos largos.
5. Desactiva JavaScript: la página debe verse entera, sin huecos.

Con Playwright (lo usa Claude Code) se pueden hacer capturas a 350 ms, 900 ms y 2,6 s de cargar para ver
la secuencia, y un contexto con `reducedMotion: "reduce"` para el punto 2.

## Inspiración

Para ideas nuevas, mira animaciones de webs de construcción y oficios en
[Awwwards](https://www.awwwards.com/inspiration/process-scroll-animation-wallnut) y efectos concretos en
[GSAP Showcase](https://www.gsap.com/showcase/). Cópiales la idea, no la librería: aquí se rehace con CSS
y las reglas de arriba.
