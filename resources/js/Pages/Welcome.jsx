import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link } from '@inertiajs/react';
import { motion, spring } from 'framer-motion';
import Svg1 from './svg1';
import Svg2 from './Svg2';
import Svg3 from './Svg3';
import { useEffect, useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

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
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    // Animation variants for Framer Motion
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
            },
        },
    };

    return (
        <>
            <Head title="Welcome to LMS" />
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 text-black/50 dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:text-white/50">
                <img
                    id="background"
                    className="absolute -left-20 top-0 max-w-[877px]"
                    src="/welcomebg.svg"
                />
                <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-[#7EBA27] selection:text-white">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                        <motion.header
                            className="grid grid-cols-2 items-center gap-2 py-10 lg:grid-cols-3"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div
                                className="flex lg:col-start-2 lg:justify-center"
                                variants={itemVariants}
                            >
                                <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                            </motion.div>
                            <motion.nav
                                className="-mx-3 flex flex-1 justify-end"
                                variants={itemVariants}
                            >
                                {/* Dark Mode Toggle */}
                                <div
                                    onClick={() => setIsDarkMode((prev) => !prev)}
                                    className={`flex h-[35px] w-[70px] rounded-[50px] bg-zinc-100 p-[3px] mr-5 shadow-inner hover:cursor-pointer dark:bg-zinc-700 ${isDarkMode && 'place-content-end'}`}
                                >
                                    <motion.div
                                        className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-black/90"
                                        layout
                                        transition={spring}
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
                                {auth.user ? (
                                    <Link
                                        href={auth.user.role === 'admin' ? route('dashboard') : route('home')}
                                        className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#7EBA27] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                    >
                                        {auth.user.role === 'admin' ? 'Dashboard' : 'Home'}
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#7EBA27] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#7EBA27] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </motion.nav>
                        </motion.header>

                        <motion.main
                            className="mt-6"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
                                <motion.a
                                    href={route('login')}
                                    id="docs-card"
                                    className="flex flex-col items-start gap-6 overflow-hidden rounded-lg bg-white p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[#7EBA27] md:row-span-3 lg:p-10 lg:pb-10 dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#7EBA27]"
                                    variants={itemVariants}
                                >
                                    <div
                                        id="screenshot-container"
                                        className="relative flex w-full flex-1 items-stretch"
                                    >
                                        <img
                                            src="/welcomeslide.png"
                                            alt="LMS dashboard screenshot"
                                            className="aspect-video h-full w-full flex-1 rounded-[10px] object-cover object-top drop-shadow-[0px_4px_34px_rgba(0,0,0,0.06)] dark:hidden"
                                            onError={handleImageError}
                                        />
                                        <img
                                            src="/welcomeslidedark.png"
                                            alt="LMS dashboard screenshot"
                                            className="hidden aspect-video h-full w-full flex-1 rounded-[10px] object-cover object-top drop-shadow-[0px_4px_34px_rgba(0,0,0,0.25)] dark:block"
                                        />
                                        <div className="absolute -bottom-16 -left-16 h-40 w-[calc(100%+8rem)] bg-gradient-to-b from-transparent via-white to-white dark:via-zinc-900 dark:to-zinc-900"></div>
                                    </div>

                                    <div className="relative flex items-center gap-6 lg:items-end">
                                        <div
                                            id="docs-card-content"
                                            className="flex items-start gap-6 lg:flex-col"
                                        >
                                            <Svg3 />

                                            <div className="pt-3 sm:pt-5 lg:pt-0">
                                                <h2 className="text-xl font-semibold text-black dark:text-white">
                                                    Gestion des Cours
                                                </h2>

                                                <p className="mt-4 text-sm/relaxed">
                                                    Notre LMS offre une plateforme complète pour gérer les cours, suivre les progrès et interagir avec les étudiants. Que vous soyez enseignant ou apprenant, nos outils sont conçus pour améliorer votre expérience.                                                </p>
                                            </div>
                                        </div>

                                        <Svg2 />
                                    </div>
                                </motion.a>

                                <motion.a
                                    href={route('home')}
                                    className="flex items-start gap-4 rounded-lg bg-white p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[#7EBA27] lg:pb-10 dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#7EBA27]"
                                    variants={itemVariants}
                                >
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#7EBA27]/10 sm:size-16">
                                        <Svg1 />
                                    </div>

                                    <div className="pt-3 sm:pt-5">
                                        <h2 className="text-xl font-semibold text-black dark:text-white">
                                            Ressources d'Apprentissage
                                        </h2>

                                        <p className="mt-4 text-sm/relaxed">
                                            Accédez à une vaste bibliothèque de ressources d'apprentissage, y compris des tutoriels vidéo, des quiz interactifs et des documents téléchargeables. Améliorez vos compétences et vos connaissances avec notre contenu soigneusement sélectionné.                                        </p>
                                    </div>

                                    <Svg2 />
                                </motion.a>
                                {/* Quiz Section */}
                                <motion.a
                                    href={route('home')}
                                    className="flex items-start gap-4 rounded-lg bg-white p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[#7EBA27] lg:pb-10 dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#7EBA27]"
                                    variants={itemVariants}
                                >
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#7EBA27]/10 sm:size-16">
                                    <Svg1 />
                                    </div>

                                    <div className="pt-3 sm:pt-5">
                                        <h2 className="text-xl font-semibold text-black dark:text-white">
                                            Quiz
                                        </h2>

                                        <p className="mt-4 text-sm/relaxed">
                                            Testez vos connaissances avec nos quiz interactifs. Les quiz sont conçus pour vous aider à évaluer votre compréhension des sujets et à renforcer votre apprentissage.
                                        </p>
                                    </div>

                                    <Svg2 />
                                </motion.a>
                                {/* Quiz Section */}
                                <motion.a
                                    href={route('home')}
                                    className="flex items-start gap-4 rounded-lg bg-white p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[#7EBA27] lg:pb-10 dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#7EBA27]"
                                    variants={itemVariants}
                                >
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#7EBA27]/10 sm:size-16">
                                    <Svg1 />
                                    </div>

                                    <div className="pt-3 sm:pt-5">
                                        <h2 className="text-xl font-semibold text-black dark:text-white">
                                            Programme
                                        </h2>

                                        <p className="mt-4 text-sm/relaxed">
                                            Consultez le programme de formation détaillé.                                        </p>
                                    </div>

                                    <Svg2 />
                                </motion.a>

                            </div>
                        </motion.main>

                        <motion.footer
                            className="py-16 text-center text-sm text-black dark:text-white/70"
                            variants={itemVariants}
                        >
                            &copy; {new Date().getFullYear()} {import.meta.env.VITE_APP_NAME}. All rights reserved.
                        </motion.footer>
                    </div>
                </div>
            </div>
        </>
    );
}
