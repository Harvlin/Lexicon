import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, ArrowRight, Star, Users, BookOpen, Zap } from "lucide-react";
import heroImage from "@/assets/hero-learning.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Learning Platform" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* AI-Powered Badge */}
            <div className="flex items-center">
              <Badge className="bg-accent/20 text-accent border-accent/30 px-4 py-2">
                <Zap className="h-4 w-4 mr-2" />
                AI-Powered Learning
              </Badge>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Master Skills with
                <span className="block bg-gradient-hero bg-clip-text text-transparent">
                  Micro-Learning
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Transform your career with bite-sized lessons, AI study tools, and personalized learning paths designed for busy professionals.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-hero hover:opacity-90 shadow-glow" asChild>
                <Link to="/register">
                  Start Learning
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="group" asChild>
                <Link to="/library">
                  Explore Content
                </Link>
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 mx-auto mb-2">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <p className="text-2xl font-bold">50K+</p>
                <p className="text-sm text-muted-foreground">Active Learners</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mx-auto mb-2">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <p className="text-2xl font-bold">2M+</p>
                <p className="text-sm text-muted-foreground">Lessons Completed</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-success/20 mx-auto mb-2">
                  <Star className="h-6 w-6 text-success" />
                </div>
                <p className="text-2xl font-bold">10K+</p>
                <p className="text-sm text-muted-foreground">Skills Mastered</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 mx-auto mb-2">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <p className="text-2xl font-bold">5M+</p>
                <p className="text-sm text-muted-foreground">AI Interactions</p>
              </div>
            </div>
          </div>

          {/* Right Column - Visual Content */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              {/* Dashboard Preview */}
              <div className="bg-gradient-card p-6 border border-border/50">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Your Learning Dashboard</h3>
                    <Badge variant="secondary">85% Complete</Badge>
                  </div>
                  
                  {/* Progress Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-background/60 p-4 rounded-lg">
                      <p className="text-2xl font-bold text-accent">47</p>
                      <p className="text-sm text-muted-foreground">Lessons Completed</p>
                    </div>
                    <div className="bg-background/60 p-4 rounded-lg">
                      <p className="text-2xl font-bold text-primary">12</p>
                      <p className="text-sm text-muted-foreground">Day Streak</p>
                    </div>
                  </div>

                  {/* Current Lesson */}
                  <div className="bg-background/60 p-4 rounded-lg">
                    <p className="font-medium mb-2">Currently Learning</p>
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded bg-gradient-accent" />
                      <div>
                        <p className="font-medium">React Hooks Fundamentals</p>
                        <p className="text-sm text-muted-foreground">8 min remaining</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating AI Badge */}
            <div className="absolute -top-4 -right-4 bg-accent text-accent-foreground px-4 py-2 rounded-full shadow-accent animate-pulse">
              <span className="text-sm font-medium">AI-Powered</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};