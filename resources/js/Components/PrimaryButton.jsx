export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-xl border border-transparent bg-gradient-to-r from-terracotta-500 to-mocha-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:from-terracotta-600 hover:to-mocha-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:ring-offset-2 active:scale-95 dark:focus:ring-offset-gray-800 ${
                    disabled && 'opacity-50 cursor-not-allowed'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
