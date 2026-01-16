<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\Program;
use App\Models\Programme;
use App\Models\Question;
use App\Models\User;
use App\Models\User_progress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class UserProgressController extends Controller
{
    public function index(Request $request)
    {
        $query = User_progress::with(['lesson:id,title', 'quizze:id,instructions', 'user:id,name']);

        // Role-based filtering
        if (Auth::user()->role !== 'admin') {
            $query->where('user_id', Auth::id());
        }

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })
                ->orWhereHas('lesson', function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%");
                })
                ->orWhereHas('quizze', function ($q) use ($search) {
                    $q->where('instructions', 'like', "%{$search}%");
                });
            });
        }

        // User filter
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Lesson filter
        if ($request->filled('lesson_id')) {
            $query->where('lesson_id', $request->lesson_id);
        }

        // Score range filter
        if ($request->filled('min_score')) {
            $query->where('score', '>=', $request->min_score);
        }
        if ($request->filled('max_score')) {
            $query->where('score', '<=', $request->max_score);
        }

        // Date range filter
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');

        // Handle nested sorting (e.g., user.name, lesson.title)
        if (str_contains($sortBy, '.')) {
            [$relation, $column] = explode('.', $sortBy);

            if ($relation === 'user') {
                $query->join('users', 'user_progress.user_id', '=', 'users.id')
                    ->select('user_progress.*')
                    ->orderBy("users.{$column}", $sortDirection);
            } elseif ($relation === 'lesson') {
                $query->leftJoin('lessons', 'user_progress.lesson_id', '=', 'lessons.id')
                    ->select('user_progress.*')
                    ->orderBy("lessons.{$column}", $sortDirection);
            } elseif ($relation === 'quizze') {
                $query->join('quizzes', 'user_progress.quiz_id', '=', 'quizzes.id')
                    ->select('user_progress.*')
                    ->orderBy("quizzes.{$column}", $sortDirection);
            }
        } else {
            $query->orderBy($sortBy, $sortDirection);
        }

        // Pagination
        $perPage = $request->get('per_page', 10);
        $userprogress = $query->paginate($perPage)->appends($request->query());

        // Get filter options for dropdowns
        $users = Auth::user()->role === 'admin'
            ? User::select('id', 'name')->orderBy('name')->get()
            : collect([]);

        $lessons = Lesson::select('id', 'title')->orderBy('title')->get();

        return Inertia::render('Historique', [
            'userprogress' => $userprogress,
            'filters' => $request->only(['search', 'user_id', 'lesson_id', 'min_score', 'max_score', 'date_from', 'date_to', 'sort_by', 'sort_direction', 'per_page']),
            'users' => $users,
            'lessons' => $lessons,
        ]);
    }

    public function dashboard()
    {
        $totalusers = User::count();
        $useractif = User::has('user_progress')->count();
        $programmes = Programme::count();
        $lessons = Lesson::count();
        $tentatives = User_progress::count();
        $pointsemis = User_progress::sum('score');
        $totalpoints = Question::count() * 10;
        $lasttentatives = User_progress::with(['user:id,name', 'quizze:id'])
            ->latest()
            ->take(5)
            ->get();
        $classementbyuser = User_progress::with('user:id,name')
            ->selectRaw('user_id, sum(score) as total_score')
            ->groupBy('user_id')
            ->orderByDesc('total_score')
            ->limit(10)
            ->get();

        return Inertia::render('Dashboard', [
            'totalusers' => $totalusers,
            'useractif' => $useractif,
            'programmes' => $programmes,
            'lessons' => $lessons,
            'tentatives' => $tentatives,
            'pointsemis' => $pointsemis,
            'totalpoints' => $totalpoints,
            'lasttentatives' => $lasttentatives,
            'classementbyuser' => $classementbyuser
        ]);
    }
    /**
     * Show the program details with its lessons and questions.
     */
    public function show($programId)
    {
        $program = Programme::with([
            'lessons.quizze.questions.answers'
        ])->findOrFail($programId);

        $userprogress = User_progress::where('user_id', Auth::id())->get();

        // Rank users by score first, then by duration (less time = higher rank)
        $rankbyprogram = User_progress::select('user_id', 'lesson_id')
            ->selectRaw('SUM(score) as total_score')
            ->selectRaw('SUM(completed_at) as total_duration') // Total time in seconds
            ->whereHas('lesson', function ($query) use ($programId) {
                $query->where('programme_id', $programId);
            })
            ->groupBy('user_id', 'lesson_id')
            ->orderByDesc('total_score')  // Order by score (higher is better)
            ->orderBy('total_duration')  // Order by duration (lower is better)
            ->with([
                'user:id,name',
                'lesson:id,title'
            ])
            ->get();

        return Inertia::render('UserProgress/Program', [
            'program' => $program,
            'userprogress' => $userprogress,
            'rankbyprogram' => $rankbyprogram
        ]);
    }





    /**
     * Store the user's progress after completing the quiz for a lesson.
     */
    public function store(Request $request)
    {
        $request->validate([
            'lesson_id' => 'required|exists:lessons,id',
            'score'     => 'required|integer',
            'quiz_id'   => 'required|exists:quizzes,id',
            'completed_at' => 'required',
        ]);
        $progress = new User_progress();
        $progress->user_id     = Auth::id();
        $progress->lesson_id   = $request->lesson_id;
        $progress->quiz_id     = $request->quiz_id;
        $progress->score       = $request->score;
        $progress->completed_at = $request->completed_at;
        $progress->save();

        // Return to the program page with a success message
        $userprogress = User_progress::where('user_id', Auth::id())->get();

        return redirect()->back();
    }

    public function destroy($id)
    {
        $progress = User_progress::findOrFail($id);
        $progress->delete();
        return redirect()->back();
    }
}
