import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { useState } from 'react'

const NAV = [
  { to: '/',            label: 'Home',        icon: '🏠' },
  { to: '/browse',      label: 'Browse',      icon: '📚' },
  { to: '/quiz',        label: 'Quiz Mode',   icon: '⚡' },
  { to: '/custom-test', label: 'Custom Test', icon: '🎯' },
  { to: '/years',       label: 'Year Trends', icon: '📊' },
  { to: '/analytics',   label: 'Analytics',   icon: '📈' },
  { to: '/bookmarks',   label: 'Bookmarks',   icon: '🔖' },
]

export default function Layout() {
  const { user, signInWithGoogle, signOut } = useAuth()
  const { dark, toggle } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-xl">🧬</span>
            <div>
              <span className="font-serif text-lg font-bold text-gray-900 dark:text-white">NEET PYQ</span>
              <span className="hidden sm:inline text-xs text-gray-400 ml-2">38 years · 15k+ questions</span>
            </div>
          </div>
          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map(n => (
              <NavLink key={n.to} to={n.to} end={n.to === '/'}
                className={({ isActive }) => `px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={toggle} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">{dark ? '☀️' : '🌙'}</button>
            {user ? (
              <div className="flex items-center gap-2">
                <img src={user.user_metadata?.avatar_url} alt="" className="w-8 h-8 rounded-full border-2 border-indigo-200" onError={e => e.target.style.display='none'}/>
                <button onClick={signOut} className="hidden sm:block text-xs px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">Sign out</button>
              </div>
            ) : (
              <button onClick={signInWithGoogle} className="btn-primary flex items-center gap-2 text-sm px-3 py-1.5">
                <span className="hidden sm:inline">Sign in</span><span>→</span>
              </button>
            )}
            <button className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setMobileOpen(o => !o)}>
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-2">
            {NAV.map(n => (
              <NavLink key={n.to} to={n.to} end={n.to === '/'} onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-1 ${isActive ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                <span>{n.icon}</span>{n.label}
              </NavLink>
            ))}
          </div>
        )}
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6"><Outlet /></main>
    </div>
  )
}
