import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { HiMagnifyingGlass, HiXMark } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchInput({
    value: initialValue = '',
    onChange,
    placeholder = 'Rechercher...',
    route: searchRoute,
    className = '',
    ariaLabel = 'Search',
    debounceMs = 300,
    size = 'md'
}) {
    const [value, setValue] = useState(initialValue);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
        if (!searchRoute) return;

        const handler = setTimeout(() => {
            router.get(
                searchRoute,
                { search: value },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                }
            );
        }, debounceMs);

        return () => clearTimeout(handler);
    }, [value, debounceMs, searchRoute]);

    const handleChange = (newValue) => {
        setValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    const handleClear = () => {
        setValue('');
        if (onChange) {
            onChange('');
        }
        if (searchRoute) {
            router.get(searchRoute, {}, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }
    };

    const sizeClasses = {
        sm: 'py-1.5 pl-9 pr-9 text-sm',
        md: 'py-2.5 pl-11 pr-11 text-sm',
        lg: 'py-3 pl-12 pr-12 text-base'
    };

    const iconSizes = {
        sm: 'h-4 w-4 left-2.5',
        md: 'h-5 w-5 left-3.5',
        lg: 'h-6 w-6 left-4'
    };

    return (
        <div className={`relative ${className}`}>
            <div className={`relative flex items-center transition-all duration-300 ${
                isFocused
                    ? 'ring-2 ring-terracotta-500/50 shadow-lg shadow-terracotta-500/10'
                    : 'ring-1 ring-gray-200 dark:ring-gray-600 hover:ring-gray-300 dark:hover:ring-gray-500'
            } rounded-xl bg-white dark:bg-gray-800`}>
                <HiMagnifyingGlass className={`absolute ${iconSizes[size]} text-gray-400 dark:text-gray-500 transition-colors ${isFocused ? 'text-terracotta-500 dark:text-terracotta-400' : ''}`} />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => handleChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    aria-label={ariaLabel}
                    className={`w-full ${sizeClasses[size]} bg-transparent border-0 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-0 focus:outline-none rounded-xl`}
                />
                <AnimatePresence>
                    {value && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={handleClear}
                            className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all"
                            type="button"
                        >
                            <HiXMark className="h-4 w-4" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
