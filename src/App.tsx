import { FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./App.css";
import Category from "./components/shared/Category/Category";
import { RootState } from "./interfaces/RootState";
import { setDifficulty, setLanugage } from "./store/slices/quizSlice";

function App() {
    const quizState = useSelector((state: RootState) => state.quizDetails);
    const dispatch = useDispatch();

    const handleLanguage = (language: string): void => {
        dispatch(setLanugage(language));
    };

    const handleDifficult = (difficulty: string): void => {
        dispatch(setDifficulty(difficulty));
    };

    const handleForm = (e: FormEvent) => {
        e.preventDefault();
    };

    return (
        <section>
            <form action="#" className="quiz-detail-form" onSubmit={handleForm}>
                {/* USER NAME */}
                <input type="text" name="username" id="username" placeholder="Enter Player Name" />

                {/* LANGUAGE */}
                <div className="form-group gap">
                    <div className="form-group gap form-group-entity">
                        <div className="toggle custom-radio">
                            <input
                                name="language"
                                value="swedish"
                                id="custom-radio-swedish"
                                className="custom-radio-input"
                                type="radio"
                                checked={quizState.language === "swedish"}
                                onChange={(e) => handleLanguage("swedish")}
                            />
                            <label className="toggle-item" htmlFor="custom-radio-swedish"></label>
                        </div>
                        <label
                            htmlFor="custom-radio-swedish"
                            className={`style-primary ${
                                quizState.language === "swedish" ? "active" : ""
                            }`}
                            onClick={(e) => handleLanguage("swedish")}
                        >
                            Swedish
                        </label>
                    </div>

                    <div className="form-group gap form-group-entity">
                        <div className="toggle custom-radio">
                            <input
                                name="language"
                                value="english"
                                id="custom-radio-english"
                                className="custom-radio-input"
                                type="radio"
                                checked={quizState.language === "english"}
                                onChange={(e) => handleLanguage("english")}
                            />
                            <label className="toggle-item" htmlFor="custom-radio-english"></label>
                        </div>
                        <label
                            htmlFor="custom-radio-english"
                            className={`style-primary ${
                                quizState.language === "english" ? "active" : ""
                            }`}
                            onClick={(e) => handleLanguage("english")}
                        >
                            English
                        </label>
                    </div>
                </div>

                {/* CATEGORY */}
                <Category />

                {/* DIFFICULTY */}
                <div className="form-group">
                    <div className="form-group-entity">
                        <label
                            className={`style-primary ${
                                quizState.difficulty === "easy" ? "active" : ""
                            }`}
                            htmlFor="easy"
                            onClick={(e) => handleDifficult("easy")}
                        >
                            Easy
                        </label>
                        <input type="radio" name="difficulty" id="easy" value="easy" />
                    </div>

                    <div className="form-group-entity">
                        <label
                            className={`style-primary ${
                                quizState.difficulty === "medium" ? "active" : ""
                            }`}
                            htmlFor="medium"
                            onClick={(e) => handleDifficult("medium")}
                        >
                            Medium
                        </label>
                        <input type="radio" name="difficulty" id="medium" value="medium" />
                    </div>

                    <div className="form-group-entity">
                        <label
                            className={`style-primary ${
                                quizState.difficulty === "hard" ? "active" : ""
                            }`}
                            htmlFor="hard"
                            onClick={(e) => handleDifficult("hard")}
                        >
                            Hard
                        </label>
                        <input type="radio" name="difficulty" id="hard" value="hard" />
                    </div>

                    <div className="form-group-entity">
                        <label
                            className={`style-primary ${
                                quizState.difficulty === "random" ? "active" : ""
                            }`}
                            htmlFor="random"
                            onClick={(e) => handleDifficult("random")}
                        >
                            Random
                        </label>
                        <input type="radio" name="difficulty" id="random" value="random" />
                    </div>
                </div>

                <Link to="/question" className="style-primary">
                    Start
                </Link>
            </form>
        </section>
    );
}

export default App;
