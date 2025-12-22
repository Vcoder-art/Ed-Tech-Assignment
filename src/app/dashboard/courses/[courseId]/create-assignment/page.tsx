"use client";

import { useEffect, useState, use } from "react"; // 1. Import 'use'
import { useRouter } from "next/navigation";

export default function CreateAssignment({
  params,
}: {
  params: Promise<{ courseId: string }>; // 2. Explicitly type as Promise
}) {
  // 3. Resolve the params promise
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
      const res = await fetch(
        `/api/courses/${courseId}/assignments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to create assignment");
      }

      router.push(`/dashboard/courses/${courseId}`);
      router.refresh(); // Ensure the parent page sees the new data
    } catch (err) {
      alert("Error: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 max-w-md bg-white p-6 rounded-lg shadow-sm border">
      <h1 className="text-xl font-bold">Create Assignment</h1>

      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          required
          className="border p-2 w-full rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="e.g. Introduction to React"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          required
          rows={4}
          className="border p-2 w-full rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Provide details about the task..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button 
        disabled={loading}
        className={`w-full py-2 rounded-md font-semibold transition-colors ${
          loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {loading ? "Creating..." : "Create Assignment"}
      </button>
    </form>
  );
}