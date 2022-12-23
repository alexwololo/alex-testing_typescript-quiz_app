export interface RootState {
    quizDetails: {
        name: string;
        language: string;
        category: string;
        difficulty: string;

        questionTime: number;
        questionsLimit: number;
        totalSecondsLeft: number;
        answerStreak: number;
        correctAnswers: number;
        questionNo: number;
        score: number;
    };

    notification: {
        message: string;
        error: boolean;
        show: boolean;
    };
}
