import { createBrowserRouter } from "react-router-dom";
import App from "../../App";
import ErrorPage from "../ErrorPage/Error";
import Score from "../Score/Score";
import QuestionContainer from "../Question/QuestionContainer";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/question",
        element: <QuestionContainer />,
    },

    {
        path: "/score",
        element: <Score />,
    },
]);
