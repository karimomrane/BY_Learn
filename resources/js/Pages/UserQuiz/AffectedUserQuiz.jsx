import { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { motion } from 'framer-motion';
import { FiPlus, FiMinus, FiUsers, FiBook, FiSearch, FiFilter, FiChevronRight, FiCheck, FiX } from 'react-icons/fi';
import axios from 'axios';

const AffectedUserQuiz = ({ quizzes, initialQuiz, initialAssignedUsers = [], initialUnassignedUsers = [] }) => {
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

    // Get unique filter options
    const posteOptions = [...new Set(unassignedUsers.concat(assignedUsers).map(u => u.poste?.name).filter(Boolean))];
    const magasinOptions = [...new Set(unassignedUsers.concat(assignedUsers).map(u => u.magasin?.name).filter(Boolean))];

    // Load users when quiz is selected
    useEffect(() => {
        if (selectedQuiz) {
            fetchUsersData(selectedQuiz.id);
        }
    }, [selectedQuiz]);

    const fetchUsersData = async (quizId) => {
        setLoading(true);
        try {
            const response = await axios.get(`quizze/${quizId}/assigned-users`);
            setAssignedUsers(response.data.assignedUsers || []);
            setUnassignedUsers(response.data.unassignedUsers || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter logic
    const filterUsers = (users) => {
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
    };

    const filteredUnassigned = filterUsers(unassignedUsers);
    const filteredAssigned = filterUsers(assignedUsers);

    // Selection handlers
    const toggleUnassignedSelection = (user) => {
        setSelectedUnassigned(prev =>
            prev.some(u => u.id === user.id)
                ? prev.filter(u => u.id !== user.id)
                : [...prev, user]
        );
    };

    const toggleAssignedSelection = (user) => {
        setSelectedAssigned(prev =>
            prev.some(u => u.id === user.id)
                ? prev.filter(u => u.id !== user.id)
                : [...prev, user]
        );
    };

    // Select all/deselect all handlers
    const selectAllUnassigned = () => {
        if (selectedUnassigned.length === filteredUnassigned.length) {
            setSelectedUnassigned([]);
        } else {
            setSelectedUnassigned([...filteredUnassigned]);
        }
    };

    const selectAllAssigned = () => {
        if (selectedAssigned.length === filteredAssigned.length) {
            setSelectedAssigned([]);
        } else {
            setSelectedAssigned([...filteredAssigned]);
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
            setSelectedUnassigned([]);
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
            setSelectedAssigned([]);
        } catch (error) {
            console.error('Error unassigning users:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    // Loading spinner component
    const Loader = () => (
        <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 dark:border-indigo-400"></div>
        </div>
    );

    return (
        <AuthenticatedLayout header={
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Quiz User Assignment
                </h2>
            </div>
        }>
            <Head title="Quiz User Assignment" />

            <div className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quiz User Management</h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Assign and unassign users to quizzes
                        </p>
                    </div>

                    {/* Quiz Selection Grid */}
                    <div className="mb-8">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-4 flex items-center">
                            <FiBook className="mr-2" /> Select a Quiz
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {quizzes.map((quiz) => (
                                <motion.div
                                    key={quiz.id}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                                        selectedQuiz?.id === quiz.id
                                            ? 'bg-indigo-50 dark:bg-indigo-900 border-indigo-300 dark:border-indigo-700'
                                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-600'
                                    }`}
                                    onClick={() => setSelectedQuiz(quiz)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-white">{quiz.title}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                {quiz.lesson?.title || 'No lesson'}
                                            </p>
                                        </div>
                                        {selectedQuiz?.id === quiz.id && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-100">
                                                Selected
                                            </span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <Loader />
                    ) : selectedQuiz ? (
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                            {/* Quiz Info Header */}
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-indigo-50 dark:bg-indigo-900">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                                            {selectedQuiz.title} - User Assignment
                                        </h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            {assignedUsers.length} assigned users
                                        </p>
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={handleAssign}
                                            disabled={selectedUnassigned.length === 0 || isProcessing}
                                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                                                selectedUnassigned.length > 0
                                                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                                    : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-300 cursor-not-allowed'
                                            }`}
                                        >
                                            {isProcessing ? (
                                                <span className="flex items-center">
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Processing...
                                                </span>
                                            ) : (
                                                <>
                                                    <FiPlus className="mr-2" />
                                                    Assign Selected
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={handleUnassign}
                                            disabled={selectedAssigned.length === 0 || isProcessing}
                                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                                                selectedAssigned.length > 0
                                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                                    : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-300 cursor-not-allowed'
                                            }`}
                                        >
                                            {isProcessing ? (
                                                <span className="flex items-center">
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Processing...
                                                </span>
                                            ) : (
                                                <>
                                                    <FiMinus className="mr-2" />
                                                    Unassign Selected
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Filters Section */}
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div className="relative flex-1 max-w-md">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiSearch className="text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 sm:text-sm text-gray-900 dark:text-white"
                                            placeholder="Search users..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="ml-4 inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                                    >
                                        <FiFilter className="mr-2" />
                                        Filters
                                        <FiChevronRight className={`ml-2 transition-transform ${showFilters ? 'rotate-90' : ''}`} />
                                    </button>
                                </div>

                                {showFilters && (
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                                            <select
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                value={roleFilter}
                                                onChange={(e) => setRoleFilter(e.target.value)}
                                            >
                                                <option value="all">All Roles</option>
                                                <option value="admin">Admin</option>
                                                <option value="user">User</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Poste</label>
                                            <select
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                value={posteFilter}
                                                onChange={(e) => setPosteFilter(e.target.value)}
                                            >
                                                <option value="all">All Postes</option>
                                                {posteOptions.map(poste => (
                                                    <option key={poste} value={poste}>{poste}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Magasin</label>
                                            <select
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                value={magasinFilter}
                                                onChange={(e) => setMagasinFilter(e.target.value)}
                                            >
                                                <option value="all">All Magasins</option>
                                                {magasinOptions.map(magasin => (
                                                    <option key={magasin} value={magasin}>{magasin}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Users Tables */}
                            <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-gray-200 dark:divide-gray-700">
                                {/* Unassigned Users */}
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                                            <FiUsers className="mr-2 text-indigo-500" />
                                            Available Users ({filteredUnassigned.length})
                                        </h3>
                                        <div className="flex items-center space-x-2">
                                            {selectedUnassigned.length > 0 && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-100">
                                                    {selectedUnassigned.length} selected
                                                </span>
                                            )}
                                            <button
                                                onClick={selectAllUnassigned}
                                                className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                {selectedUnassigned.length === filteredUnassigned.length ? (
                                                    <>
                                                        <FiX className="inline mr-1" /> Deselect all
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiCheck className="inline mr-1" /> Select all
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="overflow-y-auto" style={{ maxHeight: '500px' }}>
                                        {filteredUnassigned.length > 0 ? (
                                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                                {filteredUnassigned.map((user) => (
                                                    <motion.li
                                                        key={user.id}
                                                        whileHover={{ backgroundColor: '#f5f7fa' }}
                                                        className={`px-4 py-3 flex items-center cursor-pointer ${
                                                            selectedUnassigned.some(u => u.id === user.id)
                                                                ? 'bg-indigo-50 dark:bg-indigo-900/50'
                                                                : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                        }`}
                                                        onClick={() => toggleUnassignedSelection(user)}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedUnassigned.some(u => u.id === user.id)}
                                                            onChange={() => toggleUnassignedSelection(user)}
                                                            className="h-4 w-4 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 border-gray-300 dark:border-gray-600 rounded mr-3"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                                {user.name}
                                                            </p>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                                {user.email}
                                                            </p>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            {user.role && (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100">
                                                                    {user.role}
                                                                </span>
                                                            )}
                                                            {user.poste?.name && (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100">
                                                                    {user.poste.name}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="text-center py-8">
                                                <p className="text-gray-500 dark:text-gray-400">No available users match your criteria</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Assigned Users */}
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                                            <FiUsers className="mr-2 text-green-500" />
                                            Assigned Users ({filteredAssigned.length})
                                        </h3>
                                        <div className="flex items-center space-x-2">
                                            {selectedAssigned.length > 0 && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100">
                                                    {selectedAssigned.length} selected
                                                </span>
                                            )}
                                            <button
                                                onClick={selectAllAssigned}
                                                className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                {selectedAssigned.length === filteredAssigned.length ? (
                                                    <>
                                                        <FiX className="inline mr-1" /> Deselect all
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiCheck className="inline mr-1" /> Select all
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="overflow-y-auto" style={{ maxHeight: '500px' }}>
                                        {filteredAssigned.length > 0 ? (
                                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                                {filteredAssigned.map((user) => (
                                                    <motion.li
                                                        key={user.id}
                                                        whileHover={{ backgroundColor: '#f5f7fa' }}
                                                        className={`px-4 py-3 flex items-center cursor-pointer ${
                                                            selectedAssigned.some(u => u.id === user.id)
                                                                ? 'bg-red-50 dark:bg-red-900/50'
                                                                : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                        }`}
                                                        onClick={() => toggleAssignedSelection(user)}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedAssigned.some(u => u.id === user.id)}
                                                            onChange={() => toggleAssignedSelection(user)}
                                                            className="h-4 w-4 text-red-600 dark:text-red-400 focus:ring-red-500 dark:focus:ring-red-400 border-gray-300 dark:border-gray-600 rounded mr-3"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                                {user.name}
                                                            </p>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                                {user.email}
                                                            </p>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            {user.role && (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100">
                                                                    {user.role}
                                                                </span>
                                                            )}
                                                            {user.magasin?.name && (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100">
                                                                    {user.magasin.name}
                                                                </span>
                                                            )}
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
                                                                Assigned
                                                            </span>
                                                        </div>
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="text-center py-8">
                                                <p className="text-gray-500 dark:text-gray-400">No users assigned to this quiz</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden text-center py-12">
                            <div className="mx-auto max-w-md">
                                <FiBook className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No quiz selected</h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Please select a quiz from the list above to manage user assignments
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default AffectedUserQuiz;
