import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAsGuest } from '../firebase';
import jungleBackground from '../assets/jungle-background.png';
import logo from '../assets/logo1.png';
import Button from "../componets/Button";
import { CSSTransition } from 'react-transition-group'; 

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      await loginAsGuest(); 
      navigate('/gamemenu'); 
    } catch (error) {
      console.error("Guest login failed:", error.message);
      alert("Unable to log in as a guest. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      setShowInstructions(false); 
    }
  };

  return (
    <div
      className="flex flex-col items-center h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${jungleBackground})`,
      }}
    >
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-70"></div>

      
      <div className="flex flex-row items-center space-x-4 mt-12 p-4 z-10">
        <img src={logo} alt="Logo" className="w-24 h-24" />
        <h1
          className="text-6xl font-extrabold text-yellow-400 p-4 border-4 border-yellow-500 rounded-md transform -rotate-3"
          style={{
            fontFamily: 'Comic Sans MS, sans-serif',
            textShadow: '3px 3px 6px rgba(0, 0, 0, 0.4)',
          }}
        >
          Banana Sums
        </h1>
      </div>

      
      <div className="flex flex-col items-center justify-center flex-grow space-y-6 mt-8 z-10">
        <Button
          text="Login"
          onClick={() => navigate('/login')}
          className="w-full max-w-lg py-6 text-2xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-2xl hover:scale-105 transition-all duration-300"
        />
        <Button
          text="Signup"
          onClick={() => navigate('/signup')}
          className="w-full max-w-lg py-6 text-2xl bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-2xl hover:scale-105 transition-all duration-300"
        />
        <Button
          text={loading ? "Loading..." : "Guest"}
          onClick={handleGuestLogin}
          disabled={loading}
          className={`w-full max-w-lg py-6 text-2xl ${loading ? 'opacity-50 cursor-not-allowed' : 'bg-gradient-to-r from-green-400 to-green-600 text-white rounded-2xl hover:scale-105 transition-all duration-300'}`}
        />
        
        <Button
          text="Instructions"
          onClick={toggleInstructions}
          className="w-full max-w-lg py-6 text-2xl bg-gradient-to-r from-pink-400 to-pink-600 text-white rounded-2xl hover:scale-105 transition-all duration-300"
        />
      </div>

      
      <CSSTransition
        in={showInstructions}
        timeout={300}
        classNames="modal"
        unmountOnExit
      >
        <div
          className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20"
          onClick={handleOutsideClick}
        >
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <h2 className="text-3xl font-bold text-center mb-4">Game Instructions</h2>
            <p className="text-lg mb-4">Here are the instructions to play the game:</p>
            <ul className="list-disc pl-5 mb-6 text-lg">
               <li>To play the game, you can log in with your account by clicking the "Login" button, or you can play as a guest by clicking the "Guest" button. No account required for guest play.</li>
              <li>If you sign up for an account, you'll be able to track your progress and save your scores across multiple sessions.</li>
              <li>To get started, just click one of the buttons at the homepage: "Login", "Signup", or "Guest".</li>
              <li>Once logged in, you will be taken to the game menu, where you can start playing.</li>
              <li>Click "New Game" to start a new game session.</li>
              <li>Your goal is to solve math puzzles and score as many points as you can.</li>
              <li>Use the timer to keep track of your time during each round.</li>
              <li>You can view your score on the scoreboard after each game session.</li>
              
            </ul>
            <div className="flex justify-center">
              <Button
                text="Close"
                onClick={toggleInstructions}
                className="py-2 px-6 bg-red-500 text-white rounded-md hover:bg-red-700 transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </CSSTransition>
    </div>
  );
};

export default Home;
