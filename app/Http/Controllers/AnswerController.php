<?php

namespace App\Http\Controllers;

use App\Http\Traits\HasCrudResponses;
use App\Models\Answer;
use App\Models\Question;
use Inertia\Inertia;
use Illuminate\Http\Request;

class AnswerController extends Controller
{
    use HasCrudResponses;
    /**
     * Display a listing of answers for a given question.
     */
    public function index($questionId)
    {
        $question = Question::findOrFail($questionId);
        $answers = $question->answers;

        return Inertia::render('Answers/Index', [
            'question' => $question,
            'answers' => $answers,
        ]);
    }

    /**
     * Show the form for creating a new answer.
     */
    public function create($questionId)
    {
        $question = Question::findOrFail($questionId);

        return Inertia::render('Answers/Create', [
            'question' => $question,
        ]);
    }

    /**
     * Store a newly created answer in storage.
     */
    public function store(Request $request, $questionId)
    {
        $question = Question::with('quizze')->findOrFail($questionId);

        $request->validate([
            'answer_text' => 'required|string',
            'is_correct'  => 'sometimes|boolean',
        ]);

        $answer = new Answer($request->all());
        $answer->question_id = $question->id;
        $answer->save();

        return $this->successResponse('Quizzezes.index', ['lesson' => $question->quizze->lesson_id], 'Answer created successfully.');
    }

    /**
     * Display the specified answer.
     */
    public function show($questionId, Answer $answer)
    {
        $question = Question::findOrFail($questionId);
        return Inertia::render('Answers/Show', [
            'question' => $question,
            'answer' => $answer,
        ]);
    }

    /**
     * Show the form for editing the specified answer.
     */
    public function edit($questionId, Answer $answer)
    {
        $question = Question::findOrFail($questionId);

        return Inertia::render('Answers/Edit', [
            'question' => $question,
            'answer' => $answer,
        ]);
    }

    /**
     * Update the specified answer in storage.
     */
    public function update(Request $request, $questionId, $answerid)
    {
        $question = Question::with('quizze')->findOrFail($questionId);
        $answer = Answer::findOrFail($answerid);
        $request->validate([
            'answer_text' => 'required|string',
            'is_correct'  => 'sometimes|boolean',
        ]);

        $answer->update($request->all());

        return $this->successResponse('Quizzezes.index', ['lesson' => $question->quizze->lesson_id], 'Answer updated successfully.');
    }

    /**
     * Remove the specified answer from storage.
     */
    public function destroy($questionId, $answerid)
    {
        $question = Question::with('quizze')->findOrFail($questionId);
        $answer = Answer::findOrFail($answerid);
        $answer->delete();

        return $this->successResponse('Quizzezes.index', ['lesson' => $question->quizze->lesson_id], 'Answer deleted successfully.');
    }
}
