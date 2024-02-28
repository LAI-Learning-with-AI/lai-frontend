import { ReactNode } from "react";
import './response.css'

interface ResponseProps {
    children: ReactNode;
}

const Response: React.FC<ResponseProps> = ( { children }) => {
    return (
        <div className='response-text'>{children}</div>
    )
}

export default Response;