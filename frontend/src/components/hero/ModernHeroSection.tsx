import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, Sparkles, Zap, Brain, Code, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import NeuralNetwork from '@/components/three/NeuralNetwork';
import heroBackground from '@/assets/hero-bg.jpg';

const ModernHeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const stats = [
    { label: "Active Learners", value: "50K+", icon: Users },
    { label: "AI-Generated Lessons", value: "10K+", icon: Brain },
    { label: "Code Projects", value: "5K+", icon: Code },
    { label: "Success Rate", value: "98%", icon: TrendingUp }
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Personalized curriculum that adapts to your learning style and pace"
    },
    {
      icon: Code,
      title: "Interactive Coding",
      description: "Learn by doing with real-time code execution and instant feedback"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get instant answers and explanations powered by advanced AI"
    }
  ];

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 hero-gradient">
        <div className="absolute inset-0 opacity-30">
          <img 
            src={heroBackground} 
            alt="AI Learning Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 opacity-20">
          <NeuralNetwork />
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 rounded-full bg-primary/20 blur-xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-60 right-20 w-32 h-32 rounded-full bg-neural-cyan/20 blur-2xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-40 left-1/4 w-16 h-16 rounded-full bg-neural-orange/30 blur-lg"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 container mx-auto px-6 pt-32 pb-20"
      >
        {/* Main Hero Content */}
        <div className="text-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <Badge variant="secondary" className="mb-6 text-sm px-4 py-2 glass-card">
              <Sparkles className="w-4 h-4 mr-2" />
              New: AI-Powered Study Plans Available
            </Badge>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
              Learn <span className="text-gradient-ai">Coding</span> with{' '}
              <span className="text-gradient-neural">AI</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Master programming through personalized AI tutoring, interactive projects, 
              and real-time feedback. Your coding journey starts here.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link to="/register">
              <Button size="lg" className="group px-8 py-6 text-lg hover-glow">
                Start Learning Free
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-6 text-lg glass-card hover:bg-white/10"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              >
                <Card className="card-gradient border-primary/20 hover-lift">
                  <CardContent className="p-6 text-center">
                    <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                    <div className="text-2xl font-bold text-gradient-ai">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.2 }}
                className="group"
              >
                <Card className="card-gradient border-primary/10 hover-lift hover:border-primary/30 transition-all duration-300">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};

export default ModernHeroSection;