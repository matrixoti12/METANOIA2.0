import * as THREE from 'three';
import { getWorldMedia, getWorldProgress, WORLD_MEDIA_EVENT, type WorldMedia, type WorldProgress } from '../../utils/scrollWorld';
import { WORLD_CHAPTERS } from './journey';

export interface WorldSceneOptions {
  logoSrc: string; particleQuality: 'low' | 'medium' | 'high'; onReady: () => void; onFallback: () => void;
}
const smooth = (a: number, b: number, x: number) => THREE.MathUtils.smoothstep(x, a, b);

/** One persistent, demand-rendered world for the entire page, including interactive chapters. */
export function createWorldScene(host: HTMLElement, logoElement: HTMLElement, options: WorldSceneOptions) {
  const coarse = matchMedia('(pointer: coarse)').matches;
  const renderer = new THREE.WebGLRenderer({ antialias: !coarse && innerWidth >= 860, alpha: true, powerPreference: 'low-power' });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.className = 'world-canvas';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.prepend(renderer.domElement);
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2('#592099', 0.012);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 110);
  const resources = new Set<THREE.BufferGeometry | THREE.Material | THREE.Texture>();
  const own = <T extends THREE.BufferGeometry | THREE.Material | THREE.Texture>(value: T): T => { resources.add(value); return value; };
  let disposed = false, lost = false, pending = 0, width = 1, height = 1, mobile = coarse || innerWidth < 860;
  let frame = getWorldProgress();
  let logoReady = false, draws = 0;
  let videoTexture: THREE.VideoTexture | null = null;
  let currentVideo: HTMLVideoElement | null = null;
  const target = new THREE.Vector3(), pointer = new THREE.Vector2(), logoPosition = new THREE.Vector3(), logoScale = new THREE.Vector2();

  const logoMaterial = own(new THREE.SpriteMaterial({ transparent: true, opacity: 0, depthTest: false, toneMapped: false }));
  const logo = new THREE.Sprite(logoMaterial); logo.renderOrder = 10; scene.add(logo);
  const logoImage = new Image();
  logoImage.onload = () => {
    if (disposed) return;
    const surface = document.createElement('canvas'); surface.width = 1500; surface.height = Math.round(1500 * 320 / 675);
    const context = surface.getContext('2d');
    if (!context) { options.onFallback(); return; }
    context.drawImage(logoImage, 0, 0, surface.width, surface.height);
    const texture = own(new THREE.CanvasTexture(surface)); texture.colorSpace = THREE.SRGBColorSpace;
    logoMaterial.map = texture; logoMaterial.needsUpdate = true; logoReady = true;
    resize(); options.onReady(); wake();
  };
  logoImage.onerror = () => { if (!disposed) options.onFallback(); };
  logoImage.src = options.logoSrc;

  const portals: { group: THREE.Group; materials: THREE.MeshBasicMaterial[] }[] = [];
  const portalGeometry = own(new THREE.TorusGeometry(1.9, 0.012, 5, mobile ? 56 : 96));
  const motifGeometry = own(new THREE.OctahedronGeometry(1, 0));
  const edges = own(new THREE.EdgesGeometry(motifGeometry));
  const motifs: { group: THREE.Group; material: THREE.LineBasicMaterial }[] = [];
  WORLD_CHAPTERS.forEach((chapter, index) => {
    const group = new THREE.Group();
    const materials: THREE.MeshBasicMaterial[] = [];
    for (let ring = 0; ring < 2; ring++) {
      const material = own(new THREE.MeshBasicMaterial({ color: chapter.accent, transparent: true, opacity: 0,
        blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
      const mesh = new THREE.Mesh(portalGeometry, material);
      mesh.scale.setScalar(1 + ring * 0.11); mesh.rotation.set(ring * 0.18, ring * -0.12, index * 0.14);
      group.add(mesh); materials.push(material);
    }
    group.position.set(0, 0, index === 0 ? -2 : -22 - (index - 1) * 10);
    scene.add(group); portals.push({ group, materials });
    const motif = new THREE.Group();
    const material = own(new THREE.LineBasicMaterial({ color: chapter.accent, transparent: true, opacity: 0.14, depthWrite: false }));
    if (index === 1 || index === 2) {
      const geometry = own(new THREE.TorusGeometry(2.3, 0.006, 4, mobile ? 48 : 80));
      const halo = new THREE.Mesh(geometry, own(new THREE.MeshBasicMaterial({ color: chapter.accent, transparent: true, opacity: 0.12, depthWrite: false })));
      halo.rotation.set(0.65, index * 0.2, 0.25); motif.add(halo);
    } else if (index >= 4) {
      const rectangle = own(new THREE.EdgesGeometry(own(new THREE.PlaneGeometry(2.1, 2.5))));
      for (let panel = 0; panel < 3; panel++) {
        const outline = new THREE.LineSegments(rectangle, material);
        outline.position.set((panel - 1) * 2.6, panel % 2 ? 1 : -0.6, panel * -1.5);
        outline.rotation.z = (panel - 1) * 0.18; motif.add(outline);
      }
    } else {
      for (let crystal = 0; crystal < (mobile ? 4 : 7); crystal++) {
        const outline = new THREE.LineSegments(edges, material);
        const angle = crystal / 7 * Math.PI * 2;
        outline.position.set(Math.cos(angle) * 3.2, Math.sin(angle) * 2.6, crystal * -0.6);
        outline.scale.setScalar(0.24 + crystal % 3 * 0.12); motif.add(outline);
      }
    }
    motif.position.z = index === 0 ? -9 : -25 - (index - 1) * 10;
    scene.add(motif); motifs.push({ group: motif, material });
  });

  let seed = 20261121;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) | 0; return (seed >>> 0) / 4294967296; };
  const crystalMaterial = own(new THREE.LineBasicMaterial({ color: '#dac5ff', transparent: true, opacity: 0.18, depthWrite: false }));
  const crystals: THREE.LineSegments[] = [];
  for (let index = 0; index < 22; index++) {
    const crystal = new THREE.LineSegments(edges, crystalMaterial);
    const angle = random() * Math.PI * 2;
    crystal.position.set(Math.cos(angle) * (3 + random() * 4), Math.sin(angle) * (2 + random() * 3), -index * 4);
    crystal.rotation.set(random() * 3, random() * 3, random() * 3);
    crystal.scale.setScalar(0.16 + random() * 0.3); scene.add(crystal); crystals.push(crystal);
  }
  const particleCount = options.particleQuality === 'high' ? 140 : 70;
  const points = new Float32Array(particleCount * 3);
  for (let index = 0; index < particleCount; index++) {
    points[index * 3] = (random() - 0.5) * 20; points[index * 3 + 1] = (random() - 0.5) * 15; points[index * 3 + 2] = -random() * 95;
  }
  const particleGeometry = own(new THREE.BufferGeometry()); particleGeometry.setAttribute('position', new THREE.BufferAttribute(points, 3));
  const particleMaterial = own(new THREE.PointsMaterial({ color: '#ead8ff', size: 0.025, transparent: true, opacity: 0.3,
    blending: THREE.AdditiveBlending, depthWrite: false }));
  const particles = new THREE.Points(particleGeometry, particleMaterial); scene.add(particles);
  const heroPositions = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 8), new THREE.Vector3(0.2, 0.12, 5.5), new THREE.Vector3(0.65, 0.3, -3.5),
    new THREE.Vector3(-1.1, 0.55, -12), new THREE.Vector3(0, 0, -19),
  ]);
  const heroTargets = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0.1, -2), new THREE.Vector3(-0.1, 0.25, -12),
    new THREE.Vector3(0.3, 0, -21), new THREE.Vector3(0, 0, -29),
  ]);
  const anchors = [new THREE.Vector3(0, 0, -19), new THREE.Vector3(-0.8, 0.3, -29), new THREE.Vector3(0.5, -0.2, -39),
    new THREE.Vector3(-0.5, 0.35, -49), new THREE.Vector3(0.7, 0, -59), new THREE.Vector3(-0.4, 0.2, -69), new THREE.Vector3(0, 0, -79)];
  const route = new THREE.CatmullRomCurve3(anchors);
  const routeTargets = new THREE.CatmullRomCurve3(anchors.map((point) => new THREE.Vector3(point.x * 0.25, point.y * 0.3, point.z - 10)));

  function fitBackground() {
    if (!videoTexture || !currentVideo?.videoWidth) return;
    const aspect = currentVideo.videoWidth / currentVideo.videoHeight;
    const x = Math.min(1, width / height / aspect), y = Math.min(1, aspect / (width / height));
    videoTexture.repeat.set(x, y); videoTexture.offset.set((1 - x) / 2, (1 - y) / 2); videoTexture.updateMatrix();
  }
  function decodedFrame() { if (videoTexture) videoTexture.needsUpdate = true; wake(); }
  function setMedia(media: WorldMedia) {
    // Phones composite the native video once, behind transparent WebGL; no duplicate video upload.
    const next = media.ready && !mobile ? media.video : null;
    if (next === currentVideo) return;
    currentVideo?.removeEventListener('seeked', decodedFrame);
    videoTexture?.dispose(); videoTexture = null; currentVideo = next;
    if (next) {
      videoTexture = new THREE.VideoTexture(next); videoTexture.colorSpace = THREE.SRGBColorSpace;
      videoTexture.minFilter = THREE.LinearFilter; videoTexture.magFilter = THREE.LinearFilter;
      next.addEventListener('seeked', decodedFrame); fitBackground();
    }
    scene.background = videoTexture; wake();
  }
  const onMedia = (event: Event) => setMedia((event as CustomEvent<WorldMedia>).detail);

  function resize() {
    if (disposed) return;
    const bounds = host.getBoundingClientRect(), logoBounds = logoElement.getBoundingClientRect();
    const introBounds = logoElement.closest('.world-viewport')!.getBoundingClientRect();
    width = Math.max(1, bounds.width); height = Math.max(1, bounds.height); mobile = coarse || width < 860;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobile ? 1 : 1.75)); renderer.setSize(width, height);
    camera.aspect = width / height; camera.updateProjectionMatrix();
    const visibleHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 8;
    logoPosition.set(((logoBounds.left + logoBounds.width / 2 - bounds.left) / width - 0.5) * visibleHeight * camera.aspect,
      (0.5 - (logoBounds.top - introBounds.top + logoBounds.height / 2) / height) * visibleHeight, 0);
    logoScale.set(logoBounds.width / width * visibleHeight * camera.aspect, logoBounds.height / height * visibleHeight);
    portals[0].group.position.y = logoPosition.y;
    portals.forEach(({ group }) => group.scale.setScalar(mobile ? 0.74 : 1.1));
    particleGeometry.setDrawRange(0, mobile ? 22 : particleCount);
    crystals.forEach((crystal, index) => { crystal.visible = !mobile || index % 3 === 0; });
    setMedia(getWorldMedia()); fitBackground(); wake();
  }
  function draw() {
    pending = 0;
    if (disposed || lost || document.hidden) return;
    const hero = frame.heroProgress;
    if (frame.chapterIndex === 0) {
      const travel = THREE.MathUtils.clamp((hero - 0.28) / 0.72, 0, 1);
      heroPositions.getPoint(travel, camera.position); heroTargets.getPoint(travel, target);
    } else {
      const travel = THREE.MathUtils.clamp((frame.routeProgress - 1) / 6, 0, 1);
      route.getPoint(travel, camera.position); routeTargets.getPoint(travel, target);
    }
    if (!mobile) { camera.position.x += pointer.x * 0.015; camera.position.y += pointer.y * 0.01; }
    camera.lookAt(target);
    logo.position.copy(logoPosition); logo.scale.set(logoScale.x, logoScale.y, 1);
    logoMaterial.opacity = logoReady && frame.chapterIndex === 0 && hero >= 0.18 ? 1 - smooth(0.35, 0.48, hero) : 0;
    const awake = frame.chapterIndex === 0 ? smooth(0.16, 0.32, hero) : 1;
    portals.forEach((portal, index) => {
      portal.group.visible = index === frame.chapterIndex;
      const intensity = index === 0 ? awake * (1 - smooth(0.85, 1, hero)) : (1 - smooth(0.3, 1, frame.gateProgress));
      portal.materials.forEach((material, ring) => { material.opacity = intensity * (ring ? 0.16 : 0.42); });
      portal.group.rotation.z = frame.routeProgress * 0.08;
    });
    motifs.forEach((motif, index) => { motif.group.visible = index === frame.chapterIndex; motif.group.rotation.z = frame.chapterProgress * (index % 2 ? -0.12 : 0.12); });
    particleMaterial.opacity = awake * (mobile ? 0.22 : 0.35);
    crystalMaterial.opacity = awake * (mobile ? 0.12 : 0.2);
    renderer.render(scene, camera);
    renderer.domElement.dataset.renderedProgress = frame.progress.toFixed(4);
    renderer.domElement.dataset.renderCount = String(++draws);
    renderer.domElement.dataset.chapter = WORLD_CHAPTERS[frame.chapterIndex].id;
    renderer.domElement.dataset.pixelRatio = String(renderer.getPixelRatio());
    // No self-scheduled frame: idle pages consume no WebGL render loop.
  }
  function wake() { if (!pending && !disposed && !lost && !document.hidden) pending = requestAnimationFrame(draw); }
  const onVisibility = () => { if (document.hidden) { cancelAnimationFrame(pending); pending = 0; } else wake(); };
  const onPointer = (event: PointerEvent) => {
    if (mobile) return;
    pointer.set(event.clientX / innerWidth * 2 - 1, -(event.clientY / innerHeight * 2 - 1)); wake();
  };
  const onLost = (event: Event) => {
    event.preventDefault(); lost = true; cancelAnimationFrame(pending); pending = 0;
    renderer.domElement.style.visibility = 'hidden'; options.onFallback();
  };
  const observer = new ResizeObserver(resize); observer.observe(host); observer.observe(logoElement);
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('pointermove', onPointer, { passive: true });
  window.addEventListener(WORLD_MEDIA_EVENT, onMedia);
  renderer.domElement.addEventListener('webglcontextlost', onLost);
  resize(); wake();
  return {
    setFrame(value: WorldProgress) { frame = value; wake(); }, resize,
    dispose() {
      disposed = true; logoImage.onload = null; logoImage.onerror = null; cancelAnimationFrame(pending); observer.disconnect();
      currentVideo?.removeEventListener('seeked', decodedFrame);
      window.removeEventListener(WORLD_MEDIA_EVENT, onMedia); window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility); renderer.domElement.removeEventListener('webglcontextlost', onLost);
      scene.background = null; videoTexture?.dispose(); resources.forEach((resource) => resource.dispose());
      scene.clear(); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
    },
  };
}
