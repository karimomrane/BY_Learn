import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { FaUsers, FaUserCheck, FaBook, FaChalkboardTeacher, FaClipboardList, FaMedal, FaStar } from 'react-icons/fa';

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
    console.log(lasttentatives);

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Tableau de Bord</h2>}
        >
            <Head title="Tableau de Bord" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* First Group of Cards */}
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            {
                                title: "Utilisateurs Totaux",
                                value: totalusers,
                                icon: <FaUsers className="text-blue-500 text-3xl" />,
                            },
                            {
                                title: "Utilisateurs Actifs",
                                value: useractif,
                                icon: <FaUserCheck className="text-green-500 text-3xl" />,
                            },
                            {
                                title: "Programmes",
                                value: programmes,
                                icon: <FaBook className="text-purple-500 text-3xl" />,
                            },
                            {
                                title: "Leçons",
                                value: lessons,
                                icon: <FaChalkboardTeacher className="text-orange-500 text-3xl" />,
                            },
                        ].map((card, index) => (
                            <motion.div
                                key={index}
                                className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 flex items-center space-x-4"
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                            >
                                {card.icon}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                        {card.title}
                                    </h3>
                                    <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        {card.value}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Second Group: Tentatives and Points Obtenus */}
                    <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2">
                        <motion.div
                            className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 flex items-center space-x-4"
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ duration: 0.5, delay: 0.8 }}
                        >
                            <FaClipboardList className="text-red-500 text-3xl" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                    Tentatives
                                </h3>
                                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {tentatives}
                                </p>
                            </div>
                        </motion.div>
                        <motion.div
                            className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 flex items-center space-x-4"
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ duration: 0.5, delay: 1 }}
                        >
                            <FaMedal className="text-yellow-500 text-3xl" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                    Points Obtenus
                                </h3>
                                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {pointsemis}
                                </p>
                            </div>
                        </motion.div>
                    </div>


                    {/* Classement des Utilisateurs */}
                    <div className="mt-6">
                        <motion.div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800" variants={cardVariants} initial="hidden" animate="visible" transition={{ duration: 0.5, delay: 1.4 }}>
                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Classement des Utilisateurs par Score</h3>
                            <div className="mt-4 overflow-x-auto">
                                <table className="w-full table-auto border-gray-300 dark:border-gray-600">
                                    <thead>
                                        <tr className="bg-gray-100 dark:bg-gray-700">
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {classementbyuser?.map((user, index) => (
                                            <tr key={index} className="border-gray-300 dark:border-gray-600">
                                                <td className="px-6 py-3 text-gray-900 dark:text-gray-100 flex items-center">
                                                    {index === 0 && <FaStar className="text-yellow-500 text-xl mr-2" />}
                                                    {user.user.name}
                                                </td>
                                                <td className="px-6 py-3 text-gray-900 dark:text-gray-100">{user.total_score}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    </div>


                    {/* Dernières Tentatives */}
                    <div className="mt-6">
                        <motion.div
                            className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ duration: 0.5, delay: 1.2 }}
                        >
                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                Dernières Tentatives
                            </h3>

                            {/* Desktop Table View */}
                            <div className="hidden sm:block mt-4">
                                <div className="overflow-x-auto">
                                    <table className="w-full table-auto border-gray-300 dark:border-gray-600">
                                        <thead>
                                            <tr className="bg-gray-100 dark:bg-gray-700">
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Utilisateur
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Quize
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Score
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Durée
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Date
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {lasttentatives?.map((attempt, index) => (
                                                <tr key={index} className="border-gray-300 dark:border-gray-600">
                                                    <td className="px-6 py-3 text-gray-900 dark:text-gray-100">
                                                        {attempt.user.name}
                                                    </td>
                                                    <td className="px-6 py-3 text-gray-900 dark:text-gray-100">
                                                        {attempt.quizze?.instructions}
                                                    </td>
                                                    <td className="px-6 py-3 text-gray-900 dark:text-gray-100">
                                                        {attempt.score}
                                                    </td>
                                                    <td className="px-6 py-3 text-gray-900 dark:text-gray-100">
                                                        {new Intl.DateTimeFormat('fr-FR', {
                                                            minute: '2-digit',
                                                            second: '2-digit'
                                                        }).format(new Date(attempt.completed_at * 1000))}
                                                    </td>
                                                    <td className="px-6 py-3 text-gray-900 dark:text-gray-100">
                                                        {new Intl.DateTimeFormat('fr-FR', {
                                                            year: 'numeric',
                                                            month: '2-digit',
                                                            day: '2-digit',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        }).format(new Date(attempt.created_at))}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Mobile Card View */}
                            <div className="sm:hidden mt-4 space-y-4">
                                {lasttentatives?.map((attempt, index) => (
                                    <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            <strong>Utilisateur:</strong> {attempt.user.name}
                                        </p>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            <strong>Quize:</strong> {attempt.quizze?.instructions}
                                        </p>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            <strong>Score:</strong> {attempt.score}
                                        </p>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            <strong>Durée:</strong>{' '}
                                            {new Intl.DateTimeFormat('fr-FR', {
                                                minute: '2-digit',
                                                second: '2-digit'
                                            }).format(new Date(attempt.completed_at * 1000))}
                                        </p>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            <strong>Date:</strong>{' '}
                                            {new Intl.DateTimeFormat('fr-FR', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }).format(new Date(attempt.created_at))}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>



                </div>
            </div>
        </AuthenticatedLayout>
    );
}
