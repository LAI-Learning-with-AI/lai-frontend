import { useParams } from 'react-router-dom';
import './in-quiz.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Textarea from 'react-expanding-textarea'

interface QuizState {
    date: string;
    questions: Question[];
}

interface Question {
    answers: string[] | null;
    question: string;
    type: "TRUE_FALSE" | "MULTIPLE_CHOICE" | "SHORT_ANSWER" | "CODING";
}

function InQuiz() {
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState<QuizState>();
    let { id } = useParams<{ id: string }>();

    useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVER}/getQuiz/${id}`)
        .then(response => response.json())
        .then((res: QuizState) => {
            setQuiz(res);
        })
        .catch(error => {
            console.error(error);
        });
    }, []);

    return (
        <div className='in-quiz'>
            <div className="in-quiz-header">
                Quiz {id}
                <div className="in-quiz-header-buttons">
                    <div className='icons'>
                        <button className='icon'>
                            <FontAwesomeIcon icon={faGear} />
                        </button>
                        <button className='icon'>
                            <FontAwesomeIcon icon={faRightFromBracket} />
                        </button>
                    </div>
                </div>
            </div>
            <div className="questionf">
                {quiz && (
                    quiz.questions.map((question, index) => (
                        <div className='questione'>
                            <div className='info'>
                                <div>{question.type.toLowerCase()}</div>
                                <div>{index} of {quiz?.questions.length}</div>
                            </div>
                            <div className='question-textee'>
                                {question.question}
                            </div>
                            <div className='question-answer'>
                                <div className='question-label'>Your answer</div>
                                {question.answers !== null ? (
                                    <div className='multiple-choice'>
                                        {question.answers.map((answer) => (
                                            <div className='choice'>
                                                {answer}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className='short-answer'>
                                        <Textarea placeholder='Type answer here...'></Textarea>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
                </div>
            <div className="in-quiz-footer">
                <div className='text'>0 of {quiz?.questions.length} answered</div>
                <button className='submit-quiz' onClick={() => navigate('/quiz')}>Submit</button>
            </div>
        </div>
    );
}

export default InQuiz;