"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/auth/db";
import { LegalTopics } from "@prisma/client";

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
      return [];
    }

    const data = await response.json();
    return data.questions;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
}

function isSameDay(date1: Date, date2: Date): boolean {
  console.log(date1.getDate(), date2.getDate());
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

// Main server action function
export async function getOrCreateDailyQuiz() {
   try {
     const latestQuiz = await db.quiz.findFirst({
       orderBy: {
         created_at: "desc",
       },
     });
     if (!latestQuiz){
      return {
      success: false,
      message: "quiz not found",
      quizQuestions: null,
    };
     }
     const questions  = await db.quizQuestions.findMany({
       where: { id :{
        in: latestQuiz.questions,
       } },
     });
     return {
      success: true,
      message: "quiz found",
      quizQuestions: questions,
     }
   } catch (error) {
     console.error("Error fetching latest quiz:", error);
     return {
      success: false,
      message: "error while getting quiz",
      quizQuestions: null,
     }
   }
}

export const getLastestQuiz = async () => {
  try {
    const latestQuiz = await db.quiz.findFirst({
      orderBy: {
        created_at: "desc",
      },
    });
    return latestQuiz;
  } catch (error) {
    console.error("Error fetching latest quiz:", error);
    return null;
  }
};