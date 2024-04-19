import './LoadingModal.css';
import spinner from '../../assets/loading.svg'

interface LoadingProps {
    open: boolean;
}

const Loading: React.FC<LoadingProps> = ({ open }) => {

    return (
        <div className={`loading ${open ? "display-block" : "display-none"}`}>
            <div id="loading-main" className="loading-main">
                <img src={spinner} alt="Loading..." />
            </div>
        </div>
    );
}

export default Loading;
