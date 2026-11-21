# METANOIA 2026 — Prompt para Claude Code

Actúa como un Creative WebGL Developer senior y Motion Director especializado en:

- Experiencias Scroll World y Fly-Through.
- Three.js.
- TypeScript.
- React.
- GSAP ScrollTrigger.
- Video scrubbing cinematográfico.
- Optimización móvil e iOS.
- Integración de marcas dentro de escenas inmersivas.

## 1. Instala y utiliza obligatoriamente Scroll World

Debes utilizar la habilidad oficial:

https://github.com/oso95/scroll-world

Antes de programar, si trabajas en Claude Code, instala la habilidad mediante el método recomendado:

```text
/plugin marketplace add oso95/scroll-world
/plugin install scroll-world@scroll-world
```

Alternativamente:

```bash
npx skills add oso95/scroll-world
```

En la selección interactiva, instala la habilidad para Claude Code.

Después:

1. Lee completamente `skills/scroll-world/SKILL.md`.
2. Revisa especialmente `references/scrub-engine.js`, `references/prompts.md` y `references/pipeline.md`.
3. Invoca `/scroll-world`.
4. Confirma que la habilidad está activa antes de generar código.

No intentes importar `scroll-world` desde npm dentro del componente. Es una habilidad de desarrollo, no una dependencia runtime.

## 2. Assets entregados

Dentro de la carpeta `assets` encontrarás:

### `metanoia-mobile.mp4` — prioridad máxima

- Video vertical nativo de 1080 × 1920.
- Aproximadamente 10 segundos y 24 FPS.
- Es la experiencia principal porque el sitio está enfocado prioritariamente en teléfonos.
- No debe sustituirse por un recorte del video horizontal.

### `metanoia-desktop.mp4`

- Video horizontal de 1920 × 1080.
- Aproximadamente 10 segundos y 24 FPS.
- Debe utilizarse en landscape y escritorio.

### `metanoia-logo-refinado.svg`

- Logo oficial de Metanoia 2026.
- Blanco y con fondo transparente.
- Debe conservarse exactamente.
- No redibujarlo, sustituir su tipografía, separar sus elementos, modificar sus proporciones ni deformarlo.

Las rutas públicas finales serán:

```text
/assets/backgrounds/metanoia-desktop.mp4
/assets/backgrounds/metanoia-mobile.mp4
/assets/metanoia-logo-refinado.svg
```

## 3. Objetivo

Crea un componente inmersivo llamado `MetanoiaScrollWorld.tsx` que transforme el hero actual de Metanoia en una experiencia Scroll World cinematográfica.

La prioridad absoluta es mantener la identidad actual:

- Mismo video morado, azul y magenta.
- Mismo logo oficial.
- Mismo protagonismo del logo.
- Mismo ambiente juvenil, espiritual, cósmico y futurista.
- El resultado inicial debe sentirse prácticamente idéntico al hero actual.
- El Scroll World debe ser una evolución natural del diseño existente, no un rediseño diferente.
- Mobile-first real: diseña primero para 360–430 px de ancho y después adapta a escritorio.

## 4. Regla principal del logo

El logo debe estar visible desde el primer frame, incluso antes de que el usuario haga scroll.

En `scrollProgress = 0`:

- El logo debe estar centrado y perfectamente legible.
- Debe conservar el SVG original.
- Debe tener aproximadamente el mismo tamaño actual: máximo 580 px en pantallas pequeñas, 680 px en tablets y 750 px en escritorio.
- En móvil debe usar el ancho disponible sin tocar los bordes, conservando al menos 20 px de espacio lateral.
- No debe aparecer mediante un fade tardío.
- No debe depender de que el video haya cargado.
- No debe producir layout shift.
- Debe existir como contenido HTML/SVG accesible, aunque posteriormente se sincronice con una representación 3D.
- Debe haber un poster o fallback detrás para que la primera pantalla nunca aparezca vacía.

El logo es la puerta de entrada a la experiencia. No coloques primero partículas, un planeta, una esfera ni una pantalla de carga.

## 5. Transición del logo al mundo 3D

Diseña una transferencia imperceptible entre el logo HTML inicial y su representación dentro de la escena:

1. El logo comienza como SVG HTML nítido.
2. Una representación 3D tipo billboard o sprite coincide exactamente con su posición, tamaño y perspectiva.
3. Realiza un crossfade perfectamente sincronizado entre ambas representaciones.
4. No debe existir salto de escala, posición, color o nitidez.
5. El logo debe permanecer intacto.
6. La cámara no atraviesa ni rompe el logo.
7. La cámara atraviesa un portal luminoso situado inmediatamente detrás del logo.
8. Mientras la cámara avanza, el logo se aleja suavemente y queda atrás como el umbral de entrada al universo Metanoia.

## 6. Arquitectura visual

Utiliza una arquitectura híbrida:

### Motor de Scroll World

Aprovecha los principios de `oso95/scroll-world`:

- Scroll convertido en tiempo de video.
- Scrubbing suave.
- Blob loading para búsqueda confiable.
- Seek coalescing.
- Posters mientras el video prepara su primer frame.
- Mobile nativo.
- Reproducción reversible al hacer scroll hacia arriba.
- `prefers-reduced-motion`.
- Protección contra saltos causados por la barra del navegador móvil.

### Three.js como profundidad viva

Utiliza Three.js para:

- Logo tridimensional tipo billboard.
- Partículas orgánicas discretas.
- Anillos luminosos.
- Brillos cristalinos.
- Fragmentos transparentes.
- Niebla espacial suave.
- Capas de paralaje.
- Portal luminoso detrás del logo.
- Sensación de volumen sin sustituir el material original.

### GSAP ScrollTrigger como coordinador

GSAP debe coordinar cámara, logo, portal, profundidad, opacidad, luces y progreso normalizado del video.

Debe existir una sola fuente maestra de progreso. No crees dos motores de scroll independientes compitiendo entre sí. El progreso maestro debe alimentar tanto el scrub del video como la timeline 3D.

## 7. Coreografía cinematográfica

Utiliza un contenedor de aproximadamente 300vh y un viewport fijado de 100dvh.

Configura:

```ts
scrub: 1
invalidateOnRefresh: true
anticipatePin: 1
start: "top top"
end: "bottom bottom"
pin: true
```

Evita duplicar el espacio vertical por una configuración incorrecta entre `pin` y `300vh`.

### Fase 1 — Identidad y portada, 0%–18%

- Debe ser el estado más parecido al hero original.
- Video o poster a pantalla completa.
- Logo perfectamente centrado y completamente visible desde el inicio.
- Movimiento ambiental muy lento.
- Halo violeta y cian detrás del logo.
- Ligero paralaje de puntero solo en dispositivos compatibles.
- No desplazar el logo más de unos pocos píxeles.
- Respiración luminosa muy discreta.
- Sin rebotes, glitch, rotaciones exageradas ni zoom agresivo.
- Permite contemplar el logo antes de comenzar el viaje.

### Fase 2 — Despertar del portal, 18%–35%

- El fondo adquiere profundidad.
- El video se separa visualmente en capas.
- Aparecen partículas cercanas y lejanas.
- Los anillos del material original generan paralaje suave.
- Detrás del logo comienza a abrirse un portal de luz.
- El logo permanece intacto y legible.
- La cámara hace un dolly-in lento.
- Inclinación máxima de 2–3 grados.
- Debe sentirse como entrada, no como zoom CSS.

### Fase 3 — Entrada al mundo, 35%–62%

- La cámara atraviesa el portal situado detrás del logo.
- El logo queda atrás sin desaparecer bruscamente.
- La cámara realiza una órbita parcial y elegante sobre el eje Y.
- Añade una variación vertical pequeña.
- Los elementos del video se sienten ubicados en distintas profundidades.
- Utiliza geometrías transparentes y reflejos que continúen las formas del video.
- El scroll controla el tiempo del video con precisión.
- El movimiento debe funcionar perfectamente en reversa.

### Fase 4 — Fly-Through, 62%–86%

- Aumenta progresivamente la sensación de velocidad.
- Las partículas cercanas reaccionan sutilmente a la velocidad del scroll.
- Limita la reacción para evitar caos o parpadeos.
- Introduce brillos cristalinos cerca de la cámara.
- No tapes el video.
- No conviertas la escena en un túnel genérico.
- Mantén reconocibles los colores y formas del material original.
- Utiliza profundidad, fog y paralaje para vender la sensación de vuelo.

### Fase 5 — Salida y conexión, 86%–100%

- Reduce la velocidad gradualmente.
- La cámara llega a una composición estable.
- El mundo deja espacio visual para el contenido siguiente.
- El final no debe ser negro.
- No debe existir un corte ni reinicio visible del video.
- Debe quedar listo para conectar con la siguiente sección del sitio.
- Al subir, todo debe reconstruirse exactamente en reversa.

## 8. Efectos permitidos y prohibidos

Usa con moderación:

- Profundidad multicapa.
- Parallax.
- Faux volumetric light.
- Halos.
- Caústicas cristalinas.
- Partículas con semillas deterministas.
- Anillos de luz.
- Niebla violeta.
- Chromatic aberration extremadamente sutil en los bordes.
- Motion blur simulado muy leve.
- Distorsión del entorno alrededor del portal.

No uses:

- Deformación, fragmentación o explosión del logo.
- Glitch agresivo.
- Bloom quemado.
- Ruido visual excesivo.
- Planetas realistas o globos terráqueos.
- Estética espacial genérica ajena al video.
- Texto generado por IA dentro del video.
- Formas que oculten el logo.
- Movimiento que cause mareo.
- Zoom CSS presentado como recorrido 3D.
- Cortes visibles o parpadeos entre HTML y WebGL.

## 9. Video scrubbing

Implementa el tratamiento recomendado por `scroll-world`:

- Carga el video seleccionado como `Blob`.
- Crea un `ObjectURL` completamente seekable.
- Usa un único elemento `<video>`.
- `muted`, `playsInline`, sin audio.
- Usa el video como `THREE.VideoTexture`.
- Mantén un poster visible hasta que el primer frame esté pintado.
- Coalescing de seeks: no acumules cambios de `currentTime` mientras el decoder está buscando.
- Suavizado con `requestAnimationFrame`.
- No uses la reproducción tradicional para impulsar el recorrido.
- El tiempo depende del scroll y funciona en ambos sentidos.
- Pausa todo cuando la pestaña quede oculta.
- Libera el `ObjectURL` al desmontar.

## 10. Mobile-first obligatorio

La web está enfocada principalmente en móviles. La versión móvil no es una adaptación secundaria.

Para portrait/móvil:

- Usa obligatoriamente `metanoia-mobile.mp4`.
- No recortes el video desktop.
- Diseña primero para 360 × 800 y 390 × 844.
- Verifica también 430 × 932.
- Usa pixel ratio máximo 1.5.
- Reduce partículas y geometrías antes de reducir la calidad del video.
- Respeta `100dvh` y `env(safe-area-inset-*)`.
- Evita saltos cuando cambia la barra del navegador.
- Optimiza seeks para iOS Safari y Chrome Android.
- Mantén controles táctiles con áreas mínimas de 44 × 44 px.
- No dependas del hover.
- No bloquees el scroll nativo.
- Ignora resizes provocados únicamente por la barra del navegador; responde a cambios reales de ancho y a `orientationchange`.
- Al rotar el dispositivo, conserva un progreso visual equivalente.

Para landscape/escritorio:

- Usa `metanoia-desktop.mp4`.
- Conserva su composición 16:9.
- Pixel ratio máximo 2.

## 11. Preservación de assets y control de costos

Los videos entregados son la fuente visual principal, no una simple referencia. Primero construye la experiencia utilizando exclusivamente estos videos y el logo.

No uses Monid, Higgsfield, Seedance, Kling ni servicios con créditos sin aprobación explícita.

Si consideras indispensable generar nuevos clips o conectores:

1. Detente antes de generarlos.
2. Explica por qué los videos actuales no son suficientes.
3. Indica el número de clips necesario.
4. Presenta costo y tiempo estimados.
5. Espera aprobación.

No gastes créditos automáticamente.

## 12. Renderizador y rendimiento

Configura `THREE.WebGLRenderer` con:

```ts
antialias: true
alpha: true
powerPreference: "high-performance"
```

Además:

- Usa `renderer.outputColorSpace = THREE.SRGBColorSpace`.
- Limita el pixel ratio.
- Usa `ResizeObserver`.
- Crea un solo canvas y un solo loop de animación.
- La cámara debe mirar hacia un target interpolable.
- No controles la trayectoria modificando únicamente `camera.rotation`.
- Usa posiciones y targets explícitos.
- Mantén correctamente la relación de aspecto del video mediante cálculos tipo cover/contain.
- Evita decodificar dos videos simultáneamente.
- Evita asignaciones de memoria dentro del loop de render.

## 13. Accesibilidad y fallbacks

- El logo HTML debe conservar `role="img"` y nombre accesible.
- El canvas debe ser decorativo.
- En `prefers-reduced-motion`, muestra poster/video estático, logo completo y halo suave, sin fly-through.
- Si WebGL falla, la primera pantalla debe seguir pareciéndose al hero original.
- Si el multimedia falla, conserva logo y poster.
- No ocultes el contenido principal detrás del canvas.

## 14. Cleanup obligatorio

Al desmontar:

- Mata la timeline propia de GSAP.
- Mata únicamente el ScrollTrigger del componente.
- No uses `ScrollTrigger.getAll().forEach(kill)`.
- Cancela `requestAnimationFrame`.
- Desconecta `ResizeObserver`.
- Elimina listeners.
- Pausa el video.
- Elimina su `src` y ejecuta `video.load()`.
- Revoca todos los `ObjectURL`.
- Libera `VideoTexture`, texturas, geometrías, materiales, sprites y partículas.
- Ejecuta `renderer.dispose()`.
- Ejecuta `renderer.forceContextLoss()` cuando sea seguro.
- Elimina el canvas.
- Revierte el contexto de GSAP.

## 15. Portabilidad

El prototipo puede funcionar como Client Component de Next.js, pero el destino final es React 19 + Vite + TypeScript.

Por tanto:

- No uses `next/image`.
- No uses Server Components.
- No dependas del App Router.
- No uses loaders exclusivos de Next.js.
- Encapsula el CSS dentro del mismo artefacto mediante `<style>`.
- Las rutas deben recibirse mediante props.

Interfaz mínima:

```ts
interface MetanoiaScrollWorldProps {
  desktopVideoSrc?: string;
  mobileVideoSrc?: string;
  logoSrc?: string;
  className?: string;
  particleQuality?: "low" | "medium" | "high";
  debug?: boolean;
  onReady?: () => void;
  onComplete?: () => void;
}
```

## 16. Criterios de aceptación

Antes de entregar, verifica:

1. El logo aparece inmediatamente sin hacer scroll.
2. Conserva sus proporciones originales.
3. La primera pantalla se parece al hero original.
4. No existe flash negro.
5. No existe layout shift.
6. No hay salto al transferir el logo de HTML a WebGL.
7. El video responde al scroll.
8. El recorrido funciona en reversa.
9. Desktop usa el video horizontal.
10. Móvil usa el video vertical.
11. Un flick rápido no congela el video en móvil.
12. No hay dos videos decodificándose simultáneamente.
13. No hay dos motores de scroll compitiendo.
14. No hay overflow horizontal.
15. No hay cortes visibles.
16. El componente se desmonta sin fugas.
17. Sin WebGL sigue existiendo un hero funcional.
18. Reduced motion muestra una versión estable.
19. El final conecta limpiamente con el contenido siguiente.
20. El logo sigue siendo la identidad principal.
21. Funciona correctamente desde 360 px de ancho.
22. No depende de hover para ninguna acción esencial.
23. Respeta notch y barra inferior de iPhone.
24. Mantiene una experiencia táctil fluida en Android.

## 17. Entrega

Devuelve:

1. Confirmación de que instalaste y utilizaste `oso95/scroll-world`.
2. Explicación corta de la dirección visual.
3. Comandos de instalación de dependencias runtime.
4. Archivo completo `MetanoiaScrollWorld.tsx`.
5. Helpers estrictamente necesarios.
6. Ejemplo mínimo de uso.
7. Parámetros visuales ajustables.
8. Explicación de portabilidad a React + Vite.
9. Lista del cleanup implementado.
10. Checklist de los 24 criterios de aceptación.

No construyas una landing page nueva. No modifiques navegación, footer, formularios, juegos ni las demás secciones. Necesito únicamente el hero Scroll World listo para integrarse después en el proyecto existente.
