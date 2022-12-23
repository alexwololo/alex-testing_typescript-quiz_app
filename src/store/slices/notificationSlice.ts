import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    message: "",
    error: false,
    show: false,
};

export const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setError: (state, { payload }) => {
            state.error = payload;
        },
        setMessage: (state, { payload }) => {
            state.message = payload;
        },
        showNotification: (state, { payload }) => {
            state.show = payload;
        },
    },
});

export const { setError, setMessage, showNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
