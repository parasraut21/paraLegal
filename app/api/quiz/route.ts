import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

export const maxDuration = 59;

export async function POST(req: Request) {
  const { topic } = await req.json();
  
  const { object } = await generateObject({
    model: google("gemini-2.0-flash"),
    schema: z.object({
      questions: z.array(
        z.object({
          question: z.string().describe("The quiz question text that teaches a legal concept"),
          options: z.array(z.string()).length(4).describe("Four possible answer options with one being correct"),
          correctIndex: z.number().int().min(0).max(3).describe("Index of the correct answer (0-3)"),
          explanation: z.string().describe("Detailed explanation of the correct answer and the legal concept it covers")
        })
      ).length(10).describe("Generate exactly 10 educational quiz questions on the specified legal topic")
    }).describe(`Generate 10 educational quiz questions about ${topic} for teaching purposes`),
    prompt: `Generate 10 educational quiz questions on the topic of ${topic}. 

These questions should be designed for TEACHING legal concepts rather than testing knowledge. Each question should:
- Introduce an important legal concept, principle, or right related to ${topic}
- Include 4 possible answer options where one is correct
- The correct answer should represent the accurate legal information
- Include a detailed explanation that teaches the user about the legal concept, its importance, and practical applications
- Use real-world scenarios and examples that make legal concepts accessible to non-lawyers
- Focus on information that would be practically useful for ordinary citizens
- Cover diverse aspects of ${topic} to provide a well-rounded understanding

The goal is to create questions that help users learn about their legal rights, responsibilities, and important procedures in an engaging format.`,
  });
  
  return Response.json({ questions: object.questions });
}