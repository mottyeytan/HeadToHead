// Socket event names

export const SocketEvents = {
  // Connection
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  
  // Room
  JOIN_ROOM: "room:join",
  LEAVE_ROOM: "room:leave",
  PLAYERS_UPDATED: "room:players",
  ROOM_ERROR: "room:error",
  
  // Game
  START_GAME: "game:start",
  GAME_STARTED: "game:started",
  NEXT_QUESTION: "game:question",
  SUBMIT_ANSWER: "game:answer",
  ANSWER_RESULT: "game:answer_result",
  SCORES_UPDATED: "game:scores",
  GAME_OVER: "game:over",
}