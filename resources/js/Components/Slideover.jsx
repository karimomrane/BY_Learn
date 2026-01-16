import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { HiXMark } from 'react-icons/hi2';
import { motion } from 'framer-motion';

export default function Slideover({
    show = false,
    onClose,
    children,
    title,
    size = 'md', // sm, md, lg, xl, full
    position = 'right' // left, right
}) {
    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
        full: 'max-w-full'
    };

    const positionClasses = {
        left: 'left-0',
        right: 'right-0'
    };

    const slideDirection = position === 'left' ? '-100%' : '100%';

    return (
        <Transition show={show} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                {/* Backdrop */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className={`pointer-events-none fixed inset-y-0 ${positionClasses[position]} flex max-w-full`}>
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-300"
                                enterFrom={`translate-x-${position === 'left' ? '-' : ''}full`}
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-300"
                                leaveFrom="translate-x-0"
                                leaveTo={`translate-x-${position === 'left' ? '-' : ''}full`}
                            >
                                <Dialog.Panel className={`pointer-events-auto w-screen ${sizeClasses[size]}`}>
                                    <div className="flex h-full flex-col overflow-y-auto bg-white dark:bg-gray-800 shadow-2xl">
                                        {/* Header */}
                                        <div className="bg-gradient-to-r from-terracotta-500 to-mocha-600 px-4 py-6 sm:px-6">
                                            <div className="flex items-start justify-between">
                                                <Dialog.Title className="text-xl font-bold text-white">
                                                    {title}
                                                </Dialog.Title>
                                                <div className="ml-3 flex h-7 items-center">
                                                    <button
                                                        type="button"
                                                        className="rounded-lg bg-white/10 p-2 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white transition-colors"
                                                        onClick={onClose}
                                                    >
                                                        <span className="sr-only">Fermer</span>
                                                        <HiXMark className="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="relative flex-1 px-4 py-6 sm:px-6">
                                            {children}
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

// Sub-components for better organization
Slideover.Body = function SlideoverBody({ children, className = '' }) {
    return (
        <div className={`space-y-6 ${className}`}>
            {children}
        </div>
    );
};

Slideover.Footer = function SlideoverFooter({ children, className = '' }) {
    return (
        <div className={`sticky bottom-0 flex flex-shrink-0 justify-end gap-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-4 sm:px-6 ${className}`}>
            {children}
        </div>
    );
};
