import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate, Link } from "react-router-dom";
import { Brain, Mail, Lock, User, Target, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    goals: [] as string[],
    agreeToTerms: false
  });

  const roles = [
    { value: "developer", label: "Software Developer" },
    { value: "designer", label: "Designer/UX" },
    { value: "product", label: "Product Manager" },
    { value: "finance", label: "Finance Professional" },
    { value: "marketing", label: "Marketing" },
    { value: "other", label: "Other" }
  ];

  const goalOptions = [
    "Learn new programming languages",
    "Advance in current role",
    "Switch career paths",
    "Stay updated with industry trends",
    "Prepare for interviews",
    "Build side projects",
    "Improve technical skills",
    "Leadership development"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Password mismatch",
          description: "Please make sure passwords match.",
          variant: "destructive"
        });
        return;
      }
      setStep(2);
      return;
    }

    setIsLoading(true);

    // TODO: Replace with actual API call
    // const response = await fetch('/api/auth/register', { ... });
    
    setTimeout(() => {
      toast({
        title: "Welcome to Lexicon!",
        description: "Your account has been created successfully.",
      });
      navigate('/dashboard');
      setIsLoading(false);
    }, 1000);
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  return (
    <div className="min-h-screen bg-background hero-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">Lexicon</span>
          </Link>
          <p className="text-muted-foreground">Start your learning journey today</p>
        </div>

        <Card className="border-border/40 shadow-card backdrop-blur-sm bg-card/80">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {step === 1 ? "Create Account" : "Tell us about yourself"}
            </CardTitle>
            <CardDescription className="text-center">
              {step === 1 
                ? "Join thousands of learners advancing their careers" 
                : "Help us personalize your learning experience"
              }
            </CardDescription>
            
            {/* Progress indicator */}
            <div className="flex justify-center mt-4">
              <div className="flex space-x-2">
                <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
                <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 1 ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleInputChange('name')}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleInputChange('email')}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleInputChange('password')}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange('confirmPassword')}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="role">What's your role?</Label>
                    <div className="relative">
                      <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                      <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>What are your learning goals? (Select all that apply)</Label>
                    <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                      {goalOptions.map((goal) => (
                        <div key={goal} className="flex items-center space-x-2">
                          <Checkbox
                            id={goal}
                            checked={formData.goals.includes(goal)}
                            onCheckedChange={() => handleGoalToggle(goal)}
                          />
                          <Label htmlFor={goal} className="text-sm font-normal cursor-pointer">
                            {goal}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {step === 1 && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))}
                    required
                  />
                  <Label htmlFor="terms" className="text-sm cursor-pointer">
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>
                    {" "}and{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
              )}

              <div className="flex gap-3">
                {step === 2 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                )}
                <Button 
                  type="submit" 
                  variant="learning" 
                  className="flex-1" 
                  disabled={isLoading || (step === 1 && !formData.agreeToTerms)}
                >
                  {isLoading ? (
                    "Creating account..."
                  ) : step === 1 ? (
                    <>
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}