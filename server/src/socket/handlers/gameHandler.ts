import { Server, Socket } from "socket.io";
import { GameService } from "../../services/gameService";
import { SocketEvents } from "../../../../shared/events/socketEvents";
import { roomManager } from "../rooms/roomManager";

const gameTimers: Map<string, NodeJS.Timeout> = new Map();

export const gameHandler = (io: Server, socket: Socket) => {
    //socket events summary:
    //==============================================
    //startGame: starts a game by roomId and category
    //submitAnswer: submits an answer by roomId, playerId, answer
    //playerReadyForNextQuestion: checks if all players are ready for the next question by roomId, playerId
    //timerTick: ticks the timer by roomId
    //clearTimer: clears the timer by roomId  
    //sendQuestion: sends a question by roomId
    //moveToAnswerPhase: moves a game to the answer phase by roomId
    //moveToNextQuestion: moves a game to the next question by roomId
    //disconnect: disconnects a player by socketId
    //==============================================

    //==============================================
    // start game
    //==============================================

    socket.on(SocketEvents.START_GAME, ({ roomId, category }: { roomId: string, category: string }) => {
        console.log(`🎮 Start game: ${roomId} - ${category}`);

        const room = roomManager.getRoom(roomId);
        if (!room){
            socket.emit(SocketEvents.ROOM_ERROR, { message: "החדר לא נמצא" });
            return;
        }
        if (room.status !== "waiting"){
            socket.emit(SocketEvents.ROOM_ERROR, { message: "החדר כבר מתחיל" });
            return;
        }
        if (room.players.length < 2){
            socket.emit(SocketEvents.ROOM_ERROR, { message: "צריך לפחות 2 שחקנים כדי להתחיל" });
            return;
        }
        

        const gamePlayers = room.players.map(player => ({
            id: player.socketId,
            name: player.name,
            score: 0,
            isConnected: true,
            currentAnswer: undefined,
            answers: [],
            isReadyForNextQuestion: false,
        }));

        const game = GameService.createGame(roomId, category, gamePlayers);
        if (!game){
            socket.emit(SocketEvents.GAME_ERROR, { message: "Failed to create game" });
            return;
        }

        const startedGame = GameService.startGame(roomId);
        if (!startedGame){
            socket.emit(SocketEvents.GAME_ERROR, { message: "Failed to start game" });
            return;
        }

        io.to(roomId).emit(SocketEvents.GAME_STARTED, {
            roomId,
            totalQuestions: game.questions.length,
            players: gamePlayers,
        });

        console.log(`🎮 Game started in room ${roomId} with ${gamePlayers.length} players and ${game.questions.length} questions`);

        sendQuestion(io, roomId, startedGame);

        startTimer(io, roomId);
    });

    //==============================================
    // submit answer
    //==============================================

    socket.on(SocketEvents.SUBMIT_ANSWER, ({ roomId, playerId, answer }: { roomId: string, playerId: string, answer: string }) => {
        console.log(`🎯 SUBMIT_ANSWER: ${roomId} - ${playerId} - ${answer}`);

        const game = GameService.getGame(roomId);
        if (!game) return;

        const timeTaken = (15 - game.remainingTime) * 1000;
        const answerResult = GameService.submitAnswer(roomId, playerId, answer, timeTaken);
        
        if (!answerResult) return;

        //tell the player their answer result
        socket.emit(SocketEvents.ANSWER_RESULT, {
            roomId,
            playerId,
            isCorrect: answerResult.isCorrect,
            timeTaken,
        });

        //tell the otehr players that this player answerd (without revealing the answer)
        io.to(roomId).emit(SocketEvents.PLAYER_ANSWERED, {
           playerId,
           playerName: game.players.find(p => p.id === playerId)?.name,
        });

        console.log(`🎯 ${game.players.find(p => p.id === playerId)?.name} answered: ${answer} in ${timeTaken}ms`);

        //check if all players answered => move to reveal answer phase
        if (GameService.allPlayersAnswered(roomId)){
           console.log(`🎯 All players answered in room ${roomId}`);
           
           clearTimer( roomId); //clear the timer
           moveToAnswerPhase(io, roomId);

        }
    });

    //==============================================
    // player ready for next question
    //==============================================

    socket.on(SocketEvents.PLAYER_READY, ({ roomId, playerId }: { roomId: string, playerId: string }) => {
        
        const result = GameService.playerReadyForNextQuestion(roomId, playerId);
        if (!result) return;

        //notify others
        io.to(roomId).emit(SocketEvents.PLAYER_READY, {
            playerId,
            playerName: result.game.players.find(p => p.id === playerId)?.name,
        });

        console.log(`🎯 ${result.game.players.find(p => p.id === playerId)?.name} is ready for next question in room ${roomId}`);

        if (result.allReady){
            clearTimer( roomId); //clear the timer

            if (result.game.phase === "question"){
                moveToAnswerPhase(io, roomId);
            } else if (result.game.phase === "answer"){
                moveToNextQuestion(io, roomId);
            }
        }

    });

    //==============================================
    // disconnect
    //==============================================

    socket.on("disconnect", () => {
        // TODO: handel player disconnected during game 

        console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
};

//==============================================
// timer functions
//==============================================

const startTimer = (io: Server, roomId: string) => {
    
    clearTimer(roomId);
    
    const timer = setInterval(() => {

        const result = GameService.TimerTick(roomId);
        if (!result) {clearTimer(roomId); return;};

        io.to(roomId).emit(SocketEvents.TIME_UPDATE, {
            remainingTime: result.game.remainingTime,
        });

        if (result.timeUp){
            clearTimer(roomId);
            

            if (result.game.phase === "question"){
                moveToAnswerPhase(io, roomId);
            } else if (result.game.phase === "answer"){
                moveToNextQuestion(io, roomId);
            }
        }

    }, 1000);

    gameTimers.set(roomId, timer);
};

const clearTimer = (roomId: string) => {
    const timer = gameTimers.get(roomId);
    if (timer) {
        clearInterval(timer);
        gameTimers.delete(roomId);
    }
};

//==============================================
// game phase functions
//==============================================

const sendQuestion = (io: Server, roomId: string, game: any) => {
    io.to(roomId).emit(SocketEvents.NEW_QUESTION, {
        questionIndex: game.currentQuestionIndex + 1,
        totalQuestions: game.questions.length,
        questions: {
            id: game.currentQuestion.id,
            text: game.currentQuestion.text,
            category: game.currentQuestion.category
        },
        timeLimit: 15,
    });
};

const moveToAnswerPhase = (io: Server, roomId: string) => {
    const game = GameService.getGame(roomId);
    if (!game) return;

    // send answer with correct answer and who answered correctly
    io.to(roomId).emit(SocketEvents.REVEAL_ANSWER, {
        correctAnswer: game.currentQuestion.correctAnswer,
        explanation: game.currentQuestion.explanation,
        results: game.players.map(p => ({
            id: p.id,
            name: p.name,
            answer: p.currentAnswer?.answer,
            isCorrect: p.currentAnswer?.isCorrect,
            timeTaken: p.currentAnswer?.timeTaken,
        })),
        scores: GameService.getScores(roomId),
    });

    // start reveal timer 
    startTimer(io, roomId); //5 seconds

   
};

const moveToNextQuestion = (io: Server, roomId: string) => {
    const game = GameService.nextQuestion(roomId);
    if (!game) return;

    //game finished?
    if (game.phase === "finished"){
        console.log(`🎯 Game finished in room ${roomId}`);
        io.to(roomId).emit(SocketEvents.GAME_OVER, {
            finalScores: GameService.getScores(roomId),
            winner: GameService.getScores(roomId).find(p => p.score === Math.max(...GameService.getScores(roomId).map(p => p.score))),
        });
        clearTimer(roomId);
        GameService.deleteGame(roomId);
        return;
    }

    //game not finished => send new question
    console.log(`🎯 Game moved to next question in room ${roomId}`);
    sendQuestion(io, roomId, game);
    startTimer(io, roomId);
};

