import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import {
    HiAcademicCap,
    HiArrowRight,
    HiClock,
    HiCalendar,
    HiSparkles,
    HiRocketLaunch,
    HiTrophy,
    HiBookOpen,
    HiChartBar,
    HiUsers,
    HiFire,
    HiStar,
    HiCheckBadge,
    HiLightBulb,
    HiChevronLeft,
    HiChevronRight
} from 'react-icons/hi2';
import SearchInput from '@/Components/SearchInput';
import EmptyState from '@/Components/EmptyState';
import Badge from '@/Components/Badge';
import Card from '@/Components/Card';
import Button from '@/Components/Button';

dayjs.extend(duration);
export default function Home({ programs, stats = {} }) {
    const { auth } = usePage().props;
    const [searchQuery, setSearchQuery] = useState('');
    const [imageLoaded, setImageLoaded] = useState({});
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const scrollRef = useRef(null);

    const filteredPrograms = programs.filter((program) =>
        program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const calculateDuration = (start, end) => {
        const startTime = dayjs(start);
        const endTime = dayjs(end);
        const diff = dayjs.duration(endTime.diff(startTime));

        return `${diff.days()}j ${diff.hours()}h ${diff.minutes()}m`;
    };

    // Auto-rotate banners
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const banners = [
        {
            title: "Bienvenue "+( auth.user.name || 'à notre plateforme d\'apprentissage' ),
            subtitle: `Découvrez une nouvelle façon d'apprendre, à votre rythme et selon vos besoins.`,
            icon: HiSparkles,
            gradient: "from-gray-900 via-transparent to-gray-900",
            imageMobile: "/slides/s4.png",
            imageDesktop: "/slides/ss4.png",
            action: "Explorer",
            actionIcon: HiRocketLaunch
        },
        {
            title: "Gagnez des certificats et des récompenses",
            subtitle: `Progressez dans vos programmes et obtenez des certificats reconnus.`,
            icon: HiTrophy,
            gradient: "from-gray-900 via-transparent to-gray-900",
            imageMobile: "/slides/s5.png",
            imageDesktop: "/slides/ss5.png",
            action: "Commencer",
            actionIcon: HiArrowRight
        },
        {
            title: "Des cours interactifs et innovants",
            subtitle: "Apprenez avec des vidéos, quiz et une communauté active.",
            icon: HiLightBulb,
            gradient: "from-gray-900 via-transparent to-gray-900",
            imageMobile: "/slides/s6.png",
            imageDesktop: "/slides/ss6.png",
            action: "Découvrir",
            actionIcon: HiBookOpen
        }
    ];

    const quickStats = [
        {
            label: "Programmes",
            value: programs.length,
            icon: HiAcademicCap,
            color: "from-terracotta-500 to-mocha-500",
            bgColor: "bg-beige-200 dark:bg-terracotta-900/30"
        },
        {
            label: "En cours",
            value: stats.inProgress || 0,
            icon: HiFire,
            color: "from-orange-500 to-amber-500",
            bgColor: "bg-orange-100 dark:bg-orange-900/30"
        },
        {
            label: "Terminés",
            value: stats.completed || 0,
            icon: HiCheckBadge,
            color: "from-green-500 to-emerald-500",
            bgColor: "bg-green-100 dark:bg-green-900/30"
        },
        {
            label: "Points",
            value: stats.points || 0,
            icon: HiTrophy,
            color: "from-yellow-500 to-orange-500",
            bgColor: "bg-yellow-100 dark:bg-yellow-900/30"
        }
    ];

    const features = [
        {
            icon: HiBookOpen,
            title: "Cours Interactifs",
            description: "Des leçons engageantes avec vidéos et quiz",
            color: "text-blue-600 dark:text-blue-400"
        },
        {
            icon: HiChartBar,
            title: "Suivi de Progression",
            description: "Suivez vos progrès en temps réel",
            color: "text-green-600 dark:text-green-400"
        },
        {
            icon: HiTrophy,
            title: "Certification",
            description: "Obtenez des certificats validés",
            color: "text-yellow-600 dark:text-yellow-400"
        },
        {
            icon: HiUsers,
            title: "Communauté",
            description: "Apprenez avec d'autres apprenants",
            color: "text-purple-600 dark:text-purple-400"
        }
    ];

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: 'Accueil', href: route('home') }
            ]}
            header={
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-terracotta-500 to-mocha-600 rounded-xl shadow-lg">
                        <HiAcademicCap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Accueil
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Votre portail d'apprentissage
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Accueil" />

            <div className="space-y-6">
                {/* Hero Banner Carousel */}
                <div className="relative overflow-hidden rounded-2xl shadow-2xl h-[400px] sm:h-[450px] lg:h-[500px]">
                    <AnimatePresence initial={false}>
                        <motion.div
                            key={currentBannerIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{
                                duration: 1,
                                ease: "easeInOut"
                            }}
                            className="absolute inset-0 overflow-hidden"
                        >
                            {/* Background Image - Responsive */}
                            <div className="absolute inset-0">
                                {/* Desktop Image */}
                                <div
                                    className="hidden sm:block absolute inset-0 bg-cover  bg-no-repeat"
                                    style={{ backgroundImage: `url(${banners[currentBannerIndex].imageDesktop})` }}
                                />
                                {/* Mobile Image */}
                                <div
                                    className="block sm:hidden absolute inset-0 bg-cover bg-center bg-no-repeat"
                                    style={{ backgroundImage: `url(${banners[currentBannerIndex].imageMobile})` }}
                                />
                            </div>

                            {/* Gradient Overlay for text readability */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${banners[currentBannerIndex].gradient} opacity-0`} />

                            {/* Additional dark overlay from bottom */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

                            {/* Nouveau Badge - Fixed Top Left */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15, duration: 0.5 }}
                                className="absolute top-6 left-6 inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full z-10"
                            >
                                {(() => {
                                    const Icon = banners[currentBannerIndex].icon;
                                    return <Icon className="h-5 w-5 text-white" />;
                                })()}
                                <span className="text-sm font-medium text-white">
                                    Nouveau
                                </span>
                            </motion.div>

                            <div className="relative h-full flex flex-col justify-end px-6 sm:px-12 pb-20">
                                <div className="max-w-4xl">

                                    <motion.h1
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
                                        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
                                    >
                                        {banners[currentBannerIndex].title}
                                    </motion.h1>

                                    <motion.p
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
                                        className="text-lg sm:text-xl text-white/90 mb-8"
                                    >
                                        {banners[currentBannerIndex].subtitle}
                                    </motion.p>

                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.45, duration: 0.6, ease: "easeOut" }}
                                    >
                                        <button
                                            onClick={() => document.getElementById('programs-section')?.scrollIntoView({ behavior: 'smooth' })}
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-200"
                                        >
                                            {banners[currentBannerIndex].action}
                                            {(() => {
                                                const ActionIcon = banners[currentBannerIndex].actionIcon;
                                                return <ActionIcon className="h-5 w-5" />;
                                            })()}
                                        </button>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Banner Navigation Dots - Fixed Bottom Right */}
                                <div className="absolute bottom-6 right-6 flex gap-2">
                                    {banners.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentBannerIndex(index)}
                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                index === currentBannerIndex
                                                    ? 'w-8 bg-white'
                                                    : 'bg-white/50 hover:bg-white/75'
                                            }`}
                                        />
                                    ))}
                                </div>

                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickStats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="hover:shadow-lg transition-shadow duration-300">
                                    <Card.Body className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                                <Icon className={`h-6 w-6 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent' }} />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {stat.value}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {stat.label}
                                                </p>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>



                {/* Search Section */}
                <div id="programs-section" className="scroll-mt-20">
                    <Card>
                        <Card.Body className="p-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                                        <HiAcademicCap className="h-6 w-6 mr-2 text-terracotta-500" />
                                        Programmes Disponibles
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        {filteredPrograms.length} programme{filteredPrograms.length !== 1 ? 's' : ''} trouvé{filteredPrograms.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                                <div className="w-full sm:w-96">
                                    <SearchInput
                                        value={searchQuery}
                                        onChange={setSearchQuery}
                                        placeholder="Rechercher un programme..."
                                    />
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </div>

                {/* Program Cards Grid */}
                {filteredPrograms.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredPrograms.map(({ id, title, description, image_path, date_debut, date_fin, controle }, index) => (
                            <motion.div
                                key={id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <Card className="h-full hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-1">
                                    {/* Image Section */}
                                    <div className="relative h-48 bg-gradient-to-br from-red-100 to-orange-100 dark:from-gray-700 dark:to-gray-600 overflow-hidden">
                                        {!imageLoaded[id] && (
                                            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                                        )}
                                        {image_path ? (
                                            <motion.img
                                                src={`/storage/${image_path}`}
                                                alt={title}
                                                className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${imageLoaded[id] ? 'opacity-100' : 'opacity-0'}`}
                                                onLoad={() => setImageLoaded((prev) => ({ ...prev, [id]: true }))}
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <HiAcademicCap className="h-20 w-20 text-terracotta-300 dark:text-gray-500" />
                                            </div>
                                        )}

                                        {/* Session Badge */}
                                        <div className="absolute top-3 left-3">
                                            <Badge
                                                variant={controle ? 'warning' : 'primary'}
                                            >
                                                {controle ? 'Contrôle' : 'Principale'}
                                            </Badge>
                                        </div>

                                        {/* Overlay on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>

                                    <Card.Body className="p-5">
                                        {/* Title */}
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-terracotta-600 dark:group-hover:text-terracotta-400 transition-colors">
                                            {title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 min-h-[4.5rem]">
                                            {description}
                                        </p>

                                        {/* Info Grid */}
                                        <div className="space-y-2 mb-4">
                                            {/* Duration */}
                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                <div className="flex items-center gap-2 flex-1">
                                                    <div className="p-1.5 bg-beige-200 dark:bg-terracotta-900/30 rounded-lg">
                                                        <HiClock className="h-3.5 w-3.5 text-terracotta-600 dark:text-terracotta-400" />
                                                    </div>
                                                    <span className="text-xs font-medium">{calculateDuration(date_debut, date_fin)}</span>
                                                </div>
                                            </div>

                                            {/* Dates */}
                                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                                                <div className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg mr-2">
                                                    <HiCalendar className="h-3 w-3" />
                                                </div>
                                                <span>{new Date(date_debut).toLocaleDateString('fr-FR')} - {new Date(date_fin).toLocaleDateString('fr-FR')}</span>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <Link
                                            href={route("programs.show", id)}
                                            className="flex items-center justify-center w-full px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-terracotta-500 to-mocha-600 hover:from-terracotta-600 hover:to-mocha-700 rounded-xl shadow-md hover:shadow-xl hover:shadow-terracotta-600/30 transition-all duration-200 group/btn"
                                        >
                                            Commencer le programme
                                            <HiArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    </Card.Body>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <Card className="shadow-xl">
                        <EmptyState
                            icon={HiAcademicCap}
                            title="Aucun programme trouvé"
                            description={searchQuery ? "Aucun programme ne correspond à votre recherche. Essayez avec d'autres mots-clés." : "Aucun programme n'est actuellement disponible pour vous."}
                        />
                    </Card>
                )}

                {/* Call to Action Section */}
                {programs.length > 0 && (
                    <Card className="bg-gradient-to-r from-terracotta-500 to-mocha-600 border-0 shadow-2xl">
                        <Card.Body className="p-8 sm:p-12">
                            <div className="text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    transition={{ type: "spring" }}
                                    className="inline-flex p-4 bg-white/20 rounded-full mb-4"
                                >
                                    <HiRocketLaunch className="h-12 w-12 text-white" />
                                </motion.div>
                                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                                    Prêt à commencer votre apprentissage ?
                                </h3>
                                <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                                    Rejoignez des milliers d'apprenants et développez vos compétences dès aujourd'hui
                                </p>
                                <div className="flex flex-wrap gap-4 justify-center">
                                    <button
                                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                        className="px-8 py-4 bg-white text-terracotta-600 font-bold rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-200"
                                    >
                                        Explorer les programmes
                                    </button>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
