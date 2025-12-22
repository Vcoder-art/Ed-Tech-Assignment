import { openai } from "./ai";

export async function evaluateAssignment(content: string) {
  const prompt = `
You are an experienced instructor.
Evaluate the following student assignment.

Give:
1. Short constructive feedback (max 5 lines)
2. A score from 0 to 100 based on clarity, correctness, and depth.

Assignment:
"""
${content}
"""
Return JSON only:
{
  "feedback": string,
  "score": number
}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
  });

  const text = response.choices[0].message.content!;
  return JSON.parse(text);
}
