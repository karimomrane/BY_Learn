import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

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
    setTimeElapsed
}) {

    // Start the timer when the quiz starts.
    useEffect(() => {
        let interval;
        if (quizStarted) {
            interval = setInterval(() => {
                setTimeElapsed((prev) => prev + 1); // Increment the timer every second.
            }, 1000);
        }
        return () => clearInterval(interval); // Cleanup the interval on unmount.
    }, [quizStarted]);

    // Handle the "Start Quiz" button click.
    const handleStartQuiz = () => {
        setQuizStarted(true); // Start the quiz.
        startTimer(); // Start the parent timer (if needed).
    };

    return (
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
                        <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-white">
                            {selectedLesson.title}
                        </h2>
                        <div className="mb-6">
                            {/* Video */}
                            <video width="100%" controls className="h-96 rounded-lg">
                                <source src={"/storage/" + selectedLesson.video_path} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>

                        {/* Start Button (only shown if quiz hasn't started) */}
                        {!quizStarted && (
                            <button
                                onClick={handleStartQuiz}
                                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Start Quiz
                            </button>
                        )}

                        {/* Quiz Content (only shown if quiz has started) */}
                        {quizStarted && (
                            <>
                                {/* Timer Display */}
                                <div className="mb-6 text-lg font-semibold text-gray-800 dark:text-white">
                                    Time : {new Date(timeElapsed * 1000).toISOString().substr(11, 8)} seconds
                                </div>

                                {/* Quiz Questions */}
                                {!showScore ? (
                                    <div>
                                        {/* Display one question at a time with animation */}
                                        <AnimatePresence exitBeforeEnter>
                                            {selectedLesson.quizze?.questions && (
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
                                                                                selectedLesson.quizze.questions[
                                                                                    currentQuestionIndex
                                                                                ].id
                                                                            ] === answer.id
                                                                        }
                                                                        onChange={() =>
                                                                            handleAnswerChange(
                                                                                selectedLesson.quizze.questions[
                                                                                    currentQuestionIndex
                                                                                ].id,
                                                                                answer.id
                                                                            )
                                                                        }
                                                                        className="hidden"
                                                                    />
                                                                    <motion.div
                                                                        className={`p-4 rounded-lg cursor-pointer text-center transition-colors duration-300 ${
                                                                            answers[
                                                                                selectedLesson.quizze.questions[
                                                                                    currentQuestionIndex
                                                                                ].id
                                                                            ] === answer.id
                                                                                ? 'bg-blue-600 text-white shadow-lg'
                                                                                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
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
                                            {currentQuestionIndex < selectedLesson.quizze?.questions.length - 1 ? (
                                                <button
                                                    type="button"
                                                    onClick={handleNext}
                                                    disabled={
                                                        !answers[
                                                            selectedLesson.quizze?.questions[currentQuestionIndex].id
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
                                                    disabled={submit}
                                                    className="bg-green-600 dark:bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors duration-300 disabled:opacity-50"
                                                >
                                                    {submit ? 'Submitting...' : 'Submit Answers'}
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
                                        <h3 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-white">
                                            Test Completed!
                                        </h3>
                                        <p className="text-xl mb-4 text-gray-800 dark:text-white">
                                            Your Score:{' '}
                                            <span className="font-bold">
                                                {score}/{selectedLesson.quizze?.questions.length * 10}
                                            </span>
                                            <br />
                                            <span className="text-2xl font-bold">{scorePercentage}%</span>
                                        </p>

                                        {/* Display all answers with correct/incorrect highlights */}
                                        <div className="mt-8 text-left">
                                            {selectedLesson.quizze?.questions.map((question) => {
                                                const result = results[question.id];
                                                const correctAnswer = question.answers.find(
                                                    (answer) => answer.is_correct === 1
                                                );
                                                return (
                                                    <div key={question.id} className="mb-6">
                                                        <p className="font-semibold text-lg mb-2 text-gray-800 dark:text-white">
                                                            {question.question_text}
                                                        </p>
                                                        <ul className="space-y-2">
                                                            {question.answers.map((answer) => {
                                                                const isSelected = result?.selectedAnswer === answer.id;
                                                                const isCorrect = answer.id === correctAnswer.id;
                                                                return (
                                                                    <li
                                                                        key={answer.id}
                                                                        className={`p-3 rounded-lg ${
                                                                            isCorrect
                                                                                ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100'
                                                                                : isSelected
                                                                                ? 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100'
                                                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                                                        }`}
                                                                    >
                                                                        {answer.answer_text}
                                                                        {isCorrect && (
                                                                            <span className="ml-2 text-sm font-semibold">
                                                                                (Correct Answer)
                                                                            </span>
                                                                        )}
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <button
                                            onClick={closeModal}
                                            className="mt-6 bg-blue-600 dark:bg-blue-700 text-white py-3 px-6 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-300 text-lg"
                                        >
                                            Close
                                        </button>
                                    </motion.div>
                                )}
                            </>
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
    );
}
