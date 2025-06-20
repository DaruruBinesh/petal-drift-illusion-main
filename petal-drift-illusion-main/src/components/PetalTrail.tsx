
import React, { useState, useEffect, useCallback, useRef } from 'react';
import RosePetal from './RosePetal';

interface PetalProps {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  delay: number;
}

const COLORS = [
  '#FFDEE2', // soft pink
  '#FDE1D3', // soft peach
  '#FEC6A1', // soft orange
  '#D946EF', // magenta
  '#F97316', // bright orange
  '#ea384c', // red
];

const PetalTrail: React.FC = () => {
  const [petals, setPetals] = useState<PetalProps[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  const petalIdRef = useRef(0);
  const lastCreationTimeRef = useRef(0);
  const isMountedRef = useRef(true);

  const cleanupPetals = useCallback(() => {
    if (!isMountedRef.current) return;
    
    const now = Date.now();
    setPetals(prev => prev.filter(petal => {
      return now - petal.id < 2500;
    }));
  }, []);

  const createPetal = useCallback(() => {
    if (!isMountedRef.current) return;
    
    const now = Date.now();
    if (now - lastCreationTimeRef.current < 50) return;
    lastCreationTimeRef.current = now;
    
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    // Increased the size range for slightly bigger petals
    const size = 12 + Math.random() * 6; // Changed from 8 + Math.random() * 4
    const rotation = Math.random() * 360;
    const delay = Math.random() * 50;
    
    const newPetal: PetalProps = {
      id: now,
      x: mousePosition.x,
      y: mousePosition.y,
      color: randomColor,
      size,
      rotation,
      delay,
    };
    
    setPetals(prev => {
      const updated = [...prev, newPetal];
      return updated.length > 30 ? updated.slice(-30) : updated;
    });
  }, [mousePosition]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isMountedRef.current) return;
    
    const lastPosition = mousePosition;
    setMousePosition({ x: e.clientX, y: e.clientY });
    
    const distance = Math.sqrt(
      Math.pow(e.clientX - lastPosition.x, 2) + 
      Math.pow(e.clientY - lastPosition.y, 2)
    );
    
    if (distance > 8) {
      createPetal();
    }
  }, [mousePosition, createPetal]);

  useEffect(() => {
    if (!isInitialized) {
      const handleFirstMove = (e: MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
        setIsInitialized(true);
        window.removeEventListener('mousemove', handleFirstMove);
      };
      
      window.addEventListener('mousemove', handleFirstMove);
      return () => {
        window.removeEventListener('mousemove', handleFirstMove);
      };
    }
  }, [isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      window.addEventListener('mousemove', handleMouseMove);
      
      const cleanupInterval = setInterval(cleanupPetals, 500);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        clearInterval(cleanupInterval);
      };
    }
  }, [isInitialized, handleMouseMove, cleanupPetals]);
  
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return (
    <>
      {petals.map((petal) => (
        <RosePetal
          key={petal.id}
          x={petal.x}
          y={petal.y}
          color={petal.color}
          size={petal.size}
          rotation={petal.rotation}
          delay={petal.delay}
        />
      ))}
    </>
  );
};

export default PetalTrail;
