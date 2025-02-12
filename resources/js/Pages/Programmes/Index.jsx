import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, useForm } from '@inertiajs/react';
import { MdCancel } from 'react-icons/md';
import { motion } from 'framer-motion';
export default function Index({ programmes: initialProgrammes }) {
  const { delete: destroy } = useForm();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const programmesPerPage = 6;

  // Filter programmes based on search term
  const filteredProgrammes = initialProgrammes.filter((programme) =>
    programme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    programme.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastProgramme = currentPage * programmesPerPage;
  const indexOfFirstProgramme = indexOfLastProgramme - programmesPerPage;
  const currentProgrammes = filteredProgrammes.slice(indexOfFirstProgramme, indexOfLastProgramme);

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce programme ?')) {
      destroy(route('programmes.destroy', id));
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <AuthenticatedLayout
      header={
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link
            href={route('programmes.create')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Ajouter un programme
          </Link>
          <input
            type="text"
            placeholder="Rechercher un programme..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 w-full sm:w-64 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
          />
        </div>
      }
    >
      <div className="py-12  dark:bg-gray-900">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentProgrammes.map((programme) => (
              <motion.div
                key={programme.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl dark:shadow-gray-700 overflow-hidden p-6 transform transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(programme.id)}
                  className="absolute top-3 right-3 bg-red-100 dark:bg-red-700 rounded-full p-1 text-red-500 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-600 transition-colors"
                >
                  <MdCancel className="w-6 h-6" />
                </button>

                {/* Programme Image */}
                {programme.image_path && (
                  <img
                    src={`/storage/${programme.image_path}`}
                    alt={programme.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}

                {/* Programme Details */}
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  {programme.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {programme.description}
                </p>

                {/* Edit Link */}
                <Link
                  href={route('programmes.edit', programme.id)}
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                >
                  Modifier programme
                </Link>

                {/* Voir Lessons Button */}
                <Link
                  href={route('lessons.index', programme.id)}
                  className="mt-4 block text-center bg-gradient-to-r from-green-400 to-blue-500 dark:from-green-600 dark:to-blue-600 text-white px-4 py-2 rounded-full font-semibold shadow-md hover:shadow-lg transition-shadow"
                >
                  Voir Lessons
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-10">
            {Array.from({ length: Math.ceil(filteredProgrammes.length / programmesPerPage) }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`mx-2 px-4 py-2 rounded-full font-medium transition-colors ${
                  currentPage === i + 1
                    ? 'bg-green-700 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
