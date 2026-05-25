import { useEffect, useRef } from 'react';

const SakuraShower = () => {
  const canvasRef = useRef(null);
  const petalsRef = useRef([]);
  const animationFrameId = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class SakuraPetal {
      constructor(isInitial = false) {
        this.x = Math.random() * canvas.width;
        // If initial shower, spawn across the top half of the screen; otherwise spawn above screen
        this.y = isInitial ? Math.random() * canvas.height * 0.6 - 20 : -20;
        this.size = Math.random() * 8 + 6;
        this.speedX = Math.random() * 1.5 - 0.5 + 0.5; // Wind drift to the right mostly
        this.speedY = Math.random() * 1.2 + 1.0; // Gravity fall
        this.opacity = Math.random() * 0.4 + 0.6;
        this.opacitySpeed = Math.random() * 0.002 + 0.001;
        this.angle = Math.random() * Math.PI * 2;
        this.angleSpeed = Math.random() * 0.02 - 0.01;
        this.swing = Math.random() * 2 * Math.PI;
        this.swingSpeed = Math.random() * 0.03 + 0.01;
        // Flutter scale (creates 3D flipping effect)
        this.scaleY = Math.random() * 0.6 + 0.4;
        this.scaleYSpeed = Math.random() * 0.04 + 0.02;
      }

      update() {
        this.x += this.speedX + Math.sin(this.swing) * 0.4;
        this.y += this.speedY;
        this.swing += this.swingSpeed;
        this.angle += this.angleSpeed;
        
        // Flutter effect
        this.scaleY = Math.sin(this.y * 0.05) * 0.6 + 0.4;

        // Slow fade out
        this.opacity -= this.opacitySpeed;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.scale(1, this.scaleY);

        // Draw elegant sakura petal
        ctx.beginPath();
        // Create standard petal shape via two curves
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-this.size / 2, -this.size / 2, 0, -this.size);
        ctx.quadraticCurveTo(this.size / 2, -this.size / 2, 0, 0);

        // Pink gradient for premium texture
        const gradient = ctx.createLinearGradient(0, 0, 0, -this.size);
        gradient.addColorStop(0, `rgba(255, 183, 197, ${this.opacity})`);
        gradient.addColorStop(1, `rgba(255, 205, 215, ${this.opacity * 0.9})`);

        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw center crease line
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -this.size * 0.7);
        ctx.strokeStyle = `rgba(240, 140, 160, ${this.opacity * 0.5})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.restore();
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const petals = petalsRef.current;
      for (let i = petals.length - 1; i >= 0; i--) {
        const petal = petals[i];
        petal.update();
        petal.draw();

        // Remove if off screen or fully faded
        if (
          petal.y > canvas.height + 20 || 
          petal.x > canvas.width + 20 || 
          petal.x < -20 ||
          petal.opacity <= 0
        ) {
          petals.splice(i, 1);
        }
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    const triggerShower = (e) => {
      const count = e?.detail?.count || 45;
      for (let i = 0; i < count; i++) {
        petalsRef.current.push(new SakuraPetal(false));
      }
    };

    window.addEventListener('trigger-sakura', triggerShower);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('trigger-sakura', triggerShower);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      style={{ mixBlendMode: 'normal' }}
    />
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const triggerSakuraRain = (count = 45) => {
  const event = new CustomEvent('trigger-sakura', { detail: { count } });
  window.dispatchEvent(event);
};

export default SakuraShower;
