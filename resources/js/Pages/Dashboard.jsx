import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    HiUsers,
    HiUserGroup,
    HiAcademicCap,
    HiBookOpen,
    HiClipboardDocumentCheck,
    HiTrophy,
    HiChartBar,
    HiSparkles
} from 'react-icons/hi2';
import Card from '@/Components/Card';
import Badge from '@/Components/Badge';

export default function Dashboard({
    totalusers,
    useractif,
    programmes,
    lessons,
    tentatives,
    pointsemis,
    totalpoints,
    lasttentatives,
    classementbyuser
}) {
    const stats = [
        {
            title: "Utilisateurs",
            value: totalusers,
            icon: HiUsers,
            bgColor: "bg-blue-500",
            lightBg: "bg-blue-100 dark:bg-blue-900/30"
        },
        {
            title: "Actifs",
            value: useractif,
            icon: HiUserGroup,
            bgColor: "bg-green-500",
            lightBg: "bg-green-100 dark:bg-green-900/30"
        },
        {
            title: "Programmes",
            value: programmes,
            icon: HiAcademicCap,
            bgColor: "bg-purple-500",
            lightBg: "bg-purple-100 dark:bg-purple-900/30"
        },
        {
            title: "Leçons",
            value: lessons,
            icon: HiBookOpen,
            bgColor: "bg-orange-500",
            lightBg: "bg-orange-100 dark:bg-orange-900/30"
        },
        {
            title: "Tentatives",
            value: tentatives,
            icon: HiClipboardDocumentCheck,
            bgColor: "bg-terracotta-600",
            lightBg: "bg-beige-200 dark:bg-terracotta-900/30"
        },
        {
            title: "Points",
            value: `${pointsemis}/${totalpoints}`,
            icon: HiTrophy,
            bgColor: "bg-amber-500",
            lightBg: "bg-amber-100 dark:bg-amber-900/30"
        }
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-terracotta-500 to-mocha-600 rounded-xl shadow-lg">
                        <HiChartBar className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Tableau de Bord
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Vue d'ensemble de la plateforme
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Tableau de Bord" />

            <div className="space-y-6">
                {/* Statistics Grid */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <Card hover={false} className="relative overflow-hidden">
                                    <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bgColor} opacity-10 rounded-full -translate-y-8 translate-x-8`} />
                                    <Card.Body className="relative">
                                        <div className={`inline-flex p-2.5 rounded-xl ${stat.lightBg} mb-3`}>
                                            <Icon className={`h-5 w-5 ${stat.bgColor.replace('bg-', 'text-')}`} />
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {stat.value}
                                        </p>
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
                                            {stat.title}
                                        </p>
                                    </Card.Body>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Recent Activity Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top 10 Leaderboard */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                    >
                        <Card hover={false} gradient>
                            <Card.Header>
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl shadow-lg">
                                        <HiTrophy className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                            Classement
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Top 10 des meilleurs scores
                                        </p>
                                    </div>
                                </div>
                            </Card.Header>
                            <Card.Body className="p-0">
                                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {classementbyuser?.slice(0, 10).map((user, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm ${
                                                    index === 0
                                                        ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-md'
                                                        : index === 1
                                                        ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
                                                        : index === 2
                                                        ? 'bg-gradient-to-br from-orange-400 to-amber-500 text-white'
                                                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                                }`}>
                                                    {index + 1}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-terracotta-500 to-mocha-600 flex items-center justify-center text-white text-sm font-semibold">
                                                        {user.user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {user.user.name}
                                                    </span>
                                                </div>
                                            </div>
                                            <Badge variant="brand" size="sm">
                                                <HiSparkles className="h-3 w-3 mr-1" />
                                                {user.total_score} pts
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </Card.Body>
                        </Card>
                    </motion.div>

                    {/* Recent Attempts */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                    >
                        <Card hover={false} gradient>
                            <Card.Header>
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                        <HiClipboardDocumentCheck className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                            Activité Récente
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Dernières tentatives de quiz
                                        </p>
                                    </div>
                                </div>
                            </Card.Header>
                            <Card.Body className="p-0">
                                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {lasttentatives?.slice(0, 5).map((attempt, index) => (
                                        <div
                                            key={index}
                                            className="px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-terracotta-500 to-mocha-600 flex items-center justify-center text-white text-sm font-semibold">
                                                        {attempt.user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">
                                                            {attempt.user.name}
                                                        </p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                                                            {attempt.quizze?.instructions || 'Quiz'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge
                                                    variant={attempt.score >= 70 ? 'success' : attempt.score >= 50 ? 'warning' : 'danger'}
                                                    size="sm"
                                                >
                                                    {attempt.score} pts
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 ml-12">
                                                <span className="flex items-center gap-1">
                                                    ⏱️ {new Intl.DateTimeFormat('fr-FR', {
                                                        minute: '2-digit',
                                                        second: '2-digit'
                                                    }).format(new Date(attempt.completed_at * 1000))}
                                                </span>
                                                <span>
                                                    {new Intl.DateTimeFormat('fr-FR', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    }).format(new Date(attempt.created_at))}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card.Body>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
