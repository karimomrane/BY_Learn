<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\Quizze;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuestionController extends Controller
{
    /**
     * Display a listing of questions for a given Quizze.
     */
    public function index($quizId)
    {
        $quizze = Quizze::with('questions')->findOrFail($quizId);

        return Inertia::render('Questions/Index', [
            'quizze' => $quizze,
            'questions' => $quizze->questions,
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

        return redirect()->route('questions.index', $quizzeId)
                         ->with('success', 'Question created successfully.');
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
        $request->validate([
            'question_text' => 'required|string',
        ]);

        $question->update($request->all());

        return redirect()->route('questions.index', $quizzeId)
                         ->with('success', 'Question updated successfully.');
    }

    /**
     * Remove the specified question from storage.
     */
    public function destroy($quizzeId, Question $question)
    {
        $question->delete();

        return redirect()->route('questions.index', $quizzeId)
                         ->with('success', 'Question deleted successfully.');
    }
}
