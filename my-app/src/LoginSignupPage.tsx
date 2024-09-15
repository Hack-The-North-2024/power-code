import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api"; // Adjust the path as necessary
import { useNavigate } from "react-router-dom";

const LoginSignupPage = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // Only used for signup
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const createPlayerMutation = useMutation(api.players.createPlayer);
  const loginPlayerMutation = useMutation(api.players.loginPlayer);

  const handleToggle = () => setIsLogin(!isLogin);

  const handleSignup = async () => {
    try {
      const score = 1000; // Default starting score for new players
      const newPlayerId = await createPlayerMutation({
        username,
        password,
        name,
        score,
      });
      console.log("Signup successful. Player ID:", newPlayerId);
      navigate(`/landing/${newPlayerId}`);
    } catch (error) {
      setError("Signup failed. Please try again.");
      console.error("Error during signup:", error);
    }
  };

  const handleLogin = async () => {
    try {
      const playerId = await loginPlayerMutation({ username, password });
      if (playerId) {
        console.log("Login successful. Player ID:", playerId);
        navigate(`/landing/${playerId}`);
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
      console.error("Error during login:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    isLogin ? handleLogin() : handleSignup();
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={!isLogin}
              placeholder="Enter your name"
            />
          </div>
        )}
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter username"
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter password"
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
      </form>
      <button onClick={handleToggle}>
        {isLogin ? "Need to create an account? Sign Up" : "Already have an account? Login"}
      </button>
    </div>
  );
};

export default LoginSignupPage;
