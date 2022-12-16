import { createBrowserRouter } from "react-router-dom";
import App from "../../App";
import ErrorPage from "../ErrorPage/Error";
import Question from "../Question/Question";
import Score from "../Score/Score";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/question",
        element: <Question />,
    },

    {
        path: "/score",
        element: <Score />,
    },
]);
