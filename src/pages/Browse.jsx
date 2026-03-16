import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useQuestions } from '../hooks/useData'
import { SUBJECT_META, SUBJECT_CHAPTERS, SUBJECTS, YEARS } from '../data/questions'
import QuestionCard from '../components/QuestionCard'

export default function Browse() {
  const { subject, chapter } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [filters, setFilters] = useState({
    subject: subject || '',
    chapter: chapter || '',
    year: searchParams.get('year') ? parseInt(searchParams.get('year')) : '',
    difficulty: '',
    search: '',
    limit: 20,
  })

  const { questions, loading, total } = useQuestions(filters)
  const chapters = filters.subject ? SUBJECT_CHAPTERS[filters.subject] || [] : []

  function update(key, val) {
    const next = { ...filters, [key]: val }
    if (key === 'subject') { next.chapter = '' }
    setFilters(next)
    if (key === 'subject' && val) navigate(`/browse/${val}`)
    else if (key === 'subject' && !val) navigate('/browse')
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-1">
          {filters.subject ? `${SUBJECT_META[filters.subject]?.icon} ${filters.subject}` : '📚 Browse Questions'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {filters.chapter ? `Chapter: ${filters.chapter} · ` : ''}{total} question{total !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar filters */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-4">

          {/* Subject */}
          <div className="card p-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Subject</p>
            <div className="space-y-1">
              <button
                onClick={() => update('subject', '')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!filters.subject ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-medium' : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
              >
                All Subjects
              </button>
              {SUBJECTS.map(s => (
                <button
                  key={s}
                  onClick={() => update('subject', s)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${filters.subject === s ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-medium' : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                >
                  <span>{SUBJECT_META[s].icon}</span>{s}
                </button>
              ))}
            </div>
          </div>

          {/* Chapter */}
          {filters.subject && (
            <div className="card p-4 max-h-72 overflow-y-auto">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Chapter</p>
              <div className="space-y-1">
                <button
                  onClick={() => update('chapter', '')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${!filters.chapter ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-medium' : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400'}`}
                >
                  All Chapters
                </button>
                {chapters.map(c => (
                  <button
                    key={c}
                    onClick={() => update('chapter', c)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${filters.chapter === c ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-medium' : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Year */}
          <div className="card p-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Year</p>
            <select
              value={filters.year}
              onChange={e => update('year', e.target.value ? parseInt(e.target.value) : '')}
              className="w-full text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300"
            >
              <option value="">All Years</option>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          {/* Difficulty */}
          <div className="card p-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Difficulty</p>
            <div className="flex flex-col gap-1">
              {['', 'Easy', 'Medium', 'Hard'].map(d => (
                <button
                  key={d}
                  onClick={() => update('difficulty', d)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${filters.difficulty === d ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-medium' : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400'}`}
                >
                  {d || 'All Difficulties'}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Question list */}
        <div className="flex-1 min-w-0">
          {/* Search */}
          <div className="relative mb-5">
            <input
              type="text"
              placeholder="Search questions..."
              value={filters.search}
              onChange={e => update('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:border-indigo-300 dark:focus:border-indigo-700"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded mb-3 w-2/3"></div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded mb-2 w-full"></div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-4/5"></div>
                </div>
              ))}
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-16 text-gray-400 dark:text-gray-600">
              <div className="text-4xl mb-3">🔍</div>
              <p className="font-medium">No questions found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((q, i) => (
                <QuestionCard key={q.id || i} question={q} questionNumber={i + 1} />
              ))}
              {questions.length >= filters.limit && (
                <button
                  onClick={() => setFilters(f => ({ ...f, limit: f.limit + 20 }))}
                  className="w-full py-3 border border-dashed border-gray-200 dark:border-gray-700 text-sm text-gray-500 hover:border-indigo-300 hover:text-indigo-600 rounded-xl transition-colors"
                >
                  Load more questions
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
