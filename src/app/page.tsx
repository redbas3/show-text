"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [words, setWords] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    fetch("/data.txt")
      .then((response) => response.text())
      .then((text) => {
        const wordList = text.split("\n").flatMap((line) => line.split("、"));
        setWords(wordList.filter((word) => word.trim() !== ""));
      });
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

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-white text-black cursor-pointer select-none relative"
      onClick={handleClick}
    >
      <div className="w-full h-full flex items-center justify-center px-16">
        <div className="text-[min(25vw,25vh)] font-bold text-center p-8 break-keep select-none">
          {words[currentIndex]}
          {isLocked && (
            <div className="text-sm mt-4">
              화면이 잠겼습니다. 가운데를 다시 클릭하여 잠금을 해제하세요.
            </div>
          )}
        </div>
      </div>
      <div className="absolute bottom-4 right-4 text-sm text-gray-500">
        {currentIndex + 1}/{words.length}
      </div>
    </div>
  );
}
