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

  // ---------------------------
  // FILE UPLOAD (multipart-safe)
  // ---------------------------
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const selectedFiles = Array.from(e.target.files);

    for (const selectedFile of selectedFiles) {
      setFiles((prev) => [...prev, { file: selectedFile, status: "uploading" }]);

      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pdf/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setFiles((prev) =>
          prev.map((f) =>
            f.file.name === selectedFile.name
              ? { ...f, status: "success" }
              : f
          )
        );

        toast.success(`${selectedFile.name} uploaded successfully!`);
      } catch (error) {
        setFiles((prev) =>
          prev.map((f) =>
            f.file.name === selectedFile.name
              ? { ...f, status: "error" }
              : f
          )
        );

        toast.error(`Could not upload ${selectedFile.name}.`);
      }
    }

    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    toast.success("File removed");
  };

  // Auto expand
  useEffect(() => {
    if (textareaRef.current) {
      const el = textareaRef.current;
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  }, [message]);

  const handleSend = async () => {
    if (message.trim()) sendQuery(message);
    setMessage("");
    setFiles([]);
  };

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
      className="fixed bottom-0 left-0 right-0 w-full p-4 border-t bg-background"
    >
      <div className="w-full max-w-full lg:max-w-xl mx-auto flex flex-col gap-4">
        <p className="text-sm font-medium text-muted-foreground">
          Enter your chat message
        </p>

        <motion.div animate={{ scale: focused ? 1.02 : 1 }}>
          <Textarea
            ref={textareaRef}
            placeholder="Write your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="resize-none min-h-[60px] max-h-[80px]"
          />
        </motion.div>

        <AnimatePresence>
          {files.length > 0 && (
            <div className="flex flex-col gap-2">
              {files.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
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
                    className="text-red-600"
                  >
                    <X size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between">
          <motion.label className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted">
            <Paperclip size={18} />
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <span className="text-xs">
              {files.length > 0 ? "Add More Files" : "Upload Files"}
            </span>
          </motion.label>

          <Button
            onClick={handleSend}
            disabled={btn || (!message.trim() && files.length === 0)}
            className="flex items-center gap-2"
          >
            <Send size={16} /> {btn ? "Thinking..." : "Send"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
