"use client";

import { motion } from "framer-motion";
import { Server, Shuffle, CircleDollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMotionVariants } from "@/lib/motion";

const points = [
  {
    icon: Server,
    title: "Self-host the model",
    body: "Your resume stays on an open model you can run on your own machine.",
  },
  {
    icon: Shuffle,
    title: "No vendor lock-in",
    body: "Swap Ollama for any OpenAI-compatible endpoint. The prompt stays yours.",
  },
  {
    icon: CircleDollarSign,
    title: "Near-zero to run",
    body: "Private mode is the cost of electricity. Hosted mode is a cheap open-weight call.",
  },
];

export function WhyOpen() {
  const motionVars = useMotionVariants();

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <h2 className="text-gradient-plasma">Why open models</h2>
        <p className="max-w-xl text-body text-frost-faint">
          A closed resume API keeps a copy. An open-weight model does not have to.
        </p>
      </div>
      <motion.div
        className="grid gap-4 md:grid-cols-3"
        variants={motionVars.stagger}
        {...motionVars.section}
      >
        {points.map((point) => (
          <motion.div key={point.title} variants={motionVars.fadeUp}>
            <Card className="h-full shadow-plasma-ambient">
              <CardHeader>
                <point.icon className="size-8 text-frost-white" strokeWidth={1.5} />
                <CardTitle className="text-subheading">{point.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-body-sm text-frost-muted">{point.body}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
