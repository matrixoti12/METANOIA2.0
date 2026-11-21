import React from 'react';
import { AlertCircle, Smartphone, Settings, Camera } from 'lucide-react';

interface CameraPermissionGuideProps {
  isOpen: boolean;
  onClose: () => void;
  errorType?: 'NotAllowedError' | 'SecurityError' | 'NotFoundError' | 'NotReadableError' | 'unknown';
}

export const CameraPermissionGuide: React.FC<CameraPermissionGuideProps> = ({ isOpen, onClose, errorType }) => {
  if (!isOpen) return null;

  const getGuideContent = () => {
    switch (errorType) {
      case 'NotAllowedError':
      case 'SecurityError':
        return {
          title: 'Permiso de Cámara Bloqueado',
          steps: [
            {
              platform: 'iOS (Safari)',
              instructions: [
                '1. Abre Configuración > Safari',
                '2. Desplázate hasta "Configuración de sitios web"',
                '3. Toca "Cámara"',
                '4. Busca metanoiapyb.xyz y selecciona "Permitir"',
                '5. Vuelve a esta página y recarga',
              ],
            },
            {
              platform: 'Android (Chrome/Firefox)',
              instructions: [
                '1. Abre el navegador y mantén presionada la dirección URL',
                '2. Toca el ícono de información (i)',
                '3. Ve a "Permisos" > "Cámara"',
                '4. Selecciona "Permitir"',
                '5. Recarga esta página',
              ],
            },
          ],
        };
      case 'NotFoundError':
        return {
          title: 'Sin Cámara Detectada',
          steps: [
            {
              platform: 'Tu Dispositivo',
              instructions: [
                'No se detectó una cámara disponible.',
                '• Asegúrate de tener una cámara funcional',
                '• Intenta usar la opción "Subir Imagen" para seleccionar una foto de tu galería',
                '• Si tu dispositivo no tiene cámara, solo puedes usar fotos guardadas',
              ],
            },
          ],
        };
      case 'NotReadableError':
        return {
          title: 'Cámara en Uso por Otra App',
          steps: [
            {
              platform: 'Solución',
              instructions: [
                '1. Cierra otras aplicaciones que usen la cámara (Zoom, WhatsApp, etc.)',
                '2. Cierra pestañas abiertas en el navegador que puedan usar cámara',
                '3. Reinicia el navegador',
                '4. Intenta nuevamente desde esta página',
              ],
            },
          ],
        };
      default:
        return {
          title: 'Error de Cámara - Pasos Generales',
          steps: [
            {
              platform: 'Opción 1: Permitir Permisos',
              instructions: [
                '1. Ve a Configuración del dispositivo',
                '2. Busca Permisos o Privacidad',
                '3. Selecciona "Cámara"',
                '4. Permite el acceso para tu navegador',
              ],
            },
            {
              platform: 'Opción 2: Subir Imagen',
              instructions: [
                'Si los permisos no funcionan:',
                '• Usa el botón "Subir Imagen"',
                '• Selecciona una foto de tu galería',
                '• Disfruta los marcos profesionales',
              ],
            },
          ],
        };
    }
  };

  const content = getGuideContent();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="alertdialog">
      <div className="bg-[#170526] border border-[#c3a7ff]/30 rounded-2xl max-w-2xl w-full shadow-[0_0_40px_rgba(195,167,255,0.2)] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#170526] border-b border-[#c3a7ff]/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h2 className="font-cyber text-lg font-bold text-white tracking-tight">{content.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-purple-300 hover:text-white text-2xl font-light transition-colors"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {content.steps.map((step, idx) => (
            <div key={idx} className="space-y-2.5">
              <div className="flex items-center gap-2">
                {step.platform.includes('iOS') && <Smartphone className="w-4 h-4 text-[#f4b6ff]" />}
                {step.platform.includes('Android') && <Smartphone className="w-4 h-4 text-[#00f0ff]" />}
                {step.platform.includes('Configuración') && <Settings className="w-4 h-4 text-[#ffe600]" />}
                {step.platform.includes('Cámara') && <Camera className="w-4 h-4 text-[#a9dff3]" />}
                {!step.platform.includes('iOS') &&
                  !step.platform.includes('Android') &&
                  !step.platform.includes('Configuración') &&
                  !step.platform.includes('Cámara') && <span className="w-4 h-4 text-[#c3a7ff]">📱</span>}
                <h3 className="font-cyber font-bold text-purple-100 text-sm tracking-wide">{step.platform}</h3>
              </div>
              <ul className="ml-6 space-y-1.5 font-body text-sm text-purple-200/85">
                {step.instructions.map((instruction, i) => (
                  <li key={i} className="leading-relaxed">
                    {instruction}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Alternative Option */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="font-cyber text-xs font-bold text-[#ffe600] tracking-wider uppercase mb-2">✨ Alternativa</p>
            <p className="text-sm text-purple-200/85 font-body leading-relaxed">
              Si los permisos de cámara no funcionan, siempre puedes usar el botón <strong>"Subir Imagen"</strong> para seleccionar
              una foto de tu galería. Los marcos profesionales funcionarán igual de bien.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#170526]/50 border-t border-[#c3a7ff]/20 px-6 py-4 flex items-center justify-between">
          <p className="text-xs text-purple-300/70 font-mono-cyber">Necesitas más ayuda? Intenta recargar esta página.</p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#b01cc6] to-[#730bb3] text-white font-cyber text-xs font-bold tracking-wider uppercase hover:scale-105 transition-all"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
