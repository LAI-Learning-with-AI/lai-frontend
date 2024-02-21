import React from 'react'
import ReactDOM from 'react-dom/client'
import Navbar from './components/navbar/navbar.tsx'
import Chat from './pages/chat-mode/chat.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Navbar />
    <Chat />
  </React.StrictMode>,
)
