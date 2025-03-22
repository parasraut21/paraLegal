"use client";

import { useState } from 'react';

import { useRouter } from 'next/navigation';
import { submitLegalQuestion } from '@/actions/threads/legal-questions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const AskQuestionPage = () => {
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('question', question);
      
      const result = await submitLegalQuestion(formData);
      
      if (result.success) {
        console.log('Question submitted:', question);
        setQuestion('');
        alert('Question submitted successfully!');
        // Redirect to questions page or the specific question
        if (result.questionId) {
          router.push(`/threads/id/${result.questionId}`);
        } else {
          router.push('/threads');
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to submit question. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold">LEGAL COUNSEL</div>
            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                <li><Link href="/" className="hover:text-blue-300">Home</Link></li>
                <li><Link href="/threads" className="hover:text-blue-300">Browse Questions</Link></li>
                <li><Link href="/threads/new" className="hover:text-blue-300">Ask a Question</Link></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-center">Ask Your Legal Question</h2>
            <p className="text-gray-600 mb-6 text-center">Get answers from our community of legal experts and fellow users</p>
            
            {error && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="question" className="block text-gray-700 font-medium mb-2">Your Question</label>
                <textarea 
                  id="question"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={6}
                  placeholder="Describe your legal issue in detail..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                  disabled={isSubmitting}
                ></textarea>
              </div>
              
              <div className="text-center">
                <Button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Question'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Legal Counsel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AskQuestionPage;