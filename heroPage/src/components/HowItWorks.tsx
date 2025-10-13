import { motion } from "framer-motion";
import { Upload, Sparkles, Rocket } from "lucide-react";
import flashcardsImg from "@/assets/flashcards.png";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: Upload,
      title: "Upload Your Content",
      description:
        "Share notes, documents, or topics you want to master. Any format works.",
      color: "text-primary",
    },
    {
      number: "02",
      icon: Sparkles,
      title: "AI Does the Magic",
      description:
        "Our AI instantly creates summaries, flashcards, and quizzes tailored to your needs.",
      color: "text-secondary",
    },
    {
      number: "03",
      icon: Rocket,
      title: "Learn & Excel",
      description:
        "Study smarter with personalized content. Track progress and watch your skills soar.",
      color: "text-accent",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-gradient-soft relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20 space-y-4"
        >
          <h2 className="text-4xl md:text-5xl font-bold">
            So Simple,{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              It's Almost Magic
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Three simple steps to transform your learning experience
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Steps */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-6 group"
              >
                {/* Step number and icon */}
                <div className="flex flex-col items-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-16 h-16 rounded-2xl bg-card shadow-card flex items-center justify-center ${step.color} border-2 border-border group-hover:border-primary/50 transition-all`}
                  >
                    <step.icon className="w-8 h-8" />
                  </motion.div>
                  {index < steps.length - 1 && (
                    <div className="w-0.5 h-16 bg-gradient-to-b from-border to-transparent mt-4" />
                  )}
                </div>

                {/* Step content */}
                <div className="flex-1 space-y-2 pt-2">
                  <div className="text-sm font-bold text-muted-foreground">
                    STEP {step.number}
                  </div>
                  <h3 className="text-2xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Visual mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <img
                src={flashcardsImg}
                alt="Flashcards Interface"
                className="w-full rounded-3xl shadow-elevated"
              />
            </motion.div>
            {/* Decorative glow */}
            <div className="absolute inset-0 bg-gradient-hero opacity-20 blur-3xl scale-110" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
