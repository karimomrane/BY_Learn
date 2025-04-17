import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Historique({ userprogress }) {
  const user = usePage().props.auth.user;
  const { delete: destroy } = useForm();

  // State for search, sorting, and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page

  // Handle delete
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this record?')) {
      try {
        await destroy(route('user-progress.destroy', id));
      } catch (error) {
        console.error('Error deleting record:', error);
      }
    }
  };

  // Filter data based on search term
  const filteredData = userprogress.filter((progress) =>
    progress.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (progress.lesson?.title &&
      progress.lesson.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    progress.quizze.instructions.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort data – handles nested keys (e.g. "user.name")
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortConfig.key) {
      const keys = sortConfig.key.split('.');
      const aValue = keys.reduce((obj, key) => (obj ? obj[key] : null), a);
      const bValue = keys.reduce((obj, key) => (obj ? obj[key] : null), b);

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });

  // Paginate data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Handle pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Historique
        </h2>
      }
    >
      <Head title="Historique" />

      <div className="py-12">
        <div className="max-w-16xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
            <div className="p-6">
              {/* Search Bar */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort('user.name')}
                        >
                          Utilisateur{' '}
                          {sortConfig.key === 'user.name' &&
                            (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort('lesson.title')}
                        >
                          Lesson{' '}
                          {sortConfig.key === 'lesson.title' &&
                            (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort('quizze.instructions')}
                        >
                          Quizze{' '}
                          {sortConfig.key === 'quizze.instructions' &&
                            (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort('score')}
                        >
                          Points obtenus{' '}
                          {sortConfig.key === 'score' &&
                            (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort('completed_at')}
                        >
                          Durée{' '}
                          {sortConfig.key === 'completed_at' &&
                            (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort('created_at')}
                        >
                          Date debut{' '}
                          {sortConfig.key === 'created_at' &&
                            (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        {user.role === 'admin' && (
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                      {currentItems.map((progress) => (
                        <tr
                          key={progress.id}
                          className="hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {progress.user.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                              {progress.lesson?.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                              {progress.quizze.instructions}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                              {progress.score}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                              {new Intl.DateTimeFormat('fr-FR', {
                                minute: '2-digit',
                                second: '2-digit'
                              }).format(new Date(progress.completed_at * 1000))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                              {new Intl.DateTimeFormat('fr-FR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                              }).format(new Date(progress.created_at))}
                            </div>
                          </td>
                          {user.role === 'admin' && (
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleDelete(progress.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                Delete
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="sm:hidden space-y-4">
                {currentItems.map((progress) => (
                  <div
                    key={progress.id}
                    className="bg-white dark:bg-gray-800 p-4 shadow rounded-lg"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        <strong>Utilisateur:</strong> {progress.user.name}
                      </p>
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        <strong>Lesson:</strong> {progress.lesson?.title}
                      </p>
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        <strong>Quizze:</strong> {progress.quizze.instructions}
                      </p>
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        <strong>Points obtenus:</strong> {progress.score}
                      </p>
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        <strong>Durée:</strong>{' '}
                        {new Intl.DateTimeFormat('fr-FR', {
                          minute: '2-digit',
                          second: '2-digit'
                        }).format(new Date(progress.completed_at * 1000))}
                      </p>
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        <strong>Date debut:</strong>{' '}
                        {new Intl.DateTimeFormat('fr-FR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        }).format(new Date(progress.created_at))}
                      </p>
                    </div>
                    {user.role === 'admin' && (
                      <div className="mt-2 text-right">
                        <button
                          onClick={() => handleDelete(progress.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-white disabled:opacity-50"
                >
                  Précédent
                </button>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Page {currentPage} sur {Math.ceil(sortedData.length / itemsPerPage)}
                </span>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === Math.ceil(sortedData.length / itemsPerPage)}
                  className="px-4 py-2 bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-white disabled:opacity-50"
                >
                  Suivant
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
