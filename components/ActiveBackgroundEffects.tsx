
import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { PlayerActiveAccessoriesState, Theme, ThemeAccessory, AccessoryType, BackgroundEffectConfig } from '../types';

interface ActiveBackgroundEffectsProps {
  playerActiveAccessories: PlayerActiveAccessoriesState;
  currentTheme: Theme;
  allAccessoriesDetails: ThemeAccessory[];
  triggerConfetti?: boolean;
  onConfettiComplete?: () => void;
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
        opacity: Math.random() * 0.5 + 0.3, 
        shape: particleShape as 'circle' | 'star' | 'square',
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
    const config = currentEffectConfigRef.current;

    if (!canvas || !config || (config as any).oneShot || (config as any).target === 'feedbackIndicator') {
      animationFrameIdRef.current = null; // Stop animation if no canvas, no config, or it's a one-shot/targeted effect
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
      
      ctx.globalAlpha = particle.opacity;
      if (particle.shape === 'star') {
        drawStar(ctx, particle.x, particle.y, particle.size, particle.color, particle.opacity);
      } else if (particle.shape === 'square') {
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
      } else { 
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }
       ctx.globalAlpha = 1; 
    });

    animationFrameIdRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (currentEffectConfigRef.current && !(currentEffectConfigRef.current as any).oneShot && !(currentEffectConfigRef.current as any).target) {
        initParticles(currentEffectConfigRef.current, canvas);
      }
    };

    if (activeBackgroundEffect) {
      const config = activeBackgroundEffect.config as BackgroundEffectConfig;
      currentEffectConfigRef.current = config;

      if ((config as any).target === 'feedbackIndicator' || (config as any).oneShot) {
          // If it's a one-shot or targeted, don't start continuous animation loop for this component's canvas
          particlesArrayRef.current = [];
          if (animationFrameIdRef.current) {
            cancelAnimationFrame(animationFrameIdRef.current);
            animationFrameIdRef.current = null;
          }
          const ctx = canvas.getContext('2d');
          ctx?.clearRect(0,0,canvas.width, canvas.height);
      } else {
        // For continuous effects
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

  // Effect for handling confetti trigger
  useEffect(() => {
    if (triggerConfetti && activeBackgroundEffect?.id === 'universal_confetti_correct') {
      const config = activeBackgroundEffect.config as BackgroundEffectConfig;
      
      let originConfig = { x: 0.5, y: 0.6 }; // Default origin

      // Try to find FeedbackIndicator and target confetti there
      const feedbackIndicatorElement = document.querySelector('.animate-fadeIn[role="alert"]');
      if (feedbackIndicatorElement) {
        const rect = feedbackIndicatorElement.getBoundingClientRect();
        // Calculate center of the element relative to viewport
        const x = (rect.left + rect.right) / 2;
        const y = (rect.top + rect.bottom) / 2;
        // Convert to confetti's 0-1 scale
        originConfig = {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        };
      }

      confetti({
        particleCount: config.count || 150, // Use config count or default
        spread: 70,
        origin: originConfig,
        colors: Array.isArray(config.particleColor) ? config.particleColor : [config.particleColor || '#FFC700'],
        scalar: (config.size || 3) / 2.5, // Adjust scalar if needed
        zIndex: 10000, // Ensure confetti is on top
      });
      onConfettiComplete?.();
    }
  }, [triggerConfetti, activeBackgroundEffect, onConfettiComplete]);


  if (!activeBackgroundEffect || (activeBackgroundEffect.config as any).oneShot || (activeBackgroundEffect.config as any).target === 'feedbackIndicator') {
    // Don't render this component's canvas if the effect is one-shot (like confetti) or specifically targeted elsewhere.
    // Confetti will be handled by its own useEffect.
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
        zIndex: -1, 
        pointerEvents: 'none',
      }}
    />
  );
};

export default ActiveBackgroundEffects;
