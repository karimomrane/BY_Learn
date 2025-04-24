<?php

namespace App\Http\Controllers;

use App\Models\Quizze;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuizzeController extends Controller
{

    public function getAllQuizzes()
    {
        $quizzes = Quizze::with('lesson')->get();
        return response()->json($quizzes); // Ou Inertia::render(...) si c’est pour une vue
    }


    /**
     * Display the Quizze for a given lesson.
     */
    public function index($lessonId)
    {
        $lesson = Lesson::with('quizze')->findOrFail($lessonId);
        return Inertia::render('Quizzes/Index', [
            'lesson' => $lesson,
            'quizze' => $lesson->quizze // Assuming one quiz per lesson
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

        return redirect()->route('Quizzezes.index', $lesson->id)
                         ->with('success', 'Quiz created successfully.');
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

        return redirect()->route('Quizzezes.index', $lesson->id)
                         ->with('success', 'Quiz updated successfully.');
    }

    /**
     * Remove the specified Quizze from storage.
     */
    public function destroy($lessonId, $quizze)
    {
        $quiz = Quizze::findOrFail($quizze);
        $quiz->delete();
        return redirect()->route('Quizzezes.index', $lessonId)
                         ->with('success', 'Quiz deleted successfully.');
    }
}
