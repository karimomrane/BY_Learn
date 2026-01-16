import React from 'react';

/**
 * Reusable textarea field component with label and error display
 * @param {Object} props
 * @param {string} props.id - Textarea field ID
 * @param {string} props.label - Label text
 * @param {string} props.value - Textarea value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.error - Error message
 * @param {boolean} props.required - Whether field is required
 * @param {string} props.placeholder - Placeholder text
 * @param {number} props.rows - Number of rows (default: 4)
 * @param {Object} props.textareaProps - Additional textarea props
 * @param {string} props.className - Additional wrapper class names
 */
export default function TextareaField({
    id,
    label,
    value,
    onChange,
    error = '',
    required = false,
    placeholder = '',
    rows = 4,
    textareaProps = {},
    className = ''
}) {
    const textareaClassName = `
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
        resize-vertical
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
            <textarea
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                rows={rows}
                className={textareaClassName}
                {...textareaProps}
            />
            {error && (
                <p className="mt-1 text-sm text-terracotta-600 dark:text-terracotta-400">
                    {error}
                </p>
            )}
        </div>
    );
}
