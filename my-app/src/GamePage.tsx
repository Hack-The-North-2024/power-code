import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import MonacoEditor from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import { query } from "../convex/_generated/server";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

const socket = io("http://localhost:3001");

const GamePage = () => {
  const [code, setCode] = useState<string>("");

  const { game } = useParams();
  
  if (game){
    var opponentConnected = useQuery(api.games.checkPlayersConnected, { gameId: game });
    console.log("bothPlayersConnected game page" + opponentConnected)
    if (!opponentConnected) {
      return <h1>Waiting for opponent...</h1>;
    }
  }

  const handleSubmitCode = () => {
    socket.emit("submitCode", code);
  };

  return (
    <div>
      <h2>{game}</h2>
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
