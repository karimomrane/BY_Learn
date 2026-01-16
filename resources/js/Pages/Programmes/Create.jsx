import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm, Link } from '@inertiajs/react';
import { useDropzone } from 'react-dropzone';
import { Switch } from '@headlessui/react';
import { HiPhoto, HiCalendar, HiInformationCircle } from 'react-icons/hi2';
import Button from '@/Components/Button';
import Card from '@/Components/Card';

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
            breadcrumbs={[
                { label: 'Programmes', href: route('programmes.index') },
                { label: 'Nouveau', href: '#' }
            ]}
            header={
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Créer un Programme
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Remplissez les informations ci-dessous pour créer un nouveau programme de formation
                    </p>
                </div>
            }
        >
            <div className="space-y-6">
                <Card>
                    <form onSubmit={handleSubmit} encType="multipart/form-data" className="p-6 space-y-8">
                        {/* Basic Information Section */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                <HiInformationCircle className="h-5 w-5 mr-2 text-terracotta-500" />
                                Informations Générales
                            </h3>
                            <div className="space-y-4">
                                {/* Title Field */}
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Titre <span className="text-terracotta-500">*</span>
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="block w-full px-4 py-3 rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-terracotta-500 focus:ring-terracotta-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="Ex: Formation PHP Avancé"
                                    />
                                    {errors.title && <p className="mt-2 text-sm text-terracotta-600 dark:text-terracotta-400">{errors.title}</p>}
                                </div>

                                {/* Description Field */}
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="block w-full px-4 py-3 rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-terracotta-500 focus:ring-terracotta-500 dark:bg-gray-700 dark:text-white"
                                        rows={4}
                                        placeholder="Décrivez le contenu et les objectifs du programme..."
                                    />
                                    {errors.description && <p className="mt-2 text-sm text-terracotta-600 dark:text-terracotta-400">{errors.description}</p>}
                                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                        Une description claire aide les étudiants à comprendre le contenu du programme
                                    </p>
                                </div>

                                {/* Controle Switch */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="flex-1">
                                        <label htmlFor="controle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Session de Contrôle
                                        </label>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Marquez ce programme comme une session de contrôle
                                        </p>
                                    </div>
                                    <Switch
                                        checked={data.controle}
                                        onChange={(value) => setData('controle', value)}
                                        className={`${data.controle ? 'bg-gradient-to-r from-terracotta-500 to-mocha-500' : 'bg-gray-300 dark:bg-gray-600'}
                                            relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:ring-offset-2`}
                                    >
                                        <span
                                            className={`${data.controle ? 'translate-x-6' : 'translate-x-1'}
                                                inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-md`}
                                        />
                                    </Switch>
                                </div>
                            </div>
                        </div>

                        {/* Schedule Section */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                <HiCalendar className="h-5 w-5 mr-2 text-terracotta-500" />
                                Calendrier
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Date Debut Field */}
                                <div>
                                    <label htmlFor="date_debut" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Date de Début <span className="text-terracotta-500">*</span>
                                    </label>
                                    <input
                                        id="date_debut"
                                        type="datetime-local"
                                        value={data.date_debut}
                                        onChange={(e) => setData('date_debut', e.target.value)}
                                        className="block w-full px-4 py-3 rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-terracotta-500 focus:ring-terracotta-500 dark:bg-gray-700 dark:text-white"
                                    />
                                    {errors.date_debut && <p className="mt-2 text-sm text-terracotta-600 dark:text-terracotta-400">{errors.date_debut}</p>}
                                </div>

                                {/* Date Fin Field */}
                                <div>
                                    <label htmlFor="date_fin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Date de Fin <span className="text-terracotta-500">*</span>
                                    </label>
                                    <input
                                        id="date_fin"
                                        type="datetime-local"
                                        value={data.date_fin}
                                        onChange={(e) => setData('date_fin', e.target.value)}
                                        min={minDateFin}
                                        className="block w-full px-4 py-3 rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-terracotta-500 focus:ring-terracotta-500 dark:bg-gray-700 dark:text-white"
                                    />
                                    {errors.date_fin && <p className="mt-2 text-sm text-terracotta-600 dark:text-terracotta-400">{errors.date_fin}</p>}
                                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                        La date de fin doit être postérieure à la date de début
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Image Upload Section */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                <HiPhoto className="h-5 w-5 mr-2 text-terracotta-500" />
                                Image du Programme
                            </h3>
                            <div
                                {...getRootProps()}
                                className="mt-2 flex justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 px-6 py-10 transition-colors hover:border-terracotta-500 dark:hover:border-terracotta-500 cursor-pointer bg-gray-50 dark:bg-gray-800/50"
                            >
                                <div className="text-center">
                                    <input {...getInputProps()} />
                                    {preview ? (
                                        <div className="space-y-4">
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="mx-auto h-64 w-auto object-cover rounded-lg shadow-lg"
                                            />
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Cliquez ou glissez pour remplacer l'image
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <HiPhoto className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                                            <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                                                <p className="font-medium text-terracotta-600 hover:text-terracotta-500">
                                                    Cliquez pour télécharger
                                                </p>
                                                <p className="pl-1">ou glissez-déposez</p>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                                PNG, JPG, GIF jusqu'à 2MB
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                            {errors.image_path && <p className="mt-2 text-sm text-terracotta-600 dark:text-terracotta-400">{errors.image_path}</p>}
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <Link href={route('programmes.index')}>
                                <Button variant="secondary" type="button">
                                    Annuler
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={processing}
                            >
                                {processing ? 'Enregistrement...' : 'Créer le Programme'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
