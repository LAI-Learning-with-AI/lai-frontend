import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './QuizListings.css';
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import Quiz from '../../components/modes/quiz/QuizListing.tsx'
import { faCommentDots, faChevronUp, faChevronDown, faRefresh, faDownload } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/modals/LoadingModal.tsx';
import Import from '../../components/modals/QuizImportModal.tsx';
import { toast } from 'react-toastify';
import PageHeader from '../../components/PageHeader.tsx';

interface QuizState {
    id: number;
    name: string;
    topics: string;
    score: number;
    created_at: string;
}

function QuizMode() {
    // vars
    const { user, logout } = useAuth0();
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState<QuizState[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [showImport, setShowImport] = useState<boolean>(false);
    const [recommended, setRecommended] = useState<boolean>(false);
    const [randomQuizzes, setRandomQuizzes] = useState<QuizState[]>([]);

    // function to toggle import state
    const toggleImport = () => {
        setShowImport(!showImport);
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
            toast.error('Error Retrieving Quiz Data.');
            console.error(error);
        });
    }, [user]);

    return (
        <div className='quiz-mode'>
            <PageHeader
                name='Quiz'
                quizgen={true}
                logout={() => logout({ logoutParams: { returnTo: import.meta.env.VITE_LOGOUT } })}
            />
            <div className="quiz-sidebar">
                <Loading open={loading} />
                <Import open={showImport} close={toggleImport} />
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
                            <Quiz name={quiz.topics} topics={"Recommended by 1 teacher and 5 students"} score={null} onClick={() => navigate(`/quiz/${quiz.id}`)} />
                        ))}
                    </div>
                </div>
                <div className="quiz-label-container">
                    <div className="quiz-label">
                        <FontAwesomeIcon icon={faCommentDots} />
                        <span className='quiz-label'>RECENTS</span>
                    </div>
                    <div className="quiz-container-buttons">
                        <button className="import" onClick={() => {toggleImport();} }>
                            <FontAwesomeIcon className='download-icon' icon={faDownload} />
                            Import
                        </button>
                    </div>
                </div>
                <div className="quizzes">
                    {quizzes.map((quiz) => (
                        <Quiz name={quiz.name} topics={quiz.topics} score={quiz.score} onClick={() => {
                            if (quiz.score)
                                navigate(`/results/${quiz.id}`)
                            else navigate(`/quiz/${quiz.id}`)
                        }
                    } />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default withAuthenticationRequired(QuizMode);
