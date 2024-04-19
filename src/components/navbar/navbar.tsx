import { useState } from 'react';
import './navbar.css';
import { faGraduationCap, faCommentDots, faClipboardCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

function Navbar() {
    // state to see if nav is expanded or not
    const [expanded, setExpanded] = useState(false);

    // usenavigate to move to other pages
    const navigate = useNavigate();

    return (
        <nav className={expanded ? "nav-expanded" : ""} onMouseEnter={() => setExpanded(true)} onMouseLeave={() => setExpanded(false)}>
            <div className="modes">
                <div className='navigate' onClick={() => navigate('/')}>
                    <i className="mode">
                        <FontAwesomeIcon icon={faCommentDots} className='icon' />  
                        <span className="label">Chat</span>
                    </i>
                </div>
                <div className='navigate' onClick={() => navigate('/learn')}>
                    <i className="mode">
                        <FontAwesomeIcon icon={faGraduationCap} className='icon' />               
                        <span className="label">Learn</span>
                    </i>
                </div>
                <div className='navigate' onClick={() => navigate('/quizzes')}>
                    <i className="mode">
                        <FontAwesomeIcon icon={faClipboardCheck} className='icon' />  
                        <span className="label">Quiz</span>
                    </i>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
