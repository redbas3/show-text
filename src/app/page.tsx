"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [words, setWords] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        // data.txt와 data2.txt를 동시에 불러오기
        const [data1Response, data2Response] = await Promise.all([
          fetch("/data.txt"),
          fetch("/data2.txt"),
        ]);

        const [data1Text, data2Text] = await Promise.all([
          data1Response.text(),
          data2Response.text(),
        ]);

        // 두 파일의 단어들을 합치기
        const wordList1 = data1Text
          .split("\n")
          .flatMap((line) => line.split("、"));
        const wordList2 = data2Text
          .split("\n")
          .flatMap((line) => line.split("、"));

        // 중복 제거 및 빈 문자열 필터링
        const combinedWords = [...new Set([...wordList1, ...wordList2])].filter(
          (word) => word.trim() !== ""
        );

        setWords(combinedWords);
      } catch (error) {
        console.error("Error loading words:", error);
      }
    };

    fetchWords();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX } = e;
    const windowWidth = window.innerWidth;
    const third = windowWidth / 3;

    if (isLocked) {
      if (clientX > third && clientX < third * 2) {
        setIsLocked(false);
      }
      return;
    }

    if (clientX < third) {
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : words.length - 1));
    } else if (clientX > third * 2) {
      setCurrentIndex((prev) => (prev < words.length - 1 ? prev + 1 : 0));
    } else {
      setIsLocked(true);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsLocked(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const getTextSize = (word: string | undefined) => {
    if (!word) return "min(25vw,25vh)";
    const length = word.length;
    if (length <= 3) return "min(35vw,35vh)";
    if (length <= 4) return "min(30vw,30vh)";
    return "min(25vw,25vh)";
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-white text-black cursor-pointer select-none relative"
      onClick={handleClick}
    >
      <div className="w-full h-full flex items-center justify-center px-16">
        <div
          className={`font-bold text-center p-8 break-words select-none`}
          style={{
            fontSize: getTextSize(words[currentIndex]),
            lineHeight: "1.2",
          }}
        >
          {words[currentIndex] || "Loading..."}
          {isLocked && (
            <div className="text-sm mt-4">
              화면이 잠겼습니다. 가운데를 다시 클릭하여 잠금을 해제하세요.
            </div>
          )}
        </div>
      </div>
      <div className="absolute bottom-4 right-4 text-sm text-gray-500">
        {words.length > 0 ? `${currentIndex + 1}/${words.length}` : "0/0"}
      </div>
    </div>
  );
}
