import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/b11.webp";
import logoImage from "../assets/logo1.png";
import pause from '../assets/pause.png';
import { auth, saveScore, fetchScores } from '../firebase'; 

const Game = () => {
  const [score, setScore] = useState(0);
  const [currentEquation, setCurrentEquation] = useState("");
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [timer, setTimer] = useState(15);
  const [isGameOver, setIsGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [previousScores, setPreviousScores] = useState([]);

  const navigate = useNavigate();

  
  const fetchGameData = async () => {
    try {
      const response = await fetch(
        "https://marcconrad.com/uob/banana/api.php?out=csv&base64=yes"
      );
      const data = await response.text();
      const [base64Image, solution] = data.split(",");
      setCurrentEquation({
        imageUrl: `data:image/png;base64,${base64Image}`,
        solution: parseInt(solution, 10),
      });
      generateOptions(parseInt(solution, 10));
    } catch (error) {
      console.error("Error fetching game data:", error);
    }
  };

  
  const generateOptions = (solution) => {
    const randomOffset = () => Math.floor(Math.random() * 5) + 1;
    const answers = [
      solution,
      solution + randomOffset(),
      solution - randomOffset(),
      solution + randomOffset(),
    ];
    setOptions(answers.sort(() => Math.random() - 0.5));
    setCorrectAnswer(solution);
  };

  
  useEffect(() => {
    if (timer <= 0) {
      setIsGameOver(true);
      console.log("Attempt Score:", score); 
      saveScore({ score, timestamp: Date.now() });
      return;
    }

    if (paused) return; 

    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, paused, score]);  

  useEffect(() => {
    fetchGameData();
    fetchPreviousScores(); 
  }, []);

  const fetchPreviousScores = async () => {
    const scores = await fetchScores();
    setPreviousScores(scores);
  };

  const handleAnswerSelection = (answer) => {
    if (answer === correctAnswer) {
      setScore((prevScore) => prevScore + 1);
      console.log("Correct! Score updated:", score); 
      setTimer(15); 
      fetchGameData(); 
    } else {
      alert("Wrong answer! Try again.");
    }
  };

  const handleExit = () => {
    navigate("/gamemenu");
  };

  const handleRetry = () => {
    console.log("Starting new attempt...");
    setScore(0);  
    setTimer(15); 
    setIsGameOver(false);  
    fetchGameData();  
  };

  const togglePause = () => {
    setPaused((prev) => !prev);
  };

  const handleResume = () => {
    setPaused(false);
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute top-4 right-4">
        <button onClick={togglePause} className="bg-transparent border-0 p-0">
          <img
            src={pause}
            alt="Pause"
            className="w-10 h-10 cursor-pointer"
          />
        </button>
      </div>

      <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-8 w-full max-w-lg text-center">
        <div>
          <img src={logoImage} alt="Logo" className="w-24 h-24 mx-auto mb-6" />
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Score: {score}</h2>
          <div className="text-lg font-bold text-red-600 mb-4">
            Time Remaining: {timer}s
          </div>
          {currentEquation ? (
            <div>
              <img
                src={currentEquation.imageUrl}
                alt="Equation"
                className="mx-auto mb-6 w-full max-w-[350px] h-auto object-contain rounded-lg shadow-2xl"
              />

              <div className="grid grid-cols-2 gap-4">
                {options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelection(option)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xl text-gray-500">Loading question...</p>
          )}
        </div>
      </div>

      {isGameOver && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-md w-full">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Game Over!</h2>
            <p className="text-lg text-gray-700 mb-4">Final Score: {score}</p>
            <div className="space-x-6">
              <button
                onClick={handleRetry}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
              >
                Retry
              </button>
              <button
                onClick={handleExit}
                className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {paused && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-md w-full">
            <h2 className="text-2xl font-bold text-yellow-600 mb-4">Game Paused</h2>
            <div className="space-x-6">
              <button
                onClick={handleResume}
                className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition"
              >
                Resume
              </button>
              <button
                onClick={handleExit}
                className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
