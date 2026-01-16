import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { usePage } from "@inertiajs/react";

export default function Edit() {
    const { quizze, question } = usePage().props;

    const { data, setData, put, processing, errors } = useForm({
        question_text: question.question_text,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("questions.update", [quizze.id, question.id]));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Edit Question</h2>}
        >
            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-md sm:rounded-lg dark:bg-gray-800 p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label
                                    htmlFor="question_text"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                                >
                                    Question Text
                                </label>
                                <textarea
                                    id="question_text"
                                    name="question_text"
                                    rows="4"
                                    value={data.question_text}
                                    onChange={(e) => setData("question_text", e.target.value)}
                                    className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                                    placeholder="Edit your question here"
                                ></textarea>
                                {errors.question_text && (
                                    <p className="mt-2 text-sm text-terracotta-600">{errors.question_text}</p>
                                )}
                            </div>

                            <div className="flex justify-between">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                                >
                                    {processing ? "Updating..." : "Update Question"}
                                </button>
                                <a
                                    href={route("questions.index", quizze.id)}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                >
                                    Cancel
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
