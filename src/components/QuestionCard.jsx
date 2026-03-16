import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { toggleBookmark, saveAttempt } from '../hooks/useData'

const OPTS = ['A','B','C','D']

export default function QuestionCard({ question, showAnswer=false, onAnswer, isBookmarked:initBookmarked=false, compact=false, testId=null, questionNumber=null }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(showAnswer)
  const [bookmarked, setBookmarked] = useState(initBookmarked)
  const [startTime] = useState(Date.now())

  if (!question) return null
  const options = [question.option_a, question.option_b, question.option_c, question.option_d]

  async function handleSelect(opt) {
    if (revealed) return
    setSelected(opt); setRevealed(true)
    const isCorrect = opt === question.answer
    const timeTaken = Math.round((Date.now() - startTime) / 1000)
    if (onAnswer) onAnswer(opt, isCorrect)
    if (user) await saveAttempt({ userId:user.id, questionId:question.id, selectedOption:opt, isCorrect, timeTaken, testId })
  }

  async function handleBookmark() {
    if (!user) return
    const next = await toggleBookmark(user.id, question.id)
    setBookmarked(next)
  }

  function optClass(opt) {
    if (!revealed) return selected === opt ? 'option-btn selected' : 'option-btn'
    if (opt === question.answer) return 'option-btn correct'
    if (opt === selected && opt !== question.answer) return 'option-btn wrong'
    return 'option-btn opacity-50'
  }

  const subjClass = `subject-pill-${question.subject?.toLowerCase()}`
  const diffClass = `diff-${question.difficulty?.toLowerCase()||'medium'}`

  return (
    <div className={`card p-5 md:p-6 fade-in ${compact ? '' : 'shadow-sm'}`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          {questionNumber && <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded">Q{questionNumber}</span>}
          <span className={`badge ${subjClass}`}>{question.subject}</span>
          <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">{question.chapter}</span>
          <span className="badge bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-mono">{question.year}</span>
          <span className={`badge ${diffClass}`}>{question.difficulty||'Medium'}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {user && (
            <button onClick={handleBookmark} className={`text-lg transition-transform hover:scale-110 ${bookmarked?'text-yellow-500':'text-gray-300 dark:text-gray-600'}`}>🔖</button>
          )}
          <button onClick={() => navigate(`/question/${encodeURIComponent(question.id||question.question?.slice(0,20))}`)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm">↗</button>
        </div>
      </div>
      <p className="question-text text-base font-medium text-gray-900 dark:text-gray-100 mb-5 leading-relaxed">{question.question}</p>
      <div className="space-y-2.5 mb-4">
        {options.map((opt, i) => (
          <button key={i} onClick={() => handleSelect(OPTS[i])} className={optClass(OPTS[i])}>
            <span className="inline-flex items-center gap-3">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 border ${revealed && OPTS[i]===question.answer ? 'bg-green-500 border-green-500 text-white' : revealed && OPTS[i]===selected && OPTS[i]!==question.answer ? 'bg-red-400 border-red-400 text-white' : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'}`}>{OPTS[i]}</span>
              <span>{opt}</span>
              {revealed && OPTS[i]===question.answer && <span className="ml-auto text-green-600">✓</span>}
              {revealed && OPTS[i]===selected && OPTS[i]!==question.answer && <span className="ml-auto text-red-500">✗</span>}
            </span>
          </button>
        ))}
      </div>
      {!revealed && !onAnswer && <button onClick={() => setRevealed(true)} className="btn-ghost text-xs mt-1">Show Answer</button>}
      {revealed && question.solution && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 rounded-xl">
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1.5 uppercase tracking-wide">Solution</p>
          <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">{question.solution}</p>
        </div>
      )}
      {question.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {question.tags.map(tag => <span key={tag} className="text-xs text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded-full">#{tag}</span>)}
        </div>
      )}
    </div>
  )
}
