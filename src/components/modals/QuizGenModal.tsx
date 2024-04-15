import { ReactElement, useEffect } from "react";
import './QuizGenModal.css';

interface ModalProps {
    open: boolean;
    close: () => void;
    children: ReactElement;
}

const Modal: React.FC<ModalProps> = ({ open, close, children }) => {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const modal = document.getElementById("modal-main");
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

    return (
        <div className={`modal ${open ? "display-block" : "display-none"}`}>
            <div id="modal-main" className="modal-main">
                {children}
            </div>
        </div>
    );
}

export default Modal;
