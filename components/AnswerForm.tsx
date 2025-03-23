"use client";

import { submitLegalAnswer } from '@/actions/threads/legal-questions';
import { useState } from 'react';

export default function AnswerForm({ questionId }: { questionId: string }) {
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('answer', answer);
      formData.append('questionId', questionId);
      
      const result = await submitLegalAnswer(formData);
      
      if (result.success) {
        setAnswer('');
        setSuccess(true);
        // The page will automatically refresh with the new answer due to revalidatePath
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to submit answer. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-6 p-4 bg-red-900 border border-red-500 text-red-300 rounded-lg">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-900 border border-green-500 text-green-300 rounded-lg">
          Your answer has been submitted successfully!
        </div>
      )}
      
      <div className="mb-6">
        <textarea 
          className="w-full px-4 py-3 bg-[#131320] border border-primary/30 rounded-lg focus:outline-none focus:ring-primary focus:border-primary placeholder:text-gray-500 text-gray-100"
          rows={6}
          placeholder="Write your answer here..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
          disabled={isSubmitting}
        ></textarea>
      </div>
      
      <div className="text-center">
        <button 
          type="submit"
          className="bg-primary hover:bg-primary/80 text-[#0a0a12] font-bold py-3 px-8 rounded-lg transition duration-300 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Post Your Answer'}
        </button>
      </div>
    </form>
  );
}
