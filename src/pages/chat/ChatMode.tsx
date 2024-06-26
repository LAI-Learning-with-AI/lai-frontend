import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PageHeader from '../../components/PageHeader.tsx';
import './ChatMode.css';
import Chat from '../../components/modes/chat/ChatListing.tsx'
import { faCommentDots, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState, useRef  } from 'react'
import Response from '../../components/modes/chat/ChatResponseBox.tsx';
import Textarea from 'react-expanding-textarea'
import spinner from '../../assets/chat-loading.svg'
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import SpeechToText from '../../components/modes/chat/ChatSpeechToText.tsx';
import Markdown from 'markdown-to-jsx';
import { toast } from 'react-toastify';

// interface for chat objects
interface ChatState {
    chats: string[];
    description: string;
    title: string;
    chat_id: number;
    created_at: string;
}

function ChatMode() {
    // vars
    const { user, logout } = useAuth0();
    const [chats, setChats] = useState<ChatState[]>([]);
    const [waiting, setWaiting] = useState<boolean>(false);
    const [prompt, setPrompt] = useState<string>('');
    const [chat, setChat] = useState<ChatState | null>(null);
    const [search, setSearch] = useState<string>('');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // function to scroll to bottom.
    const scrollToBottom = () => {
        if (chatContainerRef.current !== null)
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    };

    // function to search thru chats for search term
    const searchQuery = (chat: ChatState, searchTerm: string): boolean => {
        // check if messages contain
        return (chat.chats.some(message => message.toLowerCase().includes(searchTerm.toLowerCase())) || chat.title.toLowerCase().includes(searchTerm.toLowerCase()))
    };

    // Filter chats based on whether any message or title/description matches the search query
    const filteredChats = chats.filter(chat => searchQuery(chat, search));

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
            toast.error('Failed to create quiz');
            console.error(error);
        });
    }

    /*
        call backend route /generateResponse to retrieve response to submitted prompts.
        each time the function is called, display loading and prevent additional submissions.
    */
    const getResponse = (prompt: string) => {
        setWaiting(true);
        chat?.chats.push(prompt)
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
            chat?.chats.push(res.response)
            setPrompt('');
        })
        .catch(error => {
            setWaiting(false);
            chat?.chats.push('Error generating response. Try again later.')
            toast.error('Failed to generate response');
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
            toast.error('Failed to retrieve chat data');
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
                    <div className="chat-search-top">
                        Chats
                        <button onClick={() => {createChat()}}className='create-chat-button'>New Chat</button>
                    </div>
                    <input placeholder='Search' value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="chat-recent">
                    <FontAwesomeIcon icon={faCommentDots} />
                    <text className='chat-recent-label'>RECENTS</text>
                </div>
                <div className="chats">
                    {filteredChats.slice().reverse().map((chat) => {
                        return (
                            <Chat
                                title={chat.chats[0] ? chat.chats[0] : chat.title}
                                description={chat.chats[chat.chats.length - 1] ? chat.chats[chat.chats.length - 1] : chat.description}
                                date={chat.created_at}
                                onClick={() => setChat(chat)}
                            />
                        );
                    })}
                </div>
            </div>
            <div className="chat-messages" ref={chatContainerRef}>
                <PageHeader
                    name={chat?.chats[0] ? chat?.chats[0] : ''}
                    quizgen={false}
                    logout={() => logout({ logoutParams: { returnTo: import.meta.env.VITE_LOGOUT } })}
                    type={'short'}
                />
                <div className="message-container">
                    {chat && (
                        chat.chats.map((message, index) => (
                            index % 2 === 0 ? (
                                <div className='question-text'>
                                    <Markdown>
                                        {message}
                                    </Markdown>
                                </div>
                            ) : (
                                <Response>
                                    <Markdown>
                                        {message}
                                    </Markdown>
                                </Response>
                            )
                        ))
                    )}
                </div>
                {chat && (                
                    <div className="chat-input">
                        <img className={`img ${waiting ? "display-block" : "display-none"}`} src={spinner} alt="Loading..." />
                        <Textarea className={`textarea ${waiting ? "display-none" : "display-block"}`} value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={handleEnter} placeholder="Enter prompt here..." />
                        <div className='textarea-buttons'>
                            <SpeechToText update={setPrompt} submit={getResponse} waiting={waiting} />
                            <button onClick={() => {
                                if (!waiting)
                                    getResponse(prompt);
                            }} className={`chat-input-send ${waiting ? "disabled" : "enabled"}`}>
                                <FontAwesomeIcon icon={faArrowRight} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default withAuthenticationRequired(ChatMode);
