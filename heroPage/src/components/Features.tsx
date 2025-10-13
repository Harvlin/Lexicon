import { motion } from "framer-motion";
import { Sparkles, Zap, Target, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: Sparkles,
      title: "AI Summaries",
      description:
        "Get instant, intelligent summaries of any topic. Save hours and focus on what matters most.",
      gradient: "from-primary/10 to-secondary/10",
      iconColor: "text-primary",
    },
    {
      icon: Zap,
      title: "Instant Flashcards",
      description:
        "Auto-generate flashcards from your notes. Review smarter with spaced repetition.",
      gradient: "from-secondary/10 to-accent/10",
      iconColor: "text-secondary",
    },
    {
      icon: Target,
      title: "Adaptive Quizzes",
      description:
        "Test your knowledge with AI-powered quizzes that adapt to your learning pace.",
      gradient: "from-accent/10 to-primary/10",
      iconColor: "text-accent",
    },
    {
      icon: MessageCircle,
      title: "Chat with Your Tutor",
      description:
        "Ask questions anytime. Get instant, personalized answers from your AI companion.",
      gradient: "from-primary/10 to-accent/10",
      iconColor: "text-primary",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <h2 className="text-4xl md:text-5xl font-bold">
            Everything You Need to{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Master Anything
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Powerful AI tools designed to accelerate your learning journey
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card
                className={`group relative p-8 bg-gradient-to-br ${feature.gradient} border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-elevated cursor-pointer overflow-hidden`}
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-hero/5" />

                <div className="relative z-10 space-y-4">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`w-14 h-14 rounded-2xl bg-card shadow-card flex items-center justify-center ${feature.iconColor}`}
                  >
                    <feature.icon className="w-7 h-7" />
                  </motion.div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Animated arrow */}
                  <motion.div
                    initial={{ x: -5, opacity: 0 }}
                    whileHover={{ x: 0, opacity: 1 }}
                    className="text-primary font-semibold flex items-center gap-2"
                  >
                    Learn more →
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
