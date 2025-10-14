import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { mockFlashcards } from "@/lib/mockData";
import { useParams } from "react-router-dom";
import { endpoints } from "@/lib/api";
import type { FlashcardDTO } from "@/lib/types";

export function Flashcards() {
  const { id } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedCards, setCompletedCards] = useState<Set<number>>(new Set());
  const [cards, setCards] = useState<FlashcardDTO[]>([]);

  useEffect(() => {
    if (!id) {
      setCards(mockFlashcards);
      return;
    }
    endpoints.lessons
      .flashcards(id)
      .then(setCards)
      .catch(() => setCards(mockFlashcards));
  }, [id]);

  const total = cards.length || mockFlashcards.length;
  const currentCard = (cards[currentIndex] || mockFlashcards[currentIndex]);
  const progress = (completedCards.size / total) * 100;

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < total - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleFlip = () => {
    if (!isFlipped) {
      setCompletedCards(new Set(completedCards).add(currentIndex));
    }
    setIsFlipped(!isFlipped);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setCompletedCards(new Set());
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Card {currentIndex + 1} of {total}
          </span>
          <span className="text-sm font-medium text-primary">
            {completedCards.size} reviewed
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div
        className="perspective-1000 cursor-pointer"
        onClick={handleFlip}
      >
        <Card
          className={cn(
            "relative h-80 transition-all duration-500 transform-style-3d",
            isFlipped && "rotate-y-180"
          )}
        >
          <CardContent className="absolute inset-0 p-8 backface-hidden flex items-center justify-center">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">
                Question
              </p>
              <h3 className="text-xl font-heading font-semibold">
                {currentCard.front}
              </h3>
              <p className="text-sm text-muted-foreground mt-6">
                Click to reveal answer
              </p>
            </div>
          </CardContent>

          <CardContent className="absolute inset-0 p-8 backface-hidden rotate-y-180 bg-primary/5 flex items-center justify-center">
            <div className="text-center">
              <p className="text-xs text-primary mb-4 uppercase tracking-wider font-medium">
                Answer
              </p>
              <p className="text-base leading-relaxed">
                {currentCard.back}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleReset}
          title="Reset progress"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        <Button
          onClick={handleNext}
          disabled={currentIndex === total - 1}
          className="bg-accent hover:bg-accent-hover"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
