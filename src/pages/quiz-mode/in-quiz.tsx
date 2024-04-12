import { useParams } from 'react-router-dom';
import './in-quiz.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Textarea from 'react-expanding-textarea'
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { toast } from 'react-toastify';

// define interface for quiz
interface QuizState {
    id: number;
    date: string;
    questions: Question[];
}

// define interface for questions
interface Question {
    id: number;
    answers: string;
    choices: string | null;
    question: string;
    type: "TRUE_FALSE" | "MULTIPLE_CHOICE" | "SHORT_ANSWER" | "CODING";
    user_answer: string;
}

interface SubmissionState {
    questions: Question[];
}

function InQuiz() {
    // user
    const { user } = useAuth0();
    const navigate = useNavigate();

    // states
    const [quiz, setQuiz] = useState<QuizState>();
    let { id } = useParams<{ id: string }>();
    const [selectedChoices, setSelectedChoices] = useState<(number | null)[]>(Array(quiz?.questions.length).fill(null));
    const [textAnswers, setTextAnswers] = useState<string[]>(Array(quiz?.questions.length).fill(undefined));

    // function to store multiple choice questions
    const handleChoiceClick = (questionIndex: number, choiceIndex: number) => {
        const newSelectedChoices = [...selectedChoices];
        newSelectedChoices[questionIndex] = choiceIndex === selectedChoices[questionIndex] ? null : choiceIndex;
        setSelectedChoices(newSelectedChoices);
    };

    // function to store short answer questions
    const handleTextAnswerChange = (questionIndex: number, answer: string) => {
        const newTextAnswers = [...textAnswers];
        newTextAnswers[questionIndex] = answer;
        setTextAnswers(newTextAnswers);
    };

    // function to handle submit button press
    const handleSubmit = () => {
        console.log(selectedChoices);
        console.log(textAnswers);
        console.log(quiz?.questions.length);

        let submission: SubmissionState = {
            questions: []
        };

        quiz?.questions.map((question, index) => {
            if (question.type === 'SHORT_ANSWER' || question.type === 'CODING') {
                let newQuestion: Question = { ...question };
                newQuestion.user_answer = textAnswers[index] ? textAnswers[index] : '';
                submission.questions.push(newQuestion);
            }
            else {
                let newQuestion: Question = { ...question };
                newQuestion.answers = newQuestion.answers?.replace(/^[A-D]\) /, '');
                newQuestion.user_answer = selectedChoices[index] !== undefined && question.choices !== null ? question?.choices.split('@')[selectedChoices[index]?? 0] : '';
                submission.questions.push(newQuestion);
            }
        })
        console.log(submission);

        fetch(`${import.meta.env.VITE_SERVER}/gradequiz`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "userId": user?.sub,
                "quizId": id,
                "questions": submission.questions
            })
        })
        .then(response => response.json())
        .then(() => navigate(`/results/${id}`))
        .catch(error => {
            console.error(error);
            toast.error('Failed to submit quiz')
        });
    }

    // when user object is mounted, retrieve quizzes
    useEffect(() => {
        if (user)
            fetch(`${import.meta.env.VITE_SERVER}/quiz`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "userId": user?.sub,
                    "quizId": id
                })
            })
            .then(response => response.json())
            .then((res: QuizState) => {
                setQuiz(res);
                console.log(res);
            })
            .catch(error => {
                console.error(error);
            });
    }, [user]);

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
                                <div>{index+1} of {quiz?.questions.length}</div>
                            </div>
                            <div className='question-textee'>
                                {question.question}
                            </div>
                            <div className='question-answer'>
                                <div className='question-label'>Your answer</div>
                                {question.choices !== null ? (
                                    <div className='multiple-choice'>
                                        {question.choices.split('@').map((choice, choiceIndex) => (
                                            <div key={choiceIndex} className={`choice ${selectedChoices[index] === choiceIndex ? 'selected' : ''}`} onClick={() => handleChoiceClick(index, choiceIndex)}>
                                                {choice}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className='short-answer'>
                                        <Textarea placeholder='Type answer here...' onChange={(e) => handleTextAnswerChange(index, e.target.value)}></Textarea>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="in-quiz-footer">
                <div className='text'>{selectedChoices.filter(choice => choice !== null && choice !== undefined).length + textAnswers.filter(answer => answer !== '' && answer).length} of {quiz?.questions.length} answered</div>
                <button className='submit-quiz' onClick={() => handleSubmit()}>Submit</button>
            </div>
        </div>
    );
}

export default withAuthenticationRequired(InQuiz);
