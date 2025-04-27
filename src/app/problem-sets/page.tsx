"use client";

import { Suspense } from "react";
import ProblemSetContent from "./ProblemSetContent";

export default function ProblemSetPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProblemSetContent />
    </Suspense>
  );
}
