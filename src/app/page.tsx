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
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newId, setNewId] = useState("");

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
      { id: "data3", title: "Data3" },
      { id: "data4", title: "성서인물" },
    ];
    setProblemSets(initialProblemSets);
    localStorage.setItem("problemSets", JSON.stringify(initialProblemSets));

    // 각 파일의 내용을 로컬 스토리지에 저장
    Promise.all([
      readTextFile("/data1.txt"),
      readTextFile("/data2.txt"),
      readTextFile("/data3.txt"),
      readTextFile("/data4.txt"),
    ])
      .then(([data1, data2, data3, data4]) => {
        localStorage.setItem("data1", data1);
        localStorage.setItem("data2", data2);
        localStorage.setItem("data3", data3);
        localStorage.setItem("data4", data4);
      })
      .catch((error) => {
        console.error("Failed to load text files:", error);
      });
  };

  const handleUseProblemSet = (id: string) => {
    router.push(`/problem-sets?id=${id}`);
  };

  const handleAddNew = () => {
    if (!newTitle.trim() || !newId.trim()) {
      alert("タイトルとIDを入力してください。");
      return;
    }

    if (problemSets.some((set) => set.id === newId)) {
      alert("このIDは既に使用されています。");
      return;
    }

    const newProblemSet = {
      id: newId,
      title: newTitle,
    };

    const updatedProblemSets = [...problemSets, newProblemSet];
    setProblemSets(updatedProblemSets);
    localStorage.setItem("problemSets", JSON.stringify(updatedProblemSets));
    localStorage.setItem(newId, ""); // 빈 내용으로 초기화

    setShowModal(false);
    setNewTitle("");
    setNewId("");
  };

  const handleDeleteProblemSet = (id: string) => {
    if (window.confirm("この問題集を削除してもよろしいですか？")) {
      const updatedProblemSets = problemSets.filter((set) => set.id !== id);
      setProblemSets(updatedProblemSets);
      localStorage.setItem("problemSets", JSON.stringify(updatedProblemSets));
      localStorage.removeItem(id);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">リスト</h1>
        <div className="space-x-2">
          <button
            onClick={() => handleUseProblemSet("all")}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            全体使用
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            新規追加
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {problemSets.map((problemSet) => (
          <div
            key={problemSet.id}
            className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">{problemSet.title}</h2>
              <button
                onClick={() => handleDeleteProblemSet(problemSet.id)}
                className="text-red-500 hover:text-red-700"
              >
                削除
              </button>
            </div>
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

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">新規追加</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  タイトル
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="タイトルを入力"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID
                </label>
                <input
                  type="text"
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="IDを入力"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                キャンセル
              </button>
              <button
                onClick={handleAddNew}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                追加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
