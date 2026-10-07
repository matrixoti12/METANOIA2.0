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
  Grid,
  Lightbulb,
  Award,
  Music,
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
    question: '¿Cuál es la palabra clave y lema oficial de METANOIA para este año 2026?',
    scripture: 'Lema Oficial 2026',
    options: ['RELOAD', 'RESTART', 'ONLINE', 'UPGRADE'],
    correctIndex: 0,
    explanation: '¡RELOAD! Reiniciar nuestra mente y corazón bajo el Espíritu Santo, desarmando la ansiedad y renovando el entendimiento.',
  },
  {
    id: 3,
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
    id: 4,
    question: '¿Quién es el invitado especial en la música y la palabra para Metanoia 2026 en Guazapa?',
    scripture: '28 Noviembre • Guazapa',
    options: [
      'Pablo Rosales',
      'Marcos Witt',
      'Danilo Montero',
      'Jesús Adrián Romero',
    ],
    correctIndex: 0,
    explanation: 'Pablo Rosales ministrará en la alabanza y la predicación este sábado 28 de Noviembre a las 6:00 PM en IGLEPACBEN AD Guazapa.',
  },
  {
    id: 5,
    question: '¿Qué apóstol experimentó una Metanoia radical camino a Damasco?',
    scripture: 'Hechos 9',
    options: ['Pedro', 'Tomás', 'Saulo de Tarso (Pablo)', 'Bernabé'],
    correctIndex: 2,
    explanation: 'Saulo pasó de perseguidor a apóstol tras encontrarse personalmente con la luz resucitada de Jesucristo.',
  },
  {
    id: 6,
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
    id: 7,
    question: '¿Qué promete 2 Corintios 5:17 a quien decide entregarse a Cristo?',
    scripture: '2 Corintios 5:17',
    options: [
      'Que nunca tendrá ningún problema',
      'Nueva criatura es; las cosas viejas pasaron',
      'Riquezas automáticas',
      'Que no necesitará volver a orar',
    ],
    correctIndex: 1,
    explanation: 'En Cristo tu vida tiene un RELOAD total: el pasado queda cancelado en la cruz y renaces como una nueva criatura.',
  },
  {
    id: 8,
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
    id: 9,
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
    id: 10,
    question: '¿Cuál es la fecha, hora y lugar oficial de METANOIA 2026?',
    scripture: 'Gran Noche de Poder',
    options: [
      '15 de Octubre • 07:00 PM • San Salvador',
      '28 de Noviembre • 06:00 PM • IGLEPACBEN AD Guazapa',
      '10 de Diciembre • 05:00 PM • Santa Ana',
      '31 de Diciembre • 08:00 PM • San Miguel',
    ],
    correctIndex: 1,
    explanation: '¡Sábado 28 de Noviembre a las 6:00 PM en IGLEPACBEN AD Guazapa! Entrada totalmente libre.',
  },
];

/* -------------------------------------------------------------------------- */
/* CRUCIGRAMA RELOAD DATA (7x7 GRID, 5 BIBLE & EVENT WORDS)                  */
/* -------------------------------------------------------------------------- */

interface CrosswordClue {
  number: number;
  word: string;
  direction: 'across' | 'down';
  row: number;
  col: number;
  length: number;
  hint: string;
  reference: string;
}

const CROSSWORD_CLUES: CrosswordClue[] = [
  {
    number: 1,
    word: 'RELOAD',
    direction: 'down',
    row: 0,
    col: 2,
    length: 6,
    hint: 'Palabra oficial de Metanoia 2026: Reiniciar mente y corazón en Cristo.',
    reference: 'Lema 2026',
  },
  {
    number: 2,
    word: 'MENTE',
    direction: 'across',
    row: 1,
    col: 1,
    length: 5,
    hint: 'Lo que Romanos 12:2 manda renovar: "...por la renovación de vuestro entendimiento".',
    reference: 'Romanos 12:2',
  },
  {
    number: 3,
    word: 'PABLO',
    direction: 'across',
    row: 4,
    col: 1,
    length: 5,
    hint: 'Ministro de adoración y predicación invitado a Guazapa este 28 de Noviembre.',
    reference: 'Invitado Especial',
  },
  {
    number: 4,
    word: 'FE',
    direction: 'down',
    row: 0,
    col: 5,
    length: 2,
    hint: 'Hebreos 11:1: "Certeza de lo que se espera, convicción de lo que no se ve".',
    reference: 'Hebreos 11:1',
  },
  {
    number: 5,
    word: 'PAZ',
    direction: 'down',
    row: 4,
    col: 1,
    length: 3,
    hint: 'Filipenses 4:7: "Y la ___ de Dios, que sobrepasa todo entendimiento".',
    reference: 'Filipenses 4:7',
  },
];

// Map 7x7 grid cells: key "r-c", value { letter, clueNumbers: number[] }
interface CrosswordCellInfo {
  letter: string;
  clues: number[];
  startNumber?: number;
}

const buildCrosswordGridMap = () => {
  const map: Record<string, CrosswordCellInfo> = {};

  CROSSWORD_CLUES.forEach((clue) => {
    for (let i = 0; i < clue.length; i++) {
      const r = clue.direction === 'down' ? clue.row + i : clue.row;
      const c = clue.direction === 'across' ? clue.col + i : clue.col;
      const key = `${r}-${c}`;
      const char = clue.word[i];

      if (!map[key]) {
        map[key] = {
          letter: char,
          clues: [clue.number],
          startNumber: i === 0 ? clue.number : undefined,
        };
      } else {
        map[key].clues.push(clue.number);
        if (i === 0) {
          map[key].startNumber = clue.number;
        }
      }
    }
  });

  return map;
};

const CROSSWORD_CELL_MAP = buildCrosswordGridMap();

/* -------------------------------------------------------------------------- */
/* MEMORY PAIRS DATA                                                          */
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
  { pairId: 1, label: 'RELOAD', icon: '⚡', sub: 'Giro de 180°' },
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
  const [activeGame, setActiveGame] = useState<'crossword' | 'trivia' | 'memory'>('crossword');

  /* ------------------------------------------------------------------------ */
  /* CRUCIGRAMA STATE                                                         */
  /* ------------------------------------------------------------------------ */
  const [userLetters, setUserLetters] = useState<Record<string, string>>({});
  const [selectedClueNumber, setSelectedClueNumber] = useState<number>(1);
  const [selectedCellKey, setSelectedCellKey] = useState<string>('0-2');
  const [crosswordWon, setCrosswordWon] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [crosswordErrorKey, setCrosswordErrorKey] = useState<string | null>(null);

  const activeClue = CROSSWORD_CLUES.find((c) => c.number === selectedClueNumber) || CROSSWORD_CLUES[0];

  const handleCellSelect = (r: number, c: number) => {
    playCyberClick();
    const key = `${r}-${c}`;
    if (!CROSSWORD_CELL_MAP[key]) return;
    setSelectedCellKey(key);

    const cellClues = CROSSWORD_CELL_MAP[key].clues;
    if (cellClues.includes(selectedClueNumber)) {
      // Keep current clue
    } else {
      setSelectedClueNumber(cellClues[0]);
    }
  };

  const handleClueSelect = (clueNumber: number) => {
    playCyberClick();
    setSelectedClueNumber(clueNumber);
    const clue = CROSSWORD_CLUES.find((c) => c.number === clueNumber);
    if (clue) {
      setSelectedCellKey(`${clue.row}-${clue.col}`);
    }
  };

  const handleLetterInput = (char: string) => {
    if (!selectedCellKey || !CROSSWORD_CELL_MAP[selectedCellKey]) return;

    playCyberClick('confirm');
    const upper = char.toUpperCase().slice(-1);
    const nextLetters = { ...userLetters, [selectedCellKey]: upper };
    setUserLetters(nextLetters);

    // Auto-advance cursor along current clue
    const [rStr, cStr] = selectedCellKey.split('-');
    const r = parseInt(rStr, 10);
    const c = parseInt(cStr, 10);

    let nextR = r;
    let nextC = c;

    if (activeClue.direction === 'across') {
      nextC += 1;
    } else {
      nextR += 1;
    }

    const nextKey = `${nextR}-${nextC}`;
    if (CROSSWORD_CELL_MAP[nextKey] && CROSSWORD_CELL_MAP[nextKey].clues.includes(activeClue.number)) {
      setSelectedCellKey(nextKey);
    }

    // Check complete victory
    checkVictory(nextLetters);
  };

  const checkVictory = (letters: Record<string, string>) => {
    const allKeys = Object.keys(CROSSWORD_CELL_MAP);
    const allCorrect = allKeys.every((key) => {
      const target = CROSSWORD_CELL_MAP[key].letter;
      const user = letters[key];
      return user && user.toUpperCase() === target;
    });

    if (allCorrect && allKeys.length > 0) {
      playNeonChime();
      playGameCorrect();
      setCrosswordWon(true);
    }
  };

  const handleRevealHint = () => {
    if (!selectedCellKey || !CROSSWORD_CELL_MAP[selectedCellKey]) return;
    playCyberClick();
    const correctLetter = CROSSWORD_CELL_MAP[selectedCellKey].letter;
    const nextLetters = { ...userLetters, [selectedCellKey]: correctLetter };
    setUserLetters(nextLetters);
    setHintsUsed((h) => h + 1);
    checkVictory(nextLetters);
  };

  const handleVerifyCurrentClue = () => {
    playCyberClick();
    let hasError = false;

    for (let i = 0; i < activeClue.length; i++) {
      const r = activeClue.direction === 'down' ? activeClue.row + i : activeClue.row;
      const c = activeClue.direction === 'across' ? activeClue.col + i : activeClue.col;
      const key = `${r}-${c}`;
      const targetChar = activeClue.word[i];
      const userChar = userLetters[key];

      if (!userChar || userChar.toUpperCase() !== targetChar) {
        hasError = true;
        setCrosswordErrorKey(key);
        playGameWrong();
        setTimeout(() => setCrosswordErrorKey(null), 1200);
        break;
      }
    }

    if (!hasError) {
      playGameCorrect();
    }
  };

  const handleResetCrossword = () => {
    playCyberClick();
    setUserLetters({});
    setCrosswordWon(false);
    setHintsUsed(0);
    setSelectedClueNumber(1);
    setSelectedCellKey('0-2');
  };

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
  /* MEMORY PAIRS STATE                                                       */
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
        }, 350);
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

  const handleShareScore = (gameName: string, gameScore: number | string) => {
    playCyberClick();
    const shareText = `🎮 ¡Completé ${gameName} (${gameScore}) en METANOIA 2026 // RELOAD! 🔥\n¿Puedes superarlo? Nos vemos este sábado 28 de Noviembre en IGLEPACBEN AD Guazapa con Pablo Rosales.`;

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
      
      {/* Resplandores cósmicos de fondo */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#b01cc6]/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#730bb3]/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Encabezado de la Sección */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#730bb3]/30 border border-[#c3a7ff]/40 text-[#e4c5ff] text-xs font-cyber tracking-wider uppercase mb-3 shadow-[0_0_18px_rgba(195,167,255,0.3)]">
          <Gamepad2 className="w-4 h-4 text-[#f4b6ff]" />
          <span>CYBER ARCADE • RELOAD ESPIRITUAL</span>
        </div>

        <h2 className="font-cyber-heavy text-4xl xs:text-5xl sm:text-6xl text-white tracking-tight leading-none mb-3">
          JUEGOS <span className="text-[#f4b6ff] drop-shadow-[0_0_20px_rgba(244,182,255,0.6)]">METANOIA</span>
        </h2>

        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-[#b01cc6]/10 via-[#730bb3]/20 to-[#b01cc6]/10 blur-xl rounded-2xl"></div>
          <div className="relative p-4 sm:p-5 rounded-2xl glass-panel-luminous border border-[#c3a7ff]/30 shadow-[0_0_30px_rgba(115,11,179,0.2)] max-w-2xl mx-auto">
            <p className="font-body text-sm sm:text-base text-purple-100 leading-relaxed">
              Desbloquea conocimiento bíblico, completa misiones espirituales y agudiza tu entendimiento.
              <span className="text-[#f4b6ff] font-cyber font-bold tracking-wide text-xs sm:text-sm mt-2 block uppercase">
                Tres experiencias interactivas para prepararte para el 28 de Noviembre
              </span>
            </p>
          </div>
        </div>

        {/* Selector de Modo de Juego (Crucigrama, Trivia, Parejas) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6 sm:mt-8 max-w-2xl mx-auto">
          
          {/* Tab 1: Crucigrama */}
          <button
            onClick={() => {
              if (activeGame !== 'crossword') {
                playCyberClick();
                playCyberTransition();
                setActiveGame('crossword');
              }
            }}
            onMouseEnter={() => playCyberHover('subtle')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 p-3 rounded-2xl font-cyber text-xs font-bold uppercase tracking-wider transition-all cursor-pointer touch-manipulation min-h-[50px] ${
              activeGame === 'crossword'
                ? 'bg-gradient-to-r from-[#b01cc6] to-[#730bb3] text-white shadow-[0_0_22px_rgba(176,28,198,0.6)] border border-[#f4b6ff] scale-[1.02]'
                : 'glass-card-amethyst border border-[#c3a7ff]/30 text-purple-200 hover:text-white'
            }`}
          >
            <Grid className="w-4 h-4 text-[#f4b6ff]" />
            <span>1. Crucigrama</span>
          </button>

          {/* Tab 2: Trivia */}
          <button
            onClick={() => {
              if (activeGame !== 'trivia') {
                playCyberClick();
                playCyberTransition();
                setActiveGame('trivia');
              }
            }}
            onMouseEnter={() => playCyberHover('subtle')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 p-3 rounded-2xl font-cyber text-xs font-bold uppercase tracking-wider transition-all cursor-pointer touch-manipulation min-h-[50px] ${
              activeGame === 'trivia'
                ? 'bg-gradient-to-r from-[#b01cc6] to-[#730bb3] text-white shadow-[0_0_22px_rgba(176,28,198,0.6)] border border-[#f4b6ff] scale-[1.02]'
                : 'glass-card-amethyst border border-[#c3a7ff]/30 text-purple-200 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-[#c3a7ff]" />
            <span>2. Preguntas</span>
          </button>

          {/* Tab 3: Parejas */}
          <button
            onClick={() => {
              if (activeGame !== 'memory') {
                playCyberClick();
                playCyberTransition();
                setActiveGame('memory');
              }
            }}
            onMouseEnter={() => playCyberHover('subtle')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 p-3 rounded-2xl font-cyber text-xs font-bold uppercase tracking-wider transition-all cursor-pointer touch-manipulation min-h-[50px] ${
              activeGame === 'memory'
                ? 'bg-gradient-to-r from-[#b01cc6] to-[#730bb3] text-white shadow-[0_0_22px_rgba(176,28,198,0.6)] border border-[#f4b6ff] scale-[1.02]'
                : 'glass-card-amethyst border border-[#c3a7ff]/30 text-purple-200 hover:text-white'
            }`}
          >
            <Brain className="w-4 h-4 text-[#86efac]" />
            <span>3. Parejas</span>
          </button>

        </div>
      </div>

      {/* ==================================================================== */}
      {/* 1. CRUCIGRAMA BÍBLICO // RELOAD                                      */}
      {/* ==================================================================== */}
      {activeGame === 'crossword' && (
        <div className="max-w-4xl mx-auto rounded-3xl glass-panel-luminous border border-[#c3a7ff]/35 p-5 sm:p-8 shadow-[0_20px_50px_rgba(18,3,30,0.5)] relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            
            {/* Tablero 7x7 del Crucigrama */}
            <div className="w-full md:w-auto flex flex-col items-center">
              
              <div className="inline-flex items-center gap-2 mb-3 text-xs font-cyber text-[#e4c5ff] bg-[#730bb3]/30 px-3 py-1 rounded-full border border-[#c3a7ff]/30">
                <Sparkles className="w-3.5 h-3.5 text-[#f4b6ff]" />
                <span>Pistas cruzadas: Toca una celda o una pista</span>
              </div>

              {/* Grid 7x7 */}
              <div className="p-3 rounded-2xl bg-[#170526]/85 border border-[#c3a7ff]/30 shadow-inner grid grid-cols-7 gap-1.5 sm:gap-2 select-none">
                {Array.from({ length: 7 }).map((_, r) => (
                  <React.Fragment key={r}>
                    {Array.from({ length: 7 }).map((_, c) => {
                      const key = `${r}-${c}`;
                      const cellInfo = CROSSWORD_CELL_MAP[key];

                      if (!cellInfo) {
                        return (
                          <div
                            key={key}
                            className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-[#230a42]/20 border border-transparent"
                          />
                        );
                      }

                      const isSelected = selectedCellKey === key;
                      const isInActiveClue = cellInfo.clues.includes(activeClue.number);
                      const userVal = userLetters[key] || '';
                      const hasError = crosswordErrorKey === key;

                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleCellSelect(r, c)}
                          className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl relative font-cyber text-base sm:text-xl font-extrabold flex items-center justify-center transition-all cursor-pointer touch-manipulation border ${
                            hasError
                              ? 'bg-rose-500/30 border-rose-500 text-rose-200 animate-bounce'
                              : isSelected
                              ? 'bg-[#b01cc6] border-[#f4b6ff] text-white shadow-[0_0_16px_rgba(176,28,198,0.8)] scale-105 z-10'
                              : isInActiveClue
                              ? 'bg-[#730bb3]/45 border-[#c3a7ff]/60 text-white'
                              : 'bg-[#230a42]/70 border-[#c3a7ff]/30 text-purple-100 hover:border-[#c3a7ff]'
                          }`}
                        >
                          {/* Número pequeño de la pista */}
                          {cellInfo.startNumber && (
                            <span className="absolute top-0.5 left-1 text-[9px] font-cyber font-bold text-[#f4b6ff]/90 leading-none">
                              {cellInfo.startNumber}
                            </span>
                          )}
                          <span>{userVal}</span>
                        </button>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>

              {/* Input Virtual para Móvil & Escritorio */}
              <div className="mt-4 w-full max-w-sm flex items-center gap-2">
                <input
                  type="text"
                  maxLength={1}
                  placeholder="Letra..."
                  value={userLetters[selectedCellKey] || ''}
                  onChange={(e) => handleLetterInput(e.target.value)}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#230a42]/80 border border-[#c3a7ff]/40 text-center font-cyber text-lg uppercase text-white focus:outline-none focus:border-[#f4b6ff]"
                />
                
                <button
                  onClick={handleRevealHint}
                  className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-[#f4b6ff] border border-[#c3a7ff]/30 font-cyber text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Revelar letra"
                >
                  <Lightbulb className="w-4 h-4 text-[#f4b6ff]" />
                  <span>Pista</span>
                </button>

                <button
                  onClick={handleVerifyCurrentClue}
                  className="py-2 px-3 rounded-xl bg-gradient-to-r from-[#b01cc6] to-[#730bb3] text-white font-cyber text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(176,28,198,0.5)] transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4 text-white" />
                  <span>Comprobar</span>
                </button>
              </div>

            </div>

            {/* Pistas Horizontales & Verticales */}
            <div className="w-full md:flex-1 space-y-4">
              
              <div className="p-4 rounded-2xl glass-card-amethyst border border-[#c3a7ff]/30">
                <div className="text-xs font-cyber font-bold text-[#f4b6ff] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#f4b6ff]" />
                  <span>PISTA ACTIVA #{activeClue.number} ({activeClue.direction === 'across' ? 'HORIZONTAL' : 'VERTICAL'} • {activeClue.length} LETRAS)</span>
                </div>
                <p className="font-body text-sm sm:text-base text-white leading-relaxed font-semibold">
                  {activeClue.hint}
                </p>
                <span className="text-[11px] font-cyber text-[#c3a7ff] block mt-1">
                  Referencia: {activeClue.reference}
                </span>
              </div>

              {/* Lista de Pistas */}
              <div className="space-y-2">
                <span className="text-xs font-cyber text-purple-300 font-bold uppercase tracking-wider block">
                  TODAS LAS PISTAS BÍBLICAS:
                </span>

                {CROSSWORD_CLUES.map((clue) => {
                  const isSelected = selectedClueNumber === clue.number;
                  return (
                    <button
                      key={clue.number}
                      type="button"
                      onClick={() => handleClueSelect(clue.number)}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 min-h-[44px] ${
                        isSelected
                          ? 'bg-[#730bb3]/40 border-[#f4b6ff] text-white shadow-[0_0_14px_rgba(176,28,198,0.4)]'
                          : 'bg-[#230a42]/50 border-[#c3a7ff]/20 text-purple-200 hover:text-white hover:border-[#c3a7ff]/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-lg bg-[#b01cc6]/30 border border-[#c3a7ff]/30 text-center font-cyber text-xs font-bold text-[#f4b6ff] flex items-center justify-center">
                          {clue.number}
                        </span>
                        <span className="font-cyber text-xs font-bold uppercase">
                          {clue.direction === 'across' ? 'Horiz.' : 'Vert.'} ({clue.length} l.)
                        </span>
                        <span className="font-body text-xs text-purple-200/90 truncate max-w-[180px] sm:max-w-xs">
                          {clue.hint}
                        </span>
                      </div>
                      <span className="text-[10px] font-cyber text-[#c3a7ff] shrink-0 font-bold">
                        {clue.reference}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-cyber text-purple-300">
                  Pistas usadas: <strong className="text-white">{hintsUsed}</strong>
                </span>

                <button
                  onClick={handleResetCrossword}
                  className="inline-flex items-center gap-1.5 text-xs font-cyber text-[#c3a7ff] hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reiniciar Crucigrama</span>
                </button>
              </div>

            </div>

          </div>

          {/* Modal de Victoria del Crucigrama */}
          {crosswordWon && (
            <div className="absolute inset-0 bg-[#170526]/95 backdrop-blur-2xl z-30 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
              <div className="w-20 h-20 rounded-3xl bg-[#730bb3]/30 border border-[#f4b6ff] flex items-center justify-center mx-auto mb-4 text-[#f4b6ff] shadow-[0_0_35px_rgba(176,28,198,0.6)] animate-bounce">
                <Trophy className="w-10 h-10" />
              </div>

              <span className="text-xs font-cyber text-[#f4b6ff] uppercase tracking-wider font-bold mb-1">
                ¡CRUCIGRAMA BÍBLICO COMPLETADO!
              </span>

              <h3 className="font-cyber-heavy text-3xl sm:text-4xl text-white mb-2">
                RELOAD EN TU MENTE
              </h3>

              <p className="font-body text-xs sm:text-sm text-purple-200/90 max-w-md mx-auto mb-6">
                Has resuelto todos los conceptos clave de Metanoia 2026: RELOAD, MENTE, PABLO, FE y PAZ. ¡Tu entendimiento está alineado a la verdad!
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => handleShareScore('Crucigrama Bíblico RELOAD', '100%')}
                  className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-cyber text-xs font-bold uppercase tracking-wider border border-white/20 transition-all cursor-pointer flex items-center gap-2 min-h-[46px]"
                >
                  {isCopied ? <Check className="w-4 h-4 text-[#86efac]" /> : <Share2 className="w-4 h-4 text-[#f4b6ff]" />}
                  <span>{isCopied ? '¡Copiado!' : 'Compartir Victoria'}</span>
                </button>

                <button
                  onClick={handleResetCrossword}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#b01cc6] to-[#730bb3] text-white font-cyber text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(176,28,198,0.5)] hover:scale-105 transition-all cursor-pointer flex items-center gap-2 min-h-[46px]"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>JUGAR DE NUEVO</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. TRIVIA DE LA FE (PREGUNTAS BÍBLICAS)                              */}
      {/* ==================================================================== */}
      {activeGame === 'trivia' && (
        <div className="max-w-3xl mx-auto rounded-3xl glass-panel-luminous border border-[#c3a7ff]/35 p-5 sm:p-8 shadow-[0_20px_50px_rgba(18,3,30,0.5)] relative overflow-hidden">
          
          {triviaStep === 'idle' && (
            <div className="text-center py-6 sm:py-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#730bb3]/30 border border-[#c3a7ff]/40 flex items-center justify-center mx-auto mb-5 text-[#f4b6ff] shadow-[0_0_25px_rgba(176,28,198,0.35)]">
                <HelpCircle className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>

              <h3 className="font-cyber-heavy text-2xl sm:text-3xl text-white tracking-tight mb-2">
                TRIVIA BÍBLICA: LA MENTE RENOVADA
              </h3>
              <p className="font-body text-xs sm:text-sm text-purple-200/80 max-w-md mx-auto mb-6">
                10 preguntas sobre la renovación de la mente, el lema RELOAD, Pablo Rosales y la verdad de la Palabra. ¡15 segundos por pregunta!
              </p>

              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[#230a42]/70 border border-[#c3a7ff]/30 text-xs font-cyber text-[#e4c5ff] mb-6">
                <Trophy className="w-4 h-4 text-[#f4b6ff]" />
                <span>RÉCORD PERSONAL: {triviaHighScore} PTS</span>
              </div>

              <div>
                <button
                  onClick={startTrivia}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#b01cc6] via-[#730bb3] to-[#4331ec] text-white font-cyber text-xs sm:text-sm font-extrabold tracking-wider uppercase shadow-[0_0_25px_rgba(176,28,198,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2.5 mx-auto min-h-[48px]"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>INICIAR PREGUNTAS</span>
                </button>
              </div>
            </div>
          )}

          {triviaStep === 'playing' && (
            <div>
              <div className="flex items-center justify-between gap-2 pb-4 mb-5 border-b border-[#c3a7ff]/20 text-xs font-cyber">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-[#230a42]/70 border border-[#c3a7ff]/30 text-[#e4c5ff] font-bold">
                    PREGUNTA {currentQuestionIndex + 1}/{TRIVIA_QUESTIONS.length}
                  </span>
                  {streak > 1 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#b01cc6]/30 border border-[#f4b6ff]/40 text-[#f4b6ff] font-bold">
                      <Flame className="w-3.5 h-3.5 text-[#f4b6ff]" />
                      <span>{streak}X RACHA</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border font-bold ${
                      triviaTimeLeft <= 4
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                        : 'bg-[#230a42]/70 border-[#c3a7ff]/30 text-[#f4b6ff]'
                    }`}
                  >
                    <Timer className="w-3.5 h-3.5" />
                    <span>{triviaTimeLeft}s</span>
                  </div>

                  <div className="text-purple-200">
                    PUNTOS: <span className="font-bold text-white font-cyber">{score}</span>
                  </div>
                </div>
              </div>

              {/* Pregunta */}
              <div className="mb-5">
                <span className="text-[10px] font-cyber text-[#c3a7ff] uppercase tracking-wider block mb-1 font-bold">
                  REFERENCIA: {question.scripture}
                </span>
                <h4 className="font-body text-base sm:text-xl font-bold text-white leading-snug">
                  {question.question}
                </h4>
              </div>

              {/* Opciones */}
              <div className="space-y-2.5 mb-5">
                {question.options.map((option, idx) => {
                  let btnStyle = 'bg-[#230a42]/60 border-[#c3a7ff]/30 text-purple-100 hover:bg-[#2e0e56] hover:border-[#c3a7ff]';

                  if (isAnswerRevealed) {
                    if (idx === question.correctIndex) {
                      btnStyle = 'bg-[#86efac]/20 border-[#86efac] text-[#86efac] font-bold shadow-[0_0_15px_rgba(134,239,172,0.3)]';
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
                      className={`w-full p-3.5 sm:p-4 rounded-2xl border text-left font-body text-xs sm:text-sm transition-all flex items-center justify-between gap-3 cursor-pointer touch-manipulation min-h-[48px] ${btnStyle}`}
                    >
                      <span className="font-medium">{option}</span>
                      {isAnswerRevealed && idx === question.correctIndex && (
                        <CheckCircle2 className="w-5 h-5 text-[#86efac] flex-shrink-0" />
                      )}
                      {isAnswerRevealed && idx === selectedOption && idx !== question.correctIndex && (
                        <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {isAnswerRevealed && (
                <div className="p-4 rounded-2xl bg-[#170526]/80 border border-[#c3a7ff]/30 mb-5 text-xs sm:text-sm text-purple-200 font-body">
                  <strong className="text-[#f4b6ff] font-semibold">Explicación Bíblica:</strong> {question.explanation}
                </div>
              )}

              {isAnswerRevealed && (
                <div className="flex justify-end">
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#b01cc6] to-[#730bb3] text-white font-cyber text-xs font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(176,28,198,0.5)] hover:scale-105 transition-all cursor-pointer min-h-[44px]"
                  >
                    {currentQuestionIndex + 1 < TRIVIA_QUESTIONS.length ? 'SIGUIENTE PREGUNTA →' : 'VER RESULTADOS'}
                  </button>
                </div>
              )}
            </div>
          )}

          {triviaStep === 'results' && (
            <div className="text-center py-6 sm:py-8">
              <div className="w-20 h-20 rounded-3xl bg-[#730bb3]/30 border border-[#f4b6ff] flex items-center justify-center mx-auto mb-4 text-[#f4b6ff] shadow-[0_0_30px_rgba(176,28,198,0.5)]">
                <Trophy className="w-10 h-10" />
              </div>

              <div className="text-xs font-cyber text-[#e4c5ff] uppercase tracking-wider mb-1.5 font-bold">
                DESAFÍO COMPLETADO
              </div>

              <h3 className="font-cyber-heavy text-3xl sm:text-5xl text-white mb-2">
                {score} <span className="text-base text-[#f4b6ff]">PUNTOS</span>
              </h3>

              <div className="my-5 p-4 rounded-2xl glass-card-amethyst border border-[#c3a7ff]/30 max-w-md mx-auto">
                <span className="text-[10px] font-cyber text-[#c3a7ff] uppercase tracking-wider block mb-1">
                  DISCERNIMIENTO BÍBLICO
                </span>
                <h4 className="font-cyber text-lg sm:text-xl font-bold mb-1 text-[#f4b6ff]">
                  {score >= 800 ? 'Mente Renovada Master' : 'Caminante de Fe'}
                </h4>
                <p className="text-xs font-body text-purple-200/80">
                  {score >= 800
                    ? '¡Gran entendimiento de la Palabra y la visión de Dios para esta generación!'
                    : '¡Sigue meditando en las promesas del Señor y renueva tu mente cada día!'}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => handleShareScore('Trivia Bíblica Metanoia', score)}
                  className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-cyber text-xs font-bold uppercase tracking-wider border border-white/20 transition-all cursor-pointer flex items-center gap-2 min-h-[44px]"
                >
                  {isCopied ? <Check className="w-4 h-4 text-[#86efac]" /> : <Share2 className="w-4 h-4 text-[#f4b6ff]" />}
                  <span>{isCopied ? '¡Copiado!' : 'Compartir Récord'}</span>
                </button>

                <button
                  onClick={startTrivia}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#b01cc6] to-[#730bb3] text-white font-cyber text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(176,28,198,0.5)] hover:scale-105 transition-all cursor-pointer flex items-center gap-2 min-h-[44px]"
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
      {/* 3. MATRIZ DE MEMORIA BÍBLICA (JUEGO DE PAREJAS)                      */}
      {/* ==================================================================== */}
      {activeGame === 'memory' && (
        <div className="max-w-3xl mx-auto rounded-3xl glass-panel-luminous border border-[#c3a7ff]/35 p-5 sm:p-8 shadow-[0_20px_50px_rgba(18,3,30,0.5)] relative overflow-hidden">
          
          {memoryStep === 'idle' && (
            <div className="text-center py-6 sm:py-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#730bb3]/30 border border-[#86efac]/40 flex items-center justify-center mx-auto mb-5 text-[#86efac] shadow-[0_0_25px_rgba(134,239,172,0.35)]">
                <Brain className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>

              <h3 className="font-cyber-heavy text-2xl sm:text-3xl text-white tracking-tight mb-2">
                PAREJAS DE LA PALABRA
              </h3>
              <p className="font-body text-xs sm:text-sm text-purple-200/80 max-w-md mx-auto mb-6">
                Encuentra las 6 parejas de conceptos bíblicos, Pablo Rosales y promesas de Dios en el menor tiempo y movimientos posibles.
              </p>

              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[#230a42]/70 border border-[#c3a7ff]/30 text-xs font-cyber text-[#86efac] mb-6">
                <Trophy className="w-4 h-4 text-[#86efac]" />
                <span>RÉCORD PERSONAL: {memoryHighScore} PTS</span>
              </div>

              <div>
                <button
                  onClick={startMemoryGame}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#b01cc6] via-[#730bb3] to-[#4331ec] text-white font-cyber text-xs sm:text-sm font-extrabold tracking-wider uppercase shadow-[0_0_25px_rgba(176,28,198,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2.5 mx-auto min-h-[48px]"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>INICIAR PAREJAS</span>
                </button>
              </div>
            </div>
          )}

          {memoryStep === 'playing' && (
            <div>
              <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-[#c3a7ff]/20 text-xs font-cyber">
                <div className="text-[#86efac] font-bold flex items-center gap-1.5">
                  <Timer className="w-3.5 h-3.5" /> {memoryTime}s
                </div>
                <div className="text-[#f4b6ff] font-bold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" /> MOV: {memoryMoves}
                </div>
                <div className="text-[#e4c5ff] font-bold">
                  PAREJAS: {memoryCards.filter((c) => c.isMatched).length / 2}/6
                </div>
              </div>

              {/* 12 Cards Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
                {memoryCards.map((card, index) => {
                  const isVisible = card.isFlipped || card.isMatched;

                  return (
                    <button
                      key={card.id}
                      onClick={() => handleCardClick(index)}
                      className={`h-24 sm:h-28 rounded-2xl border p-2 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer touch-manipulation select-none relative overflow-hidden min-h-[44px] ${
                        card.isMatched
                          ? 'bg-[#86efac]/20 border-[#86efac] text-white shadow-[0_0_15px_rgba(134,239,172,0.35)] scale-[0.98]'
                          : isVisible
                          ? 'bg-[#730bb3]/50 border-[#f4b6ff] text-white shadow-[0_0_16px_rgba(176,28,198,0.5)] scale-105'
                          : 'bg-[#230a42]/70 border-[#c3a7ff]/30 hover:border-[#f4b6ff] text-white/40'
                      }`}
                    >
                      {isVisible ? (
                        <>
                          <span className="text-2xl sm:text-3xl mb-1">{card.icon}</span>
                          <span className="font-cyber text-[11px] sm:text-xs text-white font-bold leading-tight">
                            {card.label}
                          </span>
                          <span className="text-[9px] font-body text-purple-200/80 mt-0.5">
                            {card.sub}
                          </span>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <Sparkles className="w-5 h-5 text-[#f4b6ff] opacity-60" />
                          <span className="text-[9px] font-cyber tracking-widest text-[#c3a7ff] mt-1 font-bold">
                            RELOAD
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
              <div className="w-20 h-20 rounded-3xl bg-[#730bb3]/30 border border-[#86efac] flex items-center justify-center mx-auto mb-4 text-[#86efac] shadow-[0_0_30px_rgba(134,239,172,0.5)] animate-bounce">
                <Trophy className="w-10 h-10" />
              </div>

              <div className="text-xs font-cyber text-[#86efac] uppercase tracking-wider mb-1.5 font-bold">
                ¡EXCELENTE MEMORIA!
              </div>

              <h3 className="font-cyber-heavy text-3xl sm:text-4xl text-white mb-2">
                PAREJAS COMPLETADAS
              </h3>

              <p className="font-body text-xs sm:text-sm text-purple-200/90 max-w-md mx-auto mb-6">
                Lo lograste en <strong className="text-white">{memoryMoves} movimientos</strong> y <strong className="text-white">{memoryTime} segundos</strong>.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => handleShareScore('Parejas Bíblicas', `${memoryMoves} mov.`)}
                  className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-cyber text-xs font-bold uppercase tracking-wider border border-white/20 transition-all cursor-pointer flex items-center gap-2 min-h-[44px]"
                >
                  {isCopied ? <Check className="w-4 h-4 text-[#86efac]" /> : <Share2 className="w-4 h-4 text-[#f4b6ff]" />}
                  <span>{isCopied ? '¡Copiado!' : 'Compartir Récord'}</span>
                </button>

                <button
                  onClick={startMemoryGame}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#b01cc6] to-[#730bb3] text-white font-cyber text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(176,28,198,0.5)] hover:scale-105 transition-all cursor-pointer flex items-center gap-2 min-h-[44px]"
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
