import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './chat-mode.css';
import Chat from '../../components/modes/chat.tsx'
import Question from '../../components/modes/question.tsx';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState, useRef  } from 'react'
import Response from '../../components/modes/response.tsx';

interface ChatState {
    chats: string[];
    description: string;
    title: string;
}

function ChatMode() {
    const [chats, setChats] = useState<ChatState[]>([]);
    const [chat, setChat] = useState<ChatState | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (chatContainerRef.current !== null)
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    };


    // Call scrollToBottom when the component mounts or when new messages are added
    // Ensure to add proper logic to trigger this function when new messages arrive

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
        <div className="chat-mode">
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
                        <Chat title={chat.title} description={chat.description} onClick={() => setChat(chat)} />
                    ))}
                </div>
            </div>
            <div className="chat-messages" ref={chatContainerRef}>
                {chat && (
                    chat.chats.map((message, index) => (
                        index % 2 === 0 ? (
                            <Question>{message}</Question>
                        ) : (
                            <Response>{message}</Response>
                        )
                    ))
                )}
            </div>
        </div>
    );
}

export default ChatMode;
