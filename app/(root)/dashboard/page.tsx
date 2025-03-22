"use client"
import PersonalizedRecommendations from "@/components/Recommandation"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050508] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0a0a15] via-[#050508] to-[#030305] bg-fixed">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-10 pointer-events-none"></div>
      <main className="py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="bg-[#0a0a12]/90 backdrop-blur-sm border border-primary/20 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.15)] p-8 mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-100">
              <span className="text-primary">Legal</span> Knowledge For Everyone
            </h1>
            <p className="text-xl text-gray-400 mb-6 max-w-3xl mx-auto">
              Understand your rights, ask questions, and get guidance on legal matters that affect your everyday life.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/questions"
                className="px-6 py-3 bg-primary text-[#0a0a12] font-medium rounded-md hover:bg-primary/80 hover:shadow-[0_0_10px_rgba(0,240,255,0.5)] transition-all"
              >
                Browse Questions
              </a>
              <a
                href="/ask"
                className="px-6 py-3 bg-[#131320] text-gray-200 border border-primary/30 rounded-md hover:bg-[#181830] hover:border-primary/60 transition-all"
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
            <h2 className="text-2xl font-bold mb-4 text-gray-100">
              Take Today's <span className="text-primary">Legal Quiz</span>
            </h2>
            <div className="bg-[#0a0a12]/90 backdrop-blur-sm border border-primary/20 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.15)] p-6">
              <p className="text-gray-400 mb-4">
                Test your legal knowledge with our daily quiz. Answer 5 questions on today's topic and improve your
                understanding.
              </p>
              <a
                href="/quiz"
                className="inline-block px-4 py-2 bg-primary text-[#0a0a12] font-medium rounded-md hover:bg-primary/80 hover:shadow-[0_0_10px_rgba(0,240,255,0.5)] transition-all"
              >
                Start Quiz
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

