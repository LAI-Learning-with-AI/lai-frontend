import React from 'react';
import './ChatListing.css'

interface Props {
    title: string;
    description: string;
    date: string;
    onClick: () => void;
}

const Chat: React.FC<Props> = ({ title, description, onClick, date }) => {
    return (
        <div className='chat' onClick={onClick}>
            <div className='chat-heading'>
                <div className='chat-date'>
                    {date}
                </div>
                <div className='chat-summary'>
                    {title}
                </div>
            </div>
            <div className='chat-description'>
                {description}
            </div>
        </div>
    )
}

export default Chat;