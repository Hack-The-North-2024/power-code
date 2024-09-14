import { mutation } from "./_generated/server";
import { query } from "./_generated/server";
import { v } from "convex/values";

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
    player2Id: v.string(),
    question: v.string()
  },
  handler: async (ctx, args) => {
    const { player1Id, player2Id, question } = args;

    // Insert a new game record into the "games" table
    const newGameId = await ctx.db.insert("games", {
      player1: player1Id,
      player2: player2Id,
      question,
      player1Code: "",  // Initialize with empty code submissions
      player2Code: "",
      status: "in-progress",  // Set the initial status
      winner: "",  // No winner yet
    });

    return newGameId;  // Return the new game ID
  },
});
