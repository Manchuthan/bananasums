import React from 'react';

const Button = ({ text, onClick }) => (
  <button
    onClick={onClick}
    className="w-48 py-4 bg-white bg-opacity-80 text-gray-800 text-xl font-semibold rounded-full shadow-md hover:bg-opacity-90 transition-opacity duration-200"
    style={{
      fontFamily: 'Comic Sans MS, sans-serif',
      backdropFilter: 'blur(10px)', 
    }}
  >
    {text}
  </button>
);

export default Button;
