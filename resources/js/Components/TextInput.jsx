import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, error = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    const baseClasses = 'w-full px-4 py-2.5 text-sm rounded-xl border transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500';
    const normalClasses = 'border-gray-200 dark:border-gray-600 focus:border-terracotta-500 dark:focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-500/20 hover:border-gray-300 dark:hover:border-gray-500';
    const errorClasses = 'border-terracotta-600 dark:border-terracotta-400 focus:ring-2 focus:ring-terracotta-500/20';

    return (
        <input
            {...props}
            type={type}
            className={`${baseClasses} ${error ? errorClasses : normalClasses} ${className}`}
            ref={localRef}
        />
    );
});
