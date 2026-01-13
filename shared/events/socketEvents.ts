
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
  LEAVE_GAME: "game:leave",
  PLAYER_LEFT_GAME: "game:player_left_game",
  NEW_QUESTION: "game:new_question",      
  SUBMIT_ANSWER: "game:answer",
  PLAYER_ANSWERED: "game:player_answered", 
  ANSWER_RESULT: "game:answer_result",
  PLAYER_READY: "game:player_ready",       
  ALL_READY: "game:all_ready",             
  REVEAL_ANSWER: "game:reveal",            
  TIME_UPDATE: "game:time",               
  SCORES_UPDATED: "game:scores",
  GAME_OVER: "game:over",
  GAME_ERROR: "game:error",

  // Game State 
  GAME_STATE: "game:state",
  GET_GAME_STATE: "game:get_state",
}