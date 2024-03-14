import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './quiz-mode.css';
import { useAuth0 } from "@auth0/auth0-react";
import Quiz from '../../components/modes/quiz.tsx'
import { faCommentDots, faClipboardCheck, faGear, faRightFromBracket, faChevronUp, faChevronDown, faRefresh } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/modes/modal.tsx';
import Loading from '../../components/modes/loading.tsx';

interface QuizState {
    id: number,
    name: string;
    topics: string;
    score: string;
    created_at: string;
}

function QuizMode() {
    // vars
    const { isAuthenticated, user, logout, loginWithRedirect } = useAuth0();
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState<QuizState[]>([]);
    const [topics, setTopics] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [recommended, setRecommended] = useState<boolean>(false);
    const [number, setNumber] = useState<number>(20);
    const [selectedSettings, setSelectedSettings] = useState<string[]>([]);
    const [randomQuizzes, setRandomQuizzes] = useState<QuizState[]>([]);

    // function to handle toggle settings for the create quizzes modal
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, setting: string) => {
        const isChecked = event.target.checked;
        if (isChecked) setSelectedSettings(prevSettings => [...prevSettings, setting]);
        else setSelectedSettings(prevSettings => prevSettings.filter(item => item !== setting));
    };

    // function to make a POST request to backend to create a new quiz in the DB for user
    const createQuiz = () => {
        // loading screen
        toggleLoading();

        // request
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
            // remove loading screen
            toggleLoading();

            // move into quiz
            navigate(`/quiz/${res.quiz_id}`)
        })
        .catch(error => {
            // remove loading screen
            toggleLoading();
            console.error(error);
        });
    }

    // function to toggle modal state
    function toggleModal() {
        setShowModal(!showModal);
    }

    // function to toggle loading state
    const toggleLoading = () => {
        setLoading(!loading);
    }

    // function to toggle recommended quizzes state
    const toggleRecommended = () => {
        setRecommended(!recommended);
    }

    // function to randomize recommended quizzes
    const recRandomizer = () => {
        // shuffle
        const shuffled = [...quizzes];
        shuffled.sort(() => Math.random() - 0.5);
        // Take the first three quizzes
        setRandomQuizzes(shuffled.slice(0, 3));
    };

    // when user object mounts, fetch quizzes from the backend
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

    return (
        <div>
            <div className="quiz-sidebar">
                <Loading open={loading} />
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
                <div className='quiz-recommend-container'>
                    <div className="quiz-label-container">
                        <div className="quiz-label">
                            <FontAwesomeIcon icon={faCommentDots} />
                            <span className='quiz-label'>RECOMMENDED</span>
                        </div>
                        <div className="quiz-container-buttons">
                            <button className="randomize" onClick={() => {recRandomizer(); console.log(randomQuizzes)} }>
                                <FontAwesomeIcon className='minimize-icon' icon={faRefresh} />
                            </button>
                            <button className="minimize" onClick={() => toggleRecommended() }>
                                <FontAwesomeIcon className='minimize-icon' icon={recommended ? faChevronUp : faChevronDown} />
                            </button>
                        </div>
                    </div>
                    <div className={`recommended-quizzes ${recommended ? "enable" : "disable"}`}>
                        {randomQuizzes.map((quiz) => (
                            <Quiz name={quiz.topics} topics={"Recommended by 1 teacher and 5 students"} onClick={() => navigate(`/quiz/${quiz.id}`)} />
                        ))}
                    </div>
                </div>
                <div className='quiz-container'>
                    <div className="quiz-label-container">
                        <div className="quiz-label">
                            <FontAwesomeIcon icon={faCommentDots} />
                            <span className='quiz-label'>RECENTS</span>
                        </div>
                    </div>
                    <div className="quizzes">
                        {quizzes.map((quiz) => (
                            <Quiz name={quiz.name} topics={quiz.topics} onClick={() => navigate(`/quiz/${quiz.id}`)} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QuizMode;
