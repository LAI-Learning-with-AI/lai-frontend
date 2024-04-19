import { useParams } from 'react-router-dom';
import './QuizResults.css'
import { useEffect, useState } from 'react';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import PageHeader from '../../components/PageHeader';
import QuizQuestions from '../../components/modes/quiz/QuizQuestions';

// define interface for quiz
interface QuizState {
    id: number;
    name: string;
    date: string;
    score: number;
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
            <QuizQuestions 
                quiz={quiz}
                type={'graded'}
            />
        </div>
    );
}

export default withAuthenticationRequired(Results);
