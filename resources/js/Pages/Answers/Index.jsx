import React, { useState } from "react";
import { useForm, usePage, Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { HiPlus, HiPencil, HiTrash, HiCheckCircle, HiXCircle, HiArrowLeft } from 'react-icons/hi2';
import { Switch } from '@headlessui/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Button from '@/Components/Button';
import Card from '@/Components/Card';
import Badge from '@/Components/Badge';
import Table from '@/Components/Table';
import EmptyState from '@/Components/EmptyState';
import '../styles.css';

export default function Index() {
    const { question, answers } = usePage().props;
    const [deleteConfirmation, setDeleteConfirmation] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    const { delete: destroy } = useForm();

    // Create form state
    const {
        data: createData,
        setData: setCreateData,
        post,
        processing: createProcessing,
        errors: createErrors,
    } = useForm({
        answer_text: "",
        is_correct: false,
    });

    // Edit form state
    const {
        data: editData,
        setData: setEditData,
        put,
        processing: editProcessing,
        errors: editErrors,
    } = useForm({
        answer_text: "",
        answer_id: null,
        is_correct: false,
    });

    // Variants for animated table rows
    const rowVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
    };

    // Handle create answer
    const handleCreate = (e) => {
        e.preventDefault();
        post(route("answers.store", question.id));
    };

    // Handle edit answer
    const handleEdit = (e, answerId) => {
        e.preventDefault();
        put(route("answers.update", [question.id, answerId]));
        setIsModalOpen(false);
    };

    // Handle delete answer
    const handleDelete = (answerId) => {
        if (deleteConfirmation === answerId) {
            destroy(route("answers.destroy", [question.id, answerId]), {
                preserveScroll: true,
                onSuccess: () => setDeleteConfirmation(null),
                onError: (error) => console.error("Error deleting answer", error),
            });
        } else {
            setDeleteConfirmation(answerId);
        }
    };

    const handleOpenModal = (answer) => {
        setSelectedAnswer(answer);
        setEditData({
            answer_text: answer.answer_text,
            answer_id: answer.id,
            is_correct: answer.is_correct,
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: 'Questions', href: '#' },
                { label: question.question_text.substring(0, 50) + '...', href: '#' },
                { label: 'Réponses', href: '#' }
            ]}
            header={
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Gestion des Réponses
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Question: {question.question_text}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {answers.length} réponse{answers.length !== 1 ? 's' : ''} disponible{answers.length !== 1 ? 's' : ''}
                    </p>
                </div>
            }
        >
            <div className="space-y-6">
                {/* Create Answer Form */}
                <Card gradient>
                    <div className="bg-gradient-to-r from-terracotta-500 to-mocha-500 p-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                            <HiPlus className="h-6 w-6 mr-2" />
                            Nouvelle Réponse
                        </h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    name="answer_text"
                                    value={createData.answer_text}
                                    onChange={(e) =>
                                        setCreateData("answer_text", e.target.value)
                                    }
                                    className="w-full px-4 py-3 border-0 rounded-lg shadow-sm focus:ring-2 focus:ring-white/50 dark:bg-gray-700 dark:text-gray-200"
                                    placeholder="Entrez le texte de la réponse"
                                />
                                {createErrors.answer_text && (
                                    <div className="text-white bg-terracotta-800/50 rounded px-3 py-1 text-sm mt-2">
                                        {createErrors.answer_text}
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center justify-between bg-white/10 rounded-lg px-4 py-3">
                                <span className="text-white font-medium">
                                    Marquer comme correcte
                                </span>
                                <Switch
                                    checked={createData.is_correct}
                                    onChange={(checked) => setCreateData("is_correct", checked)}
                                    className={`${
                                        createData.is_correct ? 'bg-white' : 'bg-white/30'
                                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/50`}
                                >
                                    <span
                                        className={`${
                                            createData.is_correct ? 'translate-x-6 bg-terracotta-500' : 'translate-x-1 bg-gray-400'
                                        } inline-block h-4 w-4 transform rounded-full transition-transform`}
                                    />
                                </Switch>
                            </div>
                            <Button
                                type="submit"
                                disabled={createProcessing}
                                className="w-full bg-white hover:bg-gray-100 text-terracotta-600 font-semibold py-3 shadow-lg"
                            >
                                {createProcessing ? "Création..." : "Créer la Réponse"}
                            </Button>
                        </form>
                    </div>
                </Card>

                {/* Answer List */}
                {answers.length === 0 ? (
                    <Card>
                        <EmptyState
                            icon={HiCheckCircle}
                            title="Aucune réponse"
                            description="Cette question n'a pas encore de réponses. Créez la première réponse ci-dessus."
                        />
                    </Card>
                ) : (
                    <Card>
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell className="w-16">#</Table.HeaderCell>
                                    <Table.HeaderCell>Réponse</Table.HeaderCell>
                                    <Table.HeaderCell className="w-32" align="center">Statut</Table.HeaderCell>
                                    <Table.HeaderCell className="w-48" align="right">Actions</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {answers.map((answer, index) => (
                                    <motion.tr
                                        key={answer.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2, delay: index * 0.05 }}
                                        className="group hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
                                    >
                                        <Table.Cell>
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-terracotta-500 to-mocha-500 text-white font-bold text-sm">
                                                {index + 1}
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <p className="text-base text-gray-900 dark:text-white">
                                                {answer.answer_text}
                                            </p>
                                        </Table.Cell>
                                        <Table.Cell align="center">
                                            {answer.is_correct ? (
                                                <Badge variant="success" icon={HiCheckCircle} size="md">
                                                    Correcte
                                                </Badge>
                                            ) : (
                                                <Badge variant="danger" icon={HiXCircle} size="md">
                                                    Incorrecte
                                                </Badge>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell align="right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => handleOpenModal(answer)}
                                                >
                                                    <HiPencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant={deleteConfirmation === answer.id ? "warning" : "danger"}
                                                    size="sm"
                                                    onClick={() => handleDelete(answer.id)}
                                                >
                                                    {deleteConfirmation === answer.id ? (
                                                        <>
                                                            <HiCheckCircle className="h-4 w-4 mr-1" />
                                                            Confirmer
                                                        </>
                                                    ) : (
                                                        <HiTrash className="h-4 w-4" />
                                                    )}
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

            {/* Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4"
                        onClick={handleCloseModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-gradient-to-r from-terracotta-500 to-mocha-500 px-6 py-4 rounded-t-xl">
                                <h3 className="text-xl font-bold text-white flex items-center">
                                    <HiPencil className="h-6 w-6 mr-2" />
                                    Modifier la Réponse
                                </h3>
                            </div>
                            <form onSubmit={(e) => handleEdit(e, selectedAnswer.id)} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Texte de la réponse
                                    </label>
                                    <input
                                        type="text"
                                        name="answer_text"
                                        value={editData.answer_text}
                                        onChange={(e) =>
                                            setEditData("answer_text", e.target.value)
                                        }
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracotta-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
                                    />
                                    {editErrors.answer_text && (
                                        <div className="text-terracotta-600 dark:text-terracotta-400 text-sm mt-2">
                                            {editErrors.answer_text}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-3">
                                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                                        Marquer comme correcte
                                    </span>
                                    <Switch
                                        checked={editData.is_correct}
                                        onChange={(checked) => setEditData("is_correct", checked)}
                                        className={`${
                                            editData.is_correct ? 'bg-gradient-to-r from-terracotta-500 to-mocha-500' : 'bg-gray-300 dark:bg-gray-600'
                                        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:ring-offset-2`}
                                    >
                                        <span
                                            className={`${
                                                editData.is_correct ? 'translate-x-6' : 'translate-x-1'
                                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-md`}
                                        />
                                    </Switch>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="button"
                                        onClick={handleCloseModal}
                                        variant="secondary"
                                        className="flex-1"
                                    >
                                        Annuler
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={editProcessing}
                                        variant="primary"
                                        className="flex-1"
                                    >
                                        {editProcessing ? "Mise à jour..." : "Mettre à jour"}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AuthenticatedLayout>
    );
}
