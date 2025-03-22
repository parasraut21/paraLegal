import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const maxDuration = 59;

export async function POST(req: Request) {
  const { messages, user, userName } = await req.json();

  // Construct a personalized system prompt based on user info
  const personalizedSystemPrompt = `You are a highly knowledgeable AI assistant specialized in legal matters. You provide accurate, well-researched, and unbiased legal information. You do not offer personal legal advice but can explain legal concepts, procedures, and general guidance based on legal principles. Always cite relevant legal sources when applicable and clarify that users should consult a qualified attorney for personalized advice.
  User Information: name - ${userName} , ${JSON.stringify(user)}
  Use this information to personalize your responses when appropriate, such as greeting the user by name or tailoring explanations based on their background.`;
  // Extend the messages array with the personalized system prompt
  const extendedMessages = Array.isArray(messages)
    ? [
        {
          role: "system",
          content: personalizedSystemPrompt,
        },
        ...messages,
      ]
    : messages;

  // Stream the response using the Gemini model
  const result = await streamText({
    model: google("gemini-2.0-flash"),
    messages: extendedMessages,
  });

  return result.toDataStreamResponse();
}
