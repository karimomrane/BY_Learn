import React from 'react';
import { Link } from '@inertiajs/react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

export default function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    const getLabel = (label) => {
        if (label.includes('Previous') || label.includes('&laquo;')) {
            return <HiChevronLeft className="h-4 w-4" />;
        }
        if (label.includes('Next') || label.includes('&raquo;')) {
            return <HiChevronRight className="h-4 w-4" />;
        }
        return <span dangerouslySetInnerHTML={{ __html: label }} />;
    };

    return (
        <div className="flex items-center justify-center">
            <nav className="flex items-center gap-1" aria-label="Pagination">
                {links.map((link, index) => {
                    const isFirst = index === 0;
                    const isLast = index === links.length - 1;
                    const isPrevNext = isFirst || isLast;

                    return (
                        <Link
                            key={index}
                            href={link.url || '#'}
                            preserveState
                            className={`
                                inline-flex items-center justify-center text-sm font-medium transition-all duration-200
                                ${isPrevNext ? 'px-3 py-2' : 'w-9 h-9'}
                                ${link.active
                                    ? 'bg-gradient-to-r from-terracotta-500 to-mocha-600 text-white rounded-lg shadow-md'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg'
                                }
                                ${!link.url ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}
                            `}
                        >
                            {getLabel(link.label)}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
