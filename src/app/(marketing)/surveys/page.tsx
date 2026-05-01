"use client";

import { motion } from "motion/react";
import Wrapper from "@/components/global/wrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const surveys = [
  {
    id: "youth-budget-perception",
    title: "National Youth Budget Perception Pilot Survey",
    description: "Share your views on the national budget and help us create better stories.",
    image: "/images/survey/bnssurvey1.jpeg",
    link: "https://bit.ly/4tPZnLm",
    alt: "National Youth Budget Perception Pilot Survey",
  },
];

export default function SurveysPage() {
  return (
    <Wrapper className="py-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Budget Surveys
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Help us understand how youth perceive the national budget.
            Your feedback shapes our stories and impact.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {surveys.map((survey, index) => (
            <motion.div
              key={survey.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-[#0F172A] rounded-xl p-6 border border-white/10 hover:border-white/20 transition-colors group"
            >
              <div className="aspect-[4/3] mb-4 relative overflow-hidden rounded-lg">
                <Image
                  src={survey.image}
                  alt={survey.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">
                {survey.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                {survey.description}
              </p>
              <Button asChild size="sm" className="w-full">
                <a
                  href={survey.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Take Survey
                </a>
              </Button>
            </motion.div>
          ))}
        </div>

        {surveys.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-16"
          >
            <p className="text-muted-foreground">
              More surveys coming soon. Stay tuned!
            </p>
          </motion.div>
        )}
      </div>
    </Wrapper>
  );
}