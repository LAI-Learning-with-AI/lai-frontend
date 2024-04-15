import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom';
import './signup.css';

function Login() {
    const navigate = useNavigate();

    // drop in Auth0 authentication service
    const { isAuthenticated, user, loginWithPopup } = useAuth0();

    // when user is logged in, redirect to /
    if (isAuthenticated && user)
        navigate('/')
    return (
        // signup button which redirects to Auth0 for signup and login
        <div className="signup-container">
            <div className='signup-image'></div>
            <div className="signup-main">
                <div className="signup-header">
                    <div className="redirect-container">
                        <button className="signup-redirect disabled" onClick={() => navigate('/signup')}>Signup</button>
                        <button className="signup-redirect enabled">Login</button>
                    </div>
                </div>
                <div className="signup-middle">
                    <button className="signup-button" onClick={() => loginWithPopup()}>Continue with Auth0</button>
                </div>
                <div className="signup-footer">
                </div>
            </div>
        </div>
    )
}

export default Login;