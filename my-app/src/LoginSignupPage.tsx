import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api"; // Adjust the path as necessary
import { useNavigate } from "react-router-dom";
import { Box, Button, Input, Typography, FormControl, FormLabel } from "@mui/material";

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
    <Box
      className="auth-container h-[100%] flex flex-col justify-center items-center"
      sx={{
        border: '1px dashed #ccc', // Light gray border for contrast
        backgroundColor: '#f5f5f5', // Light background for better readability
        borderRadius: '8px', // Rounded corners
        padding: 4, // Add some padding
      }}
    >
      <Typography
        sx={{ paddingBottom: 3, color: '#333' }} // Darker text color for better readability
        variant="h4"
      >
        {isLogin ? 'Login' : 'Sign Up'}
      </Typography>
      <FormControl
        component="form" // Ensure the FormControl is treated as a form
        onSubmit={handleSubmit}
        sx={{ width: '100%', maxWidth: '600px' }} // Restrict width for better layout
      >
        {!isLogin && (
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
            <FormLabel sx={{ width: '150px', marginRight: 2 }}>Name</FormLabel>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={!isLogin}
              placeholder="Enter your name"
              sx={{ flex: 1 }} // Allow the input to take up remaining space
            />
          </Box>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
          <FormLabel sx={{ width: '150px', marginRight: 2 }}>Username</FormLabel>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter a username"
            sx={{ flex: 1 }} // Allow the input to take up remaining space
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
          <FormLabel sx={{ width: '150px', marginRight: 2 }}>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter a password"
            sx={{ flex: 1 }} // Allow the input to take up remaining space
          />
        </Box>
        {error && <Typography sx={{ color: 'red', marginBottom: 2 }}>{error}</Typography>}
        <Button
          sx={{ marginTop: 2, backgroundColor: '#007bff', color: '#fff', '&:hover': { backgroundColor: '#0056b3' } }}
          type="submit"
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </Button>
        <Button
          sx={{ marginTop: 2, color: '#007bff', '&:hover': { textDecoration: 'underline' } }}
          onClick={handleToggle}
        >
          {isLogin
            ? 'Need to create an account? Sign Up'
            : 'Already have an account? Login'}
        </Button>
      </FormControl>
    </Box>
  ); 
};

export default LoginSignupPage;