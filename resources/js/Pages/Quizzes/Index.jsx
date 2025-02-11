import React from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index() {
    const { lesson, quizze, success } = usePage().props;
    const { delete: destroy } = useForm();

    const handleDelete = (lessonid, id) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce quize ?")) {
            destroy(route('Quizzezes.destroy', [lessonid, id]));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        Quizzes for {lesson.title}
                    </h2>
                    {!quizze && (
                        <Link
                            href={route("Quizzezes.create", lesson.id)}
                            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
                        >
                            + Add Quiz
                        </Link>
                    )}
                </div>
            }
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {success && (
                        <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-md">
                            {success}
                        </div>
                    )}

                    <div className="overflow-hidden bg-white shadow-md sm:rounded-lg dark:bg-gray-800 p-6">
                        {quizze ? (
                            <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-md">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {quizze.title || "Quiz"}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 mt-2">
                                    {quizze.instructions || "No instructions available"}
                                </p>
                                <div className="mt-4 flex space-x-4">
                                    <Link
                                        href={route("questions.index", quizze.id)}
                                        className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition"
                                    >
                                        View Quiz
                                    </Link>
                                    <Link
                                        href={route("Quizzezes.edit", [lesson.id, quizze.id])}
                                        className="px-4 py-2 bg-yellow-500 text-white text-sm rounded-md hover:bg-yellow-600 transition"
                                    >
                                        Edit Quiz
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(lesson.id, quizze.id)}
                                        className="px-4 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition"
                                    >
                                        Delete Quiz
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">No quiz available for this lesson.</p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
