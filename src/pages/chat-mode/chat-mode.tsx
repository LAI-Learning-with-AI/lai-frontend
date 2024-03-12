import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './chat-mode.css';
import Chat from '../../components/modes/chat.tsx'
import Question from '../../components/modes/question.tsx';
import { faCommentDots, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState, useRef  } from 'react'
import Response from '../../components/modes/response.tsx';
import Textarea from 'react-expanding-textarea'
import spinner from '../../assets/chat-loading.svg'
import { useAuth0 } from '@auth0/auth0-react';

// interface for chat objects
interface ChatState {
    chats: string[];
    description: string;
    title: string;
    chat_id: number;
}

function ChatMode() {
    // vars
    const { isAuthenticated, user } = useAuth0();
    const [chats, setChats] = useState<ChatState[]>([]);
    const [waiting, setWaiting] = useState<boolean>(false);
    const [prompt, setPrompt] = useState<string>('');
    const [chat, setChat] = useState<ChatState | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // function to scroll to bottom.
    const scrollToBottom = () => {
        if (chatContainerRef.current !== null)
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    };

    // call backend route to create a new chat object for the user.
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

    /*
        call backend route /generateResponse to retrieve response to submitted prompts.
        each time the function is called, display loading and prevent additional submissions.
    */
    const getResponse = (prompt: string) => {
        setWaiting(true);
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
            setWaiting(false);
            chat?.chats.push(prompt)
            chat?.chats.push(res.response)
            setPrompt('');
        })
        .catch(error => {
            setWaiting(false);
            console.error(error);
        });
    }

    /* 
        function that allows users to submit prompts using the enter key in addition to the submit button, 
        with the ability to shift + enter to enter a newline.
    */
    const handleEnter = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey && !waiting) {
            event.preventDefault();
            getResponse(prompt);
        }
    };

    // call backend route /chats to retrieve chat data for a user.
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

    // when the user object mounts, retrieve the chats for the user
    useEffect(() => {
        getChats();
    }, [user]);

    // scroll to bottom of each chat the user clicks on
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
                        <img className={`img ${waiting ? "display-block" : "display-none"}`} src={spinner} alt="Loading..." />
                        <Textarea className={`textarea ${waiting ? "display-none" : "display-block"}`} value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={handleEnter} placeholder="Enter prompt here..." />
                        <button onClick={() => {
                            if (!waiting)
                                getResponse(prompt);
                        }} className={`chat-input-send ${waiting ? "disabled" : "enabled"}`}>
                            <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChatMode;
