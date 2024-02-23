import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './quiz-mode.css';
import Quiz from '../../components/modes/quiz.tsx'
import { faCommentDots } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'

interface QuizState {
    title: string;
    tags: string;
    score: string;
    date: string;
}

function ChatMode() {
    const [quizzes, setQuizzes] = useState<QuizState[]>([])

    useEffect(() => {
        fetch(`${import.meta.env.VITE_SERVER}/getQuizzes`)
            .then(response => response.json())
            .then((res: QuizState[]) => {
                setQuizzes(res);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    return (
        <div className="quiz-sidebar">
            <div className="quiz-search">
                test
            </div>
            <div className="quiz-recent">
                <FontAwesomeIcon icon={faCommentDots} />
                <text className='chat-recent-label'>RECENTS</text>
            </div>
            <div className="quizzes">
                {quizzes.map((quiz) => (
                    <Quiz title={quiz.title} tags={quiz.tags} />
                ))}
            </div>
        </div>
    );
}

export default ChatMode;
