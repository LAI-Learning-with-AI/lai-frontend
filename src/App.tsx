import Navbar from './components/navbar/navbar.tsx'
import ChatMode from './pages/chat-mode/chat-mode.tsx'
import InQuiz from './pages/quiz-mode/in-quiz.tsx'
import QuizMode from './pages/quiz-mode/quiz-mode.tsx'
import { BrowserRouter  as Router, Routes, Route } from 'react-router-dom'
import SignUp from './pages/signup/signup.tsx'
import Profile from './pages/profile.tsx'
import './App.css'
import Login from './pages/signup/login.tsx'
import LearnMode from './pages/learn-mode/learn-mode.tsx'
import Topic from './pages/learn-mode/Topic.tsx'
import { Bounce, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useState } from 'react'


function App() {
  const [light, setLight] = useState(false);

  return (
      <Router>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Bounce}
        />
        <div className={`theme ${light ? 'light' : 'dark'}`}>
          <Navbar/>
          <div className='app-container'>
            <div className='navbar-spacer'></div>
            <Routes>
              <Route path='/signup' element={<SignUp />} />
              <Route path='/login' element={<Login />} />
              <Route path='/learn' element={<LearnMode />} />
              <Route path='/learn/:topic' element={<Topic />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/' element={<ChatMode />} />
              <Route path='/quizzes' element={<QuizMode />} />
              <Route path='/quiz/:id' element={<InQuiz />} />
            </Routes>
          </div>
        </div>
        </Router>
  )
}

export default App
