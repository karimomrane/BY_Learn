<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\Programme;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class LessonController extends Controller
{
    /**
     * Display a listing of lessons for a given programme.
     */
    public function index($programmeId)
    {
        $programme = Programme::with('lessons')->findOrFail($programmeId);

        return Inertia::render('Lessons/Index', [
            'programme' => $programme,
            'lessons'   => $programme->lessons,
        ]);
    }


    /**
     * Show the form for creating a new lesson.
     */
    public function create($programmeId)
    {
        $programme = Programme::findOrFail($programmeId);

        return Inertia::render('Lessons/Create', [
            'programme' => $programme,
        ]);
    }

    /**
     * Store a newly created lesson in storage.
     */
    public function store(Request $request, $programmeId)
    {

        $programme = Programme::findOrFail($programmeId);

        $request->validate([
            'title'       => 'required|max:255',
            'description' => 'nullable|string',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'video'       => 'nullable', // Max 50MB
        ]);
        // Handle image upload
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('lessons/images', 'public');
        }

        $videoPath = $request->file('video')->store('lessons/videos', 'public');



        $programme->lessons()->create([
            'title'       => $request->title,
            'description' => $request->description,
            'video_path'  => $videoPath,
            'image_path'  => $imagePath,
        ]);

        return redirect()->route('lessons.index', $programmeId)
                         ->with('success', 'Lesson created successfully.');
    }

    /**
     * Display the specified lesson.
     */
    public function show($programmeId, Lesson $lesson)
    {
        return Inertia::render('Lessons/Show', [
            'programme' => Programme::findOrFail($programmeId),
            'lesson'    => $lesson,
        ]);
    }

    /**
     * Show the form for editing the specified lesson.
     */
    public function edit($programmeId, Lesson $lesson)
    {
        return Inertia::render('Lessons/Edit', [
            'programme' => Programme::findOrFail($programmeId),
            'lesson'    => $lesson,
        ]);
    }

    /**
     * Update the specified lesson in storage.
     */
    public function update(Request $request, $programmeId, Lesson $lesson)
    {
        $request->validate([
            'title'       => 'required|max:255',
            'description' => 'nullable|string',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'video'       => 'nullable|mimes:mp4,mov,avi,wmv|max:51200', // Max 50MB
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($lesson->image_path) {
                Storage::disk('public')->delete($lesson->image_path);
            }

            // Store new image
            $lesson->image_path = $request->file('image')->store('lessons/images', 'public');
        }

        // Handle video upload
        if ($request->hasFile('video')) {
            // Delete old video if exists
            if ($lesson->video_path) {
                Storage::disk('public')->delete($lesson->video_path);
            }

            // Store new video
            $lesson->video_path = $request->file('video')->store('lessons/videos', 'public');
        }

        $lesson->update([
            'title'       => $request->title,
            'description' => $request->description,
            'video_path'  => $lesson->video_path, // Keep new or existing video
            'image_path'  => $lesson->image_path, // Keep new or existing image
        ]);

        return redirect()->route('lessons.index', $programmeId)
                         ->with('success', 'Lesson updated successfully.');
    }

    /**
     * Remove the specified lesson from storage.
     */
    public function destroy($programmeId, Lesson $lesson)
    {
        // Delete image if exists
        if ($lesson->image_path) {
            Storage::disk('public')->delete($lesson->image_path);
        }

        // Delete video if exists
        if ($lesson->video_path) {
            Storage::disk('public')->delete($lesson->video_path);
        }

        $lesson->delete();

        return redirect()->route('lessons.index', $programmeId)
                         ->with('success', 'Lesson deleted successfully.');
    }
}
