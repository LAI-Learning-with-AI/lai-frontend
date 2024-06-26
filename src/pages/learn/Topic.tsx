import { useParams } from 'react-router-dom';
import './Topic.css'
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Markdown from 'markdown-to-jsx'
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import spinner from '../../assets/chat-loading.svg'
import { toast } from 'react-toastify';
import PageHeader from '../../components/PageHeader';

// interface for retrieving explanation from backend
interface ExplanationState {
    topic: string;
    explanation: string;
}

// interface for response from the fetch
interface ResourcesResponseState {
    resources: ResourcesState[];
}

// interface for resources
interface ResourcesState {
    [key: string]: {
        heading?: string;
        heading_font?: number;
        content_font?: number;
        page_numbers?: number[];
        source: string;
    }[];
}


function Topic() {
    // vars
    const { user, logout } = useAuth0();
    let { topic } = useParams<{ topic: string }>();
    const [explanation, setExplanation] = useState<string>('');
    const [recommended, setRecommended] = useState<string[]>([]);
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    // return title case (e.g. linear regression => Linear Regression)
    const titleCase = (str: string | undefined): string => {
        if (!str) return '';
        return str?.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    }

    // fxn to fetch explanation from backend
    const fetchExplanation = () => {
        fetch(`${import.meta.env.VITE_SERVER}/getExplanation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "topic": topic
            })
        })
        .then(response => response.json())
        .then((res: ExplanationState) => {
            setExplanation(res.explanation);
            console.log(res);
        })
        .catch(error => {
            console.error(error);
        });
    }

    // fxn to generate explanation from backend
    const generateExplanation = () => {
        fetch(`${import.meta.env.VITE_SERVER}/postExplanation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "topic_id": topic,
                "topic": titleCase(topic)
            })
        })
        .then(response => response.json())
        .then((res: ExplanationState) => {
            setExplanation(res.explanation);
            setButtonLoading(false);
            console.log(res);
        })
        .catch(error => {
            setButtonLoading(false);
            toast.error('Failed to generate explanation');
            console.error(error);
        });
    }

    // fxn to fetch recommended resources from backend.
    const fetchRecommended = () => {
        fetch(`${import.meta.env.VITE_SERVER}/getsimilar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "topics": [titleCase(topic)],
                "max_resources_per_topic": 10
            })
        })
        .then(response => response.json())
        .then((res: ResourcesResponseState) => {
            const key = titleCase(topic)
            let sources: Set<string> = new Set();
            res.resources[0][key].forEach((object) => {
                if (object.page_numbers)
                    if (object.page_numbers.length > 1)
                        sources.add(object.source + `, Pages: ${object.page_numbers[0]}-${object.page_numbers[object.page_numbers.length-1]}`)
                    else sources.add(object.source + `, Pages: ${object.page_numbers[0]}`)
                else sources.add(object.source)
            })
            setRecommended([...sources].sort());
            console.log(recommended);
        })
        .catch(error => {
            console.error(error);
            toast.error('Failed to retrieve recommended resources');
        });
    }
    
    // when user object mounts, fetch explanation from backend and resources
    useEffect(() => {
        fetchExplanation();
        fetchRecommended();
    }, [user]);

    // handler for generate reponse button click
    const handleGenerateResponse = () => {
        // set button loading to true for loading symbol
        setButtonLoading(true);
        // call generateExplanation
        generateExplanation();
    }
    
    return (
        <div className='learn-mode-topic'>
            <PageHeader
                name={titleCase(topic)}
                quizgen={true}
                logout={() => logout({ logoutParams: { returnTo: import.meta.env.VITE_LOGOUT } })}
                topic={titleCase(topic).toLowerCase()}
            />
            <div className='topic-element first'>
                <div className='topic-label'>
                    Explanation
                </div>
                <div className='topic-box'>
                    <div className='topic-text'>
                        { explanation ? 
                            <Markdown>{explanation}</Markdown> : (
                            <div className='button-container'>
                                { buttonLoading ?
                                    <img src={spinner} alt="Loading..." /> :
                                    <button title='Generate Response' onClick={() => {handleGenerateResponse();}}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </button> 
                                }
                            </div>
                        )}
                    </div> 
                </div>
            </div>
            <div className='topic-element'>
                <div className='topic-label'>
                    Suggested Resources
                </div>
                <div className='topic-box'>
                    { recommended.map((resource) => (
                        <div className='topic-resource'>
                            {resource}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default withAuthenticationRequired(Topic);