# Pendientes con el negocio

Datos que faltan para poder publicar la web. Cada uno vive en [`js/datos.js`](../js/datos.js);
después de cambiarlos, ejecuta `node construir.mjs`.

## Imprescindibles (sin esto no se puede publicar)

- [ ] **Nombre del negocio** y **teléfono real** (`CONFIG.nombre`, `CONFIG.telefono`, `CONFIG.telefonoInternacional`).
- [ ] **Datos legales del titular** (`EMPRESA`): nombre o razón social, NIF/CIF, domicilio, correo. Salen en
      el aviso legal y en la política de privacidad, y son obligatorios por la LSSI.
- [ ] **Precios reales** por servicio (`SERVICIOS[].desde`) y si llevan IVA (`CONFIG.notaPrecios`).
- [ ] **Zona de trabajo** real (`CONFIG.zona`) y **horario** (`HORARIO`).
- [ ] **Que un gestor revise** [`aviso-legal.html`](../aviso-legal.html) y [`privacidad.html`](../privacidad.html).

## Para que la web convenza

- [ ] **Seguro de responsabilidad civil**: ¿existe? (`CONFIANZA`).
- [ ] **Garantía**: plazo y qué cubre.
- [ ] **Factura**: ¿con IVA desglosado?
- [ ] **Desplazamiento**: ¿se cobra? ¿hay recargo fuera de zona?
- [ ] **Plazo de respuesta** real (`CONFIG.tiempoRespuesta`).
- [ ] **Habilitaciones** (instalador autorizado, carnets): las instalaciones eléctricas, de gas y de
      climatización suelen exigirlas (`HABILITACIONES`). Ajustar los servicios a lo que le permite su titulación.
- [ ] **Comunidades de vecinos y empresas**: ¿trabaja con ellos?
- [ ] **Opiniones reales** de 3-5 clientes con su permiso (`OPINIONES`). Las actuales son de ejemplo.
- [ ] **Fotos de trabajos hechos** en [`img/trabajos/`](../img/trabajos) (`TRABAJOS[].foto`).
- [ ] **Foto suya trabajando** en [`img/equipo/`](../img/equipo) (`SOBRE.foto`) y **portada** propia en `img/`.
- [ ] **Texto de "Quiénes somos"** y cifras reales (`SOBRE`). Los actuales son de ejemplo.

## Para publicar y aparecer en Google

- [ ] **Ciudad** (`CONFIG.ciudad`): es lo que más pesa en el SEO local.
- [ ] **Dominio** (`CONFIG.dominio`): activa canonical, sitemap y datos estructurados.
- [ ] **Google Business Profile**: crear la ficha del negocio (se hace en la web de Google).
- [ ] **Enlace a las opiniones de Google** (`CONFIG.googleOpinionesUrl`), cuando exista la ficha.
- [ ] **Search Console**: subir `sitemap.xml` cuando esté el dominio.

## Preguntas para decidir el futuro

- ¿Trabaja solo o con empleados? ¿Quién contesta el teléfono cuando está en una obra?
- ¿Cuántas solicitudes espera por semana? (decide si basta con WhatsApp o hace falta reservas online)
