import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import MonacoEditor from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import { useMutation } from "convex/react";
import { query } from "../convex/_generated/server";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

const socket = io("http://localhost:3001");

const GamePage = () => {
  const gameWinner = useMutation(api.games.gameWinner); 
  const [code, setCode] = useState<string>("");

  const { game } = useParams();
  const { player } = useParams();
  
  if (game){
    var opponentConnected = useQuery(api.games.checkPlayersConnected, { gameId: game });
    console.log("bothPlayersConnected game page" + opponentConnected)
    if (!opponentConnected) {
      return <h1>Waiting for opponent...</h1>;
    }
  }

  const handleSubmitCode = () => {
    console.log("code:" + code)
    // const gameW =  await gameWinner({
    //   gameId: game, // The game code or ID to join
    //   player2Id: player2Id, // Replace this with the actual player2Id (e.g., from context or state)
    // });
    socket.emit("submitCode", code);
  };

  return (
    <div>
      <h2>{game}</h2>
      <MonacoEditor
        height="400px"
        width="400px"
        language="python"
        value={code}
        theme="vs-dark"
        onChange={(newCode) => setCode(newCode || "")}
      />
      <button onClick={handleSubmitCode}>Submit Code</button>
    </div>
  );
};

export default GamePage;
