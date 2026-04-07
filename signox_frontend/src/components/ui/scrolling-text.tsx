'use client';

import { useEffect, useRef } from 'react';

export type ScrollDirection = 'left-to-right' | 'right-to-left' | 'top-to-bottom' | 'bottom-to-top';

interface ScrollingTextProps {
  text: string;
  direction?: ScrollDirection;
  speed?: number; // pixels per second
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | 'bolder' | 'lighter';
  textColor?: string;
  backgroundColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function ScrollingText({
  text,
  direction = 'left-to-right',
  speed = 50,
  fontSize = 24,
  fontWeight = 'normal',
  textColor = '#000000',
  backgroundColor = 'transparent',
  className = '',
  style = {},
}: ScrollingTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!containerRef.current || !textRef.current || !text) return;

    const container = containerRef.current;
    const textElement = textRef.current;
    
    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    // Force reflow to get accurate measurements
    container.offsetHeight;
    textElement.offsetHeight;

    const containerRect = container.getBoundingClientRect();
    const textRect = textElement.getBoundingClientRect();

    console.log(`ScrollingText Setup:`, {
      direction,
      container: { width: containerRect.width, height: containerRect.height },
      text: { width: textRect.width, height: textRect.height }
    });

    // Check if this is a vertical direction that needs letter-by-letter scrolling
    const isVerticalLetterByLetter = direction === 'top-to-bottom' || direction === 'bottom-to-top';

    if (isVerticalLetterByLetter) {
      // Letter-by-letter scrolling for vertical directions
      let currentIndex = 0;
      let startTime: number | null = null;
      const letterDuration = 1000 / speed * 20; // Adjust timing for letter-by-letter

      const animateLetterByLetter = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        
        const elapsed = currentTime - startTime;
        
        if (elapsed >= letterDuration) {
          currentIndex++;
          startTime = currentTime;
          
          if (currentIndex <= text.length) {
            const visibleText = direction === 'top-to-bottom' 
              ? text.slice(0, currentIndex)
              : text.slice(-currentIndex);
            textElement.textContent = visibleText;
          } else {
            // Animation complete, restart after a brief pause
            setTimeout(() => {
              currentIndex = 0;
              textElement.textContent = '';
              startTime = null;
              animationRef.current = requestAnimationFrame(animateLetterByLetter);
            }, 1000);
            return;
          }
        }
        
        animationRef.current = requestAnimationFrame(animateLetterByLetter);
      };

      // Position text in center for vertical letter-by-letter
      textElement.style.position = 'absolute';
      textElement.style.left = '50%';
      textElement.style.top = '50%';
      textElement.style.transform = 'translate(-50%, -50%)';
      textElement.style.textAlign = 'center';
      textElement.textContent = '';
      
      animationRef.current = requestAnimationFrame(animateLetterByLetter);
    } else {
      // Original scrolling behavior for horizontal directions
      let startTime: number | null = null;
      let startPos: { x: number; y: number };
      let endPos: { x: number; y: number };
      let distance: number;

      // Calculate start and end positions based on direction
      switch (direction) {
        case 'left-to-right':
          startPos = { x: -textRect.width, y: (containerRect.height - textRect.height) / 2 };
          endPos = { x: containerRect.width, y: startPos.y };
          distance = containerRect.width + textRect.width;
          break;
        case 'right-to-left':
          startPos = { x: containerRect.width, y: (containerRect.height - textRect.height) / 2 };
          endPos = { x: -textRect.width, y: startPos.y };
          distance = containerRect.width + textRect.width;
          break;
        default:
          startPos = { x: -textRect.width, y: (containerRect.height - textRect.height) / 2 };
          endPos = { x: containerRect.width, y: startPos.y };
          distance = containerRect.width + textRect.width;
      }

      const duration = (distance / speed) * 1000; // Convert to milliseconds

      console.log(`Animation Config:`, {
        startPos,
        endPos,
        distance,
        duration: duration / 1000 + 's'
      });

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Calculate current position
        const currentX = startPos.x + (endPos.x - startPos.x) * progress;
        const currentY = startPos.y + (endPos.y - startPos.y) * progress;
        
        // Update position
        textElement.style.left = `${currentX}px`;
        textElement.style.top = `${currentY}px`;
        
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          // Animation complete, restart after a brief pause
          setTimeout(() => {
            startTime = null;
            animationRef.current = requestAnimationFrame(animate);
          }, 500);
        }
      };

      // Set initial position and start animation
      textElement.style.position = 'absolute';
      textElement.style.left = `${startPos.x}px`;
      textElement.style.top = `${startPos.y}px`;
      textElement.style.transform = 'none';
      textElement.style.textAlign = 'left';
      textElement.textContent = text;
      animationRef.current = requestAnimationFrame(animate);
    }

    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [text, direction, speed]);

  if (!text) {
    return (
      <div 
        className={`flex items-center justify-center text-gray-400 ${className}`}
        style={{ backgroundColor, ...style }}
      >
        <span style={{ fontSize: `${fontSize}px`, fontWeight }}>
          No text to display
        </span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor, ...style }}
    >
      <div
        ref={textRef}
        className="absolute whitespace-nowrap"
        style={{
          fontSize: `${fontSize}px`,
          fontWeight,
          color: textColor,
          pointerEvents: 'none',
        }}
      >
        {text}
      </div>
    </div>
  );
}