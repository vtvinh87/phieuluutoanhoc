
import React, { useEffect, useState, useRef } from 'react';
import { ShootingStarData } from '../types';
import { SHOOTING_STAR_EMOJI } from '../constants'; // Ensure SHOOTING_STAR_EMOJI is defined

interface ShootingStarProps {
  starData: ShootingStarData;
  onClick: () => void;
  onDisappear: () => void;
  emoji?: string;
}

const ShootingStar: React.FC<ShootingStarProps> = ({ 
  starData, 
  onClick, 
  onDisappear, 
  emoji = SHOOTING_STAR_EMOJI 
}) => {
  const { startX, startY, endX, endY, duration, size, delay, visible } = starData;
  const [currentX, setCurrentX] = useState(startX);
  const [currentY, setCurrentY] = useState(startY);
  const [opacity, setOpacity] = useState(0);
  const hasClickedRef = useRef(false);

  useEffect(() => {
    if (visible) {
      // Short delay before starting animation to ensure initial position is set
      const startAnimationTimer = setTimeout(() => {
        setOpacity(1);
        setCurrentX(endX);
        setCurrentY(endY);
      }, 50 + delay); // Small delay + randomized delay for staggered appearance

      // Timer to automatically call onDisappear if star is not clicked
      const disappearTimer = setTimeout(() => {
        if (!hasClickedRef.current) {
          onDisappear();
        }
      }, duration + delay + 500); // Duration of animation + delay + buffer

      return () => {
        clearTimeout(startAnimationTimer);
        clearTimeout(disappearTimer);
      };
    } else {
      // If visibility is turned off (e.g., by parent), ensure it fades out
      setOpacity(0);
      const fadeOutTimer = setTimeout(onDisappear, 500); // Match opacity transition
      return () => clearTimeout(fadeOutTimer);
    }
  }, [visible, endX, endY, duration, delay, onDisappear]);

  const handleClick = () => {
    if (hasClickedRef.current) return;
    hasClickedRef.current = true;
    onClick();
    // Visual feedback for click can be added here if needed, e.g., quick shrink/fade
    // The parent (GameScreen) will set visible to false upon click handling
  };

  if (!visible && opacity === 0) {
    return null; // Don't render if fully invisible and meant to be gone
  }

  return (
    <div
      onClick={handleClick}
      className="absolute z-[100] cursor-pointer"
      style={{
        left: currentX,
        top: currentY,
        opacity: opacity,
        fontSize: `${size}px`,
        transform: 'rotate(-45deg)', // Typical shooting star angle
        transition: `left ${duration}ms linear, top ${duration}ms linear, opacity 0.4s ease-in-out`,
        textShadow: `0 0 5px var(--accent-color), 0 0 10px var(--accent-color), 0 0 15px #fff`, // Glow effect
        willChange: 'left, top, opacity', // Performance hint
      }}
      role="button"
      tabIndex={-1} // Not typically focusable by keyboard, as it's a quick reaction event
      aria-label="Ngôi sao may mắn"
    >
      {emoji}
    </div>
  );
};

export default ShootingStar;
