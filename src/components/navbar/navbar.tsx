import { useState } from 'react';
import './navbar.css';
import { faGraduationCap, faCommentDots, faFileCircleQuestion } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Navbar() {
    const [expanded, setExpanded] = useState(false);

    return (
        <nav className={expanded ? "nav-expanded" : ""} onMouseEnter={() => setExpanded(true)} onMouseLeave={() => setExpanded(false)}>
            <div className="modes">
                <a href="/">
                    <i className="mode">
                        <FontAwesomeIcon icon={faCommentDots} className='icon' />  
                        <span className="label">Chat</span>
                    </i>
                </a>
                <a href="/learn">
                    <i className="mode">
                        <FontAwesomeIcon icon={faGraduationCap} className='icon' />               
                        <span className="label">Learn</span>
                    </i>
                </a>
                <a href="/quiz">
                    <i className="mode">
                        <FontAwesomeIcon icon={faFileCircleQuestion} className='icon' />  
                        <span className="label">Quiz</span>
                    </i>
                </a>
            </div>
        </nav>
    );
}

export default Navbar;
