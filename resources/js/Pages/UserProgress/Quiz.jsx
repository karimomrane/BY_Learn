import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    HiXMark,
    HiChevronLeft,
    HiChevronRight,
    HiCheckCircle,
    HiXCircle,
    HiTrophy,
} from "react-icons/hi2";
import Badge from "@/Components/Badge";
import Card from "@/Components/Card";
import Button from "@/Components/Button";

export default function Quiz({
    showModal,
    selectedLesson,
    modalVariants,
    questionVariants,
    scoreVariants,
    handleBack,
    handleNext,
    handleSubmit,
    answers,
    handleAnswerChange,
    showScore,
    submit,
    scorePercentage,
    score,
    results,
    currentQuestionIndex,
    closeModal,
    startTimer,
    quizStarted,
    timeElapsed,
    setQuizStarted,
    setTimeElapsed,
}) {
    // Start the timer when the quiz starts with proper cleanup
    useEffect(() => {
        let interval;
        if (quizStarted && showModal && !showScore) {
            interval = setInterval(() => {
                setTimeElapsed((prev) => prev + 1);
            }, 1000);
        }

        // Cleanup: clear interval when component unmounts or when quiz stops
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [quizStarted, showModal, showScore, setTimeElapsed]);

    // Handle the "Start Quiz" button click.
    const handleStartQuiz = () => {
        setQuizStarted(true); // Start the quiz.
        startTimer(); // Start the parent timer (if needed).
    };

    // Format time to MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    };

    // Calculate total questions
    const totalQuestions = selectedLesson?.quizze?.questions?.length || 0;
    const answeredCount = Object.keys(answers).length;

    return (
        <AnimatePresence>
            {showModal && selectedLesson && (
                <motion.div
                    className="fixed inset-0 z-50 bg-[#E8DED3] dark:bg-gray-900"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="h-full w-full overflow-hidden flex flex-col">
                        {/* Header */}
                        <header className="bg-white dark:bg-gray-800 shadow-sm px-6 py-5 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                            <h1 className="text-2xl font-serif font-bold text-[#8B6F47] dark:text-gray-200">
                                {selectedLesson.title}
                            </h1>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                aria-label="Close Quiz"
                            >
                                <HiXMark className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                            </button>
                        </header>

                        {/* Main Content */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="max-w-[1400px] mx-auto p-6 lg:p-8">
                                <div className="max-w-[1400px] mx-auto p-6 lg:p-8">
                                    {showScore ? (
                                        /* Results Screen */
                                        <div className="max-w-5xl mx-auto">
                                            {/* Score Card */}
                                            <Card className="border border-gray-200 dark:border-gray-700 mb-8">
                                                <Card.Body className="p-8 sm:p-12 text-center">
                                                    <div className="w-24 h-24 rounded-full bg-[#C9A88A]/20 flex items-center justify-center mx-auto mb-6">
                                                        <div className="w-16 h-16 rounded-full bg-[#C9A88A] flex items-center justify-center">
                                                            <HiTrophy className="w-10 h-10 text-white" />
                                                        </div>
                                                    </div>

                                                    <h2 className="text-4xl font-serif font-bold text-gray-800 dark:text-gray-200 mb-4">
                                                        Quiz Complete!
                                                    </h2>

                                                    <div className="inline-flex items-center gap-4 px-8 py-4 bg-[#E8DED3] dark:bg-gray-700 rounded-xl mb-6">
                                                        <span className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                                                            Your Score:
                                                        </span>
                                                        <span className="text-4xl font-bold text-[#8B6F47] dark:text-[#C9A88A]">
                                                            {score}/
                                                            {totalQuestions *
                                                                10}
                                                        </span>
                                                    </div>

                                                    <div
                                                        className={`text-6xl font-bold mb-4 ${
                                                            scorePercentage >=
                                                            80
                                                                ? "text-green-600"
                                                                : scorePercentage >=
                                                                  60
                                                                ? "text-amber-600"
                                                                : "text-red-600"
                                                        }`}
                                                    >
                                                        {scorePercentage}%
                                                    </div>

                                                    <p
                                                        className={`text-xl font-medium ${
                                                            scorePercentage >=
                                                            80
                                                                ? "text-green-700 dark:text-green-400"
                                                                : scorePercentage >=
                                                                  60
                                                                ? "text-amber-700 dark:text-amber-400"
                                                                : "text-red-700 dark:text-red-400"
                                                        }`}
                                                    >
                                                        {scorePercentage >= 80
                                                            ? "🎉 Excellent work! Congratulations!"
                                                            : scorePercentage >=
                                                              60
                                                            ? "👍 Good job! Keep it up!"
                                                            : "💪 Keep learning, you'll get there!"}
                                                    </p>

                                                    {timeElapsed > 0 && (
                                                        <p className="text-gray-500 dark:text-gray-400 mt-4">
                                                            Time taken:{" "}
                                                            {formatTime(
                                                                timeElapsed
                                                            )}
                                                        </p>
                                                    )}
                                                </Card.Body>
                                            </Card>

                                            {/* Answer Review */}
                                            <div className="space-y-4">
                                                <h3 className="text-2xl font-serif font-bold text-gray-800 dark:text-gray-200 mb-6">
                                                    Answer Review
                                                </h3>

                                                {selectedLesson.quizze?.questions.map(
                                                    (question, index) => {
                                                        const result =
                                                            results[
                                                                question.id
                                                            ];
                                                        const correctAnswer =
                                                            question.answers?.find(
                                                                (answer) =>
                                                                    answer.is_correct ===
                                                                    1
                                                            );
                                                        const isCorrect =
                                                            result?.isCorrect;

                                                        return (
                                                            <Card
                                                                key={
                                                                    question.id
                                                                }
                                                                className="border border-gray-200 dark:border-gray-700"
                                                            >
                                                                <Card.Body className="p-6">
                                                                    <div className="flex items-start gap-3 mb-5">
                                                                        <div
                                                                            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                                                                                isCorrect
                                                                                    ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                                                                    : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                                                                            }`}
                                                                        >
                                                                            {isCorrect ? (
                                                                                <HiCheckCircle className="h-6 w-6" />
                                                                            ) : (
                                                                                <HiXCircle className="h-6 w-6" />
                                                                            )}
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <div className="flex items-center gap-2 mb-2">
                                                                                <span
                                                                                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                                                                        isCorrect
                                                                                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                                                                                            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                                                                                    }`}
                                                                                >
                                                                                    Question{" "}
                                                                                    {index +
                                                                                        1}
                                                                                </span>
                                                                            </div>
                                                                            <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
                                                                                {
                                                                                    question.question_text
                                                                                }
                                                                            </h4>

                                                                            <div className="space-y-2">
                                                                                {question.answers?.map(
                                                                                    (
                                                                                        answer
                                                                                    ) => {
                                                                                        const isSelected =
                                                                                            result?.selectedAnswer ===
                                                                                            answer.id;
                                                                                        const isCorrectAnswer =
                                                                                            correctAnswer &&
                                                                                            answer.id ===
                                                                                                correctAnswer.id;

                                                                                        return (
                                                                                            <div
                                                                                                key={
                                                                                                    answer.id
                                                                                                }
                                                                                                className={`p-4 rounded-lg border transition-all ${
                                                                                                    isCorrectAnswer
                                                                                                        ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700"
                                                                                                        : isSelected
                                                                                                        ? "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700"
                                                                                                        : "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                                                                                                }`}
                                                                                            >
                                                                                                <div className="flex items-center justify-between gap-3">
                                                                                                    <span
                                                                                                        className={`flex-1 ${
                                                                                                            isCorrectAnswer ||
                                                                                                            isSelected
                                                                                                                ? "font-medium text-gray-800 dark:text-gray-200"
                                                                                                                : "text-gray-600 dark:text-gray-400"
                                                                                                        }`}
                                                                                                    >
                                                                                                        {
                                                                                                            answer.answer_text
                                                                                                        }
                                                                                                    </span>
                                                                                                    {isCorrectAnswer && (
                                                                                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">
                                                                                                            Correct
                                                                                                            Answer
                                                                                                        </span>
                                                                                                    )}
                                                                                                    {isSelected &&
                                                                                                        !isCorrectAnswer && (
                                                                                                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300">
                                                                                                                Your
                                                                                                                Answer
                                                                                                            </span>
                                                                                                        )}
                                                                                                </div>
                                                                                            </div>
                                                                                        );
                                                                                    }
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Card.Body>
                                                            </Card>
                                                        );
                                                    }
                                                )}
                                            </div>

                                            {/* Close Button */}
                                            <div className="text-center mt-8">
                                                <Button
                                                    onClick={closeModal}
                                                    size="lg"
                                                    className="bg-[#C9A88A] hover:bg-[#B8977A] text-white px-8 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                                                >
                                                    Close Quiz
                                                </Button>
                                            </div>
                                        </div>
                                    ) : !quizStarted ? (
                                        /* Start Screen */
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            {/* Video Section */}
                                            <div>
                                                <Card className="overflow-hidden border border-gray-200 dark:border-gray-700">
                                                    <div className="bg-black">
                                                        <video
                                                            width="100%"
                                                            controls
                                                            className="w-full aspect-video object-contain"
                                                        >
                                                            <source
                                                                src={
                                                                    "/storage/" +
                                                                    selectedLesson.video_path
                                                                }
                                                                type="video/mp4"
                                                            />
                                                            Votre navigateur ne
                                                            supporte pas la
                                                            balise vidéo.
                                                        </video>
                                                    </div>
                                                    <Card.Body className="p-6">
                                                        <h2 className="text-xl font-serif font-bold text-gray-800 dark:text-gray-200 mb-3">
                                                            {
                                                                selectedLesson.title
                                                            }
                                                        </h2>
                                                        <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                                                            {selectedLesson.description ||
                                                                "Learn about this topic including key concepts and practical applications."}
                                                        </p>
                                                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                                            <span className="font-medium">
                                                                Duration:{" "}
                                                                {selectedLesson.duration ||
                                                                    "24:35"}
                                                            </span>
                                                            <span>•</span>
                                                            <span className="font-medium">
                                                                Module{" "}
                                                                {selectedLesson.module ||
                                                                    "2"}
                                                            </span>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </div>

                                            {/* Start Quiz Card */}
                                            <div>
                                                <Card className="border border-gray-200 dark:border-gray-700 h-full">
                                                    <Card.Body className="p-8 flex flex-col items-center justify-center text-center">
                                                        <div className="w-24 h-24 rounded-full bg-[#C9A88A]/20 flex items-center justify-center mb-6">
                                                            <div className="w-16 h-16 rounded-full bg-[#C9A88A] flex items-center justify-center">
                                                                <svg
                                                                    className="w-8 h-8 text-white"
                                                                    fill="currentColor"
                                                                    viewBox="0 0 20 20"
                                                                >
                                                                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <h2 className="text-3xl font-serif font-bold text-gray-800 dark:text-gray-200 mb-3">
                                                            Ready to Test Your
                                                            Knowledge?
                                                        </h2>
                                                        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                                                            Answer{" "}
                                                            {totalQuestions}{" "}
                                                            questions to
                                                            complete the quiz.
                                                            Take your time and
                                                            choose carefully!
                                                        </p>
                                                        <Button
                                                            onClick={
                                                                handleStartQuiz
                                                            }
                                                            size="lg"
                                                            className="bg-[#C9A88A] hover:bg-[#B8977A] text-white px-8 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                                                        >
                                                            Start Quiz
                                                        </Button>
                                                    </Card.Body>
                                                </Card>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Quiz Questions - Two Column Layout */
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            {/* Left Column - Video & Lesson Info */}
                                            <div>
                                                <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 sticky top-6">
                                                    <div className="bg-black">
                                                        <video
                                                            width="100%"
                                                            controls
                                                            className="w-full aspect-video object-contain"
                                                        >
                                                            <source
                                                                src={
                                                                    "/storage/" +
                                                                    selectedLesson.video_path
                                                                }
                                                                type="video/mp4"
                                                            />
                                                            Votre navigateur ne
                                                            supporte pas la
                                                            balise vidéo.
                                                        </video>
                                                    </div>
                                                    <Card.Body className="p-6">
                                                        <h2 className="text-xl font-serif font-bold text-gray-800 dark:text-gray-200 mb-3">
                                                            {
                                                                selectedLesson.title
                                                            }
                                                        </h2>
                                                        <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                                                            {selectedLesson.description ||
                                                                "Learn about this topic including key concepts and practical applications."}
                                                        </p>
                                                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                                            <span className="font-medium">
                                                                Duration:{" "}
                                                                {selectedLesson.duration ||
                                                                    "24:35"}
                                                            </span>
                                                            <span>•</span>
                                                            <span className="font-medium">
                                                                Module{" "}
                                                                {selectedLesson.module ||
                                                                    "2"}
                                                            </span>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </div>

                                            {/* Right Column - Quiz */}
                                            <div>
                                                <Card className="border border-gray-200 dark:border-gray-700">
                                                    <Card.Body className="p-6 sm:p-8">
                                                        {/* Header */}
                                                        <div className="mb-6">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <h2 className="text-2xl font-serif font-bold text-gray-800 dark:text-gray-200">
                                                                    Quiz Test
                                                                </h2>
                                                                {/* Timer Display */}
                                                                <div className="flex items-center gap-2 px-4 py-2 bg-[#C9A88A]/10 rounded-lg">
                                                                    <svg
                                                                        className="w-5 h-5 text-[#8B6F47]"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                        />
                                                                    </svg>
                                                                    <span className="text-lg font-mono font-semibold text-[#8B6F47]">
                                                                        {formatTime(timeElapsed)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                Answer all
                                                                questions to
                                                                complete the
                                                                quiz
                                                            </p>
                                                        </div>

                                                        {/* Progress Dots */}
                                                        <div className="flex items-center gap-2 mb-8">
                                                            {selectedLesson.quizze?.questions?.map(
                                                                (q, idx) => (
                                                                    <div
                                                                        key={
                                                                            q.id
                                                                        }
                                                                        className={`h-2 flex-1 rounded-full transition-all ${
                                                                            idx ===
                                                                            currentQuestionIndex
                                                                                ? "bg-[#C9A88A]"
                                                                                : idx <
                                                                                  currentQuestionIndex
                                                                                ? "bg-[#C9A88A]/50"
                                                                                : "bg-gray-200 dark:bg-gray-600"
                                                                        }`}
                                                                    />
                                                                )
                                                            )}
                                                        </div>

                                                        {/* Question */}
                                                        <AnimatePresence mode="wait">
                                                            {selectedLesson
                                                                .quizze
                                                                ?.questions && (
                                                                <motion.div
                                                                    key={
                                                                        selectedLesson
                                                                            .quizze
                                                                            .questions[
                                                                            currentQuestionIndex
                                                                        ].id
                                                                    }
                                                                    initial={{
                                                                        opacity: 0,
                                                                        x: 20,
                                                                    }}
                                                                    animate={{
                                                                        opacity: 1,
                                                                        x: 0,
                                                                    }}
                                                                    exit={{
                                                                        opacity: 0,
                                                                        x: -20,
                                                                    }}
                                                                    transition={{
                                                                        duration: 0.2,
                                                                    }}
                                                                >
                                                                    {/* Question Header */}
                                                                    <div className="flex items-start gap-4 mb-6">
                                                                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#C9A88A] flex items-center justify-center text-white font-bold text-lg">
                                                                            {currentQuestionIndex +
                                                                                1}
                                                                        </div>
                                                                        <div className="flex-1 pt-2">
                                                                            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
                                                                                {
                                                                                    selectedLesson
                                                                                        .quizze
                                                                                        .questions[
                                                                                        currentQuestionIndex
                                                                                    ]
                                                                                        .question_text
                                                                                }
                                                                            </h3>
                                                                        </div>
                                                                    </div>

                                                                    {/* Answer Options */}
                                                                    <div className="space-y-4 mb-8">
                                                                        {selectedLesson.quizze.questions[
                                                                            currentQuestionIndex
                                                                        ].answers.map(
                                                                            (
                                                                                answer
                                                                            ) => {
                                                                                const isSelected =
                                                                                    answers[
                                                                                        selectedLesson
                                                                                            .quizze
                                                                                            .questions[
                                                                                            currentQuestionIndex
                                                                                        ]
                                                                                            .id
                                                                                    ] ===
                                                                                    answer.id;

                                                                                return (
                                                                                    <label
                                                                                        key={
                                                                                            answer.id
                                                                                        }
                                                                                        className="flex items-start gap-3 cursor-pointer group"
                                                                                    >
                                                                                        <input
                                                                                            type="radio"
                                                                                            name={`question_${selectedLesson.quizze.questions[currentQuestionIndex].id}`}
                                                                                            value={
                                                                                                answer.id
                                                                                            }
                                                                                            checked={
                                                                                                isSelected
                                                                                            }
                                                                                            onChange={() =>
                                                                                                handleAnswerChange(
                                                                                                    selectedLesson
                                                                                                        .quizze
                                                                                                        .questions[
                                                                                                        currentQuestionIndex
                                                                                                    ]
                                                                                                        .id,
                                                                                                    answer.id
                                                                                                )
                                                                                            }
                                                                                            className="sr-only"
                                                                                        />
                                                                                        <div
                                                                                            className={`flex-shrink-0 w-5 h-5 rounded-full border-2 mt-0.5 transition-all ${
                                                                                                isSelected
                                                                                                    ? "border-[#C9A88A] border-[6px]"
                                                                                                    : "border-gray-300 dark:border-gray-600 group-hover:border-[#C9A88A]"
                                                                                            }`}
                                                                                        />
                                                                                        <span
                                                                                            className={`flex-1 text-base leading-relaxed transition-colors ${
                                                                                                isSelected
                                                                                                    ? "text-gray-800 dark:text-gray-200 font-medium"
                                                                                                    : "text-gray-600 dark:text-gray-400"
                                                                                            }`}
                                                                                        >
                                                                                            {
                                                                                                answer.answer_text
                                                                                            }
                                                                                        </span>
                                                                                    </label>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>

                                                        {/* Navigation */}
                                                        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                                                            <button
                                                                onClick={
                                                                    handleBack
                                                                }
                                                                disabled={
                                                                    currentQuestionIndex ===
                                                                    0
                                                                }
                                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                                                                    currentQuestionIndex ===
                                                                    0
                                                                        ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                                                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                }`}
                                                            >
                                                                <HiChevronLeft className="h-5 w-5" />
                                                                Previous
                                                            </button>

                                                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                                                Question{" "}
                                                                {currentQuestionIndex +
                                                                    1}{" "}
                                                                of{" "}
                                                                {totalQuestions}
                                                            </span>

                                                            {currentQuestionIndex <
                                                            totalQuestions -
                                                                1 ? (
                                                                <button
                                                                    onClick={
                                                                        handleNext
                                                                    }
                                                                    disabled={
                                                                        !answers[
                                                                            selectedLesson
                                                                                .quizze
                                                                                ?.questions[
                                                                                currentQuestionIndex
                                                                            ].id
                                                                        ]
                                                                    }
                                                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                                                                        !answers[
                                                                            selectedLesson
                                                                                .quizze
                                                                                ?.questions[
                                                                                currentQuestionIndex
                                                                            ].id
                                                                        ]
                                                                            ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                                                                            : "bg-[#C9A88A] hover:bg-[#B8977A] text-white"
                                                                    }`}
                                                                >
                                                                    Next
                                                                    <HiChevronRight className="h-5 w-5" />
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={
                                                                        handleSubmit
                                                                    }
                                                                    disabled={
                                                                        submit
                                                                    }
                                                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                                                        submit
                                                                            ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                                                                            : "bg-[#C9A88A] hover:bg-[#B8977A] text-white"
                                                                    }`}
                                                                >
                                                                    {submit
                                                                        ? "Submitting..."
                                                                        : "Submit"}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </Card.Body>

                                                    {/* Submit Button at Bottom */}
                                                    <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                                                        <button
                                                            onClick={
                                                                handleSubmit
                                                            }
                                                            disabled={
                                                                answeredCount <
                                                                    totalQuestions ||
                                                                submit
                                                            }
                                                            className={`w-full py-3 rounded-lg font-medium transition-all ${
                                                                answeredCount <
                                                                    totalQuestions ||
                                                                submit
                                                                    ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed"
                                                                    : "bg-[#C9A88A] hover:bg-[#B8977A] text-white shadow-md hover:shadow-lg"
                                                            }`}
                                                        >
                                                            Submit Quiz (
                                                            {answeredCount}/
                                                            {totalQuestions}{" "}
                                                            answered)
                                                        </button>
                                                    </div>
                                                </Card>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
