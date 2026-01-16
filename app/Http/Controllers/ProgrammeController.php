<?php

namespace App\Http\Controllers;

use App\Models\Programme;
use App\Http\Requests\StoreProgrammeRequest;
use App\Http\Requests\UpdateProgrammeRequest;
use App\Http\Traits\HandlesFileUploads;
use App\Http\Traits\HasCrudResponses;
use Inertia\Inertia;

class ProgrammeController extends Controller
{
    use HandlesFileUploads, HasCrudResponses;
    /**
     * Display a listing of programmes.
     */
    public function index()
    {
        $programmes = Programme::with('lessons')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Programmes/Index', [
            'programmes' => $programmes
        ]);
    }

    /**
     * Show the form for creating a new programme.
     */
    public function create()
    {
        return Inertia::render('Programmes/Create');
    }

    /**
     * Store a newly created programme in storage.
     */
    public function store(StoreProgrammeRequest $request)
    {
        try {
            $data = $request->validated();

            // Handle image upload using trait
            if ($request->hasFile('image_path')) {
                $data['image_path'] = $this->uploadFile($request->file('image_path'), 'programmes');
            }

            Programme::create($data);

            return $this->successResponse('programmes.index', [], 'Programme created successfully.');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to create programme: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified programme.
     */
    public function show(Programme $programme)
    {
        $programme->load(['lessons.quizze']);

        return Inertia::render('Programmes/Show', [
            'programme' => $programme
        ]);
    }

    /**
     * Show the form for editing the specified programme.
     */
    public function edit(Programme $programme)
    {
        return Inertia::render('Programmes/Edit', [
            'programme' => $programme
        ]);
    }

    /**
     * Update the specified programme in storage.
     */
    public function update(UpdateProgrammeRequest $request, Programme $programme)
    {
        try {
            $data = $request->validated();

            // Handle image upload using trait
            if ($request->hasFile('image_path')) {
                $data['image_path'] = $this->uploadFile(
                    $request->file('image_path'),
                    'programmes',
                    $programme->image_path
                );
            }

            $programme->update($data);

            return $this->successResponse('programmes.index', [], 'Programme updated successfully.');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to update programme: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified programme from storage.
     */
    public function destroy(Programme $programme)
    {
        try {
            // Delete image using trait
            $this->deleteFile($programme->image_path);
            $programme->delete();

            return $this->successResponse('programmes.index', [], 'Programme deleted successfully.');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to delete programme: ' . $e->getMessage(), false);
        }
    }
}
