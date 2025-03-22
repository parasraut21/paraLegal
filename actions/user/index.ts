"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/auth/db";
import { Gender, MaritalStatus, IncomeRange, EducationLevel, ResidenceType, Session } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Interface for profile form data
 */
interface ProfileFormData {
  age?: string;
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  occupation?: string;
  income?: IncomeRange;
  education?: EducationLevel;
  hasChildren?: string;
  residenceType?: ResidenceType;
  location?: string;
}

/**
 * Helper function to safely get userId from session
 */
function getUserIdFromSession(session: Session | null) {
  if (!session) return null;

  // Ensure session has the expected structure
  if (session && typeof session === 'object' && 'userId' in session && typeof session.userId === 'string') {
    return session.userId;
  }

  return null;
}

/**
 * Server action to create or update a user profile
 */
export async function updateUserProfile(formData: ProfileFormData) {
  const session = await auth();
  const userId = getUserIdFromSession(session as unknown as Session);
  
  if (!userId) {
    return {
      success: false,
      message: "Authentication required",
      profile: null
    };
  }
  
  try {
    // Format the data - convert string values to appropriate types
    const formattedData = {
      ...formData,
      age: formData.age ? parseInt(formData.age) : null,
      hasChildren: formData.hasChildren === "true" ? true : 
                  formData.hasChildren === "false" ? false : null,
    };
    
    // Upsert the profile (create if doesn't exist, update if it does)
    const profile = await db.userProfile.upsert({
      where: { 
        userId: userId
      },
      update: formattedData,
      create: {
        ...formattedData,
        userId: userId
      },
    });
    
    // Revalidate the profile page to reflect changes
    revalidatePath('/profile');
    
    return {
      success: true,
      message: "Profile updated successfully",
      profile
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update profile",
      profile: null
    };
  }
}

/**
 * Server action to get a user's profile
 */
export async function getUserProfile() {
  const session = await auth();
  const userId = getUserIdFromSession(session as unknown as Session);
  
  if (!userId) {
    return {
      success: false,
      message: "Authentication required",
      profile: null
    };
  }
  
  try {
    const profile = await db.userProfile.findUnique({
      where: { userId: userId },
    });
    
    return {
      success: true,
      message: profile ? "Profile found" : "No profile exists",
      profile
    };
  } catch (error) {
    console.error("Error retrieving profile:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to retrieve profile",
      profile: null
    };
  }
}

/**
 * Get recommended legal topics based on user profile
 */
export async function getRecommendedTopics() {
  const session = await auth();
  const userId = getUserIdFromSession(session as unknown as Session);
  
  if (!userId) {
    return {
      success: false,
      message: "Authentication required",
      topics: []
    };
  }
  
  try {
    const profile = await db.userProfile.findUnique({
      where: { userId: userId },
    });
    
    if (!profile) {
      return {
        success: true,
        message: "No profile found, returning general topics",
        topics: ["CONSTITUTIONAL_RIGHTS_AND_REMEDIES", "EVERYDAY_LEGAL_PROCEDURES"]
      };
    }
    
    const topics = [];
    
    // Family law relevance
    if (profile.maritalStatus === "MARRIED" || 
        profile.maritalStatus === "DIVORCED" || 
        profile.maritalStatus === "SEPARATED" ||
        profile.hasChildren === true) {
      topics.push("FAMILY_AND_PERSONAL_LAWS");
    }
    
    // Property law relevance
    if (profile.residenceType === "OWNED" || profile.residenceType === "RENTED") {
      topics.push("PROPERTY_AND_CONTRACT_BASICS");
    }
    
    // Employment law relevance
    if (profile.occupation) {
      topics.push("EMPLOYMENT_AND_LABOUR_RIGHTS");
    }
    
    // Add general topics everyone should know
    topics.push("CONSTITUTIONAL_RIGHTS_AND_REMEDIES");
    topics.push("CONSUMER_AND_DIGITAL_PROTECTION");
    
    // Get unique topics
    const uniqueTopics = Array.from(new Set(topics));
    
    return {
      success: true,
      message: "Topics recommended based on profile",
      topics: uniqueTopics
    };
  } catch (error) {
    console.error("Error generating topic recommendations:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to generate recommendations",
      topics: []
    };
  }
}