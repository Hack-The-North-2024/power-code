import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { io } from "socket.io-client";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api"; // Adjust the path as necessary
import { useParams } from "react-router-dom";
import { Box, Button, Input, Typography } from "@mui/material";

// const socket = io("http://localhost:3001");

const LandingPage = () => {
  const [gameCode, setGameCode] = useState<string>("");
  const navigate = useNavigate();

  const createGameMutation = useMutation(api.games.createGame);
  const joinGameMutation = useMutation(api.games.joinGame);

  const { player } = useParams();
  const handleCreateGame = async () => {
    try {
      // Replace these with actual logic to obtain player IDs

      const player1Id = player ?? ""; // Replace with actual player ID
      const question = "Sample Question"; // Replace with the actual question or remove if not needed

      // Call the createGame mutation
      const newGame = await createGameMutation({ player1Id, question });

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

  const handleJoinGame = async () => {
    if (gameCode) {
      try {
        const player2Id = player ?? "";
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
    <Box className="h-[100%] flex flex-col justify-evenly items-center">
      <Typography sx={{ ml: 8, mr: 8, textAlign: "center" }}>
        Welcome to PowerCode, a game where you can put your skills to the test
        and play in a fierce one-on-one match with friends and family to decide
        who is the better programmer once and for all.
      </Typography>
      <Box>
        <Button
          sx={{ marginLeft: 9, marginBottom: 1 }}
          onClick={handleCreateGame}
        >
          Create Game
        </Button>
        <Box>
          <Input
            type="text"
            value={gameCode}
            onChange={(e) => setGameCode(e.target.value)}
            placeholder="Enter game code"
          />
          <Button onClick={handleJoinGame}>Join Game</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LandingPage;
