import React from 'react';

export default function SelectInput({
    id,
    className = '',
    children,
    ...props
}) {
    return (
        <select
            id={id}
            className={`block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${className}`}
            {...props}
        >
            {children}
        </select>
    );
}
