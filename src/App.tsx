import Navbar from './components/navbar/navbar.tsx'
import ChatMode from './pages/chat-mode/chat-mode.tsx'
import QuizMode from './pages/quiz-mode/quiz-mode.tsx'
import { BrowserRouter  as Router, Routes, Route } from 'react-router-dom'

function App() {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<ChatMode />} />
        <Route path='/quiz' element={<QuizMode />} />
      </Routes>
    </Router>
  )
}

export default App
