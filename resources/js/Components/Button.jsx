import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';

/**
 * Reusable button component with consistent styling and variants
 * @param {Object} props
 * @param {string} props.variant - Button style: 'primary', 'secondary', 'danger', 'success' (default: 'primary')
 * @param {string} props.size - Button size: 'sm', 'md', 'lg' (default: 'md')
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {boolean} props.loading - Whether button is in loading state
 * @param {string} props.type - Button type: 'button', 'submit', 'reset' (default: 'button')
 * @param {Function} props.onClick - Click handler
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.className - Additional class names
 * @param {string} props.href - If provided, renders as Link component
 * @param {boolean} props.fullWidth - Whether button should take full width
 */
export default function Button({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    type = 'button',
    onClick,
    children,
    className = '',
    href,
    fullWidth = false
}) {
    const baseClasses = `
        inline-flex items-center justify-center
        font-medium rounded-lg
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${fullWidth ? 'w-full' : ''}
    `;

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base'
    };

    const variantClasses = {
        primary: `
            bg-gradient-to-r from-terracotta-500 to-mocha-600
            hover:from-terracotta-600 hover:to-mocha-700
            text-white shadow-md hover:shadow-lg
            focus:ring-terracotta-500
        `,
        secondary: `
            bg-gray-100 hover:bg-gray-200
            text-gray-700 border border-gray-300
            focus:ring-gray-400
            dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 dark:border-gray-600
        `,
        danger: `
            bg-terracotta-600 hover:bg-terracotta-700
            text-white shadow-md hover:shadow-lg
            focus:ring-terracotta-600
        `,
        success: `
            bg-green-600 hover:bg-green-700
            text-white shadow-md hover:shadow-lg
            focus:ring-green-500
        `,
        ghost: `
            bg-transparent hover:bg-gray-100
            text-gray-700
            focus:ring-gray-400
            dark:text-gray-300 dark:hover:bg-gray-700
        `,
        outline: `
            bg-transparent border-2 border-terracotta-600
            text-terracotta-600 hover:bg-beige-200
            focus:ring-terracotta-500
            dark:border-terracotta-400 dark:text-terracotta-400 dark:hover:bg-terracotta-900/20
        `
    };

    const buttonClassName = `
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
    `.trim().replace(/\s+/g, ' ');

    const content = (
        <>
            {loading && (
                <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}
            {children}
        </>
    );

    if (href) {
        return (
            <Link href={href} className={buttonClassName}>
                {content}
            </Link>
        );
    }

    return (
        <motion.button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={buttonClassName}
            whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
            whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        >
            {content}
        </motion.button>
    );
}
