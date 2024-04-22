import { useEffect, useState } from 'react';
import './RegistrationModal.css';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

interface ImportProps {
    open: boolean;
    close: () => void;
}

const RegistrationModal: React.FC = () => {
    // state to manage open/close of the modal
    const [open, setOpen] = useState<boolean>(false);
    const { user } = useAuth0();

    // state to manage name input
    const [name, setName] = useState<string>('');

    // fxn to create a new user on backend
    const create = () => {
        fetch(`${import.meta.env.VITE_SERVER}/createUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "userId": user?.sub,
                "email": user?.email,
                "name": name
            })
        })
        .then(() => setOpen(false))
        .catch(error => {
            console.error(error);
        });
    }

    // when user is rendered, check if the user exists in the database. if it doesnt then prompt user to finish registration (render this modal)
    useEffect(() => {
        // request
        fetch(`${import.meta.env.VITE_SERVER}/checkUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "userId": user?.sub
            })
        })
        .then(response => response.json())
        .then((res) => {
            // remove loading screen
            console.log(res.exists)
            setOpen(!res.exists)
        })
        .catch(error => {
            // remove loading screen
            console.error(error);
        });
    }, [user])

    return (
        <div className={`registration-modal ${open ? "display-block" : "display-none"}`}>
            <div id="registration-main" className="registration-main">
                <div className="registration-input">
                    Complete Registration
                    <input placeholder="Enter Full Name" onChange={(e) => setName(e.target.value)} />
                    <button className='registration-submit' onClick={() => create()}>Register</button>
                </div>
            </div>
        </div>
    );
}

export default RegistrationModal;
