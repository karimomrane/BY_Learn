import React from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index() {
    const { quizze, questions, success } = usePage().props;
    const { delete : destroy } = useForm();

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Questions for {quizze.instructions}</h2>}
        >
            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-md sm:rounded-lg dark:bg-gray-800 p-6">
                        {/* Flash Message */}
                        {success && (
                            <div className="mb-4 text-green-600 font-bold">{success}</div>
                        )}

                        <div className="flex justify-between mb-4">
                            <h3 className="text-lg font-semibold">List of Questions</h3>
                            <Link
                                href={route("questions.create", quizze.id)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                + Add Question
                            </Link>
                        </div>

                        {/* Table of Questions */}
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-600">
                                <thead>
                                    <tr className="bg-gray-200 dark:bg-gray-700">
                                        <th className="border px-4 py-2">#</th>
                                        <th className="border px-4 py-2">Question Text</th>
                                        <th className="border px-4 py-2 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {questions.length > 0 ? (
                                        questions.map((question, index) => (
                                            <tr key={question.id} className="hover:bg-gray-100 dark:hover:bg-gray-600">
                                                <td className="border px-4 py-2 text-center">{index + 1}</td>
                                                <td className="border px-4 py-2">{question.question_text}</td>
                                                <td className="border px-4 py-2 flex justify-center space-x-2">
                                                    <Link
                                                        href={route("answers.index", [question.id])}
                                                        className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                                                    >
                                                        View Answers
                                                    </Link>
                                                    <Link
                                                        href={route("questions.edit", [quizze.id, question.id])}
                                                        className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm("Are you sure you want to delete this question?")) {
                                                                destroy(route("questions.destroy", [quizze.id, question.id]));
                                                            }
                                                        }}
                                                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="border px-4 py-2 text-center text-gray-500">
                                                No questions found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
