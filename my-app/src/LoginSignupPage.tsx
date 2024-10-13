import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useNavigate } from "react-router-dom";
import NavBar from "../src/NavBar";

const LoginSignupPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const createPlayerMutation = useMutation(api.players.createPlayer);
  const loginPlayerMutation = useMutation(api.players.loginPlayer);

  const handleToggle = () => setIsLogin(!isLogin);

  const handleSignup = async () => {
    try {
      const score = 1000; 
      const newPlayerId = await createPlayerMutation({ username, password, name, score });
      navigate(`/landing/${newPlayerId}`);
    } catch (error) {
      setError("Signup failed. Please try again.");
    }
  };

  const handleLogin = async () => {
    try {
      const playerId = await loginPlayerMutation({ username, password });
      if (playerId) {
        navigate(`/landing/${playerId}`);
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    isLogin ? handleLogin() : handleSignup();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8" style={{ paddingTop: '10rem' }}>
      <NavBar />
      {/* Animated slogan */}
      <div className="slogan mb-8 p-8">
        <h1 className="text-3xl font-bold text-white animate-fadeIn">
          A 1vs1 coding duel where only the best will win!
        </h1>
      </div>


      {/* Form container */}
      <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4 flex items-center">
              <label className="w-32 text-right mr-4 font-medium bg-white text-black">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                placeholder="Enter your name"
                className="flex-1 border border-gray-300 rounded p-2 bg-white text-black"
              />
            </div>
          )}
          <div className="mb-4 flex items-center">
            <label className="w-32 text-right mr-4 font-medium text-black bg-white">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter a username"
              className="flex-1 border border-gray-300 rounded p-2 bg-white text-black"
            />
          </div>
          <div className="mb-4 flex items-center">
            <label className="w-32 text-right mr-4 font-medium text-black bg-white">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter a password"
              className="flex-1 border border-gray-300 rounded p-2 bg-white text-black"
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
          <button
            type="button"
            onClick={handleToggle}
            className="mt-4 text-blue-500 hover:underline w-full bg-white"
          >
            {isLogin
              ? 'Need to create an account? Sign Up'
              : 'Already have an account? Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginSignupPage;
