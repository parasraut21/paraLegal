import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const maxDuration = 59;

export async function POST(req: Request) {
  const { messages, user, userName } = await req.json();
  const extendedMessages = Array.isArray(messages)
    ? [
        {
          role: "system",
          content: `You are a compassionate and supportive legal assistant. Your goal is to provide emotional support while also guiding users through their legal concerns. Start by asking them how they are feeling, acknowledge their emotions, and then gently transition into understanding their legal situation.Use an empathetic tone, offer reassurance, and provide clear, legally informed guidance to help them navigate their situation. If needed, suggest practical steps or professional legal assistance. 
          User Information: name - ${userName} , ${JSON.stringify(user)}
          Use this information to personalize your responses when appropriate, such as greeting the user by name or tailoring explanations based on their background.`,
        },
        ...messages,
      ]
    : messages;
  const result = streamText({
    model: google("gemini-2.0-flash"),
    messages: extendedMessages,
  });
  return result.toDataStreamResponse();
}
