import { withAuthenticationRequired } from "@auth0/auth0-react";

function LearnMode() {
    return (
        <div>
            hi
        </div>
    )
}

export default withAuthenticationRequired(LearnMode)