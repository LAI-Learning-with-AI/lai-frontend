import Navbar from './components/navbar/navbar.tsx'
import Chat from './pages/chat-mode/chat-mode.tsx'
import { BrowserRouter  as Router, Routes, Route } from 'react-router-dom'

function App() {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Chat />} />
      </Routes>
    </Router>
  )
}

export default App
