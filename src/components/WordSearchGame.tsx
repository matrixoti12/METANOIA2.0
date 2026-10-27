import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Lightbulb, Play, RotateCcw, Search, Sparkles, Timer, Trophy } from 'lucide-react';
import { playCyberClick, playGameCorrect, playGameWrong, playNeonChime } from '../utils/audio';

type GameStep = 'idle' | 'playing' | 'won';

interface Coordinate {
  row: number;
  col: number;
}

interface HiddenWord {
  word: string;
  clue: string;
  reference: string;
  start: Coordinate;
  end: Coordinate;
}

const BOARD_SIZE = 12;
const FILLER_LETTERS = 'RENUEVACIONGRACIAYFE';

const HIDDEN_WORDS: HiddenWord[] = [
  { word: 'METANOIA', clue: 'Cambio profundo de mente y dirección.', reference: 'Romanos 12:2', start: { row: 0, col: 0 }, end: { row: 0, col: 7 } },
  { word: 'RELOAD', clue: 'El lema oficial del evento 2026.', reference: 'Lema Metanoia', start: { row: 1, col: 10 }, end: { row: 6, col: 5 } },
  { word: 'GRACIA', clue: 'El regalo inmerecido de Dios.', reference: 'Efesios 2:8', start: { row: 10, col: 0 }, end: { row: 10, col: 5 } },
  { word: 'MENTE', clue: 'Lo que Dios quiere renovar.', reference: 'Romanos 12:2', start: { row: 2, col: 1 }, end: { row: 6, col: 1 } },
  { word: 'CRISTO', clue: 'En Él somos una nueva creación.', reference: '2 Corintios 5:17', start: { row: 11, col: 11 }, end: { row: 6, col: 6 } },
  { word: 'PABLO', clue: 'Invitado especial de Metanoia 2026.', reference: '28 de noviembre', start: { row: 8, col: 1 }, end: { row: 8, col: 5 } },
  { word: 'FE', clue: 'Certeza de lo que se espera.', reference: 'Hebreos 11:1', start: { row: 4, col: 11 }, end: { row: 5, col: 11 } },
  { word: 'PAZ', clue: 'Guarda el corazón y los pensamientos.', reference: 'Filipenses 4:7', start: { row: 9, col: 6 }, end: { row: 7, col: 8 } },
];

const coordinateKey = ({ row, col }: Coordinate) => `${row}-${col}`;

const getLineCoordinates = (start: Coordinate, end: Coordinate): Coordinate[] | null => {
  const rowDistance = end.row - start.row;
  const colDistance = end.col - start.col;
  if (rowDistance !== 0 && colDistance !== 0 && Math.abs(rowDistance) !== Math.abs(colDistance)) return null;

  const rowStep = Math.sign(rowDistance);
  const colStep = Math.sign(colDistance);
  const length = Math.max(Math.abs(rowDistance), Math.abs(colDistance)) + 1;
  return Array.from({ length }, (_, index) => ({
    row: start.row + rowStep * index,
    col: start.col + colStep * index,
  }));
};

const buildBoard = () => {
  const board = Array.from({ length: BOARD_SIZE }, (_, row) =>
    Array.from({ length: BOARD_SIZE }, (_, col) => FILLER_LETTERS[(row * 7 + col * 11 + row * col) % FILLER_LETTERS.length])
  );

  HIDDEN_WORDS.forEach(({ word, start, end }) => {
    const coordinates = getLineCoordinates(start, end) || [];
    coordinates.forEach(({ row, col }, index) => {
      board[row][col] = word[index];
    });
  });

  return board;
};

const BOARD = buildBoard();

export const WordSearchGame: React.FC = () => {
  const [step, setStep] = useState<GameStep>('idle');
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selection, setSelection] = useState<Coordinate[]>([]);
  const [pendingStart, setPendingStart] = useState<Coordinate | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [misses, setMisses] = useState(0);
  const [score, setScore] = useState(0);
  const [invalidSelection, setInvalidSelection] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    try {
      return Number(localStorage.getItem('metanoia_wordsearch_high') || 0);
    } catch {
      return 0;
    }
  });

  const dragStartRef = useRef<Coordinate | null>(null);
  const dragEndRef = useRef<Coordinate | null>(null);

  useEffect(() => {
    if (step !== 'playing') return;
    const timer = window.setInterval(() => setElapsedSeconds((seconds) => seconds + 1), 1000);
    return () => window.clearInterval(timer);
  }, [step]);

  const foundCellKeys = useMemo(() => {
    const keys = new Set<string>();
    HIDDEN_WORDS.filter(({ word }) => foundWords.includes(word)).forEach(({ start, end }) => {
      getLineCoordinates(start, end)?.forEach((coordinate) => keys.add(coordinateKey(coordinate)));
    });
    return keys;
  }, [foundWords]);

  const selectedCellKeys = useMemo(
    () => new Set(selection.map(coordinateKey)),
    [selection]
  );

  const startGame = () => {
    playCyberClick();
    setStep('playing');
    setFoundWords([]);
    setSelection([]);
    setPendingStart(null);
    setElapsedSeconds(0);
    setMisses(0);
    setScore(0);
    setInvalidSelection(false);
  };

  const finishSelection = (coordinates: Coordinate[]) => {
    if (coordinates.length < 2) return;
    const letters = coordinates.map(({ row, col }) => BOARD[row][col]).join('');
    const reversedLetters = [...letters].reverse().join('');
    const match = HIDDEN_WORDS.find(
      ({ word }) => !foundWords.includes(word) && (word === letters || word === reversedLetters)
    );

    if (!match) {
      setMisses((value) => value + 1);
      setInvalidSelection(true);
      playGameWrong();
      window.setTimeout(() => {
        setInvalidSelection(false);
        setSelection([]);
      }, 380);
      return;
    }

    const nextFoundWords = [...foundWords, match.word];
    setFoundWords(nextFoundWords);
    setSelection([]);
    playGameCorrect();
    if (navigator.vibrate) navigator.vibrate([18, 30, 18]);

    if (nextFoundWords.length === HIDDEN_WORDS.length) {
      const finalScore = Math.max(250, 1800 - elapsedSeconds * 6 - misses * 35);
      setScore(finalScore);
      setStep('won');
      playNeonChime();
      if (finalScore > highScore) {
        setHighScore(finalScore);
        try {
          localStorage.setItem('metanoia_wordsearch_high', String(finalScore));
        } catch {
          // The game still works when private browsing blocks storage.
        }
      }
    }
  };

  const handleTapSelection = (coordinate: Coordinate) => {
    if (!pendingStart) {
      setPendingStart(coordinate);
      setSelection([coordinate]);
      return;
    }

    const line = getLineCoordinates(pendingStart, coordinate);
    if (!line) {
      setPendingStart(coordinate);
      setSelection([coordinate]);
      playGameWrong();
      return;
    }

    setPendingStart(null);
    setSelection(line);
    finishSelection(line);
  };

  const coordinateFromTarget = (target: EventTarget | null): Coordinate | null => {
    const cell = (target as HTMLElement | null)?.closest<HTMLElement>('[data-word-cell]');
    if (!cell) return null;
    return { row: Number(cell.dataset.row), col: Number(cell.dataset.col) };
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (step !== 'playing') return;
    const coordinate = coordinateFromTarget(event.target);
    if (!coordinate) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStartRef.current = coordinate;
    dragEndRef.current = coordinate;
    setSelection([coordinate]);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current) return;
    const element = document.elementFromPoint(event.clientX, event.clientY);
    const coordinate = coordinateFromTarget(element);
    if (!coordinate || coordinateKey(coordinate) === coordinateKey(dragEndRef.current || coordinate)) return;
    const line = getLineCoordinates(dragStartRef.current, coordinate);
    if (!line) return;
    dragEndRef.current = coordinate;
    setSelection(line);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = dragStartRef.current;
    const end = dragEndRef.current;
    dragStartRef.current = null;
    dragEndRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (!start || !end) return;

    const line = getLineCoordinates(start, end) || [start];
    if (line.length > 1) {
      setPendingStart(null);
      finishSelection(line);
    } else {
      handleTapSelection(start);
    }
  };

  const handlePointerCancel = () => {
    dragStartRef.current = null;
    dragEndRef.current = null;
    setSelection([]);
  };

  return (
    <div className="max-w-5xl mx-auto content-surface p-4 sm:p-8 relative overflow-hidden">
      {step === 'idle' && (
        <div className="text-center py-7 sm:py-10">
          <div className="w-20 h-20 rounded-[1.75rem] bg-[#230a42] border border-[#f4b6ff]/60 flex items-center justify-center mx-auto mb-5 text-[#f4b6ff] shadow-[0_0_32px_rgba(176,28,198,0.45)]">
            <Search className="w-10 h-10" />
          </div>
          <h3 className="font-cyber-heavy text-2xl sm:text-3xl text-white tracking-tight mb-2">SOPA DE LETRAS: CÓDIGO RELOAD</h3>
          <p className="font-body text-sm text-purple-200/85 max-w-lg mx-auto mb-5 leading-relaxed">
            Encuentra ocho palabras clave de Metanoia. Desliza sobre las letras o toca la primera y la última; pueden aparecer en cualquier dirección.
          </p>
          <div className="info-tag inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#230a42]/70 border border-[#c3a7ff]/30 text-xs font-cyber text-[#e4c5ff] mb-7">
            <Trophy className="w-4 h-4 text-[#f4b6ff]" />
            <span>RÉCORD PERSONAL: {highScore} PTS</span>
          </div>
          <button
            onClick={startGame}
            className="event-action px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#b01cc6] via-[#730bb3] to-[#4331ec] text-white font-cyber text-sm font-extrabold tracking-wider shadow-[0_0_25px_rgba(176,28,198,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer inline-flex items-center justify-center gap-2.5 min-h-[48px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4b6ff]"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>INICIAR BÚSQUEDA</span>
          </button>
        </div>
      )}

      {step === 'playing' && (
        <div className="grid lg:grid-cols-[minmax(0,1fr)_18rem] gap-5 sm:gap-7 items-start">
          <div>
            <div className="flex items-center justify-between gap-3 mb-3 text-xs font-cyber">
              <span className="inline-flex items-center gap-1.5 text-[#e4c5ff]"><Timer className="w-4 h-4" /> {elapsedSeconds}s</span>
              <span className="text-white font-bold">{foundWords.length}/{HIDDEN_WORDS.length} ENCONTRADAS</span>
              <button onClick={startGame} className="inline-flex items-center gap-1.5 text-purple-200 hover:text-white min-h-[44px] px-2 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f4b6ff]">
                <RotateCcw className="w-4 h-4" /> Reiniciar
              </button>
            </div>

            <div
              className={`grid grid-cols-12 gap-1 sm:gap-1.5 p-2.5 sm:p-4 rounded-2xl bg-[#140320]/95 border select-none touch-none transition-colors ${invalidSelection ? 'border-rose-400 shadow-[0_0_24px_rgba(251,113,133,0.35)]' : 'border-[#c3a7ff]/35 shadow-[inset_0_0_35px_rgba(115,11,179,0.22)]'}`}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
              aria-label="Tablero de sopa de letras"
            >
              {BOARD.flatMap((row, rowIndex) => row.map((letter, colIndex) => {
                const key = `${rowIndex}-${colIndex}`;
                const isSelected = selectedCellKeys.has(key);
                const isFound = foundCellKeys.has(key);
                return (
                  <button
                    key={key}
                    type="button"
                    data-word-cell
                    data-row={rowIndex}
                    data-col={colIndex}
                    aria-label={`Letra ${letter}, fila ${rowIndex + 1}, columna ${colIndex + 1}`}
                    aria-pressed={isSelected || isFound}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        handleTapSelection({ row: rowIndex, col: colIndex });
                      }
                    }}
                    className={`aspect-square min-w-0 rounded-md sm:rounded-lg flex items-center justify-center font-cyber font-extrabold text-[10px] min-[380px]:text-xs sm:text-base transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#f4b6ff] ${
                      isSelected
                        ? 'bg-[#f4b6ff] text-[#230a42] scale-105 shadow-[0_0_14px_rgba(244,182,255,0.75)]'
                        : isFound
                        ? 'bg-[#86efac]/25 text-[#d9ffe6] ring-1 ring-inset ring-[#86efac]/70'
                        : 'bg-[#2a0c47]/80 text-purple-100 hover:bg-[#3b1163]'
                    }`}
                  >
                    {letter}
                  </button>
                );
              }))}
            </div>

            <p className="mt-3 text-center text-xs text-purple-200/75 font-body" aria-live="polite">
              {pendingStart ? 'Ahora toca la última letra de la palabra.' : 'Desliza en línea recta o toca la primera y la última letra.'}
            </p>
          </div>

          <aside className="rounded-2xl bg-[#230a42]/55 p-4 border border-[#c3a7ff]/25" aria-label="Palabras por encontrar">
            <div className="flex items-center gap-2 mb-3 text-[#f4b6ff]">
              <Lightbulb className="w-4 h-4" />
              <h4 className="font-cyber font-bold text-sm text-white">Palabras por encontrar</h4>
            </div>
            <ul className="grid grid-cols-2 lg:grid-cols-1 gap-2">
              {HIDDEN_WORDS.map(({ word, clue, reference }) => {
                const isFound = foundWords.includes(word);
                return (
                  <li key={word} className={`rounded-xl p-3 border transition-all ${isFound ? 'bg-[#86efac]/12 border-[#86efac]/45' : 'bg-[#170526]/55 border-white/10'}`}>
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${isFound ? 'bg-[#86efac] text-[#170526]' : 'bg-[#730bb3]/40 text-[#c3a7ff]'}`}>
                        {isFound ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3 h-3" />}
                      </span>
                      <span className={`font-cyber text-xs font-bold ${isFound ? 'text-[#86efac] line-through' : 'text-white'}`}>{word}</span>
                    </div>
                    <p className="font-body text-[10px] leading-snug text-purple-200/70 mt-1.5 ml-7">{clue} <span className="text-[#c3a7ff]">{reference}</span></p>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>
      )}

      {step === 'won' && (
        <div className="text-center py-7 sm:py-10">
          <div className="w-20 h-20 rounded-[1.75rem] bg-[#86efac]/15 border border-[#86efac] flex items-center justify-center mx-auto mb-4 text-[#86efac] shadow-[0_0_32px_rgba(134,239,172,0.42)]">
            <Trophy className="w-10 h-10" />
          </div>
          <div className="text-xs font-cyber text-[#86efac] tracking-wider mb-2 font-bold">¡CÓDIGO COMPLETADO!</div>
          <h3 className="font-cyber-heavy text-3xl sm:text-4xl text-white mb-2">{score} PUNTOS</h3>
          <p className="font-body text-sm text-purple-200/90 max-w-md mx-auto mb-6">
            Encontraste las ocho palabras en <strong className="text-white">{elapsedSeconds} segundos</strong> con <strong className="text-white">{misses} intentos fallidos</strong>.
          </p>
          <button onClick={startGame} className="event-action px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#b01cc6] to-[#730bb3] text-white font-cyber text-xs font-bold tracking-wider shadow-[0_0_22px_rgba(176,28,198,0.48)] hover:scale-105 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2 min-h-[48px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4b6ff]">
            <RotateCcw className="w-4 h-4" /> JUGAR OTRA VEZ
          </button>
        </div>
      )}
    </div>
  );
};
