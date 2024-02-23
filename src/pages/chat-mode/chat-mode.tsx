import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './chat-mode.css';
import Chat from '../../components/modes/chat.tsx'
import { faCommentDots } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'

interface ChatState {
    chats: string[];
    description: string;
    title: string;
}

function ChatMode() {
    const [chats, setChats] = useState<ChatState[]>([])

    useEffect(() => {
        fetch(`${import.meta.env.VITE_SERVER}/getChats`)
            .then(response => response.json())
            .then((res: ChatState[]) => {
                setChats(res);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    return (
        <div className="chat-sidebar">
            <div className="chat-search">
                Chats
            </div>
            <div className="chat-recent">
                <FontAwesomeIcon icon={faCommentDots} />
                <text className='chat-recent-label'>RECENTS</text>
            </div>
            <div className="chats">
                {chats.map((chat) => (
                    <Chat title={chat.title} description={chat.description} />
                ))}
            </div>
        </div>
    );
}

export default ChatMode;
