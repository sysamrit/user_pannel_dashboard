import React, { useState } from 'react';
import '../style/circulermenu.css';

const CircularMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    console.log("Clicked")
    setIsOpen(!isOpen);
  };

  return (
    <div className="circular-menu">
      <button className="main-button" onClick={toggleMenu}>
        +
      </button>
      <div className={`buttons-container ${isOpen ? 'open' : ''}`}>
        <button className="circle-button">1</button>
        <button className="circle-button">2</button>
        <button className="circle-button">3</button>
        <button className="circle-button">4</button>
      </div>
    </div>
  );
};

export default CircularMenu;
