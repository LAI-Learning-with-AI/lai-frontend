import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom';
import './signup.css';

function SignUp() {
    const navigate = useNavigate();

    // drop in Auth0 authentication service
    const { isAuthenticated, user, loginWithRedirect } = useAuth0();

    // if user is already logged in, redirect to /
    if (isAuthenticated && user)
        navigate('/')
    return (
        // signup button which redirects to Auth0 for signup and login
        <div className="signup-container">
            <div className="signup-main">
                <div className="signup-header">Signup</div>
                <div className="signup-middle">
                    <input placeholder="Full Name"></input>
                    <input placeholder="Student ID"></input>
                </div>
                <div className="signup-footer">
                    <button className="signup-button" onClick={() => loginWithRedirect().then(() => {
                        console.log(user);
                    })}>Continue with Auth0</button>
                </div>
            </div>
        </div>
    )
}

export default SignUp;