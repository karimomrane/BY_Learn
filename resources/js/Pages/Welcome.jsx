import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaBookOpen, FaMoon, FaQuestion, FaSun, FaVideo, FaCheckCircle, FaCertificate, FaUsers, FaChartLine, FaTrophy, FaClock } from 'react-icons/fa';
import { HiArrowRight, HiSparkles, HiAcademicCap, HiCheck } from 'react-icons/hi2';

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
            transition: { staggerChildren: 0.15 }
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

    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const scaleIn = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    return (
        <>
            <Head title="Bienvenue - LMS" />
            <div
                id="page-container"
                className="mx-auto flex min-h-dvh w-full min-w-[320px] flex-col bg-gray-50 dark:bg-gray-900"
            >
                <main id="page-content" className="flex max-w-full flex-auto flex-col">
                    {/* Hero Section */}
                    <div className="relative bg-gradient-to-br from-gray-50 via-beige-200/30 to-terracotta-300/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
                        {/* Background Decorations */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute top-20 left-10 w-72 h-72 bg-terracotta-400/10 rounded-full blur-3xl" />
                            <div className="absolute bottom-20 right-10 w-96 h-96 bg-terracotta-400/10 rounded-full blur-3xl" />
                        </div>

                        {/* Header */}
                        <header id="page-header" className="relative flex flex-none items-center py-6">
                            <div className="container mx-auto flex flex-col gap-6 px-4 text-center sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                                <div className="flex items-center justify-center gap-3">
                                    <a
                                        href="#"
                                        className="inline-flex items-center gap-3 text-xl font-bold tracking-wide text-gray-900 dark:text-white hover:opacity-80 transition-opacity"
                                    >
                                        <div className="p-2 bg-gradient-to-br from-terracotta-500 to-mocha-600 rounded-xl shadow-lg">
                                            <img src="/logo/light.png" className="h-8 w-8" alt="Logo" />
                                        </div>
                                        <span className="bg-gradient-to-r from-terracotta-500 to-mocha-600 bg-clip-text text-transparent">Biwai LEARN</span>
                                    </a>
                                </div>
                                <nav className="flex items-center justify-center gap-4 text-sm sm:gap-6">
                                    {auth.user ? (
                                        <Link
                                            href={auth.user.role === 'admin' ? route('dashboard') : route('home')}
                                            className="inline-flex items-center gap-2 px-4 py-2 font-semibold text-white bg-gradient-to-r from-terracotta-500 to-mocha-600 rounded-lg shadow-md hover:shadow-lg transition-all"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                className="h-5 w-5"
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
                                        <Link
                                            href={route('login')}
                                            className="inline-flex items-center gap-2 px-5 py-2.5 font-semibold text-white bg-gradient-to-r from-terracotta-500 to-mocha-600 rounded-lg shadow-md hover:shadow-lg hover:from-terracotta-600 hover:to-mocha-700 transition-all"
                                        >
                                            Se connecter
                                        </Link>
                                    )}
                                    {/* Dark Mode Toggle */}
                                    <button
                                        onClick={() => setIsDarkMode(!isDarkMode)}
                                        className="p-2.5 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg text-gray-700 dark:text-gray-300 transition-all"
                                        aria-label="Toggle Dark Mode"
                                    >
                                        {isDarkMode ? <FaSun size={18} className="text-yellow-500" /> : <FaMoon size={18} />}
                                    </button>
                                </nav>
                            </div>
                        </header>

                        {/* Hero Content */}
                        <div className="relative container mx-auto px-6 pt-16 pb-40 lg:px-30 lg:pt-pb-40 lg:pb-40">
                            <div className="text-center">
                                <motion.div
                                    className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-mocha-600 dark:text-terracotta-300 bg-beige-200 dark:bg-terracotta-900/30 rounded-full"
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <HiSparkles className="h-4 w-4" />
                                    Plateforme d'apprentissage moderne
                                </motion.div>
                                <motion.h1
                                    className="mb-6 text-4xl font-extrabold text-gray-900 dark:text-white md:text-6xl lg:text-7xl"
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    Bienvenue sur{' '}
                                    <span className="bg-gradient-to-r from-terracotta-500 to-mocha-600 bg-clip-text text-transparent">
                                        Biwai LMS
                                    </span>
                                </motion.h1>
                                <motion.p
                                    className="mx-auto text-lg font-medium text-gray-600 dark:text-gray-300 md:text-xl md:leading-relaxed lg:w-2/3"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.6 }}
                                >
                                    Plateforme d'apprentissage moderne pour former, évaluer et développer les compétences de vos équipes avec des outils puissants et intuitifs.
                                </motion.p>
                            </div>
                            {/* Key Stats */}
                            <motion.div
                                className="flex flex-wrap justify-center gap-8 mt-12"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                            >
                                <div className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold text-terracotta-600 dark:text-terracotta-400">500+</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1 font-medium">Cours disponibles</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold text-terracotta-600 dark:text-terracotta-400">10k+</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1 font-medium">Apprenants actifs</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold text-terracotta-600 dark:text-terracotta-400">95%</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1 font-medium">Taux de satisfaction</div>
                                </div>
                            </motion.div>
                            <motion.div
                                className="flex flex-wrap justify-center gap-4 pb-8 pt-10"
                                variants={containerVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                            >
                                <motion.div variants={itemVariants}>
                                    <Link
                                        href={route('home')}
                                        className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-terracotta-500 to-mocha-600 rounded-xl shadow-lg hover:shadow-xl hover:from-terracotta-600 hover:to-mocha-700 hover:scale-105 transition-all group"
                                    >
                                        <HiAcademicCap className="h-5 w-5" />
                                        <span>Commencer l'apprentissage</span>
                                        <HiArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </motion.div>
                                {!auth.user && (
                                    <motion.div variants={itemVariants}>
                                        <Link
                                            href={route('login')}
                                            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-terracotta-600 dark:text-white bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all border-2 border-terracotta-500 dark:border-terracotta-400"
                                        >
                                            <span>Se connecter</span>
                                        </Link>
                                    </motion.div>
                                )}
                            </motion.div>
                            <motion.div
                                className="relative mx-auto max-w-5xl -mb-12 rounded-2xl bg-white dark:bg-gray-800 p-3 shadow-2xl ring-1 ring-gray-200 dark:ring-gray-700 sm:-mb-24 lg:-mb-32"
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
                                    <img
                                        src="/welcomeslide.png"
                                        alt="Hero Image"
                                        className="w-full h-auto rounded-xl dark:hidden object-contain"
                                        onError={handleImageError}
                                    />
                                    <img
                                        src="/welcomeslidedark.png"
                                        alt="Hero Image"
                                        className="w-full h-auto rounded-xl hidden dark:block object-contain"
                                        onError={handleImageError}
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Benefits Section */}
                    <motion.div
                        className="bg-gray-50 dark:bg-gray-900 pt-2 sm:pt-2 lg:pt-2"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                    >
                        <div className="container mx-auto px-4 py-16">
                            <motion.div className="text-center mb-12" variants={fadeInUp}>
                                <span className="inline-block px-4 py-1.5 text-sm font-semibold text-terracotta-600 dark:text-terracotta-400 bg-beige-200 dark:bg-terracotta-900/30 rounded-full mb-4">
                                    Pourquoi nous choisir
                                </span>
                                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl mb-4">
                                    Les avantages de Biwai LMS
                                </h2>
                            </motion.div>
                            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={containerVariants}>
                                {[
                                    { icon: FaCheckCircle, title: "Formation flexible", desc: "Apprenez à votre rythme, n'importe où et n'importe quand" },
                                    { icon: FaCertificate, title: "Certificats reconnus", desc: "Obtenez des certifications valorisées sur le marché" },
                                    { icon: FaChartLine, title: "Suivi de progression", desc: "Visualisez vos progrès en temps réel avec des tableaux de bord" },
                                    { icon: FaTrophy, title: "Gamification", desc: "Gagnez des points et des badges en progressant" },
                                    { icon: FaUsers, title: "Apprentissage collaboratif", desc: "Échangez avec vos pairs et formateurs" },
                                    { icon: FaClock, title: "Accès illimité", desc: "Accédez à tous les contenus 24h/24 et 7j/7" }
                                ].map((benefit, idx) => (
                                    <motion.div
                                        key={idx}
                                        variants={scaleIn}
                                        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-all group"
                                    >
                                        <benefit.icon className="h-10 w-10 text-terracotta-600 dark:text-terracotta-400 mb-4 group-hover:scale-110 transition-transform" />
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{benefit.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm">{benefit.desc}</p>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Services Section */}
                    <motion.div
                        className="bg-white dark:bg-gray-800 py-16 lg:py-24"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <div className="container mx-auto space-y-16 px-4">
                            <div className="text-center">
                                <motion.span
                                    className="inline-block px-4 py-1.5 text-sm font-semibold text-terracotta-600 dark:text-terracotta-400 bg-beige-200 dark:bg-terracotta-900/30 rounded-full mb-4"
                                    variants={itemVariants}
                                >
                                    Nos Services
                                </motion.span>
                                <motion.h2
                                    className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl"
                                    variants={itemVariants}
                                >
                                    Tout ce dont vous avez besoin
                                </motion.h2>
                                <motion.p
                                    className="mx-auto text-lg font-medium text-gray-600 dark:text-gray-300 md:text-xl md:leading-relaxed lg:w-2/3"
                                    variants={itemVariants}
                                >
                                    Découvrez nos services dédiés à l'apprentissage.
                                </motion.p>
                            </div>
                            <motion.div
                                className="grid grid-cols-1 gap-8 md:grid-cols-3"
                                variants={containerVariants}
                            >
                                <motion.div
                                    className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl text-center hover:shadow-xl hover:-translate-y-2 transition-all group"
                                    variants={itemVariants}
                                >
                                    <div className="relative mb-8 inline-flex h-20 w-20 items-center justify-center">
                                        <div className="absolute inset-0 bg-gradient-to-br from-terracotta-500 to-mocha-600 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform" />
                                        <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
                                            <FaBookOpen className="h-10 w-10 text-terracotta-600 dark:text-terracotta-400" />
                                        </div>
                                    </div>
                                    <h4 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">Gestion des Cours</h4>
                                    <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                                        Plateforme complète pour créer, organiser et dispenser vos formations avec suivi personnalisé des apprenants.
                                    </p>
                                </motion.div>
                                <motion.div
                                    className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl text-center hover:shadow-xl hover:-translate-y-2 transition-all group"
                                    variants={itemVariants}
                                >
                                    <div className="relative mb-8 inline-flex h-20 w-20 items-center justify-center">
                                        <div className="absolute inset-0 bg-gradient-to-br from-terracotta-500 to-mocha-600 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform" />
                                        <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
                                            <FaVideo className="h-10 w-10 text-terracotta-600 dark:text-terracotta-400" />
                                        </div>
                                    </div>
                                    <h4 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">Ressources d'Apprentissage</h4>
                                    <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                                        Bibliothèque riche en contenus multimédias : vidéos HD, documents PDF, présentations interactives et plus encore.
                                    </p>
                                </motion.div>
                                <motion.div
                                    className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl text-center hover:shadow-xl hover:-translate-y-2 transition-all group"
                                    variants={itemVariants}
                                >
                                    <div className="relative mb-8 inline-flex h-20 w-20 items-center justify-center">
                                        <div className="absolute inset-0 bg-gradient-to-br from-terracotta-500 to-mocha-600 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform" />
                                        <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
                                            <FaQuestion className="h-10 w-10 text-terracotta-600 dark:text-terracotta-400" />
                                        </div>
                                    </div>
                                    <h4 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">Évaluations & Quiz</h4>
                                    <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                                        Évaluez les compétences acquises avec des quiz interactifs, QCM et examens en ligne avec résultats instantanés.
                                    </p>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* CTA Section */}
                    <motion.div
                        className="bg-gradient-to-r from-terracotta-50 to-beige-100 dark:from-gray-800 dark:to-gray-900 py-16"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <div className="container mx-auto px-4 text-center">
                            <motion.h2
                                className="text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl mb-4"
                                variants={fadeInUp}
                            >
                                Prêt à transformer votre apprentissage ?
                            </motion.h2>
                            <motion.p
                                className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
                                variants={fadeInUp}
                            >
                                Rejoignez des milliers d'apprenants qui développent leurs compétences avec Biwai LMS
                            </motion.p>
                            <motion.div variants={scaleIn}>
                                <Link
                                    href={route('home')}
                                    className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-terracotta-500 to-mocha-600 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                                >
                                    Commencer gratuitement
                                    <HiArrowRight className="h-5 w-5" />
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* How It Works Section */}
                    <motion.div
                        className="relative bg-gradient-to-br from-terracotta-500 to-mocha-600 overflow-hidden"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {/* Decorative Elements */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
                            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
                        </div>

                        <div className="container relative mx-auto space-y-16 px-4 py-20 lg:px-8 lg:py-28">
                            <div className="text-center">
                                <motion.span
                                    className="inline-block px-4 py-1.5 text-sm font-semibold text-mocha-600 bg-white rounded-full mb-4"
                                    variants={itemVariants}
                                >
                                    Comment ça marche
                                </motion.span>
                                <motion.h2
                                    className="text-3xl font-extrabold text-white md:text-4xl"
                                    variants={itemVariants}
                                >
                                    Trois étapes simples
                                </motion.h2>
                            </div>
                            <motion.div
                                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                                variants={containerVariants}
                            >
                                <motion.div className="relative group" variants={itemVariants}>
                                    <div className="absolute inset-0 bg-white/10 rounded-2xl transform group-hover:scale-105 group-hover:bg-white/20 transition-all" />
                                    <div className="relative p-8">
                                        <div className="flex items-center justify-center w-14 h-14 mb-6 text-2xl font-bold text-mocha-600 bg-white rounded-xl shadow-lg group-hover:shadow-2xl transition-shadow">
                                            1
                                        </div>
                                        <h4 className="mb-3 text-xl font-bold text-white">
                                            Se Connecter
                                        </h4>
                                        <p className="text-white/90">
                                            Créez votre compte ou connectez-vous en quelques secondes pour accéder à tous les contenus.
                                        </p>
                                    </div>
                                </motion.div>
                                <motion.div className="relative group" variants={itemVariants}>
                                    <div className="absolute inset-0 bg-white/10 rounded-2xl transform group-hover:scale-105 group-hover:bg-white/20 transition-all" />
                                    <div className="relative p-8">
                                        <div className="flex items-center justify-center w-14 h-14 mb-6 text-2xl font-bold text-mocha-600 bg-white rounded-xl shadow-lg group-hover:shadow-2xl transition-shadow">
                                            2
                                        </div>
                                        <h4 className="mb-3 text-xl font-bold text-white">
                                            Explorer les cours
                                        </h4>
                                        <p className="text-white/90">
                                            Découvrez notre catalogue de formations avec vidéos HD, supports PDF et contenus interactifs.
                                        </p>
                                    </div>
                                </motion.div>
                                <motion.div className="relative group sm:col-span-2 lg:col-span-1" variants={itemVariants}>
                                    <div className="absolute inset-0 bg-white/10 rounded-2xl transform group-hover:scale-105 group-hover:bg-white/20 transition-all" />
                                    <div className="relative p-8">
                                        <div className="flex items-center justify-center w-14 h-14 mb-6 text-2xl font-bold text-mocha-600 bg-white rounded-xl shadow-lg group-hover:shadow-2xl transition-shadow">
                                            3
                                        </div>
                                        <h4 className="mb-3 text-xl font-bold text-white">
                                            Évaluer & Progresser
                                        </h4>
                                        <p className="text-white/90">
                                            Validez vos acquis avec des quiz interactifs et suivez votre progression en temps réel.
                                        </p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Footer */}
                    <footer id="page-footer" className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                        <div className="container mx-auto flex flex-col gap-6 px-4 py-12 text-center md:flex-row md:justify-between md:gap-0 md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <div className="p-2 bg-gradient-to-br from-terracotta-500 to-mocha-600 rounded-lg">
                                    <img src="/logo/light.png" className="h-6 w-6" alt="Logo" />
                                </div>
                                <span className="font-bold text-gray-900 dark:text-white">Biwai LEARN</span>
                            </div>
                            <nav className="flex items-center justify-center gap-6 text-sm">
                                <a href="#" className="font-medium text-gray-600 dark:text-gray-400 hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors">
                                    À propos
                                </a>
                                <a href="#" className="font-medium text-gray-600 dark:text-gray-400 hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors">
                                    Conditions
                                </a>
                                <a href="#" className="font-medium text-gray-600 dark:text-gray-400 hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors">
                                    Confidentialité
                                </a>
                            </nav>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                © {new Date().getFullYear()} <span className="font-semibold">BIWAI</span>. Tous droits réservés.
                            </div>
                        </div>
                    </footer>
                </main>
            </div>
        </>
    );
}
