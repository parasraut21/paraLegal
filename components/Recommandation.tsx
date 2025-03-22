"use client"

import { useState, useEffect } from 'react';
import { getRecommendedTopics } from '@/actions/user';

const topicDisplayNames: Record<string, string> = {
  CONSTITUTIONAL_RIGHTS_AND_REMEDIES: "Constitutional Rights",
  CRIMINAL_JUSTICE_SYSTEM: "Criminal Justice",
  FAMILY_AND_PERSONAL_LAWS: "Family Law",
  PROPERTY_AND_CONTRACT_BASICS: "Property & Contracts",
  CONSUMER_AND_DIGITAL_PROTECTION: "Consumer Protection",
  EMPLOYMENT_AND_LABOUR_RIGHTS: "Employment Rights",
  EVERYDAY_LEGAL_PROCEDURES: "Everyday Legal Procedures"
};

export default function PersonalizedRecommendations() {
  const [recommendationData, setRecommendationData] = useState<{
    success: boolean;
    topics: string[];
  }>({ success: false, topics: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const result = await getRecommendedTopics();
        setRecommendationData(result);
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

  const { success, topics } = recommendationData;
  
  if (!success || topics.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Complete Your Profile</h2>
        <p className="text-gray-700">
          Complete your legal profile to get personalized recommendations and resources.
        </p>
        <div className="mt-4">
          <a 
            href="/profile" 
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Update Profile
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Recommended Legal Topics</h2>
      <p className="text-gray-700 mb-4">
        Based on your profile, these legal topics may be particularly relevant to you:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topics.map((topic) => (
          <div key={topic} className="border rounded-lg p-4 hover:bg-blue-50 transition-colors">
            <h3 className="font-semibold text-lg text-blue-700">{topicDisplayNames[topic] || topic}</h3>
            <p className="text-sm text-gray-600 mt-2">
              {getTopicDescription(topic)}
            </p>
            <a 
              href={`/topics/${topic.toLowerCase()}`}
              className="inline-block mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Explore resources →
            </a>
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