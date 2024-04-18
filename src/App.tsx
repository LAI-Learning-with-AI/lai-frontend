import Navbar from './components/navbar/navbar.tsx'
import ChatMode from './pages/chat/ChatMode.tsx'
import InQuiz from './pages/quiz/Quiz.tsx'
import QuizMode from './pages/quiz/QuizListings.tsx'
import { BrowserRouter  as Router, Routes, Route } from 'react-router-dom'
import SignUp from './pages/register/signup.tsx'
import './App.css'
import Login from './pages/register/login.tsx'
import LearnMode from './pages/learn/LearnMode.tsx'
import Topic from './pages/learn/Topic.tsx'
import { Bounce, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useState } from 'react'
import Results from './pages/quiz/QuizResults.tsx'


function App() {
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
        <Navbar/>
        <div className='app-container'>
          <div className='navbar-spacer'></div>
          <Routes>
            <Route path='/signup' element={<SignUp />} />
            <Route path='/login' element={<Login />} />
            <Route path='/learn' element={<LearnMode />} />
            <Route path='/learn/:topic' element={<Topic />} />
            <Route path='/' element={<ChatMode />} />
            <Route path='/quizzes' element={<QuizMode />} />
            <Route path='/quiz/:id' element={<InQuiz />} />
            <Route path='/results/:id' element={<Results />} />
          </Routes>
        </div>
      </Router>
  )
}

export default App
