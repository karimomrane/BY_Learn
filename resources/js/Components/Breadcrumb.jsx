import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { HiChevronRight, HiHome } from 'react-icons/hi2';

export default function Breadcrumb({ items = [] }) {
    if (!items || items.length === 0) return null;

    return (
        <nav className="flex items-center space-x-2 text-sm mb-4" aria-label="Breadcrumb">
            <Link
                href={route('home')}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
            >
                <HiHome className="h-5 w-5" />
            </Link>

            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-2"
                    >
                        <HiChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-600" />
                        {isLast ? (
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                {item.label}
                            </span>
                        ) : (
                            <Link
                                href={item.href}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                            >
                                {item.label}
                            </Link>
                        )}
                    </motion.div>
                );
            })}
        </nav>
    );
}
