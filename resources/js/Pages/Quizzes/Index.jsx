import { useState } from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import { motion } from 'framer-motion';
import {
    HiPlus,
    HiPencil,
    HiTrash,
    HiEye,
    HiClipboardDocumentList,
    HiCheckCircle
} from 'react-icons/hi2';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Button from '@/Components/Button';
import Card from '@/Components/Card';
import EmptyState from '@/Components/EmptyState';
import ConfirmDialog from '@/Components/ConfirmDialog';
import FlashMessage from '@/Components/FlashMessage';
import Badge from '@/Components/Badge';

export default function Index() {
    const { lesson, quizze, success, programme } = usePage().props;
    const { delete: destroy } = useForm();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleDelete = () => {
        destroy(route('Quizzezes.destroy', [lesson.id, quizze.id]));
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: 'Programmes', href: route('programmes.index') },
                { label: programme?.title || 'Programme', href: route('lessons.index', lesson.programme_id) },
                { label: lesson.title, href: '#' }
            ]}
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Quiz - {lesson.title}
                        </h2>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {quizze ? 'Un quiz est configuré pour cette leçon' : 'Aucun quiz configuré'}
                        </p>
                    </div>
                    {!quizze && (
                        <Link href={route("Quizzezes.create", lesson.id)}>
                            <Button variant="primary">
                                <HiPlus className="h-5 w-5 mr-2" />
                                Créer un Quiz
                            </Button>
                        </Link>
                    )}
                </div>
            }
        >
            <div className="space-y-6">
                {success && <FlashMessage type="success" message={success} />}

                {quizze ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card>
                            <Card.Body>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                            <HiClipboardDocumentList className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {quizze.title || "Quiz"}
                                            </h3>
                                            <Badge variant="success" icon={HiCheckCircle}>
                                                Quiz actif
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Instructions */}
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
                                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Instructions
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {quizze.instructions || "Aucune instruction spécifique pour ce quiz."}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-wrap gap-3">
                                    <Link href={route("questions.index", quizze.id)} className="flex-1 sm:flex-initial">
                                        <Button variant="primary" className="w-full">
                                            <HiEye className="h-4 w-4 mr-2" />
                                            Gérer les Questions
                                        </Button>
                                    </Link>
                                    <Link href={route("Quizzezes.edit", [lesson.id, quizze.id])}>
                                        <Button variant="secondary">
                                            <HiPencil className="h-4 w-4 mr-2" />
                                            Modifier
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="danger"
                                        onClick={() => setShowDeleteConfirm(true)}
                                    >
                                        <HiTrash className="h-4 w-4 mr-2" />
                                        Supprimer
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </motion.div>
                ) : (
                    <Card>
                        <EmptyState
                            icon={HiClipboardDocumentList}
                            title="Aucun quiz configuré"
                            description="Cette leçon n'a pas encore de quiz. Créez-en un pour permettre aux étudiants de tester leurs connaissances."
                            action={() => window.location.href = route("Quizzezes.create", lesson.id)}
                            actionLabel="Créer le Quiz"
                        />
                    </Card>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                show={showDeleteConfirm}
                title="Supprimer le quiz"
                message="Êtes-vous sûr de vouloir supprimer ce quiz ? Cette action supprimera également toutes les questions et réponses associées."
                confirmText="Supprimer"
                cancelText="Annuler"
                type="danger"
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </AuthenticatedLayout>
    );
}
