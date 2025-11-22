"use client";

import { useEffect, useState } from "react";
import ContentPage from "@/components/ContentPage";
import InputBox from "@/components/InputBox";
import axios from "axios";
import { toast } from "sonner";

interface QAItem {
  question: string;
  answer: string;
}

export default function Home() {
  const [data, setData] = useState<QAItem[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [searchData, setSearchData] = useState(false);
  const [SelelctPdfName, setSelelctPdfName] = useState('');
  const [btn, setBtn] = useState(false);

  const sendQuery = async (ask: string) => {
    setCurrentQuestion(ask);
    setSearchData(true);
    setBtn(true);

    try {

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/query/ask${SelelctPdfName ? `?pdf=${SelelctPdfName}` : ""
        }`,
        { question: ask }
      );

      setData((prev) => [
        ...prev,
        {
          question: ask,
          answer: response.data.answer || "No response was returned.",
        },
      ]);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setCurrentQuestion("");
      setSearchData(false);
      setBtn(false);
    }
  };

  useEffect(() => {
    console.log(SelelctPdfName);
  }, [SelelctPdfName]);


  return (
    <div className="flex items-center justify-center bg-zinc-50 dark:bg-black mt-[65px]">
      <ContentPage
        data={data}
        searchData={searchData}
        currentQuestion={currentQuestion}
      />

      <InputBox
        sendQuery={sendQuery}
        btn={btn}
        setSelelctPdfName={setSelelctPdfName}
      />
    </div>
  );
}
