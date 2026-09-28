/*
  PÁGINAS LEGALES
  ---------------
  Rellena aviso-legal.html y privacidad.html con los datos de js/datos.js
  (bloques CONFIG y EMPRESA). Aquí no hay texto legal: solo se pintan los datos.
*/

document.querySelectorAll('[data-config="nombre"]').forEach((el) => (el.textContent = CONFIG.nombre));
document.querySelectorAll('[data-config="telefono"]').forEach((el) => (el.textContent = CONFIG.telefono));
document.querySelector("#anio").textContent = new Date().getFullYear();

document.querySelectorAll("[data-empresa]").forEach((el) => {
  el.textContent = EMPRESA[el.dataset.empresa] || "";
});

// Los datos opcionales (p. ej. el registro mercantil) desaparecen si están vacíos
document.querySelectorAll("[data-empresa-opcional]").forEach((el) => {
  el.hidden = !EMPRESA[el.dataset.empresaOpcional];
});
