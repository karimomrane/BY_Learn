import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { motion } from "framer-motion";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { usePage } from "@inertiajs/react";
import '../styles.css';
export default function Index() {
    const { question, answers } = usePage().props;
    const [deleteConfirmation, setDeleteConfirmation] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    const { delete: destroy } = useForm();
    // Create form state
    const { data: createData, setData: setCreateData, post, processing: createProcessing, errors: createErrors } = useForm({
        answer_text: "",
        is_correct: false,
    });

    // Edit form state
    const { data: editData, setData: setEditData, put, processing: editProcessing, errors: editErrors } = useForm({
        answer_text: "",
        answer_id: null,
        is_correct: false,
    });

    // Handle create answer
    const handleCreate = (e) => {
        e.preventDefault();
        post(route("answers.store", question.id));
    };

    // Handle edit answer
    const handleEdit = (e, answerId) => {
        e.preventDefault();
        put(route("answers.update", [question.id, answerId]));
        setIsModalOpen(false); // Close the modal after submission
    };

    // Handle delete answer
    const handleDelete = (answerId) => {
        if (deleteConfirmation === answerId) {
            // Make a delete request
            destroy(route("answers.destroy", [question.id, answerId]), {
                preserveScroll: true,
                onSuccess: () => setDeleteConfirmation(null),  // Reset confirmation
                onError: (error) => console.error("Error deleting answer", error),
            });
        } else {
            setDeleteConfirmation(answerId);  // Show confirmation
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
            header={<h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Answers for Question: {question.question_text}</h2>}
        >
            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-md sm:rounded-lg dark:bg-gray-800 p-6">
                        {/* Create Answer Form */}
                        <form onSubmit={handleCreate} className="mb-6">
                            <div>
                                <input
                                    type="text"
                                    name="answer_text"
                                    value={createData.answer_text}
                                    onChange={(e) => setCreateData("answer_text", e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                    placeholder="Enter answer text"
                                />
                                {createErrors.answer_text && <div className="text-red-500 text-sm">{createErrors.answer_text}</div>}
                            </div>
                            <div className="mt-2">
                                <label class="switch flex items-center m-3">
                                    <input type="checkbox"
                                        name="is_correct"
                                        checked={createData.is_correct}
                                        onChange={(e) => setCreateData("is_correct", e.target.checked)} />
                                    <span class="slider"></span>

                                </label>
                                <span className="dark:text-gray-200">Mark as correct</span>
                            </div>
                            <button
                                type="submit"
                                disabled={createProcessing}
                                className="mt-4 px-4 py-2 text-white bg-blue-600 rounded-md disabled:bg-gray-400"
                            >
                                {createProcessing ? "Creating..." : "Create Answer"}
                            </button>
                        </form>

                        {/* Answer List */}
                        {answers.length === 0 ? (
                            <p className="text-center text-gray-600 dark:text-gray-400">No answers available for this question.</p>
                        ) : (
                            <div className="space-y-4">
                                {answers.map((answer) => (
                                    <div key={answer.id} className="border-b border-gray-300 dark:border-gray-600 py-4">
                                        <div className="flex justify-between items-center">
                                            <div className="text-lg text-gray-800 dark:text-gray-200">{answer.answer_text}</div>
                                            <div className="flex space-x-4">
                                                <button
                                                    onClick={() => handleOpenModal(answer)}
                                                    className="text-blue-600 hover:text-blue-700"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(answer.id)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    {deleteConfirmation === answer.id ? "Confirm Delete" : "Delete"}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            {answer.is_correct ? (
                                                <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                                                    Correct
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">
                                                    Incorrect
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal for Editing Answer */}
            {isModalOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                >
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.8 }}
                        className="bg-white dark:bg-gray-800 p-8 rounded-lg w-96"
                    >
                        <h3 className="text-xl font-semibold mb-4 dark:text-gray-200">Edit Answer</h3>
                        <form onSubmit={(e) => handleEdit(e, selectedAnswer.id)}>
                            <input
                                type="text"
                                name="answer_text"
                                value={editData.answer_text}
                                onChange={(e) => setEditData("answer_text", e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {editErrors.answer_text && <div className="text-red-500 text-sm">{editErrors.answer_text}</div>}
                            <div className="mt-2">
                                <label className="flex items-center switch m-3">
                                    <input
                                        type="checkbox"
                                        name="is_correct"
                                        checked={editData.is_correct}
                                        onChange={(e) => setEditData("is_correct", e.target.checked)}
                                    />
                                    <span className="slider"></span>
                                </label>
                                <span className="dark:text-gray-200">Mark as correct</span>
                            </div>
                            <div className="mt-4 flex justify-between">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 text-white bg-gray-400 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editProcessing}
                                    className="px-4 py-2 text-white bg-blue-600 rounded-md disabled:bg-gray-400"
                                >
                                    {editProcessing ? "Updating..." : "Update Answer"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AuthenticatedLayout>
    );
}
