import React from 'react';

const Input = ({ placeholder, type = "text" }) => (
  <input type={type} placeholder={placeholder} className="border p-2 rounded w-full mb-2"/>
);

export default Input;
