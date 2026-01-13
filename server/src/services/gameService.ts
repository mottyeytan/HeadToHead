import type { GameState, PlayerState, PlayerAnswer } from "../types/game.types";
import type { Question } from "../types/question.types";
import { QuestionsService } from "./questionsService";

const activeGames: Map<string, GameState> = new Map();

export class GameService {

    //methods summary:
    //==============================================
    //createGame: creates a new game
    //getGame: gets a game by roomId
    //deleteGame: deletes a game by roomId
    //startGame: starts a game by roomId
    //moveToAnswerPhase: moves a game to the answer phase by roomId
    //nextQuestion: moves a game to the next question by roomId
    //submitAnswer: submits an answer by roomId, playerId, answer, timeTaken
    //playerReadyForNextQuestion: checks if all players are ready for the next question by roomId, playerId
    //timerTick: ticks the timer by roomId
    //checkAnswer: checks if an answer is correct by question, answer
    //allPlayersAnswered: checks if all players have answered by roomId
    //getScores: gets the scores by roomId
    //==============================================

    //==============================================
    // Game creation and management
    //==============================================

    static createGame(roomId: string, category: string, players: PlayerState[], questionsCount: number = 10): GameState {
        const questions = QuestionsService.getRandomQuestions(category, questionsCount);
        const game: GameState = {
            id: roomId,
            phase: "waiting",
            currentQuestionIndex: 0,
            players,
            questions,
            currentQuestion: questions[0],
            remainingTime: 0,
        };
        console.log(`🎮 Game created: ${roomId} with ${players.length} players and ${questions.length} questions`);
        console.log("🎮 Game questions: ", questions);
        activeGames.set(roomId, game);
        return game;
    }

    static getGame(roomId: string): GameState | undefined {
        return activeGames.get(roomId);
    }

    static deleteGame(roomId: string): void {
        activeGames.delete(roomId);
    }

    //==============================================
    // Game state management
    //==============================================

    static startGame(roomId: string): GameState | undefined {
        const game = this.getGame(roomId);
        if (!game) return;
        game.phase = "question";
        game.currentQuestionIndex = 0;
        game.currentQuestion = game.questions[0];
        game.remainingTime = 15;

        game.players.forEach(player => {
            player.currentAnswer = undefined;
            player.isReadyForNextQuestion = false;
        });

        console.log(`🎮 Game started: ${roomId} with ${game.players.length} players and ${game.questions.length} questions`);
        return game;
    }

    static LeaveGame(roomId: string, playerId: string):{
        game: GameState | null;
        gameEnded: boolean;
        leftPlayer?: PlayerState | null;
        remainingPlayer?: PlayerState;
    } | null {
     {
        const game = activeGames.get(roomId);
        if (!game) return null;

        const leftPlayer = game.players.find(p => p.id === playerId);
        if (!leftPlayer) return null;

        game.players = game.players.filter(p => p.id !== playerId);

        if (game.players.length < 2){
            return {
                game: null,
                gameEnded: true,
                leftPlayer,
                remainingPlayer: game.players[0],
            }
        }

       return {
        game,
        gameEnded: false,
        leftPlayer,
       };
    }}

    static MoveToAnswerPhase(roomId: string): GameState | undefined {
        const game = activeGames.get(roomId);
        if (!game) return;
        game.phase = "answer";
        game.remainingTime = 5;

        game.players.forEach(player => {
            player.isReadyForNextQuestion = false;
        });

        console.log(`🎮 Game moved to answer phase: ${roomId} with ${game.players.length} players and ${game.questions.length} questions`);
        return game;
    }

    static nextQuestion(roomId: string): GameState | null {
        const game = activeGames.get(roomId);
        if (!game) return null;

        game.currentQuestionIndex++;

        if (game.currentQuestionIndex >= game.questions.length) {
            game.phase = "finished";
            return game;
        }

        game.phase = "question";
        game.currentQuestion = game.questions[game.currentQuestionIndex];
        game.remainingTime = 15;

        game.players.forEach(player=> {
            player.currentAnswer = undefined;
            player.isReadyForNextQuestion = false;
        });

        console.log(`🎮 Game moved to question ${game.currentQuestionIndex + 1}: ${roomId} with ${game.players.length} players and ${game.questions.length} questions`);
        return game;

    }

    //==============================================
    // players actions
    //==============================================

    static submitAnswer(
        roomId: string,
        playerId:string,
        answer: string,
        timeTaken: number,
     ):{game:GameState; isCorrect: boolean } | null {

        const game = activeGames.get(roomId);
        if (!game || game.phase !== "question") return null;

        const player = game.players.find(p => p.id === playerId);
        if (!player || player.currentAnswer) return null;

        const isCorrect = this.checkAnswer(game.currentQuestion, answer);

        const playerAnswer: PlayerAnswer = {
            questionId: game.currentQuestion.id,
            answer,
            isCorrect,
            timeTaken,
            timestamp: new Date(),
        };

        player.currentAnswer = playerAnswer;
        player.answers.push(playerAnswer);

        if (isCorrect) {
            player.score += 10;
        }

        return { game, isCorrect };
     }

     static playerReadyForNextQuestion(roomId: string, playerId: string): {
        game:GameState; 
        allReady: boolean;
     } | null {

        const game = activeGames.get(roomId);
        if (!game) return null;

        const player = game.players.find(p => p.id === playerId);
        if (!player) return null;

        player.isReadyForNextQuestion = true;

        const allReady = game.players.every(p => p.isReadyForNextQuestion);
        return { game, allReady };

     }

     //==============================================
     //timer management
     //==============================================
     static TimerTick(roomId: string): {game:GameState; timeUp: boolean} | null {
        const game = activeGames.get(roomId);
        if (!game) return null;

        game.remainingTime = Math.max(0, game.remainingTime - 1);

        if (game.remainingTime <= 0) {
            return { game, timeUp: true };
        }
        return { game, timeUp: false };
     }

     //==============================================
     // helper methods
     //==============================================

     private static checkAnswer(question: Question, answer: string): boolean {
        
        const normalizedAnswer = answer.trim().toLowerCase();
        const CorrectAnswer = question.correctAnswer.trim().toLowerCase();
        
        return normalizedAnswer === CorrectAnswer;
     }

     static allPlayersAnswered(roomId: string): boolean {
        const game = activeGames.get(roomId);
        if (!game) return false;

        return game.players.every(p => p.currentAnswer !== undefined);
     }


     static getScores(roomId: string): {playerId: string, name: string, score: number}[] {
        const game = activeGames.get(roomId);
        if (!game) return [];

        return game.players.map(p => ({
            playerId: p.id,
            name: p.name,
            score: p.score,
        })).sort((a, b) => b.score - a.score);

     }

}


