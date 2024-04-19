import React, { useState } from 'react';
import './Dropdown.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCircleChevronUp, faCircleChevronDown, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

//define interface for topics
interface TopicState {
    frequency: number;
    mastery: 'struggling' | 'learning' | 'mastered';
    score: number;
    topic: string;
}

interface Props {
    category: string;
    topics: TopicState[];
    description: string;
}

const Dropdown: React.FC<Props> = ({ category, topics, description } ) => {
    // toggle for the dropdown
    const [open, setOpen] = useState<boolean>(false);
    const toggleDropdown = () => {
        setOpen(!open);
    }

    // fxn used to navigate to other webpages
    const navigate = useNavigate();

    // converts a topic ("Ensemble Learning") to a url ("ensemble_learning")
    const convertTopicToUrl = (topic: string): string => {
        return topic.trim().replace(/\s+/g, "_").toLowerCase();
    }

    return (
        <div className='dropdown-container'>
            <button className='dropdown' onClick={() => toggleDropdown()}>
                <div className='left'>
                    {category}
                    <div className="tooltip-container">
                        <FontAwesomeIcon className='more-info' icon={faQuestionCircle} />
                        <div className="tooltip">{description}</div>
                    </div>
                </div>
                <FontAwesomeIcon icon={!open ? faCircleChevronUp: faCircleChevronDown} />
            </button>
            <div className={`dropdown-content ${!open ? 'open' : 'closed'}`}>
                {topics.map((topic, index) => (
                    topic.mastery === category.toLowerCase() && (
                        <button key={index} onClick={() => navigate(`/learn/${convertTopicToUrl(topic.topic)}`)}>
                            {topic.topic}
                            <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    )
                ))}
            </div>  
        </div>
    )
}

export default Dropdown;