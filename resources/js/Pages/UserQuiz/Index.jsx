import { useState, useEffect, useMemo } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiPlus,
    HiMinus,
    HiUsers,
    HiMagnifyingGlass,
    HiAdjustmentsHorizontal,
    HiChevronRight,
    HiCheck,
    HiXMark,
    HiUserGroup,
    HiCheckCircle,
    HiArrowPath,
    HiClipboardDocumentList
} from 'react-icons/hi2';
import axios from 'axios';
import Button from '@/Components/Button';
import Card from '@/Components/Card';
import Badge from '@/Components/Badge';
import SearchInput from '@/Components/SearchInput';
import Table from '@/Components/Table';

const Index = ({ quizzes, initialQuiz, initialAssignedUsers = [], initialUnassignedUsers = [] }) => {
    const { flash } = usePage().props;
    const [selectedQuiz, setSelectedQuiz] = useState(initialQuiz || null);
    const [assignedUsers, setAssignedUsers] = useState(initialAssignedUsers);
    const [unassignedUsers, setUnassignedUsers] = useState(initialUnassignedUsers);
    const [selectedUnassigned, setSelectedUnassigned] = useState([]);
    const [selectedAssigned, setSelectedAssigned] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [posteFilter, setPosteFilter] = useState('all');
    const [magasinFilter, setMagasinFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeTab, setActiveTab] = useState('unassigned');

    // Get unique filter options
    const posteOptions = useMemo(() =>
        [...new Set(unassignedUsers.concat(assignedUsers).map(u => u.poste?.name).filter(Boolean))],
        [unassignedUsers, assignedUsers]
    );

    const magasinOptions = useMemo(() =>
        [...new Set(unassignedUsers.concat(assignedUsers).map(u => u.magasin?.name).filter(Boolean))],
        [unassignedUsers, assignedUsers]
    );

    // Load users when quiz is selected
    useEffect(() => {
        if (selectedQuiz) {
            fetchUsersData(selectedQuiz.id);
        }
    }, [selectedQuiz]);

    const fetchUsersData = async (quizId) => {
        setLoading(true);
        try {
            const response = await axios.get(`/quizze/${quizId}/assigned-users`);
            setAssignedUsers(response.data.assignedUsers || []);
            setUnassignedUsers(response.data.unassignedUsers || []);
            setSelectedUnassigned([]);
            setSelectedAssigned([]);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter logic with memoization
    const filterUsers = useMemo(() => (users) => {
        return users.filter(user => {
            const matchesSearch =
                user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesRole =
                roleFilter === 'all' ||
                (user.role && user.role.toLowerCase() === roleFilter.toLowerCase());

            const matchesPoste =
                posteFilter === 'all' ||
                (user.poste?.name && user.poste.name === posteFilter);

            const matchesMagasin =
                magasinFilter === 'all' ||
                (user.magasin?.name && user.magasin.name === magasinFilter);

            return matchesSearch && matchesRole && matchesPoste && matchesMagasin;
        });
    }, [searchTerm, roleFilter, posteFilter, magasinFilter]);

    const filteredUnassigned = useMemo(() => filterUsers(unassignedUsers), [filterUsers, unassignedUsers]);
    const filteredAssigned = useMemo(() => filterUsers(assignedUsers), [filterUsers, assignedUsers]);

    // Selection handlers
    const toggleSelection = (user, isAssigned) => {
        if (isAssigned) {
            setSelectedAssigned(prev =>
                prev.some(u => u.id === user.id)
                    ? prev.filter(u => u.id !== user.id)
                    : [...prev, user]
            );
        } else {
            setSelectedUnassigned(prev =>
                prev.some(u => u.id === user.id)
                    ? prev.filter(u => u.id !== user.id)
                    : [...prev, user]
            );
        }
    };

    // Select all handlers
    const selectAll = (isAssigned) => {
        if (isAssigned) {
            setSelectedAssigned(
                selectedAssigned.length === filteredAssigned.length ? [] : [...filteredAssigned]
            );
        } else {
            setSelectedUnassigned(
                selectedUnassigned.length === filteredUnassigned.length ? [] : [...filteredUnassigned]
            );
        }
    };

    // Assignment actions
    const handleAssign = async () => {
        if (selectedUnassigned.length === 0) return;

        setIsProcessing(true);
        try {
            await axios.post(`/quizze/${selectedQuiz.id}/assign-users`, {
                user_ids: selectedUnassigned.map(u => u.id)
            });
            await fetchUsersData(selectedQuiz.id);
        } catch (error) {
            console.error('Error assigning users:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleUnassign = async () => {
        if (selectedAssigned.length === 0) return;

        setIsProcessing(true);
        try {
            await axios.post(`/quizze/${selectedQuiz.id}/unassign-users`, {
                user_ids: selectedAssigned.map(u => u.id)
            });
            await fetchUsersData(selectedQuiz.id);
        } catch (error) {
            console.error('Error unassigning users:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setRoleFilter('all');
        setPosteFilter('all');
        setMagasinFilter('all');
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: 'Gestion', href: '#' },
                { label: 'Assignations Quiz', href: '#' }
            ]}
            header={
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Assignations Quiz
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Gérer les affectations des utilisateurs aux quiz
                    </p>
                </div>
            }
        >
            <Head title="Assignations Quiz" />

            <div className="space-y-6">
                {/* Statistics Cards */}
                {selectedQuiz && !loading && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <Card.Body className="flex items-center gap-4">
                                <div className="p-3 bg-terracotta-100 dark:bg-mocha-900/30 rounded-lg">
                                    <HiUserGroup className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Utilisateurs</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {assignedUsers.length + unassignedUsers.length}
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Body className="flex items-center gap-4">
                                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                    <HiCheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Assignés</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {assignedUsers.length}
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Body className="flex items-center gap-4">
                                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                    <HiUsers className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Disponibles</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {unassignedUsers.length}
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Body className="flex items-center gap-4">
                                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                    <HiClipboardDocumentList className="h-8 w-8 text-mocha-600 dark:text-mocha-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Sélectionnés</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {selectedUnassigned.length + selectedAssigned.length}
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                )}

                {/* Quiz Selection */}
                <Card>
                    <Card.Header gradient>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                            <HiClipboardDocumentList className="h-5 w-5 mr-2 text-terracotta-500" />
                            Sélectionner un Quiz
                        </h3>
                    </Card.Header>
                    <Card.Body>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {quizzes.map((quiz) => (
                                <motion.div
                                    key={quiz.id}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                        selectedQuiz?.id === quiz.id
                                            ? 'border-terracotta-500 bg-beige-200 dark:bg-terracotta-900/20 shadow-md'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-terracotta-300 dark:hover:border-terracotta-600'
                                    }`}
                                    onClick={() => setSelectedQuiz(quiz)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                                {quiz.title || 'Quiz'}
                                            </h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                {quiz.lesson?.title || 'Aucune leçon'}
                                            </p>
                                        </div>
                                        {selectedQuiz?.id === quiz.id && (
                                            <Badge variant="success" icon={HiCheck} size="sm">
                                                Sélectionné
                                            </Badge>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </Card.Body>
                </Card>

                {/* User Management Section */}
                {loading ? (
                    <Card>
                        <Card.Body>
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-terracotta-200 border-t-terracotta-600"></div>
                            </div>
                        </Card.Body>
                    </Card>
                ) : selectedQuiz ? (
                    <Card>
                        {/* Actions Header */}
                        <div className="bg-gradient-to-r from-terracotta-500 to-mocha-500 px-6 py-4">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="text-white">
                                    <h3 className="text-lg font-bold">
                                        {selectedQuiz.title} - Gestion des Utilisateurs
                                    </h3>
                                    <p className="text-sm text-white/90 mt-1">
                                        {assignedUsers.length} utilisateur{assignedUsers.length !== 1 ? 's' : ''} assigné{assignedUsers.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        onClick={handleAssign}
                                        disabled={selectedUnassigned.length === 0 || isProcessing}
                                        className="bg-white hover:bg-gray-100 text-terracotta-600 font-semibold"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <HiArrowPath className="h-5 w-5 mr-2 animate-spin" />
                                                Traitement...
                                            </>
                                        ) : (
                                            <>
                                                <HiPlus className="h-5 w-5 mr-2" />
                                                Assigner ({selectedUnassigned.length})
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        onClick={handleUnassign}
                                        disabled={selectedAssigned.length === 0 || isProcessing}
                                        variant="danger"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <HiArrowPath className="h-5 w-5 mr-2 animate-spin" />
                                                Traitement...
                                            </>
                                        ) : (
                                            <>
                                                <HiMinus className="h-5 w-5 mr-2" />
                                                Retirer ({selectedAssigned.length})
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <SearchInput
                                        value={searchTerm}
                                        onChange={setSearchTerm}
                                        placeholder="Rechercher par nom ou email..."
                                        className="w-full"
                                    />
                                </div>
                                <Button
                                    variant="secondary"
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    <HiAdjustmentsHorizontal className="h-5 w-5 mr-2" />
                                    Filtres
                                    <HiChevronRight className={`h-5 w-5 ml-2 transition-transform ${showFilters ? 'rotate-90' : ''}`} />
                                </Button>
                            </div>

                            <AnimatePresence>
                                {showFilters && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4"
                                    >
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Rôle
                                            </label>
                                            <select
                                                className="w-full px-4 py-2 rounded-lg border-gray-300 dark:border-gray-600 focus:border-terracotta-500 focus:ring-terracotta-500 dark:bg-gray-700 dark:text-white"
                                                value={roleFilter}
                                                onChange={(e) => setRoleFilter(e.target.value)}
                                            >
                                                <option value="all">Tous les rôles</option>
                                                <option value="admin">Admin</option>
                                                <option value="user">Utilisateur</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Poste
                                            </label>
                                            <select
                                                className="w-full px-4 py-2 rounded-lg border-gray-300 dark:border-gray-600 focus:border-terracotta-500 focus:ring-terracotta-500 dark:bg-gray-700 dark:text-white"
                                                value={posteFilter}
                                                onChange={(e) => setPosteFilter(e.target.value)}
                                            >
                                                <option value="all">Tous les postes</option>
                                                {posteOptions.map(poste => (
                                                    <option key={poste} value={poste}>{poste}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Magasin
                                            </label>
                                            <select
                                                className="w-full px-4 py-2 rounded-lg border-gray-300 dark:border-gray-600 focus:border-terracotta-500 focus:ring-terracotta-500 dark:bg-gray-700 dark:text-white"
                                                value={magasinFilter}
                                                onChange={(e) => setMagasinFilter(e.target.value)}
                                            >
                                                <option value="all">Tous les magasins</option>
                                                {magasinOptions.map(magasin => (
                                                    <option key={magasin} value={magasin}>{magasin}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex items-end">
                                            <Button
                                                variant="secondary"
                                                onClick={clearFilters}
                                                className="w-full"
                                            >
                                                <HiXMark className="h-5 w-5 mr-2" />
                                                Réinitialiser
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Tabs */}
                        <div className="border-b border-gray-200 dark:border-gray-700">
                            <nav className="flex px-6 -mb-px">
                                <button
                                    onClick={() => setActiveTab('unassigned')}
                                    className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                                        activeTab === 'unassigned'
                                            ? 'border-terracotta-500 text-terracotta-600 dark:text-terracotta-400'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                    }`}
                                >
                                    Utilisateurs Disponibles ({filteredUnassigned.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab('assigned')}
                                    className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                                        activeTab === 'assigned'
                                            ? 'border-terracotta-500 text-terracotta-600 dark:text-terracotta-400'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                    }`}
                                >
                                    Utilisateurs Assignés ({filteredAssigned.length})
                                </button>
                            </nav>
                        </div>

                        {/* Users Table */}
                        <div className="p-6">
                            {activeTab === 'unassigned' ? (
                                <>
                                    {selectedUnassigned.length > 0 && (
                                        <div className="mb-4 flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                                {selectedUnassigned.length} utilisateur{selectedUnassigned.length !== 1 ? 's' : ''} sélectionné{selectedUnassigned.length !== 1 ? 's' : ''}
                                            </span>
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => setSelectedUnassigned([])}
                                            >
                                                Désélectionner tout
                                            </Button>
                                        </div>
                                    )}
                                    {filteredUnassigned.length > 0 ? (
                                        <Table>
                                            <Table.Header>
                                                <Table.Row>
                                                    <Table.HeaderCell className="w-12">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedUnassigned.length === filteredUnassigned.length}
                                                            onChange={() => selectAll(false)}
                                                            className="rounded border-gray-300 text-terracotta-600 focus:ring-terracotta-500"
                                                        />
                                                    </Table.HeaderCell>
                                                    <Table.HeaderCell>Utilisateur</Table.HeaderCell>
                                                    <Table.HeaderCell>Rôle</Table.HeaderCell>
                                                    <Table.HeaderCell>Poste</Table.HeaderCell>
                                                    <Table.HeaderCell>Magasin</Table.HeaderCell>
                                                </Table.Row>
                                            </Table.Header>
                                            <Table.Body>
                                                {filteredUnassigned.map((user) => (
                                                    <Table.Row
                                                        key={user.id}
                                                        className={selectedUnassigned.some(u => u.id === user.id) ? 'bg-beige-200 dark:bg-terracotta-900/20' : ''}
                                                    >
                                                        <Table.Cell>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedUnassigned.some(u => u.id === user.id)}
                                                                onChange={() => toggleSelection(user, false)}
                                                                className="rounded border-gray-300 text-terracotta-600 focus:ring-terracotta-500"
                                                            />
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <div>
                                                                <div className="font-medium text-gray-900 dark:text-white">
                                                                    {user.name}
                                                                </div>
                                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                    {user.email}
                                                                </div>
                                                            </div>
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {user.role && (
                                                                <Badge variant={user.role === 'admin' ? 'primary' : 'secondary'}>
                                                                    {user.role}
                                                                </Badge>
                                                            )}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {user.poste?.name || '-'}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {user.magasin?.name || '-'}
                                                        </Table.Cell>
                                                    </Table.Row>
                                                ))}
                                            </Table.Body>
                                        </Table>
                                    ) : (
                                        <div className="text-center py-12">
                                            <HiUsers className="mx-auto h-12 w-12 text-gray-400" />
                                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                                                Aucun utilisateur disponible
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                Aucun utilisateur ne correspond à vos critères
                                            </p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    {selectedAssigned.length > 0 && (
                                        <div className="mb-4 flex items-center justify-between p-3 bg-beige-200 dark:bg-terracotta-900/20 rounded-lg">
                                            <span className="text-sm font-medium text-mocha-700 dark:text-terracotta-100">
                                                {selectedAssigned.length} utilisateur{selectedAssigned.length !== 1 ? 's' : ''} sélectionné{selectedAssigned.length !== 1 ? 's' : ''}
                                            </span>
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => setSelectedAssigned([])}
                                            >
                                                Désélectionner tout
                                            </Button>
                                        </div>
                                    )}
                                    {filteredAssigned.length > 0 ? (
                                        <Table>
                                            <Table.Header>
                                                <Table.Row>
                                                    <Table.HeaderCell className="w-12">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedAssigned.length === filteredAssigned.length}
                                                            onChange={() => selectAll(true)}
                                                            className="rounded border-gray-300 text-terracotta-600 focus:ring-terracotta-500"
                                                        />
                                                    </Table.HeaderCell>
                                                    <Table.HeaderCell>Utilisateur</Table.HeaderCell>
                                                    <Table.HeaderCell>Rôle</Table.HeaderCell>
                                                    <Table.HeaderCell>Poste</Table.HeaderCell>
                                                    <Table.HeaderCell>Magasin</Table.HeaderCell>
                                                    <Table.HeaderCell>Statut</Table.HeaderCell>
                                                </Table.Row>
                                            </Table.Header>
                                            <Table.Body>
                                                {filteredAssigned.map((user) => (
                                                    <Table.Row
                                                        key={user.id}
                                                        className={selectedAssigned.some(u => u.id === user.id) ? 'bg-beige-200 dark:bg-terracotta-900/20' : ''}
                                                    >
                                                        <Table.Cell>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedAssigned.some(u => u.id === user.id)}
                                                                onChange={() => toggleSelection(user, true)}
                                                                className="rounded border-gray-300 text-terracotta-600 focus:ring-terracotta-500"
                                                            />
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <div>
                                                                <div className="font-medium text-gray-900 dark:text-white">
                                                                    {user.name}
                                                                </div>
                                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                    {user.email}
                                                                </div>
                                                            </div>
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {user.role && (
                                                                <Badge variant={user.role === 'admin' ? 'primary' : 'secondary'}>
                                                                    {user.role}
                                                                </Badge>
                                                            )}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {user.poste?.name || '-'}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {user.magasin?.name || '-'}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <Badge variant="success" icon={HiCheckCircle}>
                                                                Assigné
                                                            </Badge>
                                                        </Table.Cell>
                                                    </Table.Row>
                                                ))}
                                            </Table.Body>
                                        </Table>
                                    ) : (
                                        <div className="text-center py-12">
                                            <HiCheckCircle className="mx-auto h-12 w-12 text-gray-400" />
                                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                                                Aucun utilisateur assigné
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                Aucun utilisateur n'est assigné à ce quiz
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </Card>
                ) : (
                    <Card>
                        <Card.Body>
                            <div className="text-center py-12">
                                <HiClipboardDocumentList className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                                    Aucun quiz sélectionné
                                </h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Veuillez sélectionner un quiz ci-dessus pour gérer les assignations
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
