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
    public function index()
    {
        if (Auth::user()->role === 'admin') {
            $userprogress = User_progress::with('lesson', 'quizze', 'user')->orderBy('created_at', 'desc')->get();
        } else {
            $userprogress = User_progress::with('lesson', 'quizze', 'user')->where('user_id', Auth::id())->orderBy('created_at', 'desc')->get();
        }

        return Inertia::render('Historique', [
            'userprogress' => $userprogress
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
        $lasttentatives = User_progress::with('user', 'quizze')->latest()->take(5)->get();
        $classementbyuser = User_progress::with('user')->selectRaw('user_id, sum(score) as total_score')
            ->groupBy('user_id')
            ->orderByDesc('total_score')
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
