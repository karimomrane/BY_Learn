import React, { useState, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { FaImage, FaVideo } from 'react-icons/fa';

// Reusable DropZone Component
function DropZone({ accept, preview, placeholder, icon: IconComponent, onFileDrop }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      onFileDrop(droppedFile);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileDrop(e.target.files[0]);
    }
  };

  return (
    <motion.div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center cursor-pointer relative"
      whileHover={{ scale: 1.02 }}
    >
      <input
        type="file"
        accept={accept}
        ref={fileInputRef}
        onChange={handleChange}
        // Removed required attribute to prevent native browser validation errors.
        className="hidden"
      />
      {preview ? (
        // If the accept type includes video, render a video element; otherwise, render an image.
        accept.includes('video') ? (
          <video src={preview} controls className="w-full h-48 object-cover rounded" />
        ) : (
          <img src={preview} alt={placeholder} className="w-full h-48 object-cover rounded" />
        )
      ) : (
        <div className="flex flex-col items-center justify-center h-48">
          <IconComponent size={40} className="text-gray-400 dark:text-gray-300" />
          <span className="mt-2 text-gray-400 dark:text-gray-300">{placeholder}</span>
        </div>
      )}
      {isDragging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center rounded-lg"
        >
          <IconComponent size={40} className="text-white mb-2" />
          <p className="text-white font-medium">Drop to upload</p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function Create({ programme }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    video: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle text input changes (for title and description)
  const handleChange = (e) => {
    const { name, type } = e.target;
    if (type !== 'file') {
      setFormData((prev) => ({ ...prev, [name]: e.target.value }));
    }
  };

  // Handle image drop or file selection
  const handleImageDrop = (file) => {
    setFormData((prev) => ({ ...prev, image: file }));
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setPreviewImage(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle video drop or file selection
  const handleVideoDrop = (file) => {
    setFormData((prev) => ({ ...prev, video: file }));
    if (file) {
      const videoPreviewUrl = URL.createObjectURL(file);
      setPreviewVideo(videoPreviewUrl);
    }
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validate that a video file is provided since it’s required.
    if (!formData.video) {
      setErrors((prev) => ({ ...prev, video: 'La vidéo est obligatoire.' }));
      setLoading(false);
      return;
    }

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
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              {/* Titre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Titre de la Leçon
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
                {errors.title && <p className="text-terracotta-500 text-sm">{errors.title}</p>}
              </div>

              {/* Description */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                {errors.description && <p className="text-terracotta-500 text-sm">{errors.description}</p>}
              </div>

              {/* Image DropZone */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Image (facultatif)
                </label>
                <DropZone
                  accept="image/*"
                  preview={previewImage}
                  placeholder="Glissez et déposez une image ici ou cliquez pour télécharger"
                  icon={FaImage}
                  onFileDrop={handleImageDrop}
                />
                {errors.image && <p className="text-terracotta-500 text-sm">{errors.image}</p>}
              </div>

              {/* Video DropZone */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Vidéo (obligatoire)
                </label>
                <DropZone
                  accept="video/*"
                  preview={previewVideo}
                  placeholder="Glissez et déposez une vidéo ici ou cliquez pour télécharger"
                  icon={FaVideo}
                  onFileDrop={handleVideoDrop}
                />
                {errors.video && <p className="text-terracotta-500 text-sm">{errors.video}</p>}
              </div>

              {/* Bouton Ajouter */}
              <div className="mt-6">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
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
