/**
 * ═══════════════════════════════════════════════════════════════════════════
 * METANOIA 2026 // SERVICIO DE CONEXIÓN CON GOOGLE SHEETS
 * Guarda exclusivamente:
 * 1. Nombre
 * 2. Oración Incógnita
 * 3. Puntaje Total
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface MetanoiaRecord {
  nombre: string;
  oracionIncognita: string;
  puntajeTotal: number;
  isScoreUpdate?: boolean;
}

const STORAGE_KEY_URL = 'metanoia_google_sheets_url';
const STORAGE_KEY_CACHE = 'metanoia_offline_submissions';
const DEFAULT_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbyPDKwGbXJwlauDwVWqlbl_1aL0AZU4sM8tGPsbZb3b7Ng4xYp4ZvUmRXHinuX4a9m7Qg/exec';

/**
 * Obtiene los puntajes máximos de los 4 juegos.
 * Se acumulan según los juegos que haya completado (1, 2, 3 o los 4).
 */
export function getGameHighScores() {
  if (typeof window === 'undefined') {
    return { crossword: 0, trivia: 0, memory: 0, wordsearch: 0, total: 0 };
  }
  const crossword = Number(localStorage.getItem('metanoia_crossword_high') || 0);
  const trivia = Number(localStorage.getItem('metanoia_trivia_high') || 0);
  const memory = Number(localStorage.getItem('metanoia_memory_high') || 0);
  const wordsearch = Number(localStorage.getItem('metanoia_wordsearch_high') || 0);
  const total = crossword + trivia + memory + wordsearch;

  return { crossword, trivia, memory, wordsearch, total };
}

/**
 * Obtiene la URL de Google Sheets Web App.
 */
export function getGoogleSheetsUrl(): string {
  const envUrl = (((import.meta as any).env?.VITE_GOOGLE_SHEETS_URL as string) || '').trim();
  if (envUrl) return envUrl;

  if (typeof window !== 'undefined') {
    const local = (localStorage.getItem(STORAGE_KEY_URL) || '').trim();
    if (local) return local;
  }
  return DEFAULT_SHEETS_URL;
}

/**
 * Guarda la URL de Google Sheets en localStorage.
 */
export function setGoogleSheetsUrl(url: string): void {
  if (typeof window !== 'undefined') {
    if (url.trim()) {
      localStorage.setItem(STORAGE_KEY_URL, url.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY_URL);
    }
  }
}

/**
 * Guarda copia de respaldo en el navegador.
 */
function cacheSubmissionLocally(record: MetanoiaRecord): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CACHE);
    const list: MetanoiaRecord[] = raw ? JSON.parse(raw) : [];
    const existingIndex = list.findIndex(
      (item) => item.nombre.toLowerCase() === record.nombre.toLowerCase()
    );
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...record };
    } else {
      list.unshift(record);
    }
    localStorage.setItem(STORAGE_KEY_CACHE, JSON.stringify(list.slice(0, 50)));
  } catch (err) {
    console.warn('No se pudo guardar la copia local de respaldo:', err);
  }
}

/**
 * Envía a Google Sheets únicamente: Nombre, Oración Incógnita y Puntaje Total.
 */
export async function submitToGoogleSheets(data: MetanoiaRecord): Promise<{
  success: boolean;
  isDemo?: boolean;
  message: string;
}> {
  const url = getGoogleSheetsUrl();

  const payload: MetanoiaRecord = {
    nombre: data.nombre.trim() || 'Participante',
    oracionIncognita: data.oracionIncognita.trim(),
    puntajeTotal: data.puntajeTotal || 0,
  };

  cacheSubmissionLocally(payload);

  if (!url) {
    return {
      success: true,
      isDemo: true,
      message: 'Guardado localmente. Pega la URL de tu hoja para sincronizar en vivo.',
    };
  }

  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    return {
      success: true,
      isDemo: false,
      message: '¡Guardado en Google Sheets con éxito!',
    };
  } catch (error) {
    console.error('Error enviando a Google Sheets:', error);
    return {
      success: true,
      isDemo: true,
      message: 'Guardado en tu dispositivo.',
    };
  }
}

/**
 * Sincroniza automáticamente los puntajes si la persona ya está registrada.
 */
export async function syncHighScoresToSheets(nombre: string): Promise<void> {
  const url = getGoogleSheetsUrl();
  if (!url || !nombre.trim()) return;

  const scores = getGameHighScores();
  if (scores.total === 0) return;

  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        isScoreUpdate: true,
        nombre: nombre.trim(),
        oracionIncognita: '',
        puntajeTotal: scores.total,
      }),
    });
  } catch (err) {
    console.warn('Auto-sync de puntajes falló temporalmente:', err);
  }
}

/**
 * Dispara la sincronización automática si el usuario ya tiene perfil guardado.
 */
export function autoSyncUserScores(): void {
  if (typeof window === 'undefined') return;
  try {
    const saved = localStorage.getItem('metanoia_user_profile');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.name) {
        syncHighScoresToSheets(parsed.name);
      }
    }
  } catch {
    // Silencioso
  }
}
