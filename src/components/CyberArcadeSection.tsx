import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Gamepad2,
  Trophy,
  Flame,
  RotateCcw,
  Sparkles,
  Shield,
  HelpCircle,
  Timer,
  Award,
  CheckCircle2,
  XCircle,
  Zap,
  Play,
  Volume2,
  Grid,
  Layers,
  Brain,
} from 'lucide-react';
import {
  playCyberClick,
  playCyberHover,
  playCyberTransition,
  playGameCorrect,
  playGameWrong,
  playGameCatch,
  playNeonChime,
} from '../utils/audio';

/* -------------------------------------------------------------------------- */
/* TRIVIA QUESTIONS DATA                                                      */
/* -------------------------------------------------------------------------- */

interface TriviaQuestion {
  id: number;
  question: string;
  scripture: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    id: 1,
    question: '¿Qué significa etimológicamente la palabra griega «Metanoia»?',
    scripture: 'Romanos 12:2',
    options: [
      'Sentir tristeza por un error',
      'Cambio radical de mente y dirección',
      'Un ritual de purificación externa',
      'Hacer buenas obras periódicas',
    ],
    correctIndex: 1,
    explanation: 'Metanoia (μετάνοια) significa trascender la mentalidad anterior: un giro radical de 180° hacia la voluntad de Dios.',
  },
  {
    id: 2,
    question: 'Según Romanos 12:2, ¿cómo se logra la transformación del creyente?',
    scripture: 'Romanos 12:2',
    options: [
      'Aislándose completamente de la sociedad',
      'Por medio de la renovación del entendimiento',
      'Acumulando conocimientos filosóficos',
      'Esperando pasivamente que los años pasen',
    ],
    correctIndex: 1,
    explanation: '«Transformaos por medio de la renovación de vuestro entendimiento» para comprobar la buena y perfecta voluntad divina.',
  },
  {
    id: 3,
    question: '¿Qué apóstol experimentó una Metanoia radical camino a Damasco?',
    scripture: 'Hechos 9',
    options: ['Pedro', 'Tomás', 'Saulo de Tarso (Pablo)', 'Bernabé'],
    correctIndex: 2,
    explanation: 'Saulo pasó de perseguidor de la iglesia a apóstol de Jesucristo tras un encuentro personal con la luz del Resucitado.',
  },
  {
    id: 4,
    question: 'Según Filipenses 4:8, ¿en qué cosas nos manda la Biblia pensar?',
    scripture: 'Filipenses 4:8',
    options: [
      'En las ofensas que nos hicieron',
      'En todo lo verdadero, honesto, justo y puro',
      'En la opinión popular de las redes sociales',
      'En los temores del día de mañana',
    ],
    correctIndex: 1,
    explanation: 'Dios nos da un filtro mental de excelencia: enfocar nuestros pensamientos en Su verdad, pureza y alabanza.',
  },
  {
    id: 5,
    question: '¿Qué promete 2 Corintios 5:17 a quien decide estar en Cristo?',
    scripture: '2 Corintios 5:17',
    options: [
      'Que nunca tendrá ningún problema',
      'Nueva criatura es; las cosas viejas pasaron',
      'Que recibirá riquezas materiales automáticas',
      'Que no necesitará volver a orar',
    ],
    correctIndex: 1,
    explanation: 'En Cristo tu código es reiniciado: el pasado queda cancelado en la cruz y renaces como una nueva criatura.',
  },
  {
    id: 6,
    question: '¿Qué dijo el profeta Jeremías respecto a los pensamientos de Dios para los jóvenes?',
    scripture: 'Jeremías 29:11',
    options: [
      'Pensamientos de incertidumbre y dolor',
      'Pensamientos de paz y de darles un porvenir esperado',
      'Pensamientos de juicio estricto sin misericordia',
      'Que Dios se olvida de la juventud',
    ],
    correctIndex: 1,
    explanation: '«Porque yo sé los pensamientos que tengo acerca de vosotros: pensamientos de paz, y no de mal, para daros el fin que esperáis.»',
  },
  {
    id: 7,
    question: '¿Con qué arma espiritual derribamos los argumentos y pensamientos que se levantan contra Dios?',
    scripture: '2 Corintios 10:5',
    options: [
      'Llevando cautivo todo pensamiento a la obediencia a Cristo',
      'Discutiendo agresivamente con los demás',
      'Ignorando la Biblia por completo',
      'Buscando validación en las tendencias virales',
    ],
    correctIndex: 0,
    explanation: '«Derribando argumentos... y llevando cautivo todo pensamiento a la obediencia a Cristo» (2 Corintios 10:5).',
  },
  {
    id: 8,
    question: '¿Qué consejo le dio Pablo al joven Timoteo en 1 Timoteo 4:12?',
    scripture: '1 Timoteo 4:12',
    options: [
      'Que espere a ser anciano para servir',
      'Ninguno tenga en poco tu juventud, sino sé ejemplo',
      'Que no hable de su fe en público',
      'Que busque únicamente agradar a la multitud',
    ],
    correctIndex: 1,
    explanation: 'La juventud es la punta de lanza de la iglesia: llamados a ser ejemplo en palabra, conducta, amor, fe y pureza.',
  },
];

/* -------------------------------------------------------------------------- */
/* MINIGAME 2 DATA: "PENSAMIENTOS DE FILIPENSES 4:8"                           */
/* -------------------------------------------------------------------------- */

interface ThoughtItem {
  id: string;
  text: string;
  isGood: boolean;
  x: number;
  y: number;
  speed: number;
}

const GOOD_THOUGHTS = [
  'Verdad',
  'Paz de Dios',
  'Gracia',
  'Pureza',
  'Esperanza',
  'Amor',
  'Perdón',
  'Propósito',
  'Fe',
  'Gozo',
  'Mente de Cristo',
];

const BAD_THOUGHTS = [
  'Ansiedad',
  'Mentira',
  'Rencor',
  'Miedo',
  'Comparación',
  'Vacío',
  'Orgullo',
  'Apatía',
  'Chisme',
];

/* -------------------------------------------------------------------------- */
/* MINIGAME 3 DATA: "MATRIZ DE MEMORIA BÍBLICA"                               */
/* -------------------------------------------------------------------------- */

interface MemoryCard {
  id: number;
  pairId: number;
  label: string;
  icon: string;
  sub: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MEMORY_DEFINITIONS = [
  { pairId: 1, label: 'Romanos 12:2', icon: '📖', sub: 'Mente Renovada' },
  { pairId: 1, label: 'Metanoia', icon: '⚡', sub: 'Giro de 180°' },
  { pairId: 2, label: 'La Cruz', icon: '✝️', sub: 'Amor y Perdón' },
  { pairId: 2, label: 'Salvación', icon: '🕊️', sub: 'Gracia Gratuita' },
  { pairId: 3, label: 'Espíritu Santo', icon: '🔥', sub: 'Fuego y Poder' },
  { pairId: 3, label: 'Luz del Mundo', icon: '✨', sub: 'Testimonio Vivo' },
  { pairId: 4, label: '2 Cor. 5:17', icon: '🌱', sub: 'Nueva Criatura' },
  { pairId: 4, label: 'Código Nuevo', icon: '💻', sub: 'Cero Culpa' },
  { pairId: 5, label: 'Escudo de Fe', icon: '🛡️', sub: 'Protección' },
  { pairId: 5, label: 'Espada de Dios', icon: '⚔️', sub: 'Palabra Viva' },
  { pairId: 6, label: 'Corona de Vida', icon: '👑', sub: 'Premio Eterno' },
  { pairId: 6, label: 'Propósito', icon: '🎯', sub: 'Destino Santo' },
];

export const CyberArcadeSection: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'trivia' | 'thoughts' | 'memory'>('trivia');

  /* ------------------------------------------------------------------------ */
  /* TRIVIA STATE                                                             */
  /* ------------------------------------------------------------------------ */
  const [triviaStep, setTriviaStep] = useState<'idle' | 'playing' | 'results'>('idle');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [triviaTimeLeft, setTriviaTimeLeft] = useState(15);
  const [triviaHighScore, setTriviaHighScore] = useState(() => {
    return Number(localStorage.getItem('metanoia_trivia_high') || 0);
  });

  const question = TRIVIA_QUESTIONS[currentQuestionIndex];

  useEffect(() => {
    if (triviaStep !== 'playing' || isAnswerRevealed) return;

    if (triviaTimeLeft <= 0) {
      handleSelectOption(-1);
      return;
    }

    const timer = setInterval(() => {
      setTriviaTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [triviaStep, isAnswerRevealed, triviaTimeLeft]);

  const startTrivia = () => {
    playCyberClick();
    setCurrentQuestionIndex(0);
    setScore(0);
    setStreak(0);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setTriviaTimeLeft(15);
    setTriviaStep('playing');
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswerRevealed) return;
    setSelectedOption(idx);
    setIsAnswerRevealed(true);

    const isCorrect = idx === question.correctIndex;
    if (isCorrect) {
      playGameCorrect();
      const points = 100 + streak * 25 + Math.max(0, triviaTimeLeft * 5);
      const newScore = score + points;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);

      if (newScore > triviaHighScore) {
        setTriviaHighScore(newScore);
        localStorage.setItem('metanoia_trivia_high', String(newScore));
      }
    } else {
      playGameWrong();
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    playCyberClick();
    if (currentQuestionIndex + 1 < TRIVIA_QUESTIONS.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
      setTriviaTimeLeft(15);
    } else {
      setTriviaStep('results');
      playNeonChime();
    }
  };

  /* ------------------------------------------------------------------------ */
  /* THOUGHTS CATCHER GAME STATE                                              */
  /* ------------------------------------------------------------------------ */
  const [thoughtGameStep, setThoughtGameStep] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [thoughtScore, setThoughtScore] = useState(0);
  const [shields, setShields] = useState(3);
  const [thoughtTimeLeft, setThoughtTimeLeft] = useState(30);
  const [activeItems, setActiveItems] = useState<ThoughtItem[]>([]);
  const [thoughtHighScore, setThoughtHighScore] = useState(() => {
    return Number(localStorage.getItem('metanoia_thought_high') || 0);
  });
  const gameAreaRef = useRef<HTMLDivElement | null>(null);

  const startThoughtGame = () => {
    playCyberClick();
    setThoughtScore(0);
    setShields(3);
    setThoughtTimeLeft(30);
    setActiveItems([]);
    setThoughtGameStep('playing');
  };

  useEffect(() => {
    if (thoughtGameStep !== 'playing') return;

    const timer = setInterval(() => {
      setThoughtTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setThoughtGameStep('gameover');
          playNeonChime();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [thoughtGameStep]);

  useEffect(() => {
    if (thoughtGameStep !== 'playing') return;

    const spawner = setInterval(() => {
      setActiveItems((prev) => {
        if (prev.length >= 6) return prev;
        const isGood = Math.random() > 0.35;
        const pool = isGood ? GOOD_THOUGHTS : BAD_THOUGHTS;
        const text = pool[Math.floor(Math.random() * pool.length)];
        const newItem: ThoughtItem = {
          id: `${Date.now()}-${Math.random()}`,
          text,
          isGood,
          x: Math.floor(Math.random() * 70) + 10,
          y: -5,
          speed: Math.random() * 1.2 + 0.8,
        };
        return [...prev, newItem];
      });
    }, 850);

    const mover = setInterval(() => {
      setActiveItems((prev) => {
        const next: ThoughtItem[] = [];
        for (const item of prev) {
          const newY = item.y + item.speed * 2.2;
          if (newY > 92) {
            if (!item.isGood) {
              setThoughtScore((s) => s + 20);
            }
          } else {
            next.push({ ...item, y: newY });
          }
        }
        return next;
      });
    }, 50);

    return () => {
      clearInterval(spawner);
      clearInterval(mover);
    };
  }, [thoughtGameStep]);

  const handleCatchThought = (item: ThoughtItem) => {
    setActiveItems((prev) => prev.filter((i) => i.id !== item.id));

    if (item.isGood) {
      playGameCatch();
      setThoughtScore((s) => {
        const next = s + 50;
        if (next > thoughtHighScore) {
          setThoughtHighScore(next);
          localStorage.setItem('metanoia_thought_high', String(next));
        }
        return next;
      });
    } else {
      playGameWrong();
      setShields((s) => {
        const nextShields = s - 1;
        if (nextShields <= 0) {
          setThoughtGameStep('gameover');
          playNeonChime();
        }
        return Math.max(0, nextShields);
      });
    }
  };

  /* ------------------------------------------------------------------------ */
  /* MINIGAME 3: MATRIZ DE MEMORIA BÍBLICA                                    */
  /* ------------------------------------------------------------------------ */
  const [memoryStep, setMemoryStep] = useState<'idle' | 'playing' | 'won'>('idle');
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);
  const [memoryTime, setMemoryTime] = useState(0);
  const [isProcessingMatch, setIsProcessingMatch] = useState(false);
  const [memoryHighScore, setMemoryHighScore] = useState(() => {
    return Number(localStorage.getItem('metanoia_memory_high') || 0);
  });

  const startMemoryGame = () => {
    playCyberClick();
    const shuffled = [...MEMORY_DEFINITIONS]
      .sort(() => Math.random() - 0.5)
      .map((item, index) => ({
        id: index,
        pairId: item.pairId,
        label: item.label,
        icon: item.icon,
        sub: item.sub,
        isFlipped: false,
        isMatched: false,
      }));

    setMemoryCards(shuffled);
    setFlippedIndices([]);
    setMemoryMoves(0);
    setMemoryTime(0);
    setIsProcessingMatch(false);
    setMemoryStep('playing');
  };

  // Timer for memory game
  useEffect(() => {
    if (memoryStep !== 'playing') return;
    const interval = setInterval(() => {
      setMemoryTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [memoryStep]);

  const handleCardClick = (index: number) => {
    if (isProcessingMatch) return;
    if (memoryCards[index].isFlipped || memoryCards[index].isMatched) return;
    if (flippedIndices.length >= 2) return;

    playCyberClick();
    const nextFlipped = [...flippedIndices, index];
    const nextCards = [...memoryCards];
    nextCards[index].isFlipped = true;
    setMemoryCards(nextCards);
    setFlippedIndices(nextFlipped);

    if (nextFlipped.length === 2) {
      setMemoryMoves((m) => m + 1);
      setIsProcessingMatch(true);

      const [firstIdx, secondIdx] = nextFlipped;
      const cardA = nextCards[firstIdx];
      const cardB = nextCards[secondIdx];

      if (cardA.pairId === cardB.pairId) {
        // Matched!
        setTimeout(() => {
          playGameCorrect();
          nextCards[firstIdx].isMatched = true;
          nextCards[secondIdx].isMatched = true;
          setMemoryCards([...nextCards]);
          setFlippedIndices([]);
          setIsProcessingMatch(false);

          // Check if all matched
          const allWon = nextCards.every((c) => c.isMatched);
          if (allWon) {
            playNeonChime();
            setMemoryStep('won');
            const scoreCalc = Math.max(100, 1000 - memoryMoves * 20 - memoryTime * 5);
            if (scoreCalc > memoryHighScore) {
              setMemoryHighScore(scoreCalc);
              localStorage.setItem('metanoia_memory_high', String(scoreCalc));
            }
          }
        }, 500);
      } else {
        // Not a match
        setTimeout(() => {
          playGameWrong();
          nextCards[firstIdx].isFlipped = false;
          nextCards[secondIdx].isFlipped = false;
          setMemoryCards([...nextCards]);
          setFlippedIndices([]);
          setIsProcessingMatch(false);
        }, 900);
      }
    }
  };

  /* ------------------------------------------------------------------------ */
  /* HELPER FOR RANKS                                                         */
  /* ------------------------------------------------------------------------ */
  const getTriviaRank = (finalScore: number) => {
    if (finalScore >= 1200) return { title: 'Mente de Cristo Master', color: '#00f0ff', desc: '¡Increíble discernimiento y sabiduría bíblica!' };
    if (finalScore >= 800) return { title: 'Guerrero de la Fe', color: '#ffe600', desc: 'Conocimiento sólido y entendimiento renovado.' };
    if (finalScore >= 400) return { title: 'Discípulo en Crecimiento', color: '#ff007f', desc: '¡Vas por gran camino, continúa alimentándote de la Palabra!' };
    return { title: 'Buscador de Sabiduría', color: '#a855f7', desc: '¡Sigue alimentando tu mente con la Palabra de Dios!' };
  };

  return (
    <section id="minijuegos" className="relative py-24 px-4 sm:px-8 max-w-7xl mx-auto z-20">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ff007f]/15 border border-[#ff007f]/30 text-[#ff007f] text-xs font-mono-cyber tracking-[0.25em] uppercase mb-4 shadow-[0_0_15px_rgba(255,0,127,0.2)]">
          <Gamepad2 className="w-4 h-4 text-[#00f0ff]" />
          <span>CYBER ARCADE • RETOS DE FE Y MENTE</span>
        </div>

        <h2 className="cyber-metanoia-title text-4xl xs:text-5xl sm:text-6xl text-white tracking-tight leading-none mb-3">
          MINIJUEGOS <span className="text-[#ff007f] drop-shadow-[0_0_20px_rgba(255,0,127,0.8)]">METANOIA</span>
        </h2>

        <p className="font-body text-sm sm:text-base text-purple-200/80 max-w-xl mx-auto">
          Tres desafíos interactivos para poner a prueba tus reflejos, memoria bíblica y discernimiento espiritual en este gran encuentro juvenil.
        </p>

        {/* Game Mode Selector (3 Games) */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6 sm:mt-8">
          <button
            onClick={() => {
              if (activeGame !== 'trivia') {
                playCyberClick();
                playCyberTransition();
                setActiveGame('trivia');
              }
            }}
            onMouseEnter={() => playCyberHover('subtle')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-3 rounded-2xl font-cyber text-xs font-bold uppercase tracking-wider transition-all cursor-pointer touch-manipulation min-h-[44px] ${
              activeGame === 'trivia'
                ? 'bg-gradient-to-r from-[#00f0ff] to-[#7928ca] text-white shadow-[0_0_20px_rgba(0,240,255,0.4)] border border-[#00f0ff]'
                : 'bg-white/5 border border-white/10 text-purple-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-[#00f0ff]" />
            <span>1. Trivia de la Mente</span>
          </button>

          <button
            onClick={() => {
              if (activeGame !== 'thoughts') {
                playCyberClick();
                playCyberTransition();
                setActiveGame('thoughts');
              }
            }}
            onMouseEnter={() => playCyberHover('subtle')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-3 rounded-2xl font-cyber text-xs font-bold uppercase tracking-wider transition-all cursor-pointer touch-manipulation min-h-[44px] ${
              activeGame === 'thoughts'
                ? 'bg-gradient-to-r from-[#ff007f] to-[#ffe600] text-black font-extrabold shadow-[0_0_20px_rgba(255,0,127,0.4)] border border-[#ff007f]'
                : 'bg-white/5 border border-white/10 text-purple-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Shield className="w-4 h-4 text-[#ffe600]" />
            <span>2. Guardián del Pensamiento</span>
          </button>

          <button
            onClick={() => {
              if (activeGame !== 'memory') {
                playCyberClick();
                playCyberTransition();
                setActiveGame('memory');
              }
            }}
            onMouseEnter={() => playCyberHover('subtle')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-3 rounded-2xl font-cyber text-xs font-bold uppercase tracking-wider transition-all cursor-pointer touch-manipulation min-h-[44px] ${
              activeGame === 'memory'
                ? 'bg-gradient-to-r from-[#00ff9d] to-[#00f0ff] text-black font-extrabold shadow-[0_0_20px_rgba(0,255,157,0.4)] border border-[#00ff9d]'
                : 'bg-white/5 border border-white/10 text-purple-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Brain className="w-4 h-4 text-[#00ff9d]" />
            <span>3. Matriz de Memoria</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* GAME 1: TRIVIA DE LA MENTE RENOVADA                                  */}
      {/* ==================================================================== */}
      {activeGame === 'trivia' && (
        <div className="max-w-3xl mx-auto rounded-3xl bg-[#0e001f]/95 backdrop-blur-xl border-2 border-[#00f0ff]/30 p-6 sm:p-10 shadow-[0_0_50px_rgba(0,240,255,0.15)] relative overflow-hidden">
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#00f0ff] pointer-events-none" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#ff007f] pointer-events-none" />

          {triviaStep === 'idle' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-3xl bg-[#00f0ff]/15 border border-[#00f0ff]/40 flex items-center justify-center mx-auto mb-6 text-[#00f0ff] shadow-[0_0_30px_rgba(0,240,255,0.35)]">
                <HelpCircle className="w-10 h-10" />
              </div>

              <h3 className="font-cyber-heavy text-2xl sm:text-3xl text-white tracking-tight mb-3">
                DESAFÍO METANOIA: TRIVIA DE LA FE
              </h3>
              <p className="font-body text-sm text-purple-200/80 max-w-md mx-auto mb-8">
                8 preguntas sobre la renovación de la mente, versículos de Metanoia y personajes bíblicos. ¡15 segundos por pregunta con bonificación por racha!
              </p>

              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono-cyber text-[#ffe600] mb-8">
                <Trophy className="w-4 h-4" />
                <span>RÉCORD PERSONAL: {triviaHighScore} PTS</span>
              </div>

              <div>
                <button
                  onClick={startTrivia}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#ff007f] via-[#c026d3] to-[#00f0ff] text-white font-cyber text-sm font-extrabold tracking-widest uppercase shadow-[0_0_30px_rgba(0,240,255,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-3 mx-auto"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>INICIAR DESAFÍO</span>
                </button>
              </div>
            </div>
          )}

          {triviaStep === 'playing' && (
            <div>
              <div className="flex items-center justify-between gap-3 pb-5 mb-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="font-mono-cyber text-xs px-2.5 py-1 rounded bg-[#00f0ff]/15 border border-[#00f0ff]/30 text-[#00f0ff]">
                    PREGUNTA {currentQuestionIndex + 1}/{TRIVIA_QUESTIONS.length}
                  </span>
                  {streak > 1 && (
                    <span className="inline-flex items-center gap-1 font-mono-cyber text-xs px-2 py-0.5 rounded bg-[#ffe600]/15 border border-[#ffe600]/30 text-[#ffe600]">
                      <Flame className="w-3.5 h-3.5 text-[#ff007f]" />
                      <span>{streak}X RACHA</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className={`flex items-center gap-1.5 font-mono-cyber text-xs px-3 py-1 rounded-lg border ${
                      triviaTimeLeft <= 4
                        ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse'
                        : 'bg-white/5 border-white/10 text-white'
                    }`}
                  >
                    <Timer className="w-3.5 h-3.5" />
                    <span>{triviaTimeLeft}s</span>
                  </div>

                  <div className="font-mono-cyber text-xs text-[#00f0ff]">
                    SCORE: <span className="font-bold text-white text-sm">{score}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-[10px] font-mono-cyber text-[#ffe600] uppercase tracking-widest block mb-1">
                  REFERENCIA: {question.scripture}
                </span>
                <h4 className="font-body text-lg sm:text-xl font-bold text-white leading-snug">
                  {question.question}
                </h4>
              </div>

              <div className="space-y-3 mb-6">
                {question.options.map((option, idx) => {
                  let btnStyle = 'bg-white/5 border-white/15 text-purple-100 hover:bg-white/10 hover:border-[#00f0ff]/50';

                  if (isAnswerRevealed) {
                    if (idx === question.correctIndex) {
                      btnStyle = 'bg-[#00ff9d]/20 border-[#00ff9d] text-[#00ff9d] font-bold shadow-[0_0_15px_rgba(0,255,157,0.3)]';
                    } else if (idx === selectedOption) {
                      btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold';
                    } else {
                      btnStyle = 'bg-white/5 border-white/5 text-white/40 opacity-40';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswerRevealed}
                      onClick={() => handleSelectOption(idx)}
                      onMouseEnter={() => !isAnswerRevealed && playCyberHover('crisp')}
                      className={`w-full p-4 rounded-xl border text-left font-body text-sm transition-all flex items-center justify-between gap-3 cursor-pointer touch-manipulation ${btnStyle}`}
                    >
                      <span>{option}</span>
                      {isAnswerRevealed && idx === question.correctIndex && (
                        <CheckCircle2 className="w-5 h-5 text-[#00ff9d] flex-shrink-0" />
                      )}
                      {isAnswerRevealed && idx === selectedOption && idx !== question.correctIndex && (
                        <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {isAnswerRevealed && (
                <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 mb-6 text-xs sm:text-sm text-purple-200 font-body">
                  <strong className="text-white font-semibold">Explicación:</strong> {question.explanation}
                </div>
              )}

              {isAnswerRevealed && (
                <div className="flex justify-end">
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#ff007f] text-white font-cyber text-xs font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:scale-105 transition-all cursor-pointer"
                  >
                    {currentQuestionIndex + 1 < TRIVIA_QUESTIONS.length ? 'SIGUIENTE PREGUNTA →' : 'VER RESULTADOS'}
                  </button>
                </div>
              )}
            </div>
          )}

          {triviaStep === 'results' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-3xl bg-[#ffe600]/15 border border-[#ffe600]/40 flex items-center justify-center mx-auto mb-6 text-[#ffe600] shadow-[0_0_30px_rgba(255,230,0,0.35)]">
                <Trophy className="w-10 h-10" />
              </div>

              <div className="text-xs font-mono-cyber text-[#00f0ff] uppercase tracking-widest mb-2">
                DESAFÍO COMPLETADO
              </div>

              <h3 className="font-cyber-heavy text-4xl sm:text-5xl text-white mb-2">
                {score} <span className="text-lg text-purple-300">PUNTOS</span>
              </h3>

              {(() => {
                const rank = getTriviaRank(score);
                return (
                  <div className="my-6 p-5 rounded-2xl bg-white/5 border border-white/10 max-w-md mx-auto">
                    <span className="text-[10px] font-mono-cyber text-purple-300 uppercase tracking-widest block mb-1">
                      RANGO ALCANZADO
                    </span>
                    <h4 className="font-cyber text-xl font-bold mb-2" style={{ color: rank.color }}>
                      {rank.title}
                    </h4>
                    <p className="text-xs font-body text-purple-200/80">{rank.desc}</p>
                  </div>
                );
              })()}

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={startTrivia}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff007f] to-[#00f0ff] text-white font-cyber text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(255,0,127,0.4)] hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>JUGAR OTRA VEZ</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* GAME 2: GUARDIÁN DEL PENSAMIENTO                                     */}
      {/* ==================================================================== */}
      {activeGame === 'thoughts' && (
        <div className="max-w-3xl mx-auto rounded-3xl bg-[#0e001f]/95 backdrop-blur-xl border-2 border-[#ff007f]/30 p-6 sm:p-10 shadow-[0_0_50px_rgba(255,0,127,0.15)] relative overflow-hidden">
          {thoughtGameStep === 'idle' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-3xl bg-[#ff007f]/15 border border-[#ff007f]/40 flex items-center justify-center mx-auto mb-6 text-[#ff007f] shadow-[0_0_30px_rgba(255,0,127,0.35)]">
                <Shield className="w-10 h-10" />
              </div>

              <h3 className="font-cyber-heavy text-2xl sm:text-3xl text-white tracking-tight mb-3">
                GUARDIÁN DEL PENSAMIENTO
              </h3>
              <p className="font-body text-sm text-purple-200/80 max-w-md mx-auto mb-6">
                Basado en Filipenses 4:8. Toca únicamente los <strong className="text-[#00f0ff]">buenos pensamientos</strong> (Paz, Verdad, Fe) y deja pasar los negativos. ¡Cuentas con 3 escudos!
              </p>

              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono-cyber text-[#ffe600] mb-8">
                <Trophy className="w-4 h-4" />
                <span>RÉCORD PERSONAL: {thoughtHighScore} PTS</span>
              </div>

              <div>
                <button
                  onClick={startThoughtGame}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#ffe600] via-[#ff007f] to-[#7928ca] text-black font-cyber text-sm font-extrabold tracking-widest uppercase shadow-[0_0_30px_rgba(255,230,0,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-3 mx-auto"
                >
                  <Play className="w-5 h-5 fill-black" />
                  <span>INICIAR GUARDIÁN</span>
                </button>
              </div>
            </div>
          )}

          {thoughtGameStep === 'playing' && (
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10 text-xs font-mono-cyber">
                <div className="flex items-center gap-1.5 text-rose-400">
                  <span>ESCUDOS:</span>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Shield
                      key={i}
                      className={`w-4 h-4 ${i < shields ? 'text-[#00f0ff] fill-[#00f0ff]/40' : 'text-white/20'}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-[#ffe600] font-bold">TIEMPO: {thoughtTimeLeft}s</div>
                  <div className="text-[#00ff9d] font-bold">PUNTOS: {thoughtScore}</div>
                </div>
              </div>

              <div
                ref={gameAreaRef}
                className="relative w-full h-[360px] sm:h-[400px] rounded-2xl bg-black/60 border border-white/10 overflow-hidden select-none touch-none"
              >
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

                {activeItems.map((item) => (
                  <button
                    key={item.id}
                    onPointerDown={() => handleCatchThought(item)}
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                    }}
                    className={`absolute transform -translate-x-1/2 px-4 py-2.5 rounded-xl text-xs font-cyber font-bold tracking-wider uppercase cursor-pointer active:scale-90 transition-transform shadow-lg touch-manipulation select-none min-h-[44px] min-w-[70px] ${
                      item.isGood
                        ? 'bg-gradient-to-r from-[#00f0ff] to-[#7928ca] text-white border border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.6)] animate-pulse'
                        : 'bg-gradient-to-r from-[#ff007f] to-rose-700 text-white border border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.6)]'
                    }`}
                  >
                    {item.text}
                  </button>
                ))}

                {activeItems.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-mono-cyber text-purple-400/50 pointer-events-none">
                    ESCANEANDO PENSAMIENTOS...
                  </div>
                )}
              </div>
            </div>
          )}

          {thoughtGameStep === 'gameover' && (
            <div className="text-center py-6">
              <div className="w-20 h-20 rounded-3xl bg-[#ff007f]/15 border border-[#ff007f]/40 flex items-center justify-center mx-auto mb-5 text-[#ff007f] shadow-[0_0_30px_rgba(255,0,127,0.35)]">
                <Trophy className="w-10 h-10" />
              </div>

              <div className="text-xs font-mono-cyber text-[#00f0ff] uppercase tracking-widest mb-2">
                RONDA FINALIZADA
              </div>

              <h3 className="font-cyber-heavy text-3xl sm:text-4xl text-white mb-2">
                {thoughtScore} <span className="text-base text-purple-300">PUNTOS</span>
              </h3>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 max-w-md mx-auto my-6 text-xs sm:text-sm font-body text-purple-200">
                «Sobre toda cosa guardada, guarda tu corazón; porque de él mana la vida.» — Proverbios 4:23
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={startThoughtGame}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ffe600] to-[#ff007f] text-black font-cyber text-xs font-extrabold uppercase tracking-wider shadow-[0_0_20px_rgba(255,230,0,0.4)] hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>JUGAR OTRA VEZ</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* GAME 3: MATRIZ DE MEMORIA BÍBLICA                                    */}
      {/* ==================================================================== */}
      {activeGame === 'memory' && (
        <div className="max-w-3xl mx-auto rounded-3xl bg-[#0e001f]/95 backdrop-blur-xl border-2 border-[#00ff9d]/30 p-6 sm:p-10 shadow-[0_0_50px_rgba(0,255,157,0.15)] relative overflow-hidden">
          {memoryStep === 'idle' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-3xl bg-[#00ff9d]/15 border border-[#00ff9d]/40 flex items-center justify-center mx-auto mb-6 text-[#00ff9d] shadow-[0_0_30px_rgba(0,255,157,0.35)]">
                <Brain className="w-10 h-10" />
              </div>

              <h3 className="font-cyber-heavy text-2xl sm:text-3xl text-white tracking-tight mb-3">
                MATRIZ DE MEMORIA BÍBLICA
              </h3>
              <p className="font-body text-sm text-purple-200/80 max-w-md mx-auto mb-6">
                Encuentra las 6 parejas de conceptos bíblicos y versículos de Metanoia en el menor tiempo y movimientos posibles.
              </p>

              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono-cyber text-[#00ff9d] mb-8">
                <Trophy className="w-4 h-4" />
                <span>RÉCORD PERSONAL: {memoryHighScore} PTS</span>
              </div>

              <div>
                <button
                  onClick={startMemoryGame}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00ff9d] via-[#00f0ff] to-[#7928ca] text-black font-cyber text-sm font-extrabold tracking-widest uppercase shadow-[0_0_30px_rgba(0,255,157,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-3 mx-auto"
                >
                  <Play className="w-5 h-5 fill-black" />
                  <span>INICIAR MATRIZ</span>
                </button>
              </div>
            </div>
          )}

          {memoryStep === 'playing' && (
            <div>
              {/* Stats Bar */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10 text-xs font-mono-cyber">
                <div className="text-[#00ff9d] font-bold flex items-center gap-1.5">
                  <Timer className="w-4 h-4" /> TIEMPO: {memoryTime}s
                </div>
                <div className="text-[#00f0ff] font-bold flex items-center gap-1.5">
                  <Layers className="w-4 h-4" /> MOVIMIENTOS: {memoryMoves}
                </div>
                <div className="text-[#ffe600] font-bold">
                  PAREJAS: {memoryCards.filter((c) => c.isMatched).length / 2}/6
                </div>
              </div>

              {/* 12 Cards Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4">
                {memoryCards.map((card, index) => {
                  const isVisible = card.isFlipped || card.isMatched;

                  return (
                    <button
                      key={card.id}
                      onClick={() => handleCardClick(index)}
                      className={`h-24 sm:h-28 rounded-xl border p-2 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer touch-manipulation select-none relative overflow-hidden ${
                        card.isMatched
                          ? 'bg-[#00ff9d]/20 border-[#00ff9d] text-white shadow-[0_0_15px_rgba(0,255,157,0.3)] scale-[0.98]'
                          : isVisible
                          ? 'bg-[#18002e] border-[#00f0ff] text-white shadow-[0_0_15px_rgba(0,240,255,0.4)] scale-105'
                          : 'bg-white/5 border-white/10 hover:border-white/30 text-white/20 hover:scale-[1.02]'
                      }`}
                    >
                      {isVisible ? (
                        <>
                          <span className="text-2xl sm:text-3xl mb-1">{card.icon}</span>
                          <span className="font-cyber font-bold text-[11px] sm:text-xs tracking-wider uppercase text-white leading-tight">
                            {card.label}
                          </span>
                          <span className="text-[9px] font-mono text-[#00f0ff] mt-0.5">
                            {card.sub}
                          </span>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-1">
                          <span className="font-mono-cyber text-lg text-purple-400 font-bold">?</span>
                          <span className="text-[8px] font-mono-cyber text-white/30 tracking-widest">METANOIA</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {memoryStep === 'won' && (
            <div className="text-center py-6">
              <div className="w-20 h-20 rounded-3xl bg-[#00ff9d]/15 border border-[#00ff9d]/40 flex items-center justify-center mx-auto mb-5 text-[#00ff9d] shadow-[0_0_30px_rgba(0,255,157,0.35)] animate-bounce">
                <Trophy className="w-10 h-10" />
              </div>

              <div className="text-xs font-mono-cyber text-[#00ff9d] uppercase tracking-widest mb-2">
                ¡MATRIZ SINCRONIZADA CON ÉXITO!
              </div>

              <h3 className="font-cyber-heavy text-3xl sm:text-4xl text-white mb-2">
                {Math.max(100, 1000 - memoryMoves * 20 - memoryTime * 5)} <span className="text-base text-purple-300">PUNTOS</span>
              </h3>

              <p className="text-xs font-mono-cyber text-purple-200 mb-6">
                Completado en {memoryTime} segundos y {memoryMoves} movimientos.
              </p>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 max-w-md mx-auto my-6 text-xs sm:text-sm font-body text-purple-200">
                «Por lo demás, hermanos, todo lo que es verdadero, todo lo honesto, todo lo justo... en esto pensad.» — Filipenses 4:8
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={startMemoryGame}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00ff9d] to-[#00f0ff] text-black font-cyber text-xs font-extrabold uppercase tracking-wider shadow-[0_0_20px_rgba(0,255,157,0.4)] hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>JUGAR OTRA VEZ</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
