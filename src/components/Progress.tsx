import React from 'react';
import './Progress.css'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import "react-circular-progressbar/dist/styles.css";

interface Props {
    type: 'small' | 'big';
    score: number;
}

const Progress: React.FC<Props> = ({ type, score } ) => {
    let fontcolor = "#A6FF86"
    console.log(score)
    if(score < 0.50) {
        fontcolor = "#FF4E2E"
    }

    return (
        <div className='progress-icon'>
            <CircularProgressbar
                value={score*100}
                text={`${score*100}`}
                styles={buildStyles({
                    textColor: fontcolor,
                    pathColor: "#A6FF86",
                    trailColor: "#FF4E2E",
                    textSize: "30px"
                })}
            />
        </div>
    )
}

export default Progress;