"use client"

import { useState, useEffect } from 'react';
import { getRecommendedTips } from '@/actions/user';

const topicDisplayNames: Record<string, string> = {
  CONSTITUTIONAL_RIGHTS_AND_REMEDIES: "Constitutional Rights",
  CRIMINAL_JUSTICE_SYSTEM: "Criminal Justice",
  FAMILY_AND_PERSONAL_LAWS: "Family Law",
  PROPERTY_AND_CONTRACT_BASICS: "Property & Contracts",
  CONSUMER_AND_DIGITAL_PROTECTION: "Consumer Protection",
  EMPLOYMENT_AND_LABOUR_RIGHTS: "Employment Rights",
  EVERYDAY_LEGAL_PROCEDURES: "Everyday Legal Procedures"
};

const hardcodedTips = [
  "Always read contracts before signing.",
  "Keep records of all legal documents.",
  "Understand your rights as a tenant or homeowner.",
  "Consult a lawyer for major financial decisions.",
  "Be aware of local laws when starting a business.",
];

export default function PersonalizedRecommendations() {
  const [recommendationData, setRecommendationData] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfileFound, setUserProfileFound] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const result = await getRecommendedTips();
        if (result.tips.length === 0) {
          if (result.userProfileNotFound === true) {
            setUserProfileFound(false);
          }
          setRecommendationData(hardcodedTips);
        } else {
          setRecommendationData(result.tips);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []); // Empty dependency array means this runs once on component mount

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Loading recommendations...</h2>
      </div>
    );
  }


  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Recommended Legal Topics</h2>
      <p className="text-gray-700 mb-4">
        {userProfileFound ? "Based on your profile, these legal topics may be particularly relevant to you:" : "Create a profile to get personalized recommendations."}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendationData.map((topic,index) => (
          <div key={index} className="border rounded-lg p-4 hover:bg-blue-50 transition-colors">
             {topic}
          </div>
        ))}
      </div>
    </div>
  );
}

function getTopicDescription(topic: string): string {
  const descriptions: Record<string, string> = {
    CONSTITUTIONAL_RIGHTS_AND_REMEDIES: "Learn about your fundamental rights and legal protections under the constitution.",
    CRIMINAL_JUSTICE_SYSTEM: "Understand the process, rights, and responsibilities within the criminal justice system.",
    FAMILY_AND_PERSONAL_LAWS: "Issues related to marriage, divorce, adoption, inheritance, and family relationships.",
    PROPERTY_AND_CONTRACT_BASICS: "Laws governing property ownership, renting, buying, and contractual obligations.",
    CONSUMER_AND_DIGITAL_PROTECTION: "Protection against unfair business practices, data privacy, and online safety.",
    EMPLOYMENT_AND_LABOUR_RIGHTS: "Workplace rights, discrimination issues, benefits, and employer obligations.",
    EVERYDAY_LEGAL_PROCEDURES: "Common legal procedures like filing complaints, notarizing documents, and accessing legal aid."
  };

  return descriptions[topic] || "Explore this important legal topic.";
}