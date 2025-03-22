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
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold">LEGAL COUNSEL</div>
            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                <li><a href="/" className="hover:text-blue-300">Home</a></li>
                <li><a href="/questions" className="hover:text-blue-300">Browse Questions</a></li>
                <li><a href="/threads" className="hover:text-blue-300">Ask a Question</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Legal Questions</h1>
            <Link href="/threads" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg">
              Ask a Question
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md">
            {questions.map((question) => (
              <div key={question.id} className="border-b border-gray-200 p-6 hover:bg-gray-50">
                <Link href={`/threads/${question.id}`} className="block">
                  <h2 className="text-xl font-semibold mb-2 text-blue-800 hover:text-blue-600">
                    {question.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">{question.content}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-4">
                      Posted by {question.user?.name || 'Anonymous'} • {new Date(question.created_at).toLocaleDateString()}
                    </span>
                    <span className="mr-4">
                      {question._count.answers} {question._count.answers === 1 ? 'answer' : 'answers'}
                    </span>
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                      {question.topic.replace(/_/g, ' ').toLowerCase()}
                    </span>
                  </div>
                </Link>
              </div>
            ))}

            {questions.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-gray-500 mb-4">No questions have been asked yet.</p>
                <Link href="/threads" className="text-blue-600 hover:text-blue-800 font-medium">
                  Be the first to ask a question
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Legal Counsel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}