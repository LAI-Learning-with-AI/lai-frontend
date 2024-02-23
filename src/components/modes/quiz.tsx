import React from 'react';
import './quiz.css'

interface Props {
    title: string;
    tags: string;
}

const Quiz: React.FC<Props> = ({ title, tags } ) => {
    return (
        <div className='quiz'>
            <div className='quiz-title'>
                {title}
            </div>
            <div className='quiz-tags'>
                {tags}
            </div>
        </div>
    )
}

export default Quiz;