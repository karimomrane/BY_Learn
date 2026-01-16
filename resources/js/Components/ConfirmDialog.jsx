import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConfirmDialog({
    show = false,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    type = 'danger' // 'danger', 'warning', 'info'
}) {
    const confirmButtonRef = useRef(null);
    const cancelButtonRef = useRef(null);

    // Focus management and keyboard navigation
    useEffect(() => {
        if (show) {
            // Focus the cancel button by default (safer option)
            cancelButtonRef.current?.focus();

            // Trap focus within dialog
            const handleKeyDown = (e) => {
                if (e.key === 'Escape') {
                    onCancel();
                } else if (e.key === 'Tab') {
                    e.preventDefault();
                    if (document.activeElement === cancelButtonRef.current) {
                        confirmButtonRef.current?.focus();
                    } else {
                        cancelButtonRef.current?.focus();
                    }
                }
            };

            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [show, onCancel]);

    if (!show) return null;

    const typeColors = {
        danger: 'bg-terracotta-600 hover:bg-terracotta-700 focus:ring-terracotta-500',
        warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
        info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
    };

    return (
        <AnimatePresence>
            {show && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="confirm-dialog-title"
                    aria-describedby="confirm-dialog-description"
                    onClick={onCancel}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
                    >
                        <h3
                            id="confirm-dialog-title"
                            className="text-lg font-semibold text-gray-900 dark:text-white mb-2"
                        >
                            {title}
                        </h3>
                        <p
                            id="confirm-dialog-description"
                            className="text-gray-600 dark:text-gray-300 mb-6"
                        >
                            {message}
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                ref={cancelButtonRef}
                                onClick={onCancel}
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                                aria-label={cancelText}
                            >
                                {cancelText}
                            </button>
                            <button
                                ref={confirmButtonRef}
                                onClick={() => {
                                    onConfirm();
                                    onCancel();
                                }}
                                className={`px-4 py-2 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${typeColors[type]}`}
                                aria-label={confirmText}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
