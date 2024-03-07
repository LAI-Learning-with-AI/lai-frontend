import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './chat-mode.css';
import Chat from '../../components/modes/chat.tsx'
import Question from '../../components/modes/question.tsx';
import { faCommentDots, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState, useRef  } from 'react'
import Response from '../../components/modes/response.tsx';
import Textarea from 'react-expanding-textarea'
import { useAuth0 } from '@auth0/auth0-react';

interface ChatState {
    chats: string[];
    description: string;
    title: string;
    chat_id: number;
}

function ChatMode() {
    const { isAuthenticated, user } = useAuth0();
    const [chats, setChats] = useState<ChatState[]>([]);
    const [prompt, setPrompt] = useState<string>('');
    const [chat, setChat] = useState<ChatState | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (chatContainerRef.current !== null)
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    };

    const createChat = () => {
        fetch(`${import.meta.env.VITE_SERVER}/createChat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "userId": user?.sub,
                "name": "Untitled Chat"
            })
        })
        .then(() => {
            getChats();
        })
        .catch(error => {
            console.error(error);
        });
    }

    const getResponse = (prompt: string) => {
        fetch(`${import.meta.env.VITE_SERVER}/generateResponse`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "userId": user?.sub,
                "chatId": chat?.chat_id,
                "message": prompt,
                "context": {
                    "previous": chat?.chats,
                    "userData": {}
                }
            })
        })
        .then(response => response.json())
        .then(res => {
            chat?.chats.push(prompt)
            chat?.chats.push(res.response)
            setPrompt('');
            scrollToBottom();
        })
        .catch(error => {
            console.error(error);
        });
    }

    const getChats = () => {
        fetch(`${import.meta.env.VITE_SERVER}/chats`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "userId": user?.sub
            })
        })
        .then(response => response.json())
        .then((res: ChatState[]) => {
            setChats(res);
        })
        .catch(error => {
            console.error(error);
        });
    }

    useEffect(() => {
        getChats();
    }, [user]);

    useEffect(() => {
        scrollToBottom();
    }, [chat?.chats])

    return (
        <div className="chat-mode">
            <div className="chat-sidebar">
                <div className="chat-search">
                    Chats
                    <button onClick={() => {createChat()}}className='create-chat-button'>New Chat</button>
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
                {chat && (                
                    <div className="chat-input">
                        <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Enter prompt here..." />
                        <button onClick={() => {getResponse(prompt)}} className="chat-input-send">
                            <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChatMode;
