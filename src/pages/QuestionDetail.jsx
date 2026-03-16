import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { SEED_QUESTIONS } from '../data/questions'
import QuestionCard from '../components/QuestionCard'

export default function QuestionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const question = SEED_QUESTIONS.find(q => q.id === id || q.question?.slice(0, 20) === decodeURIComponent(id))
  const similar  = question ? SEED_QUESTIONS.filter(q => q.chapter === question.chapter && q !== question).slice(0, 3) : []

  if (!question) return (
    <div className="text-center py-20 fade-in">
      <div className="text-4xl mb-3">🔍</div>
      <p className="text-gray-500">Question not found</p>
      <button onClick={() => navigate('/browse')} className="btn-primary mt-4">Browse Questions</button>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-5 transition-colors">
        ← Back
      </button>
      <QuestionCard question={question} showAnswer={false}/>
      {similar.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-serif font-bold text-gray-900 dark:text-white mb-4">Similar Questions from {question.chapter}</h3>
          <div className="space-y-4">
            {similar.map((q, i) => <QuestionCard key={i} question={q} compact/>)}
          </div>
        </div>
      )}
    </div>
  )
}
