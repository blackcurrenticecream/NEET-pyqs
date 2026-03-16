import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import { ThemeProvider } from './hooks/useTheme'
import Layout from './components/Layout'
import Home from './pages/Home'
import Browse from './pages/Browse'
import QuizMode from './pages/QuizMode'
import CustomTest from './pages/CustomTest'
import Analytics from './pages/Analytics'
import Bookmarks from './pages/Bookmarks'
import YearAnalysis from './pages/YearAnalysis'
import QuestionDetail from './pages/QuestionDetail'
import TestResult from './pages/TestResult'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="browse" element={<Browse />} />
              <Route path="browse/:subject" element={<Browse />} />
              <Route path="browse/:subject/:chapter" element={<Browse />} />
              <Route path="question/:id" element={<QuestionDetail />} />
              <Route path="quiz" element={<QuizMode />} />
              <Route path="custom-test" element={<CustomTest />} />
              <Route path="test-result/:testId" element={<TestResult />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="bookmarks" element={<Bookmarks />} />
              <Route path="years" element={<YearAnalysis />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}


