import { useEffect } from "react";
import { batch, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../interfaces/RootState";
import { incrementQuestionNo, resetQuestionTime, resetStreak } from "../../store/slices/quizSlice";
import Header from "../shared/Header/Header";

function Score() {
    const quizState = useSelector((state: RootState) => state.quizDetails);
    const dispatch = useDispatch();

    useEffect(() => {
        batch(() => {
            dispatch(resetStreak());
            dispatch(resetQuestionTime());
            dispatch(incrementQuestionNo());
        });

        return () => {};
    }, []);

    return (
        <>
            <Header />
            <section className="score-container">
                <h2 className="score">Total</h2>
                <span>{quizState.score}</span>
            </section>
        </>
    );
}

export default Score;
