import { motion } from "framer-motion";
import { Brain, MessageSquare, TrendingUp, Lightbulb } from "lucide-react";
import chatInterface from "@/assets/chat-interface.png";
import aiBrain from "@/assets/ai-brain.png";

const AIExperience = () => {
  const features = [
    {
      icon: Brain,
      title: "Contextual Understanding",
      description: "AI that truly gets your learning style",
    },
    {
      icon: MessageSquare,
      title: "Natural Conversations",
      description: "Chat like you're talking to a real tutor",
    },
    {
      icon: TrendingUp,
      title: "Adaptive Learning",
      description: "Content that evolves with your progress",
    },
    {
      icon: Lightbulb,
      title: "Smart Insights",
      description: "Get personalized tips and breakthroughs",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-card to-background dark:from-background dark:to-card relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(16,185,129,0.1),transparent_50%)]" />

      <div className="container relative z-10 mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Visual */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative order-2 lg:order-1"
          >
            {/* AI Brain with glow */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-20 mb-8 lg:mb-0"
            >
              <div className="absolute inset-0 bg-gradient-hero opacity-30 blur-3xl animate-glow" />
              <img
                src={aiBrain}
                alt="AI Brain"
                className="relative z-10 w-full max-w-md mx-auto"
              />
            </motion.div>

            {/* Chat interface overlay */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="absolute -bottom-10 -right-10 w-3/4 z-30"
            >
              <img
                src={chatInterface}
                alt="Chat Interface"
                className="rounded-2xl shadow-elevated border-4 border-background"
              />
            </motion.div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8 order-1 lg:order-2"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold"
              >
                AI-Powered Experience
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Meet Your Personal{" "}
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  AI Companion
                </span>
              </h2>

              <p className="text-xl text-muted-foreground leading-relaxed">
                Always ready to guide your learning journey. Ask questions, get
                explanations, and receive personalized feedback — anytime, anywhere.
              </p>
            </div>

            {/* Feature list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-4 items-start group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-12 h-12 rounded-xl bg-card shadow-card flex items-center justify-center text-primary group-hover:shadow-glow transition-all flex-shrink-0"
                  >
                    <feature.icon className="w-6 h-6" />
                  </motion.div>
                  <div>
                    <h3 className="font-bold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AIExperience;
