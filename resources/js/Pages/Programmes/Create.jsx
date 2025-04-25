import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm, Link } from '@inertiajs/react';
import { useDropzone } from 'react-dropzone';
import { Switch } from '@headlessui/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        image_path: null,
        controle: false,
        date_debut: '',
        date_fin: ''
    });
    const [minDateFin, setMinDateFin] = useState('');
    const [preview, setPreview] = useState(null);
    useEffect(() => {
        if (data.date_debut) {
            setMinDateFin(data.date_debut);
            if (data.date_fin && data.date_fin < data.date_debut) {
                setData('date_fin', data.date_debut);
            }
        }
    }, [data.date_debut]);
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
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
                            {/* Title Field */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Titre
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                />
                                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                            </div>

                            {/* Description Field */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                    rows={4}
                                />
                                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                            </div>

                            {/* Controle Field - Now a Switch */}
                            <div className="flex items-center justify-between">
                                <label htmlFor="controle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Contrôle
                                </label>
                                <Switch
                                    checked={data.controle}
                                    onChange={(value) => setData('controle', value)}
                                    className={`${data.controle ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}
                                        relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                                >
                                    <span
                                        className={`${data.controle ? 'translate-x-6' : 'translate-x-1'}
                                            inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                    />
                                </Switch>
                            </div>

                            {/* Date Fields in Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Date Debut Field */}
                                <div>
                                    <label htmlFor="date_debut" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Date de début
                                    </label>
                                    <input
                                        id="date_debut"
                                        type="datetime-local"
                                        value={data.date_debut}
                                        onChange={(e) => setData('date_debut', e.target.value)}
                                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                    />
                                </div>

                                {/* Date Fin Field */}
                                <div>
                                    <label htmlFor="date_fin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Date de fin
                                    </label>
                                    <input
                                        id="date_fin"
                                        type="datetime-local"
                                        value={data.date_fin}
                                        onChange={(e) => setData('date_fin', e.target.value)}
                                        min={minDateFin}
                                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                    />
                                </div>
                            </div>

                            {/* Drag and Drop File Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Image
                                </label>
                                <div
                                    {...getRootProps()}
                                    className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600 px-6 pt-5 pb-6 transition-colors hover:border-blue-500"
                                >
                                    <div className="space-y-1 text-center">
                                        <input {...getInputProps()} />
                                        {preview ? (
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="mx-auto h-48 w-full object-cover rounded-md"
                                            />
                                        ) : (
                                            <>
                                                <svg
                                                    className="mx-auto h-12 w-12 text-gray-400"
                                                    stroke="currentColor"
                                                    fill="none"
                                                    viewBox="0 0 48 48"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                        strokeWidth={2}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                                    <p className="pl-1">Glissez-déposez une image ou cliquez pour sélectionner</p>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    PNG, JPG, GIF jusqu'à 10MB
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                                {errors.image_path && <p className="mt-1 text-sm text-red-600">{errors.image_path}</p>}
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end gap-4 pt-4">
                                <Link
                                    href={route('programmes.index')}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Annuler
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Enregistrement...' : 'Enregistrer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
