"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function SubmitAssignmentPage({
  params,
}: {
  params: Promise<{ assignmentId: string }>;
}) {
  const resolvedParams = use(params);
  const assignmentId = resolvedParams.assignmentId;

  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch(`/api/assignments/${assignmentId}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.message || "Submission failed");
      return;
    }

    // success → go back to course
    router.back();
  }

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-xl font-semibold">Submit Assignment</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full border p-3 rounded min-h-[200px]"
          placeholder="Write your answer here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <button
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {loading ? "Submitting..." : "Submit Assignment"}
        </button>
      </form>
    </div>
  );
}
