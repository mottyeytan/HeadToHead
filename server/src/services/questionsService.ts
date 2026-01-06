import questionBank, { getQuestionsByCategory } from "../data/questions";
import type { Question } from "../types/question.types";

export class QuestionsService {
    static getRandomQuestions(category: string, count: number = 10): Question[] {
        const questions = getQuestionsByCategory(category);
        const shuffled = [...questions].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    static getRandomMixedQuestions(count: number = 10): Question[] {
        const allQuestions = Object.values(questionBank).flat();
        const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }
}