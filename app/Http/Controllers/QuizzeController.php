<?php

namespace App\Http\Controllers;

use App\Http\Traits\HasCrudResponses;
use App\Models\Quizze;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuizzeController extends Controller
{
    use HasCrudResponses;

    /**
     * Display the Quizze for a given lesson with all questions and answers.
     */
    public function index($lessonId)
    {
        $lesson = Lesson::with([
            'quizze.questions.answers',
            'programme'
        ])->findOrFail($lessonId);

        return Inertia::render('Quizzes/Manage', [
            'lesson' => $lesson,
            'quizze' => $lesson->quizze,
            'programme' => $lesson->programme
        ]);
    }

    /**
     * Show the form for creating a new Quizze.
     */
    public function create($lessonId)
    {
        $lesson = Lesson::findOrFail($lessonId);
        return Inertia::render('Quizzes/Create', [
            'lesson' => $lesson
        ]);
    }

    /**
     * Store a newly created Quizze in storage.
     */
    public function store(Request $request, $lessonId)
    {
        $lesson = Lesson::findOrFail($lessonId);

        $request->validate([
            'instructions' => 'nullable|string',
        ]);

        $quizze = new Quizze($request->all());
        $quizze->lesson_id = $lesson->id;
        $quizze->save();

        return $this->successResponse('Quizzezes.index', ['lessonId' => $lesson->id], 'Quiz created successfully.');
    }

    /**
     * Display the specified Quizze.
     */
    public function show($lessonId, Quizze $quizze)
    {
        $lesson = Lesson::findOrFail($lessonId);
        return Inertia::render('Quizzes/Show', [
            'lesson' => $lesson,
            'quizze' => $quizze
        ]);
    }

    /**
     * Show the form for editing the specified Quizze.
     */
    public function edit($lessonId, $quizze)
    {
        $lesson = Lesson::findOrFail($lessonId);
        $quiz = Quizze::findOrFail($quizze);
        return Inertia::render('Quizzes/Edit', [
            'lesson' => $lesson,
            'quizze' => $quiz
        ]);
    }

    /**
     * Update the specified Quizze in storage.
     */
    public function update(Request $request, $lessonId, $quizze)
    {
        $lesson = Lesson::findOrFail($lessonId);

        $request->validate([
            'instructions' => 'nullable|string',
        ]);

        $quiz = Quizze::findOrFail($quizze);
        $quiz->update($request->all());

        return $this->successResponse('Quizzezes.index', ['lesson' => $lesson->id], 'Quiz updated successfully.');
    }

    /**
     * Remove the specified Quizze from storage.
     */
    public function destroy($lessonId, $quizze)
    {
        $quiz = Quizze::findOrFail($quizze);
        $quiz->delete();
        return $this->successResponse('Quizzezes.index', ['lessonId' => $lessonId], 'Quiz deleted successfully.');
    }
}
