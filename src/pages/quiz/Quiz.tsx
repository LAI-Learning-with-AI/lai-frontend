import { useParams } from 'react-router-dom';
import './Quiz.css'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { toast } from 'react-toastify';
import PageHeader from '../../components/PageHeader';
import QuizQuestions from '../../components/modes/quiz/QuizQuestions';
import Loading from '../../components/modals/LoadingModal';

// define interface for quiz
interface QuizState {
    id: number;
    date: string;
    name: string;
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

interface SubmissionState {
    questions: Question[];
}

function InQuiz() {
    // user
    const { user, logout } = useAuth0();
    const navigate = useNavigate();

    // states
    const [loading, setLoading] = useState<boolean>(false);
    const [quiz, setQuiz] = useState<QuizState>();
    let { id } = useParams<{ id: string }>();
    const [selectedChoices, setSelectedChoices] = useState<(number | null)[]>(Array(quiz?.questions.length).fill(null));
    const [textAnswers, setTextAnswers] = useState<string[]>(Array(quiz?.questions.length).fill(undefined));

    // function to handle submit button press
    const handleSubmit = () => {
        setLoading(true);
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
        }).finally(() => {
            setLoading(false);
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
        <>
            <Loading open={loading} />
            <div className='in-quiz'>
                <PageHeader
                    name={quiz?.name ? quiz?.name : 'Quiz'}
                    quizgen={false}
                    logout={() => logout({ logoutParams: { returnTo: import.meta.env.VITE_LOGOUT } })}
                />
                <QuizQuestions 
                    quiz={quiz}
                    type={'quiz'}
                    selections={selectedChoices}
                    updateSelections={setSelectedChoices}
                    text={textAnswers}
                    updateText={setTextAnswers}
                />
                <div className="in-quiz-footer">
                    <div className='text'>{selectedChoices.filter(choice => choice !== null && choice !== undefined).length + textAnswers.filter(answer => answer !== '' && answer).length} of {quiz?.questions.length} answered</div>
                    <button className='submit-quiz' onClick={() => handleSubmit()}>Submit</button>
                </div>
            </div>
        </>
    );
}

export default withAuthenticationRequired(InQuiz);
