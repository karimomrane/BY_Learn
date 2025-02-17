import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm, Link } from '@inertiajs/react';
import { useDropzone } from 'react-dropzone';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        image_path: null,
        controle: false,
        date_debut: '',
        date_fin: ''
    });

    const [preview, setPreview] = useState(null);

    const handleDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        setData('image_path', file);
        setPreview(URL.createObjectURL(file));
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleDrop,
        accept: 'image/*',
        multiple: false
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('programmes.store'));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Créer un programme</h2>}
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            {/* Title Field */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-200 font-bold mb-2">Titre</label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="shadow rounded w-full py-2 px-3 text-gray-700 dark:text-gray-900 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                                {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
                            </div>

                            {/* Description Field */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-200 font-bold mb-2">Description</label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="shadow rounded w-full py-2 px-3 text-gray-700 dark:text-gray-900 dark:bg-gray-700  leading-tight focus:outline-none focus:shadow-outline"
                                    rows="4"
                                ></textarea>
                                {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
                            </div>

                            {/* Controle Field */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-200 font-bold mb-2">Controle</label>
                                <input
                                    type="checkbox"
                                    checked={data.controle}
                                    onChange={(e) => setData('controle', e.target.checked)}
                                    className="shadow rounded w-full py-2 px-3 text-gray-700 dark:text-gray-900 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>

                            {/* Date Debut Field */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-200 font-bold mb-2">Date Debut</label>
                                <input
                                    type="datetime-local"
                                    value={data.date_debut}
                                    onChange={(e) => setData('date_debut', e.target.value)}
                                    className="shadow rounded w-full py-2 px-3 text-gray-700 dark:text-gray-900 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>

                            {/* Date Fin Field */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-200 font-bold mb-2">Date Fin</label>
                                <input
                                    type="datetime-local"
                                    value={data.date_fin}
                                    onChange={(e) => setData('date_fin', e.target.value)}
                                    className="shadow rounded w-full py-2 px-3 text-gray-700 dark:text-gray-900 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>

                            {/* Drag and Drop File Upload */}
                            <div {...getRootProps()} className="mb-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 flex flex-col items-center cursor-pointer">
                                <input {...getInputProps()} />
                                {preview ? (
                                    <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400">Glissez-déposez une image ici ou cliquez pour sélectionner</p>
                                )}
                            </div>
                            {errors.image_path && <div className="text-red-500 text-sm mt-1">{errors.image_path}</div>}

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
