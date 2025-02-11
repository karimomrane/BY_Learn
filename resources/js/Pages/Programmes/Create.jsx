import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm ,Link} from '@inertiajs/react';

export default function Create() {
    // Initialize the form state using useForm from Inertia
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        image_path: null,
    });

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Inertia handles file uploads automatically if a file is passed
        post(route('programmes.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Créer un programme
                </h2>
            }
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            {/* Title Field */}
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
                                    Titre
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                                {errors.title && (
                                    <div className="text-red-500 text-sm mt-1">{errors.title}</div>
                                )}
                            </div>

                            {/* Description Field */}
                            <div className="mb-4">
                                <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    rows="4"
                                ></textarea>
                                {errors.description && (
                                    <div className="text-red-500 text-sm mt-1">{errors.description}</div>
                                )}
                            </div>

                            {/* Image Field */}
                            <div className="mb-4">
                                <label htmlFor="image_path" className="block text-gray-700 font-bold mb-2">
                                    Image
                                </label>
                                <input
                                    type="file"
                                    name="image_path"
                                    id="image_path"
                                    onChange={(e) => setData('image_path', e.target.files[0])}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                                {errors.image_path && (
                                    <div className="text-red-500 text-sm mt-1">{errors.image_path}</div>
                                )}
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-between">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Ajouter
                                </button>
                                <Link
                                    href={route('programmes.index')}
                                    className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                                >
                                    Retour
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
