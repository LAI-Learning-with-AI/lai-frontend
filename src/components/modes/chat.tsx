import React from 'react';
import './chat.css'

interface Props {
    title: string;
    description: string;
    onClick: () => void;
}

const Chat: React.FC<Props> = ({ title, description, onClick }) => {
    return (
        <div className='chat' onClick={onClick}>
            <div className='chat-summary'>
                {title}
            </div>
            <div className='chat-description'>
                {description}
            </div>
        </div>
    )
}

export default Chat;