"use client"
import useQuizQuestions from '@/hooks/tanstack/getQuizQuestions';
import React, { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function Quiz() {
  const { data, isLoading, isError } = useQuizQuestions();
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<number, number>>({});
  console.log("quiz--data",data)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050508] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0a0a15] via-[#050508] to-[#030305] bg-fixed relative p-4">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-10 pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <Skeleton className="h-8 w-1/2 mb-6" />
          <div className="space-y-6">
            {[1, 2, 3].map((skeleton) => (
              <div
                key={skeleton}
                className="p-6 bg-[#0a0a12]/90 backdrop-blur-sm border border-primary/20 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.15)]"
              >
                <Skeleton className="h-6 w-full mb-4" />
                <ul className="space-y-2">
                  {[1, 2, 3, 4].map((option) => (
                    <li key={option} className="p-2 rounded bg-[#131320] text-gray-100">
                      <Skeleton className="h-4 w-3/4" />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (isError) return <div className="p-4 text-center text-red-500">Error fetching quiz questions</div>;
  if (!data || !data.quizQuestions) return <div className="p-4 text-center text-gray-300">No quiz questions found</div>;

  // Ensure quizQuestions is an array before mapping
  const quizQuestions = Array.isArray(data.quizQuestions)
    ? data.quizQuestions
    : [];

  if (quizQuestions.length === 0) return <div className="p-4 text-center text-gray-300">No quiz questions found</div>;

  const handleAnswerClick = (questionIndex: number, selectedOption: number) => {
    setAnsweredQuestions(prev => ({
      ...prev,
      [questionIndex]: selectedOption
    }));
  };

  const isQuestionAnswered = (questionIndex: number) => {
    return questionIndex in answeredQuestions;
  };

  const getOptionClassName = (questionIndex: number, optionIndex: number) => {
    const baseClass = "p-2 rounded cursor-pointer";
    
    if (!isQuestionAnswered(questionIndex)) {
      return `${baseClass} bg-[#131320] hover:bg-[#181830] text-gray-100`;
    }

    // Question has been answered
    const userSelection = answeredQuestions[questionIndex];
    const correctAnswer = quizQuestions[questionIndex].correct; // Adjusting for 0-based index

    if (optionIndex === correctAnswer) {
      return `${baseClass} bg-green-900 border border-green-500 text-green-300`;
    } else if (optionIndex === userSelection) {
      return `${baseClass} bg-red-900 border border-red-500 text-red-300`;
    } else {
      return `${baseClass} bg-[#131320] opacity-70 text-gray-400`;
    }
  };

  return (
    <div id='quiz' className="min-h-screen bg-[#050508] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0a0a15] via-[#050508] to-[#030305] bg-fixed relative p-4">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-10 pointer-events-none"></div>
      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-100">Today's Legal Quiz</h1>
        {quizQuestions.map((question, index) => (
          <div key={index} className="p-6 mb-6 bg-[#0a0a12]/90 backdrop-blur-sm border border-primary/20 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.15)]">
            <h3 className="font-medium text-lg mb-2 text-gray-100">{question.question}</h3>
            <ul className="space-y-2">
              <li
                className={getOptionClassName(index, 0)}
                onClick={() => !isQuestionAnswered(index) && handleAnswerClick(index, 0)}
              >
                {question.option1}
              </li>
              <li
                className={getOptionClassName(index, 1)}
                onClick={() => !isQuestionAnswered(index) && handleAnswerClick(index, 1)}
              >
                {question.option2}
              </li>
              <li
                className={getOptionClassName(index, 2)}
                onClick={() => !isQuestionAnswered(index) && handleAnswerClick(index, 2)}
              >
                {question.option3}
              </li>
              <li
                className={getOptionClassName(index, 3)}
                onClick={() => !isQuestionAnswered(index) && handleAnswerClick(index, 3)}
              >
                {question.option4}
              </li>
            </ul>

            {/* Only show explanation after answering */}
            {isQuestionAnswered(index) && question.explanation && (
              <div className="mt-4 p-3 bg-blue-900 border border-blue-500 text-blue-300 rounded-md">
                <h4 className="font-medium">Explanation:</h4>
                <p>{question.explanation}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
