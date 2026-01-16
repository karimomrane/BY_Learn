import { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiPlus,
    HiPencil,
    HiTrash,
    HiEye,
    HiPlayCircle,
    HiXMark,
    HiAcademicCap,
    HiVideoCamera
} from 'react-icons/hi2';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Button from '@/Components/Button';
import Card from '@/Components/Card';
import EmptyState from '@/Components/EmptyState';
import ConfirmDialog from '@/Components/ConfirmDialog';

export default function Index({ programme, lessons }) {
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [lessonToDelete, setLessonToDelete] = useState(null);
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        setLessonToDelete(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (lessonToDelete) {
            destroy(route('lessons.destroy', [programme.id, lessonToDelete]));
            setLessonToDelete(null);
        }
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: 'Programmes', href: route('programmes.index') },
                { label: programme.title, href: '#' }
            ]}
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Leçons - {programme.title}
                        </h2>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {lessons.length} leçon{lessons.length !== 1 ? 's' : ''} disponible{lessons.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <Link href={route('lessons.create', programme.id)}>
                        <Button variant="primary">
                            <HiPlus className="h-5 w-5 mr-2" />
                            Nouvelle Leçon
                        </Button>
                    </Link>
                </div>
            }
        >
            <div className="space-y-6">
                {lessons.length === 0 ? (
                    <Card>
                        <EmptyState
                            icon={HiAcademicCap}
                            title="Aucune leçon trouvée"
                            description="Commencez par créer la première leçon de ce programme."
                            action={() => window.location.href = route('lessons.create', programme.id)}
                            actionLabel="Créer une Leçon"
                        />
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {lessons.map((lesson, index) => (
                            <motion.div
                                key={lesson.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="h-full"
                            >
                                <Card className="h-full flex flex-col hover:shadow-xl transition-shadow duration-300">
                                    {/* Image/Video Section */}
                                    <div className="relative h-56 bg-gradient-to-br from-red-100 to-orange-100 dark:from-gray-700 dark:to-gray-600 overflow-hidden group">
                                        {lesson.image_path ? (
                                            <img
                                                src={`/storage/${lesson.image_path}`}
                                                alt={lesson.title}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <HiVideoCamera className="h-20 w-20 text-terracotta-300 dark:text-gray-500" />
                                            </div>
                                        )}

                                        {/* Video Play Button Overlay - Centered and Prominent */}
                                        {lesson.video_path && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <button
                                                    onClick={() => setSelectedVideo(`/storage/${lesson.video_path}`)}
                                                    className="p-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full text-terracotta-600 hover:bg-beige-200 dark:hover:bg-terracotta-900/50 transition-all duration-300 shadow-2xl group-hover:scale-110 transform"
                                                    title="Voir la vidéo"
                                                >
                                                    <HiPlayCircle className="h-12 w-12" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <Card.Body className="flex-1 flex flex-col">
                                        {/* Title */}
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[3.5rem]">
                                            {lesson.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 min-h-[4.5rem] flex-1">
                                            {lesson.description || 'Aucune description disponible'}
                                        </p>
                                    </Card.Body>

                                    {/* Action Buttons Footer */}
                                    <Card.Footer className="flex flex-col gap-2">
                                        <Link
                                            href={route('Quizzezes.index', lesson.id)}
                                            className="w-full"
                                        >
                                            <Button variant="primary" size="md" className="w-full">
                                                <HiEye className="h-5 w-5 mr-2" />
                                                Voir les Quiz
                                            </Button>
                                        </Link>
                                        <div className="flex gap-2">
                                            <Link href={route('lessons.edit', [programme.id, lesson.id])} className="flex-1">
                                                <Button variant="secondary" size="sm" className="w-full">
                                                    <HiPencil className="h-4 w-4 mr-2" />
                                                    Modifier
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDelete(lesson.id)}
                                                className="flex-1"
                                            >
                                                <HiTrash className="h-4 w-4 mr-2" />
                                                Supprimer
                                            </Button>
                                        </div>
                                    </Card.Footer>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Video Modal */}
            <AnimatePresence>
                {selectedVideo && (
                    <motion.div
                        className="fixed inset-0 bg-black/95 backdrop-blur-sm flex justify-center items-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedVideo(null)}
                    >
                        <motion.div
                            className="relative w-full max-w-5xl"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedVideo(null)}
                                className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300 transition-colors"
                            >
                                <HiXMark className="h-8 w-8" />
                            </button>

                            {/* Video Player */}
                            <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
                                <video
                                    src={selectedVideo}
                                    controls
                                    autoPlay
                                    className="w-full max-h-[80vh]"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                show={showDeleteConfirm}
                title="Supprimer la leçon"
                message="Êtes-vous sûr de vouloir supprimer cette leçon ? Cette action supprimera également tous les quiz associés."
                confirmText="Supprimer"
                cancelText="Annuler"
                type="danger"
                onConfirm={confirmDelete}
                onCancel={() => {
                    setShowDeleteConfirm(false);
                    setLessonToDelete(null);
                }}
            />
        </AuthenticatedLayout>
    );
}
