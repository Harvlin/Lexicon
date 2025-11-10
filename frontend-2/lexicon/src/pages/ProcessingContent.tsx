import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2, Sparkles, Youtube, FileText, Brain, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { endpoints } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface ProcessingState {
  stage: 'analyzing' | 'searching' | 'transcribing' | 'generating' | 'complete' | 'error';
  message: string;
  progress: number;
}

export default function ProcessingContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [state, setState] = useState<ProcessingState>({
    stage: 'analyzing',
    message: 'Analyzing your learning preferences...',
    progress: 0
  });
  
  const [isProcessing, setIsProcessing] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const pollInterval = 2000; // Check every 2 seconds

  useEffect(() => {
    // Check if we need to trigger the processing first
    const triggerProcessing = async () => {
      const pendingPref = localStorage.getItem('lexigrain:pendingPreference');
      if (pendingPref) {
        try {
          console.log('Triggering content processing with preference:', pendingPref);
          await endpoints.process.preference(pendingPref);
          // Clear the pending flag
          localStorage.removeItem('lexigrain:pendingPreference');
        } catch (error) {
          console.error('Failed to trigger processing:', error);
        }
      }
    };

    // Trigger processing first
    triggerProcessing();
    
    // Start the processing simulation
    simulateProcessingStages();
    
    // Start polling for actual content
    const pollTimer = setTimeout(checkContentReady, 1000);

    // Track elapsed time
    const timeTracker = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    return () => {
      clearTimeout(pollTimer);
      clearInterval(timeTracker);
    };
  }, []);

  const simulateProcessingStages = () => {
    const stages = [
      { stage: 'analyzing', message: 'Analyzing your learning preferences with AI...', progress: 20, delay: 0 },
      { stage: 'searching', message: 'Searching YouTube for the best learning content...', progress: 40, delay: 3000 },
      { stage: 'transcribing', message: 'Transcribing videos for better learning experience...', progress: 60, delay: 8000 },
      { stage: 'generating', message: 'Generating your personalized learning materials...', progress: 80, delay: 15000 }
    ] as const;

    stages.forEach(({ stage, message, progress, delay }) => {
      setTimeout(() => {
        if (isProcessing) {
          setState({ stage, message, progress });
        }
      }, delay);
    });
  };

  const checkContentReady = async () => {
    if (!isProcessing) {
      return;
    }

    try {
      setRetryCount(prev => prev + 1);

      // Check if study materials are available
      const response = await endpoints.studyMaterials.videos();
      
      if (response.videos && response.videos.length > 0) {
        // Content is ready!
        setState({
          stage: 'complete',
          message: 'Your personalized content is ready!',
          progress: 100
        });
        setIsProcessing(false);
        
        toast({
          title: "✨ Content Ready!",
          description: `${response.videos.length} learning materials have been prepared for you.`,
        });

        // Wait a moment to show completion, then redirect
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1500);
      } else {
        // Not ready yet, poll again
        setTimeout(checkContentReady, pollInterval);
      }
    } catch (error) {
      // Content might not be ready yet, continue polling
      console.log('Content check:', retryCount, error);
      
      // Always continue polling until content is ready
      setTimeout(checkContentReady, pollInterval);
    }
  };



  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStageIcon = () => {
    switch (state.stage) {
      case 'analyzing':
        return <Brain className="h-16 w-16 text-primary animate-pulse" />;
      case 'searching':
        return <Youtube className="h-16 w-16 text-red-500 animate-bounce" />;
      case 'transcribing':
        return <FileText className="h-16 w-16 text-blue-500 animate-pulse" />;
      case 'generating':
        return <Sparkles className="h-16 w-16 text-purple-500 animate-pulse" />;
      case 'complete':
        return (
          <div className="relative animate-scale-in">
            <CheckCircle2 className="h-16 w-16 text-green-500 animate-bounce" />
            <div className="absolute inset-0 h-16 w-16 text-green-500 animate-ping opacity-20">
              <CheckCircle2 className="h-16 w-16" />
            </div>
            <div className="absolute -inset-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute h-2 w-2 rounded-full bg-green-500 animate-confetti"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${i * 45}deg) translateY(-30px)`,
                    animationDelay: `${i * 0.1}s`,
                    opacity: 0.6
                  }}
                />
              ))}
            </div>
          </div>
        );
      case 'error':
        return <AlertCircle className="h-16 w-16 text-orange-500" />;
      default:
        return <Loader2 className="h-16 w-16 text-primary animate-spin" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-3xl shadow-2xl animate-slide-up border-2">
        <CardContent className="p-8 sm:p-12 space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            {getStageIcon()}
          </div>

          {/* Title */}
          <div className="text-center space-y-3">
            <h1 className={`text-3xl sm:text-4xl font-heading font-bold ${
              state.stage === 'complete'
                ? 'bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 bg-clip-text text-transparent animate-scale-in'
                : 'bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent'
            }`}>
              {state.stage === 'complete' 
                ? '🎉 All Set!' 
                : state.stage === 'error'
                ? 'Almost There!'
                : 'Crafting Your Learning Experience'}
            </h1>
            <p className={`text-base sm:text-lg font-medium ${
              state.stage === 'complete' 
                ? 'text-green-600 dark:text-green-500'
                : 'text-muted-foreground'
            }`}>
              {state.message}
            </p>
          </div>

          {/* Time Elapsed */}
          {state.stage !== 'complete' && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="font-mono">{formatTime(elapsedTime)}</span>
            </div>
          )}

          {/* Progress Bar */}
          {state.stage !== 'complete' && state.stage !== 'error' && (
            <div className="space-y-3">
              <Progress value={state.progress} className="h-4" />
              <p className="text-sm text-center text-muted-foreground font-medium">
                {state.progress}% complete
              </p>
            </div>
          )}

          {/* Processing Steps Indicator */}
          {state.stage !== 'complete' && state.stage !== 'error' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
              {[
                { id: 'analyzing', label: 'AI Analysis', icon: Brain, color: 'text-primary' },
                { id: 'searching', label: 'Finding Videos', icon: Youtube, color: 'text-red-500' },
                { id: 'transcribing', label: 'Transcribing', icon: FileText, color: 'text-blue-500' },
                { id: 'generating', label: 'Creating Content', icon: Sparkles, color: 'text-purple-500' }
              ].map((step) => {
                const stages = ['analyzing', 'searching', 'transcribing', 'generating'];
                const currentIndex = stages.indexOf(state.stage);
                const stepIndex = stages.indexOf(step.id);
                const isActive = stepIndex === currentIndex;
                const isComplete = stepIndex < currentIndex;
                const Icon = step.icon;

                return (
                  <div 
                    key={step.id}
                    className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 ${
                      isActive 
                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20 scale-105' 
                        : isComplete
                        ? 'border-green-500 bg-green-500/5 shadow-md'
                        : 'border-muted bg-muted/10'
                    }`}
                  >
                    {isComplete && (
                      <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                        <CheckCircle2 className="h-3 w-3 text-white" />
                      </div>
                    )}
                    <Icon className={`h-6 w-6 transition-all duration-300 ${
                      isActive 
                        ? `${step.color} animate-pulse` 
                        : isComplete 
                        ? 'text-green-500' 
                        : 'text-muted-foreground'
                    }`} />
                    <span className={`text-xs sm:text-sm font-semibold text-center leading-tight ${
                      isActive 
                        ? 'text-foreground' 
                        : isComplete
                        ? 'text-green-600 dark:text-green-500'
                        : 'text-muted-foreground'
                    }`}>
                      {step.label}
                    </span>
                    {isActive && (
                      <div className="absolute inset-0 rounded-xl border-2 border-primary animate-pulse opacity-50" />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Info Box */}
          <div className={`rounded-xl p-5 space-y-2 border transition-all duration-500 ${
            state.stage === 'complete'
              ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30 animate-scale-in'
              : 'bg-gradient-to-br from-muted/50 to-muted/30 border-muted'
          }`}>
            <p className="text-sm sm:text-base text-center leading-relaxed font-medium">
              {state.stage === 'complete' 
                ? '✨ Your personalized learning dashboard is ready! Redirecting you now...'
                : 'Hang tight! We\'re using AI to curate the perfect learning materials tailored to your interests and goals.'}
            </p>
            {state.stage !== 'complete' && retryCount > 0 && (
              <div className="flex items-center justify-center gap-2 pt-1">
                <div className="flex gap-1">
                  <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  Processing... ({retryCount} checks)
                </span>
              </div>
            )}
          </div>

          {/* What's happening behind the scenes */}
          <div className="border-t border-dashed pt-6 space-y-4">
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-muted" />
              <h3 className="text-sm font-bold text-center uppercase tracking-wider text-muted-foreground">
                Behind The Scenes
              </h3>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-muted" />
            </div>
            <div className="grid gap-3 text-xs sm:text-sm">
              {[
                { text: 'AI analyzes your goals and interests using Ollama', done: state.progress >= 20 },
                { text: 'Finding the best YouTube videos for your learning path', done: state.progress >= 40 },
                { text: 'Transcribing videos for searchable, accessible content', done: state.progress >= 60 },
                { text: 'AI generates personalized quizzes and flashcards', done: state.progress >= 80 }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-500 ${
                    item.done 
                      ? 'bg-green-500/10 border border-green-500/20' 
                      : 'bg-muted/20 border border-transparent'
                  }`}
                >
                  <CheckCircle2 className={`h-5 w-5 mt-0.5 flex-shrink-0 transition-colors duration-300 ${
                    item.done ? 'text-green-500' : 'text-muted-foreground/50'
                  }`} />
                  <span className={`transition-colors duration-300 ${
                    item.done ? 'text-foreground font-medium' : 'text-muted-foreground'
                  }`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
