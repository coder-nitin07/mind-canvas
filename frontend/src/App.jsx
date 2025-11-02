import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import Signup from './pages/Signup'
import Login from './pages/Login'
import ProtectedRoute from './utils/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Workspace from './pages/Workspace'

function App() {

  return (
    <Router>
      <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />

          {/* Protected Routes */}
          <Route
              path='/dashboard'
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
          />

          <Route
              path='/workspaces'
              element={
                <ProtectedRoute>
                  <Workspace />
                </ProtectedRoute>
              }
          />
      </Routes>
    </Router>
  )
}

export default App
