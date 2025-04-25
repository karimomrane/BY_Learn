import { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { motion } from 'framer-motion';
import { FiPlus, FiMinus, FiUsers, FiBook, FiSearch, FiFilter, FiChevronRight } from 'react-icons/fi';
import axios from 'axios';

const AffectedUserQuiz = ({ quizzes, initialQuiz, initialAssignedUsers = [], initialUnassignedUsers = [] }) => {
    const [selectedQuiz, setSelectedQuiz] = useState(initialQuiz || null);
    const [assignedUsers, setAssignedUsers] = useState(initialAssignedUsers);
    const [unassignedUsers, setUnassignedUsers] = useState(initialUnassignedUsers);
    const [selectedUnassigned, setSelectedUnassigned] = useState([]);
    const [selectedAssigned, setSelectedAssigned] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(false);

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

            const matchesStatus =
                statusFilter === 'all' ||
                (user.status && user.status.toLowerCase() === statusFilter.toLowerCase());

            return matchesSearch && matchesRole && matchesStatus;
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

    // Assignment actions
    const handleAssign = async () => {
        if (selectedUnassigned.length === 0) return;

        try {
            await axios.post(`/quizze/${selectedQuiz.id}/assign-users`, {
                user_ids: selectedUnassigned.map(u => u.id)
            });
            await fetchUsersData(selectedQuiz.id);
            setSelectedUnassigned([]);
        } catch (error) {
            console.error('Error assigning users:', error);
        }
    };

    const handleUnassign = async () => {
        if (selectedAssigned.length === 0) return;

        try {
            await axios.post(`/quizze/${selectedQuiz.id}/unassign-users`, {
                user_ids: selectedAssigned.map(u => u.id)
            });
            await fetchUsersData(selectedQuiz.id);
            setSelectedAssigned([]);
        } catch (error) {
            console.error('Error unassigning users:', error);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Quiz User Assignment" />

            <div className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Quiz User Management</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Assign and unassign users to quizzes
                        </p>
                    </div>

                    {/* Quiz Selection Grid */}
                    <div className="mb-8">
                        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                            <FiBook className="mr-2" /> Select a Quiz
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {quizzes.map((quiz) => (
                                <motion.div
                                    key={quiz.id}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedQuiz?.id === quiz.id
                                        ? 'bg-indigo-50 border-indigo-300'
                                        : 'bg-white border-gray-200 hover:border-indigo-200'
                                        }`}
                                    onClick={() => setSelectedQuiz(quiz)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium text-gray-900">{quiz.title}</h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {quiz.lesson?.title || 'No lesson'}
                                            </p>
                                        </div>
                                        {selectedQuiz?.id === quiz.id && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                Selected
                                            </span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>


                    {selectedQuiz && !loading ? (
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            {/* Quiz Info Header */}
                            <div className="px-6 py-4 border-b border-gray-200 bg-indigo-50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-medium text-gray-900">
                                            {selectedQuiz.title} - User Assignment
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {assignedUsers.length} assigned users
                                        </p>
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={handleAssign}
                                            disabled={selectedUnassigned.length === 0}
                                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${selectedUnassigned.length > 0
                                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                }`}
                                        >
                                            <FiPlus className="mr-2" />
                                            Assign Selected
                                        </button>
                                        <button
                                            onClick={handleUnassign}
                                            disabled={selectedAssigned.length === 0}
                                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${selectedAssigned.length > 0
                                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                }`}
                                        >
                                            <FiMinus className="mr-2" />
                                            Unassign Selected
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Filters Section */}
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="relative flex-1 max-w-md">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiSearch className="text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="Search users..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="ml-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        <FiFilter className="mr-2" />
                                        Filters
                                        <FiChevronRight className={`ml-2 transition-transform ${showFilters ? 'rotate-90' : ''}`} />
                                    </button>
                                </div>

                                {showFilters && (
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                            <select
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                value={roleFilter}
                                                onChange={(e) => setRoleFilter(e.target.value)}
                                            >
                                                <option value="all">All Roles</option>
                                                <option value="admin">Admin</option>
                                                <option value="teacher">Teacher</option>
                                                <option value="student">Student</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                            <select
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                value={statusFilter}
                                                onChange={(e) => setStatusFilter(e.target.value)}
                                            >
                                                <option value="all">All Statuses</option>
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                                <option value="pending">Pending</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Users Tables */}
                            <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-gray-200">
                                {/* Unassigned Users */}
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                            <FiUsers className="mr-2 text-indigo-500" />
                                            Available Users ({filteredUnassigned.length})
                                        </h3>
                                        {selectedUnassigned.length > 0 && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                {selectedUnassigned.length} selected
                                            </span>
                                        )}
                                    </div>
                                    <div className="overflow-y-auto" style={{ maxHeight: '500px' }}>
                                        {filteredUnassigned.length > 0 ? (
                                            <ul className="divide-y divide-gray-200">
                                                {filteredUnassigned.map((user) => (
                                                    <motion.li
                                                        key={user.id}
                                                        whileHover={{ backgroundColor: '#f5f7fa' }}
                                                        className={`px-4 py-3 flex items-center cursor-pointer ${selectedUnassigned.some(u => u.id === user.id)
                                                            ? 'bg-indigo-50'
                                                            : 'bg-white'
                                                            }`}
                                                        onClick={() => toggleUnassignedSelection(user)}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedUnassigned.some(u => u.id === user.id)}
                                                            onChange={() => toggleUnassignedSelection(user)}
                                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-3"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                                {user.name}
                                                            </p>
                                                            <p className="text-sm text-gray-500 truncate">
                                                                {user.email}
                                                            </p>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            {user.role && (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                    {user.role}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="text-center py-8">
                                                <p className="text-gray-500">No available users match your criteria</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Assigned Users */}
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                            <FiUsers className="mr-2 text-green-500" />
                                            Assigned Users ({filteredAssigned.length})
                                        </h3>
                                        {selectedAssigned.length > 0 && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                {selectedAssigned.length} selected
                                            </span>
                                        )}
                                    </div>
                                    <div className="overflow-y-auto" style={{ maxHeight: '500px' }}>
                                        {filteredAssigned.length > 0 ? (
                                            <ul className="divide-y divide-gray-200">
                                                {filteredAssigned.map((user) => (
                                                    <motion.li
                                                        key={user.id}
                                                        whileHover={{ backgroundColor: '#f5f7fa' }}
                                                        className={`px-4 py-3 flex items-center cursor-pointer ${selectedAssigned.some(u => u.id === user.id)
                                                            ? 'bg-red-50'
                                                            : 'bg-white'
                                                            }`}
                                                        onClick={() => toggleAssignedSelection(user)}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedAssigned.some(u => u.id === user.id)}
                                                            onChange={() => toggleAssignedSelection(user)}
                                                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mr-3"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                                {user.name}
                                                            </p>
                                                            <p className="text-sm text-gray-500 truncate">
                                                                {user.email}
                                                            </p>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            {user.role && (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                    {user.role}
                                                                </span>
                                                            )}
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                Assigned
                                                            </span>
                                                        </div>
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="text-center py-8">
                                                <p className="text-gray-500">No users assigned to this quiz</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                    <div className="bg-white shadow rounded-lg overflow-hidden text-center py-12">
                        <div className="mx-auto max-w-md">
                            <FiBook className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No quiz selected</h3>
                            <p className="mt-1 text-sm text-gray-500">
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