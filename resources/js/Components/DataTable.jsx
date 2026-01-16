import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable DataTable component with consistent styling
 * @param {Object} props
 * @param {Array} props.columns - Array of column definitions [{key: string, label: string, render?: function}]
 * @param {Array} props.data - Array of data objects
 * @param {Function} props.renderActions - Optional function to render action buttons for each row
 * @param {string} props.emptyMessage - Message to display when no data
 */
export default function DataTable({
    columns,
    data,
    renderActions,
    emptyMessage = 'No data available',
    className = ''
}) {
    if (!data || data.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={column.key || index}
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                            >
                                {column.label}
                            </th>
                        ))}
                        {renderActions && (
                            <th
                                scope="col"
                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                            >
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {data.map((row, rowIndex) => (
                        <motion.tr
                            key={row.id || rowIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: rowIndex * 0.05 }}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            {columns.map((column, colIndex) => (
                                <td
                                    key={`${row.id || rowIndex}-${column.key || colIndex}`}
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                                >
                                    {column.render
                                        ? column.render(row[column.key], row, rowIndex)
                                        : row[column.key]
                                    }
                                </td>
                            ))}
                            {renderActions && (
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {renderActions(row, rowIndex)}
                                </td>
                            )}
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
