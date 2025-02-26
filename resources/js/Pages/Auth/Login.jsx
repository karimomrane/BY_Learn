import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        phonenumber: '',
        password: '',
        remember: false,
    });

    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark' || false;
    });

    const controls = useAnimation();

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

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
        <GuestLayout>
            <Head title="Log in" />

            {/* Dark Mode Toggle */}
            <button
                onClick={toggleDarkMode}
                className="fixed right-4 top-4 z-50 rounded-full bg-gray-200 p-2 dark:bg-gray-800"
            >
                {isDarkMode ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-yellow-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                    </svg>
                )}
            </button>

            {/* Status Message */}
            {status && (
                <motion.div
                    className="mb-4 text-sm font-medium text-green-600"
                    initial="hidden"
                    animate="visible"
                    variants={itemVariants}
                >
                    {status}
                </motion.div>
            )}

            {/* Login Form */}
            <motion.form
                onSubmit={submit}
                className="space-y-6"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Phone Number Field */}
                <motion.div variants={itemVariants}>
                    <InputLabel
                        htmlFor="phonenumber"
                        value="Phone Number"
                        className="dark:text-gray-300"
                    />
                    <TextInput
                        id="phonenumber"
                        name="phonenumber"
                        value={data.phonenumber}
                        className="mt-1 block w-full dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                        autoComplete="tel"
                        onChange={(e) => setData('phonenumber', e.target.value)}
                        required
                    />
                    <InputError
                        message={errors.phonenumber}
                        className="mt-2 dark:text-red-400"
                    />
                </motion.div>

                {/* Password Field */}
                <motion.div variants={itemVariants}>
                    <InputLabel
                        htmlFor="password"
                        value="Password"
                        className="dark:text-gray-300"
                    />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError
                        message={errors.password}
                        className="mt-2 dark:text-red-400"
                    />
                </motion.div>

                {/* Remember Me Checkbox */}
                <motion.div
                    className="mt-4 block"
                    variants={itemVariants}
                >
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                            className="dark:bg-gray-800 dark:border-gray-700"
                        />
                        <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">
                            Remember me
                        </span>
                    </label>
                </motion.div>

                {/* Forgot Password and Submit Button */}
                <motion.div
                    className="mt-4 flex items-center justify-end"
                    variants={itemVariants}
                >
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                        >
                            Forgot your password?
                        </Link>
                    )}

                    <PrimaryButton
                        className="ms-4"
                        disabled={processing}
                    >
                        Log in
                    </PrimaryButton>
                </motion.div>
            </motion.form>
        </GuestLayout>
    );
}
