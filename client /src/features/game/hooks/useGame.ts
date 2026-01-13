import {useState, useEffect, useCallback, useRef} from "react";
import {useSocket} from "../../socket/hooks/useSocket";
import {SocketEvents} from "../../../../../shared/events/socketEvents";
import type { GamePhase, Player, PlayerResult, Question, RevealAnswer, Score} from "../types/game.types"; 

export const useGame = (roomId: string) => {
    const {socket, isConnected} = useSocket();

    const hasLeftGameRef = useRef(false)
    const gameEndedNaturallyRef = useRef(false)
    const gameStartedRef = useRef(false)  // Track if game started (to skip leave on navigation)

    const [phase, setPhase] = useState<GamePhase>("waiting")
    const [totalQuestions, setTotalQuestions ] = useState<number>(0);
    const [currentQuestion, setCurrentQuestion] = useState<Question>();
    const [scores, setScores] = useState<Score[]>([])
    const [questionIndex, setQuestionIndex] =useState(0)
    const [remainingTime, setRemainingTime] = useState<number>(15)
    const [hasAnswered, setHasAnswered] = useState<boolean>(false)
    const [answerResult, setAnswerResult] = useState<{isCorrect: boolean} | null >(null)

    // revael answer state
    const [revealAnswer, setRevealAnswer] = useState<RevealAnswer | null>(null)

    //winner state 
    const [winner, setWinner] = useState<string | null>(null)

    // last question answer (for finish phase)
    const [lastQuestionAnswer, setLastQuestionAnswer] = useState<RevealAnswer | null>(null)

    // game started state - for navigation
    const [gameStarted, setGameStarted] = useState<boolean>(false)


    useEffect(() => {
        if (!socket || !roomId) return;
    
        //game started 
        const handleGameStarted = ({ totalQuestions, players, firstQuestion }: { totalQuestions: number, players: Player[], firstQuestion?: { questionIndex: number, question: Question, timeLimit: number } }) => {
            console.log("🎮 Game started: ", players);
            gameStartedRef.current = true;  // Mark game as started (for cleanup logic)
            setTotalQuestions(totalQuestions);
            setScores(players.map((p: any) => ({ id: p.id, name: p.name, score: 0 }) ));
            setGameStarted(true); // trigger navigation for all players
            
            // Handle first question if included (to avoid race condition)
            if (firstQuestion) {
                setPhase("question");
                setCurrentQuestion(firstQuestion.question);
                setQuestionIndex(firstQuestion.questionIndex);
                setRemainingTime(firstQuestion.timeLimit);
                setHasAnswered(false);
                setAnswerResult(null);
                setRevealAnswer(null);
            }
        }

        //new question 
        const handleNewQuestion = ({questionIndex, question, totalQuestions, timeLimit}: {questionIndex: number, question: Question, totalQuestions: number, timeLimit: number }) => {
            console.log("🎮 New question: from useGame hook ", question);
            setPhase("question");
            setCurrentQuestion(question);
            setQuestionIndex(questionIndex);
            setTotalQuestions(totalQuestions);
            setRemainingTime(timeLimit);
            setHasAnswered(false)
            setAnswerResult(null)
            setRevealAnswer(null)
        };

        // timer update 
        const handleTimeUpdate = ({remainingTime}: {remainingTime: number}) => {
            console.log("🎮 Time update: from useGame hook ", remainingTime);
            setRemainingTime(remainingTime);
        };

        // answer result 
        const handleAnswerResult = ({isCorrect}: {isCorrect: boolean}) => {
            console.log("🎮 Answer result: from useGame hook ", isCorrect);
            setAnswerResult({isCorrect})
        };

        //revael answer 
        const handleRevealAnswer = ({correctAnswer, explanation, results, scores}: {correctAnswer: string, explanation: string, results: PlayerResult[], scores: Score[]}) => {
            console.log("🎮 Reveal answer: from useGame hook ", correctAnswer, explanation, results, scores);
            setPhase("answer")
            setRevealAnswer({correctAnswer, explanation, results})
            setScores(scores)
            setRemainingTime(5)
        };

        // game over 
     
        const handleGameOver  = ({finalScores, winner, reason, lastQuestionAnswer}: {
            finalScores: Score[], 
            winner: string, 
            reason?: string,
            lastQuestionAnswer?: {
                correctAnswer: string,
                explanation: string,
                results: PlayerResult[]
            }
        }) => { 
            console.log("🎮 Game over: from useGame hook ", finalScores, winner, reason, lastQuestionAnswer);
            gameEndedNaturallyRef.current = true;
            setPhase("finished")
            setScores(finalScores)
            setWinner(winner)
            
            // Set last question answer if provided
            if (lastQuestionAnswer) {
                setLastQuestionAnswer({
                    correctAnswer: lastQuestionAnswer.correctAnswer,
                    explanation: lastQuestionAnswer.explanation,
                    results: lastQuestionAnswer.results
                })
            }
        }

        // player left game 
        const handlePlayerLeftGame = ({playerId, playerName, remainingPlayers}: {playerId: string, playerName: string, remainingPlayers: Player[]}) => {
            console.log("🎮 Player left game: from useGame hook ", playerId, playerName, remainingPlayers);
            setScores(remainingPlayers.map((p: any) => ({ id: p.id, name: p.name, score: p.score }) ))
            
        }

        // get game state - handler for response
        const handleGameState = (state: any) => {
            console.log("📋 Received game state:", state);
            if (state.exists) {
                setPhase(state.phase);
                setCurrentQuestion(state.currentQuestion);
                setQuestionIndex(state.questionIndex);
                setTotalQuestions(state.totalQuestions);
                setRemainingTime(state.remainingTime);
                setScores(state.scores);
            }
        };


        console.log("🔌 Setting up game listeners for room:", roomId);
        
        socket.on(SocketEvents.GAME_STATE, handleGameState);
        socket.on(SocketEvents.GAME_STARTED, handleGameStarted);
        socket.on(SocketEvents.NEW_QUESTION, handleNewQuestion);
        socket.on(SocketEvents.TIME_UPDATE, handleTimeUpdate);
        socket.on(SocketEvents.ANSWER_RESULT, handleAnswerResult);
        socket.on(SocketEvents.REVEAL_ANSWER, handleRevealAnswer);
        socket.on(SocketEvents.GAME_OVER, handleGameOver)
        socket.on(SocketEvents.PLAYER_LEFT_GAME, handlePlayerLeftGame)

        // NOW emit the request (after all handlers are registered!)
        // Only request if roomId is available
        if (roomId) {
            socket.emit(SocketEvents.GET_GAME_STATE, {roomId})
        }

        return () => {
            socket.off(SocketEvents.GAME_STATE, handleGameState)
            socket.off(SocketEvents.GAME_STARTED, handleGameStarted)
            socket.off(SocketEvents.NEW_QUESTION, handleNewQuestion)
            socket.off(SocketEvents.TIME_UPDATE, handleTimeUpdate)
            socket.off(SocketEvents.ANSWER_RESULT, handleAnswerResult)
            socket.off(SocketEvents.REVEAL_ANSWER, handleRevealAnswer)
            socket.off(SocketEvents.GAME_OVER, handleGameOver)
            socket.off(SocketEvents.PLAYER_LEFT_GAME, handlePlayerLeftGame)

            
            // Only emit LEAVE_GAME if:
            // - Game didn't end naturally
            // - Player didn't explicitly leave
            // - Game didn't just start (navigating to game page)
            if (!gameEndedNaturallyRef.current && !hasLeftGameRef.current && !gameStartedRef.current) {
                socket.emit(SocketEvents.LEAVE_GAME, {roomId})
            }
        };

    }, [socket, roomId]);

    //actions 

    const startGame = useCallback((category: string, roomId: string) => {
        if (!socket || !isConnected) return;
        socket.emit(SocketEvents.START_GAME, {category, roomId} )
    }, [socket, isConnected])

    const submitAnswer = useCallback((answer: string) => {
        if (!socket || !isConnected || hasAnswered) return;
        socket.emit(SocketEvents.SUBMIT_ANSWER, {roomId, playerId: socket.id, answer})
        setHasAnswered(true)
    }, [socket, isConnected, hasAnswered, roomId])

    const readyForNextQuestion = useCallback(() => {
        if (!socket || !isConnected) return;
        socket.emit(SocketEvents.PLAYER_READY, {roomId, playerId: socket.id})
    }, [socket, isConnected, roomId])

    const leaveGame = useCallback(() => {
        if (!socket || !isConnected) return;
        if (hasLeftGameRef.current) return;
        hasLeftGameRef.current = true;
        socket.emit(SocketEvents.LEAVE_GAME, {roomId})
    }, [socket, isConnected, roomId])

    return {

        // state 
        phase,
        totalQuestions,
        currentQuestion,
        scores,
        questionIndex,
        hasAnswered,
        remainingTime,
        answerResult,
        revealAnswer,
        winner,
        gameStarted,
        lastQuestionAnswer,

        // actions 
        startGame,
        submitAnswer,
        readyForNextQuestion,
        leaveGame
    };
    
}
