import { useEffect, useState } from "react";
import './QuizGenModal.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardCheck } from "@fortawesome/free-solid-svg-icons";
import { User, useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface ModalProps {
    open: boolean;
    close: () => void;
    name: string;
    topic: string;
}

const QuizGenModal: React.FC<ModalProps> = ({ open, close, topic }) => {
    const [topics, setTopics] = useState<string>(topic);
    const [number, setNumber] = useState<number>(20);
    const [selectedSettings, setSelectedSettings] = useState<string[]>([]);
    const navigate = useNavigate();
    const { user } = useAuth0();

    // function to close modal if the user clicks outside of the element
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const modal = document.getElementById("modal-main");
            if (modal && !modal.contains(event.target as Node)) {
                close();
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open, close]);

    // function to handle toggle settings for the create quizzes modal
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, setting: string) => {
        const isChecked = event.target.checked;
        if (isChecked) setSelectedSettings(prevSettings => [...prevSettings, setting]);
        else setSelectedSettings(prevSettings => prevSettings.filter(item => item !== setting));
    };

    // function to make a POST request to backend to create a new quiz in the DB for user
    const createQuiz = () => {
        // loading screen

        // request
        fetch(`${import.meta.env.VITE_SERVER}/generatequiz`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "userId": user?.sub,
                "name": 'Untitled Quiz',
                "numberOfQuestions": number,
                "types": selectedSettings.join(', '),
                "topics": topics
            })
        })
        .then(response => response.json())
        .then((res) => {
            // remove loading screen
            toast.success('Quiz generated successfully');

            // move into quiz
            navigate(`/quiz/${res.quiz_id}`)
        })
        .catch(error => {
            // remove loading screen
            toast.error('Failed to generate quiz');

            console.error(error);
        });
    }

    return (
        <div className={`modal ${open ? "display-block" : "display-none"}`}>
            <div id="modal-main" className="modal-main">
            <div className='modal-content'>
                <div className='modal-heading'>
                        <div className='modal-headers'>
                            <div className='modal-name-h1'>
                                Untitled Quiz
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
                                <input type="checkbox" onChange={(e) => handleChange(e, 'TRUE_FALSE')} />
                                <span className="slider round" />
                            </label>
                        </div>
                        <div className='modal-setting'>
                            Multiple Choice
                            <label className="switch">
                                <input type="checkbox" onChange={(e) => handleChange(e, 'MULTIPLE_CHOICE')} />
                                <span className="slider round" />
                            </label>
                        </div>
                        <div className='modal-setting'>
                            Short Answer
                            <label className="switch">
                                <input type="checkbox" onChange={(e) => handleChange(e, 'SHORT_ANSWER')} />
                                <span className="slider round" />
                            </label>
                        </div>
                        <div className='modal-setting'>
                            Coding
                            <label className="switch">
                                <input type="checkbox" onChange={(e) => handleChange(e, 'CODING')} />
                                <span className="slider round" />
                            </label>
                        </div>
                    </div>
                    <div className='modal-input'>
                        Quiz Topics
                        <textarea value={topics} onChange={(e) => setTopics(e.target.value)} placeholder={'topic1, topic2, topic3, ...'} />
                    </div>
                    <div className='modal-button'>
                        <button className='submit' onClick={() => { close(); createQuiz(); }}>Start Quiz</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QuizGenModal;
