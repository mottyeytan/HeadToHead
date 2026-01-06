export interface Question {
    id: string;
    text: string;                    // השאלה עצמה
    correctAnswer: string;           // התשובה הנכונה
    explanation: string;             // הסבר לתשובה
    category: string;                // קטגוריה (music, movies, etc.)
    difficulty?: 'easy' | 'medium' | 'hard';
    acceptableAnswers?: string[];    // תשובות נוספות שנחשבות נכונות
}

export interface QuestionBank {
    [category: string]: Question[];
}