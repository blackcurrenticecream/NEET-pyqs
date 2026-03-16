import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { SEED_QUESTIONS } from '../data/questions'
import QuestionCard from '../components/QuestionCard'

export default function Bookmarks() {
  const { user, signInWithGoogle } = useAuth()
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set())

  useEffect(() => {
    if (!user) { setLoading(false); return }
    async function load() {
      try {
        const { data } = await supabase.from('bookmarks').select('question_id').eq('user_id', user.id)
        if (!data?.length) { setLoading(false); return }
        const ids = new Set(data.map(b => b.question_id))
        setBookmarkedIds(ids)
        // Get questions — filter seed data first, then Supabase
        const seed = SEED_QUESTIONS.filter(q => ids.has(q.id))
        if (seed.length) { setQuestions(seed); setLoading(false); return }
        const { data: qs } = await supabase.from('questions').select('*').in('id', [...ids])
        setQuestions(qs || [])
      } catch { setQuestions([]) }
      setLoading(false)
    }
    load()
  }, [user])

  if (!user) return (
    <div className="max-w-md mx-auto text-center py-20 fade-in">
      <div className="text-5xl mb-4">🔖</div>
      <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-3">Sign in to save bookmarks</h2>
      <p className="text-gray-500 text-sm mb-6">Bookmark any question while browsing or in quiz mode to revisit it here.</p>
      <button onClick={signInWithGoogle} className="btn-primary px-8 py-3">Sign in with Google</button>
    </div>
  )

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">🔖 Bookmarks</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{questions.length} saved question{questions.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="card p-6 h-32 animate-pulse bg-gray-50 dark:bg-gray-900"/>)}
        </div>
      ) : questions.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="text-4xl mb-3">🔖</div>
          <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">No bookmarks yet</p>
          <p className="text-sm text-gray-400">Click the 🔖 icon on any question while browsing or in quiz mode to save it here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, i) => (
            <QuestionCard
              key={q.id || i}
              question={q}
              questionNumber={i + 1}
              isBookmarked={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}
