import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);
export default function Home({ programs }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [imageLoaded, setImageLoaded] = useState({});

    const filteredPrograms = programs.filter((program) =>
        program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const calculateDuration = (start, end) => {
        const startTime = dayjs(start);
        const endTime = dayjs(end);
        const diff = dayjs.duration(endTime.diff(startTime));

        return `${diff.days()}j ${diff.hours()}h ${diff.minutes()}m`;
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Welcome
                </h2>
            }
        >
            <Head title="Dashboard" />

            {/* Main Content */}
            <div className="py-4 sm:py-12">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Search Bar */}
                    <div className="mb-6 sm:mb-8 flex justify-center">
                        <motion.div
                            className="w-full max-w-md"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <input
                                type="text"
                                placeholder="Search programs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
                            />
                        </motion.div>
                    </div>

                    {/* Program Cards Grid */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredPrograms.length > 0 ? (
                            filteredPrograms.map(({ id, title, description, image_path, date_debut, date_fin, controle }) => (
                                <motion.div
                                    key={id}
                                    className="p-4 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-700 dark:border-gray-600"
                                    whileHover={{ scale: 1.05, rotate: 1 }}
                                    transition={{ duration: 0.3 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    {/* Image with Skeleton Loading */}
                                    <div className="mb-4 overflow-hidden rounded-lg">
                                        {!imageLoaded[id] && (
                                            <div className="w-full h-40 bg-gray-200 animate-pulse rounded-lg"></div>
                                        )}
                                        <motion.img
                                            src={`/storage/${image_path}`}
                                            alt={title}
                                            className={`w-full h-40 object-cover rounded-lg ${imageLoaded[id] ? "block" : "hidden"}`}
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.3 }}
                                            onLoad={() => setImageLoaded((prev) => ({ ...prev, [id]: true }))}
                                        />
                                    </div>

                                    {/* Program Details */}
                                    <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                        {title}
                                    </h5>
                                    <p className="mb-3 text-sm font-normal text-gray-700 dark:text-gray-400">{description}</p>

                                    {/* Program Duration */}
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-300">
                                        Durée : {calculateDuration(date_debut, date_fin)}
                                    </p>

                                    {/* Session Type */}
                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                                        {controle ? "Session Controle" : "Session Principale"}
                                    </p>

                                    <Link
                                        href={route("programs.show", id)}
                                        className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600"
                                    >
                                        Learn more
                                        <svg
                                            className="w-4 h-4 ml-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                        </svg>
                                    </Link>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full text-center text-gray-600 dark:text-gray-400">No programs found.</div>
                        )}
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
