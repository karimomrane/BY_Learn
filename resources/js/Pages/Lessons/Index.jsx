import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ programme, lessons }) {
    const [selectedVideo, setSelectedVideo] = useState(null);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        Lessons for {programme.title}
                    </h2>
                    <Link
                        href={route('lessons.create', programme.id)}
                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
                    >
                        + Add Lesson
                    </Link>
                </div>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        {lessons.map(lesson => (
                            <div key={lesson.id} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                                {lesson.image_path && (
                                    <img
                                        src={`/storage/${lesson.image_path}`}
                                        alt={lesson.title}
                                        className="w-full h-48 object-cover"
                                    />
                                )}
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{lesson.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">{lesson.description || 'No description available'}</p>
                                    <div className="mt-4 flex justify-between items-center">
                                        <Link
                                            href={route('Quizzezes.index', [lesson.id])}
                                            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                                        >
                                            View Lesson
                                        </Link>
                                        {lesson.video_path && (
                                            <button
                                                onClick={() => setSelectedVideo(`/storage/${lesson.video_path}`)}
                                                className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition"
                                            >
                                                Watch Video
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Video Modal */}
            <AnimatePresence>
                {selectedVideo && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedVideo(null)}
                    >
                        <motion.div
                            className="relative w-full max-w-4xl px-4"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            transition={{ type: 'spring', stiffness: 100 }}
                        >

                            {/* Video Player */}
                            <div className="flex justify-center">
                                <video
                                    src={selectedVideo}
                                    controls
                                    autoPlay
                                    className="w-full max-h-[80vh] rounded-lg shadow-lg"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AuthenticatedLayout>
    );
}
