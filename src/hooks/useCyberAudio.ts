import { useCallback } from 'react';
import {
  playCyberHover,
  playCyberClick,
  playCyberTransition,
  playNeonChime,
} from '../utils/audio';

/**
 * Custom hook providing elegant, non-invasive Cyberpunk audio micro-interactions
 * for main buttons, navigation tabs, and transitions.
 */
export function useCyberAudio() {
  const handleHover = useCallback((intensity: 'subtle' | 'crisp' = 'subtle') => {
    playCyberHover(intensity);
  }, []);

  const handleClick = useCallback((flavor: 'default' | 'soft' | 'confirm' = 'default') => {
    playCyberClick(flavor);
  }, []);

  const handleTransition = useCallback(() => {
    playCyberTransition();
  }, []);

  const handleChime = useCallback(() => {
    playNeonChime();
  }, []);

  return {
    playHover: handleHover,
    playClick: handleClick,
    playTransition: handleTransition,
    playChime: handleChime,
  };
}
