import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { HiSparkles } from 'react-icons/hi2';

export default function GuestLayout({ children }) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 15
            }
        },
    };

    const floatingVariants = {
        animate: {
            y: [-10, 10, -10],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut'
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-beige-100 via-beige-200 to-beige-100 dark:from-gray-900 dark:via-terracotta-900/20 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    variants={floatingVariants}
                    animate="animate"
                    className="absolute top-20 left-10 w-64 h-64 bg-terracotta-400/10 dark:bg-terracotta-500/10 rounded-full blur-3xl"
                />
                <motion.div
                    variants={floatingVariants}
                    animate="animate"
                    transition={{ delay: 1 }}
                    className="absolute bottom-20 right-10 w-96 h-96 bg-orange-400/10 dark:bg-orange-500/10 rounded-full blur-3xl"
                />
                <motion.div
                    variants={floatingVariants}
                    animate="animate"
                    transition={{ delay: 2 }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-terracotta-400/10 dark:bg-terracotta-500/10 rounded-full blur-3xl"
                />
            </div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo Section */}
                <motion.div
                    variants={itemVariants}
                    className="text-center mb-8"
                >
                    <Link href="/" className="inline-flex flex-col items-center space-y-4">
                        <div className="relative">
                            <motion.div
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-terracotta-500 to-mocha-600 rounded-2xl blur-xl opacity-50" />
                                <div className="relative bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-2xl">
                                    <ApplicationLogo variant="auto" className="h-16 w-16" />
                                </div>
                            </motion.div>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                className="absolute -top-2 -right-2"
                            >
                                <HiSparkles className="h-8 w-8 text-yellow-400" />
                            </motion.div>
                        </div>
                        <div className="text-center">
                            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                                E-Learning Platform
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Apprenez, progressez, excellez
                            </p>
                        </div>
                    </Link>
                </motion.div>

                {/* Content Card */}
                <motion.div
                    variants={itemVariants}
                    className="relative"
                >
                    {/* Gradient Border Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-terracotta-500 via-mocha-600 to-terracotta-500 rounded-2xl blur-sm opacity-75" />

                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                        {/* Card Header Gradient */}
                        <div className="h-2 bg-gradient-to-r from-terracotta-500 via-mocha-600 to-terracotta-500" />

                        {/* Card Content */}
                        <div className="p-8">
                            {children}
                        </div>
                    </div>
                </motion.div>

                {/* Footer Text */}
                <motion.div
                    variants={itemVariants}
                    className="mt-8 text-center"
                >
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        © {new Date().getFullYear()} E-Learning Platform. Tous droits réservés.
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}

