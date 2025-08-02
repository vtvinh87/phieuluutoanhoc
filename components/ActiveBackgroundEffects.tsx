
import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { PlayerActiveAccessoriesState, Theme, ThemeAccessory, AccessoryType, BackgroundEffectConfig } from '../types';

interface ActiveBackgroundEffectsProps {
  playerActiveAccessories: PlayerActiveAccessoriesState;
  currentTheme: Theme;
  allAccessoriesDetails: ThemeAccessory[];
  triggerConfetti?: boolean;
  onConfettiComplete?: () => void;
  triggerTreasureSparkle?: boolean;
  onTreasureSparkleComplete?: () => void;
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
  triggerConfetti,
  onConfettiComplete,
  triggerTreasureSparkle,
  onTreasureSparkleComplete,
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

  const drawStar = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, opacity: number) => {
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
  }, []);

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
        opacity: config.opacity !== undefined ? config.opacity : (Math.random() * 0.5 + 0.3),
        shape: particleShape as 'circle' | 'star' | 'square',
      });
    }
  }, []);
  

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const config = currentEffectConfigRef.current;

    if (!canvas || !config || (config as any).oneShot || (config as any).target ) {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
      const ctx = canvas?.getContext('2d');
      ctx?.clearRect(0,0,canvas.width, canvas.height);
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      animationFrameIdRef.current = null;
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesArrayRef.current.forEach((particle) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      if (particle.x > canvas.width + particle.size) particle.x = -particle.size;
      else if (particle.x < -particle.size) particle.x = canvas.width + particle.size;
      if (particle.y > canvas.height + particle.size) particle.y = -particle.size;
      else if (particle.y < -particle.size) particle.y = canvas.height + particle.size;
      
      if (particle.shape === 'star') {
        drawStar(ctx, particle.x, particle.y, particle.size, particle.color, particle.opacity);
      } else if (particle.shape === 'square') {
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
        ctx.restore();
      } else { // circle
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });

    animationFrameIdRef.current = requestAnimationFrame(animate);
  }, [drawStar]); 

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const configForResize = currentEffectConfigRef.current;
      if (configForResize && !(configForResize as any).oneShot && !(configForResize as any).target) {
        initParticles(configForResize, canvas);
      }
    };

    if (activeBackgroundEffect) {
      const config = activeBackgroundEffect.config as BackgroundEffectConfig;
      currentEffectConfigRef.current = config;

      if ((config as any).oneShot || (config as any).target) {
          particlesArrayRef.current = [];
          if (animationFrameIdRef.current) {
            cancelAnimationFrame(animationFrameIdRef.current);
            animationFrameIdRef.current = null;
          }
          const ctx = canvas.getContext('2d');
          ctx?.clearRect(0,0,canvas.width, canvas.height);
      } else {
        resizeCanvas(); 
        if (!animationFrameIdRef.current) {
          animate();
        }
      }
    } else {
      currentEffectConfigRef.current = null;
      particlesArrayRef.current = []; 
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
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

  // Effect for handling "Correct Answer" confetti
  useEffect(() => {
    if (triggerConfetti && activeBackgroundEffect?.id === 'universal_confetti_correct') {
      const config = activeBackgroundEffect.config as BackgroundEffectConfig;
      
      let originConfig = { x: 0.5, y: 0.3 }; 

      const feedbackIndicatorElement = document.querySelector('.animate-fadeIn[role="alert"]');
      if (feedbackIndicatorElement) {
        const rect = feedbackIndicatorElement.getBoundingClientRect();
        const x = (rect.left + rect.right) / 2;
        const y = rect.top;
        originConfig = {
          x: x / window.innerWidth,
          y: (y / window.innerHeight) - 0.05,
        };
      }

      confetti({
        particleCount: config.count || 120,
        spread: 90,
        origin: originConfig,
        colors: Array.isArray(config.particleColor) ? config.particleColor : ['#FFC700', '#FF69B4', '#00F5D4'],
        scalar: (config.size || 1.1),
        shapes: ['star', 'circle', 'square'],
        decay: 0.92,
        zIndex: 10000,
      });
      onConfettiComplete?.();
    }
  }, [triggerConfetti, activeBackgroundEffect, onConfettiComplete]);

  // Effect for handling "Treasure Open Sparkle"
  useEffect(() => {
    if (triggerTreasureSparkle && activeBackgroundEffect?.id === 'universal_treasure_open_sparkle') {
      const config = activeBackgroundEffect.config as BackgroundEffectConfig;
      let originConfig = { x: 0.5, y: 0.5 };

      const targetElement = document.getElementById('treasure-chest-modal-icon-target');
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        originConfig = {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        };
      }
      
      confetti({
        particleCount: config.count || 150,
        spread: 120,
        origin: originConfig,
        colors: Array.isArray(config.particleColor) ? config.particleColor : ['#FFD700', '#FFA500', '#FFFACD'],
        shapes: ['star'],
        scalar: config.size || 1.2,
        gravity: 0.3,
        decay: 0.9,
        zIndex: 10000,
      });
      onTreasureSparkleComplete?.();
    }
  }, [triggerTreasureSparkle, activeBackgroundEffect, onTreasureSparkleComplete]);


  if (!activeBackgroundEffect || (activeBackgroundEffect.config as any).oneShot || (activeBackgroundEffect.config as any).target) {
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
        zIndex: 0, // Changed from -1 to 0
        pointerEvents: 'none',
      }}
    />
  );
};

export default ActiveBackgroundEffects;

