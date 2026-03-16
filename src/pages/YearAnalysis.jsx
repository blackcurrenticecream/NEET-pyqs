import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SEED_QUESTIONS, SUBJECT_META, SUBJECTS, YEARS } from '../data/questions'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function YearAnalysis() {
  const navigate = useNavigate()
  const [subject, setSubject] = useState('')

  const filtered = subject ? SEED_QUESTIONS.filter(q => q.subject === subject) : SEED_QUESTIONS

  // Questions per year
  const byYear = YEARS.slice(0, 20).map(y => ({
    year: y,
    count: filtered.filter(q => q.year === y).length,
  })).filter(r => r.count > 0)

  // Chapter frequency across all years
  const chapterMap = {}
  filtered.forEach(q => {
    if (!chapterMap[q.chapter]) chapterMap[q.chapter] = { count: 0, years: new Set(), subject: q.subject }
    chapterMap[q.chapter].count++
    chapterMap[q.chapter].years.add(q.year)
  })
  const chapterData = Object.entries(chapterMap)
    .map(([ch, d]) => ({ chapter: ch, count: d.count, years: d.years.size, subject: d.subject }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15)

  // Subject breakdown for a year
  const [selectedYear, setSelectedYear] = useState(2023)
  const yearBreakdown = SUBJECTS.map(s => ({
    subject: s,
    count: SEED_QUESTIONS.filter(q => q.year === selectedYear && q.subject === s).length,
    color: SUBJECT_META[s].color,
  }))

  return (
    <div className="fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-1">📊 Year-wise Analysis</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Trends, weightage and high-frequency chapters across 38 years of NEET</p>
      </div>

      {/* Subject filter */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setSubject('')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${!subject ? 'bg-indigo-500 text-white border-indigo-500' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-300'}`}>
          All Subjects
        </button>
        {SUBJECTS.map(s => (
          <button key={s} onClick={() => setSubject(s === subject ? '' : s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${subject === s ? 'text-white border-transparent' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'}`}
            style={subject === s ? { backgroundColor: SUBJECT_META[s].color, borderColor: SUBJECT_META[s].color } : {}}>
            {SUBJECT_META[s].icon} {s}
          </button>
        ))}
      </div>

      {/* Questions per year chart */}
      <div className="card p-5">
        <h3 className="font-serif font-bold text-gray-900 dark:text-white mb-4">Questions per Year (sample data)</h3>
        {byYear.length > 0 ? (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byYear} margin={{top:0,right:0,left:-25,bottom:0}}>
                <XAxis dataKey="year" tick={{fontSize:10, fill:'#9ca3af'}}/>
                <YAxis tick={{fontSize:10, fill:'#9ca3af'}}/>
                <Tooltip contentStyle={{background:'#1f2937',border:'none',borderRadius:'8px',color:'#f9fafb',fontSize:'12px'}}/>
                <Bar dataKey="count" radius={[3,3,0,0]} fill={subject ? SUBJECT_META[subject]?.color : '#6366f1'} opacity={0.85}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-gray-400 text-sm text-center py-8">No data for selected filters</p>
        )}
        <p className="text-xs text-gray-400 mt-2 text-center">* Based on sample data. Full counts available after importing complete PYQ database.</p>
      </div>

      {/* High weightage chapters */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif font-bold text-gray-900 dark:text-white">🔥 High-Weightage Chapters</h3>
          <span className="text-xs text-gray-400">sorted by frequency in dataset</span>
        </div>
        <div className="space-y-2.5">
          {chapterData.map((ch, i) => (
            <div key={ch.chapter}
              className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              onClick={() => navigate(`/browse/${ch.subject}?chapter=${encodeURIComponent(ch.chapter)}`)}>
              <span className="font-mono text-xs text-gray-400 w-5">{i + 1}</span>
              <span className={`badge subject-pill-${ch.subject?.toLowerCase()} flex-shrink-0`}>{ch.subject}</span>
              <span className="text-sm text-gray-700 dark:text-gray-300 flex-1 truncate">{ch.chapter}</span>
              <span className="text-xs text-gray-400 font-mono flex-shrink-0">{ch.years}y</span>
              <div className="w-16 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex-shrink-0">
                <div className="h-full bg-indigo-500 rounded-full" style={{width:`${Math.min(100,(ch.count/chapterData[0].count)*100)}%`}}/>
              </div>
              <span className="font-mono text-xs font-bold text-indigo-500 w-6 text-right">{ch.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Year-wise subject breakdown */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h3 className="font-serif font-bold text-gray-900 dark:text-white">Subject Breakdown by Year</h3>
          <select value={selectedYear} onChange={e => setSelectedYear(parseInt(e.target.value))}
            className="text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg px-3 py-1.5 text-gray-700 dark:text-gray-300">
            {YEARS.slice(0, 20).map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div className="space-y-3">
          {yearBreakdown.map(s => (
            <div key={s.subject} className="flex items-center gap-3">
              <span className="text-sm text-gray-700 dark:text-gray-300 w-20">{s.subject}</span>
              <div className="flex-1 h-6 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <div className="h-full rounded-lg flex items-center px-2 transition-all duration-500"
                  style={{width: s.count > 0 ? `${Math.max(5, (s.count / 10) * 100)}%` : '0%', backgroundColor: s.color, opacity: 0.85}}>
                  {s.count > 0 && <span className="text-white text-xs font-mono font-bold">{s.count}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">* Sample data only. Real distribution: Physics ~45, Chemistry ~45, Biology (Bot+Zoo) ~90 per year.</p>
      </div>

      {/* Quick year links */}
      <div className="card p-5">
        <h3 className="font-serif font-bold text-gray-900 dark:text-white mb-4">Browse by Year</h3>
        <div className="flex flex-wrap gap-2">
          {YEARS.map(y => (
            <button key={y} onClick={() => navigate(`/browse?year=${y}`)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs font-mono text-gray-600 dark:text-gray-400 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 transition-all">
              {y}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
