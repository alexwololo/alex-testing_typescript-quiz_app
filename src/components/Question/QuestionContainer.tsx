import React, { useEffect, useRef, useState } from "react";
import { batch, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
import Category from "../shared/Category/Category";
import Header from "../shared/Header/Header";
import calculateScore from "../../utils/calculateScore";
import { setError, setMessage, showNotification } from "../../store/slices/notificationSlice";
import Notification from "../shared/Notification/Notification";
import Question from "./Question";
import { unstable_batchedUpdates } from "react-dom";
import { QuestionInterface } from "../../interfaces/QuestionInterface";

interface QuestionContainerInterface {
    loading: boolean;
    showCategory: boolean;
}

let difficultyArray = ["easy", "medium", "hard"];

function QuestionContainer() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const quizState = useSelector((state: RootState) => state.quizDetails);
    const notification = useSelector((state: RootState) => state.notification);

    const timerRef: any = useRef(); // QUESTION TIMER
    const timeoutRef: any = useRef(); // CATERGORY TIMEOUT
    const notificationTimeRef: any = useRef(); // HIDE NOTIFICATION TIMER
    const questionDifficultyLevel: any = useRef(
        quizState.difficulty === "random"
            ? difficultyArray[Math.floor(Math.random() * difficultyArray.length)]
            : quizState.difficulty
    );

    const [questionContainerState, setQuestionContainerState] =
        useState<QuestionContainerInterface>({
            loading: true,
            showCategory: false,
        });

    const [question, setQuestion] = useState<QuestionInterface>({
        category: "",
        type: "",
        difficulty: "",
        question: "",
        correct_answer: "",
        incorrect_answers: [],
    });

    function categoryCallback(category: string) {
        // USING TIMEOUT REF SO THAT IF USER CONSTANTLY CLICK ON ANY BUTTON THAT DOESN'T WORK
        if (!timeoutRef.current) {
            timeoutRef.current = setTimeout(() => {
                setQuestionContainerState((prevState) => ({
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
        // IF THERE WAS ALREADY A NOTIFICATION THEN REMOVE ITS TIMER AND ADD NEW TIMER
        if (notificationTimeRef.current) {
            clearTimeout(notificationTimeRef.current);
            notificationTimeRef.current = null;
        }
        notificationTimeRef.current = setTimeout(() => {
            batch(() => {
                dispatch(showNotification(false));
                dispatch(setError(false));
                dispatch(setMessage(""));
            });
        }, 2000);
    }

    const handleAnswer = (ans: string) => {
        clearTimer();

        if (!questionContainerState.showCategory) {
            // IF ITS LAST QUESTION
            if (quizState.questionNo >= quizState.questionsLimit) {
                if (ans === question.correct_answer) {
                    batch(() => {
                        dispatch(incrementcorrectAnswers());
                        dispatch(incrementStreak());
                        dispatch(resetQuestionTime());
                        dispatch(setTotalSecondsLeft(quizState.questionTime));

                        dispatch(
                            calcScore(
                                calculateScore(
                                    quizState.totalSecondsLeft,
                                    Number(
                                        process.env[
                                            `REACT_APP_DIFFICULTY_POINTS_${questionDifficultyLevel.current.toUpperCase()}`
                                        ]
                                    ),
                                    quizState.correctAnswers,
                                    quizState.answerStreak >= 3 ? quizState.answerStreak : 0
                                )
                            )
                        );
                    });
                    navigate("/score");
                } else {
                    batch(() => {
                        dispatch(resetStreak());
                        dispatch(resetQuestionTime());
                        dispatch(
                            calcScore(
                                calculateScore(
                                    quizState.totalSecondsLeft,
                                    Number(
                                        process.env[
                                            `REACT_APP_DIFFICULTY_POINTS_${questionDifficultyLevel.current.toUpperCase()}`
                                        ]
                                    ),
                                    quizState.correctAnswers,
                                    quizState.answerStreak >= 3 ? quizState.answerStreak : 0
                                )
                            )
                        );
                    });
                    navigate("/score");
                }
            } else {
                if (ans === question.correct_answer) {
                    setQuestionContainerState((prevState) => ({
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
        setQuestionContainerState((prevState) => ({
            ...prevState,
            loading: true,
        }));

        setTimerForNotification();
        batch(() => {
            dispatch(showNotification(true));
            dispatch(setError(false));
            dispatch(setMessage("FETCHING DATA..."));
        });

        (async () => {
            try {
                // FETCH QUESTION
                const fetchResult = await fetch(
                    `https://opentdb.com/api.php?amount=1&category=${quizState.category}&difficulty=${questionDifficultyLevel.current}&type=multiple`
                );
                const data = await fetchResult.json();

                // SAVE QUESTION
                unstable_batchedUpdates(() => {
                    setQuestion({
                        ...data.results[0],
                    });
                    setQuestionContainerState((prevState) => ({ ...prevState, loading: false }));
                });

                setTimerForNotification();
                batch(() => {
                    dispatch(showNotification(true));
                    dispatch(setError(false));
                    dispatch(setMessage("API RESPONSIVE"));
                });

                timeoutRef.current = null;

                // START TIMER
                if (!timerRef.current) {
                    timerRef.current = setInterval(() => {
                        dispatch(decrementQuestionTime());
                    }, 1000);
                }
            } catch (err) {
                console.log(err);

                setQuestionContainerState({
                    loading: false,
                    showCategory: false,
                });
                setTimerForNotification();

                batch(() => {
                    dispatch(showNotification(true));
                    dispatch(setError(true));
                    dispatch(setMessage("API UNRESPONSIVE"));
                });
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
            dispatch(
                calcScore(
                    calculateScore(
                        quizState.totalSecondsLeft,
                        Number(
                            process.env[
                                `REACT_APP_DIFFICULTY_POINTS_${questionDifficultyLevel.current.toUpperCase()}`
                            ]
                        ),
                        quizState.correctAnswers,
                        quizState.answerStreak >= 3 ? quizState.answerStreak : 0
                    )
                )
            );
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
            {notification.show && <Notification />}

            {questionContainerState.loading ? (
                <span className="loading">Loading...</span>
            ) : (
                <section className="question-container" data-testid="question-container">
                    <Header />

                    <Question
                        questionNo={quizState.questionNo}
                        question={question}
                        handleAnswer={handleAnswer}
                    />

                    {questionContainerState.showCategory && (
                        <Category categoryCallback={categoryCallback} />
                    )}
                </section>
            )}
        </>
    );
}

export default QuestionContainer;
