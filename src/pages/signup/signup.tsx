import { useAuth0 } from "@auth0/auth0-react";
import './signup.css';

function SignUp() {
    // drop in Auth0 authentication service
    const { loginWithRedirect } = useAuth0();

    return (
        // signup button which redirects to Auth0 for signup and login
        <button className="signup-button" onClick={() => loginWithRedirect()}>Sign Up</button>
    )
}

export default SignUp;