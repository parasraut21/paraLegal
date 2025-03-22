"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/auth/db";
import {
  Gender,
  MaritalStatus,
  IncomeRange,
  EducationLevel,
  ResidenceType,
  Session,
} from "@prisma/client";
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
  if (
    session &&
    typeof session === "object" &&
    "userId" in session &&
    typeof session.userId === "string"
  ) {
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
      profile: null,
    };
  }

  try {
    // Format the data - convert string values to appropriate types
    const formattedData = {
      ...formData,
      age: formData.age ? parseInt(formData.age) : null,
      hasChildren:
        formData.hasChildren === "true"
          ? true
          : formData.hasChildren === "false"
            ? false
            : null,
    };

    // Upsert the profile (create if doesn't exist, update if it does)
    const profile = await db.userProfile.upsert({
      where: {
        userId: userId,
      },
      update: formattedData,
      create: {
        ...formattedData,
        userId: userId,
      },
    });

    // Revalidate the profile page to reflect changes
    revalidatePath("/profile");

    return {
      success: true,
      message: "Profile updated successfully",
      profile,
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update profile",
      profile: null,
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
      profile: null,
    };
  }

  try {
    const profile = await db.userProfile.findUnique({
      where: { userId: userId },
    });

    return {
      success: true,
      message: profile ? "Profile found" : "No profile exists",
      profile,
    };
  } catch (error) {
    console.error("Error retrieving profile:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to retrieve profile",
      profile: null,
    };
  }
}

function isToday(createdAt: Date) {
  // Get today's date (year, month, day)
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();

  // Get the createdAt date (year, month, day)
  const createdDate = new Date(createdAt);
  const createdYear = createdDate.getFullYear();
  const createdMonth = createdDate.getMonth();
  const createdDay = createdDate.getDate();

  // Compare the dates
  return (
    todayYear === createdYear &&
    todayMonth === createdMonth &&
    todayDay === createdDay
  );
}

/**
 * Get recommended legal topics based on user profile
 */
export async function getRecommendedTips() {
  const session = await auth();
  const userId = getUserIdFromSession(session as unknown as Session);

  if (!userId) {
    return {
      success: false,
      message: "Authentication required",
      tips: [],
    };
  }

  try {
    // Fetch user profile
    const profile = await db.userProfile.findUnique({
      where: { userId: userId },
    });

    // Fetch existing tips for the user, ordered by creation date
    const existingTips = await db.userTips.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
    });

    // Check if the last tip was created today
    if (existingTips.length > 0 && isToday(existingTips[0].createdAt)) {
      return {
        success: true,
        message: "Tips already created for today",
        tips: existingTips[0].tips,
      };
    }

    // If no profile exists, return hardcoded tips
    if (!profile) {
      return {
        success: true,
        message: "No profile found, returning hardcoded tips",
        userProfileNotFound: true,
        tips: [ ],
      };
    }

    // Call the API to generate tips
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/tips`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({  userProfile: profile, existingTips: existingTips.map((tip) => tip.tips) || [] }),
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const generatedTips = await response.json();

    // Store the newly generated tips in the database
    await db.userTips.create({
      data: {
        userId: userId,
        tips: generatedTips,
        createdAt: new Date(),
      },
    });

    // Delete older tips to ensure a maximum of 7 tips per user
    if (existingTips.length >= 7) {
      const tipsToDelete = existingTips.slice(6); // Get all tips beyond the 6th (keeping 7 total)
      for (const tip of tipsToDelete) {
        await db.userTips.delete({
          where: { id: tip.id },
        });
      }
    }

    return {
      success: true,
      message: "New tips generated and stored successfully",
      tips: generatedTips,
    };
  } catch (error) {
    console.error("Error generating topic recommendations:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to generate recommendations",
      tips: [],
    };
  }
}
 