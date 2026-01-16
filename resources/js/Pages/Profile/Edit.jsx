import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { HiUser, HiLockClosed, HiTrash } from 'react-icons/hi2';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import Card from '@/Components/Card';

export default function Edit({ mustVerifyEmail, status }) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Paramètres du Profil
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Gérez vos informations personnelles et la sécurité de votre compte
                    </p>
                </div>
            }
        >
            <Head title="Profil" />

            <motion.div
                className="space-y-6"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.div variants={itemVariants}>
                    <Card hover={false} gradient>
                        <Card.Header>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <HiUser className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Informations du Profil
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Mettez à jour vos informations personnelles
                                    </p>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-xl"
                            />
                        </Card.Body>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card hover={false} gradient>
                        <Card.Header>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                    <HiLockClosed className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Mot de Passe
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Assurez-vous d'utiliser un mot de passe sécurisé
                                    </p>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <UpdatePasswordForm className="max-w-xl" />
                        </Card.Body>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card hover={false} className="border-terracotta-200 dark:border-terracotta-900/50">
                        <Card.Header className="bg-beige-200 dark:bg-terracotta-900/20">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-beige-200 dark:bg-terracotta-900/30 rounded-lg">
                                    <HiTrash className="h-5 w-5 text-terracotta-600 dark:text-terracotta-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Zone Dangereuse
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Supprimer définitivement votre compte
                                    </p>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <DeleteUserForm className="max-w-xl" />
                        </Card.Body>
                    </Card>
                </motion.div>
            </motion.div>
        </AuthenticatedLayout>
    );
}
