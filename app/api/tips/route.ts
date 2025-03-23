import { google } from "@ai-sdk/google";
import { LegalTopics } from "@prisma/client";
import { generateObject } from "ai";
import { z } from "zod";

export const maxDuration = 59;

export async function POST(req: Request) {
  const { userProfile, existingTips } = await req.json();

  // Define the schema for the response
  const tipsSchema = z.array(z.string()).length(10);

  // Generate tips based on user profile and existing tips
  const { object: generatedTips } = await generateObject({
    model: google("gemini-2.0-flash"),
    schema: tipsSchema,
    prompt: `Generate 10 unique legal and law-related tips for a user with the following profile: ${JSON.stringify(userProfile)}. Avoid repeating these existing tips: ${existingTips.join(", ")}. try to cover the following topics :${JSON.stringify(LegalTopics)}`,
  });

  return Response.json(generatedTips);
}
