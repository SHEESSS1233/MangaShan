'use client';

import React, { useRef, useState, useEffect } from 'react';

interface ScrollingTitleProps {
  text: string;
  className?: string;
}

export function ScrollingTitle({ text, className = '' }: ScrollingTitleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [duration, setDuration] = useState(4);
  const [scrollDist, setScrollDist] = useState(0);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && textRef.current) {
        const cWidth = containerRef.current.clientWidth;
        const sWidth = textRef.current.scrollWidth;
        const overflowing = sWidth > cWidth;
        setIsOverflowing(overflowing);
        
        if (overflowing) {
          // Speed: roughly 40px per second. Add 2 seconds for base duration.
          const dist = sWidth - cWidth;
          setScrollDist(dist);
          setDuration(Math.max(3, dist / 40));
        }
      }
    };

    // Initial check and a small delay check to ensure fonts are loaded
    checkOverflow();
    const timeout = setTimeout(checkOverflow, 500);
    
    window.addEventListener('resize', checkOverflow);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', checkOverflow);
    };
  }, [text]);

  return (
    <div 
      ref={containerRef} 
      className={`relative overflow-hidden w-full marquee-container ${className}`}
      style={{
        maskImage: isOverflowing ? 'linear-gradient(90deg, #000 0%, #000 85%, transparent 100%)' : 'none',
        WebkitMaskImage: isOverflowing ? 'linear-gradient(90deg, #000 0%, #000 85%, transparent 100%)' : 'none',
      }}
    >
      <div
        ref={textRef}
        className={`whitespace-nowrap ${isOverflowing ? 'animate-marquee-text' : 'truncate'}`}
        style={{
          display: 'inline-block',
          width: isOverflowing ? 'max-content' : '100%',
          minWidth: '100%',
          animationDuration: isOverflowing ? `${duration}s` : '0s',
          ...(isOverflowing && { '--scroll-dist': `-${scrollDist}px` } as React.CSSProperties)
        }}
      >
        {text}
      </div>
    </div>
  );
}
