import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    name: "",
    language: "english",
    category: "9",
    difficulty: "easy",

    questionTime: Number(process.env.REACT_APP_MAXIMUM_QUESTION_TIME),
    questionsLimit: Number(process.env.REACT_APP_MAXIMUM_QUESTIONS),
    answerStreak: 0,
    totalSecondsLeft: 0,
    correctAnswers: 0,
    questionNo: 1,
    score: 0,
};

export const quizSlice = createSlice({
    name: "quiz",
    initialState,
    reducers: {
        setUserName: (state, action) => {
            state.name = action.payload;
        },
        setLanugage: (state, action) => {
            state.language = action.payload;
        },
        setCategory: (state, action) => {
            state.category = action.payload;
        },
        setDifficulty: (state, action) => {
            state.difficulty = action.payload;
        },
        incrementStreak: (state) => {
            state.answerStreak += 1;
        },
        resetStreak: (state) => {
            state.answerStreak = 0;
        },
        decrementQuestionTime: (state) => {
            state.questionTime -= 1;
        },
        resetQuestionTime: (state) => {
            state.questionTime = Number(process.env.REACT_APP_MAXIMUM_QUESTION_TIME);
        },
        incrementQuestionNo: (state) => {
            state.questionNo += 1;
        },
        incrementcorrectAnswers: (state) => {
            state.correctAnswers += 1;
        },
        setTotalSecondsLeft: (state, { payload }) => {
            state.totalSecondsLeft += payload;
        },
        resetQuestionNo: (state) => {
            state.questionNo = 0;
        },
        calcScore: (state, action) => {
            state.score += action.payload;
        },
        resetState: (state) => {
            state.answerStreak = 0;
            state.category = "9";
            state.correctAnswers = 0;
            state.difficulty = "easy";
            state.language = "english";
            state.name = "";
            state.questionNo = 1;
            state.questionTime = Number(process.env.REACT_APP_MAXIMUM_QUESTION_TIME);
            state.questionsLimit = Number(process.env.REACT_APP_MAXIMUM_QUESTIONS);
            state.score = 0;
            state.totalSecondsLeft = 0;
        },
    },
});

export const {
    setUserName,
    setLanugage,
    setCategory,
    setDifficulty,
    incrementStreak,
    decrementQuestionTime,
    resetQuestionTime,
    incrementQuestionNo,
    incrementcorrectAnswers,
    setTotalSecondsLeft,
    resetStreak,
    resetQuestionNo,
    calcScore,
    resetState,
} = quizSlice.actions;

export default quizSlice.reducer;
