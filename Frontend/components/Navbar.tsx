"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const [model, setModel] = useState<string>("gemini");

  useEffect(() => {
    const savedModel = localStorage.getItem("rag-model");
    if (savedModel) setModel(savedModel);
  }, []);

  const handleModelChange = (value: string) => {
    setModel(value);
    localStorage.setItem("rag-model", value);
    console.log(localStorage.getItem("rag-model"))
  };

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 w-full flex items-center justify-between px-6 py-4 border-b bg-background/80 backdrop-blur"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="text-xl font-bold"
      >
        RAG Engine
      </motion.div>

      <div className="flex items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.9, rotate: isDark ? -90 : 90 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="p-2 rounded-full hover:bg-muted transition"
        >
          {!isDark ? (
            <Sun size={20} className="text-yellow-500" />
          ) : (
            <Moon size={20} className="text-blue-400" />
          )}
        </motion.button>

        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Select value={model} onValueChange={handleModelChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Choose Model" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>Models</SelectLabel>
                <SelectItem value="gemini">Gemini API</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </motion.div>
      </div>
    </motion.nav>
  );
}
