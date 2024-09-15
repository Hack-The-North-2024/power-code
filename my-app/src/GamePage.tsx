import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import MonacoEditor from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import { useMutation } from "convex/react";
import { query } from "../convex/_generated/server";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import axios from 'axios';

const GamePage = () => {
  const gameWinner = useMutation(api.games.gameWinner); 
  
  const [code, setCode] = useState<string>("");

  const { game } = useParams();
  const { player } = useParams();
  
  if (game){
    const checkWin = useQuery(api.games.checkWin, { gameId: game }); 
    var opponentConnected = useQuery(api.games.checkPlayersConnected, { gameId: game });
    console.log("bothPlayersConnected game page" + opponentConnected)
    if (!opponentConnected) {
      return <h1>Waiting for opponent...</h1>;
    }
    if (checkWin?.hasWinner) {
      if (checkWin.winner==player){
        return <h1>You won!</h1>;
      } else{
        return <h1>You Lost :(</h1>;
      }

    }
  }

  const submitCode = (code: string, player: string) => {
    return new Promise((resolve, reject) => {
        axios.post('https://cors-anywhere.herokuapp.com/https://power-code-047dc2136570.herokuapp.com/api/code-check/python/sum-even', {
            code: code,
            user_id: player,  // Replace with actual user ID
        }, {
            headers: {
                'Content-Type': 'application/json',
                // Add other headers if needed, such as authorization
            }
        })
        .then(response => {
            // Resolve the promise with the response data
            resolve(response.data);
        })
        .catch(error => {
            // Reject the promise with the error
            reject(error);
        });
    });
};

// Usage example
const handleSubmitCode = async () => {
    try {
        const currentPlayer = player ?? '';
        const result = await submitCode(code, currentPlayer);
        console.log(result);
    } catch (error) {
        console.error('Error submitting code:', error);
    }
};


  // const handleSubmitCode = async () => {
  //   console.log("code:", code);
  //   const winner = player ?? '';
  //   const gameId = game ?? '';

  //   try {
  //       const response = await axios.post('https://power-code-047dc2136570.herokuapp.com/api/code-check/python/sum-even', {
  //           code: code,
  //           user_id: player,  // Replace with actual user ID
  //       }, {
  //           headers: {
  //               'Content-Type': 'application/json',
  //               // Add other headers if needed, such as authorization
  //           }
  //       });

  //       console.log("Response:", response.data);

  //       if (response.data.success === 0) {
  //           await gameWinner({
  //               winner: winner,  // Set the player as the winner
  //               gameId: gameId,  // Use the actual game ID
  //           });
  //       }
  //   } catch (error) {
  //       console.error("Error submitting code:", error);
  //   }
  // };

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
