import React from 'react';

/**
 * Reusable form field component with label, input, and error display
 * @param {Object} props
 * @param {string} props.id - Input field ID
 * @param {string} props.label - Label text
 * @param {string} props.type - Input type (text, email, password, etc.)
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.error - Error message
 * @param {boolean} props.required - Whether field is required
 * @param {string} props.placeholder - Placeholder text
 * @param {Object} props.inputProps - Additional input props
 * @param {string} props.className - Additional wrapper class names
 */
export default function FormField({
    id,
    label,
    type = 'text',
    value,
    onChange,
    error = '',
    required = false,
    placeholder = '',
    inputProps = {},
    className = ''
}) {
    const inputClassName = `
        mt-1 block w-full px-3 py-2
        border ${error ? 'border-terracotta-500' : 'border-gray-300 dark:border-gray-600'}
        rounded-md shadow-sm
        focus:outline-none focus:ring-2
        ${error
            ? 'focus:ring-terracotta-500 focus:border-terracotta-500'
            : 'focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400'
        }
        bg-white dark:bg-gray-800
        text-gray-900 dark:text-gray-100
        placeholder-gray-400 dark:placeholder-gray-500
        disabled:bg-gray-100 dark:disabled:bg-gray-700
        disabled:cursor-not-allowed
        transition-colors
    `.trim().replace(/\s+/g, ' ');

    return (
        <div className={className}>
            <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
                {label}
                {required && <span className="text-terracotta-500 ml-1">*</span>}
            </label>
            <input
                id={id}
                name={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className={inputClassName}
                {...inputProps}
            />
            {error && (
                <p className="mt-1 text-sm text-terracotta-600 dark:text-terracotta-400">
                    {error}
                </p>
            )}
        </div>
    );
}
