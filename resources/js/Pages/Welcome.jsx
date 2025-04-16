import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaBookOpen, FaMoon, FaQuestion, FaSun, FaVideo } from 'react-icons/fa';

export default function Welcome({ auth }) {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark' || false;
    });

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const handleImageError = () => {
        document.getElementById('screenshot-container')?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document.getElementById('docs-card-content')?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    // Animation variants for Framer Motion
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    return (
        <>
            <Head title="Welcome to LMS" />
            <div
                id="page-container"
                className="mx-auto flex min-h-dvh w-full min-w-[320px] flex-col bg-gray-100 dark:bg-gray-900"
            >
                <main id="page-content" className="flex max-w-full flex-auto flex-col">
                    <div className="bg-[#f5f5f5] dark:bg-gray-800">
                        {/* Header */}
                        <header id="page-header" className="flex flex-none items-center py-10">
                            <div className="container mx-auto flex flex-col gap-6 px-4 text-center sm:flex-row sm:items-center sm:justify-between sm:gap-0 lg:px-8 xl:max-w-6xl">
                                <div className="flex items-center justify-center gap-2">
                                    <a
                                        href="#"
                                        className="inline-flex items-center gap-2 text-lg font-bold tracking-wide text-indigo-900 dark:text-indigo-100 hover:opacity-75"
                                    >
                                        <img src="/logo.png" className="h-8 w-8" alt="Logo" />
                                        <span>Biwai LEARN</span>
                                    </a>
                                </div>
                                <nav className="flex items-center justify-center gap-4 text-sm sm:gap-6">
                                    {auth.user ? (
                                        <Link
                                            href={auth.user.role === 'admin' ? route('dashboard') : route('home')}
                                            className="inline-flex items-center gap-2 font-semibold text-indigo-900 dark:text-indigo-100 hover:text-white"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                className="hi-mini hi-user-circle inline-block h-5 w-5 opacity-50"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            {auth.user.name}
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={route('login')}
                                                className="inline-flex items-center gap-2 font-semibold text-indigo-900 dark:text-indigo-100 hover:text-white"
                                            >
                                                Log in
                                            </Link>
                                            <Link
                                                href={route('register')}
                                                className="inline-flex items-center gap-2 font-semibold text-indigo-900 dark:text-indigo-100 hover:text-white"
                                            >
                                                Register
                                            </Link>
                                        </>
                                    )}
                                    {/* Dark Mode Toggle */}
                                    <button
                                        onClick={() => setIsDarkMode(!isDarkMode)}
                                        className="p-2 rounded-md focus:outline-none text-indigo-900 dark:text-indigo-300"
                                        aria-label="Toggle Dark Mode"
                                    >
                                        {isDarkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
                                    </button>
                                </nav>
                            </div>
                        </header>

                        <div className="container mx-auto px-4 pt-16 lg:px-8 lg:pt-32 xl:max-w-6xl">
                            <div className="text-center">
                                <motion.h2
                                    className="mb-4 text-balance text-3xl font-extrabold text-indigo-900 dark:text-indigo-300 md:text-5xl"
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    Bienvenue sur notre LMS Biwai
                                </motion.h2>
                                <motion.h3
                                    className="mx-auto text-lg font-medium text-gray-900 dark:text-gray-200 md:text-xl md:leading-relaxed lg:w-2/3"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.6 }}
                                >
                                    Notre LMS offre une plateforme complète pour gérer les cours, suivre le progrè et interagir avec les collaboreurs.
                                </motion.h3>
                            </div>
                            <motion.div
                                className="flex flex-wrap justify-center gap-4 pb-16 pt-10"
                                variants={containerVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                            >
                                <motion.div variants={itemVariants}>
                                    <Link
                                        href={route('home')}
                                        className="inline-flex items-center justify-center gap-2 rounded-full border border-blue-800 bg-[#74B01A] px-6 py-4 font-semibold leading-6 text-white hover:border-blue-700/50 hover:bg-blue-700/50 hover:text-white focus:outline-none focus:ring focus:ring-blue-500/50 active:border-blue-700 active:bg-blue-700"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="#000"
                                            className="hi-mini hi-arrow-right inline-block h-5 w-5 opacity-50"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span>Get Started</span>
                                    </Link>
                                </motion.div>
                            </motion.div>
                            <motion.div
                                className="relative mx-5 -mb-20 rounded-xl bg-white p-2 shadow-lg sm:-mb-40 lg:mx-32"
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <div className="aspect-w-16 aspect-h-10 w-full bg-gray-200">
                                    <img
                                        src="/welcomeslide.png"
                                        alt="Hero Image"
                                        className="mx-auto rounded-lg dark:hidden"
                                        onError={handleImageError}
                                    />
                                    <img
                                        src="/welcomeslidedark.png"
                                        alt="Hero Image"
                                        className="mx-auto rounded-lg hidden dark:block"
                                        onError={handleImageError}
                                    />
                                </div>

                            </motion.div>
                        </div>
                    </div>

                    {/* Services Section */}
                    <motion.div
                        className="bg-white pt-40 dark:bg-gray-800"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <div className="container mx-auto space-y-16 px-4 py-16 lg:px-8 lg:py-32 xl:max-w-6xl">
                            <div className="text-center">
                                <motion.h2
                                    className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl"
                                    variants={itemVariants}
                                >
                                    Services
                                </motion.h2>
                                <motion.h3
                                    className="mx-auto text-lg font-medium text-gray-600 dark:text-gray-300 md:text-xl md:leading-relaxed lg:w-2/3"
                                    variants={itemVariants}
                                >
                                    Découvrez nos services dédiés à l'apprentissage.
                                </motion.h3>
                            </div>
                            <motion.div
                                className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-12"
                                variants={containerVariants}
                            >
                                <motion.div className="py-5 text-center" variants={itemVariants}>
                                    <div className="relative mb-12 ml-3 inline-flex h-16 w-16 items-center justify-center">
                                        <div className="absolute inset-0 -m-3 translate-x-1 translate-y-1 rounded-full bg-green-300"></div>
                                        <div className="absolute inset-0 -m-3 rounded-full bg-[#74B01A]"></div>
                                        <FaBookOpen className="relative inline-block h-10 w-10 text-white opacity-90 transition duration-150 ease-out" />
                                    </div>
                                    <h4 className="mb-2 text-xl font-bold dark:text-white">Gestion des Cours</h4>
                                    <p className="text-left leading-relaxed text-gray-600 dark:text-gray-300">
                                        Notre LMS offre une plateforme complète pour gérer les cours, suivre les progrès et interagir avec les étudiants.
                                    </p>
                                </motion.div>
                                <motion.div className="py-5 text-center" variants={itemVariants}>
                                    <div className="relative mb-12 ml-3 inline-flex h-16 w-16 items-center justify-center">
                                        <div className="absolute inset-0 -m-3 translate-x-1 translate-y-1 rounded-full bg-green-300"></div>
                                        <div className="absolute inset-0 -m-3 rounded-full bg-[#74B01A]"></div>
                                        <FaVideo className="relative inline-block h-10 w-10 text-white opacity-90 transition duration-150 ease-out" />
                                    </div>
                                    <h4 className="mb-2 text-xl font-bold dark:text-white">Ressources d'Apprentissage</h4>
                                    <p className="text-left leading-relaxed text-gray-600 dark:text-gray-300">
                                        Accédez à une vaste bibliothèque de ressources d'apprentissage, y compris des tutoriels vidéo et des quiz interactifs.
                                    </p>
                                </motion.div>
                                <motion.div className="py-5 text-center" variants={itemVariants}>
                                    <div className="relative mb-12 ml-3 inline-flex h-16 w-16 items-center justify-center">
                                        <div className="absolute inset-0 -m-3 translate-x-1 translate-y-1 rounded-full bg-green-300"></div>
                                        <div className="absolute inset-0 -m-3 rounded-full bg-[#74B01A]"></div>
                                        <FaQuestion className="relative inline-block h-10 w-10 text-white opacity-90 transition duration-150 ease-out" />
                                    </div>
                                    <h4 className="mb-2 text-xl font-bold dark:text-white">Quiz</h4>
                                    <p className="text-left leading-relaxed text-gray-600 dark:text-gray-300">
                                        Testez vos connaissances avec nos quiz interactifs conçus pour renforcer votre apprentissage.
                                    </p>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* How It Works Section */}
                    <motion.div
                        className="relative bg-white dark:bg-gray-800"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <div className="absolute inset-0 skew-y-1 bg-[#74B01A]"></div>
                        <div className="container relative mx-auto space-y-16 px-4 py-16 lg:px-8 lg:py-32 xl:max-w-7xl">
                            <div className="text-center">
                                <motion.h2
                                    className="text-3xl font-extrabold text-white md:text-4xl"
                                    variants={itemVariants}
                                >
                                    How it works?
                                </motion.h2>
                            </div>
                            <motion.div
                                className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
                                variants={containerVariants}
                            >
                                <motion.div className="rounded-3xl bg-white/5 p-10 shadow-sm transition hover:bg-white/10" variants={itemVariants}>
                                    <svg
                                        className="mb-5 inline-block h-12 w-12 text-gray-100"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <h4 className="mb-2 text-lg font-bold text-white">
                                        1. Se Connecter avec votre compte
                                    </h4>
                                    <p className="text-sm leading-relaxed text-white/75">
                                        Cliquez sur le bouton de connexion et renseignez vos informations.
                                    </p>
                                </motion.div>
                                <motion.div className="rounded-3xl bg-white/5 p-10 shadow-sm transition hover:bg-white/10" variants={itemVariants}>
                                    <svg
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="mb-5 inline-block h-12 w-12 text-gray-100"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                    <h4 className="mb-2 text-lg font-bold text-white">
                                        2. Consulter les programmes et les cours
                                    </h4>
                                    <p className="text-sm leading-relaxed text-white/75">
                                        Parcourez une gamme complète de programmes et de cours avec des vidéos explicatives.
                                    </p>
                                </motion.div>
                                <motion.div className="rounded-3xl bg-white/5 p-10 shadow-sm transition hover:bg-white/10 sm:col-span-2 lg:col-span-1" variants={itemVariants}>
                                    <svg
                                        className="mb-5 inline-block h-12 w-12 text-gray-100"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    <h4 className="mb-2 text-lg font-bold text-white">
                                        3. Passer des quizz et améliorer vos compétences
                                    </h4>
                                    <p className="text-sm leading-relaxed text-white/75">
                                        Répondez aux questions et gagnez des points pour renforcer votre apprentissage.
                                    </p>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Footer */}
                    <footer id="page-footer" className="bg-white dark:bg-gray-800">
                        <div className="container mx-auto flex flex-col gap-6 px-4 py-16 text-center text-sm md:flex-row md:justify-between md:gap-0 md:text-left lg:px-8 lg:py-32 xl:max-w-6xl">
                            <nav className="space-x-2 sm:space-x-4">
                                <a href="#" className="font-medium text-gray-700 dark:text-gray-300 hover:text-blue-500">
                                    About
                                </a>
                                <a href="#" className="font-medium text-gray-700 dark:text-gray-300 hover:text-blue-500">
                                    Terms of Service
                                </a>
                                <a href="#" className="font-medium text-gray-700 dark:text-gray-300 hover:text-blue-500">
                                    Privacy Policy
                                </a>
                            </nav>
                            <div className="text-gray-500 dark:text-gray-400">
                                <span className="font-medium">BIWAI</span> &copy; {new Date().getFullYear()}
                            </div>
                        </div>
                    </footer>
                </main>
            </div>
        </>
    );
}
