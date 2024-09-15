import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api"; // Adjust the path as necessary
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Typography,
} from "@mui/material";

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
    if (isLogin) handleLogin();
    else handleSignup();
  };

  return (
    <Box className="auth-container h-[100%] flex flex-col justify-center items-center">
      <Typography sx={{ paddingBottom: 3 }} variant="h4">
        {isLogin ? "Login" : "Sign Up"}
      </Typography>
      <FormControl onSubmit={handleSubmit}>
        {!isLogin && (
          <Box>
            <FormLabel>Name </FormLabel>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={!isLogin}
              placeholder="Enter your name"
            />
          </Box>
        )}
        <Box>
          <FormLabel>Username </FormLabel>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter a username"
          />
        </Box>
        <Box>
          <FormLabel>Password </FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter a password"
          />
        </Box>
        {error && <p className="error">{error}</p>}
        <Button sx={{ paddingTop: 3 }} type="submit">
          {isLogin ? "Login" : "Sign Up"}
        </Button>
        <Button onClick={handleToggle}>
          {isLogin
            ? "Need to create an account? Sign Up"
            : "Already have an account? Login"}
        </Button>
      </FormControl>
    </Box>
  );
};

export default LoginSignupPage;
