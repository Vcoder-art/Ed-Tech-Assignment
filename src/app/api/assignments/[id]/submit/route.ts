import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { getAuthUser } from "../../../../lib/auth";
import { evaluateAssignment } from "../../../../lib/aiEvaluator";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  params = await params;
  const user = await getAuthUser();
  if (!user || user.role !== "STUDENT") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  if (!body.content) {
    return NextResponse.json(
      { message: "Submission content required" },
      { status: 400 }
    );
  }

  const existing = await prisma.submission.findUnique({
    where: {
      studentId_assignmentId: {
        studentId: user.userId,
        assignmentId: params.id,
      },
    },
  });

  if (existing) {
    return NextResponse.json({ message: "Already submitted" }, { status: 409 });
  }

  const submission = await prisma.submission.create({
    data: {
      content: body.content,
      studentId: user.userId,
      assignmentId: params.id,
    },
  });

  try {
    const aiResult = await evaluateAssignment(body.content);

    await prisma.submission.update({
      where: { id: submission.id },
      data: {
        aiFeedback: aiResult.feedback,
        aiScore: aiResult.score,
      },
    });
  } catch (err) {
    console.error("AI evaluation failed", err);
  }

  return NextResponse.json(submission, { status: 201 });
}
