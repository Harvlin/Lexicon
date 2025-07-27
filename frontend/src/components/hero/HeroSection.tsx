import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Zap, 
  Target, 
  BookOpen, 
  Users, 
  Award,
  ArrowRight,
  Play,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import NeuralNetwork from '@/components/three/NeuralNetwork';

const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Hero title animation
    tl.fromTo(titleRef.current, 
      { 
        opacity: 0, 
        y: 100,
        scale: 0.8
      },
      { 
        opacity: 1, 
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "power3.out"
      }
    );

    // Subtitle animation
    tl.fromTo(subtitleRef.current,
      {
        opacity: 0,
        y: 50
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      },
      "-=0.6"
    );

    // CTA buttons animation
    tl.fromTo(ctaRef.current?.children,
      {
        opacity: 0,
        y: 30,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)"
      },
      "-=0.4"
    );

    // Stats animation
    tl.fromTo(statsRef.current?.children,
      {
        opacity: 0,
        y: 20
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out"
      },
      "-=0.2"
    );

    return () => {
      tl.kill();
    };
  }, []);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Personalized study paths powered by advanced AI algorithms"
    },
    {
      icon: Zap,
      title: "Micro-Learning",
      description: "Learn in bite-sized chunks that fit your busy schedule"
    },
    {
      icon: Target,
      title: "Goal-Oriented",
      description: "Set and achieve your learning goals with precision tracking"
    }
  ];

  const stats = [
    { label: "Active Learners", value: "50K+", icon: Users },
    { label: "Courses Available", value: "1,200+", icon: BookOpen },
    { label: "Success Rate", value: "94%", icon: Award },
    { label: "Avg. Rating", value: "4.9", icon: Star }
  ];

  return (
    <div ref={heroRef} className="relative min-h-screen overflow-hidden hero-gradient">
      {/* Neural Network Background */}
      <NeuralNetwork count={800} />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-neural-cyan/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* Main Hero Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <h1 
              ref={titleRef}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              Master Skills with{' '}
              <span className="text-gradient-ai animate-gradient">AI-Powered</span>
              <br />
              Micro-Learning
            </h1>
            
            <p 
              ref={subtitleRef}
              className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Transform your learning journey with personalized AI tutors, bite-sized lessons, 
              and intelligent progress tracking. Learn faster, retain more, achieve your goals.
            </p>

            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to="/register">
                <Button 
                  size="lg" 
                  className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-xl hover-lift glow-primary"
                >
                  <span className="relative z-10 flex items-center">
                    Start Learning Free
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-neural opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg"
                className="group border-primary/30 text-foreground hover:bg-primary/10 px-8 py-6 text-lg font-semibold rounded-xl hover-lift"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </motion.div>

          {/* Stats Section */}
          <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.05 }}
                  className="glass-card p-6 rounded-xl hover-neural"
                >
                  <Icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-3xl font-bold text-gradient-ai mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.2, duration: 0.6 }}
                  whileHover={{ y: -8 }}
                  className="relative group"
                >
                  <Card className="card-gradient border-border/50 hover:border-primary/30 transition-all duration-300 hover-lift">
                    <CardContent className="p-8 text-center">
                      <div className="relative inline-block mb-6">
                        <Icon className="h-12 w-12 text-primary group-hover:text-primary-glow transition-colors duration-300" />
                        <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 group-hover:text-gradient-ai transition-all duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float">
        <div className="w-3 h-3 bg-primary rounded-full opacity-60" />
      </div>
      <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '1s' }}>
        <div className="w-2 h-2 bg-neural-cyan rounded-full opacity-40" />
      </div>
      <div className="absolute bottom-32 left-1/4 animate-float" style={{ animationDelay: '2s' }}>
        <div className="w-4 h-4 bg-neural-purple rounded-full opacity-50" />
      </div>
    </div>
  );
};

export default HeroSection;