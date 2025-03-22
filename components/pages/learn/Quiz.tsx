"use client"
import useQuizQuestions from '@/hooks/tanstack/getQuizQuestions';
import React from 'react'

type Props = {}

export default function Quiz({ }: Props) {
  const { data, isLoading, isError } = useQuizQuestions();
  console.log(data)
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching quiz questions</div>;
  if (!data || !data.quizQuestions) return <div>No quiz questions found</div>;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Today's Legal Quiz</h1>
      {data.quizQuestions.map((question, index) => (
        <div key={index} className="p-4 border rounded-lg shadow-sm">
          <h3 className="font-medium text-lg mb-2">{question.question}</h3>

          {/* Render options based on database schema */}
          <ul className="space-y-2">
            <li className={`p-2 rounded hover:bg-gray-100 ${question.correct === 1 ? 'bg-green-50' : 'bg-gray-50'}`}>
              {question.option1}
            </li>
            <li className={`p-2 rounded hover:bg-gray-100 ${question.correct === 2 ? 'bg-green-50' : 'bg-gray-50'}`}>
              {question.option2}
            </li>
            <li className={`p-2 rounded hover:bg-gray-100 ${question.correct === 3 ? 'bg-green-50' : 'bg-gray-50'}`}>
              {question.option3}
            </li>
            <li className={`p-2 rounded hover:bg-gray-100 ${question.correct === 4 ? 'bg-green-50' : 'bg-gray-50'}`}>
              {question.option4}
            </li>
          </ul>

          {/* Render explanation if it exists */}
          {question.explanation && (
            <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-md">
              <h4 className="font-medium">Explanation:</h4>
              <p>{question.explanation}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}