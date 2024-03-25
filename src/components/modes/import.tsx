import { useEffect, useState } from 'react';
import './import.css';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

interface ImportProps {
    open: boolean;
    close: () => void;
}

const Import: React.FC<ImportProps> = ({ open, close }) => {
    // vars
    const { user } = useAuth0();
    const [quizId, setQuizId] = useState<number | null>(null);
    const navigate = useNavigate();

    // handle update of input box
    const handleUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuizId(parseInt(event.target.value));
    };

    // close if u click outside the modal
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const modal = document.getElementById("import-main");
            if (modal && !modal.contains(event.target as Node)) {
                close();
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open, close]);

    // import quiz
    const importQuiz = () => {
        // request
        fetch(`${import.meta.env.VITE_SERVER}/importQuiz`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "userId": user?.sub,
                "quizId": quizId
            })
        })
        .then(response => response.json())
        .then((res) => {
            // move into quiz
            navigate(`/quiz/${res.quiz_id}`)
        })
        .catch(error => {
            console.error(error);
        });
    }

    return (
        <div className={`import-modal ${open ? "display-block" : "display-none"}`}>
            <div id="import-main" className="import-main">
                <div className="import-input">
                    Import Quiz
                    <input type="number" placeholder='Enter Quiz ID' onChange={handleUpdate} ></input>
                    <button className='import-submit' onClick={() => { close(); importQuiz(); }}>Start Quiz</button>
                </div>
            </div>
        </div>
    );
}

export default Import;
