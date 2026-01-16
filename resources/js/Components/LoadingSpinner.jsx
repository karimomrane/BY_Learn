// LoadingSpinner.jsx
import { ClipLoader } from 'react-spinners';

function LoadingSpinner() {
    return (
        <div className="flex justify-center items-center h-screen">
            <ClipLoader size={50} color="#C68A6A" />
        </div>
    );
}

export default LoadingSpinner;
