import { useAnalytics } from '../hooks/useData'
import { useAuth } from '../hooks/useAuth'
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts'
import { SUBJECT_META } from '../data/questions'

const COLORS = { Physics:'#3b82f6', Chemistry:'#10b981', Botany:'#22c55e', Zoology:'#f59e0b' }

export default function Analytics() {
  const { user, signInWithGoogle } = useAuth()
  const { stats, loading } = useAnalytics()

  if (!user) return (
    <div className="max-w-md mx-auto text-center py-20 fade-in">
      <div className="text-5xl mb-4">📈</div>
      <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-3">Sign in to track progress</h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Your attempts, accuracy by chapter, weak areas — all tracked automatically once you sign in.</p>
      <button onClick={signInWithGoogle} className="btn-primary px-8 py-3">Sign in with Google</button>
    </div>
  )

  if (loading) return (
    <div className="space-y-4 animate-pulse">
      {[1,2,3].map(i => <div key={i} className="card p-6 h-32 bg-gray-50 dark:bg-gray-900"/>)}
    </div>
  )

  if (!stats || stats.total === 0) return (
    <div className="max-w-md mx-auto text-center py-20 fade-in">
      <div className="text-5xl mb-4">📊</div>
      <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-3">No data yet</h2>
      <p className="text-gray-500 text-sm mb-6">Attempt some questions in Browse or Quiz mode to see your analytics here.</p>
    </div>
  )

  const subjectData = Object.entries(stats.bySubject).map(([s, v]) => ({
    name: s, accuracy: v.total ? Math.round((v.correct/v.total)*100) : 0,
    total: v.total, correct: v.correct, fill: COLORS[s] || '#6366f1'
  }))

  const weakChapters = stats.weakChapters || []

  return (
    <div className="fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-1">📈 Your Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Performance breakdown across all attempts</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label:'Total Attempted', value: stats.total, icon:'📝' },
          { label:'Correct',         value: stats.correct, icon:'✅', color:'text-green-600' },
          { label:'Wrong',           value: stats.total - stats.correct, icon:'❌', color:'text-red-500' },
          { label:'Overall Accuracy', value: `${stats.accuracy}%`, icon:'🎯', color: stats.accuracy >= 70 ? 'text-green-600' : stats.accuracy >= 50 ? 'text-amber-500' : 'text-red-500' },
        ].map(s => (
          <div key={s.label} className="card p-5 text-center">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className={`text-2xl font-serif font-bold ${s.color || 'text-gray-900 dark:text-white'}`}>{s.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Accuracy by subject */}
      {subjectData.length > 0 && (
        <div className="card p-5">
          <h3 className="font-serif font-bold text-gray-900 dark:text-white mb-4">Accuracy by Subject</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              {subjectData.map(s => (
                <div key={s.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">{s.name}</span>
                    <span className="font-mono text-gray-500">{s.correct}/{s.total} · <span className="font-bold" style={{color:s.fill}}>{s.accuracy}%</span></span>
                  </div>
                  <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{width:`${s.accuracy}%`, backgroundColor:s.fill}}/>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectData} margin={{top:0,right:0,left:-20,bottom:0}}>
                  <XAxis dataKey="name" tick={{fontSize:11, fill:'#9ca3af'}}/>
                  <YAxis tick={{fontSize:11, fill:'#9ca3af'}} domain={[0,100]}/>
                  <Tooltip formatter={(v) => [`${v}%`, 'Accuracy']} contentStyle={{background:'#1f2937',border:'none',borderRadius:'8px',color:'#f9fafb'}}/>
                  <Bar dataKey="accuracy" radius={[4,4,0,0]}>
                    {subjectData.map((s,i) => <Cell key={i} fill={s.fill}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Weak chapters */}
      {weakChapters.length > 0 && (
        <div className="card p-5">
          <h3 className="font-serif font-bold text-gray-900 dark:text-white mb-1">⚠️ Weak Areas</h3>
          <p className="text-xs text-gray-500 mb-4">Chapters where you need more practice (min. 3 attempts)</p>
          <div className="space-y-3">
            {weakChapters.map(ch => (
              <div key={ch.name} className="flex items-center gap-3">
                <span className={`badge subject-pill-${ch.subject?.toLowerCase()}`}>{ch.subject}</span>
                <span className="text-sm text-gray-700 dark:text-gray-300 flex-1 truncate">{ch.name}</span>
                <span className="font-mono text-xs text-gray-400">{ch.total} attempts</span>
                <div className="w-24 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{width:`${ch.accuracy}%`, backgroundColor: ch.accuracy < 40 ? '#ef4444' : '#f59e0b'}}/>
                </div>
                <span className="font-mono text-xs font-bold w-10 text-right" style={{color: ch.accuracy < 40 ? '#ef4444' : '#f59e0b'}}>{ch.accuracy}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-5 text-center text-gray-400 dark:text-gray-500 text-sm">
        <p>More detailed analytics — chapter-wise heatmap, time trends, and question difficulty breakdown — become available after more attempts.</p>
      </div>
    </div>
  )
}
