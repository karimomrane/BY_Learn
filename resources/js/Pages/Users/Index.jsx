import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { HiPlus, HiPencil, HiMagnifyingGlass, HiFunnel, HiXMark, HiUsers } from 'react-icons/hi2';

import Pagination from '@/Components/Pagination';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import Badge from '@/Components/Badge';
import EmptyState from '@/Components/EmptyState';

export default function Index({ users, postes, magasins, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole] = useState(filters.role || '');
    const [poste, setPoste] = useState(filters.poste || '');
    const [magasin, setMagasin] = useState(filters.magasin || '');
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('users.index'), {
            search,
            role,
            poste,
            magasin,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const resetFilters = () => {
        setSearch('');
        setRole('');
        setPoste('');
        setMagasin('');
        router.get(route('users.index'));
    };

    const hasActiveFilters = search || role || poste || magasin;

    const getRoleBadgeVariant = (role) => {
        switch (role) {
            case 'admin': return 'danger';
            case 'manager': return 'info';
            default: return 'success';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Gestion des Utilisateurs
                        </h2>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {users.total} utilisateur{users.total !== 1 ? 's' : ''} au total
                        </p>
                    </div>
                    <Link href={route('users.create')}>
                        <Button variant="primary">
                            <HiPlus className="h-5 w-5 mr-2" />
                            Nouvel Utilisateur
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title="Utilisateurs" />

            <div className="space-y-6">
                {/* Filters Section */}
                <Card hover={false}>
                    <Card.Body>
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                {/* Search Input */}
                                <div className="relative flex-1 w-full">
                                    <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Rechercher par nom ou téléphone..."
                                        className="w-full pl-11 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 transition-all"
                                    />
                                </div>

                                {/* Filter Toggle Button */}
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="relative"
                                >
                                    <HiFunnel className="h-5 w-5 mr-2" />
                                    Filtres
                                    {hasActiveFilters && (
                                        <span className="absolute -top-1 -right-1 h-3 w-3 bg-terracotta-500 rounded-full" />
                                    )}
                                </Button>

                                <Button type="submit" variant="primary">
                                    Rechercher
                                </Button>
                            </div>

                            {/* Expandable Filters */}
                            {showFilters && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="pt-4 border-t border-gray-100 dark:border-gray-700"
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                                Rôle
                                            </label>
                                            <select
                                                value={role}
                                                onChange={(e) => setRole(e.target.value)}
                                                className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500"
                                            >
                                                <option value="">Tous les rôles</option>
                                                <option value="admin">Admin</option>
                                                <option value="manager">Manager</option>
                                                <option value="employee">Employé</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                                Poste
                                            </label>
                                            <select
                                                value={poste}
                                                onChange={(e) => setPoste(e.target.value)}
                                                className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500"
                                            >
                                                <option value="">Tous les postes</option>
                                                {postes.map((p) => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                                Magasin
                                            </label>
                                            <select
                                                value={magasin}
                                                onChange={(e) => setMagasin(e.target.value)}
                                                className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500"
                                            >
                                                <option value="">Tous les magasins</option>
                                                {magasins.map((m) => (
                                                    <option key={m.id} value={m.id}>{m.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    {hasActiveFilters && (
                                        <div className="mt-4 flex justify-end">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={resetFilters}
                                            >
                                                <HiXMark className="h-4 w-4 mr-1" />
                                                Réinitialiser
                                            </Button>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </form>
                    </Card.Body>
                </Card>

                {/* Users Table */}
                <Card hover={false}>
                    {users.data.length > 0 ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-gray-700/50">
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                                Utilisateur
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                                Téléphone
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                                Poste
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                                Magasin
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                                Rôle
                                            </th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {users.data.map((user, index) => (
                                            <motion.tr
                                                key={user.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.03 }}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-terracotta-500 to-mocha-600 flex items-center justify-center text-white font-semibold">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="font-medium text-gray-900 dark:text-white">
                                                            {user.name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                                    {user.phonenumber}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                                    {user.email || '-'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                                    {user.poste?.name || '-'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                                    {user.magasin?.name || '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant={getRoleBadgeVariant(user.role)} size="sm">
                                                        {user.role || 'employee'}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Link href={route('users.edit', user.id)}>
                                                        <Button variant="secondary" size="sm">
                                                            <HiPencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {users.links && users.links.length > 3 && (
                                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700">
                                    <Pagination links={users.links} />
                                </div>
                            )}
                        </>
                    ) : (
                        <EmptyState
                            icon={HiUsers}
                            title="Aucun utilisateur trouvé"
                            description={hasActiveFilters ? "Aucun utilisateur ne correspond à vos critères de recherche." : "Commencez par ajouter votre premier utilisateur."}
                            action={() => window.location.href = route('users.create')}
                            actionLabel="Ajouter un utilisateur"
                        />
                    )}
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
