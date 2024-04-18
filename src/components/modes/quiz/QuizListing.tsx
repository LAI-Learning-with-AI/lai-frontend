import React, { useState } from 'react';
import './QuizListing.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import "react-circular-progressbar/dist/styles.css";
import Progress from '../../Progress';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'react-toastify';
import Loading from '../../modals/LoadingModal';

interface Props {
    name: string;
    id: number;
    topics: string;
    score: number | null;
    onClick: () => void;
}

const Quiz: React.FC<Props> = ({ name, id, topics, score, onClick } ) => {
    // loading state for modal
    const [loading, setLoading] = useState<boolean>(false);

    // grab user
    const { user } = useAuth0();
    
    // fxn used to navigate to other pages
    const navigate = useNavigate();
    
    // function to duplicate/retake quiz on button click
    const retakeQuiz = () => {
        // set loading
        setLoading(true);

       // request
       fetch(`${import.meta.env.VITE_SERVER}/importQuiz`, {
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
        .then((res) => {
            // move into quiz
            navigate(`/quiz/${res.quiz_id}`)
        })
        .catch(error => {
            console.error(error);
            toast.error('Failed to duplicate quiz')
        }).finally(() => {
            setLoading(false);
        })
    }

    return (
        <>
        <Loading open={loading}/>
        <div className='quiz'>
            <div className='quiz-descriptions' onClick={onClick}>
                <div className='quiz-title'>
                    {name}
                </div>
                <div className='quiz-tags'>
                    {topics}
                </div>
            </div>
            {   score &&
                <div className='quiz-buttons'>
                    <div className='icons'>
                        <button className='icon' onClick={() => retakeQuiz()}>
                            <FontAwesomeIcon icon={faRotateRight} />
                        </button>
                        <Progress
                            type='big'
                            score={score}
                        />
                    </div>
                </div>
            }
        </div>
        </>
    )
}

export default Quiz;