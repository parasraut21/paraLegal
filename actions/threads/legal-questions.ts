"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/auth/db";
import { LegalTopics } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Function to categorize the question into a legal topic using keywords
function categorizeLegalTopic(question: string): LegalTopics {
  const lowerCaseQuestion = question.toLowerCase();
  
  // Define keywords for each topic
  const topicKeywords: Record<LegalTopics, string[]> = {
    CONSTITUTIONAL_RIGHTS_AND_REMEDIES: [
      'constitution', 'rights', 'freedom', 'speech', 'religion', 'amendment', 
      'civil rights', 'discrimination', 'equal protection', 'voting'
    ],
    CRIMINAL_JUSTICE_SYSTEM: [
      'criminal', 'crime', 'arrest', 'police', 'jail', 'trial', 'felony', 
      'misdemeanor', 'warrant', 'sentence', 'probation', 'parole'
    ],
    FAMILY_AND_PERSONAL_LAWS: [
      'divorce', 'custody', 'marriage', 'child support', 'alimony', 'adoption',
      'will', 'estate', 'inheritance', 'guardianship'
    ],
    PROPERTY_AND_CONTRACT_BASICS: [
      'property', 'contract', 'lease', 'mortgage', 'deed', 'title', 'landlord',
      'tenant', 'agreement', 'breach', 'real estate', 'sale'
    ],
    CONSUMER_AND_DIGITAL_PROTECTION: [
      'consumer', 'digital', 'online', 'scam', 'fraud', 'privacy', 'data',
      'internet', 'warranty', 'return', 'refund', 'identity theft'
    ],
    EMPLOYMENT_AND_LABOUR_RIGHTS: [
      'employment', 'job', 'workplace', 'discrimination', 'harassment', 'overtime',
      'wages', 'termination', 'firing', 'union', 'worker', 'compensation'
    ],
    EVERYDAY_LEGAL_PROCEDURES: [
      'procedure', 'sue', 'lawsuit', 'small claims', 'court', 'legal aid',
      'notary', 'document', 'filing', 'representation', 'lawyer'
    ]
  };
  
  // Count keyword matches for each topic
  const topicScores: Record<LegalTopics, number> = Object.fromEntries(
    Object.keys(topicKeywords).map(topic => [topic, 0])
  ) as Record<LegalTopics, number>;
  
  // Calculate scores
  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    for (const keyword of keywords) {
      if (lowerCaseQuestion.includes(keyword)) {
        topicScores[topic as LegalTopics] += 1;
      }
    }
  }
  
  // Find topic with highest score
  let maxScore = 0;
  let maxTopic: LegalTopics = LegalTopics.EVERYDAY_LEGAL_PROCEDURES; // Default
  
  for (const [topic, score] of Object.entries(topicScores)) {
    if (score > maxScore) {
      maxScore = score;
      maxTopic = topic as LegalTopics;
    }
  }
  
  return maxTopic;
}

// Extract title from the question content (first sentence or first 100 chars)
function extractTitle(content: string): string {
  // Find the first sentence
  const sentenceEnd = content.match(/[.!?]/);
  if (sentenceEnd && sentenceEnd.index && sentenceEnd.index < 100) {
    return content.substring(0, sentenceEnd.index + 1);
  }
  
  // If no sentence end found or sentence is too long, use first 100 chars
  const title = content.substring(0, Math.min(100, content.length));
  return title.endsWith('.') ? title : `${title}...`;
}

export async function submitLegalQuestion(formData: FormData) {
  const session = await auth();
  
  const content = formData.get('question') as string;
  
  if (!content || content.trim() === '') {
    return {
      success: false,
      message: "Question cannot be empty",
    };
  }
  
  try {
    // Determine topic from question content
    const topic = categorizeLegalTopic(content);
    
    // Extract title from content
    const title = extractTitle(content);
    
    // Create question in database
    const question = await db.legalQuestion.create({
      data: {
        title,
        content,
        topic,
        userId: session && 'userId' in session ? (session.userId as string | null | undefined) : null,
      },
    });
    
    // Revalidate cache for questions page
    revalidatePath('/questions');
    
    return {
      success: true,
      message: "Question submitted successfully",
      questionId: question.id,
    };
  } catch (error) {
    console.error("Error submitting question:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function submitLegalAnswer(formData: FormData) {
  const session = await auth();
  const content = formData.get('answer') as string;
  const questionId = formData.get('questionId') as string;
  
  if (!content || content.trim() === '') {
    return {
      success: false,
      message: "Answer cannot be empty",
    };
  }
  
  if (!questionId) {
    return {
      success: false,
      message: "Question ID is required",
    };
  }
  
  try {
    // Create answer in database
    const answer = await db.legalAnswer.create({
      data: {
        content,
        questionId,
        userId: session && 'userId' in session ? (session.userId as string | null | undefined) : null,

      },
    });
    
    // Revalidate cache for question detail page
    revalidatePath(`/threads/${questionId}`);
    
    return {
      success: true,
      message: "Answer submitted successfully",
      answerId: answer.id,
    };
  } catch (error) {
    console.error("Error submitting answer:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
