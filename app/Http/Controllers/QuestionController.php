<?php

namespace App\Http\Controllers;

use App\Http\Traits\HasCrudResponses;
use App\Models\Question;
use App\Models\Quizze;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuestionController extends Controller
{
    use HasCrudResponses;
    /**
     * Display a listing of questions for a given Quizze.
     */
    public function index($quizId)
    {
        $quizze = Quizze::with(['questions', 'lesson.programme'])->findOrFail($quizId);

        return Inertia::render('Questions/Index', [
            'quizze' => $quizze,
            'questions' => $quizze->questions,
            'lesson' => $quizze->lesson,
            'programme' => $quizze->lesson->programme,
        ]);
    }

    /**
     * Show the form for creating a new question.
     */
    public function create($quizzeId)
    {
        $quizze = Quizze::findOrFail($quizzeId);
        return Inertia::render('Questions/Create', [
            'quizze' => $quizze
        ]);
    }

    /**
     * Store a newly created question in storage.
     */
    public function store(Request $request, $quizzeId)
    {
        $quizze = Quizze::findOrFail($quizzeId);

        $request->validate([
            'question_text' => 'required|string',
        ]);

        $quizze->questions()->create([
            'question_text' => $request->question_text
        ]);

        return $this->successResponse('Quizzezes.index', ['lesson' => $quizze->lesson_id], 'Question created successfully.');
    }

    /**
     * Show the form for editing the specified question.
     */
    public function edit($quizzeId, Question $question)
    {
        $quizze = Quizze::findOrFail($quizzeId);
        return Inertia::render('Questions/Edit', [
            'quizze' => $quizze,
            'question' => $question
        ]);
    }

    /**
     * Update the specified question in storage.
     */
    public function update(Request $request, $quizzeId, Question $question)
    {
        $quizze = Quizze::findOrFail($quizzeId);

        $request->validate([
            'question_text' => 'required|string',
        ]);

        $question->update($request->all());

        return $this->successResponse('Quizzezes.index', ['lesson' => $quizze->lesson_id], 'Question updated successfully.');
    }

    /**
     * Remove the specified question from storage.
     */
    public function destroy($quizzeId, Question $question)
    {
        $quizze = Quizze::findOrFail($quizzeId);
        $question->delete();

        return $this->successResponse('Quizzezes.index', ['lesson' => $quizze->lesson_id], 'Question deleted successfully.');
    }
}
