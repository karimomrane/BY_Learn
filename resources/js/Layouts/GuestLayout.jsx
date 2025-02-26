import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function GuestLayout({ children }) {
    // Animation variants for Framer Motion
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="flex min-h-screen justify-center flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0 dark:bg-gray-900">
            {/* Logo with Animation */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <Link href="/">
                    <motion.div variants={itemVariants}>
                        <ApplicationLogo className="h-20 w-20 fill-current text-gray-500 dark:text-gray-300" />
                    </motion.div>
                </Link>
            </motion.div>

            {/* Content Container with Animation */}
            <motion.div
                className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg dark:bg-gray-800"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {children}
            </motion.div>
        </div>
    );
}
