import React from 'react';
import './quiz.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import "react-circular-progressbar/dist/styles.css";

interface Props {
    name: string;
    topics: string;
    onClick: () => void;
}

const Quiz: React.FC<Props> = ({ name, topics, onClick } ) => {
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
            <div className='quiz-buttons'>
                <div className='icons'>
                    <button className='icon'>
                        <FontAwesomeIcon icon={faRotateRight} />
                    </button>
                    <div className='icon progress'>
                        <CircularProgressbar
                            value={80}
                            text={`80%`}
                            styles={buildStyles({
                                textColor: "#A6FF86",
                                pathColor: "#A6FF86",
                                trailColor: "#FF4E2E",
                                textSize: "30px"
                            })}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Quiz;