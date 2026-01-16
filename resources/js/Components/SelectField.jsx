import React from 'react';

/**
 * Reusable select/dropdown field component
 * @param {Object} props
 * @param {string} props.id - Select field ID
 * @param {string} props.label - Label text
 * @param {string} props.value - Selected value
 * @param {Function} props.onChange - Change handler
 * @param {Array} props.options - Array of options [{value, label}]
 * @param {string} props.error - Error message
 * @param {boolean} props.required - Whether field is required
 * @param {string} props.placeholder - Placeholder text for empty option
 * @param {Object} props.selectProps - Additional select props
 * @param {string} props.className - Additional wrapper class names
 */
export default function SelectField({
    id,
    label,
    value,
    onChange,
    options = [],
    error = '',
    required = false,
    placeholder = 'Select an option',
    selectProps = {},
    className = ''
}) {
    const selectClassName = `
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
            <select
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                required={required}
                className={selectClassName}
                {...selectProps}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option, index) => (
                    <option
                        key={option.value ?? index}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-1 text-sm text-terracotta-600 dark:text-terracotta-400">
                    {error}
                </p>
            )}
        </div>
    );
}
