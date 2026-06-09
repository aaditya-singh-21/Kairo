import './App.css'
import { AuthProvider } from './context/AuthContext'

function App() {

  return (
    <AuthProvider>
      <h1>Hii</h1>
    </AuthProvider>

  )
}

export default App
