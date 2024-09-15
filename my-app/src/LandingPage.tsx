import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api"; // Adjust the path as necessary
import { useParams } from 'react-router-dom';
import { Box, Button, Input, Typography, ToggleButton, ToggleButtonGroup } from "@mui/material";

const LandingPage = () => {
  const [gameCode, setGameCode] = useState<string>("");
  const [language, setLanguage] = useState<string | null>('Python'); // State for selected language
  const navigate = useNavigate();

  const createGameMutation = useMutation(api.games.createGame);
  const joinGameMutation = useMutation(api.games.joinGame); 
  
  const { player } = useParams();
  const handleCreateGame = async () => {
    try {
      // Replace these with actual logic to obtain player IDs

      const player1Id = player ?? ''; // Replace with actual player ID
      
      // Call the createGame mutation
      const newGame = await createGameMutation({player1Id});

      // Check if newGame includes the game code
      if (newGame && newGame) {
        // Navigate to the game page with the new game code
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
        // Call the mutation to join the game with the gameCode
        const result = await joinGameMutation({
          gameId: gameCode, // The game code or ID to join
          player2Id: player2Id, // Replace this with the actual player2Id (e.g., from context or state)
        });
  
        if (result) {
          // If the mutation is successful, navigate to the game page
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
        backgroundColor: '#f5f5f5', 
        padding: 4, 
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontWeight: 'bold',
          marginBottom: 4,
          textAlign: 'center',
          color: '#333',
        }}
      >
        PowerCode.
      </Typography>
      
      <Typography
        variant="h6"
        sx={{
          marginBottom: 4,
          textAlign: 'center',
          color: '#666',
        }}
      >
        Welcome to PowerCode, a game where you can put your skills to the test
        and play in a fierce one-on-one match with friends and family to decide
        who is the better programmer once and for all.
      </Typography>
      
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: 600,
          marginBottom: 4,
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
            color="secondary"
            onClick={handleJoinGame}
          >
            Join Game
          </Button>
        </Box>
        
        <Typography
        variant="h6"
        sx={{
          marginBottom: 1,
          textAlign: 'center',
          color: '#333', // Darker color for better visibility
        }}
      >
        Select your programming language:
      </Typography>
        
      <ToggleButtonGroup
          value={language}
          exclusive
          onChange={handleLanguageChange}
          aria-label="Programming Language"
          sx={{ marginBottom: 4, width: '100%' }} // Ensure full width
        >
          <ToggleButton
            value="Python"
            aria-label="Python"
            sx={{ flex: 1, textAlign: 'center' }} // Ensure equal size and centered text
          >
            Python
          </ToggleButton>
          <ToggleButton
            value="C"
            aria-label="C"
            sx={{ flex: 1, textAlign: 'center' }} // Ensure equal size and centered text
          >
            C
          </ToggleButton>
          <ToggleButton
            value="Java"
            aria-label="Java"
            sx={{ flex: 1, textAlign: 'center' }} // Ensure equal size and centered text
          >
            Java
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
};

export default LandingPage;