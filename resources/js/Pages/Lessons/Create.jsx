import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react';

export default function Create({ programme }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: null,
        video: null,
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, type } = e.target;

        if (type === 'file') {
            const file = e.target.files[0];
            setFormData((prev) => ({ ...prev, [name]: file }));

            // Prévisualisation de l'image
            if (name === 'image' && file) {
                const reader = new FileReader();
                reader.onload = (event) => setPreviewImage(event.target.result);
                reader.readAsDataURL(file);
            }
        } else {
            setFormData((prev) => ({ ...prev, [name]: e.target.value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        if (formData.image) data.append('image', formData.image);
        if (formData.video) data.append('video', formData.video);

        router.post(route('lessons.store', programme.id), data, {
            onSuccess: () => setLoading(false),
            onError: (errors) => {
                setErrors(errors);
                setLoading(false);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Ajouter une Leçon à {programme.title}
                </h2>
            }
        >
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            {/* Titre */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Titre de la Leçon
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                            </div>

                            {/* Description */}
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                            </div>

                            {/* Image */}
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Image (facultatif)
                                </label>
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                                {previewImage && (
                                    <img src={previewImage} alt="Prévisualisation" className="mt-2 w-48 h-32 object-cover rounded" />
                                )}
                                {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
                            </div>

                            {/* Vidéo */}
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Vidéo (obligatoire)
                                </label>
                                <input
                                    type="file"
                                    name="video"
                                    accept="video/*"
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    required
                                />
                                {errors.video && <p className="text-red-500 text-sm">{errors.video}</p>}
                            </div>

                            {/* Bouton Ajouter */}
                            <div className="mt-6">
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                    disabled={loading}
                                >
                                    {loading ? 'En cours...' : 'Ajouter la Leçon'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
