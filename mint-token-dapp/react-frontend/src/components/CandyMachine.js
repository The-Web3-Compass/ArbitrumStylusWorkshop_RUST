import React, { useState, useEffect } from 'react';

const CandyMachine = ({ isDeploying }) => {
  const [candies, setCandies] = useState([]);
  
  // Generate random color for candy
  const getRandomColor = () => {
    const colors = ['#ff85a2', '#7ed6df', '#ffbe76', '#badc58', '#f9ca24', '#686de0'];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  // Add candy animation when deploying
  useEffect(() => {
    if (isDeploying) {
      const interval = setInterval(() => {
        const newCandy = {
          id: Date.now(),
          color: getRandomColor(),
          left: Math.random() * 240 + 30, // Random position within machine
        };
        
        setCandies(prev => [...prev, newCandy]);
        
        // Remove candy after animation completes
        setTimeout(() => {
          setCandies(prev => prev.filter(candy => candy.id !== newCandy.id));
        }, 1000);
      }, 300);
      
      return () => clearInterval(interval);
    }
  }, [isDeploying]);
  
  return (
    <div className="candy-machine">
      <div className="machine-top">
        <div className="machine-dome"></div>
      </div>
      <div className="machine-body">
        {candies.map(candy => (
          <div
            key={candy.id}
            className="candy"
            style={{
              backgroundColor: candy.color,
              left: `${candy.left}px`,
            }}
          ></div>
        ))}
        <div className="machine-slot"></div>
        <div className="machine-knob"></div>
      </div>
      <div className="machine-base"></div>
    </div>
  );
};

export default CandyMachine;
