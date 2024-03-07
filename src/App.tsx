import Navbar from './components/navbar/navbar.tsx'
import ChatMode from './pages/chat-mode/chat-mode.tsx'
import InQuiz from './pages/quiz-mode/in-quiz.tsx'
import QuizMode from './pages/quiz-mode/quiz-mode.tsx'
import { BrowserRouter  as Router, Routes, Route } from 'react-router-dom'
import SignUp from './pages/signup/signup.tsx'
import Profile from './pages/profile.tsx'


function App() {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/signup' element={<SignUp />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/' element={<ChatMode />} />
        <Route path='/quizzes' element={<QuizMode />} />
        <Route path='/quiz/:id' element={<InQuiz />} />
      </Routes>
    </Router>
  )
}

export default App
