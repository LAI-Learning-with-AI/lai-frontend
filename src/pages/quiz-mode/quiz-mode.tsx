import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './quiz-mode.css';
import { useAuth0 } from "@auth0/auth0-react";
import Quiz from '../../components/modes/quiz.tsx'
import { faCommentDots, faClipboardCheck, faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/modes/modal.tsx';

interface QuizState {
    id: number,
    name: string;
    topics: string;
    score: string;
    created_at: string;
}

function QuizMode() {
    const { isAuthenticated, user, logout } = useAuth0();
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState<QuizState[]>([]);
    const [topics, setTopics] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [number, setNumber] = useState<number>(20);
    const [selectedSettings, setSelectedSettings] = useState<string[]>([]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, setting: string) => {
        const isChecked = event.target.checked;
        if (isChecked) setSelectedSettings(prevSettings => [...prevSettings, setting]);
        else setSelectedSettings(prevSettings => prevSettings.filter(item => item !== setting));
    };

    const createQuiz = () => {
        fetch(`${import.meta.env.VITE_SERVER}/generatequiz`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "userId": user?.sub,
                "name": `Quiz ${quizzes.length+1}`,
                "numberOfQuestions": number,
                "types": selectedSettings.join(', '),
                "topics": topics
            })
        })
        .then(response => response.json())
        .then((res) => {
            navigate(`/quiz/${res.quiz_id}`)
        })
        .catch(error => {
            console.error(error);
        });
    }

    function toggleModal() {
        setShowModal(!showModal);
    }

    useEffect(() => {
        fetch(`${import.meta.env.VITE_SERVER}/quizzes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "userId": user?.sub
            })
        })
        .then(response => response.json())
        .then((res: QuizState[]) => {
            setQuizzes(res);
        })
        .catch(error => {
            console.error(error);
        });
    }, [user]);

    if (!user || !isAuthenticated) {
        return null;
    }

    return (
        <div>
            <div className="quiz-sidebar">
                <Modal open={showModal} close={toggleModal}>
                    <div className='modal-content'>
                        <div className='modal-heading'>
                            <div className='modal-headers'>
                                <div className='modal-name-h1'>
                                    Quiz {quizzes.length+1}
                                </div>
                                <div className='modal-name-h2'>
                                    Set up your quiz
                                </div>
                            </div>
                            <FontAwesomeIcon className='modal-icon' icon={faClipboardCheck} />
                        </div>
                        <div className='modal-settings'>
                            <div className='modal-setting'>
                                Questions
                                <label className="number-box">
                                    <input type='number' onChange={(e) => setNumber(parseInt(e.target.value))} defaultValue='20' min='0' max='50' />
                                </label>
                            </div>
                            <div className='modal-setting'>
                                True/False
                                <label className="switch">
                                    <input type="checkbox" onChange={(e) => handleChange(e, 'True/False')} />
                                    <span className="slider round" />
                                </label>
                            </div>
                            <div className='modal-setting'>
                                Multiple Choice
                                <label className="switch">
                                    <input type="checkbox" onChange={(e) => handleChange(e, 'Multiple Choice')} />
                                    <span className="slider round" />
                                </label>
                            </div>
                            <div className='modal-setting'>
                                Short Answer
                                <label className="switch">
                                    <input type="checkbox" onChange={(e) => handleChange(e, 'Short Answer')} />
                                    <span className="slider round" />
                                </label>
                            </div>
                            <div className='modal-setting'>
                                Coding
                                <label className="switch">
                                    <input type="checkbox" onChange={(e) => handleChange(e, 'Coding')} />
                                    <span className="slider round" />
                                </label>
                            </div>
                        </div>
                        <div className='modal-input'>
                            Quiz Topics
                            <textarea value={topics} onChange={(e) => setTopics(e.target.value)} placeholder='topic1, topic2, topic3, ...' />
                        </div>
                        <div className='modal-button'>
                            <button className='submit' onClick={() => { toggleModal(); createQuiz(); }}>Start Quiz</button>
                        </div>
                    </div>
                </Modal>
                <div className="quiz-header">
                    Quiz
                    <div className="quiz-header-buttons">
                        <button className='create-quiz' onClick={() => {toggleModal(); console.log(selectedSettings); console.log(topics); console.log(number)}}>Create New Quiz</button>
                        <div className='icons'>
                            <button className='icon'>
                                <FontAwesomeIcon icon={faGear} />
                            </button>
                            <button className='icon' onClick={() => logout({ logoutParams: { returnTo: import.meta.env.VITE_LOGOUT } })}>
                                <FontAwesomeIcon icon={faRightFromBracket} />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="quiz-recent">
                    <FontAwesomeIcon icon={faCommentDots} />
                    <text className='chat-recent-label'>RECENTS</text>
                </div>
                <div className="quizzes">
                    {quizzes.map((quiz) => (
                        <Quiz name={quiz.name} topics={quiz.topics} onClick={() => navigate(`/quiz/${quiz.id}`)} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default QuizMode;
