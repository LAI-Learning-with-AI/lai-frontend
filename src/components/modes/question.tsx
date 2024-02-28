import { ReactNode } from "react";
import './question.css'

interface QuestionProps {
    children: ReactNode;
}

const Question: React.FC<QuestionProps> = ( { children }) => {
    return (
        <div className='question-text'>{children}</div>
    )
}

export default Question;