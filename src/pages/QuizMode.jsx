import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { SEED_QUESTIONS, SUBJECTS, SUBJECT_CHAPTERS } from '../data/questions'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const OPTS = ['A','B','C','D']

export default function QuizMode() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState('setup')
  const [config, setConfig] = useState({ subject:'', chapter:'', difficulty:'', count:10, timePerQ:90 })
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState([])
  const [revealed, setRevealed] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const timerRef = useRef(null)

  function startQuiz() {
    let pool = [...SEED_QUESTIONS]
    if (config.subject)    pool = pool.filter(q => q.subject === config.subject)
    if (config.chapter)    pool = pool.filter(q => q.chapter === config.chapter)
    if (config.difficulty) pool = pool.filter(q => q.difficulty === config.difficulty)
    if (!pool.length) return alert('No questions match. Try broader settings.')
    const qs = shuffle(pool).slice(0, config.count)
    setQuestions(qs); setAnswers(new Array(qs.length).fill(null))
    setCurrent(0); setRevealed(false); setTimeLeft(config.timePerQ || 0)
    setPhase('quiz')
  }

  useEffect(() => {
    if (phase !== 'quiz' || !config.timePerQ) return
    setRevealed(false)
    setTimeLeft(config.timePerQ)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          handleAnswer(null, false, true)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [current, phase])

  function handleAnswer(opt, isCorrect, timedOut = false) {
    clearInterval(timerRef.current)
    const updated = [...answers]
    updated[current] = { selected: opt, correct: isCorrect, timedOut }
    setAnswers(updated)
    setRevealed(true)
    if (current < questions.length - 1) {
      setTimeout(() => { setCurrent(c => c + 1); setRevealed(false) }, timedOut ? 800 : 1800)
    } else {
      setTimeout(() => setPhase('done'), timedOut ? 800 : 1800)
    }
  }

  const score = answers.filter(a => a?.correct).length
  const pct   = questions.length ? Math.round((score / questions.length) * 100) : 0
  const timerPct = config.timePerQ ? (timeLeft / config.timePerQ) * 100 : 100

  if (phase === 'setup') return (
    <div className="max-w-lg mx-auto fade-in">
      <h1 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">⚡ Quiz Mode</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Questions one by one with a timer. Instant feedback after each.</p>
      <div className="card p-6 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Subject</label>
          <select value={config.subject} onChange={e => setConfig(c => ({...c, subject:e.target.value, chapter:''}))}
            className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300">
            <option value="">All Subjects</option>
            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {config.subject && (
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Chapter</label>
            <select value={config.chapter} onChange={e => setConfig(c => ({...c, chapter:e.target.value}))}
              className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300">
              <option value="">All Chapters</option>
              {(SUBJECT_CHAPTERS[config.subject]||[]).map(ch => <option key={ch} value={ch}>{ch}</option>)}
            </select>
          </div>
        )}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Difficulty</label>
          <div className="flex gap-2">
            {['','Easy','Medium','Hard'].map(d => (
              <button key={d} onClick={() => setConfig(c => ({...c, difficulty:d}))}
                className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${config.difficulty===d ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950 text-indigo-600' : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300'}`}>
                {d||'Any'}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Questions</label>
            <input type="number" min={1} max={100} value={config.count}
              onChange={e => setConfig(c => ({...c, count:parseInt(e.target.value)||10}))}
              className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg px-3 py-2.5 text-sm font-mono text-gray-700 dark:text-gray-300"/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Seconds/Question</label>
            <select value={config.timePerQ} onChange={e => setConfig(c => ({...c, timePerQ:parseInt(e.target.value)}))}
              className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300">
              {[30,60,90,120,180,0].map(t => <option key={t} value={t}>{t?`${t}s`:'No limit'}</option>)}
            </select>
          </div>
        </div>
        <button onClick={startQuiz} className="btn-primary w-full py-3 text-base">Start Quiz ⚡</button>
      </div>
    </div>
  )

  if (phase === 'done') return (
    <div className="max-w-md mx-auto fade-in text-center">
      <div className="card p-8">
        <div className="text-6xl mb-4">{pct>=80?'🏆':pct>=60?'💪':pct>=40?'📚':'🔁'}</div>
        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">Quiz Complete!</h2>
        <div className="text-5xl font-serif font-bold my-4" style={{color:pct>=60?'#10b981':'#f59e0b'}}>{pct}%</div>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{score} correct out of {questions.length}</p>
        <div className="flex gap-2 justify-center flex-wrap mb-6">
          {answers.map((a, i) => (
            <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${a?.timedOut?'bg-gray-400':a?.correct?'bg-green-500':'bg-red-400'}`}>{i+1}</div>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={() => setPhase('setup')} className="btn-ghost flex-1">Try Again</button>
          <button onClick={() => navigate('/browse')} className="btn-primary flex-1">Browse More</button>
        </div>
      </div>
      <div className="mt-8 space-y-4 text-left">
        <h3 className="text-lg font-serif font-bold text-gray-900 dark:text-white">Review Answers</h3>
        {questions.map((q, i) => {
          const a = answers[i]; const opts = [q.option_a,q.option_b,q.option_c,q.option_d]
          return (
            <div key={i} className={`card p-4 border-l-4 ${a?.correct?'border-green-500':'border-red-400'}`}>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{q.question}</p>
              <p className="text-xs text-green-600 dark:text-green-400">✓ ({q.answer}) {opts[OPTS.indexOf(q.answer)]}</p>
              {a?.selected && a.selected !== q.answer && <p className="text-xs text-red-500">✗ Your answer: ({a.selected})</p>}
              {a?.timedOut && <p className="text-xs text-gray-400">⏱ Timed out</p>}
              {q.solution && <p className="text-xs text-gray-400 mt-2 italic">{q.solution}</p>}
            </div>
          )
        })}
      </div>
    </div>
  )

  const q = questions[current]
  const opts = [q.option_a, q.option_b, q.option_c, q.option_d]
  const currentAnswer = answers[current]

  return (
    <div className="max-w-2xl mx-auto fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-gray-500">{current+1}/{questions.length}</span>
          <div className="h-2 w-32 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full transition-all" style={{width:`${(current/questions.length)*100}%`}}/>
          </div>
        </div>
        {config.timePerQ > 0 && (
          <div className={`flex items-center gap-2 ${timeLeft<=15?'timer-warning text-red-500':'text-gray-500'}`}>
            <span className="font-mono font-bold text-lg">{timeLeft}s</span>
            <div className="w-24 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-1000 ${timeLeft<=15?'bg-red-500':'bg-indigo-500'}`} style={{width:`${timerPct}%`}}/>
            </div>
          </div>
        )}
      </div>

      <div className="card p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`badge subject-pill-${q.subject?.toLowerCase()}`}>{q.subject}</span>
          <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-500">{q.chapter}</span>
          <span className="badge bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-mono">{q.year}</span>
        </div>
        <p className="question-text text-base font-medium text-gray-900 dark:text-gray-100 mb-6 leading-relaxed">{q.question}</p>
        <div className="space-y-3">
          {opts.map((o, i) => {
            let cls = 'option-btn'
            if (revealed) {
              if (OPTS[i]===q.answer) cls = 'option-btn correct'
              else if (OPTS[i]===currentAnswer?.selected) cls = 'option-btn wrong'
              else cls = 'option-btn opacity-50'
            } else if (currentAnswer?.selected === OPTS[i]) cls = 'option-btn selected'
            return (
              <button key={i} onClick={() => !revealed && handleAnswer(OPTS[i], OPTS[i]===q.answer)} className={cls}>
                <span className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${revealed&&OPTS[i]===q.answer?'bg-green-500 border-green-500 text-white':revealed&&OPTS[i]===currentAnswer?.selected?'bg-red-400 border-red-400 text-white':'border-gray-300 dark:border-gray-600 text-gray-400'}`}>{OPTS[i]}</span>
                  {o}
                </span>
              </button>
            )
          })}
        </div>
        {revealed && q.solution && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 rounded-xl">
            <p className="text-xs font-semibold text-blue-600 mb-1.5 uppercase tracking-wide">Solution</p>
            <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">{q.solution}</p>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-4">
        <button onClick={() => { if(current>0){clearInterval(timerRef.current);setCurrent(c=>c-1);setRevealed(false)}}} disabled={current===0} className="btn-ghost disabled:opacity-30">← Prev</button>
        <button onClick={() => {
          if (!revealed) handleAnswer(null, false, true)
          else if (current < questions.length-1) { setCurrent(c=>c+1); setRevealed(false) }
          else setPhase('done')
        }} className="btn-ghost">
          {current===questions.length-1 ? 'Finish →' : 'Skip →'}
        </button>
      </div>
    </div>
  )
}
