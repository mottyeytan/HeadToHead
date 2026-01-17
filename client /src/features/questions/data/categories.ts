import type { CategorySection, GameCard } from '../types/CradGameButtons/CradGameButtons';

// ==========================================
// משחקים בודדים (כפתורי משחק)
// ==========================================

export const games: Record<string, GameCard> = {
  // תרבות פופ
  music: {
    id: 'music',
    title: 'מוזיקה',
    description: 'זמרים, להקות ושירים מכל הזמנים',
    longDescription: 'מוזיקה מכל הזמנים, מוזיקה מכל הדורות, מוזיקה מכל המדינות',
    icon: '♪',
    color: '#E91E63',
    gradient: 'linear-gradient(135deg, #E91E63 0%, #AD1457 100%)',
  },
  movies: {
    id: 'movies',
    title: 'סרטים וטלוויזיה',
    description: 'הוליווד, סדרות וציטוטים אייקוניים',
    longDescription: 'שאלות על סרטי קולנוע קלאסיים ומודרניים, סדרות טלוויזיה פופולריות, שחקנים מפורסמים וציטוטים בלתי נשכחים מהמסך הגדול והקטן',
    icon: '▶',
    color: '#9C27B0',
    gradient: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
  },
  viral: {
    id: 'viral',
    title: 'טרנדים ווירלאים',
    description: 'מימס, טיקטוקים ואינטרנט',
    longDescription: 'כל מה שהפך לוירלי ברשת - מימס מצחיקים, סרטוני טיקטוק פופולריים, טרנדים חמים ותופעות אינטרנטיות שכבשו את העולם',
    icon: '↗',
    color: '#00BCD4',
    gradient: 'linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)',
  },
  celebs: {
    id: 'celebs',
    title: 'סלבס וכוכבים',
    description: 'כוכבים ואינפלואנסרים מפורסמים',
    longDescription: 'שאלות על סלבריטאים מהארץ והעולם, אינפלואנסרים מובילים, רכילות מהשטיח האדום וכל מה שקורה בעולם הכוכבים',
    icon: '✦',
    color: '#FFC107',
    gradient: 'linear-gradient(135deg, #FFC107 0%, #FFA000 100%)',
  },
  gaming: {
    id: 'gaming',
    title: 'גיימינג',
    description: 'משחקי וידאו, קונסולות ודמויות',
    longDescription: 'עולם הגיימינג על כל גווניו - משחקי וידאו קלאסיים וחדשים, קונסולות, דמויות אייקוניות, אליפויות eSports ותרבות הגיימרים',
    icon: '◈',
    color: '#673AB7',
    gradient: 'linear-gradient(135deg, #673AB7 0%, #512DA8 100%)',
  },

  // ידע כללי
  science: {
    id: 'science',
    title: 'מדע וטכנולוגיה',
    description: 'פיזיקה, כימיה, ביולוגיה והמצאות',
    longDescription: 'שאלות מרתקות מעולם המדע - פיזיקה, כימיה, ביולוגיה, אסטרונומיה, המצאות פורצות דרך וטכנולוגיות שמשנות את העולם',
    icon: '⬡',
    color: '#4CAF50',
    gradient: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
  },
  history: {
    id: 'history',
    title: 'היסטוריה',
    description: 'אירועים ודמויות שעיצבו את העולם',
    longDescription: 'מסע בזמן דרך אירועים היסטוריים מכוננים, מלחמות, מהפכות, דמויות מפתח ורגעים שעיצבו את ההיסטוריה האנושית',
    icon: '◷',
    color: '#8D6E63',
    gradient: 'linear-gradient(135deg, #8D6E63 0%, #5D4037 100%)',
  },
  geography: {
    id: 'geography',
    title: 'גאוגרפיה',
    description: 'מדינות, בירות ומקומות מפורסמים',
    longDescription: 'שאלות על מדינות העולם, בירות, דגלים, יבשות, אוקיינוסים, הרים מפורסמים ואתרים גאוגרפיים מרהיבים',
    icon: '◎',
    color: '#2196F3',
    gradient: 'linear-gradient(135deg, #2196F3 0%, #1565C0 100%)',
  },
  nature: {
    id: 'nature',
    title: 'טבע ובעלי חיים',
    description: 'חיות, צמחים ופלאי הטבע',
    longDescription: 'עולם החי והצומח המופלא - בעלי חיים מכל הסוגים, צמחים מיוחדים, מערכות אקולוגיות ופלאי הטבע המדהימים',
    icon: '❋',
    color: '#8BC34A',
    gradient: 'linear-gradient(135deg, #8BC34A 0%, #689F38 100%)',
  },
  literature: {
    id: 'literature',
    title: 'ספרות',
    description: 'ספרים, סופרים ויצירות קלאסיות',
    longDescription: 'עולם הספרות העשיר - סופרים גדולים, יצירות קלאסיות ומודרניות, דמויות ספרותיות אייקוניות וציטוטים בלתי נשכחים',
    icon: '≡',
    color: '#795548',
    gradient: 'linear-gradient(135deg, #795548 0%, #5D4037 100%)',
  },

  // ספורט
  football: {
    id: 'football',
    title: 'כדורגל',
    description: 'קבוצות, שחקנים ומונדיאלים',
    longDescription: 'עולם הכדורגל על כל גווניו - ליגות מובילות, קבוצות אגדיות, שחקני על, מונדיאלים, שערים היסטוריים ורגעי שיא בלתי נשכחים',
    icon: '⬢',
    color: '#4CAF50',
    gradient: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
  },
  basketball: {
    id: 'basketball',
    title: 'כדורסל',
    description: 'NBA, יורוליג ושחקני על',
    longDescription: 'הכדורסל בגדול - ה-NBA, יורוליג, שחקני על אגדיים, אליפויות, שיאים, טריידים היסטוריים וכל מה שקורה על הפרקט',
    icon: '○',
    color: '#FF5722',
    gradient: 'linear-gradient(135deg, #FF5722 0%, #E64A19 100%)',
  },
  olympics: {
    id: 'olympics',
    title: 'אולימפיאדות',
    description: 'שיאים, מדליות ורגעים היסטוריים',
    longDescription: 'המשחקים האולימפיים לאורך ההיסטוריה - שיאי עולם, מדליסטים אגדיים, רגעים מרגשים, ערי אירוח ותחרויות בלתי נשכחות',
    icon: '◯',
    color: '#FFD700',
    gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA000 100%)',
  },
  sports_general: {
    id: 'sports_general',
    title: 'ספורט כללי',
    description: 'טניס, שחייה, אתלטיקה ועוד',
    longDescription: 'ענפי ספורט מגוונים - טניס, שחייה, אתלטיקה, פורמולה 1, גולף, רכיבה על גלים ועוד המון ענפים מרתקים',
    icon: '△',
    color: '#607D8B',
    gradient: 'linear-gradient(135deg, #607D8B 0%, #455A64 100%)',
  },

  // ישראל
  israel_history: {
    id: 'israel_history',
    title: 'היסטוריה ישראלית',
    description: 'מלחמות, מנהיגים ואירועים',
    longDescription: 'ההיסטוריה של מדינת ישראל - מלחמות, הסכמי שלום, מנהיגים, אירועים מכוננים ורגעים שעיצבו את המדינה',
    icon: '✡',
    color: '#1976D2',
    gradient: 'linear-gradient(135deg, #1976D2 0%, #0D47A1 100%)',
  },
  israel_culture: {
    id: 'israel_culture',
    title: 'תרבות ישראלית',
    description: 'מוזיקה, טלוויזיה וסלנג',
    longDescription: 'התרבות הישראלית על כל גווניה - מוזיקה ישראלית, תוכניות טלוויזיה אהובות, סלנג, הומור ישראלי ותופעות תרבותיות',
    icon: '❖',
    color: '#00ACC1',
    gradient: 'linear-gradient(135deg, #00ACC1 0%, #00838F 100%)',
  },
  israel_geography: {
    id: 'israel_geography',
    title: 'גאוגרפיה של ישראל',
    description: 'ערים, אתרים ומקומות',
    longDescription: 'גאוגרפיה ישראלית - ערים ויישובים, אתרי טבע ותיירות, גבולות, אזורים גאוגרפיים ומקומות מיוחדים ברחבי הארץ',
    icon: '◇',
    color: '#26A69A',
    gradient: 'linear-gradient(135deg, #26A69A 0%, #00897B 100%)',
  },

  // אוכל ולייף סטייל
  food: {
    id: 'food',
    title: 'אוכל ומטבח',
    description: 'מתכונים ומטבחים מהעולם',
    longDescription: 'עולם הקולינריה - מטבחים מכל העולם, מתכונים מפורסמים, שפים ידועים, מרכיבים מיוחדים ותרבות האוכל העולמית',
    icon: '◉',
    color: '#FF9800',
    gradient: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
  },
  travel: {
    id: 'travel',
    title: 'טיולים ויעדים',
    description: 'יעדים פופולריים ואטרקציות',
    longDescription: 'טיולים ותיירות - יעדים פופולריים ברחבי העולם, אטרקציות מפורסמות, פלאי תבל, טיפים לטיולים וחוויות מסביב לגלובוס',
    icon: '→',
    color: '#03A9F4',
    gradient: 'linear-gradient(135deg, #03A9F4 0%, #0288D1 100%)',
  },
  art: {
    id: 'art',
    title: 'אומנות ועיצוב',
    description: 'ציירים, יצירות וזרמים',
    longDescription: 'עולם האומנות - ציירים מפורסמים, יצירות אמנות איקוניות, זרמים אמנותיים, מוזיאונים ועיצוב גרפי ואדריכלי',
    icon: '◐',
    color: '#F44336',
    gradient: 'linear-gradient(135deg, #F44336 0%, #C62828 100%)',
  },

  // מיוחדים
  random: {
    id: 'random',
    title: 'מיקס אקראי',
    description: 'שאלות מכל הקטגוריות',
    longDescription: 'מיקס מפתיע של שאלות מכל הקטגוריות - אף פעם לא יודעים מה תהיה השאלה הבאה! אידיאלי למי שאוהב גיוון ואתגרים',
    icon: '⟳',
    color: '#607D8B',
    gradient: 'linear-gradient(135deg, #607D8B 0%, #455A64 100%)',
  },
  quick_game: {
    id: 'quick_game',
    title: 'משחק מהיר',
    description: '5 שאלות, 10 שניות לכל אחת',
    longDescription: 'משחק מהיר ואינטנסיבי - 5 שאלות בלבד עם 10 שניות לכל שאלה. מושלם להפסקה קצרה או לתחרות מהירה עם חברים',
    icon: '↯',
    color: '#FFEB3B',
    gradient: 'linear-gradient(135deg, #FFEB3B 0%, #FBC02D 100%)',
  },
};

// ==========================================
// סקשנים (נושאים ראשיים) עם המשחקים שלהם
// ==========================================

export const categorySections: CategorySection[] = [
  {
    id: 'pop_culture',
    name: 'תרבות פופ',
    games: [games.music, games.movies, games.viral, games.celebs, games.gaming],
  },
  {
    id: 'knowledge',
    name: 'ידע כללי',
    games: [games.science, games.history, games.geography, games.nature, games.literature],
  },
  {
    id: 'sports',
    name: 'ספורט',
    games: [games.football, games.basketball, games.olympics, games.sports_general],
  },
  {
    id: 'israel',
    name: 'ישראל',
    games: [games.israel_history, games.israel_culture, games.israel_geography],
  },
  {
    id: 'lifestyle',
    name: 'לייף סטייל',
    games: [games.food, games.travel, games.art],
  },
  {
    id: 'special',
    name: 'משחקים מיוחדים',
    games: [games.random, games.quick_game],
  },
];

// ==========================================
// פונקציות עזר
// ==========================================

export const getGameById = (id: string): GameCard | undefined => {
  return games[id];
};

export const getSectionById = (id: string): CategorySection | undefined => {
  return categorySections.find((section) => section.id === id);
};

export const getAllGames = (): GameCard[] => {
  return Object.values(games);
};
