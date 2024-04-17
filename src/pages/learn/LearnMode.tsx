import { withAuthenticationRequired, useAuth0 } from "@auth0/auth0-react";
import './LearnMode.css'
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PageHeader from "../../components/PageHeader";
import Dropdown from "../../components/modes/learn/Dropdown";
import SummaryChart from "../../components/modes/learn/Chart";

//define interface for topics
interface TopicState {
    frequency: number;
    mastery: 'struggling' | 'learning' | 'mastered';
    score: number;
    topic: string;
}

interface ChartData {
    [topic: string]: {
        dates: string[];
        average_scores: number[];
    };
}

function LearnMode() {
    // vars
    const { user, logout } = useAuth0();
    const [topics, setTopics] = useState<TopicState[]>([]);
    const [chartData, setChartData] = useState<ChartData>({});

    // fetch topics
    const fetchTopics = () => {
        fetch(`${import.meta.env.VITE_SERVER}/groupQuizResults`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "userId": user?.sub
            })
        })
        .then(response => response.json())
        .then((res: TopicState[]) => {
            setTopics(res);
            console.log(res);
        })
        .catch(error => {
            toast.error('Failed to retrieve quiz summary');
            console.error(error);
        });
    }

    // fetch time analysis
    const fetchTimeAnalysis = () => {
        fetch(`${import.meta.env.VITE_SERVER}/time_analysis`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "userId": user?.sub
            })
        })
        .then(response => response.json())
        .then((res: ChartData) => {
            setChartData(res);
            console.log(res);
        })
        .catch(error => {
            toast.error('Failed to retrieve time analysis');
            console.error(error);
        });
    }

    // when user object mounts, fetch user topics summary from backend
    useEffect(() => {
        fetchTopics();
        fetchTimeAnalysis();
    }, [user]);

    return (
        <div className='learn-mode'>
            <PageHeader
                name='Learn'
                quizgen={false}
                logout={() => logout({ logoutParams: { returnTo: import.meta.env.VITE_LOGOUT } })}
            />
            <SummaryChart
                type='pie'
                data={topics}
            />
            <SummaryChart
                type='line'
                data={chartData}
            />
            {['Mastered', 'Struggling', 'Learning'].map(category => (
                <Dropdown 
                    category={category}
                    topics={topics}
                />
            ))}
        </div>
    )
}

export default withAuthenticationRequired(LearnMode)