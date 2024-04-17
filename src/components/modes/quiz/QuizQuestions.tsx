import React from 'react';
import './QuizQuestions.css'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import "react-circular-progressbar/dist/styles.css";
import Textarea from 'react-expanding-textarea';

interface Props {
    quiz: QuizState | undefined;
    selections: (number | null)[];
    updateSelections: (selections: (number | null)[]) => void;
    text: string[];
    updateText: (text: string[]) => void;
}

// define interface for quiz
interface QuizState {
    id: number;
    date: string;
    name: string;
    questions: Question[];
}

// define interface for questions
interface Question {
    id: number;
    answers: string;
    choices: string | null;
    question: string;
    type: "TRUE_FALSE" | "MULTIPLE_CHOICE" | "SHORT_ANSWER" | "CODING";
    user_answer: string;
}

const QuizQuestions: React.FC<Props> = ({ quiz, selections, updateSelections, text, updateText } ) => {
    // function to store multiple choice questions
    const handleChoiceClick = (questionIndex: number, choiceIndex: number) => {
        const newSelectedChoices = [...selections];
        newSelectedChoices[questionIndex] = choiceIndex === selections[questionIndex] ? null : choiceIndex;
        updateSelections(newSelectedChoices);
    };

    // function to store short answer questions
    const handleTextAnswerChange = (questionIndex: number, answer: string) => {
        const newTextAnswers = [...text];
        newTextAnswers[questionIndex] = answer;
        updateText(newTextAnswers);
    };

    return (
        <div className="questions-container">
            {quiz && (
                quiz.questions.map((question, index) => (
                    <div className='question-container'>
                        <div className='info'>
                            <div>{question.type.toLowerCase()}</div>
                            <div>{index+1} of {quiz?.questions.length}</div>
                        </div>
                        <div className='question-text'>
                            {question.question}
                        </div>
                        <div className='question-answer'>
                            <div className='question-label'>Your answer</div>
                            {question.choices !== null ? (
                                <div className='multiple-choice'>
                                    {question.choices.split('@').map((choice, choiceIndex) => (
                                        <div key={choiceIndex} className={`choice ${selections[index] === choiceIndex ? 'selected' : ''}`} onClick={() => handleChoiceClick(index, choiceIndex)}>
                                            {choice}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className='short-answer'>
                                    <Textarea placeholder='Type answer here...' onChange={(e) => handleTextAnswerChange(index, e.target.value)}></Textarea>
                                </div>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

export default QuizQuestions;