import { useEffect, useState } from 'react';
import './RegistrationModal.css';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

interface ImportProps {
    open: boolean;
    close: () => void;
}

const RegistrationModal: React.FC = () => {
    const open: boolean = false;

    const { user } = useAuth0();

    return (
        <div className={`registration-modal ${open ? "display-block" : "display-none"}`}>
            <div id="registration-main" className="registration-main">
                <div className="registration-input">
                    Complete Registration
                    <input type="" placeholder='Enter Full Name' onChange={() => console.log('hi')} ></input>
                    <button className='registration-submit' onClick={() => { close(); }}>Register</button>
                </div>
            </div>
        </div>
    );
}

export default RegistrationModal;
