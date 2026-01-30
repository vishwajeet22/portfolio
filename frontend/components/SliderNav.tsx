'use client';

import { useState, useRef, useEffect } from 'react';

const ITEMS = ['Intro', 'Education', 'Work', 'Hobbies', 'Writing', 'Contact'];

export default function SliderNav() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sliderStyle, setSliderStyle] = useState<React.CSSProperties>({});
  const [isDragging, setIsDragging] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; left: number } | null>(null);

  const updateSlider = (index: number, animate = true) => {
    if (!navRef.current) return;

    const navWidth = navRef.current.offsetWidth;
    const itemWidth = navWidth / ITEMS.length;
    const left = index * itemWidth;

    setSliderStyle({
      left: `${left}px`,
      width: `${itemWidth}px`,
      transition: animate ? 'left 0.3s cubic-bezier(0.4, 0.0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)' : 'none',
    });
  };

  useEffect(() => {
    // Initial position
    // We use a small timeout to ensure DOM is ready and layout is computed
    const timer = setTimeout(() => updateSlider(activeIndex), 50);

    const handleResize = () => updateSlider(activeIndex, false);
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeIndex]);

  const handleStart = (clientX: number) => {
      if (!sliderRef.current) return;
      setIsDragging(true);

      const currentLeft = parseFloat(sliderRef.current.style.left || '0');
      dragStartRef.current = { x: clientX, left: currentLeft };

      // Disable transition immediately
      setSliderStyle(prev => ({ ...prev, transition: 'none' }));
  };

  const handleMove = (clientX: number) => {
      if (!isDragging || !dragStartRef.current || !navRef.current) return;

      const diff = clientX - dragStartRef.current.x;
      const navWidth = navRef.current.offsetWidth;
      const itemWidth = navWidth / ITEMS.length;
      const maxLeft = navWidth - itemWidth;

      let newLeft = dragStartRef.current.left + diff;
      newLeft = Math.max(0, Math.min(maxLeft, newLeft));

      setSliderStyle(prev => ({ ...prev, left: `${newLeft}px` }));
  };

  const handleEnd = () => {
      if (!isDragging || !navRef.current || !sliderRef.current) return;
      setIsDragging(false);
      dragStartRef.current = null;

      const currentLeft = parseFloat(sliderRef.current.style.left || '0');
      const navWidth = navRef.current.offsetWidth;
      const itemWidth = navWidth / ITEMS.length;

      const newIndex = Math.round(currentLeft / itemWidth);

      // If index changed, setActiveIndex will trigger useEffect -> updateSlider
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      } else {
        // If index didn't change, we still need to snap back to center
        updateSlider(activeIndex, true);
      }
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onMouseUp = () => handleEnd();
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
    const onTouchEnd = () => handleEnd();

    if (isDragging) {
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('touchmove', onTouchMove);
        window.addEventListener('touchend', onTouchEnd);
    }
    return () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging]);

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 max-w-[90vw]">
      <div
        ref={navRef}
        className="relative flex items-center justify-between"
        // Ensure the container has enough width but can shrink if needed on small screens
        // Using a fixed width or percentage might be better for "equal width" assumption
        style={{ width: '600px', maxWidth: '100%' }}
      >
        <div
          ref={sliderRef}
          className="absolute top-0 bottom-0 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-lg cursor-grab active:cursor-grabbing z-0"
          style={sliderStyle}
          onMouseDown={(e) => handleStart(e.clientX)}
          onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        >
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-1 bg-white/30 rounded-full pointer-events-none" />
        </div>

        {ITEMS.map((item, index) => (
          <div
            key={item}
            className={`nav-item relative z-10 flex-1 py-3 text-sm font-medium transition-colors duration-300 cursor-pointer select-none text-center ${
              index === activeIndex ? 'text-white' : 'text-white/60 hover:text-white/80'
            }`}
            onClick={() => setActiveIndex(index)}
          >
            {item}
          </div>
        ))}
      </div>
    </nav>
  );
}
