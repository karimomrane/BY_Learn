import { motion } from 'framer-motion';

export default function Badge({
    children,
    variant = 'default', // default, primary, success, warning, danger, info, brand
    size = 'md', // sm, md, lg
    className = '',
    icon: Icon,
    removable = false,
    onRemove
}) {
    const variants = {
        default: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
        primary: 'bg-beige-200 text-mocha-600 dark:bg-terracotta-900/30 dark:text-terracotta-300',
        success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
        warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
        danger: 'bg-terracotta-100 text-terracotta-700 dark:bg-terracotta-900/30 dark:text-terracotta-300',
        info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        brand: 'bg-gradient-to-r from-beige-200 to-terracotta-300 text-mocha-600 dark:from-terracotta-900/30 dark:to-mocha-900/30 dark:text-terracotta-300'
    };

    const sizes = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-xs px-2.5 py-1',
        lg: 'text-sm px-3 py-1.5'
    };

    return (
        <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`inline-flex items-center gap-1.5 rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {Icon && <Icon className="h-3.5 w-3.5" />}
            {children}
            {removable && (
                <button
                    type="button"
                    onClick={onRemove}
                    className="ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-current transition-colors"
                >
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            )}
        </motion.span>
    );
}
