
import React, { useEffect, useRef, useCallback } from 'react';
import { 
    FIREWORK_EXPLOSION_SOUND_1_FILENAME, FIREWORK_EXPLOSION_SOUND_1_REMOTE_URL,
    FIREWORK_EXPLOSION_SOUND_2_FILENAME, FIREWORK_EXPLOSION_SOUND_2_REMOTE_URL 
} from '../constants';

interface FireworksCanvasProps {
  isActive: boolean; // Controls if animation runs and new fireworks are launched
  playSound: (filename: string, remoteUrl: string, volume?: number) => void;
  audioUnlocked: boolean;
}

// Helper function for random values
const random = (min: number, max: number): number => Math.random() * (max - min) + min;

// Define Particle class
interface ParticleData {
  x: number;
  y: number;
  xSpeed: number;
  ySpeed: number;
  color: string;
  size: number;
  opacity: number;
  isAlive: boolean;
  opacityDecayRate: number;
  gravityEffect: number;
  draw: (ctx: CanvasRenderingContext2D) => void;
  update: () => void;
}

class Particle implements ParticleData {
  x: number;
  y: number;
  xSpeed: number;
  ySpeed: number;
  color: string;
  size: number;
  opacity: number;
  isAlive: boolean;
  opacityDecayRate: number;
  gravityEffect: number;

  constructor(x: number, y: number, xSpeed: number, ySpeed: number, color: string, size: number, opacityDecayRate: number = 0.015, gravityEffect: number = 0.1) {
    this.x = x;
    this.y = y;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
    this.color = color;
    this.size = size;
    this.opacity = 1;
    this.isAlive = true;
    this.opacityDecayRate = opacityDecayRate;
    this.gravityEffect = gravityEffect;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    
    ctx.shadowBlur = random(5,10); 
    ctx.shadowColor = this.color;

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }

  update() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    this.ySpeed += this.gravityEffect; 
    this.opacity -= this.opacityDecayRate; 
    if (this.opacity <= 0) {
      this.isAlive = false;
    }
  }
}

// Define Firework class
interface FireworkData {
  x: number;
  y: number;
  xSpeed: number; 
  targetY?: number; 
  ySpeed: number;
  color: string;
  countdown: number;
  hasExploded: boolean;
  particlesArrayRef: React.MutableRefObject<ParticleData[]>;
  playSoundFunc?: (filename: string, remoteUrl: string, volume?: number) => void;
  audioUnlockedStatus?: boolean;
  draw: (ctx: CanvasRenderingContext2D) => void;
  update: (canvasHeight: number) => void;
  explode: () => void;
}

class Firework implements FireworkData {
  x: number;
  y: number;
  xSpeed: number;
  targetY?: number;
  ySpeed: number;
  color: string;
  countdown: number;
  hasExploded: boolean;
  particlesArrayRef: React.MutableRefObject<ParticleData[]>;
  playSoundFunc?: (filename: string, remoteUrl: string, volume?: number) => void;
  audioUnlockedStatus?: boolean;


  constructor(
    x: number, 
    startY: number, 
    particlesArrayRef: React.MutableRefObject<ParticleData[]>, 
    targetY: number | undefined,
    playSound: (filename: string, remoteUrl: string, volume?: number) => void,
    audioUnlocked: boolean
    ) {
    this.x = x;
    this.y = startY;
    this.xSpeed = random(-0.5, 0.5); 
    this.targetY = targetY ?? random(window.innerHeight * 0.05, window.innerHeight * 0.35); 
    this.ySpeed = random(-15, -9); 
    this.color = `hsl(${random(0, 360)}, 100%, 75%)`;
    this.countdown = random(50, 90); 
    this.hasExploded = false;
    this.particlesArrayRef = particlesArrayRef;
    this.playSoundFunc = playSound;
    this.audioUnlockedStatus = audioUnlocked;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.hasExploded) return;
    ctx.fillStyle = this.color;
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3.5, 0, Math.PI * 2); 
    ctx.fill();

    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(this.x - this.xSpeed * 2, this.y - this.ySpeed * 1.5, 2.5, 0, Math.PI * 2); 
    ctx.fill();
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(this.x - this.xSpeed * 4, this.y - this.ySpeed * 3, 1.5, 0, Math.PI * 2); 
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  update(canvasHeight: number) {
    if (this.hasExploded) return;

    this.x += this.xSpeed;
    this.y += this.ySpeed;
    this.ySpeed += 0.08; 
    this.countdown--;

    if (this.countdown <= 0 || this.y < this.targetY! || (this.ySpeed > 0 && this.y < canvasHeight * 0.8) ) {
      this.explode();
    }
  }

  explode() {
    if (this.hasExploded) return;
    this.hasExploded = true;

    if (this.playSoundFunc && this.audioUnlockedStatus) {
        const sounds = [
            { filename: FIREWORK_EXPLOSION_SOUND_1_FILENAME, remoteUrl: FIREWORK_EXPLOSION_SOUND_1_REMOTE_URL },
            { filename: FIREWORK_EXPLOSION_SOUND_2_FILENAME, remoteUrl: FIREWORK_EXPLOSION_SOUND_2_REMOTE_URL }
        ];
        const soundToPlay = sounds[Math.floor(Math.random() * sounds.length)];
        this.playSoundFunc(soundToPlay.filename, soundToPlay.remoteUrl, 0.35); 
    }

    const explosionSize = random(120, 200); 
    for (let i = 0; i < explosionSize; i++) {
      const angle = random(0, Math.PI * 2);
      
      if (Math.random() < 0.7) { 
        const speed = random(2, 10); 
        const xSpeed = Math.cos(angle) * speed;
        const ySpeed = Math.sin(angle) * speed - random(0,1);
        const particleSize = random(2.5, 5); 
        this.particlesArrayRef.current.push(new Particle(this.x, this.y, xSpeed, ySpeed, this.color, particleSize, 0.015, 0.1));
      } else { 
        const sparklerSpeed = random(2, 10) * random(0.8, 1.2); 
        const sparklerXSpeed = Math.cos(angle) * sparklerSpeed;
        const sparklerYSpeed = Math.sin(angle) * sparklerSpeed;
        const sparklerColor = `hsl(${random(0, 360)}, 100%, ${random(80, 95)}%)`; 
        const sparklerSize = random(1, 2.5); 
        this.particlesArrayRef.current.push(new Particle(this.x, this.y, sparklerXSpeed, sparklerYSpeed, sparklerColor, sparklerSize, 0.03, 0.02)); 
      }
    }
  }
}


const FireworksCanvas: React.FC<FireworksCanvasProps> = ({ isActive, playSound, audioUnlocked }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const fireworksRef = useRef<FireworkData[]>([]);
  const particlesRef = useRef<ParticleData[]>([]);
  const internalIsRunningRef = useRef(false); 

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.12)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    if (internalIsRunningRef.current && Math.random() < 0.05) { 
      fireworksRef.current.push(new Firework(random(0, canvas.width), canvas.height, particlesRef, undefined, playSound, audioUnlocked));
    }
    
    fireworksRef.current.forEach((firework, index) => {
      firework.update(canvas.height);
      firework.draw(ctx);
      if (firework.hasExploded) {
        fireworksRef.current.splice(index, 1);
      }
    });

    particlesRef.current.forEach((particle, index) => {
      particle.update();
      particle.draw(ctx);
      if (!particle.isAlive) {
        particlesRef.current.splice(index, 1);
      }
    });
    
    animationFrameIdRef.current = requestAnimationFrame(animate);
  }, [playSound, audioUnlocked]);

  useEffect(() => {
    internalIsRunningRef.current = isActive; 

    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas(); 
    window.addEventListener('resize', resizeCanvas);
    
    if (!animationFrameIdRef.current) {
        animate();
    }
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
      fireworksRef.current = [];
      particlesRef.current = [];
    };
  }, [isActive, animate]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0, // Adjusted z-index to be behind modals
        pointerEvents: 'none', 
      }}
    />
  );
};

export default FireworksCanvas;
