import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './chat-mode.css';
import Chat from '../../components/modes/chat.tsx'
import { faCommentDots } from '@fortawesome/free-solid-svg-icons'


function ChatMode() {
    return (
        <div className="sidebar">
            <div className="search">
                test
            </div>
            <div className="recent">
                <FontAwesomeIcon icon={faCommentDots} />
                <text className='recent-label'>RECENTS</text>
            </div>
            <div className="chats">
                <Chat title='Chat 1 Summary' description='Topics...' />
                <div className="chat">
                    <div className="summary">
                        Chat 1 Summary
                    </div>
                    <div className="description">
                        prompt...
                    </div>
                </div>
                <div className="chat">
                    <div className="summary">
                        Chat 1 Summary
                    </div>
                    <div className="description">
                        prompt...
                    </div>
                </div>
                <div className="chat">
                    <div className="summary">
                        Chat 1 Summary
                    </div>
                    <div className="description">
                        prompt...
                    </div>
                </div>
                <div className="chat">
                    <div className="summary">
                        Chat 1 Summary
                    </div>
                    <div className="description">
                        prompt...
                    </div>
                </div>
                <div className="chat">
                    <div className="summary">
                        Chat 1 Summary
                    </div>
                    <div className="description">
                        prompt...
                    </div>
                </div>
                <div className="chat">
                    <div className="summary">
                        Chat 1 Summary
                    </div>
                    <div className="description">
                        prompt...
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatMode;