"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ProblemSetContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [words, setWords] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // Fisher-Yates 셔플 알고리즘
  const shuffleArray = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    const id = searchParams?.get("id");
    if (!id) return;

    if (id === "all") {
      // 모든 데이터 로드
      const data1 = localStorage.getItem("data1") || "";
      const data2 = localStorage.getItem("data2") || "";
      const data3 = localStorage.getItem("data3") || "";
      const data4 = localStorage.getItem("data4") || "";
      const allData = [data1, data2, data3, data4]
        .join(",")
        .split(/[,、]/)
        .map((word) => word.trim())
        .filter((word) => word.length > 0);
      // 전체 사용 모드에서만 단어를 섞음
      setWords(shuffleArray([...allData]));
    } else {
      // 기존 데이터 로드
      const content = localStorage.getItem(id) || "";
      const wordsArray = content
        .split(/[,、]/)
        .map((word) => word.trim())
        .filter((word) => word.length > 0);
      setWords(wordsArray);
    }
  }, [searchParams]);

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

  const handleBack = () => {
    router.push("/");
  };

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center bg-white text-black cursor-pointer select-none relative"
        onClick={handleClick}
      >
        <div className="w-full h-full flex items-center justify-center px-16">
          <div
            className="font-bold text-center p-8 break-words select-none"
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
      </div>
      <button
        onClick={handleBack}
        className="absolute top-4 right-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        戻る
      </button>
    </>
  );
}
