import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './quiz-mode.css';
import Quiz from '../../components/modes/quiz.tsx'
import { faCommentDots, faClipboardCheck } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import Modal from '../../components/modes/modal.tsx';

interface QuizState {
    title: string;
    tags: string;
    score: string;
    date: string;
}

function ChatMode() {
    const [quizzes, setQuizzes] = useState<QuizState[]>([])
    const [showModal, setShowModal] = useState<boolean>(false);

    function toggleModal() {
        setShowModal(!showModal);
    }

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
                                    <input type='number' defaultValue='20' min='0' max='50' />
                                </label>
                            </div>
                            <div className='modal-setting'>
                                True/False
                                <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider round" />
                                </label>
                            </div>
                            <div className='modal-setting'>
                                Multiple Choice
                                <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider round" />
                                </label>
                            </div>
                            <div className='modal-setting'>
                                Short Answer
                                <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider round" />
                                </label>
                            </div>
                            <div className='modal-setting'>
                                Coding
                                <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider round" />
                                </label>
                            </div>
                        </div>
                        <div className='modal-input'>
                            Quiz Topics
                            <textarea placeholder='topic1, topic2, topic3, ...' />
                        </div>
                    </div>
                </Modal>
                <div className="quiz-search">
                    Quiz
                    <button onClick={toggleModal}>poop</button>
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
        </div>
    );
}

export default ChatMode;
