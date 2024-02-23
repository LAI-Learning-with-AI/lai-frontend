import React from 'react';
import './chat.css'

interface Props {
    title: string;
    description: string;
}

const Chat: React.FC<Props> = ({ title, description } ) => {
    return (
        <div className='chat'>
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