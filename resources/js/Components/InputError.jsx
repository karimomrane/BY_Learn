import { motion, AnimatePresence } from 'framer-motion';
import { HiExclamationCircle } from 'react-icons/hi2';

export default function InputError({ message, className = '', ...props }) {
    return (
        <AnimatePresence>
            {message && (
                <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    {...props}
                    className={'flex items-center gap-1.5 text-sm text-terracotta-600 dark:text-terracotta-400 mt-1.5 ' + className}
                >
                    <HiExclamationCircle className="h-4 w-4 flex-shrink-0" />
                    {message}
                </motion.p>
            )}
        </AnimatePresence>
    );
}
