import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { SEED_QUESTIONS } from '../data/questions'
import { useAuth } from './useAuth'

export function useQuestions(filters = {}) {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      let query = supabase.from('questions').select('*', { count: 'exact' })
      if (filters.subject)    query = query.eq('subject', filters.subject)
      if (filters.chapter)    query = query.eq('chapter', filters.chapter)
      if (filters.year)       query = query.eq('year', filters.year)
      if (filters.difficulty) query = query.eq('difficulty', filters.difficulty)
      if (filters.search)     query = query.ilike('question', `%${filters.search}%`)
      if (filters.limit)      query = query.limit(filters.limit)
      else                    query = query.limit(20)

      const { data, count, error } = await query

      if (error || !data || data.length === 0) {
        // fallback to seed
        let seed = [...SEED_QUESTIONS]
        if (filters.subject)    seed = seed.filter(q => q.subject === filters.subject)
        if (filters.chapter)    seed = seed.filter(q => q.chapter === filters.chapter)
        if (filters.year)       seed = seed.filter(q => q.year === Number(filters.year))
        if (filters.difficulty) seed = seed.filter(q => q.difficulty === filters.difficulty)
        if (filters.search)     seed = seed.filter(q => q.question.toLowerCase().includes(filters.search.toLowerCase()))
        setTotal(seed.length)
        setQuestions(filters.limit ? seed.slice(0, filters.limit) : seed)
      } else {
        setQuestions(data)
        setTotal(count || data.length)
      }
    } catch(e) {
      console.error('useQuestions error:', e)
      setQuestions(SEED_QUESTIONS)
      setTotal(SEED_QUESTIONS.length)
    }
    setLoading(false)
  }, [JSON.stringify(filters)])

  useEffect(() => { fetch() }, [fetch])
  return { questions, loading, total, refetch: fetch }
}

export function useAnalytics() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    async function load() {
      try {
        const { data } = await supabase
          .from('attempts')
          .select('*, questions(subject, chapter)')
          .eq('user_id', user.id)
          .order('attempted_at', { ascending: false })

        const attempts = data || []
        const total = attempts.length
        const correct = attempts.filter(a => a.is_correct).length
        const bySubject = {}
        const byChapter = {}

        attempts.forEach(a => {
          const s = a.questions?.subject
          const c = a.questions?.chapter
          if (s) {
            if (!bySubject[s]) bySubject[s] = { total: 0, correct: 0 }
            bySubject[s].total++
            if (a.is_correct) bySubject[s].correct++
          }
          if (c) {
            if (!byChapter[c]) byChapter[c] = { total: 0, correct: 0, subject: s }
            byChapter[c].total++
            if (a.is_correct) byChapter[c].correct++
          }
        })

        const weakChapters = Object.entries(byChapter)
          .filter(([, v]) => v.total >= 3)
          .map(([name, v]) => ({ name, accuracy: Math.round((v.correct / v.total) * 100), total: v.total, subject: v.subject }))
          .sort((a, b) => a.accuracy - b.accuracy)
          .slice(0, 5)

        setStats({ total, correct, accuracy: total ? Math.round((correct / total) * 100) : 0, bySubject, byChapter, weakChapters })
      } catch(e) {
        setStats({ total:0, correct:0, accuracy:0, bySubject:{}, byChapter:{}, weakChapters:[] })
      }
      setLoading(false)
    }
    load()
  }, [user])

  return { stats, loading }
}

export async function saveAttempt({ userId, questionId, selectedOption, isCorrect, timeTaken, testId }) {
  if (!userId) return
  try {
    await supabase.from('attempts').insert({
      user_id: userId, question_id: questionId,
      selected_option: selectedOption, is_correct: isCorrect,
      time_taken_secs: timeTaken, test_id: testId,
    })
  } catch(e) { console.error('saveAttempt error:', e) }
}

export async function toggleBookmark(userId, questionId) {
  if (!userId) return false
  try {
    const { data } = await supabase.from('bookmarks').select('user_id').eq('user_id', userId).eq('question_id', questionId).single()
    if (data) {
      await supabase.from('bookmarks').delete().eq('user_id', userId).eq('question_id', questionId)
      return false
    } else {
      await supabase.from('bookmarks').insert({ user_id: userId, question_id: questionId })
      return true
    }
  } catch(e) { return false }
}

export function useBookmarks() {
  const { user } = useAuth()
  const [bookmarks, setBookmarks] = useState(new Set())
  useEffect(() => {
    if (!user) return
    supabase.from('bookmarks').select('question_id').eq('user_id', user.id)
      .then(({ data }) => setBookmarks(new Set(data?.map(b => b.question_id) || [])))
  }, [user])
  return bookmarks
}
