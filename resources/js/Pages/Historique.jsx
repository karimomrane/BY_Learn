import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiClock, HiTrash, HiChevronLeft, HiChevronRight, HiMagnifyingGlass, HiArrowsUpDown, HiAdjustmentsHorizontal, HiXMark } from 'react-icons/hi2';
import Card from '@/Components/Card';
import Badge from '@/Components/Badge';
import Button from '@/Components/Button';
import SearchInput from '@/Components/SearchInput';
import EmptyState from '@/Components/EmptyState';

export default function Historique({ userprogress, filters, users, lessons }) {
  const user = usePage().props.auth.user;

  // Initialize filter states from props
  const [search, setSearch] = useState(filters?.search || '');
  const [selectedUser, setSelectedUser] = useState(filters?.user_id || '');
  const [selectedLesson, setSelectedLesson] = useState(filters?.lesson_id || '');
  const [minScore, setMinScore] = useState(filters?.min_score || '');
  const [maxScore, setMaxScore] = useState(filters?.max_score || '');
  const [dateFrom, setDateFrom] = useState(filters?.date_from || '');
  const [dateTo, setDateTo] = useState(filters?.date_to || '');
  const [sortBy, setSortBy] = useState(filters?.sort_by || 'created_at');
  const [sortDirection, setSortDirection] = useState(filters?.sort_direction || 'desc');
  const [perPage, setPerPage] = useState(filters?.per_page || 10);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters({ search });
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Apply filters function
  const applyFilters = (additionalFilters = {}) => {
    const filterData = {
      search,
      user_id: selectedUser,
      lesson_id: selectedLesson,
      min_score: minScore,
      max_score: maxScore,
      date_from: dateFrom,
      date_to: dateTo,
      sort_by: sortBy,
      sort_direction: sortDirection,
      per_page: perPage,
      ...additionalFilters,
    };

    // Remove empty filters
    Object.keys(filterData).forEach(key => {
      if (filterData[key] === '' || filterData[key] === null || filterData[key] === undefined) {
        delete filterData[key];
      }
    });

    router.get(route('user-progress.index'), filterData, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  };

  // Handle delete
  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement?')) {
      router.delete(route('user-progress.destroy', id), {
        preserveScroll: true,
      });
    }
  };

  // Handle sorting
  const requestSort = (key) => {
    const newDirection = sortBy === key && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortBy(key);
    setSortDirection(newDirection);
    applyFilters({ sort_by: key, sort_direction: newDirection });
  };

  // Reset filters
  const resetFilters = () => {
    setSearch('');
    setSelectedUser('');
    setSelectedLesson('');
    setMinScore('');
    setMaxScore('');
    setDateFrom('');
    setDateTo('');
    setSortBy('created_at');
    setSortDirection('desc');
    setPerPage(10);
    router.get(route('user-progress.index'));
  };

  // Count active filters
  const activeFiltersCount = [selectedUser, selectedLesson, minScore, maxScore, dateFrom, dateTo].filter(Boolean).length;

  // Handle pagination
  const goToPage = (page) => {
    applyFilters({ page });
  };

  const SortIcon = ({ columnKey }) => (
    <HiArrowsUpDown className={`inline-block w-4 h-4 ml-1 ${sortBy === columnKey ? 'text-terracotta-500' : 'text-gray-400'}`} />
  );

  return (
    <AuthenticatedLayout
      header={
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Historique des Quiz
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {userprogress.total} tentative{userprogress.total !== 1 ? 's' : ''} enregistrée{userprogress.total !== 1 ? 's' : ''}
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <HiAdjustmentsHorizontal className="h-4 w-4 mr-2" />
            Filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Button>
        </div>
      }
    >
      <Head title="Historique" />

      <div className="space-y-6">
        {/* Search Bar */}
        <Card hover={false}>
          <Card.Body>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Rechercher par utilisateur, leçon ou quiz..."
              className="w-full max-w-md"
            />
          </Card.Body>
        </Card>

        {/* Advanced Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card hover={false}>
              <Card.Body>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filtres avancés</h3>
                  <button
                    onClick={resetFilters}
                    className="text-sm text-terracotta-600 hover:text-terracotta-700 dark:text-terracotta-500 dark:hover:text-terracotta-400 font-medium"
                  >
                    <HiXMark className="inline-block w-4 h-4 mr-1" />
                    Réinitialiser
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* User Filter (Admin only) */}
                  {user.role === 'admin' && users.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Utilisateur
                      </label>
                      <select
                        value={selectedUser}
                        onChange={(e) => {
                          setSelectedUser(e.target.value);
                          applyFilters({ user_id: e.target.value });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
                      >
                        <option value="">Tous les utilisateurs</option>
                        {users.map((u) => (
                          <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Lesson Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Leçon
                    </label>
                    <select
                      value={selectedLesson}
                      onChange={(e) => {
                        setSelectedLesson(e.target.value);
                        applyFilters({ lesson_id: e.target.value });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
                    >
                      <option value="">Toutes les leçons</option>
                      {lessons.map((lesson) => (
                        <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Min Score Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Score minimum
                    </label>
                    <input
                      type="number"
                      value={minScore}
                      onChange={(e) => setMinScore(e.target.value)}
                      onBlur={() => applyFilters({ min_score: minScore })}
                      placeholder="0"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
                    />
                  </div>

                  {/* Max Score Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Score maximum
                    </label>
                    <input
                      type="number"
                      value={maxScore}
                      onChange={(e) => setMaxScore(e.target.value)}
                      onBlur={() => applyFilters({ max_score: maxScore })}
                      placeholder="100"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
                    />
                  </div>

                  {/* Date From Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date de début
                    </label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => {
                        setDateFrom(e.target.value);
                        applyFilters({ date_from: e.target.value });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
                    />
                  </div>

                  {/* Date To Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date de fin
                    </label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => {
                        setDateTo(e.target.value);
                        applyFilters({ date_to: e.target.value });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
                    />
                  </div>

                  {/* Items per page */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Résultats par page
                    </label>
                    <select
                      value={perPage}
                      onChange={(e) => {
                        setPerPage(e.target.value);
                        applyFilters({ per_page: e.target.value });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </motion.div>
        )}

        {userprogress.data.length === 0 ? (
          <Card hover={false}>
            <EmptyState
              icon={HiClock}
              title="Aucun historique trouvé"
              description={search ? "Aucun résultat ne correspond à votre recherche." : "Aucune tentative de quiz n'a encore été enregistrée."}
            />
          </Card>
        ) : (
          <>
            {/* Desktop Table View */}
            <Card hover={false} className="hidden sm:block">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50">
                      <th
                        className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => requestSort('user.name')}
                      >
                        Utilisateur <SortIcon columnKey="user.name" />
                      </th>
                      <th
                        className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => requestSort('lesson.title')}
                      >
                        Leçon <SortIcon columnKey="lesson.title" />
                      </th>
                      <th
                        className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => requestSort('quizze.instructions')}
                      >
                        Quiz <SortIcon columnKey="quizze.instructions" />
                      </th>
                      <th
                        className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => requestSort('score')}
                      >
                        Score <SortIcon columnKey="score" />
                      </th>
                      <th
                        className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => requestSort('completed_at')}
                      >
                        Durée <SortIcon columnKey="completed_at" />
                      </th>
                      <th
                        className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => requestSort('created_at')}
                      >
                        Date <SortIcon columnKey="created_at" />
                      </th>
                      {user.role === 'admin' && (
                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {userprogress.data.map((progress, index) => (
                      <motion.tr
                        key={progress.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-terracotta-500 to-mocha-600 flex items-center justify-center text-white font-semibold text-sm">
                              {progress.user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {progress.user.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {progress.lesson?.title || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate">
                          {progress.quizze.instructions}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="primary" size="sm">
                            {progress.score} pts
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {new Intl.DateTimeFormat('fr-FR', {
                            minute: '2-digit',
                            second: '2-digit'
                          }).format(new Date(progress.completed_at * 1000))}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {new Intl.DateTimeFormat('fr-FR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          }).format(new Date(progress.created_at))}
                        </td>
                        {user.role === 'admin' && (
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleDelete(progress.id)}
                              className="p-2 text-terracotta-600 hover:text-terracotta-700 hover:bg-beige-200 dark:hover:bg-terracotta-900/20 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <HiTrash className="h-5 w-5" />
                            </button>
                          </td>
                        )}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Mobile Card View */}
            <div className="sm:hidden space-y-4">
              {userprogress.data.map((progress, index) => (
                <motion.div
                  key={progress.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card hover={false}>
                    <Card.Body>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-terracotta-500 to-mocha-600 flex items-center justify-center text-white font-semibold">
                            {progress.user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {progress.user.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Intl.DateTimeFormat('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              }).format(new Date(progress.created_at))}
                            </p>
                          </div>
                        </div>
                        <Badge variant="primary">{progress.score} pts</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-medium text-gray-900 dark:text-white">Leçon:</span> {progress.lesson?.title || '-'}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-medium text-gray-900 dark:text-white">Quiz:</span> {progress.quizze.instructions}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-medium text-gray-900 dark:text-white">Durée:</span>{' '}
                          {new Intl.DateTimeFormat('fr-FR', {
                            minute: '2-digit',
                            second: '2-digit'
                          }).format(new Date(progress.completed_at * 1000))}
                        </p>
                      </div>
                      {user.role === 'admin' && (
                        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(progress.id)}
                            className="w-full"
                          >
                            <HiTrash className="h-4 w-4 mr-2" />
                            Supprimer
                          </Button>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {userprogress.last_page > 1 && (
              <Card hover={false}>
                <Card.Body>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Page Info */}
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Affichage de <span className="font-semibold">{userprogress.from || 0}</span> à{' '}
                      <span className="font-semibold">{userprogress.to || 0}</span> sur{' '}
                      <span className="font-semibold">{userprogress.total}</span> résultats
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => goToPage(userprogress.current_page - 1)}
                        disabled={!userprogress.prev_page_url}
                      >
                        <HiChevronLeft className="h-4 w-4 mr-1" />
                        Précédent
                      </Button>

                      {/* Page Numbers */}
                      <div className="hidden sm:flex items-center gap-2">
                        {userprogress.links
                          .filter((link) => !isNaN(link.label))
                          .map((link) => (
                            <button
                              key={link.label}
                              onClick={() => goToPage(parseInt(link.label))}
                              disabled={link.active}
                              className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                                link.active
                                  ? 'bg-gradient-to-r from-terracotta-500 to-mocha-600 text-white shadow-md cursor-default'
                                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                            >
                              {link.label}
                            </button>
                          ))}
                      </div>

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => goToPage(userprogress.current_page + 1)}
                        disabled={!userprogress.next_page_url}
                      >
                        Suivant
                        <HiChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            )}
          </>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
