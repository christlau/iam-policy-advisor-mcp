import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Settings from './pages/Settings'
import AuthBanner from './components/AuthBanner'
import OnboardingModal from './components/OnboardingModal'
import ConnectionStatus from './components/ConnectionStatus'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <OnboardingModal />
        <AuthBanner />
        <nav className="bg-white border-b px-6 py-3 flex gap-4 items-center">
          <Link to="/" className="font-bold text-blue-600">IAM Policy Generator</Link>
          <Link to="/" className="text-sm hover:underline">Home</Link>
          <Link to="/settings" className="text-sm hover:underline">Settings</Link>
          <div className="ml-auto"><ConnectionStatus /></div>
        </nav>
        <main className="max-w-4xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
