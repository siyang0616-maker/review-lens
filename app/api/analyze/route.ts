import { NextResponse } from "next/server";
import { analyzeReview } from "@/lib/analyze";
import { analyzeReviewWithAi } from "@/lib/ai-analyze";
import { analyzeRequestSchema } from "@/lib/analysis-schema";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = analyzeRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid request",
        issues: parsed.error.flatten()
      },
      { status: 400 }
    );
  }

  const localReport = analyzeReview(parsed.data);

  try {
    const aiReport = await analyzeReviewWithAi(parsed.data, localReport);
    return NextResponse.json(aiReport ?? localReport);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown AI analyzer error";

    return NextResponse.json({
      ...localReport,
      limitations: [
        ...localReport.limitations,
        `AI analyzer fallback used: ${message}`
      ].slice(0, 8)
    });
  }
}
