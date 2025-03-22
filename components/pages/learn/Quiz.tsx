"use client"
import useQuizQuestions from '@/hooks/tanstack/getQuizQuestions';
import React, { useState } from 'react'

type Props = {}

export default function Quiz({ }: Props) {
  const { data, isLoading, isError } = useQuizQuestions();
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<number, number>>({});

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching quiz questions</div>;
  if (!data || !data.quizQuestions) return <div>No quiz questions found</div>;

  // Ensure quizQuestions is an array before mapping
  const quizQuestions = Array.isArray(data.quizQuestions)
    ? data.quizQuestions
    : [];

  if (quizQuestions.length === 0) return <div>No quiz questions found</div>;

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
      return `${baseClass} bg-gray-50 hover:bg-gray-100`;
    }

    // Question has been answered
    const userSelection = answeredQuestions[questionIndex];
    const correctAnswer = quizQuestions[questionIndex].correct; // Adjusting for 0-based index

    if (optionIndex === correctAnswer) {
      return `${baseClass} bg-green-100 border border-green-500`;
    } else if (optionIndex === userSelection) {
      return `${baseClass} bg-red-100 border border-red-500`;
    } else {
      return `${baseClass} bg-gray-50 opacity-70`;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Today's Legal Quiz</h1>
      {quizQuestions.map((question, index) => (
        <div key={index} className="p-4 border rounded-lg shadow-sm">
          <h3 className="font-medium text-lg mb-2">{question.question}</h3>
          {/* Render options based on database schema */}
          <p>{question.correct}</p>
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