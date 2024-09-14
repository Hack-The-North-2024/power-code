import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  games: defineTable({
    player1: v.string(), // Player 1's ID
    player2: v.string(), // Player 2's ID
    question: v.string(), // The coding question to be solved
    player1Code: v.string(), // Player 1's code submission
    player2Code: v.string(), // Player 2's code submission
    status: v.string(), // Game status ('in-progress', 'finished')
    winner: v.optional(v.string()), // Who won the game (player1 or player2)
  }),

  players: defineTable({
    username: v.string(), // Player's username for login
    password: v.string(), // Player's hashed password
    name: v.string(), // Player's name
    score: v.number(), // Player's score or ranking
  }),  

  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),
});
