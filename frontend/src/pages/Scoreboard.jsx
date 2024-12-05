import React, { useEffect, useState } from "react";
import { fetchScores, auth } from "../firebase"; 
import { useNavigate } from "react-router-dom"; 

const Scoreboard = () => {
  const [scores, setScores] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const navigate = useNavigate(); 

  useEffect(() => {
  
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user); 
      if (user) {
        fetchUserScores();
      } else {
        setScores([]);
        setLoading(false); 
      }
    });

    return () => unsubscribe(); 
  }, []);

  const fetchUserScores = async () => {
    setLoading(true); 
    const userScores = await fetchScores();
    if (userScores) {
      const formattedScores = Object.entries(userScores).map(([attempt, details]) => ({
        attempt,
        ...details,
      }));
      setScores(formattedScores);
    }
    setLoading(false); 
  };

  const handleBackToMenu = () => {
    navigate("/gamemenu"); 
  };

  const handleBackToGame = () => {
    navigate("/game"); 
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg mt-8">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Your Scores</h2>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : !isLoggedIn ? (
        <p className="text-center text-red-500">Please log in to view your scores.</p>
      ) : scores.length === 0 ? (
        <p className="text-center text-gray-500">No scores available. Play the game to earn scores!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-200 text-gray-600 text-sm uppercase tracking-wide">
              <tr>
                <th className="px-4 py-2 text-left">Attempt</th>
                <th className="px-4 py-2 text-left">Score</th>
                <th className="px-4 py-2 text-left">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                  } hover:bg-gray-200`}
                >
                  <td className="px-4 py-2 font-medium text-gray-700">{score.attempt}</td>
                  <td className="px-4 py-2 text-gray-600">{score.score} points</td>
                  <td className="px-4 py-2 text-gray-500">{new Date(score.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 flex justify-center space-x-4">
        <button
          onClick={handleBackToMenu}
          className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
        >
          Back to Menu
        </button>
        <button
          onClick={handleBackToGame}
          className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition"
        >
          Back to Game
        </button>
      </div>
    </div>
  );
};

export default Scoreboard;
