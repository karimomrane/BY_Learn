<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\Programme;
use App\Http\Requests\StoreLessonRequest;
use App\Http\Requests\UpdateLessonRequest;
use App\Http\Traits\HandlesFileUploads;
use App\Http\Traits\HasCrudResponses;
use Inertia\Inertia;

class LessonController extends Controller
{
    use HandlesFileUploads, HasCrudResponses;
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
    public function store(StoreLessonRequest $request, $programmeId)
    {
        try {
            $programme = Programme::findOrFail($programmeId);

            // Handle file uploads using trait
            $imagePath = $request->hasFile('image')
                ? $this->uploadFile($request->file('image'), 'lessons/images')
                : null;

            $videoPath = $request->hasFile('video')
                ? $this->uploadFile($request->file('video'), 'lessons/videos')
                : null;

            $programme->lessons()->create([
                'title'       => $request->title,
                'description' => $request->description,
                'video_path'  => $videoPath,
                'image_path'  => $imagePath,
            ]);

            return $this->successResponse('lessons.index', [$programmeId], 'Lesson created successfully.');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to create lesson: ' . $e->getMessage());
        }
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
    public function update(UpdateLessonRequest $request, $programmeId, Lesson $lesson)
    {
        try {
            // Handle image upload using trait
            if ($request->hasFile('image')) {
                $lesson->image_path = $this->uploadFile(
                    $request->file('image'),
                    'lessons/images',
                    $lesson->image_path
                );
            }

            // Handle video upload using trait
            if ($request->hasFile('video')) {
                $lesson->video_path = $this->uploadFile(
                    $request->file('video'),
                    'lessons/videos',
                    $lesson->video_path
                );
            }

            $lesson->update([
                'title'       => $request->title,
                'description' => $request->description,
                'video_path'  => $lesson->video_path,
                'image_path'  => $lesson->image_path,
            ]);

            return $this->successResponse('lessons.index', [$programmeId], 'Lesson updated successfully.');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to update lesson: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified lesson from storage.
     */
    public function destroy($programmeId, Lesson $lesson)
    {
        try {
            // Delete files using trait
            $this->deleteFile($lesson->image_path);
            $this->deleteFile($lesson->video_path);

            $lesson->delete();

            return $this->successResponse('lessons.index', [$programmeId], 'Lesson deleted successfully.');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to delete lesson: ' . $e->getMessage(), false);
        }
    }
}
