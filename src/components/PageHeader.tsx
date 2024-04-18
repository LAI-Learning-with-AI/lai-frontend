import React, { useState } from 'react';
import './PageHeader.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import QuizGenModal from './modals/QuizGenModal';

interface Props {
    name: string;
    quizgen: boolean;
    logout: () => void;
    type?: 'normal' | 'short';
    topic?: string;
}

const PageHeader: React.FC<Props> = ({ name, quizgen, logout, type='normal', topic=''} ) => {
    // modal toggle state for quiz gen modal
    const [quiz, setQuiz] = useState<boolean>(false);

    // toggle light theme

    return (
        <>
            {quizgen && 
                <QuizGenModal
                    open={quiz}
                    close={() => setQuiz(false)}
                    name={'Untitled Chat'}
                    topic={topic}
                />
            }
            <div className={`page-header ${type}`}>
                <div className='page-header-name'>{name}</div>
                <div className="page-header-buttons">
                    {quizgen && <button className='create-quiz' onClick={() => {setQuiz(true)}}>Generate Quiz</button> }
                    <div className='icons'>
                        <button className='icon' onClick={() => document.documentElement.setAttribute('data-theme', 'dark')}>
                            <FontAwesomeIcon icon={faLightbulb} />
                        </button>
                        <button className='icon' onClick={() => logout()}>
                            <FontAwesomeIcon icon={faRightFromBracket} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PageHeader;