import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiEye,
  HiCalendar,
  HiAcademicCap,
  HiCheckCircle,
  HiXCircle
} from 'react-icons/hi2';
import ConfirmDialog from '@/Components/ConfirmDialog';
import FlashMessage from '@/Components/FlashMessage';
import Button from '@/Components/Button';
import SearchInput from '@/Components/SearchInput';
import EmptyState from '@/Components/EmptyState';
import Badge from '@/Components/Badge';
import Card from '@/Components/Card';
import Table from '@/Components/Table';

export default function Index({ programmes: initialProgrammes }) {
  const { delete: destroy } = useForm();
  const { flash } = usePage().props;
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [programmeToDelete, setProgrammeToDelete] = useState(null);
  const programmesPerPage = 10;

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
    setProgrammeToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (programmeToDelete) {
      destroy(route('programmes.destroy', programmeToDelete));
      setProgrammeToDelete(null);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <AuthenticatedLayout
      header={
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Gestion des Programmes
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {filteredProgrammes.length} programme{filteredProgrammes.length !== 1 ? 's' : ''} trouvé{filteredProgrammes.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-stretch sm:items-center">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Rechercher un programme..."
              className="w-full sm:w-64"
            />
            {filteredProgrammes.length > programmesPerPage && (
              <div className="flex gap-1">
                {Array.from({ length: Math.ceil(filteredProgrammes.length / programmesPerPage) }, (_, i) => (
                  <Button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    variant={currentPage === i + 1 ? 'primary' : 'secondary'}
                    size="sm"
                    className="min-w-[2.5rem]"
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
            )}
            <Link href={route('programmes.create')}>
              <Button variant="primary" className="w-full sm:w-auto whitespace-nowrap">
                <HiPlus className="h-5 w-5 mr-2" />
                Nouveau Programme
              </Button>
            </Link>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {currentProgrammes.length === 0 ? (
          <Card>
            <EmptyState
              icon={HiAcademicCap}
              title="Aucun programme trouvé"
              description={searchTerm ? "Aucun programme ne correspond à votre recherche." : "Commencez par créer votre premier programme de formation."}
              action={() => window.location.href = route('programmes.create')}
              actionLabel="Créer un Programme"
            />
          </Card>
        ) : (
          <Card>
            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell className="w-16">#</Table.HeaderCell>
                    <Table.HeaderCell>Programme</Table.HeaderCell>
                    <Table.HeaderCell className="w-32">Session</Table.HeaderCell>
                    <Table.HeaderCell className="w-48">Dates</Table.HeaderCell>
                    <Table.HeaderCell align="right" className="w-64">Actions</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {currentProgrammes.map((programme, index) => (
                    <motion.tr
                      key={programme.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="group hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
                    >
                      <Table.Cell>
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-terracotta-500 to-mocha-500 text-white font-bold text-sm">
                          {indexOfFirstProgramme + index + 1}
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-start gap-4">
                          {/* Thumbnail */}
                          <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-beige-100 to-terracotta-200 dark:from-gray-700 dark:to-gray-600">
                            {programme.image_path ? (
                              <img
                                src={`/storage/${programme.image_path}`}
                                alt={programme.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <HiAcademicCap className="h-10 w-10 text-terracotta-300 dark:text-gray-500" />
                              </div>
                            )}
                          </div>
                          {/* Title & Description */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base text-gray-900 dark:text-white mb-1 line-clamp-1">
                              {programme.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                              {programme.description}
                            </p>
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge
                          variant={programme.controle ? 'warning' : 'primary'}
                          icon={programme.controle ? HiCheckCircle : HiXCircle}
                          size="md"
                        >
                          {programme.controle ? 'Contrôle' : 'Principale'}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <HiCalendar className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="font-medium mr-1">Début:</span>
                            <span>{new Date(programme.date_debut).toLocaleDateString('fr-FR')}</span>
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <HiCalendar className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="font-medium mr-1">Fin:</span>
                            <span>{new Date(programme.date_fin).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell align="right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={route('lessons.index', programme.id)}>
                            <Button variant="primary" size="sm">
                              <HiEye className="h-4 w-4 mr-1.5" />
                              Leçons
                            </Button>
                          </Link>
                          <Link href={route('programmes.edit', programme.id)}>
                            <Button variant="secondary" size="sm">
                              <HiPencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(programme.id)}
                          >
                            <HiTrash className="h-4 w-4" />
                          </Button>
                        </div>
                      </Table.Cell>
                    </motion.tr>
                  ))}
                </Table.Body>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden divide-y divide-gray-200 dark:divide-gray-700">
              {currentProgrammes.map((programme, index) => (
                <motion.div
                  key={programme.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {/* Mobile Card Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-terracotta-500 to-mocha-500 text-white font-bold text-sm flex items-center justify-center">
                      {indexOfFirstProgramme + index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base text-gray-900 dark:text-white mb-1">
                        {programme.title}
                      </h3>
                      <Badge
                        variant={programme.controle ? 'warning' : 'primary'}
                        icon={programme.controle ? HiCheckCircle : HiXCircle}
                        size="sm"
                      >
                        {programme.controle ? 'Contrôle' : 'Principale'}
                      </Badge>
                    </div>
                  </div>

                  {/* Thumbnail */}
                  {programme.image_path && (
                    <div className="mb-3 rounded-lg overflow-hidden h-40 bg-gradient-to-br from-beige-100 to-terracotta-200 dark:from-gray-700 dark:to-gray-600">
                      <img
                        src={`/storage/${programme.image_path}`}
                        alt={programme.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {programme.description}
                  </p>

                  {/* Dates */}
                  <div className="space-y-1 mb-4 text-sm">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <HiCalendar className="h-4 w-4 mr-2" />
                      <span className="font-medium mr-1">Début:</span>
                      <span>{new Date(programme.date_debut).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <HiCalendar className="h-4 w-4 mr-2" />
                      <span className="font-medium mr-1">Fin:</span>
                      <span>{new Date(programme.date_fin).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Link href={route('lessons.index', programme.id)} className="w-full">
                      <Button variant="primary" size="sm" className="w-full">
                        <HiEye className="h-4 w-4 mr-2" />
                        Voir Leçons
                      </Button>
                    </Link>
                    <div className="flex gap-2">
                      <Link href={route('programmes.edit', programme.id)} className="flex-1">
                        <Button variant="secondary" size="sm" className="w-full">
                          <HiPencil className="h-4 w-4 mr-2" />
                          Modifier
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(programme.id)}
                        className="flex-1"
                      >
                        <HiTrash className="h-4 w-4 mr-2" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Flash Messages */}
      {flash?.success && (
        <FlashMessage type="success" message={flash.success} />
      )}
      {flash?.error && (
        <FlashMessage type="error" message={flash.error} />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        show={showDeleteConfirm}
        title="Supprimer le programme"
        message="Êtes-vous sûr de vouloir supprimer ce programme ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setProgrammeToDelete(null);
        }}
      />
    </AuthenticatedLayout>
  );
}
