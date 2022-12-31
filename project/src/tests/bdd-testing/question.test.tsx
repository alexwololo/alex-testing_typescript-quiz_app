import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Question from "../../components/Question/Question";

describe("Question Test", () => {
    const questionState = {
        category: "General Knowledge",
        type: "multiple",
        difficulty: "easy",
        question: "What is the nickname of the US state of California?",
        correct_answer: "Golden State",
        incorrect_answers: ["Sunshine State", "Bay State", "Treasure State"],
    };

    const handleAnswer = (ans: string) => {
        console.log(ans);
    };

    test("1: Should show question no", () => {
        render(<Question questionNo={1} question={questionState} handleAnswer={handleAnswer} />);

        const questionContainer = screen.getByTestId("question-no");
        expect(questionContainer).toBeInTheDocument();
        expect(questionContainer).toHaveTextContent("Question No 1");
    });

    test("2: Should show question", () => {
        render(<Question questionNo={1} question={questionState} handleAnswer={handleAnswer} />);

        const questionContainer = screen.getByTestId("question-question");
        expect(questionContainer).toBeInTheDocument();
    });

    test("3: Should question be equal to", () => {
        render(<Question questionNo={1} question={questionState} handleAnswer={handleAnswer} />);

        const questionContainer = screen.getByTestId("question-question");
        expect(questionContainer).toHaveTextContent(
            "What is the nickname of the US state of California?"
        );
    });

    test("4: Should question options be equal to length 4", () => {
        render(<Question questionNo={1} question={questionState} handleAnswer={handleAnswer} />);

        const questionContainer = screen.getByTestId("question-options");
        expect(questionContainer.childElementCount).toBe(4);
    });
});
