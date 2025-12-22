"use client";

import { useRouter } from "next/navigation";
import React ,{ useState } from "react";

export default function CreateCoursePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    if (!res.ok) {
      alert("Failed to create course");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <form onSubmit={submit} className="space-y-4 max-w-md">
      <h1 className="text-xl font-bold">Create Course</h1>

      <input
        className="border p-2 w-full"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="border p-2 w-full"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button className="bg-black text-white px-4 py-2">
        Create
      </button>
    </form>
  );
}
