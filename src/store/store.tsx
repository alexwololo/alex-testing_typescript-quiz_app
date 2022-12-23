import { configureStore } from "@reduxjs/toolkit";
import quizReducer from "./slices/quizSlice";
import notificationReducer from "./slices/notificationSlice";

export const store = configureStore({
    reducer: {
        quizDetails: quizReducer,
        notification: notificationReducer,
    },
});
