import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom';
import './signup.css';
import { useState } from "react";

function SignUp() {
    const navigate = useNavigate();
    const [first, setFirst] = useState<string>('');
    const [last, setLast] = useState<string>('');
    const [studentId, setStudentId] = useState<string>('');


    // drop in Auth0 authentication service
    const { isAuthenticated, user, loginWithPopup } = useAuth0();

    // when user logs in create user in db
    if (isAuthenticated && user) {
        fetch(`${import.meta.env.VITE_SERVER}/createUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "userId": user?.sub,
                "email": user?.email,
                "name": first + ' ' + last
            })
        })
        .then(() => navigate('/'))
        .catch(error => {
            console.error(error);
        });
    }

    return (
        // signup button which redirects to Auth0 for signup and login
        <div className="signup-container">
            <div className='signup-image'></div>
            <div className="signup-main">
                <div className="signup-header">
                    <div className="redirect-container">
                        <button className="signup-redirect enabled">Signup</button>
                        <button className="signup-redirect disabled" onClick={() => navigate('/login')}>Login</button>
                    </div>
                </div>
                <div className="signup-middle">
                    <div className="two-column">
                        <input placeholder="First Name" onChange={(e) => setFirst(e.target.value)} />
                        <input placeholder="Last Name" onChange={(e) => setLast(e.target.value)} />
                    </div>
                    <input className='student-input' placeholder="Student ID" onChange={(e) => setStudentId(e.target.value)}></input>
                </div>
                <div className="signup-footer">
                    <button className="signup-button" onClick={() => loginWithPopup()}>Continue with Auth0</button>
                </div>
            </div>
        </div>
    )
}

export default SignUp;