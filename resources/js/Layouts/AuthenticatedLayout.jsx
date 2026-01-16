import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import SearchInput from '@/Components/SearchInput';
import NotificationBadge from '@/Components/NotificationBadge';
import Breadcrumb from '@/Components/Breadcrumb';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    HiSun,
    HiMoon,
    HiHome,
    HiChartBar,
    HiAcademicCap,
    HiUsers,
    HiClipboardDocumentList,
    HiClock,
    HiBars3,
    HiXMark
} from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthenticatedLayout({ header, children, breadcrumbs = [] }) {
    const user = usePage().props.auth.user;
    const score = usePage().props.auth.score;
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark' || false;
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const navigationItems = [
        ...(user.role === 'admin' ? [
            {
                name: 'Dashboard',
                href: route('dashboard'),
                active: route().current('dashboard'),
                icon: HiChartBar
            }
        ] : []),
        {
            name: 'Accueil',
            href: route('home'),
            active: route().current('home'),
            icon: HiHome
        },
        ...(user.role === 'admin' ? [
            {
                name: 'Programmes',
                href: route('programmes.index'),
                active: route().current('programmes.*'),
                icon: HiAcademicCap
            },
            {
                name: 'Utilisateurs',
                href: route('users.index'),
                active: route().current('users.*'),
                icon: HiUsers
            },
            {
                name: 'Assignations Quiz',
                href: route('quiz.user.assignment'),
                active: route().current('quiz.user.assignment'),
                icon: HiClipboardDocumentList
            }
        ] : []),
        {
            name: 'Historique',
            href: route('user-progress.index'),
            active: route().current('user-progress.*'),
            icon: HiClock
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-beige-200/30 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-200">
            {/* Desktop Sidebar - Fixed Left */}
            <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-64 lg:flex-col">
                {/* Sidebar Container */}
                <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg overflow-y-auto">
                    {/* Logo Header */}
                    <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-terracotta-500 to-mocha-600">
                        <Link href={route('home')} className="flex items-center space-x-3">
                            <ApplicationLogo variant="light" className="h-9 w-9" />
                            <span className="text-xl font-bold text-white">
                                E-Learning
                            </span>
                        </Link>
                    </div>

                    {/* User Info Card */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col items-center p-4 bg-gradient-to-br from-beige-200 to-terracotta-300 dark:from-gray-700 dark:to-gray-600 rounded-xl">
                            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-terracotta-500 to-mocha-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <p className="mt-3 text-sm font-semibold text-gray-900 dark:text-white text-center">
                                {user.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 text-center truncate w-full px-2">
                                {user.email}
                            </p>
                            <div className="flex items-center mt-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/50 dark:to-yellow-900/50">
                                <span className="text-base">⭐</span>
                                <span className="ml-1 text-sm font-bold text-amber-700 dark:text-amber-300">
                                    {score} points
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 px-3 py-4 space-y-1">
                        {navigationItems.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        item.active
                                            ? 'bg-gradient-to-r from-terracotta-500 to-mocha-600 text-white shadow-lg shadow-terracotta-600/30'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                    }`}
                                >
                                    <Icon className="h-5 w-5 flex-shrink-0" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-1">
                        <Link
                            href={route('profile.edit')}
                            className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>Profil</span>
                        </Link>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-terracotta-600 dark:text-terracotta-400 hover:bg-beige-200 dark:hover:bg-terracotta-900/20 rounded-lg transition-colors"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Déconnexion</span>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleSidebar}
                            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                        />

                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 shadow-2xl lg:hidden"
                        >
                            {/* Sidebar Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                                <Link href={route('home')} className="flex items-center space-x-3">
                                    <ApplicationLogo className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                                        E-Learning
                                    </span>
                                </Link>
                                <button
                                    onClick={toggleSidebar}
                                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <HiXMark className="h-6 w-6" />
                                </button>
                            </div>

                            {/* User Info Card */}
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
                                    <div className="flex-shrink-0">
                                        <div className="h-12 w-12 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                            {user.email}
                                        </p>
                                        <div className="flex items-center mt-1">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                                                ⭐ {score} points
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Links */}
                            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                                {navigationItems.map((item, index) => {
                                    const Icon = item.icon;
                                    return (
                                        <motion.div
                                            key={item.name}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Link
                                                href={item.href}
                                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                                    item.active
                                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                }`}
                                            >
                                                <Icon className="h-5 w-5 flex-shrink-0" />
                                                <span className="font-medium">{item.name}</span>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </nav>

                            {/* Sidebar Footer */}
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                                <Link
                                    href={route('profile.edit')}
                                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    Profil
                                </Link>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="w-full text-left px-4 py-2 text-sm text-terracotta-600 dark:text-terracotta-400 hover:bg-beige-200 dark:hover:bg-terracotta-900/20 rounded-lg transition-colors"
                                >
                                    Déconnexion
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Top Navigation Bar - Simplified for Desktop with Sidebar */}
            <div className="lg:pl-64 flex flex-col min-h-screen">
                <nav className="sticky top-0 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            {/* Left Section - Mobile */}
                            <div className="flex items-center space-x-4 lg:hidden">
                                {/* Mobile Menu Button */}
                                <button
                                    onClick={toggleSidebar}
                                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <HiBars3 className="h-6 w-6" />
                                </button>

                                {/* Logo - Mobile */}
                                <Link href={route('home')} className="flex items-center space-x-2">
                                    <ApplicationLogo variant="auto" className="h-8 w-8" />
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                                        E-Learning
                                    </span>
                                </Link>
                            </div>

                            {/* Left Section - Desktop (empty, sidebar handles nav) */}
                            <div className="hidden lg:flex items-center flex-1">
                                {/* Search Bar - Desktop */}
                                <SearchInput
                                    value={searchQuery}
                                    onChange={setSearchQuery}
                                    placeholder="Rechercher..."
                                    className="w-full max-w-md"
                                />
                            </div>

                            {/* Right Section */}
                            <div className="flex items-center space-x-3">
                                {/* Score Badge - Desktop */}
                                <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-lg border border-amber-200 dark:border-amber-700">
                                    <span className="text-lg">⭐</span>
                                    <span className="text-sm font-bold text-amber-700 dark:text-amber-300">
                                        {score}
                                    </span>
                                </div>

                                {/* Notifications */}
                                <NotificationBadge count={0} onClick={() => {}} />

                                {/* Dark Mode Toggle */}
                                <button
                                    onClick={() => setIsDarkMode(!isDarkMode)}
                                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <motion.div
                                        initial={false}
                                        animate={{ rotate: isDarkMode ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {isDarkMode ? (
                                            <HiSun className="h-5 w-5 text-yellow-400" />
                                        ) : (
                                            <HiMoon className="h-5 w-5" />
                                        )}
                                    </motion.div>
                                </button>

                                {/* User Dropdown - Mobile */}
                                <div className="lg:hidden">
                                    <button className="h-8 w-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-medium text-sm">
                                        {user.name.charAt(0).toUpperCase()}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Page Header with Breadcrumbs */}
                {(header || breadcrumbs.length > 0) && (
                    <header className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
                        <div className="px-4 py-4 sm:px-6 lg:px-8">
                            {breadcrumbs.length > 0 && <Breadcrumb items={breadcrumbs} />}
                            {header && <div className="mt-2">{header}</div>}
                        </div>
                    </header>
                )}

                {/* Main Content */}
                <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </main>

                {/* Footer */}
                <footer className="border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                    <div className="px-4 py-6 sm:px-6 lg:px-8">
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                            © {new Date().getFullYear()} E-Learning Platform. Tous droits réservés.
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    );
}
