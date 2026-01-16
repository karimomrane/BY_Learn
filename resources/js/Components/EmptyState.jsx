import { motion } from 'framer-motion';
import Button from './Button';
import { HiOutlineInboxStack } from 'react-icons/hi2';

export default function EmptyState({
    icon: Icon = HiOutlineInboxStack,
    title = 'Aucune donnée',
    description,
    message, // backward compatibility
    action,
    onAction, // backward compatibility
    actionLabel = 'Créer',
    className = ''
}) {
    const finalDescription = description || message || 'Commencez par créer votre premier élément.';
    const finalAction = action || onAction;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-center py-16 px-4 ${className}`}
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 shadow-inner"
            >
                <Icon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
            </motion.div>

            <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 text-xl font-bold text-gray-900 dark:text-white"
            >
                {title}
            </motion.h3>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed"
            >
                {finalDescription}
            </motion.p>

            {finalAction && actionLabel && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8"
                >
                    <Button onClick={finalAction} variant="primary">
                        {actionLabel}
                    </Button>
                </motion.div>
            )}
        </motion.div>
    );
}
