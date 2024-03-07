import React from 'react';
import './quiz.css'

interface Props {
    name: string;
    topics: string;
    onClick: () => void;
}

const Quiz: React.FC<Props> = ({ name, topics, onClick } ) => {
    return (
        <div className='quiz' onClick={onClick}>
            <div className='quiz-title'>
                {name}
            </div>
            <div className='quiz-tags'>
                {topics}
            </div>
        </div>
    )
}

export default Quiz;