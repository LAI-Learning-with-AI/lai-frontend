import React from 'react';
import './QuizQuestions.css'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import "react-circular-progressbar/dist/styles.css";
import Textarea from 'react-expanding-textarea';
import Progress from '../../Progress';

interface Props {
    quiz: QuizState | undefined;
    type: 'quiz' | 'graded';
    selections?: (number | null)[];
    updateSelections?: (selections: (number | null)[]) => void;
    text?: string[];
    updateText?: (text: string[]) => void;
}

// define interface for quiz
interface QuizState {
    id: number;
    date: string;
    name: string;
    score: number;
    questions: Question[];
}

// define interface for questions
interface Question {
    id: number;
    answers: string;
    choices: string | null;
    question: string;
    score: number;
    type: "TRUE_FALSE" | "MULTIPLE_CHOICE" | "SHORT_ANSWER" | "CODING";
    user_answer: string;
}

const QuizQuestions: React.FC<Props> = ({ quiz, type, selections, updateSelections = () => {}, text, updateText = () => {}} ) => {
    // function to store multiple choice questions
    const handleChoiceClick = (questionIndex: number, choiceIndex: number) => {
        if (!selections) return [];
        const newSelectedChoices = [...selections];
        newSelectedChoices[questionIndex] = choiceIndex === selections[questionIndex] ? null : choiceIndex;
        updateSelections(newSelectedChoices);
    };

    // function to store short answer questions
    const handleTextAnswerChange = (questionIndex: number, answer: string) => {
        if (!text) return [];
        const newTextAnswers = [...text];
        newTextAnswers[questionIndex] = answer;
        updateText(newTextAnswers);
    };

    return (
        <div className="questions-container">
            {quiz && (
                quiz.questions.map((question, index) => (
                    <div className='expanded-question'>
                        {type === 'graded' && (
                            <Progress
                                type='small'
                                score={question.score}
                            />
                        )}
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
                                {(question.choices !== null) ? (
                                    <div className='multiple-choice'>
                                        {question.choices.split('@').map((choice, choiceIndex) => {
                                            if (type === 'quiz' && selections)
                                                return (
                                                    <div key={choiceIndex} className={`choice ${selections[index] === choiceIndex ? 'selected' : ''}`} onClick={() => handleChoiceClick(index, choiceIndex)}>
                                                        {choice}
                                                    </div>
                                                )
                                            else if (type === 'graded') {
                                                let correct: string = '';
                                                if (choice == question.answers.replace(/^[A-D]\) /, ''))
                                                    correct = 'correct'
                                                else if (choice == question.user_answer)
                                                    correct = 'wrong'
                                            
                                                return (
                                                    <div key={choiceIndex} className={`graded-choice ${correct}`} onClick={() => {}}>
                                                        {choice}
                                                    </div>
                                                )
                                            }
                                        })}
                                    </div>
                                ) : (
                                    <div className='short-answer'>
                                        {type === 'quiz' ? (
                                            <Textarea placeholder='Type answer here...' onChange={(e) => handleTextAnswerChange(index, e.target.value)}/>
                                        ) : (
                                            <div className='graded-short-answer'>
                                                <div className='answer'>{question.user_answer}</div>
                                            </div>
                                        )}                    
                                     </div>
                                )}
                            </div>
                            {(type === 'graded' && question.type == 'SHORT_ANSWER' || question.type == 'CODING') &&
                                <div className='question-answer'>
                                    <div className='question-label'>Explanation</div>
                                    <div className='graded-short-answer'>
                                        <div className='explanation'>{question.answers}</div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

export default QuizQuestions;