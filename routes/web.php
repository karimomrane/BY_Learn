<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProgrammeController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\QuizzeController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\AnswerController;
use App\Http\Controllers\AssignUserQuizController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserProgressController;
use App\Models\Programme;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/home', function () {
    $programs = Programme::whereRaw('? BETWEEN date_debut AND date_fin', [now()->addHour(1)])
        ->orderBy('created_at', 'desc')
        ->get();


    return Inertia::render('Home')->with('programs', $programs);
})->middleware(['auth', 'verified'])->name('home');

Route::get('/dashboard', [UserProgressController::class, 'dashboard'])->middleware(['auth', 'verified'])->name('dashboard');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('programmes', ProgrammeController::class);

    Route::group(['prefix' => 'programmes/{programme}'], function () {
        Route::resource('lessons', LessonController::class);
    });

    Route::group(['prefix' => 'lessons/{lesson}'], function () {
        Route::resource('Quizzezes', QuizzeController::class);
    });

    Route::group(['prefix' => 'Quizzezes/{Quizze}'], function () {
        Route::resource('questions', QuestionController::class);
    });


    Route::group(['prefix' => 'questions/{question}'], function () {
        Route::resource('answers', AnswerController::class);
    });

    Route::resource('users', UserController::class);


    // **** AssignUserQuiz controller routes *****//

    Route::get('/quiz-user-assignment', [AssignUserQuizController::class, 'index'])
        ->name('quiz.user.assignment');

    Route::get('/quizze/{quizId}/assigned-users', [AssignUserQuizController::class, 'getUsersData'])
        ->name('quiz.user.data');

    Route::post('/quizze/{quizId}/assign-users', [AssignUserQuizController::class, 'assignUsers'])
        ->name('quiz.user.assign');

    Route::post('/quizze/{quizId}/unassign-users', [AssignUserQuizController::class, 'unassignUsers'])
        ->name('quiz.user.unassign');

    //*******fin***********//


    Route::get('/historique', [UserProgressController::class, 'index'])->name('user-progress.index');
    Route::get('/user/programmes/{programme}', [UserProgressController::class, 'show'])->name('programs.show');
    Route::post('/user/programmes/submit', [UserProgressController::class, 'store'])->name('user-progress.store');
    Route::delete('/historique/{id}', [UserProgressController::class, 'destroy'])->name('user-progress.destroy');
});




require __DIR__ . '/auth.php';
