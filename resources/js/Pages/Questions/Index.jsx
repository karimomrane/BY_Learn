import React from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { motion } from "framer-motion";

export default function Index() {
    const { quizze, questions, success } = usePage().props;
    const { delete: destroy } = useForm();

    // Animation variants for Framer Motion
    const fadeInVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } },
    };

    const tableRowVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        hover: { scale: 1.02, transition: { duration: 0.2 } },
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    Questions for {quizze.instructions}
                </h2>
            }
        >
            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <motion.div
                        className="bg-white shadow-lg sm:rounded-lg dark:bg-gray-800 p-6"
                        variants={fadeInVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Flash Message */}
                        {success && (
                            <motion.div
                                className="mb-4 p-3 bg-green-100 text-green-700 rounded-md font-bold"
                                variants={fadeInVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {success}
                            </motion.div>
                        )}

                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                List of Questions
                            </h3>
                            <Link
                                href={route("questions.create", quizze.id)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                            >
                                + Add Question
                            </Link>
                        </div>

                        {/* Table of Questions */}
                        <div className="flex flex-col">
                            <div className="-m-1.5 overflow-x-auto">
                                <div className="p-1.5 min-w-full inline-block align-middle">
                                    <div className="overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                                            <thead>
                                                <tr>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                                                    >
                                                        #
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                                                    >
                                                        Question Text
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                                                    >
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                                                {questions.length > 0 ? (
                                                    questions.map((question, index) => (
                                                        <motion.tr
                                                            key={question.id}
                                                            variants={tableRowVariants}
                                                            initial="hidden"
                                                            animate="visible"
                                                            whileHover="hover"
                                                            className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                                        >
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                                                                {index + 1}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                                                                {question.question_text}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                                                                <div className="flex justify-end space-x-2">
                                                                    <Link
                                                                        href={route("answers.index", [question.id])}
                                                                        className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-none focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:text-blue-400"
                                                                    >
                                                                        View Answers
                                                                    </Link>
                                                                    <Link
                                                                        href={route("questions.edit", [quizze.id, question.id])}
                                                                        className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-yellow-600 hover:text-yellow-800 focus:outline-none focus:text-yellow-800 disabled:opacity-50 disabled:pointer-events-none dark:text-yellow-500 dark:hover:text-yellow-400 dark:focus:text-yellow-400"
                                                                    >
                                                                        Edit
                                                                    </Link>
                                                                    <button
                                                                        onClick={() => {
                                                                            if (
                                                                                confirm(
                                                                                    "Are you sure you want to delete this question?"
                                                                                )
                                                                            ) {
                                                                                destroy(
                                                                                    route("questions.destroy", [
                                                                                        quizze.id,
                                                                                        question.id,
                                                                                    ])
                                                                                );
                                                                            }
                                                                        }}
                                                                        className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-red-600 hover:text-red-800 focus:outline-none focus:text-red-800 disabled:opacity-50 disabled:pointer-events-none dark:text-red-500 dark:hover:text-red-400 dark:focus:text-red-400"
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </motion.tr>
                                                    ))
                                                ) : (
                                                    <motion.tr
                                                        variants={fadeInVariants}
                                                        initial="hidden"
                                                        animate="visible"
                                                    >
                                                        <td
                                                            colSpan="3"
                                                            className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500"
                                                        >
                                                            No questions found.
                                                        </td>
                                                    </motion.tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
