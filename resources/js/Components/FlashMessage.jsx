import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

export default function FlashMessage({ type = 'success', message, duration = 5000, onClose }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                if (onClose) onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        if (onClose) onClose();
    };

    if (!message || !isVisible) return null;

    const typeConfig = {
        success: {
            bg: 'bg-green-50 dark:bg-green-900/20',
            border: 'border-green-500',
            text: 'text-green-800 dark:text-green-200',
            icon: <FaCheckCircle className="text-green-500" />,
        },
        error: {
            bg: 'bg-terracotta-50 dark:bg-terracotta-900/20',
            border: 'border-terracotta-500',
            text: 'text-terracotta-800 dark:text-terracotta-200',
            icon: <FaExclamationCircle className="text-terracotta-500" />,
        },
        info: {
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            border: 'border-blue-500',
            text: 'text-blue-800 dark:text-blue-200',
            icon: <FaInfoCircle className="text-blue-500" />,
        },
        warning: {
            bg: 'bg-yellow-50 dark:bg-yellow-900/20',
            border: 'border-yellow-500',
            text: 'text-yellow-800 dark:text-yellow-200',
            icon: <FaExclamationCircle className="text-yellow-500" />,
        },
    };

    const config = typeConfig[type] || typeConfig.info;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
                className="fixed top-4 right-4 z-50 max-w-md"
                role="alert"
                aria-live="polite"
            >
                <div
                    className={`${config.bg} ${config.border} border-l-4 p-4 rounded-lg shadow-lg flex items-start gap-3`}
                >
                    <div className="flex-shrink-0 mt-0.5">{config.icon}</div>
                    <div className={`flex-1 ${config.text}`}>
                        <p className="font-medium">{message}</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className={`flex-shrink-0 ${config.text} hover:opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 rounded`}
                        aria-label="Close notification"
                    >
                        <FaTimes />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
