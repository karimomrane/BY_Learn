import React, { useState, useEffect } from "react";
import { router, useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { motion } from "framer-motion";
import "../styles.css";
import Quiz from "./Quiz";

export default function Program() {
    const { program, userprogress } = usePage().props;

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
                        className="w-full h-full object-cover rounded-3xl"
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
