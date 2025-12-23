"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react"; // Optional: for a back button feel
import Link from "next/link";

export default function CreateCoursePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    if (!res.ok) {
      alert("Failed to create course");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Back to Dashboard Link */}
      <div className="w-full max-w-2xl mb-6">
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-black flex items-center gap-1 transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Create New Course
          </h1>
          <p className="text-gray-500 mt-2">
            Fill in the details below to set up your new learning path.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-6">
          {/* Course Title */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">
              Course Title
            </label>
            <input
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-gray-400"
              placeholder="e.g. Advanced Web Development"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Course Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">
              Description
            </label>
            <textarea
              required
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-gray-400 resize-none"
              placeholder="What will students learn in this course?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              disabled={loading}
              className="w-full bg-black text-white font-bold py-4 rounded-lg hover:bg-gray-800 transform active:scale-[0.98] transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
