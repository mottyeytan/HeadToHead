import type { Question, QuestionBank } from '../../types/question.types';

// Import questions from JSON files
import musicQuestions from './music.json';
import moviesQuestions from './movies.json';
import footballQuestions from './football.json';
import geographyQuestions from './geography.json';
import israelHistoryQuestions from './israel_history.json';
import scienceQuestions from './science.json';

// New categories from client Home page
import viralQuestions from './viral.json';
import celebsQuestions from './celebs.json';
import gamingQuestions from './gaming.json';
import historyQuestions from './history.json';
import natureQuestions from './nature.json';
import literatureQuestions from './literature.json';
import basketballQuestions from './basketball.json';
import olympicsQuestions from './olympics.json';
import sportsGeneralQuestions from './sports_general.json';
import israelCultureQuestions from './israel_culture.json';
import israelGeographyQuestions from './israel_geography.json';
import foodQuestions from './food.json';
import travelQuestions from './travel.json';
import artQuestions from './art.json';
import randomQuestions from './random.json';
import quickGameQuestions from './quick_game.json';

// Question bank - all questions organized by category
export const questionBank: QuestionBank = {
    music: musicQuestions as Question[],
    movies: moviesQuestions as Question[],
    football: footballQuestions as Question[],
    geography: geographyQuestions as Question[],
    israel_history: israelHistoryQuestions as Question[],
    science: scienceQuestions as Question[],

    // New categories
    viral: viralQuestions as Question[],
    celebs: celebsQuestions as Question[],
    gaming: gamingQuestions as Question[],
    history: historyQuestions as Question[],
    nature: natureQuestions as Question[],
    literature: literatureQuestions as Question[],
    basketball: basketballQuestions as Question[],
    olympics: olympicsQuestions as Question[],
    sports_general: sportsGeneralQuestions as Question[],
    israel_culture: israelCultureQuestions as Question[],
    israel_geography: israelGeographyQuestions as Question[],
    food: foodQuestions as Question[],
    travel: travelQuestions as Question[],
    art: artQuestions as Question[],
    random: randomQuestions as Question[],
    quick_game: quickGameQuestions as Question[],
};

// Get questions by category
export const getQuestionsByCategory = (category: string): Question[] => {
    return questionBank[category] || [];
};

// Get random questions from a category
export const getRandomQuestions = (category: string, count: number = 10): Question[] => {
    const questions = getQuestionsByCategory(category);
    
    // Shuffle and take first `count` questions
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
};

// Get random questions from all categories (for "random" game mode)
export const getRandomMixedQuestions = (count: number = 10): Question[] => {
    const allQuestions = Object.values(questionBank).flat();
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
};

// Get all available categories
export const getAvailableCategories = (): string[] => {
    return Object.keys(questionBank);
};

// Get total question count
export const getTotalQuestionCount = (): number => {
    return Object.values(questionBank).flat().length;
};

export default questionBank;

