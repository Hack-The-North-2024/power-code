export async function submitCode({ db }, gameId, playerId, code) {
    const game = await db.get(gameId);
    if (playerId === game.player1) {
      db.update(gameId, { player1Code: code });
    } else if (playerId === game.player2) {
      db.update(gameId, { player2Code: code });
    }
    // Check if both players have submitted and determine winner
  }