// LoadingSpinner.jsx
import { ClipLoader } from 'react-spinners';

function LoadingSpinner() {
    return (
        <div className="flex justify-center items-center h-screen">
            <ClipLoader size={50} color="#4F46E5" />
        </div>
    );
}

export default LoadingSpinner;
