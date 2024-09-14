import { mutation } from "./_generated/server";
import { query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("games").collect();
  },
});

// Create a new game with the given player IDs and question
export const createGame = mutation({
  args: {
    player1Id: v.string(),
    question: v.string()
  },
  handler: async (ctx, args) => {
    const { player1Id, question } = args;

    // Insert a new game record into the "games" table
    const newGameId = await ctx.db.insert("games", {
      player1: player1Id,
      player2: "",
      question,
      player1Code: "",  // Initialize with empty code submissions
      player2Code: "",
      status: "in-progress",  // Set the initial status
      winner: "",  // No winner yet
    });

    return newGameId;  // Return the new game ID
  },
});

export const joinGame = mutation({
    args: {
      gameId: v.string(),
      player2Id: v.string(),
    },
    handler: async (ctx, args) => {
      const { gameId, player2Id } = args;
  
      // Find the game by querying for the gameId
      
      const game = await ctx.db.query("games").filter(q => q.eq(q.field("_id"), gameId)).first();

      // Check if the game exists
      if (!game) {
        throw new Error(`Game with ID ${gameId} not found.`);
      }
  
      // Update the game record by adding player2Id to the game
      await ctx.db.patch(game._id, {
        player2: player2Id,
        status: "in-progress",  // Optionally update the status or any other fields
      });
  
      return gameId;  // Return the game ID after the update
    },
  });
  
export const checkPlayersConnected = query({
    args: { gameId: v.string() },
    handler: async (ctx, args) => {
        const { gameId } = args;
        const game = await ctx.db.query("games").filter(q => q.eq(q.field("_id"), gameId)).first();
        if (!game) {
            return false
        }
        // Check if both player1 and player2 are defined
        const bothPlayersConnected = game.player1!="" && game.player2!="";
        console.log("game.player1! "+ game.player1!)
        console.log("game.player2! "+ game.player2!)
        console.log("bothPlayersConnected" + bothPlayersConnected)
        return bothPlayersConnected;
    },
});

export const gameWinner = mutation({
    args: {
      gameId: v.string(),
      playerId: v.string(),
    },
    handler: async (ctx, args) => {
      const { gameId, playerId } = args;
  
      // Find the game by querying for the gameId
      
      const game = await ctx.db.query("games").filter(q => q.eq(q.field("_id"), gameId)).first();

      // Check if the game exists
      if (!game) {
        throw new Error(`Game with ID ${gameId} not found.`);
      }
  
      // Update the game record by adding player2Id to the game
      await ctx.db.patch(game._id, {
        winner: playerId,
      });
  
      return gameId;  // Return the game ID after the update
    },
  });
  