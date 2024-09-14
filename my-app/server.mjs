import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const port = 3001;

// Configure CORS middleware
app.use(cors({
  origin: "http://localhost:5173", // Your frontend origin
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

// Create an HTTP server and pass it to Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Your frontend origin
    methods: ["GET", "POST"]
  }
});

// Object to keep track of games and players
const games = {};

// Function to generate a random game code
const generateGameCode = () => {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle game creation
  socket.on("createGame", () => {
    const gameCode = generateGameCode();
    games[gameCode] = { players: [] };
    socket.emit("gameCreated", gameCode);
  });

  // Handle game joining
  socket.on("joinGame", (gameCode) => {
    console.log("games:", games);
    console.log("A user joined:", games[gameCode]);

    if (!games[gameCode]) {
      games[gameCode] = { players: [] };
    }

    // Check if the game already has two players
    if (games[gameCode].players.length >= 2) {
      socket.emit("gameFull", "This game already has two players.");
      return;
    }

    games[gameCode].players.push(socket.id);

    const playerCount = games[gameCode].players.length;
    const opponentConnected = playerCount === 2;

    // Notify the player who just joined
    socket.emit("playerStatus", {
      player: socket.id,
      opponentConnected,
    });

    // Notify the existing player
    if (playerCount === 2) {
      const [player1, player2] = games[gameCode].players;
      io.to(player1).emit("playerStatus", {
        player: player1,
        opponentConnected: true,
      });
      io.to(player2).emit("playerStatus", {
        player: player2,
        opponentConnected: true,
      });
    }

    socket.join(gameCode);
  });

  // Handle code submission
  socket.on("submitCode", ({ gameCode, code }) => {
    // Add logic to handle code submission and check for results
    // For example, determine the winner and emit the result
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // Handle player disconnection logic if needed
  });
});

// Start the server
httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
