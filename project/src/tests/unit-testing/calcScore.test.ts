import calculateScore from "../../utils/calculateScore";

describe("CalculateScore", () => {
    test("Calculate Score when (Seconds: 5, Difficulty: 3, Correct Answers: 2, Answer Streak: 0", () => {
        expect(calculateScore(5, 3, 2, 0)).toBe(17);
    });
});
