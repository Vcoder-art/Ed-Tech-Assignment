"use client";

import { useRouter } from "next/navigation";
import React, { useState, use } from "react";
import Link from "next/link";

export default function CreateAssignment({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.courseId;

  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/courses/${courseId}/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      if (!res.ok) {
        throw new Error("Failed to create assignment");
      }

      router.push(`/dashboard/courses/${courseId}`);
      router.refresh();
    } catch (err) {
      alert("Error: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Navigation Header */}
      <div className="w-full max-w-2xl mb-6">
        <Link
          href={`/dashboard/courses/${courseId}`}
          className="text-sm text-gray-500 hover:text-black flex items-center gap-1 transition-colors"
        >
          ← Back to Course
        </Link>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            New Assignment
          </h1>
          <p className="text-gray-500 mt-2">
            Create a task or project for your students in this course.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-6">
          {/* Assignment Title */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">
              Assignment Title
            </label>
            <input
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-gray-400"
              placeholder="e.g. Week 1: Basic Principles"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">
              Instructions
            </label>
            <textarea
              required
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-gray-400 resize-none"
              placeholder="Explain the requirements and goals of this assignment..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-white border border-gray-300 text-gray-700 font-bold py-4 rounded-lg hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              className="flex-[2] bg-black text-white font-bold py-4 rounded-lg hover:bg-gray-800 transform active:scale-[0.98] transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Publishing..." : "Publish Assignment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
