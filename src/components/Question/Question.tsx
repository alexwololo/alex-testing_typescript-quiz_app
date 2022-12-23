import React, { memo, useRef } from "react";
import { shuffleArray } from "../../utils/shuffleArray";
import { QuestionInterface } from "../../interfaces/QuestionInterface";

interface QuestionProps {
    questionNo: number;
    question: QuestionInterface;
    handleAnswer: Function;
}

function Question({ questionNo, question, handleAnswer }: QuestionProps) {
    const questionOptions = useRef(
        shuffleArray([...question.incorrect_answers, question.correct_answer])
    );

    return (
        <article className="question-info">
            <div className="question-statement">
                <h4 data-testid="question-no">Question No {questionNo}</h4>
                <h2 className="question-heading" data-testid="question-question">
                    {question.question}
                </h2>
            </div>

            <ul className="question-options" data-testid="question-options">
                {questionOptions.current.map((ans: string, i: number) => (
                    <li className="style-primary" key={i} onClick={() => handleAnswer(ans)}>
                        {ans}
                    </li>
                ))}
            </ul>
        </article>
    );
}

export default memo(Question);
