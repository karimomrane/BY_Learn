import { useState } from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
    HiPlus,
    HiPencil,
    HiTrash,
    HiEye,
    HiQuestionMarkCircle,
    HiListBullet
} from 'react-icons/hi2';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Button from '@/Components/Button';
import Card from '@/Components/Card';
import EmptyState from '@/Components/EmptyState';
import ConfirmDialog from '@/Components/ConfirmDialog';
import FlashMessage from '@/Components/FlashMessage';
import Badge from '@/Components/Badge';
import Table from '@/Components/Table';

export default function Index() {
    const { quizze, questions, success, lesson, programme } = usePage().props;
    const { delete: destroy } = useForm();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [questionToDelete, setQuestionToDelete] = useState(null);

    const handleDelete = (questionId) => {
        setQuestionToDelete(questionId);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (questionToDelete) {
            destroy(route("questions.destroy", [quizze.id, questionToDelete]));
            setQuestionToDelete(null);
        }
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: 'Programmes', href: route('programmes.index') },
                { label: programme?.title || 'Programme', href: route('lessons.index', lesson?.programme_id) },
                { label: lesson?.title || 'Leçon', href: route('Quizzezes.index', lesson?.id) },
                { label: 'Questions', href: '#' }
            ]}
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Questions du Quiz
                        </h2>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {questions.length} question{questions.length !== 1 ? 's' : ''} • {quizze.instructions || 'Sans instructions'}
                        </p>
                    </div>
                    <Link href={route("questions.create", quizze.id)}>
                        <Button variant="primary">
                            <HiPlus className="h-5 w-5 mr-2" />
                            Nouvelle Question
                        </Button>
                    </Link>
                </div>
            }
        >
            <div className="space-y-6">
                {success && <FlashMessage type="success" message={success} />}

                {questions.length === 0 ? (
                    <Card>
                        <EmptyState
                            icon={HiQuestionMarkCircle}
                            title="Aucune question"
                            description="Ce quiz n'a pas encore de questions. Commencez par créer la première question."
                            action={() => window.location.href = route("questions.create", quizze.id)}
                            actionLabel="Créer une Question"
                        />
                    </Card>
                ) : (
                    <Card>
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell className="w-24">#</Table.HeaderCell>
                                    <Table.HeaderCell>Question</Table.HeaderCell>
                                    <Table.HeaderCell align="right" className="w-80">Actions</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {questions.map((question, index) => (
                                    <motion.tr
                                        key={question.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2, delay: index * 0.05 }}
                                        className="group hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
                                    >
                                        <Table.Cell>
                                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-terracotta-500 to-mocha-500 text-white font-bold text-base shadow-md">
                                                {index + 1}
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="flex items-start py-1">
                                                <HiQuestionMarkCircle className="h-6 w-6 text-terracotta-500 dark:text-terracotta-400 mt-0.5 mr-3 flex-shrink-0" />
                                                <p className="text-base text-gray-900 dark:text-white leading-relaxed">
                                                    {question.question_text}
                                                </p>
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell align="right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={route("answers.index", question.id)}>
                                                    <Button variant="primary" size="sm">
                                                        <HiListBullet className="h-4 w-4 mr-1.5" />
                                                        Réponses
                                                    </Button>
                                                </Link>
                                                <Link href={route("questions.edit", [quizze.id, question.id])}>
                                                    <Button variant="secondary" size="sm">
                                                        <HiPencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(question.id)}
                                                >
                                                    <HiTrash className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </Table.Cell>
                                    </motion.tr>
                                ))}
                            </Table.Body>
                        </Table>
                    </Card>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                show={showDeleteConfirm}
                title="Supprimer la question"
                message="Êtes-vous sûr de vouloir supprimer cette question ? Toutes les réponses associées seront également supprimées."
                confirmText="Supprimer"
                cancelText="Annuler"
                type="danger"
                onConfirm={confirmDelete}
                onCancel={() => {
                    setShowDeleteConfirm(false);
                    setQuestionToDelete(null);
                }}
            />
        </AuthenticatedLayout>
    );
}
