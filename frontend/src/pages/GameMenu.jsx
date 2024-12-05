import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';  
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import jungleBackground from '../assets/ban3.png';
import logo from '../assets/logo1.png';
import { saveScore } from '../firebase';  

const GameMenu = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [guestScores, setGuestScores] = useState([]);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    console.log("Stored Username from localStorage:", storedUsername);

    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      const auth = getAuth();
      const user = auth.currentUser;
      console.log("Current Firebase user:", user);

      if (user) {
        const db = getFirestore();
        const userRef = doc(db, 'users', user.uid);

        getDoc(userRef).then((docSnap) => {
          if (docSnap.exists()) {
            const fetchedUsername = docSnap.data().username;
            console.log("Fetched Username from Firestore:", fetchedUsername);
            setUsername(fetchedUsername);
            localStorage.setItem('username', fetchedUsername);
          } else {
            const fallbackUsername = user.email.split('@')[0];
            console.log("Fallback Username:", fallbackUsername);
            setUsername(fallbackUsername);
            localStorage.setItem('username', fallbackUsername);
          }
        }).catch((error) => {
          console.error("Error fetching username:", error);
          setIsGuest(true);
          setUsername('Guest');
        });
      } else {
        setIsGuest(true);
        setUsername('Guest');
      }
    }

    
    const storedGuestScores = JSON.parse(localStorage.getItem('guestScores')) || [];
    setGuestScores(storedGuestScores);
  }, []);

  const buttons = [
    { label: 'New Game', path: '/Game' },
    { label: 'Score Board', path: '/score-board' },
  ];

  const handleExit = () => {
    navigate('/');
  };

  
  const saveGuestScore = (score) => {
    saveScore(score);  
    setGuestScores((prevScores) => [...prevScores, score]);  
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-no-repeat bg-center bg-fixed"
      style={{
        backgroundImage: `url(${jungleBackground})`,
        backgroundSize: 'cover',
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <img src={logo} alt="Game Logo" className="absolute top-4 left-4 w-32 h-auto z-10" />

      <div className="absolute top-20 text-white text-xl font-semibold z-10">
        Welcome, {username || 'Guest'}
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 p-4 z-10">
        <h1 className="text-white text-4xl font-bold mb-6">Game Menu</h1>

        <div className="flex flex-col space-y-4 w-full max-w-lg">
          {buttons.map(({ label, path }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="bg-white bg-opacity-80 text-gray-700 font-semibold py-6 px-6 rounded-2xl hover:bg-opacity-90 transition w-full text-2xl"
            >
              {label}
            </button>
          ))}
          <button
            onClick={handleExit}
            className="bg-white bg-opacity-80 text-gray-700 font-semibold py-6 px-6 rounded-2xl hover:bg-white transition w-full text-2xl"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameMenu;
