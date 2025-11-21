"use client";

import { Spinner } from "@/components/ui/spinner";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface QAItem {
  question: string;
  answer: string;
}

interface ContentPageProps {
  data: QAItem[];
  searchData: boolean;
  currentQuestion: string;
}

export default function ContentPage({ data, searchData, currentQuestion }: ContentPageProps) {
  const typingText = "Hey Gopal Dutt, Ask Anything About ESG";
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayText((prev) => {
        if (!isDeleting) {
          const next = typingText.slice(0, prev.length + 1);
          if (next === typingText) {
            setTimeout(() => setIsDeleting(true), 1000);
          }
          return next;
        } else {
          const next = typingText.slice(0, prev.length - 1);
          if (next === "") setIsDeleting(false);
          return next;
        }
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isDeleting]);

  if (!data || data.length === 0 && currentQuestion.length < 1) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex items-center justify-center py-10"
      >
        <h1 className="text-4xl font-bold text-center pt-40">
          {displayText}
          <span className="animate-pulse">|</span>
        </h1>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full p-4 border-t shadow-lg lg:border-none lg:shadow-none bg-background mb-40"
    >
      <div className="w-full max-w-full lg:max-w-xl mx-auto flex flex-col gap-4 bg-red">
        {data.map((item: QAItem, index: number) => (
          <div key={index} className="mb-6">
            <h2 className="font-semibold">Q: {item.question}</h2>
            <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
              {item.answer}
            </p>
          </div>
        ))}

        {searchData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <h2 className="font-semibold">Q: {currentQuestion}</h2>

            <motion.p
              className="mt-2 text-sm text-zinc-700 dark:text-zinc-300 mb-40"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              AI Thinking...
            </motion.p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
