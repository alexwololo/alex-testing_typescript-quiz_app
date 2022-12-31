export default function calculateScore(
    seconds: number,
    difficultyPoints: number,
    correctAnswers: number,
    answerStreak: number
) {
    let totalScore = seconds * difficultyPoints + correctAnswers + answerStreak;
    return totalScore;
}
