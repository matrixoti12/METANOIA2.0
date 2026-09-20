import React, { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Sparkles, Heart, CheckCircle2, Flame, BookOpen, Shield, Zap, ArrowRight, Sun, MessageSquareHeart } from 'lucide-react';
import { playCyberClick, playCyberHover, playNeonChime } from '../utils/audio';
import { BlurText } from './BlurText';

interface BiblicalPromise {
  id: string;
  category: string;
  feeling: string;
  verse: string;
  reference: string;
  cyberAdvice: string;
  color: string;
}

const PROMISES: BiblicalPromise[] = [
  {
    id: 'ansiedad',
    category: 'PAZ MENTAL',
    feeling: 'Ansiedad o Estrés',
    verse: '«Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración... Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.»',
    reference: 'Filipenses 4:6-7',
    cyberAdvice: 'Desconecta el ruido del mundo y sincroniza tu mente con la paz del Padre.',
    color: '#00f0ff',
  },
  {
    id: 'culpa',
    category: 'REINICIO TOTAL',
    feeling: 'Culpa o Pasado Difícil',
    verse: '«De modo que si alguno está en Cristo, nueva criatura es; las cosas viejas pasaron; he aquí todas son hechas nuevas.»',
    reference: '2 Corintios 5:17',
    cyberAdvice: 'Tu pasado fue borrado en la cruz. Cristo te da un disco duro espiritual totalmente limpio.',
    color: '#ff007f',
  },
  {
    id: 'amor',
    category: 'AMOR ETERNO',
    feeling: 'Soledad o Desamor',
    verse: '«Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.»',
    reference: 'Juan 3:16',
    cyberAdvice: 'No necesitas mendigar aprobación en redes sociales; el Creador del universo ya dio Su vida por ti.',
    color: '#ffe600',
  },
  {
    id: 'fuerza',
    category: 'ENERGÍA DIVINA',
    feeling: 'Agotamiento o Derrota',
    verse: '«Él da esfuerzo al cansado, y multiplica las fuerzas al que no tiene ningunas... los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas.»',
    reference: 'Isaías 40:29-31',
    cyberAdvice: 'Cuando tu batería humana llega a 0%, el Espíritu Santo se conecta como fuente inagotable.',
    color: '#00ff9d',
  },
  {
    id: 'proposito',
    category: 'DESTINO',
    feeling: 'Falta de Rumbo',
    verse: '«Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.»',
    reference: 'Jeremías 29:11',
    cyberAdvice: 'Tu vida no es un accidente biológico. Fuiste diseñado con un propósito eterno antes de nacer.',
    color: '#a855f7',
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
      className="relative py-24 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden z-20"
    >
      {/* Glow Backdrops */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-[#ff007f]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Romanos 12:2 */}
      <div
        className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center transition-all duration-1000 mb-16 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Left Column: Heading & Purpose */}
        <div className="lg:col-span-6 flex flex-col justify-center text-left">
          <div className="mb-3 flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#ff007f] animate-pulse" />
            <span className="font-cyber text-xs tracking-[0.25em] uppercase text-[#ff007f] font-bold">
              PROPÓSITO & EVANGELIO • LA VERDAD QUE LIBERA
            </span>
          </div>

          <BlurText
            text="NO TE CONFORMES. TRANSFÓRMATE."
            className="font-cyber-heavy text-4xl xs:text-5xl sm:text-6xl tracking-tight text-white leading-[1.05] mb-6 select-none"
            animateBy="words"
            delay={0.08}
          />

          <p className="text-base sm:text-lg text-purple-200/90 font-body leading-relaxed max-w-lg mb-5">
            {userName ? (
              <strong className="text-[#ffe600] font-semibold block mb-1">
                {userName}, Dios tiene un plan específico para tu vida.
              </strong>
            ) : null}
            <strong className="text-white font-semibold">METANOIA 2026</strong> no es solo una reunión de jóvenes: es un punto de quiebre espiritual. Es el momento en que decides apagar el ruido de las redes, los miedos y el pecado, para escuchar la voz de Jesús.
          </p>

          <div className="flex flex-wrap gap-2.5">
            <div className="inline-flex items-center gap-2 text-xs font-mono-cyber text-[#00f0ff] px-3 py-1.5 rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/30">
              <span>GRIEGO: μετάνοια (Metanoia)</span>
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-mono-cyber text-[#ffe600] px-3 py-1.5 rounded-lg bg-[#ffe600]/10 border border-[#ffe600]/30">
              <span>UN CAMBIO RADICAL DE DIRECCIÓN</span>
            </div>
          </div>
        </div>

        {/* Right Column: Romanos 12:2 Holographic Quote Card */}
        <div className="lg:col-span-6">
          <div className="relative p-[1.5px] rounded-3xl bg-gradient-to-br from-[#ff007f] via-[#00f0ff] to-[#ffe600] shadow-[0_0_35px_rgba(255,0,127,0.25)]">
            <div className="relative rounded-[23px] bg-[#140026]/95 backdrop-blur-xl p-7 sm:p-9 flex flex-col justify-between min-h-[300px] overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#ff007f]/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#00f0ff]/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 mb-2 select-none flex items-center justify-between">
                <span className="font-serif text-5xl sm:text-6xl text-[#ff007f] leading-none drop-shadow-[0_0_12px_#ff007f]">
                  “
                </span>
                <span className="text-xs font-mono-cyber text-[#ffe600] bg-[#ffe600]/10 px-2.5 py-1 rounded border border-[#ffe600]/30">
                  PALABRA VIVA
                </span>
              </div>

              <blockquote className="relative z-10 font-body text-base sm:text-xl text-purple-100 font-medium leading-relaxed tracking-wide mb-6">
                «No os conforméis a este siglo, sino transformaos por medio de la renovación de vuestro entendimiento, para que comprobéis cuál sea la buena voluntad de Dios, agradable y perfecta.»
              </blockquote>

              <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between">
                <cite className="font-cyber text-xs sm:text-sm font-bold tracking-[0.25em] text-[#ff007f] uppercase not-italic drop-shadow-[0_0_8px_rgba(255,0,127,0.7)] flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#ff007f]" /> ROMANOS 12:2
                </cite>
                <span className="text-[11px] font-mono-cyber text-[#00f0ff]">Lema Oficial Metanoia</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN INTERACTIVA INTUITIVA: "REINICIA TU MENTE // SELECTOR BÍBLICO DE PROMESAS" */}
      <div className="mt-8 mb-16 p-6 sm:p-10 rounded-3xl bg-[#0f0022]/90 border border-[#00f0ff]/30 shadow-[0_0_35px_rgba(0,240,255,0.15)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] text-xs font-mono-cyber uppercase mb-3">
            <Zap className="w-3.5 h-3.5 text-[#00f0ff]" /> Sintoniza tu Corazón
          </div>
          <h3 className="font-cyber-heavy text-2xl sm:text-4xl text-white mb-2">
            ¿QUÉ ESTÁ LIBRANDO TU MENTE HOY?
          </h3>
          <p className="text-purple-200/80 text-xs sm:text-sm font-body">
            Haz clic en lo que sientes y recibe la promesa bíblica exacta que Dios tiene para ti hoy:
          </p>
        </div>

        {/* Emotion / Struggle Selection Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-8 relative z-10">
          {PROMISES.map((promise) => {
            const isSelected = selectedPromise.id === promise.id;
            return (
              <button
                key={promise.id}
                onClick={() => handlePromiseSelect(promise)}
                onMouseEnter={() => playCyberHover('subtle')}
                className={`px-4 py-2.5 rounded-xl font-cyber text-xs tracking-wider uppercase transition-all cursor-pointer touch-manipulation min-h-[44px] flex items-center gap-2 ${
                  isSelected
                    ? 'bg-white text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.6)] scale-105'
                    : 'bg-[#18002e] text-purple-200 border border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: promise.color }}
                />
                <span>{promise.feeling}</span>
              </button>
            );
          })}
        </div>

        {/* Display Card for Selected Promise */}
        <div className="relative z-10 max-w-3xl mx-auto p-6 sm:p-8 rounded-2xl bg-[#140026] border-2 border-white/10 shadow-2xl transition-all">
          <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-white/10">
            <span
              className="text-xs font-mono-cyber font-bold tracking-widest uppercase px-3 py-1 rounded bg-white/5"
              style={{ color: selectedPromise.color }}
            >
              CATEGORÍA: {selectedPromise.category}
            </span>
            <span className="text-xs font-cyber text-white/70 flex items-center gap-1.5 font-bold">
              <BookOpen className="w-3.5 h-3.5" style={{ color: selectedPromise.color }} />
              {selectedPromise.reference}
            </span>
          </div>

          <p className="text-base sm:text-xl text-white font-body leading-relaxed mb-4 italic">
            {selectedPromise.verse}
          </p>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
            <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: selectedPromise.color }} />
            <p className="text-xs sm:text-sm text-purple-200/90 font-mono">
              <strong className="text-white">Para tu día:</strong> {selectedPromise.cyberAdvice}
            </p>
          </div>
        </div>
      </div>

      {/* Evangelismo Metanoia: Los 3 Pasos de Salvación & Oración de Fe */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-6">
        {/* 3 Pillars of Salvation */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className="rounded-2xl bg-[#0e001f]/90 border border-white/10 p-6 flex flex-col justify-between hover:border-[#00f0ff] transition-all">
            <div>
              <div className="font-mono-cyber text-2xl font-black text-[#00f0ff] mb-2">01</div>
              <h4 className="font-cyber text-sm font-bold text-white uppercase tracking-wider mb-2">
                RECONOCE Y CONFIESA
              </h4>
              <p className="font-body text-xs text-purple-200/80 leading-relaxed">
                Reconocer que hemos pecado y que lejos de Dios nuestra vida pierde el rumbo. Sincerarse delante de Él es el inicio de la sanidad.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 text-[10px] font-mono-cyber text-[#ffe600]">
              1 Juan 1:9
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl bg-[#0e001f]/90 border border-[#ff007f]/40 p-6 flex flex-col justify-between shadow-[0_0_20px_rgba(255,0,127,0.15)]">
            <div>
              <div className="font-mono-cyber text-2xl font-black text-[#ff007f] mb-2">02</div>
              <h4 className="font-cyber text-sm font-bold text-white uppercase tracking-wider mb-2">
                ARREPENTIMIENTO REAL
              </h4>
              <p className="font-body text-xs text-purple-200/80 leading-relaxed">
                Metanoia no es remordimiento pasajero; es dar media vuelta y correr a los brazos de Jesús, rindiéndole tus planes y tus heridas.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 text-[10px] font-mono-cyber text-[#ffe600]">
              Hechos 3:19
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl bg-[#0e001f]/90 border border-white/10 p-6 flex flex-col justify-between hover:border-[#00ff9d] transition-all">
            <div>
              <div className="font-mono-cyber text-2xl font-black text-[#00ff9d] mb-2">03</div>
              <h4 className="font-cyber text-sm font-bold text-white uppercase tracking-wider mb-2">
                NUEVO CORAZÓN
              </h4>
              <p className="font-body text-xs text-purple-200/80 leading-relaxed">
                «Os daré corazón nuevo, y pondré espíritu nuevo dentro de vosotros» (Ezequiel 36:26). Ahora eres hijo de Dios con vida eterna.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 text-[10px] font-mono-cyber text-[#ffe600]">
              Ezequiel 36:26
            </div>
          </div>
        </div>

        {/* Oración de Compromiso y Decisión */}
        <div className="lg:col-span-5 rounded-3xl bg-gradient-to-b from-[#18002e] to-[#0c0018] border border-[#ff007f]/40 p-6 sm:p-8 flex flex-col justify-between shadow-[0_0_35px_rgba(255,0,127,0.2)]">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#ff007f]/15 border border-[#ff007f]/40 flex items-center justify-center text-[#ff007f]">
                <Heart className="w-5 h-5 fill-[#ff007f]/40" />
              </div>
              <div>
                <span className="text-[10px] font-mono-cyber text-[#00f0ff] uppercase tracking-widest block">
                  LLAMADO DE SALVACIÓN
                </span>
                <h4 className="font-cyber-heavy text-lg sm:text-xl text-white">
                  MI ENTREGA A CRISTO
                </h4>
              </div>
            </div>

            <p className="font-body text-xs sm:text-sm text-purple-200/90 mb-4">
              {userName ? `${userName}, si ` : 'Si '}hoy anhelas que Jesús tome el timón de tu vida y limpie tu corazón, repite esta oración con fe:
            </p>

            <div className="p-4 rounded-xl bg-black/50 border border-white/10 text-purple-100 text-xs sm:text-sm leading-relaxed font-body italic space-y-2">
              <p>
                «Señor Jesús, hoy reconozco que te necesito. Creo que moriste en la cruz por mis pecados y resucitaste al tercer día.»
              </p>
              <p>
                «Te pido perdón por mis faltas. Te abro las puertas de mi corazón y te recibo como mi único Señor y Salvador. Escribe mi nombre en el Libro de la Vida y renuévame hoy. Amén.»
              </p>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-white/10">
            {hasPrayed ? (
              <div className="p-3.5 rounded-xl bg-[#00ff9d]/10 border border-[#00ff9d]/40 text-[#00ff9d] text-center font-cyber text-xs flex items-center justify-center gap-2 animate-bounce">
                <CheckCircle2 className="w-4 h-4 text-[#00ff9d]" />
                <span>¡GLORIA A DIOS! HAS DADO EL PASO MÁS IMPORTANTE</span>
              </div>
            ) : (
              <button
                onClick={handlePrayer}
                onMouseEnter={() => playCyberHover('crisp')}
                className="w-full py-4 px-5 rounded-xl bg-gradient-to-r from-[#ff007f] via-[#7928ca] to-[#00f0ff] text-white font-cyber text-xs font-bold tracking-widest uppercase shadow-[0_0_25px_rgba(255,0,127,0.6)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 touch-manipulation min-h-[46px]"
              >
                <Sparkles className="w-4 h-4 text-[#ffe600]" />
                <span>CONFIRMO MI FE EN JESÚS HOY</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
