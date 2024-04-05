import { useParams } from 'react-router-dom';
import './Topic.css'
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

function Topic() {
    const { user, logout } = useAuth0();
    let { topic } = useParams<{ topic: string }>();

    // return title case (e.g. linear regression => Linear Regression)
    const titleCase = (str: string | undefined) => {
        return str?.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    }
    
    return (
        <div className='learn-mode-topic'>
            <div className='topic-header'>
                {titleCase(topic)}
                <div className="topic-header-buttons">
                        <button className='create-quiz' onClick={() => {}}>Generate Quiz</button>
                        <div className='icons'>
                            <button className='icon'>
                                <FontAwesomeIcon icon={faGear} />
                            </button>
                            <button className='icon' onClick={() => logout({ logoutParams: { returnTo: import.meta.env.VITE_LOGOUT } })}>
                                <FontAwesomeIcon icon={faRightFromBracket} />
                            </button>
                        </div>
                    </div>
            </div>
            <div className='topic-element first'>
                <div className='topic-label'>
                    Explanation
                </div>
                <div className='topic-box'>
                    <div className='topic-text'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris facilisis eleifend molestie. Vivamus magna ligula, eleifend sit amet erat ac, dapibus ornare magna. Curabitur eu faucibus nisi. Etiam sed libero ut massa tincidunt feugiat. Etiam augue ante, egestas non felis molestie, porta accumsan quam. Praesent mollis sem et dolor volutpat, et mollis ipsum molestie. Ut vel eros non enim pellentesque pretium in non turpis. Mauris ligula metus, mollis et purus non, hendrerit rhoncus elit. Cras metus justo, porttitor non finibus vel, vehicula quis orci. Integer consectetur interdum tortor, nec cursus est. Quisque et neque erat. Quisque a tellus ipsum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus neque ipsum, aliquam et ligula nec, pharetra porta purus.
                    </div> 
                </div>
            </div>
            <div className='topic-element'>
                <div className='topic-label'>
                    Suggested Resources
                </div>
                <div className='topic-box'>
                    <div className='topic-resource'>
                        [resource 1]
                    </div>
                    <div className='topic-resource'>
                        [resource 2]
                    </div>
                    <div className='topic-resource'>
                        [resource 3]
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withAuthenticationRequired(Topic);