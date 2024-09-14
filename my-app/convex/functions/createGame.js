export async function createGame({ db }, player1Id, player2Id, question) {
    return db.insert("Games", {
      player1: player1Id,
      player2: player2Id,
      question,
      player1Code: "",
      player2Code: "",
      status: "in-progress",
      winner: "",
    });
  }