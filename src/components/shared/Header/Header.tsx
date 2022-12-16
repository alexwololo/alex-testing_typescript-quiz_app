import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../../interfaces/RootState";
import { resetState } from "../../../store/slices/quizSlice";

function Header() {
    const quizState = useSelector((state: RootState) => state.quizDetails);
    const dispatch = useDispatch();
    return (
        <header>
            <nav>
                <Link to="/" onClick={() => dispatch(resetState())}>
                    <span>&#8249;</span> Back
                </Link>
            </nav>

            {quizState.questionNo <= quizState.questionsLimit && (
                <div className="question-timer">{quizState.questionTime}sec</div>
            )}
        </header>
    );
}

export default Header;
