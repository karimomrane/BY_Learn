import React, { useState } from "react";
import { router, useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { motion, AnimatePresence } from "framer-motion";
import '../styles.css';

export default function Program() {
    const { program, userprogress } = usePage().props;

    // State for storing all answers keyed by question id.
    const [answers, setAnswers] = useState({});
    // State for showing/hiding the modal.
    const [showModal, setShowModal] = useState(false);
    // State for the currently selected lesson.
    const [selectedLesson, setSelectedLesson] = useState(null);
    // State for showing score after submission.
    const [showScore, setShowScore] = useState(false);
    // State to store the percentage score.
    const [scorePercentage, setScorePercentage] = useState(0);
    // (Optional) State to store the raw score.
    const [score, setScore] = useState(0);
    // NEW: State for the current question index (starting at 0).
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    // Initialize form data using useForm.
    const { data, setData } = useForm({
        lesson_id: null,
        score: 0,
        program_id: program.id,
        quiz_id: null,
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

    const handleAnswerChange = (questionId, answerId) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: answerId,
        }));
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();

        // Calculate the score based on selected answers.
        let calculatedScore = 0;
        selectedLesson.quizze.questions.forEach((question) => {
            const selectedAnswer = answers[question.id];
            const correctAnswer = question.answers.find(
                (answer) => answer.is_correct === 1
            )?.id;
            if (selectedAnswer === correctAnswer) {
                calculatedScore += 10;
            }
        });

        // Calculate the percentage score.
        const totalQuestions = selectedLesson.quizze.questions.length;
        const percentage = ((calculatedScore / (totalQuestions * 10)) * 100).toFixed(2);
        setScorePercentage(percentage);
        setScore(calculatedScore);

        // Update data using setData with the calculated score and selected lesson.
        setData({
            ...data,
            lesson_id: selectedLesson.id,
            quiz_id: selectedLesson.quizze.id,
            score: calculatedScore,
        });

        // Send the data to the backend.
        router.post(
            route("user-progress.store"),
            {
                lesson_id: selectedLesson.id,
                score: calculatedScore,
                program_id: program.id,
                quiz_id: selectedLesson.quizze.id,
            },
            {
                onSuccess: () => {
                    setShowScore(true); // Show the score after a successful submission.
                },
                onError: () => {
                    // Handle error (for example, show an error message)
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
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedLesson(null);
        setShowScore(false); // Reset score display when closing the modal.
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

    return (
        <AuthenticatedLayout
            header={
                <div className="relative h-64 w-full p-0 m-0">
                    {/* Cover Photo with Gradient Overlay */}
                    <img
                        src={"/storage/" + program.image_path}
                        alt="Program Cover"
                        className="w-full h-full object-cover"
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                    {userLessonProgress ? (
                                        <span className="text-gray-500 dark:text-gray-400">Completed</span>
                                    ) : (
                                        <button
                                            onClick={() => openModal(lesson)}
                                            className="text-blue-600 dark:text-blue-400 hover:underline"
                                        >
                                            View Lesson
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && selectedLesson && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white dark:bg-gray-800 p-8 rounded-lg max-w-4xl w-full h-[600px] overflow-auto custom-scrollbar relative"
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-white">{selectedLesson.title}</h2>
                            <div className="mb-6">
                                {/* Video */}
                                <video width="100%" controls className="h-96 rounded-lg">
                                    <source src={"/storage/" + selectedLesson.video_path} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>

                            {/* Quiz */}
                            {!showScore ? (
                                <div>
                                    {/* Display one question at a time with animation */}
                                    <AnimatePresence exitBeforeEnter>
                                        {selectedLesson.quizze.questions && (
                                            <motion.div
                                                key={selectedLesson.quizze.questions[currentQuestionIndex].id}
                                                variants={questionVariants}
                                                initial="initial"
                                                animate="animate"
                                                exit="exit"
                                            >
                                                <p className="font-semibold text-lg mb-6 text-gray-800 dark:text-white">
                                                    {selectedLesson.quizze.questions[currentQuestionIndex].question_text}
                                                </p>
                                                <ul className="grid grid-cols-2 gap-4">
                                                    {selectedLesson.quizze.questions[
                                                        currentQuestionIndex
                                                    ].answers.map((answer) => (
                                                        <motion.li
                                                            key={answer.id}
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <label className="block">
                                                                <input
                                                                    type="radio"
                                                                    name={`question_${selectedLesson.quizze.questions[currentQuestionIndex].id}`}
                                                                    value={answer.id}
                                                                    checked={
                                                                        answers[
                                                                        selectedLesson.quizze.questions[currentQuestionIndex].id
                                                                        ] === answer.id
                                                                    }
                                                                    onChange={() =>
                                                                        handleAnswerChange(
                                                                            selectedLesson.quizze.questions[currentQuestionIndex].id,
                                                                            answer.id
                                                                        )
                                                                    }
                                                                    className="hidden"
                                                                />
                                                                <motion.div
                                                                    className={`p-4 rounded-lg cursor-pointer text-center transition-colors duration-300 ${answers[selectedLesson.quizze.questions[currentQuestionIndex].id] === answer.id
                                                                            ? "bg-blue-600 text-white shadow-lg"
                                                                            : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                                                                        }`}
                                                                    initial={{ opacity: 0, y: 20 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    exit={{ opacity: 0, y: -20 }}
                                                                >
                                                                    {answer.answer_text}
                                                                </motion.div>
                                                            </label>
                                                        </motion.li>
                                                    ))}
                                                </ul>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Navigation Buttons */}
                                    <div className="flex justify-between mt-8">
                                        {currentQuestionIndex > 0 && (
                                            <button
                                                type="button"
                                                onClick={handleBack}
                                                className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white px-6 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors duration-300"
                                            >
                                                Previous
                                            </button>
                                        )}
                                        {currentQuestionIndex < selectedLesson.quizze.questions.length - 1 ? (
                                            <button
                                                type="button"
                                                onClick={handleNext}
                                                disabled={
                                                    !answers[
                                                    selectedLesson.quizze.questions[currentQuestionIndex].id
                                                    ]
                                                }
                                                className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-300 disabled:opacity-50"
                                            >
                                                Next
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleSubmit}
                                                disabled={
                                                    !answers[
                                                    selectedLesson.quizze.questions[currentQuestionIndex].id
                                                    ]
                                                }
                                                className="bg-green-600 dark:bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors duration-300 disabled:opacity-50"
                                            >
                                                Submit Answers
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                // Score display after quiz submission.
                                <motion.div
                                    className="text-center"
                                    variants={scoreVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <h3 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-white">Test Completed!</h3>
                                    <p className="text-xl mb-4 text-gray-800 dark:text-white">
                                        Your Score:{" "}
                                        <span className="font-bold">
                                            {score}/{selectedLesson.quizze.questions.length * 10}
                                        </span>
                                        <br />
                                        <span className="text-2xl font-bold">{scorePercentage}%</span>
                                    </p>
                                    <button
                                        onClick={closeModal}
                                        className="mt-6 bg-blue-600 dark:bg-blue-700 text-white py-3 px-6 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-300 text-lg"
                                    >
                                        Close
                                    </button>
                                </motion.div>
                            )}

                            {/* Close button for the modal */}
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-2xl"
                            >
                                X
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AuthenticatedLayout>
    );
}
