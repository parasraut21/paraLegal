import { db } from '@/lib/auth/db';
import AnswerForm from '@/components/AnswerForm';
import { auth } from '@/lib/auth';
import Link from 'next/link';

export type paramsType = Promise<{ id: string }>;
export default async function QuestionDetailPage({ params }: { params: paramsType }) {
  const session = await auth();
  const question = await db.legalQuestion.findUnique({
    where: { id: (await params).id },
    include: {
      user: true,
      answers: {
        orderBy: [
          { isAccepted: 'desc' },
          { upvotes: 'desc' },
          { created_at: 'desc' },
        ],
        include: {
          user: true,
        },
      },
    },
  });

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050508] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0a0a15] via-[#050508] to-[#030305] bg-fixed relative">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-10 pointer-events-none"></div>
        <div className="text-center relative z-10">
          <h1 className="text-2xl font-bold mb-4 text-gray-100">Question not found</h1>
          <p className="mb-6 text-gray-400">
            The question you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/questions" className="text-primary hover:text-primary/80 font-medium">
            Browse all questions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050508] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0a0a15] via-[#050508] to-[#030305] bg-fixed relative">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-10 pointer-events-none"></div>

      {/* Header */}
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
                  <Link href="/threads" className="hover:text-primary">
                    Browse Questions
                  </Link>
                </li>
                <li>
                  <Link href="/threads/new" className="hover:text-primary">
                    Ask a Question
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="hover:text-primary">
                    Your Profile
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Link href="/threads" className="text-primary hover:text-primary/80">
              ← Back to all questions
            </Link>
          </div>

          <div className="bg-[#0a0a12]/90 backdrop-blur-sm border border-primary/20 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.15)] p-6 mb-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-4 text-gray-100">{question.title}</h1>
              <p className="text-gray-300 whitespace-pre-line mb-4">
                {question.content}
              </p>
              <div className="flex items-center text-sm text-gray-400">
                <span className="mr-4">
                  Posted by {question.user?.name || 'Anonymous'} •{' '}
                  {new Date(question.created_at).toLocaleDateString()}
                </span>
                <span className="px-2 py-1 text-xs rounded-full bg-gray-800">
                  {question.topic.replace(/_/g, ' ').toLowerCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-100">
              {question.answers.length} Answer{question.answers.length !== 1 && 's'}
            </h2>

            {question.answers.length === 0 ? (
              <div className="bg-[#0a0a12]/90 backdrop-blur-sm border border-primary/20 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.15)] p-6 text-center">
                <p className="text-gray-400 mb-2">No answers yet.</p>
                <p className="text-gray-300">
                  Be the first to provide an answer to this question!
                </p>
              </div>
            ) : (
              question.answers.map((answer) => (
                <div
                  key={answer.id}
                  className={`bg-[#0a0a12]/90 backdrop-blur-sm border border-primary/20 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.15)] p-6 mb-4 ${
                    answer.isAccepted ? 'border-l-4 border-green-500' : ''
                  }`}
                >
                  {answer.isAccepted && (
                    <div className="mb-3 text-green-600 font-medium flex items-center">
                      <svg
                        className="w-5 h-5 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Accepted Answer
                    </div>
                  )}
                  <p className="text-gray-300 whitespace-pre-line mb-4">
                    {answer.content}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>
                      Answered by {answer.user?.name || 'Anonymous'} •{' '}
                      {new Date(answer.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {session ? (
            <div className="bg-[#0a0a12]/90 backdrop-blur-sm border border-primary/20 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.15)] p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-100">Your Answer</h2>
              <AnswerForm questionId={question.id} />
            </div>
          ) : (
            <div className="bg-[#0a0a12]/90 backdrop-blur-sm border border-primary/20 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.15)] p-6 text-center">
              <p className="text-gray-300 mb-4">
                You need to be logged in to answer this question.
              </p>
              <Link
                href="/api/auth/signin"
                className="bg-primary hover:bg-primary/80 text-[#0a0a12] font-bold py-2 px-6 rounded-lg"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0a0a12] text-gray-100 py-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Legal Counsel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
