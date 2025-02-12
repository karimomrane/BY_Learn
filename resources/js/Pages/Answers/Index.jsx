import React, { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
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
            header={
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    Answers for Question: {question.question_text}
                </h2>
            }
        >
            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Create Answer Form */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-lg shadow-lg"
                    >
                        <form onSubmit={handleCreate} className="mb-4">
                            <div>
                                <input
                                    type="text"
                                    name="answer_text"
                                    value={createData.answer_text}
                                    onChange={(e) =>
                                        setCreateData("answer_text", e.target.value)
                                    }
                                    className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    placeholder="Enter answer text"
                                />
                                {createErrors.answer_text && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {createErrors.answer_text}
                                    </div>
                                )}
                            </div>
                            <div className="mt-3 flex items-center">
                                <label className="switch flex items-center mr-2">
                                    <input
                                        type="checkbox"
                                        name="is_correct"
                                        checked={createData.is_correct}
                                        onChange={(e) =>
                                            setCreateData("is_correct", e.target.checked)
                                        }
                                    />
                                    <span className="slider"></span>
                                </label>
                                <span className="text-white dark:text-gray-200">
                                    Mark as correct
                                </span>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                disabled={createProcessing}
                                className="mt-4 w-full px-4 py-2 text-white bg-blue-700 rounded-md disabled:bg-gray-400"
                            >
                                {createProcessing ? "Creating..." : "Create Answer"}
                            </motion.button>
                        </form>
                    </motion.div>

                    {/* Answer List as Table */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white dark:bg-gray-800 shadow-md sm:rounded-lg overflow-x-auto"
                    >
                        {answers.length === 0 ? (
                            <p className="text-center text-gray-600 dark:text-gray-400 p-4">
                                No answers available for this question.
                            </p>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Answer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Correct?
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Edit
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Delete
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                                    <AnimatePresence>
                                        {answers.map((answer) => (
                                            <motion.tr
                                                key={answer.id}
                                                variants={rowVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="hidden"
                                                transition={{ duration: 0.3 }}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">
                                                    {answer.answer_text}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {answer.is_correct ? (
                                                        <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                                                            Correct
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">
                                                            Incorrect
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        onClick={() => handleOpenModal(answer)}
                                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 focus:outline-none shadow-md"
                                                    >
                                                        Edit
                                                    </motion.button>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        onClick={() => handleDelete(answer.id)}
                                                        className={`px-4 py-2 rounded-lg transition duration-200 focus:outline-none shadow-md ${deleteConfirmation === answer.id
                                                                ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                                                                : "bg-red-500 hover:bg-red-600 text-white"
                                                            }`}
                                                    >
                                                        {deleteConfirmation === answer.id ? "Confirm Delete" : "Delete"}
                                                    </motion.button>
                                                </td>

                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Modal for Editing Answer */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="bg-white dark:bg-gray-800 p-8 rounded-lg w-96 shadow-2xl"
                        >
                            <h3 className="text-xl font-semibold mb-4 dark:text-gray-200">
                                Edit Answer
                            </h3>
                            <form onSubmit={(e) => handleEdit(e, selectedAnswer.id)}>
                                <input
                                    type="text"
                                    name="answer_text"
                                    value={editData.answer_text}
                                    onChange={(e) =>
                                        setEditData("answer_text", e.target.value)
                                    }
                                    className="w-full p-3 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                {editErrors.answer_text && (
                                    <div className="text-red-500 text-sm mb-2">
                                        {editErrors.answer_text}
                                    </div>
                                )}
                                <div className="mt-2 flex items-center">
                                    <label className="switch flex items-center mr-2">
                                        <input
                                            type="checkbox"
                                            name="is_correct"
                                            checked={editData.is_correct}
                                            onChange={(e) =>
                                                setEditData("is_correct", e.target.checked)
                                            }
                                        />
                                        <span className="slider"></span>
                                    </label>
                                    <span className="dark:text-gray-200">
                                        Mark as correct
                                    </span>
                                </div>
                                <div className="mt-4 flex justify-between">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="px-4 py-2 text-white bg-gray-500 rounded-md"
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        type="submit"
                                        disabled={editProcessing}
                                        className="px-4 py-2 text-white bg-blue-700 rounded-md disabled:bg-gray-400"
                                    >
                                        {editProcessing ? "Updating..." : "Update Answer"}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AuthenticatedLayout>
    );
}
