import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { PlayerActiveAccessoriesState, Theme, ThemeAccessory, AccessoryType, CursorTrailConfig } from '../types';

interface CursorTrailProps {
  playerActiveAccessories: PlayerActiveAccessoriesState;
  currentTheme: Theme;
  allAccessoriesDetails: ThemeAccessory[];
}

interface TrailParticle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
  shape: 'circle' | 'star';
}

const CursorTrail: React.FC<CursorTrailProps> = ({
  playerActiveAccessories,
  currentTheme,
  allAccessoriesDetails,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailParticlesRef = useRef<TrailParticle[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);
  const currentEffectConfigRef = useRef<CursorTrailConfig | null>(null);
  const mousePositionRef = useRef<{ x: number; y: number } | null>(null);

  const activeCursorTrailEffect = useMemo(() => {
    const themeAccessories = playerActiveAccessories[currentTheme];
    if (!themeAccessories) return null;
    const effectId = themeAccessories[AccessoryType.CURSOR_TRAIL];
    if (!effectId) return null;
    return allAccessoriesDetails.find(
      (acc) => acc.id === effectId && acc.type === AccessoryType.CURSOR_TRAIL
    ) as ThemeAccessory | undefined;
  }, [playerActiveAccessories, currentTheme, allAccessoriesDetails]);

  const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, opacity: number) => {
    const spikes = 5;
    const outerRadius = size;
    const innerRadius = size / 2;
    let rot = (Math.PI / 2) * 3;
    let step = Math.PI / spikes;

    ctx.save();
    ctx.beginPath();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    ctx.moveTo(x, y - outerRadius);
    for (let i = 0; i < spikes; i++) {
      let currentX = x + Math.cos(rot) * outerRadius;
      let currentY = y + Math.sin(rot) * outerRadius;
      ctx.lineTo(currentX, currentY);
      rot += step;
      currentX = x + Math.cos(rot) * innerRadius;
      currentY = y + Math.sin(rot) * innerRadius;
      ctx.lineTo(currentX, currentY);
      rot += step;
    }
    ctx.lineTo(x, y - outerRadius);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  const animateTrail = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentEffectConfigRef.current) {
      animationFrameIdRef.current = null;
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      animationFrameIdRef.current = null;
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const config = currentEffectConfigRef.current;

    if (mousePositionRef.current) {
        let color: string;
        if (Array.isArray(config.trailColor)) {
            color = config.trailColor[Math.floor(Math.random() * config.trailColor.length)];
        } else {
            color = config.trailColor;
        }

        trailParticlesRef.current.unshift({
            x: mousePositionRef.current.x,
            y: mousePositionRef.current.y,
            size: config.particleSize,
            opacity: 1,
            color: color,
            shape: config.shape || 'circle',
        });
    }
    

    while (trailParticlesRef.current.length > config.trailLength) {
      trailParticlesRef.current.pop();
    }

    for (let i = trailParticlesRef.current.length - 1; i >= 0; i--) {
      const p = trailParticlesRef.current[i];
      p.opacity -= (1 / config.trailLength) * (1 / (config.fadeSpeed * 100 + 1)); // Adjust fade speed logic
      p.size *= 0.98; // Shrink slightly

      if (p.opacity <= 0 || p.size < 0.5) {
        trailParticlesRef.current.splice(i, 1);
        continue;
      }

      if (p.shape === 'star') {
        drawStar(ctx, p.x, p.y, p.size, p.color, p.opacity);
      } else { // Default to circle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1; // Reset
      }
    }
    mousePositionRef.current = null; // Consume the mouse position after processing

    animationFrameIdRef.current = requestAnimationFrame(animateTrail);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (event: MouseEvent) => {
      mousePositionRef.current = { x: event.clientX, y: event.clientY };
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    if (activeCursorTrailEffect) {
      currentEffectConfigRef.current = activeCursorTrailEffect.config as CursorTrailConfig;
      resizeCanvas();
      window.addEventListener('mousemove', handleMouseMove);
      if (!animationFrameIdRef.current) {
        animateTrail();
      }
    } else {
      currentEffectConfigRef.current = null;
      trailParticlesRef.current = [];
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0,0,canvas.width, canvas.height);
    }
    
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
      trailParticlesRef.current = [];
    };
  }, [activeCursorTrailEffect, animateTrail]);

  if (!activeCursorTrailEffect) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999, // High zIndex to be on top, but below modals
        pointerEvents: 'none', // So it doesn't interfere with mouse events on other elements
      }}
    />
  );
};

export default CursorTrail;
