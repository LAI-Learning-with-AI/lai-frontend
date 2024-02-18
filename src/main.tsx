import React from 'react'
import ReactDOM from 'react-dom/client'
import Navbar from './components/navbar/navbar.tsx'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Navbar />
    <App />
  </React.StrictMode>,
)
