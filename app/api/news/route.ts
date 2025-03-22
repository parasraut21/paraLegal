import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

export const maxDuration = 59;

export async function POST(req: Request) {
  const { title, description } = await req.json();

  const { object } = await generateObject({
    model: google("gemini-2.0-flash"),
    schema: z.object({

      impact: z.string(),
      insights: z.string(),
      suggestions: z.string(),
      sentiment: z.enum(["positive", "negative", "neutral"]),
    }),
    prompt: `Analyze the following news headline and description, then generate structured insights:
    
    **Title:** ${title}
    **Description:** ${description}

    Extract the following information:
    - **Impact**: How this news might affect people, industries, or society.
    - **Insights**: Valuable lessons or perspectives people can gain from this news.
    - **Suggestions**: Practical steps or advice for individuals to learn and grow from this news.
    - **Sentiment**: Categorize the news as 'positive', 'negative', or 'neutral' based on its overall tone and impact.`,
  });

  return Response.json({ insights: object });
}
