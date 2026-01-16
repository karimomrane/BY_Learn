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
use App\Models\AssignUserQuiz;
use App\Models\Programme;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
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
    // Get the current user's assigned quiz IDs
    $user = Auth::user();
    $assignedQuizIds = AssignUserQuiz::where('user_id', $user?->id)
        ->pluck('quizze_id')
        ->toArray();

    // Get programs that are currently active and have assigned quizzes
    $now = now()->addHour(1);
    $programs = Programme::with(['lessons.quizze'])
        ->whereDate('date_debut', '<=', $now)
        ->whereDate('date_fin', '>=', $now)
        ->whereHas('lessons.quizze', function($query) use ($assignedQuizIds) {
            $query->whereIn('id', $assignedQuizIds);
        })
        ->orderBy('created_at', 'desc')
        ->get();

    return Inertia::render('Home', [
        'programs' => $programs
    ]);
})->middleware(['auth', 'verified'])->name('home');

Route::get('/dashboard', [UserProgressController::class, 'dashboard'])->middleware(['auth', 'verified'])->name('dashboard');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Admin-only routes
    Route::middleware('admin')->group(function () {
        Route::resource('programmes', ProgrammeController::class)->except(['index', 'show']);

        Route::group(['prefix' => 'programmes/{programme}'], function () {
            Route::resource('lessons', LessonController::class)->except(['index', 'show']);
        });

        Route::group(['prefix' => 'lessons/{lesson}'], function () {
            Route::resource('Quizzezes', QuizzeController::class)->except(['index', 'show']);
        });

        Route::group(['prefix' => 'Quizzezes/{Quizze}'], function () {
            Route::get('questions', [QuestionController::class, 'index'])->name('questions.index');
            Route::resource('questions', QuestionController::class)->except(['index', 'show']);
        });

        Route::group(['prefix' => 'questions/{question}'], function () {
            Route::get('answers', [AnswerController::class, 'index'])->name('answers.index');
            Route::resource('answers', AnswerController::class)->except(['index', 'show']);
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

        Route::delete('/historique/{id}', [UserProgressController::class, 'destroy'])->name('user-progress.destroy');
    });

    // Public authenticated routes (index and show for viewing)
    Route::get('/programmes', [ProgrammeController::class, 'index'])->name('programmes.index');
    Route::get('/programmes/{programme}', [ProgrammeController::class, 'show'])->name('programmes.show');
    Route::get('/programmes/{programme}/lessons', [LessonController::class, 'index'])->name('lessons.index');
    Route::get('/programmes/{programme}/lessons/{lesson}', [LessonController::class, 'show'])->name('lessons.show');
    Route::get('/lessons/{lesson}/Quizzezes', [QuizzeController::class, 'index'])->name('Quizzezes.index');
    Route::get('/lessons/{lesson}/Quizzezes/{Quizze}', [QuizzeController::class, 'show'])->name('Quizzezes.show');

    Route::get('/historique', [UserProgressController::class, 'index'])->name('user-progress.index');
    Route::get('/user/programmes/{programme}', [UserProgressController::class, 'show'])->name('programs.show');
    Route::post('/user/programmes/submit', [UserProgressController::class, 'store'])->name('user-progress.store');
});




require __DIR__ . '/auth.php';
