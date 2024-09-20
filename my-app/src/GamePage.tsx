import { useState, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import { useMutation } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import NavBar from "../src/NavBar";
import './index.css';
import Confetti from 'react-confetti';

interface ApiResponse {
  success: number;
  data?: any; // Replace `any` with the actual type if you know it
  // Add other fields as needed
  error?: string;
  description?: string;
}

interface TestCase {
  success: number;
  input: number[] | string | number;
  solution: number[] | string | number | boolean;
  returned: number;
  error: string;
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
  const navigate = useNavigate();
  const gameWinner = useMutation(api.games.gameWinner); 
  const gameQuestion = useMutation(api.games.gameQuestion); 
  
  const [code, setCode] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [dots, setDots] = useState<string>("");

  const { game } = useParams();
  const { player } = useParams();
  
  if (game){
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
        <div className="min-h-screen flex flex-col items-center justify-start py-8" style={{ paddingTop: '10rem' }}>
          <NavBar></NavBar>
          <div 
            style={{ 
              textAlign: "center", 
              marginTop: "50px", 
              backgroundColor: "white", 
              borderRadius: "10px", 
              padding: "140px", 
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" 
            }}
          >
            <h1 style={{ fontSize: "2rem" }}>Waiting for opponent{dots}</h1>
            <h2 style={{ marginTop: "40px", fontSize: "1.5rem", color: "#ff7f00" }}>
              Game Code:
              <br />
              <span style={{ fontWeight: "bold" }}>{game}</span>
            </h2>
          </div>
        </div>


      );
    }
    const handleGoToLanding = () => {
      navigate(`/landing/${player}`);
    };

    if (checkWin?.hasWinner) {
      return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <NavBar></NavBar>
          {checkWin?.winner === player ? (
            <div style={{ textAlign: 'center', marginBottom: '20px', padding: '300px'}}>
              <Confetti
              />
              <h1>You won!</h1>
              <button onClick={handleGoToLanding} style={buttonStyle}>
                Go to Landing Page
              </button>
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
        // Player wins the game
        await gameWinner({
            winner: currentPlayer,
            gameId: gameId,
        });
      } else if (result.success === 1) {
          const failedCases = (result.data as TestCase[]) // Cast to TestCase[]
              .filter(testCase => testCase.success === 1 || testCase.success === 2) // Filter failed test cases
              .map(testCase => {
                // Determine how to format the input based on its type
                let inputStr: string;
                if (Array.isArray(testCase.input)) {
                  inputStr = `[${testCase.input.join(", ")}]`; // Format array as comma-separated
                } else if (typeof testCase.input === 'string') {
                  inputStr = `"${testCase.input}"`; // Wrap string inputs in quotes
                } else if (typeof testCase.input === 'number') {
                  inputStr = testCase.input.toString(); // Convert number to string
                } else {
                  inputStr = "Unknown input type"; // Fallback case
                }
            
                // Determine how to format the solution based on its type
                let solutionStr: string;
                if (Array.isArray(testCase.solution)) {
                  solutionStr = `[${testCase.solution.join(", ")}]`; // Format array as comma-separated
                } else if (typeof testCase.solution === 'string') {
                  solutionStr = `"${testCase.solution}"`; // Wrap string solutions in quotes
                } else if (typeof testCase.solution === 'number') {
                  solutionStr = testCase.solution.toString(); // Convert number to string
                } else if (typeof testCase.solution === 'boolean') {
                  solutionStr = testCase.solution ? "true" : "false"; // Handle boolean values
                } else {
                  solutionStr = "Unknown solution type"; // Fallback case
                }
            
                // Format and return the string for each test case
                return `Input: ${inputStr} - Expected: ${solutionStr}, Returned: ${testCase.returned}, Error: ${testCase.error} |`;
              })
              .join("\n"); // Join the details with new lines
          console.log(failedCases)
          setErrorMessage(`Correct syntax but fails test cases:\n${failedCases}`);
      } else if (result.success > 1) {
          setErrorMessage(`${result.error}\n${result.description}`);
      } else {
          setErrorMessage("Submission failed or the code is incorrect.");
      }
      
    } catch (error) {
        console.error('Error submitting code:', error);
    }
};
  
  return (
    <div className="wrapper" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5', 
      padding: '20px',
      marginTop:'120px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', 
      borderRadius: '20px', // Rounded corners
    }}>
      <NavBar />
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        {selectedFunction ? (
          <>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>{selectedFunction.name}</h2>
            <p style={{ fontSize: '18px', color: '#666', margin: '10px 0' }}>{selectedFunction.description}</p>
          </>
        ) : (
          <h2 style={{ color: '#999' }}>Loading function details...</h2>
        )}
      </div>
      <MonacoEditor
        height="300px"
        width="500px"
        language="python"
        value={code}
        defaultValue="def solution(inp):"
        theme="vs-dark"
        onChange={(newCode) => setCode(newCode || "")}
      />
      <button 
        onClick={handleSubmitCode} 
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#ffaa64', // Custom color
          border: 'none',
          borderRadius: '5px',
          color: '#fff',
          fontSize: '16px',
          cursor: 'pointer',
          transition: 'background-color 0.3s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e59e52'} // Darker on hover
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffaa64'} // Original color
      >
        Submit Code
      </button>
      {errorMessage && (
        <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>
      )}
    </div>
    
  );
};

export default GamePage;
