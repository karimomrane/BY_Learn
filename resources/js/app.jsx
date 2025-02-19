import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { useState, useEffect } from 'react';
import LoadingSpinner from './Components/LoadingSpinner';

const appName = import.meta.env.VITE_APP_NAME || 'BY_learn';

// 🌗 Get theme from localStorage and set progress bar color
const getProgressBarColor = () => {
    const theme = localStorage.getItem('theme'); // 'dark' or 'light'
    return theme === 'dark' ? '#D1D5DB' : '#FFFFFF'; // Light gray for dark mode, gray-600 for light mode
};

function AppWrapper({ App, props }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000); // Simulated loading time
        return () => clearTimeout(timer);
    }, []);

    if (loading) return <LoadingSpinner />;
    return <App {...props} />;
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx')
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<AppWrapper App={App} props={props} />);
    },
    progress: {
        color: getProgressBarColor(), // 🎨 Dynamic color from localStorage
        showSpinner: true,
        delay: 200,
    },
});
