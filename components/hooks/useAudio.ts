
import { useState, useCallback, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { SHOP_ACCESSORIES } from '../../constants';
import { AccessoryType, SoundPackVariationConfig } from '../../types';

export const useAudio = () => {
  const { theme, playerActiveAccessories } = useTheme();
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const audioCache = useRef<Record<string, HTMLAudioElement>>({});

  const unlockAudioContext = useCallback(() => {
    if (!audioUnlocked) {
      setAudioUnlocked(true);
      // Play a tiny silent sound to unlock the AudioContext on user interaction
      const silentAudio = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA");
      silentAudio.volume = 0;
      silentAudio.play().catch(() => {});
    }
  }, [audioUnlocked]);

  const playSound = useCallback((soundUrl: string, volume: number = 0.5) => {
    if (!audioUnlocked || !soundUrl) return;

    let finalSoundUrl = soundUrl;
    const currentThemeKey = theme;
    const accessoriesForThisTheme = playerActiveAccessories[currentThemeKey];
    const soundPackAccessoryId = accessoriesForThisTheme?.[AccessoryType.SOUND_PACK_VARIATION];

    if (soundPackAccessoryId) {
      const soundPackAccessoryDetails = SHOP_ACCESSORIES.find(
        acc => acc.id === soundPackAccessoryId && acc.type === AccessoryType.SOUND_PACK_VARIATION
      );
      if (soundPackAccessoryDetails) {
        const soundConfig = soundPackAccessoryDetails.config as SoundPackVariationConfig;
        if (soundConfig.sounds && soundConfig.sounds[soundUrl]) {
          finalSoundUrl = soundConfig.sounds[soundUrl];
        }
      }
    }

    try {
      let audio = audioCache.current[finalSoundUrl];
      if (!audio) {
        audio = new Audio(finalSoundUrl);
        audio.volume = volume;
        audio.onerror = () => { delete audioCache.current[finalSoundUrl]; };
        audioCache.current[finalSoundUrl] = audio;
      }
      
      // Ensure audio is ready to play
      if (audio.readyState >= 2) { // HAVE_CURRENT_DATA
        audio.currentTime = 0;
        audio.play().catch(_e => {});
      } else {
        const playWhenReady = () => {
            audio.currentTime = 0;
            audio.play().catch(_e => {});
            audio.removeEventListener('canplaythrough', playWhenReady);
        };
        audio.addEventListener('canplaythrough', playWhenReady);
        audio.load(); // Start loading if not already
      }
    } catch (error) {
      // Silently fail
    }
  }, [audioUnlocked, audioCache, theme, playerActiveAccessories]);

  return { audioUnlocked, unlockAudioContext, playSound };
};
