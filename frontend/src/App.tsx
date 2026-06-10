import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoutes from './components/ProtectedRoutes'
import LandingPage from './pages/LandingPage'

// Placeholder pages – replace with real components later
function Dashboard() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center">
      <div className="text-center">
        <p className="font-mono text-[11px] text-pitch-40 uppercase tracking-widest mb-4">Dashboard</p>
        <h1 className="font-sans font-black text-pitch" style={{ fontSize: 48, letterSpacing: '-0.04em' }}>
          Coming soon.
        </h1>
      </div>
    </div>
  )
}

function SignIn() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center">
      <div className="text-center">
        <p className="font-mono text-[11px] text-pitch-40 uppercase tracking-widest mb-4">Auth</p>
        <h1 className="font-sans font-black text-pitch" style={{ fontSize: 48, letterSpacing: '-0.04em' }}>
          Sign In
        </h1>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoutes>
                <Dashboard />
              </ProtectedRoutes>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
