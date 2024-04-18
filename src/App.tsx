import React, { createContext, useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer, Bounce } from 'react-toastify';
import Navbar from './components/navbar/navbar.tsx';
import ChatMode from './pages/chat/ChatMode.tsx';
import InQuiz from './pages/quiz/Quiz.tsx';
import QuizMode from './pages/quiz/QuizListings.tsx';
import SignUp from './pages/register/signup.tsx';
import './App.css';
import Login from './pages/register/login.tsx';
import LearnMode from './pages/learn/LearnMode.tsx';
import Topic from './pages/learn/Topic.tsx';
import Results from './pages/quiz/QuizResults.tsx';
import 'react-toastify/dist/ReactToastify.css';

// context to manage theme
const ThemeContext = createContext<{
  theme: string;
  toggleTheme: () => void;
}>({
  theme: 'dark',
  toggleTheme: () => {},
});

interface ThemeProviderProps {
  children: React.ReactNode;
}

// Provider component for the theme context
const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<string>('dark');

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// hook that you can import to use the theme functions
export const useTheme = () => useContext(ThemeContext);

// ThemeWrapper component to wrap theme context, since we dont want circular imports
const ThemeWrapper: React.FC = () => {
  // use context
  const { theme } = useTheme();

  return (
    <div className={`theme ${theme}`}>
      <Navbar />
      <div className="app-container">
        <div className="navbar-spacer"></div>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/learn" element={<LearnMode />} />
          <Route path="/learn/:topic" element={<Topic />} />
          <Route path="/" element={<ChatMode />} />
          <Route path="/quizzes" element={<QuizMode />} />
          <Route path="/quiz/:id" element={<InQuiz />} />
          <Route path="/results/:id" element={<Results />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider>
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
        <ThemeWrapper />
      </ThemeProvider>
    </Router>
  );
}

export default App;
