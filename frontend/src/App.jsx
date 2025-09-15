import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import Signup from './pages/Signup'

function App() {

  return (
    <Router>
      <Routes>
          <Route index element={<Signup />} />
      </Routes>
    </Router>
  )
}

export default App
