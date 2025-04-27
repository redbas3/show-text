"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { readTextFile } from "@/utils/fileUtils";

export default function Home() {
  const router = useRouter();
  const [problemSets, setProblemSets] = useState<
    { id: string; title: string }[]
  >([]);

  useEffect(() => {
    // 로컬 스토리지에서 문제집 목록 불러오기
    const savedProblemSets = localStorage.getItem("problemSets");
    if (savedProblemSets) {
      try {
        const parsedProblemSets = JSON.parse(savedProblemSets);
        setProblemSets(parsedProblemSets);
      } catch (error) {
        console.error("Failed to parse problemSets from localStorage:", error);
        initializeProblemSets();
      }
    } else {
      initializeProblemSets();
    }
  }, []);

  const initializeProblemSets = () => {
    // 초기 데이터 로드
    const initialProblemSets = [
      { id: "data1", title: "Data1" },
      { id: "data2", title: "Data2" },
    ];
    setProblemSets(initialProblemSets);
    localStorage.setItem("problemSets", JSON.stringify(initialProblemSets));

    // 각 파일의 내용을 로컬 스토리지에 저장
    Promise.all([readTextFile("/data1.txt"), readTextFile("/data2.txt")])
      .then(([data1, data2]) => {
        localStorage.setItem("data1", data1);
        localStorage.setItem("data2", data2);
      })
      .catch((error) => {
        console.error("Failed to load text files:", error);
      });
  };

  const handleUseProblemSet = (id: string) => {
    router.push(`/problem-sets?id=${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">リスト</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {problemSets.map((problemSet) => (
          <div
            key={problemSet.id}
            className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-4">{problemSet.title}</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => handleUseProblemSet(problemSet.id)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                使用
              </button>
              <Link
                href={`/problem-sets/${problemSet.id}`}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                編集
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
