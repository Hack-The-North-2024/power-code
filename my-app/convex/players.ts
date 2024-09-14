import { mutation } from "./_generated/server";
import { query } from "./_generated/server";
import { v } from "convex/values";

// Query to get all players
export const getPlayers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("players").collect();
  },
});

// Mutation to create a new player with username, password, name, and score
export const createPlayer = mutation({
  args: {
    username: v.string(),
    password: v.string(),
    name: v.string(),
    score: v.number(), // Initialize player's score/ranking
  },
  handler: async (ctx, args) => {
    const { username, password, name, score } = args;

    // Insert a new player record into the "players" table
    const newPlayerId = await ctx.db.insert("players", {
      username,
      password, // Make sure to hash the password before storing it
      name,
      score,
    });

    return newPlayerId;  // Return the new player ID
  },
});

// Mutation to log in a player (login)
export const loginPlayer = mutation({
    args: {
      username: v.string(),
      password: v.string(),
    },
    handler: async (ctx, args) => {
      const { username, password } = args;
  
      // Query the player with matching username and password
      const player = await ctx.db
        .query("players")
        .filter((q) => q.eq(q.field("username"), username))
        .filter((q) => q.eq(q.field("password"), password)) // Hash passwords in production
        .first();
  
      if (!player) {
        throw new Error("Invalid username or password");
      }
  
      return player._id; // Return player ID if login is successful
    },
  });