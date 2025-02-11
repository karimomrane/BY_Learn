import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router, useForm } from '@inertiajs/react';

export default function Edit({ programme }) {
    const { data, setData, errors } = useForm({
        title: programme.title,
        description: programme.description,
        image_path: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create a FormData object for file upload
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        if (data.image_path) {
            formData.append('image_path', data.image_path);
        }
        formData.append("_method", "put");
        // Send the request using Inertia's router
        router.post(route('programmes.update', programme.id), formData, {
            preserveScroll: true,
            forceFormData: true, // Ensure Laravel reads it as FormData
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold">Modifier Programme</h2>}
        >
            <div className="py-12">
                <div className="max-w-4xl mx-auto bg-white p-6 shadow-md rounded-lg">
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        {/* Title */}
                        <div className="mb-4">
                            <label className="block text-gray-700">Titre</label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full border-gray-300 rounded-md p-2"
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                            <label className="block text-gray-700">Description</label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full border-gray-300 rounded-md p-2"
                            ></textarea>
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                            )}
                        </div>

                        {/* Image Upload */}
                        <div className="mb-4">
                            <label className="block text-gray-700">Image</label>
                            {programme.image_path && (
                                <img
                                    src={`/storage/${programme.image_path}`}
                                    alt="Current"
                                    className="w-32 h-32 object-cover rounded mb-2"
                                />
                            )}
                            <input
                                type="file"
                                onChange={(e) => setData("image_path", e.target.files[0])}
                                className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                accept="image/*"
                            />
                            {errors.image && (
                                <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Modifier
                        </button>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
