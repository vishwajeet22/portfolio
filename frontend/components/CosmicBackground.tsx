"use client";

import React, { useEffect, useRef } from 'react';

const CosmicBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Star[] = [];

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Star class
    class Star {
      x: number;
      y: number;
      z: number;
      size: number;
      speed: number;

      constructor() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.size = 0;
        this.speed = 0;
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.z = Math.random() * canvas!.width;
        this.size = Math.random() * 2;
        this.speed = Math.random() * 0.5 + 0.1;
      }

      update() {
        this.z -= this.speed;
        if (this.z <= 0) {
          this.reset();
          this.z = canvas!.width;
        }
      }

      draw() {
        if (!ctx || !canvas) return;
        const x = (this.x - canvas.width / 2) * (canvas.width / this.z);
        const y = (this.y - canvas.height / 2) * (canvas.width / this.z);
        const s = this.size * (canvas.width / this.z);

        const centerX = canvas.width / 2 + x;
        const centerY = canvas.height / 2 + y;

        // Only draw if on screen
        if (centerX >= 0 && centerX <= canvas.width && centerY >= 0 && centerY <= canvas.height) {
          const opacity = Math.min(1, (canvas.width - this.z) / (canvas.width * 0.3));

          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.arc(centerX, centerY, s, 0, Math.PI * 2);
          ctx.fill();

          // Add glow for larger stars
          if (s > 1) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'white';
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }
    }

    // Create stars
    for (let i = 0; i < 300; i++) {
      stars.push(new Star());
    }

    // Animation loop
    const animate = () => {
      // Create cosmic gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width
      );
      gradient.addColorStop(0, '#0a0e27');
      gradient.addColorStop(0.5, '#1a1435');
      gradient.addColorStop(1, '#0d0221');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add some nebula clouds
      ctx.globalAlpha = 0.1;
      const nebulaGradient = ctx.createRadialGradient(
        canvas.width * 0.3,
        canvas.height * 0.4,
        0,
        canvas.width * 0.3,
        canvas.height * 0.4,
        canvas.width * 0.5
      );
      nebulaGradient.addColorStop(0, '#4a148c');
      nebulaGradient.addColorStop(0.5, '#1565c0');
      nebulaGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = nebulaGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;

      // Update and draw stars
      stars.forEach(star => {
        star.update();
        star.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
    />
  );
};

export default CosmicBackground;
