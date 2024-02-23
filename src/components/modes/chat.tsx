import React from 'react';
import './chat.css'

interface Props {
    title: string;
    description: string;
}

const Chat: React.FC<Props> = ({ title, description } ) => {
    return (
        <div className='chat'>
            <div className='summary'>
                {title}
            </div>
            <div className='description'>
                {description}
            </div>
        </div>
    )
}

export default Chat;