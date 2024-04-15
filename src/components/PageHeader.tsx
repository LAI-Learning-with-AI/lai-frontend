import React from 'react';
import './PageHeader.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

interface Props {
    name: string;
    quizgen: boolean;
    logout: () => void;
}

const PageHeader: React.FC<Props> = ({ name, quizgen, logout } ) => {
    return (
        <div className='page-header'>
            {name}
            <div className="page-header-buttons">
                {quizgen && <button className='create-quiz' onClick={() => {}}>Generate Quiz</button> }
                <div className='icons'>
                    <button className='icon'>
                        <FontAwesomeIcon icon={faLightbulb} />
                    </button>
                    <button className='icon' onClick={() => logout()}>
                        <FontAwesomeIcon icon={faRightFromBracket} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PageHeader;