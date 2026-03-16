import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SEED_QUESTIONS, SUBJECTS, SUBJECT_CHAPTERS, YEARS } from '../data/questions'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const OPTS = ['A','B','C','D']

export default function CustomTest() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState('build')
  const [config, setConfig] = useState({ subjects:[], chapters:[], years:[], difficulty:[], count:45, duration:60 })
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers]     = useState({})
  const [marked, setMarked]       = useState(new Set())
  const [current, setCurrent]     = useState(0)
  const [timeLeft, setTimeLeft]   = useState(0)
  const [timerRef, setTimerRef]   = useState(null)

  function toggle(key, val) {
    setConfig(c => {
      const arr = c[key]
      return { ...c, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] }
    })
  }

  function buildTest() {
    let pool = [...SEED_QUESTIONS]
    if (config.subjects.length)   pool = pool.filter(q => config.subjects.includes(q.subject))
    if (config.chapters.length)   pool = pool.filter(q => config.chapters.includes(q.chapter))
    if (config.years.length)      pool = pool.filter(q => config.years.includes(q.year))
    if (config.difficulty.length) pool = pool.filter(q => config.difficulty.includes(q.difficulty))
    if (!pool.length) return alert('No questions match. Try broader filters.')
    const qs = shuffle(pool).slice(0, config.count)
    setQuestions(qs); setAnswers({}); setMarked(new Set()); setCurrent(0)
    const secs = config.duration * 60
    setTimeLeft(secs)
    const ref = setInterval(() => {
      setTimeLeft(t => { if (t <= 1) { clearInterval(ref); setPhase('done'); return 0 } return t - 1 })
    }, 1000)
    setTimerRef(ref)
    setPhase('test')
  }

  function submit() {
    clearInterval(timerRef)
    setPhase('done')
  }

  const score   = questions.filter((q,i) => answers[i] === q.answer).length
  const wrong   = questions.filter((q,i) => answers[i] && answers[i] !== q.answer).length
  const skipped = questions.filter((q,i) => !answers[i]).length
  const pct     = questions.length ? Math.round((score/questions.length)*100) : 0
  const neetScore = score * 4 - wrong * 1
  const mins = Math.floor(timeLeft/60), secs = timeLeft%60

  if (phase === 'build') {
    const availChapters = config.subjects.length ? config.subjects.flatMap(s => SUBJECT_CHAPTERS[s]||[]) : []
    return (
      <div className="max-w-3xl mx-auto fade-in">
        <h1 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">🎯 Custom Test Builder</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Build your own test from any combination of subjects, chapters, years and difficulty.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="card p-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Subjects</p>
            <div className="space-y-2">
              {SUBJECTS.map(s => (
                <label key={s} className="flex items-center gap-3 cursor-pointer" onClick={() => toggle('subjects', s)}>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${config.subjects.includes(s) ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300 dark:border-gray-600'}`}>
                    {config.subjects.includes(s) && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{s}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="card p-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Difficulty</p>
            <div className="space-y-2">
              {['Easy','Medium','Hard'].map(d => (
                <label key={d} className="flex items-center gap-3 cursor-pointer" onClick={() => toggle('difficulty', d)}>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${config.difficulty.includes(d) ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300 dark:border-gray-600'}`}>
                    {config.difficulty.includes(d) && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{d}</span>
                </label>
              ))}
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 mt-5">Years (optional)</p>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
              {YEARS.slice(0,20).map(y => (
                <button key={y} onClick={() => toggle('years', y)}
                  className={`px-2 py-1 rounded text-xs font-mono border transition-colors ${config.years.includes(y) ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-indigo-300'}`}>
                  {y}
                </button>
              ))}
            </div>
          </div>
          {availChapters.length > 0 && (
            <div className="card p-5 md:col-span-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Chapters (optional)</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 max-h-48 overflow-y-auto">
                {availChapters.map(ch => (
                  <label key={ch} className="flex items-center gap-2 cursor-pointer" onClick={() => toggle('chapters', ch)}>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${config.chapters.includes(ch) ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300 dark:border-gray-600'}`}>
                      {config.chapters.includes(ch) && <span className="text-white text-xs leading-none">✓</span>}
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 truncate">{ch}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="card p-5 mt-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Test Settings</p>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Questions: <span className="font-mono font-bold text-gray-900 dark:text-white">{config.count}</span></label>
              <input type="range" min={5} max={180} step={5} value={config.count}
                onChange={e => setConfig(c => ({...c, count: parseInt(e.target.value)}))}
                className="w-full accent-indigo-500"/>
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>5</span><span>45 (NEET)</span><span>180</span></div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Duration: <span className="font-mono font-bold text-gray-900 dark:text-white">{config.duration} min</span></label>
              <input type="range" min={10} max={200} step={10} value={config.duration}
                onChange={e => setConfig(c => ({...c, duration: parseInt(e.target.value)}))}
                className="w-full accent-indigo-500"/>
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>10m</span><span>180m (NEET)</span><span>200m</span></div>
            </div>
          </div>
        </div>
        <button onClick={buildTest} className="btn-primary w-full py-3 text-base mt-5">
          🎯 Start Test ({config.count} questions · {config.duration} min)
        </button>
      </div>
    )
  }

  if (phase === 'done') return (
    <div className="max-w-2xl mx-auto fade-in">
      <div className="card p-8 text-center mb-6">
        <div className="text-5xl mb-4">{pct >= 70 ? '🏆' : pct >= 50 ? '💪' : '📚'}</div>
        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-6">Test Complete!</h2>
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[['Correct', score, 'text-green-600 bg-green-50 dark:bg-green-950'], ['Wrong', wrong, 'text-red-500 bg-red-50 dark:bg-red-950'], ['Skipped', skipped, 'text-gray-500 bg-gray-50 dark:bg-gray-800'], ['NEET Score', neetScore, 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950']].map(([l,v,cls]) => (
            <div key={l} className={`rounded-xl p-3 ${cls.split(' ').slice(1).join(' ')}`}>
              <div className={`text-2xl font-serif font-bold ${cls.split(' ')[0]}`}>{v}</div>
              <div className="text-xs text-gray-400 mt-0.5">{l}</div>
            </div>
          ))}
        </div>
        <div className="text-4xl font-serif font-bold mb-4" style={{color: pct>=60?'#10b981':'#f59e0b'}}>{pct}%</div>
        <div className="flex gap-3">
          <button onClick={() => setPhase('build')} className="btn-ghost flex-1">New Test</button>
          <button onClick={() => navigate('/analytics')} className="btn-primary flex-1">Analytics</button>
        </div>
      </div>
      <h3 className="text-lg font-serif font-bold text-gray-900 dark:text-white mb-4">Full Review</h3>
      <div className="space-y-4">
        {questions.map((q,i) => {
          const ua = answers[i]; const ic = ua === q.answer
          const opts = [q.option_a, q.option_b, q.option_c, q.option_d]
          return (
            <div key={i} className={`card p-5 border-l-4 ${ic?'border-green-500':ua?'border-red-400':'border-gray-200 dark:border-gray-700'}`}>
              <div className="flex gap-2 mb-2">
                <span className="font-mono text-xs text-gray-400">Q{i+1}</span>
                <span className={`badge ${ic?'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300':ua?'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300':'bg-gray-100 text-gray-500 dark:bg-gray-800'}`}>{ic?'✓ Correct':ua?'✗ Wrong':'— Skipped'}</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{q.question}</p>
              <div className="space-y-1">
                {opts.map((o,j) => (
                  <div key={j} className={`text-xs px-3 py-2 rounded-lg ${OPTS[j]===q.answer?'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 font-medium':OPTS[j]===ua&&ua!==q.answer?'bg-red-100 dark:bg-red-950 text-red-600':'text-gray-500'}`}>
                    <span className="font-mono font-bold mr-2">{OPTS[j]}.</span>{o}{OPTS[j]===q.answer&&' ✓'}
                  </div>
                ))}
              </div>
              {q.solution && <p className="text-xs text-blue-600 dark:text-blue-400 mt-3 bg-blue-50 dark:bg-blue-950/50 p-3 rounded-lg italic">💡 {q.solution}</p>}
            </div>
          )
        })}
      </div>
    </div>
  )

  // TEST phase
  const q = questions[current]
  const opts = [q.option_a, q.option_b, q.option_c, q.option_d]
  return (
    <div className="flex flex-col lg:flex-row gap-4 fade-in">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4 card px-5 py-3">
          <span className="font-mono text-sm text-gray-500">{current+1}/{questions.length} · {Object.keys(answers).length} answered</span>
          <span className={`font-mono font-bold text-lg ${timeLeft<300?'timer-warning text-red-500':'text-gray-700 dark:text-gray-300'}`}>
            ⏱ {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
          </span>
          <button onClick={()=>{if(confirm('Submit test?')) submit()}} className="btn-primary text-sm py-1.5">Submit</button>
        </div>
        <div className="card p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-1 rounded">Q{current+1}</span>
            <span className={`badge subject-pill-${q.subject?.toLowerCase()}`}>{q.subject}</span>
            <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-500">{q.chapter}</span>
            <span className="badge bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-mono">{q.year}</span>
          </div>
          <p className="question-text text-base text-gray-900 dark:text-gray-100 font-medium mb-6 leading-relaxed">{q.question}</p>
          <div className="space-y-3">
            {opts.map((o,i) => (
              <button key={i} onClick={()=>setAnswers(a=>({...a,[current]:OPTS[i]}))}
                className={`option-btn ${answers[current]===OPTS[i]?'selected':''}`}>
                <span className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${answers[current]===OPTS[i]?'bg-indigo-500 border-indigo-500 text-white':'border-gray-300 dark:border-gray-600 text-gray-400'}`}>{OPTS[i]}</span>
                  {o}
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button onClick={()=>{const n=new Set(marked);n.has(current)?n.delete(current):n.add(current);setMarked(n)}}
              className={`text-sm flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${marked.has(current)?'border-amber-400 bg-amber-50 dark:bg-amber-950 text-amber-600':'border-gray-200 dark:border-gray-700 text-gray-500'}`}>
              🚩 {marked.has(current)?'Marked':'Mark for review'}
            </button>
            <div className="flex gap-2">
              <button onClick={()=>setCurrent(c=>Math.max(0,c-1))} disabled={current===0} className="btn-ghost disabled:opacity-30 py-1.5 text-sm">← Prev</button>
              <button onClick={()=>setCurrent(c=>Math.min(questions.length-1,c+1))} disabled={current===questions.length-1} className="btn-ghost disabled:opacity-30 py-1.5 text-sm">Next →</button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-52 flex-shrink-0">
        <div className="card p-4 sticky top-20">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Question Palette</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {questions.map((_,i) => (
              <button key={i} onClick={()=>setCurrent(i)}
                className={`w-8 h-8 rounded-lg text-xs font-mono font-bold border-2 transition-all ${i===current?'border-indigo-500 bg-indigo-500 text-white':marked.has(i)?'border-amber-400 bg-amber-50 dark:bg-amber-950 text-amber-600':answers[i]?'border-green-400 bg-green-50 dark:bg-green-950 text-green-600':'border-gray-200 dark:border-gray-700 text-gray-400 hover:border-indigo-300'}`}>
                {i+1}
              </button>
            ))}
          </div>
          <div className="space-y-1 text-xs mb-4">
            {[['bg-green-100 dark:bg-green-950 border-green-400',`Answered (${Object.keys(answers).length})`],['bg-amber-50 dark:bg-amber-950 border-amber-400',`Marked (${marked.size})`],['border-gray-200 dark:border-gray-700','Not answered']].map(([cls,lbl]) => (
              <div key={lbl} className="flex items-center gap-2"><div className={`w-4 h-4 rounded border ${cls}`}></div><span className="text-gray-500">{lbl}</span></div>
            ))}
          </div>
          <button onClick={()=>{if(confirm('Submit?')) submit()}} className="btn-primary w-full py-2 text-sm">Submit Test</button>
        </div>
      </div>
    </div>
  )
}
