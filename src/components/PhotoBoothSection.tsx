import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  RotateCcw,
  Download,
  Upload,
  Sparkles,
  Check,
  Share2,
  Sliders,
  RefreshCw,
  Eye,
  AlertCircle,
  Zap,
  Maximize2,
  Minimize2,
  FlipHorizontal,
  ZoomIn,
  ZoomOut,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
} from 'lucide-react';
import {
  playCyberClick,
  playCyberHover,
  playCameraShutter,
  playCountdownBeep,
  playNeonChime,
} from '../utils/audio';

export type FrameId = 'neon-prime' | 'romanos-12' | 'squad-pass' | 'holo-crystal' | 'cyberwave' | 'minimal-obsidian';
export type FilterId = 'normal' | 'cyber' | 'vivid' | 'noir' | 'golden';

interface FrameConfig {
  id: FrameId;
  name: string;
  tag: string;
  primaryColor: string;
  accentColor: string;
  description: string;
}

const FRAMES: FrameConfig[] = [
  {
    id: 'neon-prime',
    name: 'Cyber Neon Prime',
    tag: 'OFICIAL 2026',
    primaryColor: '#ff007f',
    accentColor: '#00f0ff',
    description: 'Bordes láser de neón, HUD cibernético y remates de precisión.',
  },
  {
    id: 'romanos-12',
    name: 'Romanos 12:2',
    tag: 'METAMORFOSIS',
    primaryColor: '#00f0ff',
    accentColor: '#ffe600',
    description: 'Frase bíblica en dorado y cian con prisma holográfico.',
  },
  {
    id: 'squad-pass',
    name: 'Escuadra Juvenil',
    tag: 'CREDENCIAL',
    primaryColor: '#00f0ff',
    accentColor: '#ff007f',
    description: 'Diseño tipo pase de acceso táctico con código de barras y estado.',
  },
  {
    id: 'holo-crystal',
    name: 'Prisma Holográfico',
    tag: '3D AWAKENING',
    primaryColor: '#c026d3',
    accentColor: '#00f0ff',
    description: 'Anillo de neón magenta con geometría 3D y partículas.',
  },
  {
    id: 'cyberwave',
    name: 'Retro Synthwave',
    tag: '80S NEON',
    primaryColor: '#ff00aa',
    accentColor: '#00e5ff',
    description: 'Gradiente retro synth con horizonte de cuadrícula y tipografía cromo.',
  },
  {
    id: 'minimal-obsidian',
    name: 'Minimal Obsidian',
    tag: 'CHIC CYBER',
    primaryColor: '#ffffff',
    accentColor: '#00f0ff',
    description: 'Borde limpio de alta definición con detalles en blanco puro y cian.',
  },
];

const FILTERS: { id: FilterId; label: string; cssFilter: string }[] = [
  { id: 'normal', label: 'Original', cssFilter: 'none' },
  { id: 'cyber', label: 'Cyber Neon', cssFilter: 'contrast(125%) saturate(140%) hue-rotate(10deg)' },
  { id: 'vivid', label: 'Vívido', cssFilter: 'contrast(115%) saturate(160%) brightness(105%)' },
  { id: 'noir', label: 'Noir Cyber', cssFilter: 'grayscale(100%) contrast(140%) brightness(105%)' },
  { id: 'golden', label: 'Praise Glow', cssFilter: 'sepia(35%) contrast(115%) saturate(135%) brightness(108%)' },
];

interface PhotoBoothSectionProps {
  initialAttendeeName?: string;
}

export const PhotoBoothSection: React.FC<PhotoBoothSectionProps> = ({ initialAttendeeName }) => {
  const [selectedFrame, setSelectedFrame] = useState<FrameId>('neon-prime');
  const [selectedFilter, setSelectedFilter] = useState<FilterId>('cyber');
  const [customName, setCustomName] = useState(initialAttendeeName || '');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isFlashActive, setIsFlashActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Photo positioning and framing adjustments
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAutoEnhanced, setIsAutoEnhanced] = useState(false);
  const [showFineAdjustments, setShowFineAdjustments] = useState(false);

  useEffect(() => {
    if (initialAttendeeName && !customName) {
      setCustomName(initialAttendeeName);
    }
  }, [initialAttendeeName]);

  const handleResetAdjustments = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
    setRotation(0);
    setBrightness(100);
    setContrast(100);
    setIsFlipped(false);
    setIsAutoEnhanced(false);
  };

  // One-Tap Quick Action Presets (Mobile-first, instant response)
  const handleQuickFill = () => {
    playCyberClick();
    setZoom(1.25);
    setPanX(0);
    setPanY(0);
  };

  const handleQuickFit = () => {
    playCyberClick();
    setZoom(1.0);
    setPanX(0);
    setPanY(0);
  };

  const handleQuickCenter = () => {
    playCyberClick();
    setPanX(0);
    setPanY(0);
  };

  const handleQuickRotate = () => {
    playCyberClick();
    setRotation((r) => (r + 90) % 360);
  };

  const handleZoomStep = (delta: number) => {
    playCyberClick();
    setZoom((z) => Math.max(0.6, Math.min(2.5, +(z + delta).toFixed(2))));
  };

  const handleQuickFlip = () => {
    playCyberClick();
    setIsFlipped((f) => !f);
  };

  const handleQuickAutoEnhance = () => {
    playCyberClick();
    setIsAutoEnhanced((prev) => {
      const next = !prev;
      if (next) {
        setBrightness(110);
        setContrast(118);
      } else {
        setBrightness(100);
        setContrast(100);
      }
      return next;
    });
  };

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Stop camera stream helper
  const stopCameraStream = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  // Start camera stream with multi-tier mobile fallback
  const startCamera = async (mode: 'user' | 'environment' = facingMode) => {
    stopCameraStream();
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Tu navegador no soporta acceso directo a la cámara.');
      }

      let stream: MediaStream | null = null;
      try {
        // Attempt 1: Standard high-res facingMode
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: mode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch {
        try {
          // Attempt 2: Relaxed constraints (crucial for some mobile browsers)
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: mode },
            audio: false,
          });
        } catch {
          // Attempt 3: Universal fallback
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        }
      }

      if (!stream) {
        throw new Error('No se pudo inicializar la cámara.');
      }

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        await videoRef.current.play().catch(() => {});
      }
      setIsCameraActive(true);
      setCapturedImage(null);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'No se pudo acceder a la cámara. Revisa los permisos o sube una foto.';
      setCameraError(errorMsg);
      setIsCameraActive(false);
    }
  };

  // Flip camera (front / rear)
  const toggleFacingMode = () => {
    playCyberClick();
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    if (isCameraActive) {
      startCamera(newMode);
    }
  };

  // Handle take photo with 3-second countdown
  const initiateCapture = () => {
    if (countdown !== null) return;
    playCyberClick();
    let count = 3;
    setCountdown(count);
    playCountdownBeep(false);

    const timer = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
        playCountdownBeep(false);
      } else {
        clearInterval(timer);
        setCountdown(null);
        playCountdownBeep(true);
        triggerFlashAndSnap();
      }
    }, 1000);
  };

  const triggerFlashAndSnap = () => {
    setIsFlashActive(true);
    playCameraShutter();
    setTimeout(() => {
      setIsFlashActive(false);
    }, 250);

    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const size = Math.min(video.videoWidth || 720, video.videoHeight || 720);
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Crop center square
    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;

    // If user facing mode, flip horizontally for mirror preview
    if (facingMode === 'user') {
      ctx.translate(size, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setCapturedImage(dataUrl);
    stopCameraStream();
    playNeonChime();
  };

  // Upload photo from device
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    playCyberClick();
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setCapturedImage(event.target.result);
        stopCameraStream();
        setCameraError(null);
        playNeonChime();
      }
    };
    reader.readAsDataURL(file);
  };

  // Retake photo
  const handleRetake = () => {
    playCyberClick();
    setCapturedImage(null);
    startCamera(facingMode);
  };

  // Render composite framed image to a canvas
  const renderFramedCanvas = useCallback(
    async (targetCanvas: HTMLCanvasElement, exportMode = false) => {
      const ctx = targetCanvas.getContext('2d');
      if (!ctx) return;

      const size = exportMode ? 1080 : 540;
      targetCanvas.width = size;
      targetCanvas.height = size;

      // 1. Draw base photo or placeholder
      ctx.fillStyle = '#0e001a';
      ctx.fillRect(0, 0, size, size);

      if (capturedImage) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.src = capturedImage;
        });

        ctx.save();
        // Apply photo filter + brightness / contrast
        let filterStr = '';
        if (selectedFilter === 'cyber') {
          filterStr = 'contrast(125%) saturate(140%) hue-rotate(10deg) ';
        } else if (selectedFilter === 'vivid') {
          filterStr = 'contrast(115%) saturate(160%) ';
        } else if (selectedFilter === 'noir') {
          filterStr = 'grayscale(100%) contrast(140%) ';
        } else if (selectedFilter === 'golden') {
          filterStr = 'sepia(35%) contrast(115%) saturate(135%) ';
        }
        filterStr += `brightness(${brightness}%) contrast(${contrast}%)`;
        ctx.filter = filterStr.trim();

        // Transform context for pan, zoom and rotation
        const scaleFactor = size / 540;
        ctx.translate(size / 2 + panX * scaleFactor, size / 2 + panY * scaleFactor);
        if (rotation !== 0) {
          ctx.rotate((rotation * Math.PI) / 180);
        }
        if (isFlipped) {
          ctx.scale(-1, 1);
        }

        // Draw image covering the canvas with zoom
        const imgAspect = img.width / img.height;
        let baseW = size;
        let baseH = size;
        if (imgAspect > 1) {
          baseW = size * imgAspect;
        } else {
          baseH = size / imgAspect;
        }
        const dw = baseW * zoom;
        const dh = baseH * zoom;

        ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
        ctx.restore();
      } else {
        // Placeholder background pattern
        ctx.fillStyle = '#18002e';
        ctx.fillRect(0, 0, size, size);
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
        ctx.lineWidth = 1;
        const step = size / 16;
        for (let x = 0; x <= size; x += step) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, size);
          ctx.stroke();
        }
        for (let y = 0; y <= size; y += step) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(size, y);
          ctx.stroke();
        }
      }

      // 2. Draw Frame Overlay based on selectedFrame
      drawFrameOverlay(ctx, size, selectedFrame, customName);
    },
    [capturedImage, selectedFilter, selectedFrame, customName, zoom, panX, panY, rotation, brightness, contrast, isFlipped]
  );

  // Helper to draw vector frames on canvas
  const drawFrameOverlay = (
    ctx: CanvasRenderingContext2D,
    size: number,
    frameId: FrameId,
    attendeeName: string
  ) => {
    ctx.save();
    const margin = size * 0.045;
    const innerSize = size - margin * 2;

    switch (frameId) {
      case 'neon-prime': {
        // Cyber Neon Prime Frame
        // Outer dark vignette
        const grad = ctx.createRadialGradient(size / 2, size / 2, size * 0.35, size / 2, size / 2, size * 0.65);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.85, 'rgba(10, 0, 22, 0.4)');
        grad.addColorStop(1, 'rgba(10, 0, 22, 0.85)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);

        // Neon Outer border
        ctx.strokeStyle = '#ff007f';
        ctx.lineWidth = size * 0.007;
        ctx.shadowColor = '#ff007f';
        ctx.shadowBlur = size * 0.025;
        ctx.strokeRect(margin, margin, innerSize, innerSize);

        // Neon Inner cyan hairline
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.8)';
        ctx.lineWidth = size * 0.003;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = size * 0.015;
        ctx.strokeRect(margin + size * 0.015, margin + size * 0.015, innerSize - size * 0.03, innerSize - size * 0.03);

        // Corner Cyber Brackets
        const bracketLen = size * 0.08;
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = size * 0.008;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = size * 0.03;

        // Top-Left
        ctx.beginPath();
        ctx.moveTo(margin - size * 0.01, margin + bracketLen);
        ctx.lineTo(margin - size * 0.01, margin - size * 0.01);
        ctx.lineTo(margin + bracketLen, margin - size * 0.01);
        ctx.stroke();

        // Top-Right
        ctx.beginPath();
        ctx.moveTo(size - margin + size * 0.01 - bracketLen, margin - size * 0.01);
        ctx.lineTo(size - margin + size * 0.01, margin - size * 0.01);
        ctx.lineTo(size - margin + size * 0.01, margin + bracketLen);
        ctx.stroke();

        // Bottom-Left
        ctx.beginPath();
        ctx.moveTo(margin - size * 0.01, size - margin - bracketLen);
        ctx.lineTo(margin - size * 0.01, size - margin + size * 0.01);
        ctx.lineTo(margin + bracketLen, size - margin + size * 0.01);
        ctx.stroke();

        // Bottom-Right
        ctx.beginPath();
        ctx.moveTo(size - margin + size * 0.01 - bracketLen, size - margin + size * 0.01);
        ctx.lineTo(size - margin + size * 0.01, size - margin + size * 0.01);
        ctx.lineTo(size - margin + size * 0.01, size - margin - bracketLen);
        ctx.stroke();

        // Top Banner Plaque
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(13, 0, 26, 0.88)';
        ctx.fillRect(size * 0.16, margin * 0.5, size * 0.68, size * 0.09);
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = size * 0.003;
        ctx.strokeRect(size * 0.16, margin * 0.5, size * 0.68, size * 0.09);

        // Top Text
        ctx.fillStyle = '#ffffff';
        ctx.font = `900 ${size * 0.046}px 'Orbitron', 'Russo One', sans-serif`;
        ctx.textAlign = 'center';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = size * 0.015;
        ctx.fillText('METANOIA 2026', size / 2, margin * 0.5 + size * 0.052);

        ctx.fillStyle = '#ff007f';
        ctx.font = `700 ${size * 0.018}px 'Chakra Petch', sans-serif`;
        ctx.letterSpacing = '2px';
        ctx.shadowColor = '#ff007f';
        ctx.shadowBlur = size * 0.01;
        ctx.fillText('METANOIA 2.0 • PACTO Y BENDICIÓN', size / 2, margin * 0.5 + size * 0.076);

        // Bottom Plaque
        ctx.fillStyle = 'rgba(13, 0, 26, 0.92)';
        ctx.fillRect(size * 0.08, size - margin * 1.7, size * 0.84, size * 0.11);
        ctx.strokeStyle = '#ff007f';
        ctx.lineWidth = size * 0.003;
        ctx.strokeRect(size * 0.08, size - margin * 1.7, size * 0.84, size * 0.11);

        // Bottom Text: Date & Location
        ctx.fillStyle = '#ffe600';
        ctx.font = `800 ${size * 0.03}px 'Chakra Petch', sans-serif`;
        ctx.shadowColor = '#ffe600';
        ctx.shadowBlur = size * 0.015;
        ctx.fillText('20 NOVIEMBRE 2026 // GUAZAPA, EL SALVADOR', size / 2, size - margin * 1.7 + size * 0.046);

        ctx.fillStyle = '#ffffff';
        ctx.font = `600 ${size * 0.02}px 'Chakra Petch', sans-serif`;
        ctx.shadowBlur = 0;
        ctx.fillText(
          attendeeName ? `ASISTENTE: ${attendeeName.toUpperCase()}` : 'UN ENCUENTRO • UNA DECISIÓN • UNA NUEVA MENTALIDAD',
          size / 2,
          size - margin * 1.7 + size * 0.08
        );
        break;
      }

      case 'romanos-12': {
        // Romanos 12:2 Transformación Frame
        // Cyan & Amber Holographic Edge
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = size * 0.01;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = size * 0.03;
        ctx.strokeRect(margin, margin, innerSize, innerSize);

        // Corner Diamonds
        const dSize = size * 0.025;
        ctx.fillStyle = '#ffe600';
        ctx.shadowColor = '#ffe600';
        ctx.shadowBlur = size * 0.02;
        [[margin, margin], [size - margin, margin], [margin, size - margin], [size - margin, size - margin]].forEach(
          ([x, y]) => {
            ctx.beginPath();
            ctx.moveTo(x, y - dSize);
            ctx.lineTo(x + dSize, y);
            ctx.lineTo(x, y + dSize);
            ctx.lineTo(x - dSize, y);
            ctx.closePath();
            ctx.fill();
          }
        );

        // Top Biblical Banner
        ctx.fillStyle = 'rgba(10, 0, 25, 0.9)';
        ctx.fillRect(size * 0.06, margin * 0.5, size * 0.88, size * 0.095);
        ctx.strokeStyle = '#ffe600';
        ctx.lineWidth = size * 0.003;
        ctx.strokeRect(size * 0.06, margin * 0.5, size * 0.88, size * 0.095);

        ctx.fillStyle = '#ffe600';
        ctx.font = `900 ${size * 0.026}px 'Chakra Petch', sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('«NO OS CONFORMÉIS A ESTE SIGLO»', size / 2, margin * 0.5 + size * 0.04);

        ctx.fillStyle = '#ffffff';
        ctx.font = `700 ${size * 0.022}px 'Chakra Petch', sans-serif`;
        ctx.fillText('SINO TRANSFORMAOS • ROMANOS 12:2', size / 2, margin * 0.5 + size * 0.075);

        // Bottom Footer Banner
        ctx.fillStyle = 'rgba(10, 0, 25, 0.92)';
        ctx.fillRect(size * 0.06, size - margin * 1.8, size * 0.88, size * 0.12);
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = size * 0.003;
        ctx.strokeRect(size * 0.06, size - margin * 1.8, size * 0.88, size * 0.12);

        ctx.fillStyle = '#00f0ff';
        ctx.font = `900 ${size * 0.045}px 'Orbitron', 'Russo One', sans-serif`;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = size * 0.02;
        ctx.fillText('METANOIA 2026', size / 2, size - margin * 1.8 + size * 0.055);

        ctx.fillStyle = '#ffffff';
        ctx.font = `600 ${size * 0.019}px 'Chakra Petch', sans-serif`;
        ctx.shadowBlur = 0;
        ctx.fillText(
          attendeeName ? `ESCUADRA: ${attendeeName.toUpperCase()} // 20 NOV 2026` : 'RENOVAR LA MENTE PARA VIVIR LO ETERNO',
          size / 2,
          size - margin * 1.8 + size * 0.092
        );
        break;
      }

      case 'squad-pass': {
        // Escuadra Juvenil Tactical HUD Pass
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = size * 0.008;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = size * 0.02;
        ctx.strokeRect(margin, margin, innerSize, innerSize);

        // Caution Stripes Header
        ctx.fillStyle = 'rgba(10, 0, 22, 0.95)';
        ctx.fillRect(size * 0.08, margin * 0.4, size * 0.84, size * 0.085);
        ctx.strokeStyle = '#ff007f';
        ctx.lineWidth = size * 0.004;
        ctx.strokeRect(size * 0.08, margin * 0.4, size * 0.84, size * 0.085);

        ctx.fillStyle = '#00f0ff';
        ctx.font = `900 ${size * 0.038}px 'Orbitron', sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('METANOIA // SQUAD PASS', size / 2, margin * 0.4 + size * 0.045);

        ctx.fillStyle = '#ffe600';
        ctx.font = `700 ${size * 0.018}px 'Chakra Petch', sans-serif`;
        ctx.fillText('SYS.STATUS: RENOVADO // NIVEL: GUERRERO DE FE', size / 2, margin * 0.4 + size * 0.072);

        // Bottom Tactical Barcode & Data
        ctx.fillStyle = 'rgba(10, 0, 22, 0.95)';
        ctx.fillRect(size * 0.06, size - margin * 2.1, size * 0.88, size * 0.15);
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = size * 0.004;
        ctx.strokeRect(size * 0.06, size - margin * 2.1, size * 0.88, size * 0.15);

        // Mock Barcode
        const barX = size * 0.1;
        const barY = size - margin * 2.1 + size * 0.02;
        const barH = size * 0.045;
        ctx.fillStyle = '#ffffff';
        for (let b = 0; b < 45; b++) {
          const w = b % 4 === 0 ? 4 : b % 2 === 0 ? 2.5 : 1.5;
          ctx.fillRect(barX + b * (size * 0.008), barY, w, barH);
        }

        // Tactical Data on the right
        ctx.textAlign = 'right';
        ctx.fillStyle = '#ff007f';
        ctx.font = `800 ${size * 0.024}px 'Orbitron', sans-serif`;
        ctx.fillText('20-NOV-2026', size * 0.9, barY + size * 0.022);
        ctx.fillStyle = '#00f0ff';
        ctx.font = `700 ${size * 0.019}px 'Chakra Petch', sans-serif`;
        ctx.fillText('GUAZAPA • SV', size * 0.9, barY + size * 0.042);

        // Custom Name below
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.font = `700 ${size * 0.024}px 'Chakra Petch', sans-serif`;
        ctx.fillText(
          attendeeName ? `SOLDADO: ${attendeeName.toUpperCase()}` : 'CREDENCIAL METANOIA 2.0 • PACTO Y BENDICIÓN',
          size / 2,
          size - margin * 2.1 + size * 0.115
        );
        break;
      }

      case 'holo-crystal': {
        // Holographic 3D Crystal & Neon Ring
        // Giant circular glowing ring framing
        ctx.save();
        ctx.strokeStyle = '#c026d3';
        ctx.lineWidth = size * 0.015;
        ctx.shadowColor = '#c026d3';
        ctx.shadowBlur = size * 0.04;
        ctx.strokeRect(margin, margin, innerSize, innerSize);

        // Inner glowing circle accent
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
        ctx.lineWidth = size * 0.003;
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size * 0.42, 0, Math.PI * 2);
        ctx.stroke();

        // HUD Crosshairs
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(size / 2 - 20, size / 2);
        ctx.lineTo(size / 2 + 20, size / 2);
        ctx.moveTo(size / 2, size / 2 - 20);
        ctx.lineTo(size / 2, size / 2 + 20);
        ctx.stroke();
        ctx.restore();

        // Top Header
        ctx.fillStyle = 'rgba(15, 0, 30, 0.85)';
        ctx.fillRect(size * 0.14, margin * 0.5, size * 0.72, size * 0.085);
        ctx.strokeStyle = '#c026d3';
        ctx.lineWidth = size * 0.003;
        ctx.strokeRect(size * 0.14, margin * 0.5, size * 0.72, size * 0.085);

        ctx.fillStyle = '#ffffff';
        ctx.font = `900 ${size * 0.044}px 'Orbitron', 'Russo One', sans-serif`;
        ctx.textAlign = 'center';
        ctx.shadowColor = '#c026d3';
        ctx.shadowBlur = size * 0.02;
        ctx.fillText('METANOIA 2026', size / 2, margin * 0.5 + size * 0.048);

        ctx.fillStyle = '#00f0ff';
        ctx.font = `700 ${size * 0.018}px 'Chakra Petch', sans-serif`;
        ctx.fillText('PRISMA ESPIRITUAL // NUEVA MENTALIDAD', size / 2, margin * 0.5 + size * 0.073);

        // Bottom Footer
        ctx.fillStyle = 'rgba(15, 0, 30, 0.9)';
        ctx.fillRect(size * 0.1, size - margin * 1.7, size * 0.8, size * 0.1);
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = size * 0.003;
        ctx.strokeRect(size * 0.1, size - margin * 1.7, size * 0.8, size * 0.1);

        ctx.fillStyle = '#ffe600';
        ctx.font = `800 ${size * 0.026}px 'Chakra Petch', sans-serif`;
        ctx.fillText('20 NOVIEMBRE • PACTO Y BENDICIÓN GUAZAPA', size / 2, size - margin * 1.7 + size * 0.045);

        ctx.fillStyle = '#ffffff';
        ctx.font = `600 ${size * 0.02}px 'Chakra Petch', sans-serif`;
        ctx.fillText(
          attendeeName ? `${attendeeName.toUpperCase()} • EN SINTONÍA` : 'EXPERIENCIA DE ALABANZA, PALABRA Y PODER',
          size / 2,
          size - margin * 1.7 + size * 0.078
        );
        break;
      }

      case 'cyberwave': {
        // Retro Synthwave 80s/90s Grid
        ctx.save();
        // Magenta & Cyan Dual Gradient Border
        const borderGrad = ctx.createLinearGradient(0, 0, size, size);
        borderGrad.addColorStop(0, '#ff00aa');
        borderGrad.addColorStop(0.5, '#7928ca');
        borderGrad.addColorStop(1, '#00e5ff');
        ctx.strokeStyle = borderGrad;
        ctx.lineWidth = size * 0.012;
        ctx.shadowColor = '#ff00aa';
        ctx.shadowBlur = size * 0.03;
        ctx.strokeRect(margin, margin, innerSize, innerSize);

        // Horizon Grid lines at bottom
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
        ctx.lineWidth = 1;
        for (let i = 1; i <= 6; i++) {
          ctx.beginPath();
          ctx.moveTo(margin, size - margin - i * (size * 0.02));
          ctx.lineTo(size - margin, size - margin - i * (size * 0.02));
          ctx.stroke();
        }
        ctx.restore();

        // Top Banner
        ctx.fillStyle = 'rgba(10, 0, 20, 0.88)';
        ctx.fillRect(size * 0.12, margin * 0.5, size * 0.76, size * 0.09);
        ctx.strokeStyle = '#ff00aa';
        ctx.lineWidth = size * 0.003;
        ctx.strokeRect(size * 0.12, margin * 0.5, size * 0.76, size * 0.09);

        ctx.fillStyle = '#00e5ff';
        ctx.font = `900 ${size * 0.046}px 'Orbitron', sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('METANOIA 2026', size / 2, margin * 0.5 + size * 0.052);

        ctx.fillStyle = '#ff00aa';
        ctx.font = `700 ${size * 0.018}px 'Chakra Petch', sans-serif`;
        ctx.fillText('REBOOT YOUR MIND // METANOIA 2.0', size / 2, margin * 0.5 + size * 0.076);

        // Bottom Banner
        ctx.fillStyle = 'rgba(10, 0, 20, 0.92)';
        ctx.fillRect(size * 0.08, size - margin * 1.8, size * 0.84, size * 0.11);
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = size * 0.003;
        ctx.strokeRect(size * 0.08, size - margin * 1.8, size * 0.84, size * 0.11);

        ctx.fillStyle = '#ffe600';
        ctx.font = `800 ${size * 0.028}px 'Chakra Petch', sans-serif`;
        ctx.fillText('20 NOVIEMBRE • GUAZAPA, EL SALVADOR', size / 2, size - margin * 1.8 + size * 0.048);

        ctx.fillStyle = '#ffffff';
        ctx.font = `600 ${size * 0.02}px 'Chakra Petch', sans-serif`;
        ctx.fillText(
          attendeeName ? attendeeName.toUpperCase() : 'PACTO Y BENDICIÓN • METANOIA 2026',
          size / 2,
          size - margin * 1.8 + size * 0.082
        );
        break;
      }

      case 'minimal-obsidian': {
        // High Fashion Cyber Minimalist
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = size * 0.005;
        ctx.strokeRect(margin, margin, innerSize, innerSize);

        // Cyan Corner Tick Accents
        const tick = size * 0.04;
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = size * 0.006;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = size * 0.015;

        // 4 corners
        ctx.beginPath();
        ctx.moveTo(margin - 4, margin + tick);
        ctx.lineTo(margin - 4, margin - 4);
        ctx.lineTo(margin + tick, margin - 4);

        ctx.moveTo(size - margin + 4 - tick, margin - 4);
        ctx.lineTo(size - margin + 4, margin - 4);
        ctx.lineTo(size - margin + 4, margin + tick);

        ctx.moveTo(margin - 4, size - margin - tick);
        ctx.lineTo(margin - 4, size - margin + 4);
        ctx.lineTo(margin + tick, size - margin + 4);

        ctx.moveTo(size - margin + 4 - tick, size - margin + 4);
        ctx.lineTo(size - margin + 4, size - margin + 4);
        ctx.lineTo(size - margin + 4, size - margin + 4 - tick);
        ctx.stroke();

        // Top Minimalist Header
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(10, 0, 20, 0.85)';
        ctx.fillRect(size * 0.2, margin * 0.45, size * 0.6, size * 0.075);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(size * 0.2, margin * 0.45, size * 0.6, size * 0.075);

        ctx.fillStyle = '#ffffff';
        ctx.font = `800 ${size * 0.038}px 'Orbitron', sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('M E T A N O I A', size / 2, margin * 0.45 + size * 0.048);

        ctx.fillStyle = '#00f0ff';
        ctx.font = `700 ${size * 0.018}px 'Chakra Petch', sans-serif`;
        ctx.fillText('2 0 2 6 • V I G I L I A', size / 2, margin * 0.45 + size * 0.068);

        // Bottom Minimalist Text
        ctx.fillStyle = 'rgba(10, 0, 20, 0.85)';
        ctx.fillRect(size * 0.1, size - margin * 1.6, size * 0.8, size * 0.09);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(size * 0.1, size - margin * 1.6, size * 0.8, size * 0.09);

        ctx.fillStyle = '#ffffff';
        ctx.font = `700 ${size * 0.024}px 'Chakra Petch', sans-serif`;
        ctx.fillText(
          attendeeName ? attendeeName.toUpperCase() : 'UNA MENTE RENOVADA. UN FUTURO TRANSFORMADO.',
          size / 2,
          size - margin * 1.6 + size * 0.04
        );

        ctx.fillStyle = '#00f0ff';
        ctx.font = `600 ${size * 0.018}px 'Chakra Petch', sans-serif`;
        ctx.fillText('20 NOV 2026 • GUAZAPA, EL SALVADOR', size / 2, size - margin * 1.6 + size * 0.068);
        break;
      }
    }
    ctx.restore();
  };

  // Re-draw preview canvas whenever frame, filter, image, or name changes
  useEffect(() => {
    if (previewCanvasRef.current) {
      renderFramedCanvas(previewCanvasRef.current, false);
    }
  }, [selectedFrame, selectedFilter, capturedImage, customName, renderFramedCanvas]);

  // Download High-Resolution Composite Image (1080x1080)
  const handleDownload = async () => {
    playCyberClick();
    setIsDownloading(true);
    try {
      const exportCanvas = document.createElement('canvas');
      await renderFramedCanvas(exportCanvas, true);

      const link = document.createElement('a');
      link.download = `metanoia-2026-foto-${selectedFrame}.png`;
      link.href = exportCanvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      playNeonChime();
    } catch {
      // Fallback
    } finally {
      setIsDownloading(false);
    }
  };

  // Share photo
  const handleShare = async () => {
    playCyberClick();
    try {
      const exportCanvas = document.createElement('canvas');
      await renderFramedCanvas(exportCanvas, true);

      exportCanvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'metanoia-2026.png', { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Mi Foto Metanoia 2026',
            text: '¡Listos para METANOIA 2.0! 20 de noviembre en Guazapa.',
          });
        } else {
          // Clipboard fallback
          try {
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2500);
          } catch {
            handleDownload();
          }
        }
      }, 'image/png');
    } catch {
      handleDownload();
    }
  };

  // Cleanup camera stream when unmounting
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, [stopCameraStream]);

  return (
    <section id="photospot" className="relative py-24 px-4 sm:px-8 max-w-7xl mx-auto z-20">
      {/* Top Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] text-xs font-mono-cyber tracking-[0.25em] uppercase mb-4 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>PHOTO-SPOT CYBER • METANOIA 2026</span>
        </div>

        <h2 className="cyber-metanoia-title text-4xl xs:text-5xl sm:text-6xl text-white tracking-tight leading-none mb-3">
          CAPTURA TU <span className="text-[#00f0ff] drop-shadow-[0_0_20px_rgba(0,240,255,0.8)]">MOMENTO</span>
        </h2>

        <p className="font-body text-sm sm:text-base text-purple-200/80 max-w-xl mx-auto">
          Tómate una foto o sube tu imagen, selecciona tu marco cibernético oficial de Metanoia 2026 y descárgala en alta resolución para tus redes.
        </p>
      </div>

      {/* Main Grid: Left Viewer/Camera, Right Frame Selector & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Camera / Canvas Viewport (Cols 7) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full max-w-[520px] aspect-square rounded-3xl bg-[#0c0018] border-2 border-[#00f0ff]/30 shadow-[0_0_50px_rgba(0,240,255,0.2)] overflow-hidden flex items-center justify-center p-2 group">
            {/* Corner Tech Decals */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#00f0ff] z-30 pointer-events-none" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#ff007f] z-30 pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#00f0ff] z-30 pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#ff007f] z-30 pointer-events-none" />

            {/* Flash Effect Layer */}
            {isFlashActive && (
              <div className="absolute inset-0 bg-white z-50 animate-out fade-out duration-300 pointer-events-none" />
            )}

            {/* Countdown Overlay */}
            {countdown !== null && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center pointer-events-none">
                <span className="font-cyber-heavy text-8xl sm:text-9xl text-[#00f0ff] animate-ping drop-shadow-[0_0_30px_#00f0ff]">
                  {countdown}
                </span>
              </div>
            )}

            {/* CASE 1: Live Video Camera Stream */}
            {isCameraActive && (
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover rounded-2xl ${
                    facingMode === 'user' ? 'scale-x-[-1]' : ''
                  }`}
                  style={{
                    filter:
                      FILTERS.find((f) => f.id === selectedFilter)?.cssFilter || 'none',
                  }}
                />

                {/* Realtime HTML Frame Preview Overlay over live camera */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Subtle scanline */}
                  <div className="w-full h-full border-4 border-dashed border-[#00f0ff]/30 rounded-2xl flex flex-col justify-between p-4">
                    <div className="flex justify-between items-center text-xs font-mono-cyber text-[#00f0ff] bg-black/50 backdrop-blur-md px-3 py-1 rounded-md">
                      <span>CAM // LIVE</span>
                      <span>{selectedFrame.toUpperCase()}</span>
                    </div>
                    <div className="text-center text-xs font-cyber text-white/80 bg-black/50 backdrop-blur-md py-1 px-2 rounded-md">
                      MARCO: {FRAMES.find((f) => f.id === selectedFrame)?.name}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CASE 2: Canvas Preview (When photo captured or uploaded or standby) */}
            {!isCameraActive && (
              <div className="relative w-full h-full rounded-2xl overflow-hidden flex items-center justify-center">
                <canvas
                  ref={previewCanvasRef}
                  className="w-full h-full object-contain rounded-2xl shadow-inner"
                />

                {/* Overlay Prompt when NO photo captured yet */}
                {!capturedImage && (
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
                    <div className="w-16 h-16 rounded-2xl bg-[#00f0ff]/15 border border-[#00f0ff]/40 flex items-center justify-center mb-4 text-[#00f0ff] shadow-[0_0_25px_rgba(0,240,255,0.4)]">
                      <Camera className="w-8 h-8" />
                    </div>
                    <h3 className="font-cyber-heavy text-xl sm:text-2xl text-white tracking-tight mb-2">
                      ¡ACTIVA TU CÁMARA O SUBE TU FOTO!
                    </h3>
                    <p className="font-body text-xs sm:text-sm text-purple-200/80 max-w-sm mb-6">
                      Captúrate con los marcos oficiales de Metanoia 2026 y forma parte de la generación que renueva su mente.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <button
                        onClick={() => {
                          playCyberClick();
                          startCamera();
                        }}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#ff007f] to-[#7928ca] text-white font-cyber text-xs font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(255,0,127,0.5)] hover:scale-105 transition-all cursor-pointer"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Abrir Cámara</span>
                      </button>

                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-cyber text-xs font-bold tracking-wider uppercase transition-all cursor-pointer"
                      >
                        <Upload className="w-4 h-4 text-[#00f0ff]" />
                        <span>Subir Imagen</span>
                      </button>
                    </div>

                    {cameraError && (
                      <div className="mt-4 flex items-center gap-2 text-xs text-rose-300 bg-rose-950/60 border border-rose-500/30 px-3 py-2 rounded-lg max-w-sm text-left">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                        <span>{cameraError}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Camera & Viewport Action Bar */}
          <div className="w-full max-w-[520px] mt-4 flex items-center justify-between gap-3">
            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            {isCameraActive ? (
              <>
                {/* Switch Camera Front/Back */}
                <button
                  onClick={toggleFacingMode}
                  onMouseEnter={() => playCyberHover('subtle')}
                  title="Cambiar cámara"
                  className="p-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-purple-200 hover:text-[#00f0ff] transition-all cursor-pointer focus:outline-none touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>

                {/* Big Capture Trigger */}
                <button
                  onClick={initiateCapture}
                  onMouseEnter={() => playCyberHover('crisp')}
                  disabled={countdown !== null}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#ff007f] via-[#c026d3] to-[#00f0ff] text-white font-cyber text-sm font-extrabold tracking-widest uppercase shadow-[0_0_25px_rgba(255,0,127,0.6)] hover:shadow-[0_0_35px_rgba(255,0,127,0.8)] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 touch-manipulation min-h-[48px]"
                >
                  <Camera className="w-5 h-5" />
                  <span>TOMAR FOTO (3s)</span>
                </button>

                {/* Cancel Camera Stream */}
                <button
                  onClick={() => {
                    playCyberClick();
                    stopCameraStream();
                  }}
                  onMouseEnter={() => playCyberHover('subtle')}
                  title="Cerrar cámara"
                  className="p-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-purple-200 hover:text-white transition-all cursor-pointer touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                {/* Retake / Reopen Camera */}
                <button
                  onClick={handleRetake}
                  onMouseEnter={() => playCyberHover('crisp')}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-purple-200 hover:text-white text-xs font-cyber tracking-wider uppercase transition-all cursor-pointer touch-manipulation min-h-[44px]"
                >
                  <Camera className="w-4 h-4 text-[#00f0ff]" />
                  <span>{capturedImage ? 'Tomar Otra' : 'Abrir Cámara'}</span>
                </button>

                {/* Upload Image Alternative */}
                <button
                  onClick={() => {
                    playCyberClick();
                    fileInputRef.current?.click();
                  }}
                  onMouseEnter={() => playCyberHover('crisp')}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-purple-200 hover:text-white text-xs font-cyber tracking-wider uppercase transition-all cursor-pointer touch-manipulation min-h-[44px]"
                >
                  <Upload className="w-4 h-4 text-[#ff007f]" />
                  <span>Subir Foto</span>
                </button>

                {/* Download Button */}
                <button
                  onClick={handleDownload}
                  onMouseEnter={() => capturedImage && playCyberHover('crisp')}
                  disabled={!capturedImage || isDownloading}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-cyber text-xs font-bold tracking-wider uppercase transition-all cursor-pointer touch-manipulation min-h-[44px] ${
                    capturedImage
                      ? 'bg-gradient-to-r from-[#00f0ff] to-[#ff007f] text-white shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.7)] hover:scale-[1.02]'
                      : 'bg-white/5 border border-white/10 text-white/40 cursor-not-allowed'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span>{isDownloading ? 'Generando...' : 'Descargar Foto'}</span>
                </button>

                {/* Share Button */}
                {capturedImage && (
                  <button
                    onClick={handleShare}
                    onMouseEnter={() => playCyberHover('subtle')}
                    title="Compartir o Copiar"
                    className="p-3 rounded-xl bg-[#00f0ff]/15 hover:bg-[#00f0ff]/25 border border-[#00f0ff]/40 text-[#00f0ff] hover:text-white transition-all cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.2)] touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    {isCopied ? <Check className="w-5 h-5 text-green-400" /> : <Share2 className="w-5 h-5" />}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Column: Marco & Filter Selectors & Customization (Cols 5) */}
        <div className="lg:col-span-5 flex flex-col gap-6 text-left">
          {/* 1. Custom Name / Squad Input */}
          <div className="p-5 rounded-2xl bg-[#0e001f]/80 backdrop-blur-xl border border-white/10 shadow-lg">
            <label className="flex items-center justify-between text-xs font-cyber tracking-wider text-purple-200 mb-2 uppercase">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#ffe600]" />
                <span>Tu Nombre o Escuadra (Opcional)</span>
              </span>
              <span className="text-[10px] text-purple-400">Aparecerá en el marco</span>
            </label>
            <input
              type="text"
              maxLength={26}
              placeholder="Ej. Jonathan • Escuadra Alpha"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-[#00f0ff] focus:shadow-[0_0_15px_rgba(0,240,255,0.25)] transition-all font-body"
            />
          </div>

          {/* 2. Frames Selector */}
          <div className="p-5 rounded-2xl bg-[#0e001f]/80 backdrop-blur-xl border border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-cyber tracking-wider text-purple-200 uppercase font-bold">
                Elige tu Estilo de Marco (6)
              </span>
              <span className="text-[11px] font-mono-cyber text-[#00f0ff]">METANOIA 2026</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {FRAMES.map((frame) => {
                const isSelected = selectedFrame === frame.id;
                return (
                  <button
                    key={frame.id}
                    onClick={() => {
                      playCyberClick();
                      setSelectedFrame(frame.id);
                    }}
                    onMouseEnter={playCyberHover}
                    className={`relative p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[82px] ${
                      isSelected
                        ? 'bg-white/15 border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.3)] scale-[1.02]'
                        : 'bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/8'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: frame.primaryColor, boxShadow: `0 0 8px ${frame.primaryColor}` }}
                      />
                      <span className="text-[9px] font-mono-cyber tracking-wider text-purple-300/70 uppercase">
                        {frame.tag}
                      </span>
                    </div>

                    <div>
                      <div className={`font-cyber text-xs font-bold ${isSelected ? 'text-white' : 'text-purple-100'}`}>
                        {frame.name}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="mt-3 text-[11px] font-body text-purple-300/70">
              {FRAMES.find((f) => f.id === selectedFrame)?.description}
            </p>
          </div>

          {/* 3. Photo Filters Selector */}
          <div className="p-5 rounded-2xl bg-[#0e001f]/80 backdrop-blur-xl border border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-cyber tracking-wider text-purple-200 uppercase font-bold flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#ff007f]" />
                <span>Filtro de Foto</span>
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {FILTERS.map((f) => {
                const isSelected = selectedFilter === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => {
                      playCyberClick();
                      setSelectedFilter(f.id);
                    }}
                    className={`py-2 px-2 rounded-lg border text-center text-[11px] font-cyber tracking-wider transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#ff007f]/25 border-[#ff007f] text-white shadow-[0_0_10px_rgba(255,0,127,0.35)]'
                        : 'bg-white/5 border-white/10 text-purple-300 hover:border-white/20'
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Streamlined One-Tap Quick Actions Toolbar (Ultra-compact & Mobile-friendly) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0e001f]/85 backdrop-blur-xl border border-[#00f0ff]/30 shadow-lg">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-cyber tracking-wider text-[#00f0ff] uppercase font-bold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#ffe600]" />
                <span>Acciones Rápidas de Encuadre</span>
              </span>
              <button
                type="button"
                onClick={handleResetAdjustments}
                onMouseEnter={() => playCyberHover('subtle')}
                className="text-[10px] font-mono-cyber text-purple-300 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md border border-white/15 cursor-pointer transition-colors"
                title="Reiniciar encuadre y filtros"
              >
                Reset
              </button>
            </div>

            {/* Quick Action Chips Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-4 gap-1.5 xs:gap-2">
              {/* 1. Llenar / Fill */}
              <button
                type="button"
                onClick={handleQuickFill}
                onMouseEnter={() => playCyberHover('subtle')}
                className="py-2 px-1.5 rounded-xl bg-white/5 hover:bg-[#00f0ff]/15 border border-white/10 hover:border-[#00f0ff]/40 text-purple-200 hover:text-white flex flex-col items-center justify-center gap-1 cursor-pointer transition-all text-[10px] font-cyber tracking-wider uppercase active:scale-95"
                title="Llenar todo el marco con la foto"
              >
                <Maximize2 className="w-4 h-4 text-[#00f0ff]" />
                <span>Llenar</span>
              </button>

              {/* 2. Ajustar / Fit */}
              <button
                type="button"
                onClick={handleQuickFit}
                onMouseEnter={() => playCyberHover('subtle')}
                className="py-2 px-1.5 rounded-xl bg-white/5 hover:bg-[#00f0ff]/15 border border-white/10 hover:border-[#00f0ff]/40 text-purple-200 hover:text-white flex flex-col items-center justify-center gap-1 cursor-pointer transition-all text-[10px] font-cyber tracking-wider uppercase active:scale-95"
                title="Ajustar foto completa dentro del marco"
              >
                <Minimize2 className="w-4 h-4 text-[#00f0ff]" />
                <span>Ajustar</span>
              </button>

              {/* 3. Centrar */}
              <button
                type="button"
                onClick={handleQuickCenter}
                onMouseEnter={() => playCyberHover('subtle')}
                className="py-2 px-1.5 rounded-xl bg-white/5 hover:bg-[#ffe600]/15 border border-white/10 hover:border-[#ffe600]/40 text-purple-200 hover:text-white flex flex-col items-center justify-center gap-1 cursor-pointer transition-all text-[10px] font-cyber tracking-wider uppercase active:scale-95"
                title="Centrar la foto"
              >
                <RefreshCw className="w-4 h-4 text-[#ffe600]" />
                <span>Centrar</span>
              </button>

              {/* 4. Girar 90° */}
              <button
                type="button"
                onClick={handleQuickRotate}
                onMouseEnter={() => playCyberHover('subtle')}
                className="py-2 px-1.5 rounded-xl bg-white/5 hover:bg-[#ff007f]/15 border border-white/10 hover:border-[#ff007f]/40 text-purple-200 hover:text-white flex flex-col items-center justify-center gap-1 cursor-pointer transition-all text-[10px] font-cyber tracking-wider uppercase active:scale-95"
                title="Girar foto 90 grados"
              >
                <RotateCcw className="w-4 h-4 text-[#ff007f]" />
                <span>Girar 90°</span>
              </button>

              {/* 5. Espejo (Flip) */}
              <button
                type="button"
                onClick={handleQuickFlip}
                onMouseEnter={() => playCyberHover('subtle')}
                className={`py-2 px-1.5 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all text-[10px] font-cyber tracking-wider uppercase active:scale-95 ${
                  isFlipped
                    ? 'bg-[#c026d3]/25 border-[#c026d3] text-white shadow-[0_0_12px_rgba(192,38,211,0.4)]'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-purple-200 hover:text-white'
                }`}
                title="Modo espejo / selfie"
              >
                <FlipHorizontal className="w-4 h-4 text-[#c026d3]" />
                <span>Espejo</span>
              </button>

              {/* 6. Zoom In */}
              <button
                type="button"
                onClick={() => handleZoomStep(0.15)}
                onMouseEnter={() => playCyberHover('subtle')}
                className="py-2 px-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-purple-200 hover:text-white flex flex-col items-center justify-center gap-1 cursor-pointer transition-all text-[10px] font-cyber tracking-wider uppercase active:scale-95"
                title="Acercar foto"
              >
                <ZoomIn className="w-4 h-4 text-[#00ff9d]" />
                <span>Zoom +</span>
              </button>

              {/* 7. Zoom Out */}
              <button
                type="button"
                onClick={() => handleZoomStep(-0.15)}
                onMouseEnter={() => playCyberHover('subtle')}
                className="py-2 px-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-purple-200 hover:text-white flex flex-col items-center justify-center gap-1 cursor-pointer transition-all text-[10px] font-cyber tracking-wider uppercase active:scale-95"
                title="Alejar foto"
              >
                <ZoomOut className="w-4 h-4 text-[#00ff9d]" />
                <span>Zoom -</span>
              </button>

              {/* 8. Auto HD Enhancement Toggle */}
              <button
                type="button"
                onClick={handleQuickAutoEnhance}
                onMouseEnter={() => playCyberHover('subtle')}
                className={`py-2 px-1.5 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all text-[10px] font-cyber tracking-wider uppercase active:scale-95 ${
                  isAutoEnhanced
                    ? 'bg-[#ffe600]/25 border-[#ffe600] text-white shadow-[0_0_12px_rgba(255,230,0,0.4)]'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-purple-200 hover:text-white'
                }`}
                title="Auto-mejora de brillo y contraste HD"
              >
                <Sparkles className="w-4 h-4 text-[#ffe600]" />
                <span>Auto HD</span>
              </button>
            </div>

            {/* Collapsible Manual Sliders Toggle (Saves 80% screen space, opens only on demand) */}
            <div className="mt-3 pt-2.5 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowFineAdjustments((v) => !v)}
                onMouseEnter={() => playCyberHover('subtle')}
                className="w-full flex items-center justify-between text-[11px] font-mono-cyber text-purple-300 hover:text-white transition-colors cursor-pointer py-1"
              >
                <span className="flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#00f0ff]" />
                  <span>Ajustes Finos Manuales ({zoom.toFixed(2)}x, {panX}px, {panY}px)</span>
                </span>
                {showFineAdjustments ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showFineAdjustments && (
                <div className="space-y-3 pt-3 mt-1 animate-in fade-in slide-in-from-top-2 duration-200 text-xs font-mono-cyber text-purple-200">
                  {/* Fine Zoom Slider */}
                  <div>
                    <div className="flex justify-between mb-1 text-[10px]">
                      <span className="text-purple-300">ZOOM EXACTO:</span>
                      <span className="text-[#00f0ff] font-bold">{zoom.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.6"
                      max="2.5"
                      step="0.05"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-full accent-[#00f0ff] cursor-pointer"
                    />
                  </div>

                  {/* Fine Pan X & Y */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex justify-between mb-1 text-[10px]">
                        <span className="text-purple-300">MOVER X:</span>
                        <span className="text-[#ff007f]">{panX}px</span>
                      </div>
                      <input
                        type="range"
                        min="-160"
                        max="160"
                        value={panX}
                        onChange={(e) => setPanX(parseInt(e.target.value))}
                        className="w-full accent-[#ff007f] cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 text-[10px]">
                        <span className="text-purple-300">MOVER Y:</span>
                        <span className="text-[#ffe600]">{panY}px</span>
                      </div>
                      <input
                        type="range"
                        min="-160"
                        max="160"
                        value={panY}
                        onChange={(e) => setPanY(parseInt(e.target.value))}
                        className="w-full accent-[#ffe600] cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Brightness & Contrast */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <div className="flex justify-between mb-1 text-[10px]">
                        <span className="text-purple-300">BRILLO:</span>
                        <span className="text-[#00ff9d]">{brightness}%</span>
                      </div>
                      <input
                        type="range"
                        min="60"
                        max="140"
                        value={brightness}
                        onChange={(e) => setBrightness(parseInt(e.target.value))}
                        className="w-full accent-[#00ff9d] cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 text-[10px]">
                        <span className="text-purple-300">CONTRASTE:</span>
                        <span className="text-[#c026d3]">{contrast}%</span>
                      </div>
                      <input
                        type="range"
                        min="60"
                        max="150"
                        value={contrast}
                        onChange={(e) => setContrast(parseInt(e.target.value))}
                        className="w-full accent-[#c026d3] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 5. Quick Specs & Details */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs font-cyber text-purple-300">
            <span>Resolución: 1080 x 1080 (HD)</span>
            <span className="text-[#00f0ff] font-bold">20 NOVIEMBRE 2026</span>
          </div>
        </div>
      </div>
    </section>
  );
};
