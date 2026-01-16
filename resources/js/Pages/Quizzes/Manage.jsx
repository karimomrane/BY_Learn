import { useState } from "react";
import { useForm, usePage, router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    HiPlus,
    HiPencil,
    HiTrash,
    HiChevronDown,
    HiChevronUp,
    HiCheckCircle,
    HiXCircle,
    HiQuestionMarkCircle,
    HiClipboardDocumentList,
} from "react-icons/hi2";
import { Switch } from '@headlessui/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Button from "@/Components/Button";
import Card from "@/Components/Card";
import Badge from "@/Components/Badge";
import ConfirmDialog from "@/Components/ConfirmDialog";
import FlashMessage from "@/Components/FlashMessage";

export default function Manage() {
    const { lesson, quizze, programme, flash } = usePage().props;
    const [expandedQuestions, setExpandedQuestions] = useState(new Set());
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [editingAnswer, setEditingAnswer] = useState(null);

    // Form for adding new question
    const { data: questionData, setData: setQuestionData, post: postQuestion, reset: resetQuestion, errors: questionErrors } = useForm({
        question_text: "",
    });

    // Form for editing question
    const { data: editQuestionData, setData: setEditQuestionData, put: putQuestion, errors: editQuestionErrors } = useForm({
        question_text: "",
    });

    // Form for adding new answer
    const { data: answerData, setData: setAnswerData, post: postAnswer, reset: resetAnswer, errors: answerErrors } = useForm({
        answer_text: "",
        is_correct: false,
        question_id: null,
    });

    // Form for editing answer
    const { data: editAnswerData, setData: setEditAnswerData, put: putAnswer, errors: editAnswerErrors } = useForm({
        answer_text: "",
        is_correct: false,
    });

    // Form for editing quiz instructions
    const { data: quizData, setData: setQuizData, put: putQuiz, processing: quizProcessing } = useForm({
        instructions: quizze?.instructions || "",
    });

    const toggleQuestion = (questionId) => {
        const newExpanded = new Set(expandedQuestions);
        if (newExpanded.has(questionId)) {
            newExpanded.delete(questionId);
        } else {
            newExpanded.add(questionId);
        }
        setExpandedQuestions(newExpanded);
    };

    const handleAddQuestion = (e) => {
        e.preventDefault();
        postQuestion(route("questions.store", quizze.id), {
            onSuccess: () => {
                resetQuestion();
            },
        });
    };

    const startEditQuestion = (question) => {
        setEditingQuestion(question.id);
        setEditQuestionData({ question_text: question.question_text });
    };

    const handleUpdateQuestion = (e, questionId) => {
        e.preventDefault();
        putQuestion(route("questions.update", [quizze.id, questionId]), {
            onSuccess: () => {
                setEditingQuestion(null);
            },
        });
    };

    const handleDeleteQuestion = (questionId) => {
        setDeleteTarget({ type: "question", id: questionId });
        setShowDeleteConfirm(true);
    };

    const handleAddAnswer = (e, questionId) => {
        e.preventDefault();
        postAnswer(route("answers.store", questionId), {
            onSuccess: () => {
                resetAnswer();
                setAnswerData("question_id", null);
            },
        });
    };

    const startEditAnswer = (answer, questionId) => {
        setEditingAnswer(answer.id);
        setEditAnswerData({
            answer_text: answer.answer_text,
            is_correct: answer.is_correct,
        });
    };

    const handleUpdateAnswer = (e, questionId, answerId) => {
        e.preventDefault();
        putAnswer(route("answers.update", [questionId, answerId]), {
            onSuccess: () => {
                setEditingAnswer(null);
            },
        });
    };

    const handleDeleteAnswer = (questionId, answerId) => {
        setDeleteTarget({ type: "answer", questionId, id: answerId });
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (deleteTarget) {
            if (deleteTarget.type === "question") {
                router.delete(route("questions.destroy", [quizze.id, deleteTarget.id]));
            } else if (deleteTarget.type === "answer") {
                router.delete(route("answers.destroy", [deleteTarget.questionId, deleteTarget.id]));
            }
        }
        setShowDeleteConfirm(false);
        setDeleteTarget(null);
    };

    const handleUpdateQuizInstructions = (e) => {
        e.preventDefault();
        putQuiz(route("Quizzezes.update", [lesson.id, quizze.id]));
    };

    if (!quizze) {
        return (
            <AuthenticatedLayout
                breadcrumbs={[
                    { label: "Programmes", href: route("programmes.index") },
                    { label: programme?.title || "Programme", href: route("lessons.index", lesson.programme_id) },
                    { label: lesson.title, href: "#" },
                ]}
                header={
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Gérer le Quiz
                    </h2>
                }
            >
                <Card>
                    <Card.Body>
                        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                            Aucun quiz n'est configuré pour cette leçon.
                        </p>
                    </Card.Body>
                </Card>
            </AuthenticatedLayout>
        );
    }

    const questions = quizze.questions || [];

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: "Programmes", href: route("programmes.index") },
                { label: programme?.title || "Programme", href: route("lessons.index", lesson.programme_id) },
                { label: lesson.title, href: route("Quizzezes.index", lesson.id) },
                { label: "Gérer le Quiz", href: "#" },
            ]}
            header={
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Gérer le Quiz - {lesson.title}
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {questions.length} question{questions.length !== 1 ? "s" : ""} configurée{questions.length !== 1 ? "s" : ""}
                    </p>
                </div>
            }
        >
            <div className="space-y-6">
                {flash?.success && <FlashMessage type="success" message={flash.success} />}
                {flash?.error && <FlashMessage type="error" message={flash.error} />}

                {/* Quiz Instructions Card */}
                <Card gradient>
                    <Card.Body>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-gradient-to-br from-terracotta-500 to-mocha-500 rounded-lg">
                                <HiClipboardDocumentList className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Instructions du Quiz
                                </h3>
                                <Badge variant="success" icon={HiCheckCircle} size="sm">
                                    Quiz actif
                                </Badge>
                            </div>
                        </div>

                        <form onSubmit={handleUpdateQuizInstructions} className="space-y-4">
                            <div>
                                <textarea
                                    value={quizData.instructions}
                                    onChange={(e) => setQuizData("instructions", e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border-gray-300 dark:border-gray-600 focus:border-terracotta-500 focus:ring-terracotta-500 dark:bg-gray-700 dark:text-white"
                                    rows={3}
                                    placeholder="Entrez les instructions du quiz..."
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" variant="primary" disabled={quizProcessing}>
                                    {quizProcessing ? "Enregistrement..." : "Mettre à jour les instructions"}
                                </Button>
                            </div>
                        </form>
                    </Card.Body>
                </Card>

                {/* Add New Question Card */}
                <Card>
                    <div className="bg-gradient-to-r from-terracotta-500 to-mocha-500 p-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                            <HiPlus className="h-6 w-6 mr-2" />
                            Ajouter une Question
                        </h3>
                        <form onSubmit={handleAddQuestion} className="space-y-4">
                            <div>
                                <textarea
                                    value={questionData.question_text}
                                    onChange={(e) => setQuestionData("question_text", e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white/50 dark:bg-gray-700 dark:text-white"
                                    rows={3}
                                    placeholder="Entrez le texte de la question..."
                                />
                                {questionErrors.question_text && (
                                    <p className="mt-2 text-sm text-white bg-terracotta-800/50 rounded px-3 py-1">
                                        {questionErrors.question_text}
                                    </p>
                                )}
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-white hover:bg-gray-100 text-terracotta-600 font-semibold py-3 shadow-lg"
                            >
                                Ajouter la Question
                            </Button>
                        </form>
                    </div>
                </Card>

                {/* Questions List */}
                <div className="space-y-4">
                    {questions.length === 0 ? (
                        <Card>
                            <Card.Body>
                                <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                                    Aucune question ajoutée. Créez votre première question ci-dessus.
                                </p>
                            </Card.Body>
                        </Card>
                    ) : (
                        questions.map((question, qIndex) => {
                            const isExpanded = expandedQuestions.has(question.id);
                            const answers = question.answers || [];

                            return (
                                <motion.div
                                    key={question.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2, delay: qIndex * 0.05 }}
                                >
                                    <Card className="overflow-hidden">
                                        {/* Question Header */}
                                        <div
                                            className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                            onClick={() => toggleQuestion(question.id)}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-terracotta-500 to-mocha-500 text-white font-bold text-sm flex items-center justify-center">
                                                    {qIndex + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    {editingQuestion === question.id ? (
                                                        <form
                                                            onSubmit={(e) => handleUpdateQuestion(e, question.id)}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="space-y-3"
                                                        >
                                                            <textarea
                                                                value={editQuestionData.question_text}
                                                                onChange={(e) =>
                                                                    setEditQuestionData("question_text", e.target.value)
                                                                }
                                                                className="w-full px-4 py-3 rounded-lg border-gray-300 dark:border-gray-600 focus:border-terracotta-500 focus:ring-terracotta-500 dark:bg-gray-700 dark:text-white"
                                                                rows={2}
                                                            />
                                                            {editQuestionErrors.question_text && (
                                                                <p className="text-sm text-terracotta-600 dark:text-terracotta-400">
                                                                    {editQuestionErrors.question_text}
                                                                </p>
                                                            )}
                                                            <div className="flex gap-2">
                                                                <Button type="submit" variant="primary" size="sm">
                                                                    Enregistrer
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    variant="secondary"
                                                                    size="sm"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setEditingQuestion(null);
                                                                    }}
                                                                >
                                                                    Annuler
                                                                </Button>
                                                            </div>
                                                        </form>
                                                    ) : (
                                                        <>
                                                            <div className="flex items-start justify-between gap-4">
                                                                <div className="flex items-start gap-3 flex-1">
                                                                    <HiQuestionMarkCircle className="h-6 w-6 text-terracotta-500 dark:text-terracotta-400 mt-0.5 flex-shrink-0" />
                                                                    <p className="text-base text-gray-900 dark:text-white leading-relaxed">
                                                                        {question.question_text}
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                                    <Button
                                                                        variant="secondary"
                                                                        size="sm"
                                                                        onClick={() => startEditQuestion(question)}
                                                                    >
                                                                        <HiPencil className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="danger"
                                                                        size="sm"
                                                                        onClick={() => handleDeleteQuestion(question.id)}
                                                                    >
                                                                        <HiTrash className="h-4 w-4" />
                                                                    </Button>
                                                                    {isExpanded ? (
                                                                        <HiChevronUp className="h-5 w-5 text-gray-500" />
                                                                    ) : (
                                                                        <HiChevronDown className="h-5 w-5 text-gray-500" />
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="mt-2 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                                                <span>{answers.length} réponse{answers.length !== 1 ? "s" : ""}</span>
                                                                <span>•</span>
                                                                <span>
                                                                    {answers.filter((a) => a.is_correct).length} correcte
                                                                    {answers.filter((a) => a.is_correct).length !== 1 ? "s" : ""}
                                                                </span>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Answers Section (Expandable) */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="border-t border-gray-200 dark:border-gray-700 overflow-hidden"
                                                >
                                                    <div className="p-6 bg-gray-50 dark:bg-gray-800/50 space-y-4">
                                                        {/* Add Answer Form */}
                                                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-dashed border-gray-300 dark:border-gray-600">
                                                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                                                Ajouter une Réponse
                                                            </h4>
                                                            <form
                                                                onSubmit={(e) => {
                                                                    setAnswerData("question_id", question.id);
                                                                    handleAddAnswer(e, question.id);
                                                                }}
                                                                className="space-y-3"
                                                            >
                                                                <div>
                                                                    <input
                                                                        type="text"
                                                                        value={
                                                                            answerData.question_id === question.id
                                                                                ? answerData.answer_text
                                                                                : ""
                                                                        }
                                                                        onChange={(e) => {
                                                                            setAnswerData("question_id", question.id);
                                                                            setAnswerData("answer_text", e.target.value);
                                                                        }}
                                                                        className="w-full px-4 py-2 rounded-lg border-gray-300 dark:border-gray-600 focus:border-terracotta-500 focus:ring-terracotta-500 dark:bg-gray-700 dark:text-white text-sm"
                                                                        placeholder="Texte de la réponse..."
                                                                    />
                                                                </div>
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                                                            Réponse correcte
                                                                        </span>
                                                                        <Switch
                                                                            checked={
                                                                                answerData.question_id === question.id &&
                                                                                answerData.is_correct
                                                                            }
                                                                            onChange={(checked) => {
                                                                                setAnswerData("question_id", question.id);
                                                                                setAnswerData("is_correct", checked);
                                                                            }}
                                                                            className={`${
                                                                                answerData.question_id === question.id &&
                                                                                answerData.is_correct
                                                                                    ? "bg-gradient-to-r from-terracotta-500 to-mocha-500"
                                                                                    : "bg-gray-300 dark:bg-gray-600"
                                                                            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                                                                        >
                                                                            <span
                                                                                className={`${
                                                                                    answerData.question_id === question.id &&
                                                                                    answerData.is_correct
                                                                                        ? "translate-x-6"
                                                                                        : "translate-x-1"
                                                                                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-md`}
                                                                            />
                                                                        </Switch>
                                                                    </div>
                                                                    <Button type="submit" variant="primary" size="sm">
                                                                        <HiPlus className="h-4 w-4 mr-1" />
                                                                        Ajouter
                                                                    </Button>
                                                                </div>
                                                            </form>
                                                        </div>

                                                        {/* Answers List */}
                                                        {answers.length === 0 ? (
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                                                                Aucune réponse ajoutée pour cette question
                                                            </p>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                {answers.map((answer, aIndex) => (
                                                                    <div
                                                                        key={answer.id}
                                                                        className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                                                                    >
                                                                        {editingAnswer === answer.id ? (
                                                                            <form
                                                                                onSubmit={(e) =>
                                                                                    handleUpdateAnswer(e, question.id, answer.id)
                                                                                }
                                                                                className="space-y-3"
                                                                            >
                                                                                <input
                                                                                    type="text"
                                                                                    value={editAnswerData.answer_text}
                                                                                    onChange={(e) =>
                                                                                        setEditAnswerData("answer_text", e.target.value)
                                                                                    }
                                                                                    className="w-full px-4 py-2 rounded-lg border-gray-300 dark:border-gray-600 focus:border-terracotta-500 focus:ring-terracotta-500 dark:bg-gray-700 dark:text-white text-sm"
                                                                                />
                                                                                <div className="flex items-center justify-between">
                                                                                    <div className="flex items-center gap-3">
                                                                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                                                                            Réponse correcte
                                                                                        </span>
                                                                                        <Switch
                                                                                            checked={editAnswerData.is_correct}
                                                                                            onChange={(checked) =>
                                                                                                setEditAnswerData("is_correct", checked)
                                                                                            }
                                                                                            className={`${
                                                                                                editAnswerData.is_correct
                                                                                                    ? "bg-gradient-to-r from-terracotta-500 to-mocha-500"
                                                                                                    : "bg-gray-300 dark:bg-gray-600"
                                                                                            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                                                                                        >
                                                                                            <span
                                                                                                className={`${
                                                                                                    editAnswerData.is_correct
                                                                                                        ? "translate-x-6"
                                                                                                        : "translate-x-1"
                                                                                                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-md`}
                                                                                            />
                                                                                        </Switch>
                                                                                    </div>
                                                                                    <div className="flex gap-2">
                                                                                        <Button type="submit" variant="primary" size="sm">
                                                                                            Enregistrer
                                                                                        </Button>
                                                                                        <Button
                                                                                            type="button"
                                                                                            variant="secondary"
                                                                                            size="sm"
                                                                                            onClick={() => setEditingAnswer(null)}
                                                                                        >
                                                                                            Annuler
                                                                                        </Button>
                                                                                    </div>
                                                                                </div>
                                                                            </form>
                                                                        ) : (
                                                                            <div className="flex items-center justify-between">
                                                                                <div className="flex items-center gap-3 flex-1">
                                                                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-semibold text-sm flex items-center justify-center">
                                                                                        {aIndex + 1}
                                                                                    </div>
                                                                                    <p className="text-sm text-gray-900 dark:text-white flex-1">
                                                                                        {answer.answer_text}
                                                                                    </p>
                                                                                    {answer.is_correct ? (
                                                                                        <Badge variant="success" icon={HiCheckCircle} size="sm">
                                                                                            Correcte
                                                                                        </Badge>
                                                                                    ) : (
                                                                                        <Badge variant="danger" icon={HiXCircle} size="sm">
                                                                                            Incorrecte
                                                                                        </Badge>
                                                                                    )}
                                                                                </div>
                                                                                <div className="flex items-center gap-2 ml-4">
                                                                                    <Button
                                                                                        variant="secondary"
                                                                                        size="sm"
                                                                                        onClick={() => startEditAnswer(answer, question.id)}
                                                                                    >
                                                                                        <HiPencil className="h-3 w-3" />
                                                                                    </Button>
                                                                                    <Button
                                                                                        variant="danger"
                                                                                        size="sm"
                                                                                        onClick={() =>
                                                                                            handleDeleteAnswer(question.id, answer.id)
                                                                                        }
                                                                                    >
                                                                                        <HiTrash className="h-3 w-3" />
                                                                                    </Button>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </Card>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                show={showDeleteConfirm}
                title={deleteTarget?.type === "question" ? "Supprimer la question" : "Supprimer la réponse"}
                message={
                    deleteTarget?.type === "question"
                        ? "Êtes-vous sûr de vouloir supprimer cette question ? Toutes les réponses associées seront également supprimées."
                        : "Êtes-vous sûr de vouloir supprimer cette réponse ?"
                }
                confirmText="Supprimer"
                cancelText="Annuler"
                type="danger"
                onConfirm={confirmDelete}
                onCancel={() => {
                    setShowDeleteConfirm(false);
                    setDeleteTarget(null);
                }}
            />
        </AuthenticatedLayout>
    );
}
