
import React, { useEffect, useRef, useCallback } from 'react';

interface FireworksCanvasProps {
  isActive: boolean; // Controls if animation runs and new fireworks are launched
}

// Helper function for random values
const random = (min: number, max: number): number => Math.random() * (max - min) + min;

// Define Particle class (adapted from user's code)
interface ParticleData {
  x: number;
  y: number;
  xSpeed: number;
  ySpeed: number;
  color: string;
  size: number;
  opacity: number;
  isAlive: boolean;
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

  constructor(x: number, y: number, xSpeed: number, ySpeed: number, color: string, size: number) {
    this.x = x;
    this.y = y;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
    this.color = color;
    this.size = size;
    this.opacity = 1;
    this.isAlive = true;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  update() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    this.ySpeed += 0.1; // Gravity
    this.opacity -= 0.015; // Fade out a bit faster
    if (this.opacity <= 0) {
      this.isAlive = false;
    }
  }
}

// Define Firework class (adapted from user's code)
interface FireworkData {
  x: number;
  y: number;
  targetY?: number; // Optional: for rockets that aim for a specific height before exploding
  ySpeed: number;
  color: string;
  countdown: number;
  hasExploded: boolean;
  particlesArrayRef: React.MutableRefObject<ParticleData[]>;
  draw: (ctx: CanvasRenderingContext2D) => void;
  update: (canvasHeight: number) => void;
  explode: () => void;
}

class Firework implements FireworkData {
  x: number;
  y: number;
  targetY?: number;
  ySpeed: number;
  color: string;
  countdown: number;
  hasExploded: boolean;
  particlesArrayRef: React.MutableRefObject<ParticleData[]>;


  constructor(x: number, startY: number, particlesArrayRef: React.MutableRefObject<ParticleData[]>, targetY?: number) {
    this.x = x;
    this.y = startY;
    this.targetY = targetY ?? random(window.innerHeight * 0.1, window.innerHeight * 0.4); // Explode in upper part
    this.ySpeed = random(-12, -7); // Initial upward speed
    this.color = `hsl(${random(0, 360)}, 100%, 70%)`; // Brighter colors
    this.countdown = random(50, 90); // Time to explode
    this.hasExploded = false;
    this.particlesArrayRef = particlesArrayRef;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.hasExploded) return;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    // Simple trail effect for the rocket
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.5;
    ctx.arc(this.x, this.y + 5, 2, 0, Math.PI * 2); // smaller trail particle
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  update(canvasHeight: number) {
    if (this.hasExploded) return;

    this.y += this.ySpeed;
    this.ySpeed += 0.08; // Gravity on rocket
    this.countdown--;

    // Explode if countdown finishes, passes targetY, or starts falling
    if (this.countdown <= 0 || this.y < this.targetY! || (this.ySpeed > 0 && this.y < canvasHeight * 0.8) ) {
      this.explode();
    }
  }

  explode() {
    if (this.hasExploded) return;
    this.hasExploded = true;
    const explosionSize = random(50, 100); // More particles
    for (let i = 0; i < explosionSize; i++) {
      const speed = random(1, 7); // Varied particle speeds
      const angle = random(0, Math.PI * 2);
      const xSpeed = Math.cos(angle) * speed;
      const ySpeed = Math.sin(angle) * speed - random(0,1); // Slight upward bias initially for some
      this.particlesArrayRef.current.push(new Particle(this.x, this.y, xSpeed, ySpeed, this.color, random(1.5, 3.5)));
    }
  }
}


const FireworksCanvas: React.FC<FireworksCanvasProps> = ({ isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const fireworksRef = useRef<FireworkData[]>([]);
  const particlesRef = useRef<ParticleData[]>([]);
  const internalIsRunningRef = useRef(false); // Controls spawning new fireworks

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the canvas for a transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Launch new fireworks periodically if active
    if (internalIsRunningRef.current && Math.random() < 0.04) {
      fireworksRef.current.push(new Firework(random(0, canvas.width), canvas.height, particlesRef));
    }
    
    // Update and draw fireworks
    fireworksRef.current.forEach((firework, index) => {
      firework.update(canvas.height);
      firework.draw(ctx);
      if (firework.hasExploded) {
        fireworksRef.current.splice(index, 1);
      }
    });

    // Update and draw particles
    particlesRef.current.forEach((particle, index) => {
      particle.update();
      particle.draw(ctx);
      if (!particle.isAlive) {
        particlesRef.current.splice(index, 1);
      }
    });
    
    animationFrameIdRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    internalIsRunningRef.current = isActive; // Sync with prop

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Resize handling
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas(); // Initial size
    window.addEventListener('resize', resizeCanvas);
    
    // Start animation if not already started
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
        zIndex: 1001, 
        pointerEvents: 'none', // Allow clicks to pass through
      }}
    />
  );
};

export default FireworksCanvas;
