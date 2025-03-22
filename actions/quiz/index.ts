"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/auth/db";
import {  LegalTopics } from "@prisma/client";

// Function to get today's date in the format 'YYYY-MM-DD'
function getTodayDate() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
    .toISOString()
    .split("T")[0];
}

// Function to determine the legal topic based on the day of the week
function getTopicForDay(): LegalTopics {
  const dayOfWeek = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.

  const topicMap: Record<number, LegalTopics> = {
    0: LegalTopics.CONSTITUTIONAL_RIGHTS_AND_REMEDIES,
    1: LegalTopics.CRIMINAL_JUSTICE_SYSTEM,
    2: LegalTopics.FAMILY_AND_PERSONAL_LAWS,
    3: LegalTopics.PROPERTY_AND_CONTRACT_BASICS,
    4: LegalTopics.CONSUMER_AND_DIGITAL_PROTECTION,
    5: LegalTopics.EMPLOYMENT_AND_LABOUR_RIGHTS,
    6: LegalTopics.EVERYDAY_LEGAL_PROCEDURES,
  };

  return topicMap[dayOfWeek];
}

// Function to fetch questions from an external API
async function fetchQuestionsFromAPI(topic: LegalTopics): Promise<any[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/quiz`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data.questions;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

// Main server action function
export async function getOrCreateDailyQuiz() {
  const session = await auth();
  if (!session) {
    return {
      success: false,
      message: "User not authenticated",
      quizQuestions: null,
    };
  }
  try {
    // Check if a quiz was already created today
    const existingQuiz = await db.quiz.findFirst({
      orderBy: {
        created_at: "desc",
      },
      take: 1,
    });

    // If quiz exists for today, return it
    if (existingQuiz && isSameDay(existingQuiz.created_at, new Date())) {
      const existingQuizQuestions = await db.quizQuestions.findMany({
        where: {
          id: {
            in: existingQuiz.questions,
          },
        },
      });

      return {
        success: true,
        message: "Today's quiz found",
        quizQuestions: existingQuizQuestions,
      };
    }

    // If no quiz exists, create a new one
    // 1. Determine today's topic
    const todaysTopic = getTopicForDay();

    // 2. Fetch questions from API
    const apiQuestions = await fetchQuestionsFromAPI(todaysTopic);

    // 3. Store questions in QuizQuestions table
    const createdQuestions = await Promise.all(
      apiQuestions.map(async (question) => {
        return await db.quizQuestions.create({
          data: {
            question: question.question,
            option1: question.options[0],
            option2: question.options[1],
            option3: question.options[2],
            option4: question.options[3],
            correct: question.correctIndex,
            explanation: question.explanation,
            topic: todaysTopic,
          },
        });
      })
    );

    // 4. Create new quiz with question IDs
    await db.quiz.create({
      data: {
        questions: createdQuestions.map((q) => q.id),
      },
    });

    return {
      success: true,
      message: "New quiz created for today",
      quizQuestions: createdQuestions,
    };
  } catch (error) {
    console.error("Error in getOrCreateDailyQuiz:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      quizQuestions: null,
    };
  }
}
