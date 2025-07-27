import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  Brain, 
  Target, 
  Clock, 
  BookOpen,
  Zap,
  Calendar,
  Trophy,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/providers/AuthProvider';

interface OnboardingStep {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
}

const Onboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState({
    dailyGoal: 30,
    preferredTime: 'morning',
    difficulty: 'intermediate',
    interests: [] as string[]
  });
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const steps: OnboardingStep[] = [
    {
      id: 0,
      title: "Welcome to AI Learn!",
      subtitle: "Let's personalize your learning experience",
      icon: Brain
    },
    {
      id: 1,
      title: "Set Your Daily Goal",
      subtitle: "How much time can you dedicate to learning?",
      icon: Target
    },
    {
      id: 2,
      title: "Choose Your Learning Time",
      subtitle: "When do you learn best?",
      icon: Clock
    },
    {
      id: 3,
      title: "Select Your Interests",
      subtitle: "What would you like to focus on?",
      icon: BookOpen
    },
    {
      id: 4,
      title: "All Set!",
      subtitle: "Your personalized learning plan is ready",
      icon: CheckCircle
    }
  ];

  const dailyGoalOptions = [
    { value: 15, label: '15 min', description: 'Quick learner' },
    { value: 30, label: '30 min', description: 'Steady progress' },
    { value: 45, label: '45 min', description: 'Dedicated learner' },
    { value: 60, label: '1 hour', description: 'Power learner' }
  ];

  const timeOptions = [
    { value: 'morning', label: 'Morning', icon: '🌅', description: '6 AM - 12 PM' },
    { value: 'afternoon', label: 'Afternoon', icon: '☀️', description: '12 PM - 6 PM' },
    { value: 'evening', label: 'Evening', icon: '🌆', description: '6 PM - 10 PM' },
    { value: 'night', label: 'Night', icon: '🌙', description: '10 PM - 2 AM' }
  ];

  const interestOptions = [
    { id: 'frontend', label: 'Frontend Development', color: 'bg-blue-500' },
    { id: 'backend', label: 'Backend Development', color: 'bg-green-500' },
    { id: 'mobile', label: 'Mobile Development', color: 'bg-purple-500' },
    { id: 'ai-ml', label: 'AI & Machine Learning', color: 'bg-pink-500' },
    { id: 'design', label: 'UI/UX Design', color: 'bg-orange-500' },
    { id: 'data', label: 'Data Science', color: 'bg-cyan-500' },
    { id: 'devops', label: 'DevOps', color: 'bg-red-500' },
    { id: 'cybersecurity', label: 'Cybersecurity', color: 'bg-indigo-500' }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Update user profile with preferences
    updateProfile({
      ...user,
      preferences: preferences
    } as any);
    
    navigate('/dashboard');
  };

  const toggleInterest = (interestId: string) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-neural-cyan/5" />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-gradient-ai">AI Learn</span>
          </div>
          <Progress value={progress} className="w-full max-w-md mx-auto h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        {/* Content Card */}
        <Card className="card-gradient border-border/50 shadow-elegant">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                {/* Step Header */}
                <div className="mb-8">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <CurrentIcon className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{steps[currentStep].title}</h2>
                  <p className="text-muted-foreground">{steps[currentStep].subtitle}</p>
                </div>

                {/* Step Content */}
                <div className="mb-8">
                  {currentStep === 0 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <Zap className="h-8 w-8 text-neural-cyan mx-auto mb-2" />
                          <h3 className="font-semibold mb-1">AI-Powered</h3>
                          <p className="text-sm text-muted-foreground">Personalized learning paths</p>
                        </div>
                        <div className="text-center">
                          <Calendar className="h-8 w-8 text-neural-purple mx-auto mb-2" />
                          <h3 className="font-semibold mb-1">Flexible</h3>
                          <p className="text-sm text-muted-foreground">Learn at your own pace</p>
                        </div>
                        <div className="text-center">
                          <Trophy className="h-8 w-8 text-warning mx-auto mb-2" />
                          <h3 className="font-semibold mb-1">Gamified</h3>
                          <p className="text-sm text-muted-foreground">Earn badges and rewards</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 1 && (
                    <div className="grid grid-cols-2 gap-4">
                      {dailyGoalOptions.map((option) => (
                        <motion.div
                          key={option.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setPreferences(prev => ({ ...prev, dailyGoal: option.value }))}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            preferences.dailyGoal === option.value
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary mb-1">{option.label}</div>
                            <div className="text-sm text-muted-foreground">{option.description}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="grid grid-cols-2 gap-4">
                      {timeOptions.map((option) => (
                        <motion.div
                          key={option.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setPreferences(prev => ({ ...prev, preferredTime: option.value }))}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            preferences.preferredTime === option.value
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-3xl mb-2">{option.icon}</div>
                            <div className="font-semibold mb-1">{option.label}</div>
                            <div className="text-sm text-muted-foreground">{option.description}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <p className="text-muted-foreground mb-4">
                        Select topics you're interested in (choose at least 2):
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {interestOptions.map((option) => (
                          <motion.div
                            key={option.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleInterest(option.id)}
                            className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                              preferences.interests.includes(option.id)
                                ? 'border-primary bg-primary/10'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${option.color}`} />
                              <span className="font-medium text-sm">{option.label}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">You're all set!</h3>
                        <p className="text-muted-foreground mb-6">
                          Your personalized learning plan has been created based on your preferences.
                        </p>
                      </div>
                      
                      <div className="bg-secondary/30 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Daily Goal:</span>
                          <Badge variant="secondary">{preferences.dailyGoal} minutes</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Learning Time:</span>
                          <Badge variant="secondary">{preferences.preferredTime}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Interests:</span>
                          <Badge variant="secondary">{preferences.interests.length} topics</Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="flex items-center space-x-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Back</span>
                  </Button>

                  {currentStep === steps.length - 1 ? (
                    <Button
                      onClick={handleComplete}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center space-x-2"
                    >
                      <span>Start Learning</span>
                      <Zap className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={nextStep}
                      disabled={
                        (currentStep === 3 && preferences.interests.length < 2)
                      }
                      className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center space-x-2"
                    >
                      <span>Continue</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Onboarding;