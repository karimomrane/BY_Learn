import React from 'react';

export default function Table({ children, className = '' }) {
    return (
        <div className="overflow-x-auto">
            <table className={`min-w-full divide-y divide-gray-200 dark:divide-gray-700 ${className}`}>
                {children}
            </table>
        </div>
    );
}

Table.Header = function TableHeader({ children, className = '' }) {
    return (
        <thead className={`bg-gray-50 dark:bg-gray-800 ${className}`}>
            {children}
        </thead>
    );
};

Table.Body = function TableBody({ children, className = '' }) {
    return (
        <tbody className={`bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700 ${className}`}>
            {children}
        </tbody>
    );
};

Table.Row = function TableRow({ children, className = '', onClick, hover = true }) {
    const hoverClass = hover ? 'hover:bg-gray-50 dark:hover:bg-gray-800' : '';
    const clickableClass = onClick ? 'cursor-pointer' : '';

    return (
        <tr
            className={`transition-colors duration-150 ${hoverClass} ${clickableClass} ${className}`}
            onClick={onClick}
        >
            {children}
        </tr>
    );
};

Table.HeaderCell = function TableHeaderCell({
    children,
    className = '',
    align = 'left',
    sortable = false,
    onSort
}) {
    const alignClass = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
    }[align];

    const sortableClass = sortable ? 'cursor-pointer select-none hover:text-gray-900 dark:hover:text-gray-100' : '';

    return (
        <th
            scope="col"
            className={`px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider ${alignClass} ${sortableClass} ${className}`}
            onClick={sortable ? onSort : undefined}
        >
            {children}
        </th>
    );
};

Table.Cell = function TableCell({
    children,
    className = '',
    align = 'left',
    colSpan,
    truncate = false
}) {
    const alignClass = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
    }[align];

    const truncateClass = truncate ? 'truncate max-w-xs' : '';

    return (
        <td
            colSpan={colSpan}
            className={`px-6 py-4 text-sm text-gray-900 dark:text-gray-100 ${alignClass} ${truncateClass} ${className}`}
        >
            {children}
        </td>
    );
};

Table.EmptyRow = function TableEmptyRow({ colSpan, message = 'Aucune donnée disponible' }) {
    return (
        <Table.Row hover={false}>
            <Table.Cell colSpan={colSpan} align="center" className="py-12">
                <div className="text-gray-500 dark:text-gray-400">
                    {message}
                </div>
            </Table.Cell>
        </Table.Row>
    );
};
