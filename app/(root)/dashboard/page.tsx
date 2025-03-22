"use client";
import PersonalizedRecommendations from "@/components/Recommandation";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Legal Knowledge For Everyone
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
              Understand your rights, ask questions, and get guidance on legal
              matters that affect your everyday life.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/questions"
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Browse Questions
              </a>
              <a
                href="/ask"
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Ask a Question
              </a>
            </div>
          </div>

          {/* Personalized Recommendations Section - only shown if logged in */}
          <div className="mb-8">
            <PersonalizedRecommendations />
          </div>

          {/* Daily Quiz Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Take Today's Legal Quiz</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-700 mb-4">
                Test your legal knowledge with our daily quiz. Answer 5
                questions on today's topic and improve your understanding.
              </p>
              <a
                href="/quiz"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Start Quiz
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}