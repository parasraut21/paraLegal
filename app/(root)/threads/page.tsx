import Link from 'next/link';
import { db } from '@/lib/auth/db';

export default async function QuestionsPage() {
  const questions = await db.legalQuestion.findMany({
    orderBy: {
      created_at: 'desc'
    },
    include: {
      user: true,
      _count: {
        select: { answers: true }
      }
    },
    take: 50
  });

  return (
    <div className="min-h-screen bg-[#050508] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0a0a15] via-[#050508] to-[#030305] bg-fixed relative">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-10 pointer-events-none"></div>

      <header className="bg-[#0a0a12] text-gray-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold">LEGAL COUNSEL</div>
            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                <li>
                  <Link href="/" className="hover:text-primary">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/questions" className="hover:text-primary">
                    Browse Questions
                  </Link>
                </li>
                <li>
                  <Link href="/threads" className="hover:text-primary">
                    Ask a Question
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-100">Legal Questions</h1>
            <Link
              href="/threads/new"
              className="bg-primary hover:bg-primary/80 text-[#0a0a12] font-bold py-2 px-6 rounded-lg"
            >
              Ask a Question
            </Link>
          </div>

          <div className="bg-[#0a0a12]/90 backdrop-blur-sm border border-primary/20 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.15)]">
            {questions.map((question) => (
              <div
                key={question.id}
                className="border-b border-gray-700 p-6 hover:bg-[#131320]"
              >
                <Link href={`/threads/id/${question.id}`}>
                  <div className="block">
                    <h2 className="text-xl font-semibold mb-2 text-primary hover:text-primary/80">
                      {question.title}
                    </h2>
                    <p className="text-gray-300 mb-4 line-clamp-2">
                      {question.content}
                    </p>
                    <div className="flex flex-wrap items-center text-sm text-gray-400">
                      <span className="mr-4">
                        Posted by {question.user?.name || 'Anonymous'} •{' '}
                        {new Date(question.created_at).toLocaleDateString()}
                      </span>
                      <span className="mr-4">
                        {question._count.answers}{' '}
                        {question._count.answers === 1 ? 'answer' : 'answers'}
                      </span>
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-800">
                        {question.topic.replace(/_/g, ' ').toLowerCase()}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}

            {questions.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-gray-400 mb-4">No questions have been asked yet.</p>
                <Link
                  href="/threads/new"
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Be the first to ask a question
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-[#0a0a12] text-gray-100 py-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Legal Counsel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
