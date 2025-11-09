import { useEffect, useMemo, useState } from "react";
import { Check, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { mockQuizQuestions } from "@/lib/mockData";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { endpoints } from "@/lib/api";
import type { QuizAnswerDTO, QuizQuestionDTO, QuizSubmissionResultDTO } from "@/lib/types";

type Answer = {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
};

export function Quiz() {
  const { id } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestionDTO[]>([]);
  const [serverResult, setServerResult] = useState<QuizSubmissionResultDTO | null>(null);
  const isStudyVideo = useMemo(() => !!id && id.startsWith('api-video-'), [id]);

  useEffect(() => {
    if (!id) {
      setQuestions(mockQuizQuestions);
      return;
    }
    if (isStudyVideo) {
      const numericId = Number(id.replace('api-video-', ''));
      if (Number.isNaN(numericId)) {
        setQuestions(mockQuizQuestions);
        return;
      }
      endpoints.studyMaterials
        .videoQuestions(numericId)
        .then(res => {
          const poolAnswers = res.questions?.map(q => q.answer).filter(Boolean) || [];
          const mapToMC = (answer: string, idx: number): QuizQuestionDTO => {
            // Build distractors from other answers in the pool
            const others = poolAnswers.filter((a, i) => i !== idx);
            const distractors: string[] = [];
            for (const a of others) {
              if (distractors.length >= 3) break;
              if (!distractors.includes(a) && a.trim().length > 0) distractors.push(a);
            }
            // If not enough distractors, create simple variations
            while (distractors.length < 3) {
              const fragment = answer.split(' ').slice(0, Math.max(2, Math.min(5, Math.floor(answer.split(' ').length / 2)))).join(' ');
              const variant = fragment ? `${fragment} ...` : 'N/A';
              if (!distractors.includes(variant)) distractors.push(variant);
              else break;
            }
            const options = [answer, ...distractors].slice(0, Math.max(2, Math.min(4, 1 + distractors.length)));
            // Shuffle options
            const shuffled = [...options].sort(() => Math.random() - 0.5);
            const correctIndex = shuffled.findIndex(o => o === answer);
            return {
              id: `${numericId}-q-${idx + 1}`,
              question: res.questions?.[idx]?.question || `Question ${idx + 1}`,
              options: shuffled,
              correctAnswer: correctIndex >= 0 ? correctIndex : 0,
              explanation: answer,
            };
          };
          const mapped = (res.questions || []).map((q, i) => mapToMC(q.answer, i));
          setQuestions(mapped.length > 0 ? mapped : mockQuizQuestions);
        })
        .catch(() => setQuestions(mockQuizQuestions));
    } else {
      endpoints.lessons
        .quiz(id)
        .then(setQuestions)
        .catch(() => setQuestions(mockQuizQuestions));
    }
  }, [id, isStudyVideo]);

  const question = questions[currentQuestion] || mockQuizQuestions[currentQuestion];
  const total = questions.length || mockQuizQuestions.length;
  const progress = ((currentQuestion + 1) / total) * 100;
  const currentAnswer = answers.find((a) => a.questionId === question.id);

  const handleOptionSelect = (optionIndex: number) => {
    if (currentAnswer) return;
    setSelectedOption(optionIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;

    const isCorrect = selectedOption === question.correctAnswer;
    const answer: Answer = {
      questionId: question.id,
      selectedOption,
      isCorrect,
    };

    setAnswers([...answers, answer]);
    setShowExplanation(true);

    if (isCorrect) {
      toast.success("Correct! 🎉", {
        description: "Great job! Keep it up.",
      });
    } else {
      toast.error("Not quite right", {
        description: "Check the explanation below.",
      });
    }
  };

  const handleNext = () => {
    if (currentQuestion < total - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      // Submit to backend for final scoring when available; otherwise compute locally
      if (id && !isStudyVideo) {
        const payload: QuizAnswerDTO[] = answers.map(a => ({ questionId: a.questionId, selectedOption: a.selectedOption }));
        endpoints.lessons
          .submitQuiz(id, payload)
          .then((res) => {
            setServerResult(res);
            setIsCompleted(true);
          })
          .catch(() => {
            setIsCompleted(true);
          });
      } else {
        setIsCompleted(true);
      }
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedOption(null);
    setShowExplanation(false);
    setIsCompleted(false);
  };

  if (isCompleted) {
  const correctAnswers = answers.filter((a) => a.isCorrect).length;
  const score = serverResult ? serverResult.score : (correctAnswers / total) * 100;

    return (
      <div className="space-y-6 animate-scale-in">
        <Card className="bg-gradient-primary text-primary-foreground">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4 animate-float">
              {score >= 80 ? "🎉" : score >= 60 ? "👍" : "📚"}
            </div>
            <h2 className="text-3xl font-heading font-bold mb-2">
              Quiz Completed!
            </h2>
            <p className="text-lg opacity-90 mb-6">
              You scored {serverResult ? serverResult.correct : correctAnswers} out of {serverResult ? serverResult.total : total}
            </p>
            <div className="text-5xl font-bold mb-2">{Math.round(score)}%</div>
            {serverResult?.pointsAwarded !== undefined && (
              <p className="opacity-90 mt-2">+{serverResult.pointsAwarded} pts</p>
            )}
            <p className="opacity-90">
              {score >= 80
                ? "Excellent work!"
                : score >= 60
                ? "Good effort!"
                : "Keep practicing!"}
            </p>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleRetry}
            className="flex-1"
          >
            Retry Quiz
          </Button>
          <Button
            className="flex-1 bg-accent hover:bg-accent-hover"
          >
            Continue Learning
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {total}
          </span>
          <span className="text-sm font-medium text-primary">
            {answers.filter((a) => a.isCorrect).length} correct
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-heading font-semibold mb-6">
            {question?.question}
          </h3>

          <div className="space-y-3">
            {(question?.options || []).map((option, index) => {
              const isSelected = selectedOption === index;
              const isCorrect = index === question!.correctAnswer;
              const showResult = currentAnswer !== undefined;

              return (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  disabled={showResult}
                  className={cn(
                    "w-full p-4 text-left rounded-lg border-2 transition-all",
                    "hover:border-primary hover:bg-primary/5",
                    isSelected && !showResult && "border-primary bg-primary/5",
                    showResult && isCorrect && "border-success bg-success/10",
                    showResult && isSelected && !isCorrect && "border-destructive bg-destructive/10",
                    showResult && !isSelected && !isCorrect && "opacity-50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex-1">{option}</span>
                    {showResult && isCorrect && (
                      <Check className="h-5 w-5 text-success" />
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <X className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="mt-6 p-4 rounded-lg bg-muted animate-slide-up">
              <p className="text-sm font-medium mb-2">Explanation:</p>
              <p className="text-sm text-muted-foreground">
                {question?.explanation}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        {!showExplanation ? (
          <Button
            onClick={handleSubmitAnswer}
            disabled={selectedOption === null}
            className="bg-accent hover:bg-accent-hover"
          >
            Submit Answer
          </Button>
        ) : (
          <Button onClick={handleNext} className="bg-accent hover:bg-accent-hover">
            {currentQuestion < total - 1 ? "Next Question" : "View Results"}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
