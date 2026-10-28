METANOIA 2026 — KIT SEO
Dominio canónico: https://www.metanoiapyb.xyz/

YA HECHO: Dominio conectado en Vercel; Google Search Console aceptó la solicitud de indexación.

ARCHIVOS
- public/robots.txt: permite rastreo y enlaza al sitemap.
- public/sitemap.xml: incluye solo la portada, única URL confirmada. Agrega otras rutas solo cuando realmente existan y deban indexarse.
- seo-head-html.txt: etiquetas SEO para proyectos HTML o React + Vite (copiarlas en <head> del index.html, reemplazando las existentes).

INSTALACIÓN EN REACT + VITE
1. Copia public/robots.txt y public/sitemap.xml a la carpeta public/ del repositorio (crea la carpeta si no existe).
2. Abre index.html de la raíz y ajusta etiquetas SEO del <head> según seo-head-html.txt. Evita duplicados de <title>, canonical y meta description.
3. Sube los cambios a la rama main vinculada a Vercel. Espera a que el despliegue indique Ready.

INSTALACIÓN EN HTML ESTÁTICO
1. Copia robots.txt y sitemap.xml a la raíz pública desde la que se sirve index.html.
2. Agrega etiquetas de seo-head-html.txt dentro de <head> en index.html, sin duplicados.
3. Publica el sitio en Vercel.

SI UTILIZAS NEXT.JS
1. No pegues seo-head-html.txt sin adaptar: usa metadata en app/layout.tsx o app/page.tsx, según tu proyecto.
2. Puedes utilizar app/robots.ts y app/sitemap.ts, o archivos estáticos en public/ si no hay rutas que los sobrescriban.
3. Antes de modificar Next.js, comparte package.json para generar una versión exacta según App Router o Pages Router.

DESPUÉS DE PUBLICAR
1. Abre en navegador https://www.metanoiapyb.xyz/robots.txt y https://www.metanoiapyb.xyz/sitemap.xml (deben mostrar su contenido; no el HTML de la app).
2. En Search Console > Sitemaps, escribe 'sitemap.xml' y pulsa Enviar.
3. En Search Console > Inspección de URLs revisa https://www.metanoiapyb.xyz/ dentro de unos días. No repitas compulsivamente la solicitud de indexación.
4. Comprueba que la portada tenga un encabezado visible claro: METANOIA 2026, Iglesia Pacto y Bendición, Guazapa, El Salvador. Verifica los datos reales antes de publicarlos.
5. Comparte el enlace desde los perfiles oficiales de la iglesia.

ADVERTENCIAS
- No se ha inspeccionado el repositorio ni se ha podido confirmar qué framework usa. No se ha cambiado nada en Vercel o GitHub.
- No se incluye og:image ni favicon hasta contar con los archivos reales. No se inventan páginas internas.
- Google decide si y cuándo indexa; SEO y sitemap no garantizan primeras posiciones.
