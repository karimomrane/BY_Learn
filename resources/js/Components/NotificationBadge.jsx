import { motion } from 'framer-motion';
import { HiBell } from 'react-icons/hi2';

export default function NotificationBadge({ count = 0, onClick }) {
    return (
        <button
            onClick={onClick}
            className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
            <HiBell className="h-6 w-6" />
            {count > 0 && (
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-terracotta-500 text-xs font-bold text-white"
                >
                    {count > 9 ? '9+' : count}
                </motion.span>
            )}
        </button>
    );
}
