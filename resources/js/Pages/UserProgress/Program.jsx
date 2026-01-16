import React, { useState, useMemo } from "react";
import { router, useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { motion } from "framer-motion";
import "../styles.css";
import Quiz from "./Quiz";
import {
    HiTrophy,
    HiCheckCircle,
    HiClock,
    HiPlay,
    HiChartBar,
    HiAcademicCap,
    HiStar,
    HiUserGroup,
    HiLockClosed,
    HiCheckBadge
} from "react-icons/hi2";
import Badge from "@/Components/Badge";
import Card from "@/Components/Card";
export default function Program() {
    const { program, userprogress, rankbyprogram } = usePage().props;
    console.log('fdfdfdf', rankbyprogram);

    function formatDuration(seconds) {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return `${days > 0 ? `${days}d ` : ''}${hours}h ${minutes}m ${secs}s`;
    }
    const [expandedUser, setExpandedUser] = useState(null);
    // State for storing all answers keyed by question id.
    const [answers, setAnswers] = useState({});
    const [showModal, setShowModal] = useState(false); // State for showing/hiding the modal.
    const [selectedLesson, setSelectedLesson] = useState(null); // State for the currently selected lesson.
    const [showScore, setShowScore] = useState(false); // State for showing score after submission.
    const [scorePercentage, setScorePercentage] = useState(0); // State to store the percentage score.
    const [score, setScore] = useState(0); // State to store the raw score.
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // State for the current question index.
    const [results, setResults] = useState({}); // State to store correct and incorrect answers after submission.
    const [submit, setSubmit] = useState(false); // State to track if the quiz is submitted.
    const [quizStarted, setQuizStarted] = useState(false); // State to track if the quiz has started.
    const [timeElapsed, setTimeElapsed] = useState(0); // State to track the elapsed time in seconds.

    // Timer-related states
    const [startTime, setStartTime] = useState(null); // To store the start time.
    const [elapsedTime, setElapsedTime] = useState(0); // To store the elapsed time in seconds.
    const [timerRunning, setTimerRunning] = useState(false); // To check if the timer is running.

    // Initialize form data using useForm.
    const { data, setData } = useForm({
        lesson_id: null,
        score: 0,
        program_id: program.id,
        quiz_id: null,
        completed_at: null,
    });

    // Animation variants for the modal container.
    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
    };

    // Animation variants for the score display.
    const scoreVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    // Animation variants for each question transition.
    const questionVariants = {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
    };

    // Start the timer when the user clicks the "Start" button.
    const startTimer = () => {
        setStartTime(Date.now()); // Set the start time to the current time.
        setTimerRunning(true); // Set the timer as running.
    };

    // Handle answer selection.
    const handleAnswerChange = (questionId, answerId) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: answerId,
        }));
    };

    // Calculate the score and store results.
    const calculateScore = () => {
        let calculatedScore = 0;
        const results = {};

        console.log('Calculating score...');
        console.log('Answers:', answers);

        selectedLesson.quizze?.questions.forEach((question) => {
            const selectedAnswer = answers[question.id];
            const correctAnswer = question.answers.find((answer) => answer.is_correct === 1 || answer.is_correct === '1' || answer.is_correct === true);

            console.log(`Question ${question.id}:`, {
                selectedAnswer,
                correctAnswerId: correctAnswer?.id,
                correctAnswerData: correctAnswer,
                allAnswers: question.answers
            });

            // Convert both to numbers for proper comparison
            const selectedAnswerId = selectedAnswer ? Number(selectedAnswer) : null;
            const correctAnswerId = correctAnswer?.id ? Number(correctAnswer.id) : null;

            results[question.id] = {
                selectedAnswer: selectedAnswerId,
                correctAnswer: correctAnswerId,
                isCorrect: selectedAnswerId === correctAnswerId && selectedAnswerId !== null,
            };

            if (selectedAnswerId === correctAnswerId && selectedAnswerId !== null) {
                calculatedScore += 10;
                console.log(`✓ Correct! Score: +10`);
            } else {
                console.log(`✗ Incorrect. Selected: ${selectedAnswerId}, Correct: ${correctAnswerId}`);
            }
        });

        console.log('Final score:', calculatedScore);
        return { calculatedScore, results };
    };

    // Handle quiz submission.
    const handleSubmit = (e) => {
        setSubmit(true);

        if (e) e.preventDefault();

        // Calculate the score and results.
        const { calculatedScore, results } = calculateScore();
        const totalQuestions = selectedLesson.quizze?.questions.length;
        const percentage = ((calculatedScore / (totalQuestions * 10)) * 100).toFixed(2);

        // Update state with the calculated score and results.
        setScorePercentage(percentage);
        setScore(calculatedScore);
        setResults(results);

        // Stop the timer and show score immediately
        setTimerRunning(false);
        setQuizStarted(false);
        setShowScore(true); // Show the score immediately after calculation

        // Store the elapsed time before resetting
        const finalTimeElapsed = timeElapsed;

        // Update form data with the calculated score, selected lesson, and elapsed time.
        setData({
            ...data,
            lesson_id: selectedLesson.id,
            quiz_id: selectedLesson.quizze.id,
            score: calculatedScore,
            completed_at: finalTimeElapsed, // Save the elapsed time in seconds.
        });

        // Send the data to the backend.
        router.post(
            route("user-progress.store"),
            {
                lesson_id: selectedLesson.id,
                score: calculatedScore,
                program_id: program.id,
                quiz_id: selectedLesson.quizze.id,
                completed_at: finalTimeElapsed, // Include the elapsed time in the POST request.
            },
            {
                onSuccess: () => {
                    setSubmit(false);
                },
                onError: () => {
                    // Handle error - revert to quiz state if submission fails
                    setShowScore(false);
                    setQuizStarted(true);
                    setTimerRunning(true);
                    setSubmit(false);
                },
            }
        );
    };

    // When opening a lesson modal, reset quiz state.
    const openModal = (lesson) => {
        setSelectedLesson(lesson);
        setShowModal(true);
        setShowScore(false); // Reset score display when opening the modal.
        setAnswers({}); // Clear previous answers.
        setCurrentQuestionIndex(0); // Start at the first question.
        setResults({}); // Clear previous results.
        setStartTime(null); // Reset the start time.
        setElapsedTime(0); // Reset the elapsed time.
        setTimerRunning(false); // Reset the timer state.
    };

    // Close the modal and reset states.
    const closeModal = () => {
        setShowModal(false);
        setSelectedLesson(null);
        setShowScore(false);
        setSubmit(false);
        setTimerRunning(false);
        setTimeElapsed(0);
        setQuizStarted(false);
        setAnswers({});
        setCurrentQuestionIndex(0);
        setResults({});
    };

    // Handlers to navigate through questions.
    const handleNext = () => {
        if (currentQuestionIndex < selectedLesson.quizze.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    // Group ranking results by user (memoized to prevent recalculation on every render)
    const groupedRankings = useMemo(() => {
        return rankbyprogram.reduce((acc, rank) => {
            if (!acc[rank.user.id]) {
                acc[rank.user.id] = { ...rank, lessons: [] };
            }
            acc[rank.user.id].lessons.push({
                title: rank.lesson.title,
                score: rank.total_score,
                duration: rank.total_duration,
            });
            return acc;
        }, {});
    }, [rankbyprogram]);

    // Memoize user progress calculations by lesson
    const userProgressByLesson = useMemo(() => {
        const progressMap = {};
        userprogress.forEach(progress => {
            if (!progressMap[progress.lesson_id]) {
                progressMap[progress.lesson_id] = 0;
            }
            progressMap[progress.lesson_id] += progress.score || 0;
        });
        return progressMap;
    }, [userprogress]);

    return (
        <AuthenticatedLayout
            header={
                <div className="relative h-80 w-full p-0 m-0 overflow-hidden">
                    {/* Cover Photo with Enhanced Gradient Overlay */}
                    <motion.img
                        src={"/storage/" + program.image_path}
                        alt="Program Cover"
                        className="w-full h-full object-cover"
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.8 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>

                    {/* Program Header Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <Badge className="bg-gradient-to-r from-terracotta-500 to-mocha-500 text-white border-0">
                                    <HiAcademicCap className="h-4 w-4 mr-1" />
                                    Programme
                                </Badge>
                                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                                    {program.lessons.length} Lessons
                                </Badge>
                            </div>
                            <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 drop-shadow-lg">
                                {program.title}
                            </h2>
                            {program.description && (
                                <p className="text-white/90 text-sm sm:text-base max-w-3xl line-clamp-2 drop-shadow">
                                    {program.description}
                                </p>
                            )}
                        </motion.div>
                    </div>
                </div>
            }
        >
            {/* Lessons List */}
            <div className="container mx-auto px-4 py-8">
                {/* Section Header */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <HiAcademicCap className="h-7 w-7 text-mocha-500" />
                            Course Lessons
                        </h3>
                        <Badge className="bg-gradient-to-r from-terracotta-500 to-mocha-500 text-white border-0">
                            {program.lessons.length} Total
                        </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">Complete lessons to earn points and unlock achievements</p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {program.lessons.map((lesson, index) => {
                        const userLessonProgress = userProgressByLesson[lesson.id] || 0;
                        const isCompleted = userLessonProgress > 0;
                        const maxScore = lesson.quizze?.questions?.length ? lesson.quizze.questions.length * 10 : 100;
                        const progressPercentage = isCompleted ? (userLessonProgress / maxScore) * 100 : 0;

                        return (
                            <motion.div
                                key={lesson.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 border-0">
                                    {/* Background Pattern */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-terracotta-200 to-beige-200 dark:from-gray-800 dark:to-gray-900 opacity-50"></div>

                                    {/* Completion Badge */}
                                    {isCompleted && (
                                        <div className="absolute top-4 right-4 z-10">
                                            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full p-2 shadow-lg">
                                                <HiCheckBadge className="h-5 w-5" />
                                            </div>
                                        </div>
                                    )}

                                    <div className="relative p-6">
                                        {/* Lesson Number Badge */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="bg-gradient-to-r from-terracotta-500 to-mocha-500 text-white rounded-lg px-3 py-1 text-sm font-bold">
                                                Lesson {index + 1}
                                            </div>
                                        </div>

                                        {/* Lesson Title */}
                                        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-mocha-600 dark:group-hover:text-mocha-400 transition-colors line-clamp-2">
                                            {lesson.title}
                                        </h3>

                                        {/* Progress Section */}
                                        <div className="space-y-3 mb-4">
                                            {isCompleted ? (
                                                <>
                                                    {/* Score Display */}
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                                            <HiChartBar className="h-4 w-4" />
                                                            Your Score
                                                        </span>
                                                        <span className="font-bold text-green-600 dark:text-green-400">
                                                            {userLessonProgress}/{maxScore} pts
                                                        </span>
                                                    </div>

                                                    {/* Progress Bar */}
                                                    <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${progressPercentage}%` }}
                                                            transition={{ duration: 1, delay: index * 0.05 + 0.2 }}
                                                        />
                                                    </div>

                                                    {/* Completion Status */}
                                                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-semibold">
                                                        <HiCheckCircle className="h-5 w-5" />
                                                        Completed · {progressPercentage.toFixed(0)}%
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    {/* Not Started Badge */}
                                                    <div className="flex items-center gap-2 text-mocha-600 dark:text-mocha-400 text-sm font-semibold">
                                                        <HiClock className="h-5 w-5" />
                                                        Not Started
                                                    </div>
                                                    {lesson.quizze?.questions?.length > 0 && (
                                                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                                                            {lesson.quizze.questions.length} questions · {lesson.quizze.questions.length * 10} points
                                                        </p>
                                                    )}
                                                </>
                                            )}
                                        </div>

                                        {/* Action Button */}
                                        {isCompleted ? (
                                            <div className="flex items-center justify-center gap-2 py-3 px-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg font-semibold">
                                                <HiLockClosed className="h-4 w-4" />
                                                Completed
                                            </div>
                                        ) : (
                                            <motion.button
                                                onClick={() => openModal(lesson)}
                                                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-terracotta-500 to-mocha-500 text-white rounded-lg font-semibold hover:from-terracotta-600 hover:to-mocha-600 transition-all duration-200 shadow-md hover:shadow-lg"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <HiPlay className="h-5 w-5" />
                                                Start Lesson
                                            </motion.button>
                                        )}
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })}

                </div>

                {/* Leaderboard Section */}
                <motion.div
                    className="mt-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="border-0 shadow-xl overflow-hidden">
                        {/* Section Header */}
                        <div className="bg-gradient-to-r from-terracotta-500 to-mocha-500 p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                                        <HiTrophy className="h-7 w-7 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">
                                            Leaderboard
                                        </h3>
                                        <p className="text-white/90 text-sm">Top performers in this program</p>
                                    </div>
                                </div>
                                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                                    <HiUserGroup className="h-4 w-4 mr-1" />
                                    {Object.keys(groupedRankings).length} Users
                                </Badge>
                            </div>
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden md:block p-6">
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                                            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Rank</th>
                                            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">User</th>
                                            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Total Score</th>
                                            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Time Spent</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {Object.values(rankbyprogram).map((user, index) => {
                                            const rankColors = [
                                                'from-yellow-400 to-yellow-600', // 1st - Gold
                                                'from-gray-300 to-gray-500',     // 2nd - Silver
                                                'from-orange-400 to-orange-600'  // 3rd - Bronze
                                            ];
                                            const isTopThree = index < 3;

                                            return (
                                                <motion.tr
                                                    key={user.user.id}
                                                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                >
                                                    <td className="py-5 px-6">
                                                        {isTopThree ? (
                                                            <div className="flex items-center gap-2">
                                                                <div className={`bg-gradient-to-r ${rankColors[index]} text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg`}>
                                                                    {index + 1}
                                                                </div>
                                                                {index === 0 && <HiTrophy className="h-6 w-6 text-yellow-500" />}
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 font-semibold text-gray-600 dark:text-gray-400">
                                                                {index + 1}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="py-5 px-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-terracotta-500 to-mocha-500 flex items-center justify-center text-white font-bold text-sm">
                                                                {user.user.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-900 dark:text-white">{user.user.name}</p>
                                                                {user.user.poste && (
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.user.poste.designation}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-6">
                                                        <div className="flex items-center gap-2">
                                                            <HiStar className="h-5 w-5 text-mocha-500" />
                                                            <span className="font-bold text-gray-900 dark:text-white">{user.total_score}</span>
                                                            <span className="text-gray-500 dark:text-gray-400 text-sm">pts</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-6">
                                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                            <HiClock className="h-5 w-5" />
                                                            <span className="font-medium">{formatDuration(user.total_duration)}</span>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden p-4 space-y-3">
                            {Object.values(rankbyprogram).map((user, index) => {
                                const rankColors = [
                                    'from-yellow-400 to-yellow-600',
                                    'from-gray-300 to-gray-500',
                                    'from-orange-400 to-orange-600'
                                ];
                                const isTopThree = index < 3;

                                return (
                                    <motion.div
                                        key={user.user.id}
                                        className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <div className="flex items-start gap-3">
                                            {/* Rank Badge */}
                                            <div className="flex-shrink-0">
                                                {isTopThree ? (
                                                    <div className={`bg-gradient-to-r ${rankColors[index]} text-white w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-lg text-lg`}>
                                                        {index + 1}
                                                    </div>
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-semibold text-gray-600 dark:text-gray-400">
                                                        {index + 1}
                                                    </div>
                                                )}
                                            </div>

                                            {/* User Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-terracotta-500 to-mocha-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                                        {user.user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-bold text-gray-900 dark:text-white truncate">
                                                            {user.user.name}
                                                        </p>
                                                        {user.user.poste && (
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                                {user.user.poste.designation}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {index === 0 && (
                                                        <HiTrophy className="h-6 w-6 text-yellow-500 flex-shrink-0" />
                                                    )}
                                                </div>

                                                {/* Stats */}
                                                <div className="grid grid-cols-2 gap-3 mt-3">
                                                    <div className="bg-terracotta-100 dark:bg-mocha-900/20 rounded-lg p-2">
                                                        <div className="flex items-center gap-1 text-mocha-600 dark:text-mocha-400 text-xs mb-1">
                                                            <HiStar className="h-3 w-3" />
                                                            <span className="font-semibold">Score</span>
                                                        </div>
                                                        <p className="font-bold text-gray-900 dark:text-white text-sm">
                                                            {user.total_score} pts
                                                        </p>
                                                    </div>
                                                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
                                                        <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-xs mb-1">
                                                            <HiClock className="h-3 w-3" />
                                                            <span className="font-semibold">Time</span>
                                                        </div>
                                                        <p className="font-bold text-gray-900 dark:text-white text-sm">
                                                            {formatDuration(user.total_duration)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </Card>
                </motion.div>

            </div>



            {/* Quiz Modal */}
            {showModal && selectedLesson && (
                <Quiz
                    showModal={showModal}
                    selectedLesson={selectedLesson}
                    modalVariants={modalVariants}
                    questionVariants={questionVariants}
                    scoreVariants={scoreVariants}
                    handleBack={handleBack}
                    handleNext={handleNext}
                    handleSubmit={handleSubmit}
                    answers={answers}
                    handleAnswerChange={handleAnswerChange}
                    showScore={showScore}
                    submit={submit}
                    scorePercentage={scorePercentage}
                    score={score}
                    results={results}
                    currentQuestionIndex={currentQuestionIndex}
                    closeModal={closeModal}
                    startTimer={startTimer}
                    quizStarted={quizStarted}
                    timeElapsed={timeElapsed}
                    setQuizStarted={setQuizStarted}
                    setTimeElapsed={setTimeElapsed}
                />
            )}
        </AuthenticatedLayout>
    );
}
