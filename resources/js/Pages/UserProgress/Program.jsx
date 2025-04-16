import React, { useState } from "react";
import { router, useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { motion } from "framer-motion";
import "../styles.css";
import Quiz from "./Quiz";
import { FaStar, FaChevronDown, FaChevronUp } from "react-icons/fa";
export default function Program() {
    const { program, userprogress, rankbyprogram } = usePage().props;
    console.log(rankbyprogram);

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
        selectedLesson.quizze?.questions.forEach((question) => {
            const selectedAnswer = answers[question.id];
            const correctAnswer = question.answers.find((answer) => answer.is_correct === 1)?.id;
            results[question.id] = {
                selectedAnswer,
                correctAnswer,
                isCorrect: selectedAnswer === correctAnswer,
            };
            if (selectedAnswer === correctAnswer) {
                calculatedScore += 10;
            }
        });
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

        // Update form data with the calculated score, selected lesson, and elapsed time.
        setData({
            ...data,
            lesson_id: selectedLesson.id,
            quiz_id: selectedLesson.quizze.id,
            score: calculatedScore,
            completed_at: timeElapsed, // Save the elapsed time in seconds.
        });

        // Send the data to the backend.
        router.post(
            route("user-progress.store"),
            {
                lesson_id: selectedLesson.id,
                score: calculatedScore,
                program_id: program.id,
                quiz_id: selectedLesson.quizze.id,
                completed_at: timeElapsed, // Include the elapsed time in the POST request.
            },
            {
                onSuccess: () => {
                    setShowScore(true); // Show the score after a successful submission.
                    setSubmit(false);
                    setTimerRunning(false);
                    setTimeElapsed(0); // Reset the timer after a successful submission.
                    setQuizStarted(false); // Reset the quiz started state after a successful submission.
                },
                onError: () => {
                    // Handle error (for example, show an error message).
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
        setShowScore(false); // Reset score display when closing the modal.
        setShowScore(true); // Show the score after a successful submission.
        setSubmit(false);
        setTimerRunning(false);
        setTimeElapsed(0); // Reset the timer after a successful submission.
        setQuizStarted(false); // Reset the quiz started state after a successful submission.
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

    // Group ranking results by user
    const groupedRankings = rankbyprogram.reduce((acc, rank) => {
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

    return (
        <AuthenticatedLayout
            header={
                <div className="relative h-64 w-full p-0 m-0">
                    {/* Cover Photo with Gradient Overlay */}
                    <img
                        src={"/storage/" + program.image_path}
                        alt="Program Cover"
                        className="w-full h-full object-cover  rounded-t-3xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                    <h2 className="absolute bottom-4 left-4 text-white text-3xl font-bold">
                        {program.title}
                    </h2>
                </div>
            }
        >
            {/* Lessons List */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {program.lessons.map((lesson) => {
                        const userLessonProgress = userprogress.find(
                            (progress) => progress.lesson_id === lesson.id
                        );
                        return (
                            <motion.div
                                key={lesson.id}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{lesson.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                                        {userLessonProgress ? (
                                            <span className="text-green-600 dark:text-green-400 font-semibold">
                                                Score: {userLessonProgress.score}
                                            </span>
                                        ) : (
                                            <span className="text-yellow-600 dark:text-yellow-400 font-semibold">
                                                Not Completed
                                            </span>
                                        )}
                                    </p>

                                    <button
                                        onClick={() => openModal(lesson)}
                                        className="text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
                                    >
                                        View Lesson
                                    </button>

                                </div>
                            </motion.div>
                        );
                    })}

                </div>
                <div className="mt-8 p-6 bg-white shadow-lg rounded-lg dark:bg-gray-800">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Classement des Utilisateurs
                    </h3>

                    {/* Desktop Table View */}
                    <div className="hidden sm:block">
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white dark:bg-gray-900 shadow-md rounded-lg">
                                <thead>
                                    <tr className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
                                        <th className="py-3 px-6 text-left">#</th>
                                        <th className="py-3 px-6 text-left">Utilisateur</th>
                                        <th className="py-3 px-6 text-left">Score Total</th>
                                        <th className="py-3 px-6 text-left">Durée Totale</th>
                                        <th className="py-3 px-6 text-left">Détails</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.values(groupedRankings).map((user, index) => (
                                        <React.Fragment key={user.user.id}>
                                            <tr
                                                className="border-b hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                                onClick={() =>
                                                    setExpandedUser(expandedUser === user.user.id ? null : user.user.id)
                                                }
                                            >
                                                <td className="py-4 px-6 font-semibold">
                                                    {index === 0 ? (
                                                        <span className="text-yellow-500 text-xl">
                                                            🏆 {index + 1}
                                                        </span>
                                                    ) : (
                                                        `#${index + 1}`
                                                    )}
                                                </td>
                                                <td className="py-4 px-6 font-medium text-gray-800 dark:text-white flex items-center">
                                                    {user.user.name}
                                                    {expandedUser === user.user.id ? (
                                                        <FaChevronUp className="ml-2 text-gray-500" />
                                                    ) : (
                                                        <FaChevronDown className="ml-2 text-gray-500" />
                                                    )}
                                                </td>
                                                <td className="py-4 px-6 text-gray-600 dark:text-gray-300">
                                                    {user.total_score} pts
                                                </td>
                                                <td className="py-4 px-6 text-gray-600 dark:text-gray-300">
                                                    {formatDuration(user.total_duration)}
                                                </td>
                                                <td className="py-4 px-6 text-blue-600 dark:text-blue-400 font-semibold">
                                                    Voir détails
                                                </td>
                                            </tr>

                                            {/* Dropdown details for desktop */}
                                            {expandedUser === user.user.id && (
                                                <tr className="bg-gray-50 dark:bg-gray-800">
                                                    <td colSpan="5" className="p-4">
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: "auto" }}
                                                            transition={{ duration: 0.3 }}
                                                            className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700 shadow-md"
                                                        >
                                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                                Détails des leçons
                                                            </h4>
                                                            <ul className="space-y-2">
                                                                {user.lessons.map((lesson, i) => (
                                                                    <li
                                                                        key={i}
                                                                        className="flex justify-between p-2 bg-white dark:bg-gray-800 rounded-md shadow-md"
                                                                    >
                                                                        <span className="text-gray-800 dark:text-white">
                                                                            {lesson.title}
                                                                        </span>
                                                                        <span className="text-gray-600 dark:text-gray-300">
                                                                            {lesson.score} pts
                                                                        </span>
                                                                        <span className="text-gray-600 dark:text-gray-300">
                                                                            {formatDuration(lesson.duration)}
                                                                        </span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </motion.div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="sm:hidden space-y-4">
                        {Object.values(groupedRankings).map((user, index) => (
                            <div
                                key={user.user.id}
                                className="bg-white dark:bg-gray-800 p-4 shadow rounded-lg"
                            >
                                <div
                                    className="flex justify-between items-center cursor-pointer"
                                    onClick={() =>
                                        setExpandedUser(expandedUser === user.user.id ? null : user.user.id)
                                    }
                                >
                                    <div className="font-bold text-gray-900 dark:text-white">
                                        {index === 0 ? (
                                            <span className="text-yellow-500 text-xl">
                                                🏆 {index + 1}
                                            </span>
                                        ) : (
                                            `#${index + 1}`
                                        )}{" "}
                                        {user.user.name}
                                    </div>
                                    <div>
                                        {expandedUser === user.user.id ? (
                                            <FaChevronUp className="text-gray-500" />
                                        ) : (
                                            <FaChevronDown className="text-gray-500" />
                                        )}
                                    </div>
                                </div>

                                <div className="mt-2 text-gray-600 dark:text-gray-300">
                                    <p>
                                        <span className="font-semibold">Score Total:</span> {user.total_score} pts
                                    </p>
                                    <p>
                                        <span className="font-semibold">Durée Totale:</span>{" "}
                                        {formatDuration(user.total_duration)}
                                    </p>
                                </div>

                                <button
                                    onClick={() =>
                                        setExpandedUser(expandedUser === user.user.id ? null : user.user.id)
                                    }
                                    className="mt-2 text-blue-600 dark:text-blue-400 font-semibold"
                                >
                                    Voir détails
                                </button>

                                {expandedUser === user.user.id && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        transition={{ duration: 0.3 }}
                                        className="mt-2 p-4 rounded-lg bg-gray-100 dark:bg-gray-700 shadow"
                                    >
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                            Détails des leçons
                                        </h4>
                                        <ul className="space-y-2">
                                            {user.lessons.map((lesson, i) => (
                                                <li
                                                    key={i}
                                                    className="flex justify-between p-2 bg-white dark:bg-gray-800 rounded-md shadow"
                                                >
                                                    <span className="text-gray-800 dark:text-white">
                                                        {lesson.title}
                                                    </span>
                                                    <span className="text-gray-600 dark:text-gray-300">
                                                        {lesson.score} pts
                                                    </span>
                                                    <span className="text-gray-600 dark:text-gray-300">
                                                        {formatDuration(lesson.duration)}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

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
