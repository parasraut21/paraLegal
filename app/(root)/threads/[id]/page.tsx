import { db } from '@/lib/auth/db';
import AnswerForm from '@/components/AnswerForm';
import { auth } from '@/lib/auth';

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Question not found</h1>
          <p className="mb-6 text-gray-600">
            The question you're looking for doesn't exist or has been removed.
          </p>
          <a href="/questions" className="text-blue-600 hover:text-blue-800">
            Browse all questions
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold">LEGAL COUNSEL</div>
            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                <li>
                  <a href="/" className="hover:text-blue-300">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/questions" className="hover:text-blue-300">
                    Browse Questions
                  </a>
                </li>
                <li>
                  <a href="/threads" className="hover:text-blue-300">
                    Ask a Question
                  </a>
                </li>
                <li>
                  <a href="/profile" className="hover:text-blue-300">
                    Your Profile
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <a href="/questions" className="text-blue-600 hover:text-blue-800">
              ← Back to all questions
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-4">{question.title}</h1>
              <p className="text-gray-800 whitespace-pre-line mb-4">
                {question.content}
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-4">
                  Posted by {question.user?.name || 'Anonymous'} •{' '}
                  {new Date(question.created_at).toLocaleDateString()}
                </span>
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                  {question.topic.replace(/_/g, ' ').toLowerCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">
              {question.answers.length} Answers
            </h2>

            {question.answers.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-500 mb-2">No answers yet.</p>
                <p className="text-gray-700">
                  Be the first to provide an answer to this question!
                </p>
              </div>
            ) : (
              question.answers.map((answer) => (
                <div
                  key={answer.id}
                  className={`bg-white rounded-lg shadow-md p-6 mb-4 ${
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
                  <p className="text-gray-800 whitespace-pre-line mb-4">
                    {answer.content}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
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
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Your Answer</h2>
              <AnswerForm questionId={question.id} />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-700 mb-4">
                You need to be logged in to answer this question.
              </p>
              <a
                href="/api/auth/signin"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
              >
                Sign In
              </a>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Legal Counsel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}