import React from 'react';
import './ChatListing.css'

interface Props {
    title: string;
    description: string;
    date: string;
    onClick: () => void;
}

const Chat: React.FC<Props> = ({ title, description, onClick, date }) => {
    // get date difference
    const creation = new Date(date);
    const current = new Date();
    const difference = current.getTime() - creation.getTime();
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    // format
    let diff = '';
    if (days > 0)
        diff += days + 'd';
    else if(hours > 0)
        diff += hours + 'h';
    else if (minutes > 0 || diff === '')
        diff += minutes + 'm';

    return (
        <div className='chat' onClick={onClick}>
            <div className='chat-heading'>
                <div className='chat-date'>
                    {diff}
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