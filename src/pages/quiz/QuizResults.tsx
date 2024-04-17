import { useParams } from 'react-router-dom';
import './QuizResults.css'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import PageHeader from '../../components/PageHeader';

// define interface for quiz
interface QuizState {
    id: number;
    name: string;
    date: string;
    questions: Question[];
}

// define interface for questions
interface Question {
    id: number;
    answers: string;
    choices: string | null;
    question: string;
    score: number;
    type: "TRUE_FALSE" | "MULTIPLE_CHOICE" | "SHORT_ANSWER" | "CODING";
    user_answer: string;
}

function Results() {
    // user
    const { user, logout } = useAuth0();
    const navigate = useNavigate();

    // states
    const [quiz, setQuiz] = useState<QuizState>();
    let { id } = useParams<{ id: string }>();

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
        <div className='quiz-results'>
           <PageHeader
                name={quiz?.name ? quiz?.name : 'Quiz'}
                quizgen={false}
                logout={() => logout({ logoutParams: { returnTo: import.meta.env.VITE_LOGOUT } })}
            />
            <div className="questionf">
                {quiz && (
                    quiz.questions.map((question, index) => (
                        <div className='expanded-question'>
                            <CircularProgressbar
                                value={question.score*100}
                                text={`${question.score*100}`}
                                styles={buildStyles({
                                    textColor: "#A6FF86",
                                    pathColor: "#A6FF86",
                                    trailColor: "#FF4E2E",
                                    textSize: "30px"
                            })} />
                            <div className='questione'>
                                <div className='info'>
                                    <div className='left'>
                                        <div>{question.type.toLowerCase()}</div>
                                    </div>
                                    <div>{index+1} of {quiz?.questions.length}</div>
                                </div>
                                <div className='question-textee'>
                                    {question.question}
                                </div>
                                <div className='question-answer'>
                                    <div className='question-label'>Your answer</div>
                                    {question.choices !== null ? (
                                        <div className='multiple-choice'>
                                            {question.choices.split('@').map((choice, choiceIndex) => { 
                                                let correct: string = '';
                                                if (choice == question.answers.replace(/^[A-D]\) /, ''))
                                                    correct = 'correct'
                                                else if (choice == question.user_answer)
                                                    correct = 'wrong'
                                            
                                                return (
                                                    <div key={choiceIndex} className={`choice ${correct}`} onClick={() => {}}>
                                                        {choice}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    ) : (
                                        <div className='short-answer'>
                                            <div className='answer'>{question.user_answer}</div>
                                        </div>
                                    )}
                                </div>
                                {(question.type == 'SHORT_ANSWER' || question.type == 'CODING') &&
                                    <div className='question-answer'>
                                        <div className='question-label'>Explanation</div>
                                        <div className='short-answer'>
                                            <div className='explanation'>{question.answers}</div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default withAuthenticationRequired(Results);
