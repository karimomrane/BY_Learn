import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, router, useForm } from '@inertiajs/react';
import { useDropzone } from 'react-dropzone';

export default function Edit({ programme, lesson }) {
    const { data, setData, errors, processing } = useForm({
        title: lesson.title,
        description: lesson.description,
        image: null,
        video: null,
    });

    const [imagePreview, setImagePreview] = useState(
        lesson.image_path ? `/storage/${lesson.image_path}` : null
    );
    const [videoPreview, setVideoPreview] = useState(
        lesson.video_path ? `/storage/${lesson.video_path}` : null
    );

    const handleSubmit = (e) => {
        e.preventDefault();

        router.post(route('lessons.update', [programme.id, lesson.id]), {
            _method: 'put',
            ...data,
        }, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                // Optional: Add any success handling
            },
            onError: (errors) => {
                console.error(errors);
            }
        });
    };

    const {
        getRootProps: getImageRootProps,
        getInputProps: getImageInputProps,
    } = useDropzone({
        accept: {
            'image/*': ['.jpeg', '.png', '.jpg', '.gif']
        },
        maxFiles: 1,
        onDrop: (acceptedFiles) => {
            setData('image', acceptedFiles[0]);
            setImagePreview(URL.createObjectURL(acceptedFiles[0]));
        }
    });

    const {
        getRootProps: getVideoRootProps,
        getInputProps: getVideoInputProps,
    } = useDropzone({
        accept: {
            'video/*': ['.mp4', '.mov', '.avi', '.wmv']
        },
        maxFiles: 1,
        maxSize: 51200000, // 50MB
        onDrop: (acceptedFiles) => {
            setData('video', acceptedFiles[0]);
            setVideoPreview(URL.createObjectURL(acceptedFiles[0]));
        }
    });

    const removeImage = () => {
        setData('image', null);
        setImagePreview(null);
    };

    const removeVideo = () => {
        setData('video', null);
        setVideoPreview(null);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Edit Lesson: {lesson.title}
                    </h2>
                    <Link
                        href={route('lessons.index', programme.id)}
                        className="text-sm text-blue-500 hover:text-blue-700"
                    >
                        Back to Lessons
                    </Link>
                </div>
            }
        >
            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg overflow-hidden">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Title Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Lesson Title *
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                    required
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                                )}
                            </div>

                            {/* Description Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                    rows={5}
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                )}
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Lesson Image
                                </label>
                                <div
                                    {...getImageRootProps()}
                                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-4 text-center cursor-pointer hover:border-blue-500 transition-colors"
                                >
                                    <input {...getImageInputProps()} />
                                    {imagePreview ? (
                                        <div className="relative">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="mx-auto h-48 object-contain rounded-md"
                                            />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeImage();
                                                }}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
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
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Drag and drop an image here, or click to select
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                                PNG, JPG, GIF up to 2MB
                                            </p>
                                        </div>
                                    )}
                                </div>
                                {errors.image && (
                                    <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                                )}
                            </div>

                            {/* Video Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Lesson Video
                                </label>
                                <div
                                    {...getVideoRootProps()}
                                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-4 text-center cursor-pointer hover:border-blue-500 transition-colors"
                                >
                                    <input {...getVideoInputProps()} />
                                    {videoPreview ? (
                                        <div className="relative">
                                            <video
                                                src={videoPreview}
                                                controls
                                                className="mx-auto h-48 rounded-md"
                                            />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeVideo();
                                                }}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <svg
                                                className="mx-auto h-12 w-12 text-gray-400"
                                                stroke="currentColor"
                                                fill="none"
                                                viewBox="0 0 48 48"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    d="M16 16v16h16V16H16zm4 4h8v8h-8v-8z"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M40 8H8a4 4 0 00-4 4v24a4 4 0 004 4h32a4 4 0 004-4V12a4 4 0 00-4-4z"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Drag and drop a video here, or click to select
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                                MP4, MOV, AVI, WMV up to 50MB
                                            </p>
                                        </div>
                                    )}
                                </div>
                                {errors.video && (
                                    <p className="mt-1 text-sm text-red-600">{errors.video}</p>
                                )}
                            </div>

                            {/* Current Files Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <div>
                                    <p className="font-medium">Current Image:</p>
                                    {lesson.image_path ? (
                                        <a
                                            href={`/storage/${lesson.image_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline"
                                        >
                                            View Image
                                        </a>
                                    ) : (
                                        <p>No image uploaded</p>
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium">Current Video:</p>
                                    {lesson.video_path ? (
                                        <a
                                            href={`/storage/${lesson.video_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline"
                                        >
                                            View Video
                                        </a>
                                    ) : (
                                        <p>No video uploaded</p>
                                    )}
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end gap-4 pt-6">
                                <Link
                                    href={route('lessons.index', programme.id)}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
