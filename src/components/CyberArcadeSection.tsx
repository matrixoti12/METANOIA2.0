import React, { useState, useEffect, useRef } from 'react';
import {
  Gamepad2,
  Trophy,
  Flame,
  RotateCcw,
  Sparkles,
  Shield,
  HelpCircle,
  Timer,
  CheckCircle2,
  XCircle,
  Zap,
  Play,
  Layers,
  Brain,
  Share2,
  Check,
  Award,
  Ticket,
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
/* TRIVIA QUESTIONS DATA (EXPANDED TO 10 HIGH-IMPACT QUESTIONS)               */
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
      'Sentir tristeza pasajera por un error',
      'Cambio radical de mente y dirección (Giro de 180°)',
      'Un ritual de purificación externa',
      'Hacer buenas obras periódicas',
    ],
    correctIndex: 1,
    explanation: 'Metanoia (μετάνοια) significa trascender la mentalidad anterior: un giro radical hacia la verdad y la voluntad de Dios.',
  },
  {
    id: 2,
    question: 'Según Romanos 12:2, ¿cómo se logra la transformación del creyente?',
    scripture: 'Romanos 12:2',
    options: [
      'Aislándose completamente del mundo',
      'Por medio de la renovación de vuestro entendimiento',
      'Memorizando discursos humanos',
      'Esperando pasivamente que los años pasen',
    ],
    correctIndex: 1,
    explanation: '«Transformaos por medio de la renovación de vuestro entendimiento» para comprobar la buena, agradable y perfecta voluntad divina.',
  },
  {
    id: 3,
    question: '¿Quién es el invitado especial en la música y la palabra para Metanoia 2026 en Guazapa?',
    scripture: '28 Noviembre • Guazapa',
    options: [
      'Pablo Rosales',
      'Marcos Witt',
      'Danilo Montero',
      'Jesús Adrián Romero',
    ],
    correctIndex: 0,
    explanation: 'Pablo Rosales ministrará en la alabanza y la predicación este 28 de Noviembre a las 6:00 PM en IGLEPACBEN AD Guazapa.',
  },
  {
    id: 4,
    question: '¿Qué apóstol experimentó una Metanoia radical camino a Damasco?',
    scripture: 'Hechos 9',
    options: ['Pedro', 'Tomás', 'Saulo de Tarso (Pablo)', 'Bernabé'],
    correctIndex: 2,
    explanation: 'Saulo pasó de perseguidor a apóstol tras encontrarse personalmente con la luz de Jesucristo.',
  },
  {
    id: 5,
    question: 'Según Filipenses 4:8, ¿en qué cosas nos manda la Biblia enfocar nuestros pensamientos?',
    scripture: 'Filipenses 4:8',
    options: [
      'En las ofensas que nos hicieron',
      'En todo lo verdadero, honesto, justo y puro',
      'En los temores de las redes sociales',
      'En la incertidumbre del mañana',
    ],
    correctIndex: 1,
    explanation: 'Dios nos da un filtro mental de excelencia: enfocar nuestra mente en Su verdad, pureza y lo digno de alabanza.',
  },
  {
    id: 6,
    question: '¿Qué promete 2 Corintios 5:17 a quien decide entregarse a Cristo?',
    scripture: '2 Corintios 5:17',
    options: [
      'Que nunca tendrá ningún problema',
      'Nueva criatura es; las cosas viejas pasaron',
      'Riquezas automáticas',
      'Que no necesitará volver a orar',
    ],
    correctIndex: 1,
    explanation: 'En Cristo tu código es reiniciado: el pasado queda cancelado en la cruz y renaces como una nueva criatura.',
  },
  {
    id: 7,
    question: '¿Con qué arma espiritual derribamos los argumentos y mentiras del enemigo?',
    scripture: '2 Corintios 10:5',
    options: [
      'Llevando cautivo todo pensamiento a la obediencia a Cristo',
      'Discutiendo agresivamente en redes',
      'Ignorando la Biblia por completo',
      'Buscando validación en las tendencias',
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
      'Que busque agradar a la multitud',
    ],
    correctIndex: 1,
    explanation: 'La juventud está llamada a ser punta de lanza: ejemplo en palabra, conducta, amor, espíritu, fe y pureza.',
  },
  {
    id: 9,
    question: '¿Qué profetizó Jeremías respecto a los pensamientos de Dios para nuestras vidas?',
    scripture: 'Jeremías 29:11',
    options: [
      'Pensamientos de juicio estricto',
      'Pensamientos de paz y un porvenir lleno de esperanza',
      'Pensamientos de olvido',
      'Pensamientos de temor',
    ],
    correctIndex: 1,
    explanation: '«Porque yo sé los pensamientos que tengo acerca de vosotros: pensamientos de paz, y no de mal, para daros el fin que esperáis.»',
  },
  {
    id: 10,
    question: '¿Cuál es la fecha y hora oficial del gran evento METANOIA 2026 en IGLEPACBEN AD Guazapa?',
    scripture: 'Gran Noche de Poder',
    options: [
      '15 de Octubre • 07:00 PM',
      '28 de Noviembre • 06:00 PM',
      '10 de Diciembre • 05:00 PM',
      '31 de Diciembre • 08:00 PM',
    ],
    correctIndex: 1,
    explanation: '¡Sábado 28 de Noviembre a las 6:00 PM! Una noche para transformar la historia de nuestra generación.',
  },
];

/* -------------------------------------------------------------------------- */
/* MINIGAME 2: "GUARDIÁN DEL PENSAMIENTO (FILIPENSES 4:8)"                    */
/* -------------------------------------------------------------------------- */

interface ThoughtItem {
  id: string;
  text: string;
  type: 'good' | 'bad' | 'powerup';
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
  'Amor Ágape',
  'Perdón',
  'Propósito',
  'Fe Viva',
  'Mente de Cristo',
  'Identidad',
  'Gozo',
];

const BAD_THOUGHTS = [
  'Ansiedad',
  'Mentira',
  'Rencor',
  'Miedo',
  'Comparación',
  'Culpa',
  'Orgullo',
  'Apatía',
  'Chisme',
  'Envidia',
];

const POWERUP_THOUGHTS = [
  '🕊️ Espíritu Santo (+1 Escudo)',
  '⚡ Palabra Viva (+100 Pts)',
];

/* -------------------------------------------------------------------------- */
/* MINIGAME 3: "MATRIZ DE MEMORIA BÍBLICA"                                    */
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
  { pairId: 4, label: 'Código Nuevo', icon: '💻', sub: 'Pasado Borrado' },
  { pairId: 5, label: 'Escudo de Fe', icon: '🛡️', sub: 'Protección' },
  { pairId: 5, label: 'Espada de Dios', icon: '⚔️', sub: 'Palabra Viva' },
  { pairId: 6, label: 'Pablo Rosales', icon: '🎸', sub: 'Alabanza & Palabra' },
  { pairId: 6, label: '28 Noviembre', icon: '📅', sub: 'Guazapa 2026' },
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
  const [isCopied, setIsCopied] = useState(false);

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
      if (navigator.vibrate) navigator.vibrate([20, 30, 20]);
      const points = 100 + streak * 30 + Math.max(0, triviaTimeLeft * 10);
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
      if (navigator.vibrate) navigator.vibrate([50, 40]);
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
        const rand = Math.random();
        let type: 'good' | 'bad' | 'powerup' = 'good';
        let text = '';

        if (rand < 0.12) {
          type = 'powerup';
          text = POWERUP_THOUGHTS[Math.floor(Math.random() * POWERUP_THOUGHTS.length)];
        } else if (rand < 0.6) {
          type = 'good';
          text = GOOD_THOUGHTS[Math.floor(Math.random() * GOOD_THOUGHTS.length)];
        } else {
          type = 'bad';
          text = BAD_THOUGHTS[Math.floor(Math.random() * BAD_THOUGHTS.length)];
        }

        const newItem: ThoughtItem = {
          id: `${Date.now()}-${Math.random()}`,
          text,
          type,
          x: Math.floor(Math.random() * 68) + 12,
          y: -8,
          speed: Math.random() * 1.1 + 0.9,
        };
        return [...prev, newItem];
      });
    }, 750);

    const mover = setInterval(() => {
      setActiveItems((prev) => {
        const next: ThoughtItem[] = [];
        for (const item of prev) {
          const newY = item.y + item.speed * 2.1;
          if (newY > 93) {
            // Bad thoughts passing safely award points
            if (item.type === 'bad') {
              setThoughtScore((s) => s + 25);
            }
          } else {
            next.push({ ...item, y: newY });
          }
        }
        return next;
      });
    }, 45);

    return () => {
      clearInterval(spawner);
      clearInterval(mover);
    };
  }, [thoughtGameStep]);

  const handleCatchThought = (item: ThoughtItem) => {
    setActiveItems((prev) => prev.filter((i) => i.id !== item.id));

    if (item.type === 'good') {
      playGameCatch();
      if (navigator.vibrate) navigator.vibrate(20);
      setThoughtScore((s) => {
        const next = s + 50;
        if (next > thoughtHighScore) {
          setThoughtHighScore(next);
          localStorage.setItem('metanoia_thought_high', String(next));
        }
        return next;
      });
    } else if (item.type === 'powerup') {
      playNeonChime();
      if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
      if (item.text.includes('Escudo')) {
        setShields((prev) => Math.min(3, prev + 1));
      }
      setThoughtScore((s) => {
        const next = s + 100;
        if (next > thoughtHighScore) {
          setThoughtHighScore(next);
          localStorage.setItem('metanoia_thought_high', String(next));
        }
        return next;
      });
    } else {
      playGameWrong();
      if (navigator.vibrate) navigator.vibrate([40, 40]);
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
    if (navigator.vibrate) navigator.vibrate(15);
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
        setTimeout(() => {
          playGameCorrect();
          if (navigator.vibrate) navigator.vibrate([20, 40]);
          nextCards[firstIdx].isMatched = true;
          nextCards[secondIdx].isMatched = true;
          setMemoryCards([...nextCards]);
          setFlippedIndices([]);
          setIsProcessingMatch(false);

          const allWon = nextCards.every((c) => c.isMatched);
          if (allWon) {
            playNeonChime();
            setMemoryStep('won');
            const scoreCalc = Math.max(100, 1200 - memoryMoves * 25 - memoryTime * 6);
            if (scoreCalc > memoryHighScore) {
              setMemoryHighScore(scoreCalc);
              localStorage.setItem('metanoia_memory_high', String(scoreCalc));
            }
          }
        }, 400);
      } else {
        setTimeout(() => {
          playGameWrong();
          nextCards[firstIdx].isFlipped = false;
          nextCards[secondIdx].isFlipped = false;
          setMemoryCards([...nextCards]);
          setFlippedIndices([]);
          setIsProcessingMatch(false);
        }, 850);
      }
    }
  };

  const getTriviaRank = (finalScore: number) => {
    if (finalScore >= 1400) return { title: 'Mente de Cristo Master', color: '#c084fc', desc: '¡Increíble discernimiento y sabiduría bíblica!' };
    if (finalScore >= 900) return { title: 'Guerrero de la Fe', color: '#00f0ff', desc: 'Conocimiento sólido y entendimiento renovado.' };
    if (finalScore >= 500) return { title: 'Discípulo en Crecimiento', color: '#f472b6', desc: '¡Vas por gran camino, continúa meditando en la Palabra!' };
    return { title: 'Buscador de Sabiduría', color: '#a855f7', desc: '¡Sigue alimentando tu mente con la Palabra de Dios!' };
  };

  const handleShareScore = (gameName: string, gameScore: number) => {
    playCyberClick();
    const shareText = `🎮 ¡Acabo de lograr ${gameScore} puntos en ${gameName} en METANOIA 2026! 🔥\n¿Puedes superar mi récord? Nos vemos este 28 de Noviembre en IGLEPACBEN AD Guazapa con Pablo Rosales.`;

    if (navigator.share) {
      navigator.share({ title: 'Récord Metanoia 2026', text: shareText, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  return (
    <section id="minijuegos" className="relative py-20 px-3.5 sm:px-8 max-w-7xl mx-auto z-20">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#180738] border border-purple-500/40 text-[#c084fc] text-xs font-mono-cyber tracking-[0.25em] uppercase mb-3.5 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
          <Gamepad2 className="w-4 h-4 text-[#00f0ff]" />
          <span>CYBER ARCADE • RETOS DE FE Y MENTE</span>
        </div>

        <h2 className="cyber-metanoia-title text-4xl xs:text-5xl sm:text-6xl text-white tracking-tight leading-none mb-3">
          MINIJUEGOS <span className="text-[#c084fc] drop-shadow-[0_0_20px_rgba(192,132,252,0.8)]">METANOIA</span>
        </h2>

        <p className="font-body text-xs sm:text-base text-purple-200/80 max-w-xl mx-auto leading-relaxed">
          Tres desafíos interactivos para poner a prueba tus reflejos, memoria bíblica y discernimiento espiritual para este gran encuentro del 28 de Noviembre.
        </p>

        {/* Game Mode Selector (Mobile Thumb-Zone Tabs) */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-3 mt-6 sm:mt-8 max-w-2xl mx-auto">
          <button
            onClick={() => {
              if (activeGame !== 'trivia') {
                playCyberClick();
                playCyberTransition();
                setActiveGame('trivia');
              }
            }}
            onMouseEnter={() => playCyberHover('subtle')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 p-2.5 sm:px-4 sm:py-3 rounded-2xl font-cyber text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer touch-manipulation min-h-[48px] ${
              activeGame === 'trivia'
                ? 'bg-gradient-to-r from-[#9333ea] to-[#7b2cbf] text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] border border-purple-400 scale-[1.02]'
                : 'bg-[#12052c]/90 border border-purple-500/25 text-purple-300 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-[#00f0ff]" />
            <span>1. Trivia</span>
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
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 p-2.5 sm:px-4 sm:py-3 rounded-2xl font-cyber text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer touch-manipulation min-h-[48px] ${
              activeGame === 'thoughts'
                ? 'bg-gradient-to-r from-[#f472b6] to-[#ec4899] text-white shadow-[0_0_20px_rgba(244,114,182,0.5)] border border-pink-400 scale-[1.02]'
                : 'bg-[#12052c]/90 border border-purple-500/25 text-purple-300 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4 text-[#00f0ff]" />
            <span>2. Guardián</span>
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
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 p-2.5 sm:px-4 sm:py-3 rounded-2xl font-cyber text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer touch-manipulation min-h-[48px] ${
              activeGame === 'memory'
                ? 'bg-gradient-to-r from-[#00f0ff] to-[#38bdf8] text-black font-extrabold shadow-[0_0_20px_rgba(0,240,255,0.5)] border border-cyan-300 scale-[1.02]'
                : 'bg-[#12052c]/90 border border-purple-500/25 text-purple-300 hover:text-white'
            }`}
          >
            <Brain className="w-4 h-4 text-[#00ff9d]" />
            <span>3. Memoria</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* GAME 1: TRIVIA DE LA MENTE RENOVADA                                  */}
      {/* ==================================================================== */}
      {activeGame === 'trivia' && (
        <div className="max-w-3xl mx-auto rounded-3xl bg-[#0e0422]/95 backdrop-blur-xl border-2 border-purple-500/50 p-4 sm:p-8 shadow-[0_0_50px_rgba(168,85,247,0.25)] relative overflow-hidden">
          {triviaStep === 'idle' && (
            <div className="text-center py-6 sm:py-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#a855f7]/20 border border-purple-400/40 flex items-center justify-center mx-auto mb-5 text-[#c084fc] shadow-[0_0_25px_rgba(168,85,247,0.35)]">
                <HelpCircle className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>

              <h3 className="font-cyber-heavy text-2xl sm:text-3xl text-white tracking-tight mb-2">
                DESAFÍO METANOIA: TRIVIA DE LA FE
              </h3>
              <p className="font-body text-xs sm:text-sm text-purple-200/80 max-w-md mx-auto mb-6">
                10 preguntas sobre la renovación de la mente, Pablo Rosales y la verdad de Cristo. ¡15 segundos por pregunta con bonificación por racha!
              </p>

              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-purple-950/60 border border-purple-500/30 text-xs font-mono-cyber text-[#00f0ff] mb-6">
                <Trophy className="w-4 h-4 text-[#c084fc]" />
                <span>RÉCORD PERSONAL: {triviaHighScore} PTS</span>
              </div>

              <div>
                <button
                  onClick={startTrivia}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#9333ea] via-[#c084fc] to-[#00f0ff] text-white font-cyber text-xs sm:text-sm font-extrabold tracking-widest uppercase shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2.5 mx-auto min-h-[48px]"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>INICIAR DESAFÍO</span>
                </button>
              </div>
            </div>
          )}

          {triviaStep === 'playing' && (
            <div>
              <div className="flex items-center justify-between gap-2 pb-4 mb-5 border-b border-purple-500/20 text-xs font-mono-cyber">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-purple-950/70 border border-purple-500/40 text-[#c084fc] font-bold">
                    PREGUNTA {currentQuestionIndex + 1}/{TRIVIA_QUESTIONS.length}
                  </span>
                  {streak > 1 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-pink-500/20 border border-pink-500/40 text-pink-300 font-bold">
                      <Flame className="w-3.5 h-3.5 text-pink-400" />
                      <span>{streak}X RACHA</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border font-bold ${
                      triviaTimeLeft <= 4
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                        : 'bg-purple-950/60 border-purple-500/30 text-[#00f0ff]'
                    }`}
                  >
                    <Timer className="w-3.5 h-3.5" />
                    <span>{triviaTimeLeft}s</span>
                  </div>

                  <div className="text-purple-200">
                    SCORE: <span className="font-bold text-white font-mono">{score}</span>
                  </div>
                </div>
              </div>

              {/* Question Header */}
              <div className="mb-5">
                <span className="text-[10px] font-mono-cyber text-[#c084fc] uppercase tracking-widest block mb-1 font-bold">
                  REFERENCIA: {question.scripture}
                </span>
                <h4 className="font-body text-base sm:text-xl font-bold text-white leading-snug">
                  {question.question}
                </h4>
              </div>

              {/* Options */}
              <div className="space-y-2.5 mb-5">
                {question.options.map((option, idx) => {
                  let btnStyle = 'bg-[#150734]/70 border-purple-500/30 text-purple-100 hover:bg-[#1f0a4a] hover:border-purple-400';

                  if (isAnswerRevealed) {
                    if (idx === question.correctIndex) {
                      btnStyle = 'bg-[#00ff9d]/20 border-[#00ff9d] text-[#00ff9d] font-bold shadow-[0_0_15px_rgba(0,255,157,0.3)]';
                    } else if (idx === selectedOption) {
                      btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold';
                    } else {
                      btnStyle = 'bg-white/5 border-white/5 text-white/30 opacity-40';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswerRevealed}
                      onClick={() => handleSelectOption(idx)}
                      onMouseEnter={() => !isAnswerRevealed && playCyberHover('crisp')}
                      className={`w-full p-3.5 sm:p-4 rounded-xl border text-left font-body text-xs sm:text-sm transition-all flex items-center justify-between gap-3 cursor-pointer touch-manipulation min-h-[48px] ${btnStyle}`}
                    >
                      <span className="font-medium">{option}</span>
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
                <div className="p-3.5 rounded-xl bg-purple-950/60 border border-purple-500/30 mb-5 text-xs sm:text-sm text-purple-200 font-body">
                  <strong className="text-[#00f0ff] font-semibold">Explicación Bíblica:</strong> {question.explanation}
                </div>
              )}

              {isAnswerRevealed && (
                <div className="flex justify-end">
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#9333ea] to-[#00f0ff] text-white font-cyber text-xs font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-105 transition-all cursor-pointer min-h-[44px]"
                  >
                    {currentQuestionIndex + 1 < TRIVIA_QUESTIONS.length ? 'SIGUIENTE PREGUNTA →' : 'VER RESULTADOS'}
                  </button>
                </div>
              )}
            </div>
          )}

          {triviaStep === 'results' && (
            <div className="text-center py-6 sm:py-8">
              <div className="w-20 h-20 rounded-3xl bg-[#c084fc]/20 border border-purple-400 flex items-center justify-center mx-auto mb-4 text-[#c084fc] shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                <Trophy className="w-10 h-10" />
              </div>

              <div className="text-xs font-mono-cyber text-[#00f0ff] uppercase tracking-widest mb-1.5 font-bold">
                DESAFÍO COMPLETADO
              </div>

              <h3 className="font-cyber-heavy text-3xl sm:text-5xl text-white mb-2">
                {score} <span className="text-base text-purple-300">PUNTOS</span>
              </h3>

              {(() => {
                const rank = getTriviaRank(score);
                return (
                  <div className="my-5 p-4 rounded-2xl bg-[#140632] border border-purple-500/30 max-w-md mx-auto">
                    <span className="text-[10px] font-mono-cyber text-purple-300 uppercase tracking-widest block mb-1">
                      RANGO ESPIRITUAL
                    </span>
                    <h4 className="font-cyber text-lg sm:text-xl font-bold mb-1.5" style={{ color: rank.color }}>
                      {rank.title}
                    </h4>
                    <p className="text-xs font-body text-purple-200/80">{rank.desc}</p>
                  </div>
                );
              })()}

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => handleShareScore('Trivia de la Fe', score)}
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-cyber text-xs font-bold uppercase tracking-wider border border-white/20 transition-all cursor-pointer flex items-center gap-2 min-h-[44px]"
                >
                  {isCopied ? <Check className="w-4 h-4 text-[#00ff9d]" /> : <Share2 className="w-4 h-4 text-[#00f0ff]" />}
                  <span>{isCopied ? '¡Copiado!' : 'Compartir Récord'}</span>
                </button>

                <button
                  onClick={startTrivia}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#9333ea] to-[#7b2cbf] text-white font-cyber text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-105 transition-all cursor-pointer flex items-center gap-2 min-h-[44px]"
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
        <div className="max-w-3xl mx-auto rounded-3xl bg-[#0e0422]/95 backdrop-blur-xl border-2 border-pink-500/40 p-4 sm:p-8 shadow-[0_0_50px_rgba(244,114,182,0.2)] relative overflow-hidden">
          {thoughtGameStep === 'idle' && (
            <div className="text-center py-6 sm:py-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center mx-auto mb-5 text-pink-400 shadow-[0_0_25px_rgba(244,114,182,0.35)]">
                <Shield className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>

              <h3 className="font-cyber-heavy text-2xl sm:text-3xl text-white tracking-tight mb-2">
                GUARDIÁN DEL PENSAMIENTO
              </h3>
              <p className="font-body text-xs sm:text-sm text-purple-200/80 max-w-md mx-auto mb-6">
                Basado en Filipenses 4:8. Toca únicamente los <strong className="text-[#00f0ff]">buenos pensamientos</strong> (Paz, Verdad, Fe) y los powerups del Espíritu Santo. ¡Deja pasar los pensamientos negativos!
              </p>

              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-purple-950/60 border border-pink-500/30 text-xs font-mono-cyber text-[#00f0ff] mb-6">
                <Trophy className="w-4 h-4 text-pink-400" />
                <span>RÉCORD PERSONAL: {thoughtHighScore} PTS</span>
              </div>

              <div>
                <button
                  onClick={startThoughtGame}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-[#00f0ff] text-white font-cyber text-xs sm:text-sm font-extrabold tracking-widest uppercase shadow-[0_0_25px_rgba(244,114,182,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2.5 mx-auto min-h-[48px]"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>INICIAR GUARDIÁN</span>
                </button>
              </div>
            </div>
          )}

          {thoughtGameStep === 'playing' && (
            <div>
              <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-pink-500/20 text-xs font-mono-cyber">
                <div className="flex items-center gap-1 text-pink-400 font-bold">
                  <span>ESCUDOS:</span>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Shield
                      key={i}
                      className={`w-4 h-4 ${i < shields ? 'text-[#00f0ff] fill-[#00f0ff]/50' : 'text-white/20'}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-[#00f0ff] font-bold">TIEMPO: {thoughtTimeLeft}s</div>
                  <div className="text-[#00ff9d] font-bold font-mono">PTS: {thoughtScore}</div>
                </div>
              </div>

              <div
                ref={gameAreaRef}
                className="relative w-full h-[360px] sm:h-[400px] rounded-2xl bg-[#090216] border border-purple-500/30 overflow-hidden select-none touch-none"
              >
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(168,85,247,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,240,255,0.05)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

                {activeItems.map((item) => {
                  let styleClasses = 'bg-gradient-to-r from-purple-600 to-[#00f0ff] text-white border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.5)]';
                  if (item.type === 'powerup') {
                    styleClasses = 'bg-gradient-to-r from-yellow-400 to-amber-600 text-black border-yellow-300 shadow-[0_0_18px_rgba(250,204,21,0.8)] font-extrabold animate-bounce';
                  } else if (item.type === 'bad') {
                    styleClasses = 'bg-gradient-to-r from-rose-600 to-red-800 text-white border-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.5)]';
                  }

                  return (
                    <button
                      key={item.id}
                      onPointerDown={() => handleCatchThought(item)}
                      style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                      }}
                      className={`absolute transform -translate-x-1/2 px-3.5 py-2 rounded-xl text-[11px] sm:text-xs font-cyber font-bold tracking-wider uppercase cursor-pointer active:scale-90 transition-transform shadow-lg touch-manipulation select-none min-h-[46px] min-w-[65px] border ${styleClasses}`}
                    >
                      {item.text}
                    </button>
                  );
                })}

                {activeItems.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-mono-cyber text-purple-400/50 pointer-events-none">
                    ESCANEANDO PENSAMIENTOS...
                  </div>
                )}
              </div>
            </div>
          )}

          {thoughtGameStep === 'gameover' && (
            <div className="text-center py-6 sm:py-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-pink-500/20 border border-pink-400 flex items-center justify-center mx-auto mb-4 text-pink-400 shadow-[0_0_25px_rgba(244,114,182,0.35)]">
                <Trophy className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>

              <div className="text-xs font-mono-cyber text-[#00f0ff] uppercase tracking-widest mb-1.5 font-bold">
                RONDA FINALIZADA
              </div>

              <h3 className="font-cyber-heavy text-3xl sm:text-5xl text-white mb-2">
                {thoughtScore} <span className="text-base text-purple-300">PUNTOS</span>
              </h3>

              <div className="p-3.5 rounded-xl bg-purple-950/60 border border-purple-500/30 max-w-md mx-auto my-5 text-xs font-body text-purple-200">
                «Sobre toda cosa guardada, guarda tu corazón; porque de él mana la vida.» — Proverbios 4:23
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => handleShareScore('Guardián del Pensamiento', thoughtScore)}
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-cyber text-xs font-bold uppercase tracking-wider border border-white/20 transition-all cursor-pointer flex items-center gap-2 min-h-[44px]"
                >
                  {isCopied ? <Check className="w-4 h-4 text-[#00ff9d]" /> : <Share2 className="w-4 h-4 text-[#00f0ff]" />}
                  <span>{isCopied ? '¡Copiado!' : 'Compartir Récord'}</span>
                </button>

                <button
                  onClick={startThoughtGame}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-cyber text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(244,114,182,0.4)] hover:scale-105 transition-all cursor-pointer flex items-center gap-2 min-h-[44px]"
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
        <div className="max-w-3xl mx-auto rounded-3xl bg-[#0e0422]/95 backdrop-blur-xl border-2 border-cyan-500/40 p-4 sm:p-8 shadow-[0_0_50px_rgba(0,240,255,0.2)] relative overflow-hidden">
          {memoryStep === 'idle' && (
            <div className="text-center py-6 sm:py-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center mx-auto mb-5 text-[#00f0ff] shadow-[0_0_25px_rgba(0,240,255,0.35)]">
                <Brain className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>

              <h3 className="font-cyber-heavy text-2xl sm:text-3xl text-white tracking-tight mb-2">
                MATRIZ DE MEMORIA BÍBLICA
              </h3>
              <p className="font-body text-xs sm:text-sm text-purple-200/80 max-w-md mx-auto mb-6">
                Encuentra las 6 parejas de conceptos bíblicos, Pablo Rosales y promesas de Metanoia en el menor tiempo y movimientos posibles.
              </p>

              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-purple-950/60 border border-cyan-500/30 text-xs font-mono-cyber text-[#00ff9d] mb-6">
                <Trophy className="w-4 h-4 text-[#00f0ff]" />
                <span>RÉCORD PERSONAL: {memoryHighScore} PTS</span>
              </div>

              <div>
                <button
                  onClick={startMemoryGame}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#00f0ff] to-purple-600 text-black font-cyber text-xs sm:text-sm font-extrabold tracking-widest uppercase shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2.5 mx-auto min-h-[48px]"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>INICIAR MATRIZ</span>
                </button>
              </div>
            </div>
          )}

          {memoryStep === 'playing' && (
            <div>
              <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-cyan-500/20 text-xs font-mono-cyber">
                <div className="text-[#00ff9d] font-bold flex items-center gap-1">
                  <Timer className="w-3.5 h-3.5" /> {memoryTime}s
                </div>
                <div className="text-[#00f0ff] font-bold flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" /> MOV: {memoryMoves}
                </div>
                <div className="text-[#c084fc] font-bold">
                  PAREJAS: {memoryCards.filter((c) => c.isMatched).length / 2}/6
                </div>
              </div>

              {/* 12 Cards Grid - Mobile 4x3 Optimized */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3.5">
                {memoryCards.map((card, index) => {
                  const isVisible = card.isFlipped || card.isMatched;

                  return (
                    <button
                      key={card.id}
                      onClick={() => handleCardClick(index)}
                      className={`h-22 xs:h-24 sm:h-28 rounded-xl border p-1.5 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer touch-manipulation select-none relative overflow-hidden min-h-[44px] ${
                        card.isMatched
                          ? 'bg-[#00ff9d]/20 border-[#00ff9d] text-white shadow-[0_0_15px_rgba(0,255,157,0.35)] scale-[0.98]'
                          : isVisible
                          ? 'bg-[#180538] border-cyan-400 text-white shadow-[0_0_15px_rgba(0,240,255,0.4)] scale-105'
                          : 'bg-[#12062e] border-purple-500/30 hover:border-purple-400 text-white/30'
                      }`}
                    >
                      {isVisible ? (
                        <>
                          <span className="text-xl sm:text-2xl mb-1">{card.icon}</span>
                          <span className="font-cyber font-bold text-[10px] sm:text-xs tracking-wider uppercase text-white leading-tight">
                            {card.label}
                          </span>
                          <span className="text-[8px] sm:text-[9px] font-mono text-[#00f0ff] mt-0.5">
                            {card.sub}
                          </span>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-0.5">
                          <img
                            src="/assets/metanoia-logo-official.png"
                            alt="Logo"
                            className="w-7 h-7 object-contain opacity-60"
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = 'none';
                            }}
                          />
                          <span className="text-[7px] sm:text-[8px] font-mono-cyber text-purple-300/60 tracking-widest">
                            METANOIA
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {memoryStep === 'won' && (
            <div className="text-center py-6 sm:py-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center mx-auto mb-4 text-[#00f0ff] shadow-[0_0_30px_rgba(0,240,255,0.4)] animate-bounce">
                <Trophy className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>

              <div className="text-xs font-mono-cyber text-[#00ff9d] uppercase tracking-widest mb-1.5 font-bold">
                ¡MATRIZ SINCRONIZADA CON ÉXITO!
              </div>

              <h3 className="font-cyber-heavy text-3xl sm:text-5xl text-white mb-2">
                {Math.max(100, 1200 - memoryMoves * 25 - memoryTime * 6)} <span className="text-base text-purple-300">PUNTOS</span>
              </h3>

              <p className="text-xs font-mono-cyber text-purple-200 mb-5">
                Completado en {memoryTime} segundos y {memoryMoves} movimientos.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => handleShareScore('Matriz de Memoria', Math.max(100, 1200 - memoryMoves * 25 - memoryTime * 6))}
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-cyber text-xs font-bold uppercase tracking-wider border border-white/20 transition-all cursor-pointer flex items-center gap-2 min-h-[44px]"
                >
                  {isCopied ? <Check className="w-4 h-4 text-[#00ff9d]" /> : <Share2 className="w-4 h-4 text-[#00f0ff]" />}
                  <span>{isCopied ? '¡Copiado!' : 'Compartir Récord'}</span>
                </button>

                <button
                  onClick={startMemoryGame}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00f0ff] to-purple-600 text-black font-cyber text-xs font-extrabold uppercase tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:scale-105 transition-all cursor-pointer flex items-center gap-2 min-h-[44px]"
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
