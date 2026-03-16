import { useNavigate } from 'react-router-dom'
export default function TestResult() {
  const navigate = useNavigate()
  return (
    <div className="text-center py-20 fade-in">
      <div className="text-4xl mb-3">📋</div>
      <p className="text-gray-500 mb-4">Test results are shown inline after completing a test.</p>
      <button onClick={() => navigate('/custom-test')} className="btn-primary">Go to Custom Test</button>
    </div>
  )
}
