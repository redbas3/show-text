"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ProblemSetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [content, setContent] = useState("");
  const problemSetId = params.id as string;

  useEffect(() => {
    // 로컬 스토리지에서 내용 불러오기
    const savedContent = localStorage.getItem(problemSetId);
    if (savedContent) {
      setContent(savedContent);
    }
  }, [problemSetId]);

  const handleSave = () => {
    localStorage.setItem(problemSetId, content);
    alert("保存されました。");
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {problemSetId === "data1" ? "Data1" : "Data2"}
        </h1>
        <div className="space-x-2">
          <button
            onClick={handleBack}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            戻る
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            保存
          </button>
        </div>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-[600px] p-4 border rounded-lg"
        placeholder="内容を入力してください..."
      />
    </div>
  );
}
