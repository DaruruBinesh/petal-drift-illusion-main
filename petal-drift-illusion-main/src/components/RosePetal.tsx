import React, { useRef, useEffect } from 'react';

interface RosePetalProps {
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  delay: number;
}

const RosePetal: React.FC<RosePetalProps> = ({ x, y, color, size, rotation, delay }) => {
  const petalRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  
  useEffect(() => {
    const petal = petalRef.current;
    if (!petal) return;
    
    // Set initial position and increased size
    petal.style.left = `${x}px`;
    petal.style.top = `${y}px`;
    petal.style.width = `${size}px`;
    petal.style.height = `${size * 1.2}px`; // Maintain aspect ratio with increased size
    
    // Random horizontal drift (reduced range)
    const driftX = Math.random() * 1.5 - 0.75; // between -0.75 and 0.75
    
    // Random falling speed (reduced range)
    const speedY = 0.8 + Math.random() * 0.3; // between 0.8 and 1.1
    
    // Initial rotation and speed
    const initialRotation = rotation;
    const rotationSpeed = (Math.random() * 1.5 - 0.75) * 1.5; // reduced rotation speed
    
    let startTime: number | null = null;
    const duration = 2000; // 2 seconds
    
    // Start animation after delay
    const timeoutId = setTimeout(() => {
      // Make the petal visible
      petal.style.opacity = '1';
      
      function animate(timestamp: number) {
        if (!petal) return;
        
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Cubic ease-out for smoother motion
        const eased = 1 - Math.pow(1 - progress, 3);
        
        // Calculate position with slight drift
        const newY = y + eased * 60 * speedY; // reduced vertical movement
        const newX = x + eased * 15 * driftX; // reduced horizontal drift
        
        // Calculate rotation
        const newRotation = initialRotation + eased * 270 * rotationSpeed;
        
        // Fade out in the last 30% of animation
        const newOpacity = progress > 0.7 ? 1 - ((progress - 0.7) / 0.3) : 1;
        
        // Apply values
        petal.style.top = `${newY}px`;
        petal.style.left = `${newX}px`;
        petal.style.transform = `rotate(${newRotation}deg)`;
        petal.style.opacity = `${newOpacity}`;
        
        if (progress < 1) {
          // Continue animation
          animationRef.current = requestAnimationFrame(animate);
        }
      }
      
      // Start animation
      animationRef.current = requestAnimationFrame(animate);
    }, delay);
    
    // Cleanup on unmount
    return () => {
      clearTimeout(timeoutId);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [x, y, size, rotation, delay, color]);

  return (
    <div ref={petalRef} className="petal">
      <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
        {/* Simplified petal shape */}
        <path
          d="M50,10 
             C65,15 85,35 90,65 
             C95,95 75,110 50,110 
             C25,110 5,95 10,65 
             C15,35 35,15 50,10 Z"
          fill={color}
          stroke="none"
        />
        
        {/* Simple vein */}
        <path
          d="M50,15 C55,45 55,75 50,105"
          fill="none"
          stroke={`${color}80`}
          strokeWidth="0.8"
          strokeLinecap="round"
        />
        
        {/* Velvet texture effect */}
        <defs>
          <radialGradient id={`velvet-${color.replace('#', '')}`} cx="50%" cy="40%" r="60%" fx="50%" fy="40%">
            <stop offset="0%" stopColor={`${color}30`} />
            <stop offset="100%" stopColor={`${color}00`} />
          </radialGradient>
        </defs>
        <path
          d="M50,15 
             C65,20 80,40 85,65 
             C90,90 70,105 50,105 
             C30,105 10,90 15,65 
             C20,40 35,20 50,15 Z"
          fill={`url(#velvet-${color.replace('#', '')})`}
          stroke="none"
        />
      </svg>
    </div>
  );
};

export default RosePetal;
