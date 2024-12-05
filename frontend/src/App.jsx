import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import GameMenu from './pages/GameMenu';
import Game from './pages/Game';
import Scoreboard from './pages/Scoreboard';
import { UserProvider } from './context/UserContext';

const App = () => (
  <UserProvider> 
    <Router>
      <ToastContainer /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/gamemenu" element={<GameMenu />} />
        <Route path="/game" element={<Game />} />
        <Route path="/score-board" element={<Scoreboard/>} />
        
      </Routes>
    </Router>
  </UserProvider>
);

export default App;
