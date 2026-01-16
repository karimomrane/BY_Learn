export default function InputLabel({
    value,
    className = '',
    children,
    required = false,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ` +
                className
            }
        >
            {value ? value : children}
            {required && <span className="text-terracotta-500 ml-1">*</span>}
        </label>
    );
}
