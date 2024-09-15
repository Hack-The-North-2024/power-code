import { useState, useEffect  } from "react";
import MonacoEditor from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import { useMutation } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import axios from 'axios';
import { Button, Grid, Typography, Alert, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface ApiResponse {
  success: number;
  data?: any;
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

const buttonStyle = {
  marginTop: '20px',
  padding: '10px 20px',
  fontSize: '1rem',
  color: '#fff',
  backgroundColor: '#007bff', // Blue color
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

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
  return functions.find(func => func.id === id) ?? null;
}

const getRandomFunction = () => {
  const randomIndex = Math.floor(Math.random() * functions.length);
  return functions[randomIndex];
};
let selectedFunction: FunctionDetails | null = null;

const GamePage = () => {
  const gameWinner = useMutation(api.games.gameWinner);
  const gameQuestion = useMutation(api.games.gameQuestion);
  const navigate = useNavigate();
  
  const [code, setCode] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [dots, setDots] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { game, player } = useParams();
  if (game) {
    const checkWin = useQuery(api.games.checkWin, { gameId: game }); 
    const checkQuestion = useQuery(api.games.checkQuestion, { gameId: game }); 
    var opponentConnected = useQuery(api.games.checkPlayersConnected, { gameId: game });
    console.log("bothPlayersConnected game page" + opponentConnected)
    useEffect(() => {
      const interval = setInterval(() => {
        setDots((prevDots) => (prevDots.length < 3 ? prevDots + "." : ""));
      }, 500); // Adjust the speed as needed
      return () => clearInterval(interval); // Clean up on unmount
    }, []); // Empty dependency array to run effect only once on mount

    // Conditional rendering based on opponentConnected
    if (!opponentConnected) {
      return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h1 style={{ fontSize: "2rem" }}>Waiting for opponent{dots}</h1>
          <h2 style={{ marginTop: "40px", fontSize: "1.5rem", color: "#ff7f00" }}>
            Game Code:
            <br />
            <span style={{ fontWeight: "bold" }}>{game}</span>
          </h2>
        </div>
      );
      return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h1 style={{ fontSize: "2rem" }}>Waiting for opponent{dots}</h1>
          <h2 style={{ marginTop: "40px", fontSize: "1.5rem", color: "#ff7f00" }}>
            Game Code:
            <br />
            <span style={{ fontWeight: "bold" }}>{game}</span>
          </h2>
        </div>
      );
    }

    const handleGoToLanding = () => {
      navigate(`/landing/${player}`);
    };

    if (checkWin?.hasWinner) {
      return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          {checkWin?.winner === player ? (
            <div>
              <h1>You won!</h1>
              <button onClick={handleGoToLanding} style={buttonStyle}>Go to Landing Page</button>
            </div>
          ) : (
            <div>
              <h1>You Lost :(</h1>
              <button onClick={handleGoToLanding} style={buttonStyle}>Go to Landing Page</button>
            </div>
          )}
        </div>
      );
      return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          {checkWin?.winner === player ? (
            <div>
              <h1>You won!</h1>
              <button onClick={handleGoToLanding} style={buttonStyle}>Go to Landing Page</button>
            </div>
          ) : (
            <div>
              <h1>You Lost :(</h1>
              <button onClick={handleGoToLanding} style={buttonStyle}>Go to Landing Page</button>
            </div>
          )}
        </div>
      );
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

  const submitCode = async (code: string, player: string): Promise<ApiResponse> => {
    if (!selectedFunction) {
      throw new Error("No function selected");
    }

    const url = `https://power-code-047dc2136570.herokuapp.com/api/code-check/python/${selectedFunction.id}`;

    try {
      const response = await axios.post(url, { code, user_id: player });
      return response.data;
    } catch (error) {
      throw new Error("Error submitting code");
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setErrorMessage("");
    
    try {
      const currentPlayer = player ?? '';
      const gameId = game ?? '';
      const result = await submitCode(code, currentPlayer);
      
      if (result.success === 0) {
        await gameWinner({ winner: currentPlayer, gameId });
      } else if (result.success === 1) {
        setErrorMessage("Correct Syntax, but it fails test cases.");
      } else if (result.success > 2) {
        setErrorMessage(`${result.error}: ${result.description}`);
      } else {
        setErrorMessage("Submission failed or the code is incorrect.");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container direction="column" alignItems="center" justifyContent="center" style={{ width: '100vh', height: '100vh', padding: '20px' }}>
      {selectedFunction ? (
        <>
          <Typography variant="h4">{selectedFunction.name}</Typography>
          <Typography variant="subtitle1">{selectedFunction.description}</Typography>
        </>
      ) : (
        <Typography variant="h4">Loading function details...</Typography>
      )}

      <MonacoEditor
        height="60%"
        defaultValue="def solution(inp):"
        width="100%"
        language="python"
        value={code}
        theme="vs-dark"
        onChange={(newCode) => setCode(newCode || "")}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmitCode}
        disabled={loading}
        style={{ marginTop: '20px' }}
      >
        {loading ? <CircularProgress size={24} /> : "Submit Code"}
      </Button>

      {errorMessage && (
        <Alert severity="error" style={{ marginTop: '20px', width: '600px' }}>
          {errorMessage}
        </Alert>
      )}
    </Grid>
  );
};

export default GamePage;
