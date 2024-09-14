import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api"; // Adjust the path as necessary

const socket = io("http://localhost:3001");

const LandingPage = () => {
  const [gameCode, setGameCode] = useState<string>("");
  const navigate = useNavigate();

  const createGameMutation = useMutation(api.games.createGame);

  const handleCreateGame = async () => {
    try {
      // Replace these with actual logic to obtain player IDs
      const player1Id = "player1-id"; // Replace with actual player ID
      const player2Id = "player2-id"; // Replace with actual player ID
      const question = "Sample Question"; // Replace with the actual question or remove if not needed
      
      // Call the createGame mutation
      const newGame = await createGameMutation({ player1Id, player2Id, question });

      // Check if newGame includes the game code
      if (newGame && newGame) {
        // Navigate to the game page with the new game code
        navigate(`/game/${newGame}`);
      } else {
        console.error("Failed to create game, no game code returned.");
      }
    } catch (error) {
      console.error("Error creating game:", error);
    }
  };

  const handleJoinGame = () => {
    if (gameCode) {
      navigate(`/game/${gameCode}`);
    }
  };

  return (
    <div>
      <h1>Welcome to the 1 vs 1 Coding Game</h1>
      <button onClick={handleCreateGame}>Create Game</button>
      <div>
        <input
          type="text"
          value={gameCode}
          onChange={(e) => setGameCode(e.target.value)}
          placeholder="Enter game code"
        />
        <button onClick={handleJoinGame}>Join Game</button>
      </div>
    </div>
  );
};

export default LandingPage;
