
import React from 'react';
import PetalTrail from '../components/PetalTrail';

const Index = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background to-secondary/20 overflow-hidden flex items-center justify-center">
      {/* Rose petal animation that follows cursor */}
      <PetalTrail />
      
      {/* Simple message */}
      <div className="text-center">
        <span className="px-6 py-3 rounded-full bg-primary/10 text-primary text-lg font-medium">
          Move your cursor to see the magic
        </span>
      </div>
    </div>
  );
};

export default Index;
