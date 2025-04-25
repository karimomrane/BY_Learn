import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const score = usePage().props.auth.score;
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark' || false;
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900" style={{ backgroundImage: 'url(/bg.svg)', backgroundSize: 'cover' }}>
            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg"
                    >
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                            <Link href="/">
                                <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
                            </Link>
                            <button
                                onClick={toggleSidebar}
                                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4">
                            <div className="space-y-2">
                                {user.role === 'admin' && (
                                    <ResponsiveNavLink
                                        href={route('dashboard')}
                                        active={route().current('dashboard')}
                                    >
                                        Dashboard
                                    </ResponsiveNavLink>
                                )}
                                <ResponsiveNavLink
                                    href={route('home')}
                                    active={route().current('home')}
                                >
                                    Home
                                </ResponsiveNavLink>
                                {user.role === 'admin' && (
                                    <ResponsiveNavLink
                                        href={route('programmes.index')}
                                        active={route().current('programmes.index')}
                                    >
                                        Programme
                                    </ResponsiveNavLink>
                                )}
                                <ResponsiveNavLink
                                    href={route('user-progress.index')}
                                    active={route().current('user-progress.index')}
                                >
                                    Historique
                                </ResponsiveNavLink>
                            </div>
                            <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                                <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                                    {user.name}
                                </div>
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {user.email}
                                </div>
                                <div className="mt-3 space-y-1">
                                    <ResponsiveNavLink href={route('profile.edit')}>
                                        Profile
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        method="post"
                                        href={route('logout')}
                                        as="button"
                                    >
                                        Log Out
                                    </ResponsiveNavLink>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Overlay for Sidebar */}
            {isSidebarOpen && (
                <div
                    onClick={toggleSidebar}
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm sm:hidden"
                />
            )}

            {/* Navbar */}
            <nav className="border-b border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800">
                <div className="mx-auto max-w-16xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
                                </Link>
                            </div>
                            {user.role === 'admin' && (
                                <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                    <NavLink
                                        href={route('dashboard')}
                                        active={route().current('dashboard')}
                                    >
                                        Dashboard
                                    </NavLink>
                                </div>
                            )}
                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('home')}
                                    active={route().current('home')}
                                >
                                    Home
                                </NavLink>
                            </div>
                            {user.role === 'admin' && (
                                <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                    <NavLink
                                        href={route('programmes.index')}
                                        active={route().current('programmes.index')}
                                    >
                                        Programme
                                    </NavLink>
                                </div>
                            )}
                            {user.role === 'admin' && (
                                <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                    <NavLink
                                        href={route('users.index')}
                                        active={route().current('users.index')}
                                    >
                                        Utilisateur
                                    </NavLink>
                                </div>
                            )}
                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('user-progress.index')}
                                    active={route().current('user-progress.index')}
                                >
                                    Historique
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            {/* Dark Mode Toggle */}
                            <div
                                onClick={() => setIsDarkMode((prev) => !prev)}
                                className={`flex h-[35px] w-[70px] rounded-[50px] bg-zinc-100 p-[3px] mr-5 shadow-inner hover:cursor-pointer dark:bg-zinc-700 ${isDarkMode && 'place-content-end'}`}
                            >
                                <motion.div
                                    className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-black/90"
                                    layout
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                >
                                    <motion.div whileTap={{ rotate: 360 }}>
                                        {isDarkMode ? (
                                            <FaSun className="h-5 w-5 text-yellow-300" />
                                        ) : (
                                            <FaMoon className="h-5 w-5 text-slate-200" />
                                        )}
                                    </motion.div>
                                </motion.div>
                            </div>

                            <span className="inline-flex rounded-md font-bold text-gray-700 dark:text-gray-300">
                                Score : {score}
                            </span>

                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                                            >
                                                {user.name}
                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <span className="inline-flex rounded-md font-bold text-gray-700 dark:text-gray-300 mx-16">
                                Score : {score}
                            </span>
                            {/* Dark Mode Toggle */}
                            <div
                                onClick={() => setIsDarkMode((prev) => !prev)}
                                className={`flex h-[35px] w-[70px] rounded-[50px] bg-zinc-100 p-[3px] mr-5 shadow-inner hover:cursor-pointer dark:bg-zinc-700 ${isDarkMode && 'place-content-end'}`}
                            >
                                <motion.div
                                    className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-black/90"
                                    layout
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                >
                                    <motion.div whileTap={{ rotate: 360 }}>
                                        {isDarkMode ? (
                                            <FaSun className="h-5 w-5 text-yellow-300" />
                                        ) : (
                                            <FaMoon className="h-5 w-5 text-slate-200" />
                                        )}
                                    </motion.div>
                                </motion.div>
                            </div>

                            <button
                                onClick={toggleSidebar}
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none dark:text-gray-500 dark:hover:bg-gray-900 dark:hover:text-gray-400 dark:focus:bg-gray-900 dark:focus:text-gray-400"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow dark:bg-gray-800">
                    <div className="mx-auto max-w-16xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
