import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jungleBackground from '../assets/ban3.png';
import logo from '../assets/logo1.png';
import { auth, db, signInWithEmailAndPassword, doc, getDoc } from '../firebase'; 
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
    if (savedPassword) {
      setPassword(savedPassword);
    }
  }, []);

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in both email and password');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const username = userData.username;

        localStorage.setItem('username', username);

        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
          localStorage.setItem('rememberedPassword', password);
        } else {
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberedPassword');
        }

        toast.success('Logged in successfully!');
        navigate('/gamemenu'); 
      } else {
        toast.error('No user document found!');
      }
    } catch (error) {
      console.error('Login error:', error.message);
      toast.error('Login failed. Please check your credentials!');
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${jungleBackground})` }}
    >
      <div className="relative flex flex-col items-start w-1/2 max-w-md bg-white bg-opacity-80 p-8 rounded-lg shadow-lg space-y-4">
        <img
          src={logo}
          alt="Logo"
          onClick={() => navigate('/')}
          className="absolute top-4 right-4 w-12 h-12 cursor-pointer hover:opacity-80 transition-opacity duration-200"
        />

        <h1 className="text-4xl font-bold text-yellow-500 mb-2">Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={handleRememberMeChange}
            className="mr-2"
          />
          <label className="text-gray-600 text-sm">Remember Me</label>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-yellow-500 text-white text-lg font-semibold rounded-md hover:bg-yellow-600 transition-colors duration-200"
        >
          Login
        </button>

        <p className="text-sm text-gray-600 mt-4">
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/signup')}
            className="text-yellow-500 font-semibold cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
