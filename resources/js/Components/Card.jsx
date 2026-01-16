import React from 'react';
import { motion } from 'framer-motion';

export default function Card({
    children,
    className = '',
    hover = true,
    onClick,
    as: Component = 'div',
    gradient = false
}) {
    const baseClasses = "bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 border border-gray-100 dark:border-gray-700";
    const hoverClasses = hover ? "hover:shadow-xl hover:border-gray-200 dark:hover:border-gray-600" : "";
    const clickableClasses = onClick ? "cursor-pointer" : "";
    const gradientClasses = gradient ? "ring-1 ring-terracotta-500/20" : "";

    const content = (
        <Component
            className={`${baseClasses} ${hoverClasses} ${clickableClasses} ${gradientClasses} ${className}`}
            onClick={onClick}
        >
            {gradient && (
                <div className="h-1 bg-gradient-to-r from-terracotta-500 to-mocha-600" />
            )}
            {children}
        </Component>
    );

    if (hover && !onClick) {
        return (
            <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
            >
                {content}
            </motion.div>
        );
    }

    return content;
}

Card.Header = function CardHeader({ children, className = '', gradient = false }) {
    return (
        <div className={`p-5 border-b border-gray-100 dark:border-gray-700 ${gradient ? 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750' : ''} ${className}`}>
            {children}
        </div>
    );
};

Card.Body = function CardBody({ children, className = '' }) {
    return (
        <div className={`p-5 ${className}`}>
            {children}
        </div>
    );
};

Card.Footer = function CardFooter({ children, className = '' }) {
    return (
        <div className={`p-5 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 ${className}`}>
            {children}
        </div>
    );
};
