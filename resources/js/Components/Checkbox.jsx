export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'h-4 w-4 rounded border-gray-300 text-terracotta-600 shadow-sm focus:ring-2 focus:ring-terracotta-500/20 focus:ring-offset-0 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-terracotta-600 transition-colors cursor-pointer ' +
                className
            }
        />
    );
}
