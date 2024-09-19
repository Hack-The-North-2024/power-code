import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api"; // Adjust the path as necessary
import { Box, Button, Input, Typography, ToggleButton, ToggleButtonGroup } from "@mui/material";
import TypingEffect from './TypingEffect'; // Import the TypingEffect component
import logo from './assets/logo.png'
import NavBar from "../src/NavBar";

const LandingPage = () => {
  const [gameCode, setGameCode] = useState<string>("");
  const [language, setLanguage] = useState<string | null>('Python'); // State for selected language
  const navigate = useNavigate();

  const createGameMutation = useMutation(api.games.createGame);
  const joinGameMutation = useMutation(api.games.joinGame); 
  
  const { player } = useParams();

  const handleCreateGame = async () => {
    try {
      const player1Id = player ?? ''; // Replace with actual player ID
      const newGame = await createGameMutation({ player1Id });

      if (newGame && newGame) {
        navigate(`/game/${player1Id}/${newGame}`);
      } else {
        console.error("Failed to create game, no game code returned.");
      }
    } catch (error) {
      console.error("Error creating game:", error);
    }
  };

  const handleLanguageChange = (_: React.MouseEvent<HTMLElement>, newLanguage: string | null) => {
    setLanguage(newLanguage);
  };

  const handleJoinGame = async () => {
    if (gameCode) {
      try {  
        const player2Id = player ?? '';
        const result = await joinGameMutation({
          gameId: gameCode,
          player2Id: player2Id,
        });
  
        if (result) {
          navigate(`/game/${player2Id}/${gameCode}`);
        } else {
          console.error("Failed to join the game.");
        }
      } catch (error) {
        console.error("Error joining the game:", error);
      }
    } else {
      console.warn("Game code is missing.");
    }
  };

  return (
    
    <Box 
      className="h-[100%] flex flex-col justify-center items-center"
      sx={{
        backgroundColor: '#ffffff', 
        padding: 9, 
        borderRadius: '16px',
        maxWidth: '800px',
      }}
    >
      <NavBar></NavBar>
      <TypingEffect 
        text="Welcome to PowerCode, a game where you can put your skills to the test and play in a fierce one-on-one match with friends and family to decide who is the better programmer once and for all!"
      />
      
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '400px',
          marginBottom: 4,
          borderRadius: '16px',
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateGame}
          sx={{ marginBottom: 2 }}
        >
          Create Game
        </Button>
        
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 2,
            width: '100%',
          }}
        >
          <Input
            type="text"
            value={gameCode}
            onChange={(e) => setGameCode(e.target.value)}
            placeholder="Enter game code"
            sx={{ flex: 1, marginRight: 2 }}
          />
          <Button
            variant="contained"
            onClick={handleJoinGame}
            sx={{
              backgroundColor: '#ffaa64',
              color: 'white', // Change text color if needed
              '&:hover': {
                backgroundColor: '#e09e4c', // Optional: change color on hover
              },
            }}
          >
            Join Game
          </Button>
        </Box>
        
        <Typography
          variant="h6"
          sx={{
            marginBottom: 1,
            textAlign: 'center',
            color: '#333',
          }}
        >
          Select your programming language:
        </Typography>
        
        <ToggleButtonGroup
          value={language}
          exclusive
          onChange={handleLanguageChange}
          aria-label="Programming Language"
          sx={{ marginBottom: 4, width: '100%' }}
        >
          <ToggleButton
            value="Python"
            aria-label="Python"
            sx={{ flex: 1, textAlign: 'center' }}
          >
            Python
          </ToggleButton>
          <ToggleButton
            value="C"
            aria-label="C"
            sx={{ flex: 1, textAlign: 'center' }}
          >
            C
          </ToggleButton>
          <ToggleButton
            value="Java"
            aria-label="Java"
            sx={{ flex: 1, textAlign: 'center' }}
          >
            Java
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
};

export default LandingPage;
