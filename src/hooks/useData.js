import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { SEED_QUESTIONS } from '../data/questions'
import { useAuth } from './useAuth'

// Use seed data when Supabase isn't configured yet
const isSupabaseConfigured = () =>
  !import.meta.env.VITE_SUPABASE_URL?.includes('YOUR_PROJECT') &&
  !!import.meta.env.VITE_SUPABASE_URL

export function useQuestions(filters = {}) {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  const fetch = useCallback(async () => {
    setLoading(true)
    // Fallback to seed data if Supabase not configured
    if (!isSupabaseConfigured()) {
      let data = [...SEED_QUESTIONS]
      if (filters.subject) data = data.filter(q => q.subject === filters.subject)
      if (filters.chapter) data = data.filter(q => q.chapter === filters.chapter)
      if (filters.year)    data = data.filter(q => q.year === filters.year)
      if (filters.difficulty) data = data.filter(q => q.difficulty === filters.difficulty)
      if (filters.search)  data = data.filter(q => q.question.toLowerCase().includes(filters.search.toLowerCase()))
      setTotal(data.length)
      setQuestions(filters.limit ? data.slice(0, filters.limit) : data)
      setLoading(false)
      return
    }
    let query = supabase.from('questions').select('*', { count: 'exact' })
    if (filters.subject)    query = query.eq('subject', filters.subject)
    if (filters.chapter)    query = query.eq('chapter', filters.chapter)
    if (filters.year)       query = query.eq('year', filters.year)
    if (filters.difficulty) query = query.eq('difficulty', filters.difficulty)
    if (filters.search)     query = query.ilike('question', `%${filters.search}%`)
    if (filters.limit)      query = query.limit(filters.limit)
    if (filters.randomize)  query = query.order('id', { ascending: false })
    const { data, count } = await query
    setQuestions(data || [])
    setTotal(count || 0)
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
      if (!isSupabaseConfigured()) {
        // Return mock stats for demo
        setStats({
          total: 0, correct: 0, accuracy: 0,
          bySubject: {}, byChapter: {}, recentTests: [],
          weakChapters: [], streak: 0,
        })
        setLoading(false)
        return
      }
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
      setLoading(false)
    }
    load()
  }, [user])

  return { stats, loading }
}

export async function saveAttempt({ userId, questionId, selectedOption, isCorrect, timeTaken, testId }) {
  if (!isSupabaseConfigured() || !userId) return
  await supabase.from('attempts').insert({
    user_id: userId, question_id: questionId,
    selected_option: selectedOption, is_correct: isCorrect,
    time_taken_secs: timeTaken, test_id: testId,
  })
}

export async function toggleBookmark(userId, questionId) {
  if (!isSupabaseConfigured() || !userId) return false
  const { data } = await supabase.from('bookmarks').select('id').eq('user_id', userId).eq('question_id', questionId).single()
  if (data) {
    await supabase.from('bookmarks').delete().eq('id', data.id)
    return false
  } else {
    await supabase.from('bookmarks').insert({ user_id: userId, question_id: questionId })
    return true
  }
}

export function useBookmarks() {
  const { user } = useAuth()
  const [bookmarks, setBookmarks] = useState(new Set())

  useEffect(() => {
    if (!user || !isSupabaseConfigured()) return
    supabase.from('bookmarks').select('question_id').eq('user_id', user.id)
      .then(({ data }) => setBookmarks(new Set(data?.map(b => b.question_id) || [])))
  }, [user])

  return bookmarks
}
