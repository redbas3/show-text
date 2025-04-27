"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProblemSetPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [words, setWords] = useState<string[]>([]);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      const savedContent = localStorage.getItem(id);
      if (savedContent) {
        // 정규식으로 "、"와 ","를 구분자로 사용하여 단어 분리
        const splitWords = savedContent.split(/[、,]/);
        setWords(splitWords.map((word) => word.trim()));
      }
    }
  }, [searchParams]);

  const handleBack = () => {
    router.push("/");
  };

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
              画面がロックされています。中央をクリックしてロックを解除してください。
            </div>
          )}
        </div>
      </div>
      <div className="absolute bottom-4 right-4 text-sm text-gray-500">
        {words.length > 0 ? `${currentIndex + 1}/${words.length}` : "0/0"}
      </div>
      <button
        onClick={handleBack}
        className="absolute top-4 right-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        戻る
      </button>
    </div>
  );
}
