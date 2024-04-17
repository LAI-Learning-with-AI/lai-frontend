import React from 'react';
import './QuizListing.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import "react-circular-progressbar/dist/styles.css";
import Progress from '../../Progress';

interface Props {
    name: string;
    topics: string;
    score: number | null;
    onClick: () => void;
}

const Quiz: React.FC<Props> = ({ name, topics, score, onClick } ) => {
    return (
        <div className='quiz' onClick={onClick}>
            <div className='quiz-descriptions'>
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
                        <button className='icon'>
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
    )
}

export default Quiz;