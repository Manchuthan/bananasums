import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jungleBackground from '../assets/ban3.png';
import logo from '../assets/logo1.png';
import { auth, db, createUserWithEmailAndPassword, setDoc, doc } from '../firebase'; 
import { toast } from 'react-toastify';

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleAgreeToTermsChange = () => {
    setAgreeToTerms(!agreeToTerms);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreeToTerms) {
      toast.error('You must agree to the terms and conditions');
      return;
    }

    try {
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: email,
      });

      toast.success('Account created successfully!');
      navigate('/login'); 
    } catch (error) {
      console.error('Error signing up:', error.message);
      toast.error('Signup failed. Please try again!');
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

        <h1 className="text-4xl font-bold text-yellow-500 mb-2">Sign Up</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
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
              checked={agreeToTerms}
              onChange={handleAgreeToTermsChange}
              className="mr-2"
            />
            <label className="text-gray-600 text-sm">I agree to the terms and conditions</label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-yellow-500 text-white text-lg font-semibold rounded-md hover:bg-yellow-600 transition-colors duration-200"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            className="text-yellow-500 font-semibold cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
