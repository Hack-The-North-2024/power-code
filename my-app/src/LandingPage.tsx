import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api"; // Adjust the path as necessary
import { useParams } from 'react-router-dom';

const LandingPage = () => {
  const [gameCode, setGameCode] = useState<string>("");
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

  const handleLanguageChange = (event: React.MouseEvent<HTMLElement>, newLanguage: string | null) => {
    setLanguage(newLanguage);
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
