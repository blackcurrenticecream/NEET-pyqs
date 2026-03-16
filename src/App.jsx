import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/useAuth'
import { useTheme } from './lib/useTheme'
import Layout from './components/Layout'
import Home from './pages/Home'
import SubjectPage from './pages/SubjectPage'
import QuizMode from './pages/QuizMode'
import CustomTest from './pages/CustomTest'
import TestRunner from './pages/TestRunner'
import Analytics from './pages/Analytics'
import Bookmarks from './pages/Bookmarks'
import YearPage from './pages/YearPage'

function AppRoutes() {
  const { dark } = useTheme()
  return (
    <Layout dark={dark}>
      <Routes>
        <Route path="/"               element={<Home dark={dark} />} />
        <Route path="/subject/:id"    element={<SubjectPage dark={dark} />} />
        <Route path="/year/:year"     element={<YearPage dark={dark} />} />
        <Route path="/quiz"           element={<QuizMode dark={dark} />} />
        <Route path="/custom"         element={<CustomTest dark={dark} />} />
        <Route path="/test/run"       element={<TestRunner dark={dark} />} />
        <Route path="/analytics"      element={<Analytics dark={dark} />} />
        <Route path="/bookmarks"      element={<Bookmarks dark={dark} />} />
      </Routes>
    </Layout>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
