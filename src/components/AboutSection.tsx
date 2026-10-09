import React, { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Sparkles, Heart, CheckCircle2, BookOpen, Zap, RefreshCw } from 'lucide-react';
import { playCyberClick, playCyberHover, playNeonChime } from '../utils/audio';

interface BiblicalPromise {
  id: string;
  category: string;
  feeling: string;
  verse: string;
  reference: string;
  devotionalInsight: string;
  color: string;
}

const PROMISES: BiblicalPromise[] = [
  {
    id: 'ansiedad',
    category: 'PAZ INQUEBRANTABLE',
    feeling: 'Ansiedad o Sobrecarga',
    verse: '«Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración... Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.»',
    reference: 'Filipenses 4:6-7',
    devotionalInsight: 'Apaga el ruido de la incertidumbre y descansa en la fidelidad eterna de Dios.',
    color: '#c3a7ff',
  },
  {
    id: 'culpa',
    category: 'NUEVA IDENTIDAD',
    feeling: 'Culpa o Pasado Difícil',
    verse: '«De modo que si alguno está en Cristo, nueva criatura es; las cosas viejas pasaron; he aquí todas son hechas nuevas.»',
    reference: '2 Corintios 5:17',
    devotionalInsight: 'Tu historia no está definida por tus errores, sino por la cruz que te perdonó.',
    color: '#f4b6ff',
  },
  {
    id: 'amor',
    category: 'AMOR INCONDICIONAL',
    feeling: 'Soledad o Desánimo',
    verse: '«Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.»',
    reference: 'Juan 3:16',
    devotionalInsight: 'No necesitas mendigar aprobación ajena: fuiste amado y comprado a precio de sangre.',
    color: '#e4c5ff',
  },
  {
    id: 'fuerza',
    category: 'FUERZA ESPIRITUAL',
    feeling: 'Cansancio Mental',
    verse: '«Él da esfuerzo al cansado, y multiplica las fuerzas al que no tiene ningunas... los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas.»',
    reference: 'Isaías 40:29-31',
    devotionalInsight: 'Cuando tus fuerzas se agotan, la gracia de Dios se perfecciona en tu debilidad.',
    color: '#86efac',
  },
  {
    id: 'proposito',
    category: 'PROPÓSITO DIVINO',
    feeling: 'Búsqueda de Dirección',
    verse: '«Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.»',
    reference: 'Jeremías 29:11',
    devotionalInsight: 'Fuiste diseñado con propósito antes de la fundación del mundo. Dios no improvisa contigo.',
    color: '#93c5fd',
  },
];

interface AboutSectionProps {
  userName?: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ userName }) => {
  const { ref: sectionRef, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.1 });
  const [selectedPromise, setSelectedPromise] = useState<BiblicalPromise>(PROMISES[0]);
  const [hasPrayed, setHasPrayed] = useState(false);

  const handlePromiseSelect = (promise: BiblicalPromise) => {
    playCyberClick();
    setSelectedPromise(promise);
  };

  const handlePrayer = () => {
    playCyberClick('confirm');
    playNeonChime();
    setHasPrayed(true);
  };

  return (
    <section
      id="proposito"
      ref={sectionRef}
      className="relative py-20 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden z-20"
    >
      {/* Resplandores cósmicos suaves de fondo */}

      {/* Encabezado y Romanos 12:2 */}
      <div
        className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center transition-all duration-1000 mb-16 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Columna Izquierda: Mensaje Central y Lema RELOAD */}
        <div className="lg:col-span-6 flex flex-col justify-center text-left">
          
          {/* Badge Oficial RELOAD */}
          <div className="section-label mb-4 inline-flex items-center gap-2 self-start">
            <RefreshCw className="w-3.5 h-3.5 text-[#f4b6ff] animate-spin" style={{ animationDuration: '8s' }} />
            <span className="font-cyber text-xs text-[#e4c5ff] font-bold">
              El propósito de Metanoia
            </span>
          </div>

          <h2 className="section-heading mb-6">Reinicia tu mente.<br />Transforma tu destino.</h2>

          <p className="text-base sm:text-lg text-purple-200/90 font-body leading-relaxed max-w-xl mb-5">
            {userName ? (
              <strong className="text-[#f4b6ff] font-semibold block mb-1">
                {userName}, Dios preparó este tiempo para renovarte.
              </strong>
            ) : null}
            <strong className="text-white font-semibold">METANOIA: RELOAD</strong> es más que un evento de jóvenes: es el momento de hacer una pausa en el caos cotidiano, desconectar de las voces que te desgastan y permitir que el Espíritu Santo reinicie tu mente bajo el señorío de Jesucristo.
          </p>

          <div className="flex flex-wrap gap-2.5">
            <div className="info-tag inline-flex items-center gap-2 text-xs font-cyber text-[#e4c5ff] px-3.5 py-1.5 rounded-xl bg-[#230a42]/70 border border-[#c3a7ff]/30">
              <span className="font-bold">GRIEGO: μετάνοια</span>
              <span className="text-purple-300/70">•</span>
              <span>Cambio Total de Pensamiento</span>
            </div>
            <div className="info-tag inline-flex items-center gap-2 text-xs font-cyber text-[#f4b6ff] px-3.5 py-1.5 rounded-xl bg-[#230a42]/70 border border-[#c3a7ff]/30">
              <Sparkles className="w-3 h-3 text-[#f4b6ff]" />
              <span className="font-bold">RELOAD: Giro de 180° hacia Cristo</span>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Tarjeta Luminous de Romanos 12:2 */}
        <div className="lg:col-span-6">
          <div className="scripture-shell">
            <div className="scripture-feature relative content-surface p-7 sm:p-9 flex flex-col justify-between min-h-[300px] overflow-hidden">

              <div className="relative z-10 mb-3 select-none flex items-center justify-between">
                <span className="font-serif text-5xl sm:text-6xl text-[#f4b6ff] leading-none drop-shadow-[0_0_12px_rgba(244,182,255,0.6)]">
                  “
                </span>
                <span className="info-tag text-xs font-cyber text-[#e4c5ff] bg-[#730bb3]/30 px-3 py-1 rounded-full border border-[#c3a7ff]/35">
                  Nuestra inspiración
                </span>
              </div>

              <blockquote className="relative z-10 font-body text-base sm:text-xl text-purple-100 font-normal leading-relaxed mb-6">
                «No os conforméis a este siglo, sino transformaos por medio de la renovación de vuestro entendimiento, para que comprobéis cuál sea la buena voluntad de Dios, agradable y perfecta.»
              </blockquote>

              <div className="relative z-10 pt-4 border-t border-[#c3a7ff]/20 flex items-center justify-between">
                <cite className="font-cyber text-sm font-bold tracking-wider text-[#f4b6ff] uppercase not-italic drop-shadow-[0_0_8px_rgba(244,182,255,0.5)] flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#f4b6ff]" /> ROMANOS 12:2
                </cite>
                <span className="text-xs font-cyber text-[#c3a7ff]">Palabra de Dios</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN INTERACTIVA: "RELOAD // SELECTOR BÍBLICO DE PROMESAS" */}
      <div className="mt-8 mb-16 p-6 sm:p-10 content-surface relative overflow-hidden">

        <div className="relative z-10 text-center max-w-2xl mx-auto mb-8">
          <div className="info-tag inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#730bb3]/35 border border-[#c3a7ff]/40 text-[#e4c5ff] text-xs font-cyber uppercase mb-3 shadow-[0_0_15px_rgba(195,167,255,0.25)]">
            <Zap className="w-3.5 h-3.5 text-[#f4b6ff]" /> Una palabra para tu corazón
          </div>
          <h3 className="font-cyber-heavy text-2xl sm:text-3xl text-white mb-2">
            ¿Qué carga deseas entregar hoy?
          </h3>
          <p className="text-purple-200/90 text-xs sm:text-sm font-body">
            Selecciona la situación que estás viviendo para activar la promesa bíblica exacta de Cristo para tu vida:
          </p>
        </div>

        {/* Botones de Selección */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-8 relative z-10">
          {PROMISES.map((promise) => {
            const isSelected = selectedPromise.id === promise.id;
            return (
              <button
                key={promise.id}
                onClick={() => handlePromiseSelect(promise)}
                onMouseEnter={() => playCyberHover('subtle')}
                className={`px-4 py-2.5 rounded-2xl font-cyber text-xs tracking-wider transition-all cursor-pointer touch-manipulation min-h-[44px] flex items-center gap-2.5 ${
                  isSelected
                    ? 'choice-selected text-white'
                    : 'bg-[#230a42]/70 text-purple-200 border border-[#c3a7ff]/30 hover:border-[#c3a7ff]/60 hover:text-white'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: isSelected ? '#ffffff' : promise.color, boxShadow: `0 0 8px ${promise.color}` }}
                />
                <span>{promise.feeling}</span>
              </button>
            );
          })}
        </div>

        {/* Tarjeta de Promesa Seleccionada */}
        <div className="relative z-10 max-w-3xl mx-auto p-6 sm:p-8 content-inset transition-all">
          <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-[#c3a7ff]/20">
            <span className="info-tag text-xs font-cyber font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-[#730bb3]/40 border border-[#c3a7ff]/35 text-[#f4b6ff]">
              TEMA: {selectedPromise.category}
            </span>
            <span className="text-xs font-cyber text-[#e4c5ff] flex items-center gap-1.5 font-bold">
              <BookOpen className="w-3.5 h-3.5 text-[#f4b6ff]" />
              {selectedPromise.reference}
            </span>
          </div>

          <p className="text-base sm:text-xl text-white font-body leading-relaxed mb-5 italic">
            {selectedPromise.verse}
          </p>

          <div className="promise-insight flex items-start gap-3">
            <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#f4b6ff]" />
            <p className="text-xs sm:text-sm text-purple-200/95 font-body leading-relaxed">
              <strong className="text-white font-cyber">Para tu día:</strong> {selectedPromise.devotionalInsight}
            </p>
          </div>
        </div>
      </div>

      {/* Los 3 Pilares de Salvación & Oración de Fe */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-6">
        
        {/* 3 Pasos */}
        <div className="salvation-steps lg:col-span-7 content-surface">
          {/* Pilar 1 */}
          <div className="salvation-step p-6">
            <div>
              <div className="font-cyber-heavy text-2xl font-black text-[#c3a7ff] mb-2">01</div>
              <h4 className="font-cyber text-sm font-bold text-white mb-2">
                Reconoce y confiesa
              </h4>
              <p className="font-body text-xs text-purple-200/85 leading-relaxed">
                Reconocer que hemos pecado y que lejos de Dios nuestra vida pierde el rumbo. Sincerarse delante de Él es el inicio de la sanidad.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#c3a7ff]/20 text-[11px] font-cyber text-[#f4b6ff]">
              1 Juan 1:9
            </div>
          </div>

          {/* Pilar 2 */}
          <div className="salvation-step p-6">
            <div>
              <div className="font-cyber-heavy text-2xl font-black text-[#f4b6ff] mb-2">02</div>
              <h4 className="font-cyber text-sm font-bold text-white mb-2">
                Un cambio real
              </h4>
              <p className="font-body text-xs text-purple-200/85 leading-relaxed">
                Metanoia no es remordimiento pasajero; es dar un giro de 180° y correr a los brazos de Jesús, rindiéndole tus planes y tus heridas.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#c3a7ff]/20 text-[11px] font-cyber text-[#f4b6ff]">
              Hechos 3:19
            </div>
          </div>

          {/* Pilar 3 */}
          <div className="salvation-step p-6">
            <div>
              <div className="font-cyber-heavy text-2xl font-black text-[#86efac] mb-2">03</div>
              <h4 className="font-cyber text-sm font-bold text-white mb-2">
                Una vida nueva
              </h4>
              <p className="font-body text-xs text-purple-200/85 leading-relaxed">
                «Os daré corazón nuevo, y pondré espíritu nuevo dentro de vosotros» (Ezequiel 36:26). Ahora eres hijo de Dios con vida eterna.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#c3a7ff]/20 text-[11px] font-cyber text-[#86efac]">
              Ezequiel 36:26
            </div>
          </div>
        </div>

        {/* Oración de Compromiso y Decisión */}
        <div className="lg:col-span-5 content-surface p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#730bb3]/30 border border-[#c3a7ff]/40 flex items-center justify-center text-[#f4b6ff]">
                <Heart className="w-5 h-5 fill-[#f4b6ff]/30" />
              </div>
              <div>
                <span className="text-[10px] font-cyber text-[#c3a7ff] uppercase tracking-wider block">
                  LLAMADO DE SALVACIÓN
                </span>
                <h4 className="font-cyber-heavy text-lg sm:text-xl text-white">
                  Mi decisión por Cristo
                </h4>
              </div>
            </div>

            <p className="font-body text-xs sm:text-sm text-purple-200/90 mb-4">
              {userName ? `${userName}, si ` : 'Si '}hoy anhelas que Jesús tome el timón de tu vida y limpie tu corazón, repite esta oración con fe sincera:
            </p>

            <div className="content-inset p-4 text-purple-100 text-xs sm:text-sm leading-relaxed font-body italic space-y-2">
              <p>
                «Señor Jesús, hoy reconozco que te necesito. Creo que moriste en la cruz por mis pecados y resucitaste al tercer día.»
              </p>
              <p>
                «Te pido perdón por mis faltas. Te abro las puertas de mi corazón y te recibo como mi Señor y Salvador. Dame un nuevo comienzo y escribe mi nombre en el Libro de la Vida. Amén.»
              </p>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#c3a7ff]/20">
            {hasPrayed ? (
              <div className="info-tag p-3.5 rounded-2xl bg-[#86efac]/15 border border-[#86efac]/40 text-[#86efac] text-center font-cyber text-xs flex items-center justify-center gap-2 animate-bounce">
                <CheckCircle2 className="w-4 h-4 text-[#86efac]" />
                <span>¡GLORIA A DIOS! HAS DADO EL PASO MÁS IMPORTANTE</span>
              </div>
            ) : (
              <button
                onClick={handlePrayer}
                onMouseEnter={() => playCyberHover('crisp')}
                className="event-action w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-[#b01cc6] via-[#730bb3] to-[#4331ec] hover:from-[#c3a7ff] hover:to-[#b01cc6] text-white font-cyber text-xs font-bold tracking-wider uppercase shadow-[0_0_25px_rgba(176,28,198,0.5)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 touch-manipulation min-h-[46px]"
              >
                <Sparkles className="w-4 h-4 text-[#f4b6ff]" />
                <span>Confirmo mi fe en Jesús</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
