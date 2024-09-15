import { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import { useMutation } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import axios from 'axios';


interface ApiResponse {
  success: number;
  data?: any; // Replace `any` with the actual type if you know it
  // Add other fields as needed
  error?: string;
  description?: string;
}

interface FunctionDetails {
  id: string;
  name: string;
  description: string;
  numberOfArgs: number;
  difficulty: number;
}


const functions = [
  {
    id: "sum-even",
    name: "Even Sum",
    description: "Sum even pairs. Example: For input [1, 2, 3, 4], output is 6 (sum of 2 and 4).",
    numberOfArgs: 1,
    difficulty: 2
  },
  {
    id: "power",
    name: "Power",
    description: "Find the result of a number to the power of another number. Example: For input [2, 3], output is 8 (2^3).",
    numberOfArgs: 1,
    difficulty: 1
  },
  {
    id: "multiple-of-three",
    name: "Multiple of Three",
    description: "Check if a number is a multiple of three or not. Example: For input 9, output is true; for input 10, output is false.",
    numberOfArgs: 1,
    difficulty: 1
  },
  {
    id: "palindrome",
    name: "Palindrome",
    description: "Check if a string is a palindrome or not. Example: For input 'radar', output is true; for input 'hello', output is false.",
    numberOfArgs: 1,
    difficulty: 2
  },
  {
    id: "check-character",
    name: "Check character",
    description: "Check if a character is a vowel or not. Example: For input 'a', output is true; for input 'b', output is false.",
    numberOfArgs: 1,
    difficulty: 1
  },
  {
    id: "prime",
    name: "Prime",
    description: "Check if a number is prime or not. Example: For input 7, output is true; for input 9, output is false.",
    numberOfArgs: 1,
    difficulty: 1
  },
  {
    id: "greater-number",
    name: "Greater Number",
    description: "Find the greater number between two values. Example: For input [3, 5], output is 5.",
    numberOfArgs: 1,
    difficulty: 1
  },
  {
    id: "capitalize-first-letter",
    name: "Capitalize First Letter",
    description: "Capitalize the first letter of a word. Example: For input 'hello', output is 'Hello'.",
    numberOfArgs: 1,
    difficulty: 1
  },
  {
    id: "contains-a",
    name: "Contains a",
    description: "Check if a string contains the letter 'a'. Example: For input 'apple', output is true; for input 'banana', output is true; for input 'berry', output is false.",
    numberOfArgs: 1,
    difficulty: 1
  },
  {
    id: "even-or-odd",
    name: "Even or Odd",
    description: "Check if a number is even or odd. Example: For input 4, output is 'even'; for input 7, output is 'odd'.",
    numberOfArgs: 1,
    difficulty: 1
  }
];

function getFunctionById(id: string): FunctionDetails | null {
  const func = functions.find(func => func.id === id);
  return func ?? null;
}

const getRandomFunction = () => {
  const randomIndex = Math.floor(Math.random() * functions.length);
  return functions[randomIndex];
};
let selectedFunction: FunctionDetails | null = null;

const GamePage = () => {
  const gameWinner = useMutation(api.games.gameWinner); 
  const gameQuestion = useMutation(api.games.gameQuestion); 
  
  const [code, setCode] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { game } = useParams();
  const { player } = useParams();
  
  if (game){
    const checkWin = useQuery(api.games.checkWin, { gameId: game }); 
    const checkQuestion = useQuery(api.games.checkQuestion, { gameId: game }); 
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
    if (checkQuestion?.hasQuestion){
      const currentQuestion = checkQuestion.question ?? '';
      selectedFunction = getFunctionById(currentQuestion)
    } else{
      selectedFunction = getRandomFunction();
       gameQuestion({
          question: selectedFunction.id,  // Set the player as the winner
          gameId: game,  // Use the actual game ID
      });
    }
  }

  const submitCode = (code: string, player: string): Promise<ApiResponse> => {
    if (!selectedFunction) {
      return Promise.reject(new Error("No function selected"));
    }
    return new Promise((resolve, reject) => {
      var url =""
        if (selectedFunction){
          url='https://power-code-047dc2136570.herokuapp.com/api/code-check/python/'+selectedFunction.id
        } 
        axios.post(url, {
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
        const gameId = game ?? '';
        const result: ApiResponse = await submitCode(code, currentPlayer);
        console.log(result);
        if (result.success === 0) {
            await gameWinner({
                winner: currentPlayer,  // Set the player as the winner
                gameId: gameId,  // Use the actual game ID
            });
        }
        else if(result.success === 1){
          setErrorMessage("Correct Syntax But fails test cases.");
        }
        else if(result.success>2){
          setErrorMessage(".\n"+result.error+"\n"+result.description);
        }
        else{
          setErrorMessage("Submission failed or the code is incorrect.");
        }
    } catch (error) {
        console.error('Error submitting code:', error);
    }
};
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      {selectedFunction ? (
        <>
          <h2>{selectedFunction.name}</h2>
          <h2>{selectedFunction.description}</h2>
        </>
      ) : (
        <h2>Loading function details...</h2>
      )}
      <MonacoEditor
        height="400px"
        width="400px"
        language="python"
        value={code}
        theme="vs-dark"
        onChange={(newCode) => setCode(newCode || "")}
      />
      <button onClick={handleSubmitCode}>Submit Code</button>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
    </div>
  );
};

export default GamePage;
