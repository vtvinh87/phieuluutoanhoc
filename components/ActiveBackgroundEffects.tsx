import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { PlayerActiveAccessoriesState, Theme, ThemeAccessory, AccessoryType, BackgroundEffectConfig } from '../types';

interface ActiveBackgroundEffectsProps {
  playerActiveAccessories: PlayerActiveAccessoriesState;
  currentTheme: Theme;
  allAccessoriesDetails: ThemeAccessory[];
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
  shape: 'circle' | 'star' | 'square';
}

const ActiveBackgroundEffects: React.FC<ActiveBackgroundEffectsProps> = ({
  playerActiveAccessories,
  currentTheme,
  allAccessoriesDetails,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesArrayRef = useRef<Particle[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);
  const currentEffectConfigRef = useRef<BackgroundEffectConfig | null>(null);

  const activeBackgroundEffect = useMemo(() => {
    const themeAccessories = playerActiveAccessories[currentTheme];
    if (!themeAccessories) return null;
    const effectId = themeAccessories[AccessoryType.BACKGROUND_EFFECT];
    if (!effectId) return null;
    return allAccessoriesDetails.find(
      (acc) => acc.id === effectId && acc.type === AccessoryType.BACKGROUND_EFFECT
    ) as ThemeAccessory | undefined;
  }, [playerActiveAccessories, currentTheme, allAccessoriesDetails]);

  const initParticles = useCallback((config: BackgroundEffectConfig, canvas: HTMLCanvasElement) => {
    particlesArrayRef.current = [];
    const { count, particleShape, particleColor, size = 3, speed = 1, sizeVariation = 1 } = config;
    for (let i = 0; i < count; i++) {
      const particleSize = Math.max(0.5, size + (Math.random() - 0.5) * sizeVariation * 2);
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const baseSpeedX = (Math.random() - 0.5) * (speed * 0.5);
      const baseSpeedY = (Math.random() - 0.5) * (speed * 0.5);
      
      let color: string;
      if (Array.isArray(particleColor)) {
        color = particleColor[Math.floor(Math.random() * particleColor.length)];
      } else {
        color = particleColor;
      }

      particlesArrayRef.current.push({
        x,
        y,
        size: particleSize,
        speedX: baseSpeedX,
        speedY: baseSpeedY,
        color,
        opacity: Math.random() * 0.5 + 0.3, // Random opacity for depth
        shape: particleShape as 'circle' | 'star' | 'square', // Assuming config matches
      });
    }
  }, []);
  
  const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, opacity: number) => {
    const spikes = 5;
    const outerRadius = size;
    const innerRadius = size / 2;
    let rot = (Math.PI / 2) * 3;
    let step = Math.PI / spikes;

    ctx.beginPath();
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
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;
    ctx.fill();
  };


  const animate = useCallback(() => {
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

    const config = currentEffectConfigRef.current;
    if(config && (config as any).oneShot) { // Simple check for one-shot, might need refinement
        // For one-shot effects like confetti, this component might not be the best place
        // or it needs a more complex trigger mechanism. For now, continuous effects are prioritized.
        animationFrameIdRef.current = null; // Stop animation for one-shot after setup
        // Potentially clear particles after a delay if it's one-shot
        return;
    }


    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesArrayRef.current.forEach((particle) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Boundary check (wrap around)
      if (particle.x > canvas.width + particle.size) particle.x = -particle.size;
      else if (particle.x < -particle.size) particle.x = canvas.width + particle.size;
      if (particle.y > canvas.height + particle.size) particle.y = -particle.size;
      else if (particle.y < -particle.size) particle.y = canvas.height + particle.size;
      
      ctx.globalAlpha = particle.opacity;
      if (particle.shape === 'star') {
        drawStar(ctx, particle.x, particle.y, particle.size, particle.color, particle.opacity);
      } else if (particle.shape === 'square') {
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
      } else { // Default to circle
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }
       ctx.globalAlpha = 1; // Reset globalAlpha
    });

    animationFrameIdRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (currentEffectConfigRef.current) {
         // Re-initialize particles on resize if effect is active to ensure distribution
        initParticles(currentEffectConfigRef.current, canvas);
      }
    };

    if (activeBackgroundEffect) {
      const config = activeBackgroundEffect.config as BackgroundEffectConfig;
      if ((config as any).target === 'feedbackIndicator' || (config as any).oneShot) {
          // This component currently focuses on full-screen continuous effects.
          // Targeted or one-shot effects might need different handling.
          // For now, if it's targeted or one-shot, don't initialize full background.
          currentEffectConfigRef.current = null;
          particlesArrayRef.current = [];
          if (animationFrameIdRef.current) {
            cancelAnimationFrame(animationFrameIdRef.current);
            animationFrameIdRef.current = null;
          }
          const ctx = canvas.getContext('2d');
          ctx?.clearRect(0,0,canvas.width, canvas.height);
          return; // Don't proceed with full background setup
      }

      currentEffectConfigRef.current = config;
      resizeCanvas(); // Set initial size and init particles
      if (!animationFrameIdRef.current) {
        animate();
      }
    } else {
      currentEffectConfigRef.current = null;
      particlesArrayRef.current = []; // Clear particles
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
      // Clear canvas when no effect is active
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0,0,canvas.width, canvas.height);
    }
    
    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
       particlesArrayRef.current = [];
    };
  }, [activeBackgroundEffect, initParticles, animate]);

  // Render nothing if no effect, or only render canvas if effect is active
  if (!activeBackgroundEffect || ((activeBackgroundEffect.config as any).target) || ((activeBackgroundEffect.config as any).oneShot) ) {
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
        zIndex: -1, // Behind all other content
        pointerEvents: 'none',
      }}
    />
  );
};

export default ActiveBackgroundEffects;
