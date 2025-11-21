"use client";

import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Paperclip, Send, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";

type FileItem = {
  file: File;
  status: "uploading" | "success" | "error";
};

export default function InputBox({
  sendQuery,
  btn,
}: {
  sendQuery: (q: string) => void;
  btn: boolean;
}) {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // -------------------------------
  // FILE UPLOAD HANDLER WITH STATUS COLORS
  // -------------------------------
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const selectedFiles = Array.from(e.target.files);

    for (const selectedFile of selectedFiles) {
      // Add temp "uploading" state
      setFiles((prev) => [
        ...prev,
        { file: selectedFile, status: "uploading" },
      ]);

      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pdf/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // Change status → success
        setFiles((prev) =>
          prev.map((f) =>
            f.file.name === selectedFile.name ? { ...f, status: "success" } : f
          )
        );

        toast.success(`${selectedFile.name} uploaded successfully!`);
      } catch (error) {
        // Change status → error
        setFiles((prev) =>
          prev.map((f) =>
            f.file.name === selectedFile.name ? { ...f, status: "error" } : f
          )
        );

        toast.error(`Could not upload ${selectedFile.name}.`);
        console.error("File upload failed:", error);
      }
    }

    e.target.value = ""; // allow re-uploading same file
  };

  // REMOVE FILE
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    toast.success("File removed");
  };

  // Auto expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      const el = textareaRef.current;
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  }, [message]);

  // SEND MESSAGE
  const handleSend = async () => {
    if (message.trim() !== "") {
      sendQuery(message);
    }

    setMessage("");
    setFiles([]);
  };

  // Colors based on upload status
  const getStatusStyle = (status: FileItem["status"]) => {
    if (status === "uploading")
      return "border-blue-500 bg-blue-100 text-blue-800";
    if (status === "success")
      return "border-green-500 bg-green-100 text-green-800";
    if (status === "error")
      return "border-red-500 bg-red-100 text-red-800";
    return "";
  };

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed bottom-0 left-0 right-0 w-full p-4 border-t shadow-lg lg:border-none lg:shadow-none bg-background"
    >
      <div className="w-full max-w-full lg:max-w-xl mx-auto flex flex-col gap-4">
        <p className="text-sm font-medium text-muted-foreground">
          Enter your chat message
        </p>

        <motion.div
          animate={{ scale: focused ? 1.02 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Textarea
            ref={textareaRef}
            placeholder="Write your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="resize-none overflow-hidden min-h-[60px] max-h-[80px] w-full"
          />
        </motion.div>

        {/* FILE LIST */}
        <AnimatePresence>
          {files.length > 0 && (
            <div className="flex flex-col gap-2">
              {files.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`flex items-center justify-between px-3 py-2 border rounded-lg ${getStatusStyle(
                    item.status
                  )}`}
                >
                  <span className="text-xs max-w-[200px] truncate">
                    📄 {item.file.name} —{" "}
                    {item.status === "uploading"
                      ? "Uploading..."
                      : item.status === "success"
                      ? "Uploaded"
                      : "Failed"}
                  </span>

                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* ACTIONS */}
        <div className="flex items-center justify-between">
          <motion.label
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer px-3 py-2 rounded-md flex items-center gap-2 hover:bg-muted transition"
          >
            <Paperclip size={18} />
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <span className="text-xs text-muted-foreground">
              {files.length > 0 ? "Add More Files" : "Upload Files"}
            </span>
          </motion.label>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}>
            <Button
              onClick={handleSend}
              className="flex items-center gap-2"
              disabled={btn || (!message.trim() && files.length === 0)}
            >
              <Send size={16} /> {btn ? "Thinking..." : "Send"}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
