import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import MonacoEditor from "@monaco-editor/react";
import { useParams } from "react-router-dom";

const socket = io("http://localhost:3001");

const GamePage = () => {
  const { gameCode } = useParams(); // Retrieve the game code from the URL
  const [code, setCode] = useState<string>("");
  const [player, setPlayer] = useState<string | null>(null);
  const [opponentConnected, setOpponentConnected] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // When the component mounts, join the game
    socket.emit("joinGame", gameCode);

    // Listen for player status updates
    socket.on("playerStatus", (data: { player: string; opponentConnected: boolean }) => {
      setPlayer(data.player);
      setOpponentConnected(data.opponentConnected);
    });

    // Listen for game over events
    socket.on("gameOver", (data: { winner: string }) => {
      setGameOver(true);
      setWinner(data.winner);
    });

    // Listen for game full errors
    socket.on("gameFull", (message: string) => {
      setError(message);
    });

    // Cleanup on unmount
    return () => {
      socket.off("playerStatus");
      socket.off("gameOver");
      socket.off("gameFull");
    };
  }, [gameCode]);

  // Handle code submission
  const handleSubmitCode = () => {
    socket.emit("submitCode", { gameCode, code });
  };

  if (error) {
    return <h1>{error}</h1>;
  }

  if (gameOver) {
    return (
      <div>
        <h1>{winner === socket.id ? "You win!" : "You lose!"}</h1>
      </div>
    );
  }

  if (!opponentConnected) {
    return <h1>Waiting for opponent...</h1>;
  }

  return (
    <div>
      <h2>{player}</h2>
      <MonacoEditor
        height="400px"
        width="400px"
        language="javascript"
        value={code}
        theme="vs-dark"
        onChange={(newCode) => setCode(newCode || "")}
      />
      <button onClick={handleSubmitCode}>Submit Code</button>
    </div>
  );
};

export default GamePage;
