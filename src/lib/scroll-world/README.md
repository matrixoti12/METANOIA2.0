# Metanoia Scroll World

Integration of [oso95/scroll-world](https://github.com/oso95/scroll-world), installed and read on 2026-11-05.
`scrub-engine.ts` adapts the upstream `references/scrub-engine.js` video-loading and seeking code under the included MIT license.
The original Metanoia videos supply the artwork; `world-scene.ts` adds a real Three.js camera, the unchanged SVG as a billboard, a portal, particles and transparent crystals.

## Integration and tuning

`PageScrollWorld.tsx` owns one passive scroll listener and one requestAnimationFrame coordinator for the entire page. It measures chapter and content positions on layout changes, then reuses those measurements while scrolling. Navigation, the hero, gates, depth layers, camera and video consume that same frame.
`WorldChapter.tsx` defines Inicio, Propósito, Oración, Juegos, Historias, Tu foto and the closing chapter. Each has a portal entry and its own camera destination and motif. Native document scrolling and interactive DOM content remain available throughout.
`CyberBackground.tsx` owns one video decoder. Desktop shares it with a `THREE.VideoTexture`; mobile composites the native video once behind a transparent, lightweight WebGL overlay.
`HeroSection.tsx` still mounts `MetanoiaScrollWorld` for the opening choreography, but it no longer creates a separate scroll engine or renderer.

```tsx
<MetanoiaScrollWorld
  desktopVideoSrc="/assets/backgrounds/metanoia-desktop-scrub.mp4"
  mobileVideoSrc="/assets/backgrounds/metanoia-mobile-scrub.mp4"
  onReady={() => { /* WebGL logo ready; HTML is already visible. */ }}
  onComplete={() => { /* Forward journey completed. */ }}
>
  {/* Introductory markup, including an image with data-world-logo. */}
</MetanoiaScrollWorld>
```

- Five phases: identity 0–18%, portal 18–35%, entry 35–62%, flight 62–86%, arrival 86–100%.
- Opening track: 2.4 viewport heights on mobile, three on desktop. The flight continues through every subsequent chapter and the footer.
- Rendering is on demand, without an idle animation loop. Mobile DPR is capped at 1, desktop at 1.75. Mobile uses 22 particles, fewer wireframe crystals, simpler rings and no duplicate WebGL video upload.
- Chapter configuration and monotonic video/camera pacing live in `journey.ts`. Reversing scroll retraces the same itinerary.
- Headings, cards and panels receive short, scroll-linked depth movement. Focused inputs settle immediately; their values and game state stay mounted.
- Trivia and memory timers pause when their chapter or game tab is inactive, or the document is hidden.
- `className`, `debug`, `onReady` and `onComplete` are optional. `debug` displays a small development label.
- The HTML logo stays visible before WebGL loads. Its matching opaque billboard sits underneath during the transfer, avoiding a dim or double image.
- Reduced motion skips the WebGL import and video fetch entirely and shows the native portrait/landscape poster.
- WebGL or media failure retains the original logo and poster.

## Rebuild the existing videos

Install FFmpeg and run `python scripts/prepare-scroll-world.py --ffmpeg <path-to-ffmpeg>`.
Desktop retains the source resolution with GOP 8 / CRF 20. Mobile retains its portrait composition, encoded at 576 × 1024 with GOP 4 / CRF 25: 2.70 MiB instead of 5.38 MiB (about 50% less transfer and 36% fewer decoded pixels). Both strip audio, add faststart and extract a matching first-frame poster. Original sources remain available as media fallbacks. To regenerate just the phone assets, add `--variant mobile`.

## Validation

Run `npx tsc --noEmit`, `npx tsx --test src/lib/scroll-world/scrub-engine.test.ts src/lib/scroll-world/journey.test.ts`, and `npm run build`.
The five media regression tests cover rapid forward/reverse seeks, first-painted-frame gating, pause/visibility, orientation source replacement, and disposal during an unfinished fetch.
Four itinerary tests cover every chapter, the footer's final frame, monotonic seams across unequal section lengths, reversal and continued movement after the hero ends.

Browser QA covers the initial SVG, its HTML/WebGL transfer, forward/reverse video time, native portrait and landscape sources, a single sourced video, a single WebGL canvas, arrival into the next section and horizontal overflow. Physical iOS/Android testing and CPU throttling remain device-level checks.

## Cleanup

The coordinator removes its listener, cancels its pending frame, disconnects layout/mutation observers and removes scroll styles. The scene cancels its pending render, disconnects observers, removes all listeners, disposes textures/materials/geometries and the renderer, releases its WebGL context, and removes its canvas. The media adapter aborts fetches, cancels seek/frame callbacks, pauses and unloads its video, and revokes all object URLs.
