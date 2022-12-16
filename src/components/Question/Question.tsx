import React, { useEffect, useRef, useState } from "react";
import { batch, useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../../interfaces/RootState";
import {
    calcScore,
    decrementQuestionTime,
    incrementcorrectAnswers,
    incrementQuestionNo,
    incrementStreak,
    resetQuestionTime,
    resetStreak,
    setCategory,
    setTotalSecondsLeft,
} from "../../store/slices/quizSlice";
import { shuffleArray } from "../../utils/shuffleArray";
import Category from "../shared/Category/Category";
import Header from "../shared/Header/Header";
import Notification from "../shared/Notification/Notification";

interface QuestionInterface {
    loading: boolean;
    showCategory: boolean;
    showNotification: boolean;
    notificationMessage: string;
    notificationError: boolean;

    category: string;
    type: string;
    difficulty: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
}

function Question() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const quizState = useSelector((state: RootState) => state.quizDetails);
    const options: any = useRef([]);
    const timerRef: any = useRef();
    const timeoutRef: any = useRef();
    const notificationTimeRef: any = useRef();
    const questionDifficultyLevel: any = useRef("");

    const [questionState, setQuestionState] = useState<QuestionInterface>({
        loading: true,
        showCategory: false,
        showNotification: true,
        notificationMessage: "Fetching DATA...",
        notificationError: false,

        category: "",
        type: "",
        difficulty: "",
        question: "",
        correct_answer: "",
        incorrect_answers: [],
    });

    function calculateScore() {
        let totalScore =
            quizState.totalSecondsLeft *
                Number(
                    process.env[
                        `REACT_APP_DIFFICULTY_POINTS_${questionDifficultyLevel.current.toUpperCase()}`
                    ]
                ) +
            quizState.correctAnswers +
            (quizState.answerStreak >= 3 ? quizState.answerStreak : 0);

        return totalScore;
    }

    function categoryCallback(category: string) {
        if (!timeoutRef.current) {
            timeoutRef.current = setTimeout(() => {
                setQuestionState((prevState) => ({
                    ...prevState,
                    showCategory: false,
                }));

                batch(() => {
                    dispatch(incrementcorrectAnswers());
                    dispatch(incrementStreak());
                    dispatch(setTotalSecondsLeft(quizState.questionTime));
                    dispatch(setCategory(category));
                    dispatch(resetQuestionTime());
                    dispatch(incrementQuestionNo());
                });
            }, 3 * 1000);
        }
    }

    function clearTimer() {
        clearInterval(timerRef.current);
        timerRef.current = null;
    }

    function setTimerForNotification() {
        if (notificationTimeRef.current) {
            clearTimeout(notificationTimeRef.current);
            notificationTimeRef.current = null;
        }
        notificationTimeRef.current = setTimeout(() => {
            setQuestionState((prevState) => ({
                ...prevState,
                showNotification: false,
            }));
        }, 2000);
    }

    const handleAnswer = (ans: string) => {
        clearTimer();

        if (!questionState.showCategory) {
            // IF ITS LAST QUESTION
            if (quizState.questionNo >= quizState.questionsLimit) {
                if (ans === questionState.correct_answer) {
                    batch(() => {
                        dispatch(incrementcorrectAnswers());
                        dispatch(incrementStreak());
                        dispatch(resetQuestionTime());
                        dispatch(setTotalSecondsLeft(quizState.questionTime));
                        dispatch(calcScore(calculateScore()));
                    });
                    navigate("/score");
                } else {
                    batch(() => {
                        dispatch(resetStreak());
                        dispatch(resetQuestionTime());
                        dispatch(calcScore(calculateScore()));
                    });
                    navigate("/score");
                }
            } else {
                if (ans === questionState.correct_answer) {
                    setQuestionState((prevState) => ({
                        ...prevState,
                        showCategory: true,
                    }));
                } else {
                    batch(() => {
                        dispatch(resetStreak());
                        dispatch(resetQuestionTime());
                        dispatch(incrementQuestionNo());
                    });
                }
            }
        }
    };

    useEffect(() => {
        setQuestionState((prevState) => ({
            ...prevState,
            loading: true,
            notificationError: false,
            showNotification: true,
            notificationMessage: "FETCHING DATA...",
        }));
        setTimerForNotification();
        (async () => {
            try {
                // IF USER HAS SELECTED RANDOM DIFFICULTY
                questionDifficultyLevel.current = quizState.difficulty;
                let difficultyArray = ["easy", "medium", "hard"];
                if (questionDifficultyLevel.current === "random") {
                    questionDifficultyLevel.current =
                        difficultyArray[Math.floor(Math.random() * difficultyArray.length)];
                }

                // FETCH QUESTION
                const fetchResult = await fetch(
                    `https://opentdb.com/api.php?amount=1&category=${quizState.category}&difficulty=${questionDifficultyLevel.current}&type=multiple`
                );
                const data = await fetchResult.json();

                // SAVE QUESTION
                setQuestionState((prevState) => ({
                    ...prevState,
                    ...data.results[0],
                    loading: false,
                    showNotification: true,
                    notificationError: false,
                    notificationMessage: "API RESPONSIVE",
                }));
                setTimerForNotification();

                // MAKE OPTIONS RANDOM
                options.current = shuffleArray([
                    ...data.results[0].incorrect_answers,
                    data.results[0].correct_answer,
                ]);

                timeoutRef.current = null;

                // START TIMER
                if (!timerRef.current) {
                    timerRef.current = setInterval(() => {
                        dispatch(decrementQuestionTime());
                    }, 1000);
                }
            } catch (err) {
                console.log(err);
                setQuestionState((prevState) => ({
                    ...prevState,
                    loading: false,
                    showCategory: false,
                    showNotification: true,
                    notificationError: true,
                    notificationMessage: "API UNRESPONSIVE",
                }));
                setTimerForNotification();
            }
        })();

        return () => {
            clearInterval(timerRef.current);
        };
    }, [quizState.questionNo]);

    // IF TIME OVER
    if (quizState.questionTime <= 0) {
        clearTimer(); // CLEAR TIMER

        if (quizState.questionNo >= quizState.questionsLimit) {
            dispatch(calcScore(calculateScore()));
            navigate("/score");
        } else {
            // ASK NEW QUESTION & START TIMER AGAIN
            batch(() => {
                dispatch(incrementQuestionNo());
                dispatch(resetQuestionTime());
                dispatch(resetStreak());
            });
        }
    }

    return (
        <>
            {questionState.showNotification && (
                <Notification
                    message={questionState.notificationMessage}
                    error={questionState.notificationError}
                />
            )}
            {!questionState.loading ? (
                <section className="question-container">
                    <Header />

                    <article className="question-info">
                        <div className="question-statement">
                            <h4>QUESTION {quizState.questionNo}</h4>
                            <h2 className="question-heading">{questionState.question}</h2>
                        </div>

                        <ul className="question-options">
                            {options.current.map((ans: string, i: number) => (
                                <li
                                    className="style-primary"
                                    key={i}
                                    onClick={() => handleAnswer(ans)}
                                >
                                    {ans}
                                </li>
                            ))}
                        </ul>
                    </article>
                    {questionState.showCategory && <Category categoryCallback={categoryCallback} />}
                </section>
            ) : (
                <span className="loading">Loading...</span>
            )}
        </>
    );
}

export default Question;
