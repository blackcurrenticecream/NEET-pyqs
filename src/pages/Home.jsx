import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { SUBJECT_META, SUBJECTS, YEARS } from '../data/questions'

export default function Home() {
  const { user, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  return (
    <div className="space-y-10 fade-in">
      <div className="text-center py-12 px-4">
        <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6 border border-indigo-100 dark:border-indigo-900">
          🧬 38 Years of NEET PYQs — 1988 to 2025
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-4 leading-tight">
          Master NEET with<br/><span className="text-indigo-600 dark:text-indigo-400">Past Year Questions</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto mb-8">Chapter-wise, year-wise, with solutions and analytics. Quiz mode, custom tests, and performance tracking.</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button onClick={() => navigate('/browse')} className="btn-primary px-6 py-2.5 text-base">Browse Questions →</button>
          <button onClick={() => navigate('/quiz')} className="btn-ghost px-6 py-2.5 text-base">⚡ Quick Quiz</button>
          {!user && <button onClick={signInWithGoogle} className="btn-ghost px-6 py-2.5 text-base text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800">Sign in to track progress</button>}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[['15,000+','Total Questions','📝'],['1988–2025','Years Covered','📅'],['100+','Chapters','📚'],['4','Subjects','🔬']].map(([v,l,i]) => (
          <div key={l} className="card p-5 text-center">
            <div className="text-2xl mb-2">{i}</div>
            <div className="text-2xl font-serif font-bold text-gray-900 dark:text-white">{v}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{l}</div>
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-5">Browse by Subject</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SUBJECTS.map(subject => {
            const meta = SUBJECT_META[subject]
            return (
              <button key={subject} onClick={() => navigate(`/browse/${subject}`)}
                className="card p-6 text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group">
                <div className="text-3xl mb-3">{meta.icon}</div>
                <h3 className="text-lg font-serif font-bold text-gray-900 dark:text-white mb-1">{subject}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{meta.questions.toLocaleString()}+ questions</p>
                <div className="h-1 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div className="h-full rounded-full group-hover:opacity-80 transition-opacity" style={{width:'65%',backgroundColor:meta.color}}/>
                </div>
              </button>
            )
          })}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          ['⚡ Quiz Mode','Timed questions one by one. Instant feedback and solutions.','border-indigo-500','/quiz'],
          ['🎯 Custom Test','Pick chapters, years, difficulty. Set duration. Simulate NEET.','border-emerald-500','/custom-test'],
          ['📊 Year Trends','Which chapters appear most. 38-year weightage analysis.','border-amber-500','/years'],
        ].map(([title, desc, border, path]) => (
          <div key={title} onClick={() => navigate(path)} className={`card p-6 cursor-pointer hover:shadow-md transition-all group border-l-4 ${border}`}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-serif font-bold text-gray-900 dark:text-white text-lg mb-2">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
              </div>
              <span className="text-gray-300 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-4">Recent NEET Papers</h2>
        <div className="flex flex-wrap gap-2">
          {YEARS.slice(0,15).map(y => (
            <button key={y} onClick={() => navigate(`/browse?year=${y}`)}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm font-mono text-gray-700 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 transition-all">
              {y}
            </button>
          ))}
          <button onClick={() => navigate('/years')} className="px-4 py-2 rounded-lg border border-dashed border-gray-200 dark:border-gray-700 text-sm text-gray-400 hover:text-gray-600 transition-colors">All years →</button>
        </div>
      </div>
    </div>
  )
}
