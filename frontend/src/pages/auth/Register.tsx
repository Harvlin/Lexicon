import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Brain, Loader2, User, Mail, Lock, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/components/providers/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { User as UserType } from '@/lib/mock-data';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '' as UserType['role'],
    goals: [] as string[],
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const roles = [
    { value: 'student', label: 'Student', description: 'Learning new skills' },
    { value: 'developer', label: 'Developer', description: 'Improving coding skills' },
    { value: 'designer', label: 'Designer', description: 'Enhancing design abilities' },
    { value: 'teacher', label: 'Teacher', description: 'Teaching and learning' }
  ];

  const goalOptions = [
    'Master React', 'Learn AI/ML', 'Full-Stack Development', 'UI/UX Design',
    'Data Science', 'DevOps', 'Mobile Development', 'Backend Development',
    'Frontend Development', 'Cloud Computing', 'Cybersecurity', 'Game Development'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords don't match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.acceptTerms) {
      toast({
        title: "Accept terms",
        description: "Please accept the terms and conditions.",
        variant: "destructive",
      });
      return;
    }

    if (formData.goals.length === 0) {
      toast({
        title: "Select goals",
        description: "Please select at least one learning goal.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        goals: formData.goals
      });
      
      toast({
        title: "Account created!",
        description: "Welcome to AI Learn. Let's start your journey!",
      });
      
      navigate('/onboarding');
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-neural-cyan/5" />
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-lg my-8"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 group">
            <Brain className="h-10 w-10 text-primary group-hover:text-primary-glow transition-colors" />
            <span className="text-2xl font-bold text-gradient-ai">AI Learn</span>
          </Link>
        </div>

        <Card className="card-gradient border-border/50 shadow-elegant">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold">Join AI Learn</CardTitle>
            <CardDescription className="text-muted-foreground">
              Start your personalized learning journey
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name & Email */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Full Name</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    required
                    className="transition-all duration-200 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                    required
                    className="transition-all duration-200 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center space-x-2">
                    <Lock className="h-4 w-4" />
                    <span>Password</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Create a password"
                      required
                      className="pr-10 transition-all duration-200 focus:ring-primary focus:border-primary"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirm your password"
                      required
                      className="pr-10 transition-all duration-200 focus:ring-primary focus:border-primary"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span>I am a...</span>
                </Label>
                <Select value={formData.role} onValueChange={(value: UserType['role']) => 
                  setFormData(prev => ({ ...prev, role: value }))
                }>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        <div>
                          <div className="font-medium">{role.label}</div>
                          <div className="text-sm text-muted-foreground">{role.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Learning Goals */}
              <div className="space-y-3">
                <Label>Learning Goals (Select at least one)</Label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {goalOptions.map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <Checkbox
                        id={goal}
                        checked={formData.goals.includes(goal)}
                        onCheckedChange={() => handleGoalToggle(goal)}
                      />
                      <Label
                        htmlFor={goal}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {goal}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, acceptTerms: checked as boolean }))
                  }
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary hover:text-primary-glow">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary hover:text-primary-glow">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-xl hover-lift glow-primary transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-primary hover:text-primary-glow font-medium transition-colors"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;