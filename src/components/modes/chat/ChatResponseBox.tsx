import { ReactNode } from "react";
import './ChatResponseBox.css'
import { faThumbsUp, faThumbsDown, faRotateRight, faInfo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ResponseProps {
    children: ReactNode;
}

// todo: implement functionality for liking, disliking, and sources

const Response: React.FC<ResponseProps> = ( { children }) => {
    return (
        <div className='response'>      
            {children}
            <div className='response-buttons'>
                <div className='left'>
                    <button className='icon'>
                        <FontAwesomeIcon icon={faThumbsUp} />
                    </button>
                    <button className='icon'>
                        <FontAwesomeIcon icon={faThumbsDown} />
                    </button>
                    <button className='icon'>
                        <FontAwesomeIcon icon={faRotateRight} />
                    </button>
                </div>
                <div className='right'>
                    <button className='icon'>
                        <FontAwesomeIcon icon={faInfo} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Response;