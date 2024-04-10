import { withAuthenticationRequired, useAuth0 } from "@auth0/auth0-react";
import './learn-mode.css'
import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCircleChevronDown, faCircleChevronUp, faGear, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

//define interface for topics
interface TopicState {
    frequency: number;
    mastery: 'struggling' | 'learning' | 'mastered';
    score: number;
    topic: string;
}

interface DropdownState {
    mastered: boolean;
    struggling: boolean;
    learning: boolean;
}

interface ChartData {
    [topic: string]: {
        dates: string[];
        average_scores: number[];
    };
}

function LearnMode() {
    // vars
    const navigate = useNavigate();
    const { user, logout } = useAuth0();
    const [topics, setTopics] = useState<TopicState[]>([]);
    const [dropdown, setDropdown] = useState<DropdownState>({
        mastered: false,
        struggling: false,
        learning: false
    });
    const [chartData, setChartData] = useState<ChartData>({});

    // toggle dropdowns when you click to expand
    const toggleDropdown = (dropdownName: keyof DropdownState) => {
        setDropdown(prevState => ({
            ...prevState,
            [dropdownName]: !prevState[dropdownName]
        }));
    };

    // when user object mounts, fetch user topics summary from backend
    useEffect(() => {
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
            console.error(error);
        });
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
            console.error(error);
        });
    }, [user]);

    const data = [
        ["Mastery", "Number of Topics"],
        ["Mastered", 11],
        ["Struggling", 2],
        ["Learning", 2]
    ];
      
    // options for the piechart
    const pieOptions = {
        backgroundColor: "transparent",
        pieHole: 0.4,
        is3D: false,
        legend: {
            alignment: 'center',
            textStyle: {
                color: '#ffffff',
                fontName: 'Montserrat',
                fontSize: 24
            }
        },
        pieSliceTextStyle: {
            color: '#333333',
            fontName: 'Montserrat',
            bold: true
        },
        pieSliceBorderColor: '#1E1E1E',
        colors: ['#A6FF86', '#FF4E2E', '#FFFF4E']
    };

    const lineOptions = {
        lineWidth: 5,
        interpolateNulls: true,
        hAxis: { 
            title: 'Date',
            textStyle: {
                color: '#ffffff',
                fontName: 'Montserrat',
                fontSize: 12
            },
            titleTextStyle: {
                color: '#ffffff',
                fontName: 'Montserrat',
                fontSize: 16
            }
        },
        vAxis: { 
            title: 'Average Score',
            textStyle: {
                color: '#ffffff',
                fontName: 'Montserrat',
                fontSize: 12
            },
            titleTextStyle: {
                color: '#ffffff',
                fontName: 'Montserrat',
                fontSize: 16
            }
        },
        backgroundColor: "transparent",
        legend: {
            position: 'bottom',
            alignment: 'center',
            textStyle: {
                color: '#ffffff',
                fontName: 'Montserrat',
                fontSize: 16
            }
        }
    }

    const formatChartData = () => {
        const datesSet = new Set<string>();
        const dataValues: { [date: string]: number[] } = {};
      
        Object.keys(chartData).forEach((key) => {
          chartData[key].dates.forEach((date, index) => {
            datesSet.add(date);
            if (!dataValues[date]) {
              dataValues[date] = new Array(Object.keys(chartData).length).fill(null);
            }
            dataValues[date][Object.keys(chartData).indexOf(key)] = chartData[key].average_scores[index];
          });
        });
      
        const dates = Array.from(datesSet).sort();
        const result = dates.map((date) => {
          const rowData = [date, ...dataValues[date]];
          return rowData;
        });
      
        const header = ['Date', ...Object.keys(chartData)];
        console.log([header, ...result])
        return [header, ...result];
      };

    // convert topic to url
    const convertTopicToUrl = (topic: string): string => {
        return topic.trim().replace(/\s+/g, "_").toLowerCase();
    }

    return (
        <div className='learn-mode'>
            <div className="learn-header">
                    Learn
                    <div className="learn-header-buttons">
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
            <div className='chart-container pie'>
                <Chart
                    chartType="PieChart"
                    width="100%"
                    height="400px"
                    data={data}
                    options={pieOptions}
                />
            </div>
            <div className='chart-container line'>
                <Chart
                    width='100%'
                    height='400px'
                    chartType="LineChart"
                    data={formatChartData()}
                    options={lineOptions}
                />
            </div>
            <div className='dropdown-container'>
                <button className='dropdown' onClick={() => toggleDropdown('mastered')}>
                    Mastered
                    <FontAwesomeIcon icon={!dropdown.mastered ? faCircleChevronUp: faCircleChevronDown} />
                </button>
                <div className={`dropdown-content ${!dropdown.mastered ? 'open' : 'closed'}`}>
                    {topics.map((topic, index) => (
                        topic.mastery === 'mastered' && (
                            <button key={index} onClick={() => navigate(`/learn/${convertTopicToUrl(topic.topic)}`)}>
                                {topic.topic}
                                <FontAwesomeIcon icon={faArrowRight} />
                            </button>
                        )
                    ))}
                </div>  
            </div>
            {/* refactor this into a component later*/}
            <div className='dropdown-container'>
                <button className='dropdown' onClick={() => toggleDropdown('struggling')}>
                    Struggling
                    <FontAwesomeIcon icon={!dropdown.struggling ? faCircleChevronUp: faCircleChevronDown} />
                </button>
                <div className={`dropdown-content ${!dropdown.struggling ? 'open' : 'closed'}`}>
                    {topics.map((topic, index) => (
                        topic.mastery === 'struggling' && (
                            <button key={index} onClick={() => navigate(`/learn/${convertTopicToUrl(topic.topic)}`)}>
                                {topic.topic}
                                <FontAwesomeIcon icon={faArrowRight} />
                            </button>
                        )
                    ))}
                </div>  
            </div>
            <div className='dropdown-container last'>
                <button className='dropdown' onClick={() => toggleDropdown('learning')}>
                    Learning
                    <FontAwesomeIcon icon={!dropdown.learning ? faCircleChevronUp: faCircleChevronDown} />
                </button>
                <div className={`dropdown-content ${!dropdown.learning ? 'open' : 'closed'}`}>
                    {topics.map((topic, index) => (
                        topic.mastery === 'learning' && (
                            <button key={index} onClick={() => navigate(`/learn/${convertTopicToUrl(topic.topic)}`)}>
                                {topic.topic}
                                <FontAwesomeIcon icon={faArrowRight} />
                            </button>
                        )
                    ))}
                </div>  
            </div>
        </div>
    )
}

export default withAuthenticationRequired(LearnMode)