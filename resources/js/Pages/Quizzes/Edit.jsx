import React from "react";
import { useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Edit({ lesson, quizze }) {
    const { data, setData, put, processing, errors } = useForm({
        instructions: quizze.instructions || "",
    });

    console.log(lesson, quizze);


    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("Quizzezes.update", [lesson.id, quizze.id]));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Edit Quiz: {quizze.title}</h2>}
        >
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-md sm:rounded-lg dark:bg-gray-800 p-6">
                        <form onSubmit={handleSubmit}>

                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300">Instructions</label>
                                <textarea
                                    className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600"
                                    value={data.instructions}
                                    onChange={(e) => setData("instructions", e.target.value)}
                                ></textarea>
                                {errors.instructions && <p className="text-terracotta-500 text-sm mt-1">{errors.instructions}</p>}
                            </div>

                            <div className="flex justify-between">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
                                    disabled={processing}
                                >
                                    {processing ? "Updating..." : "Update Quiz"}
                                </button>
                                <a
                                    href={route("Quizzezes.index", lesson.id)}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
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
