<?php

namespace App\Http\Controllers;

use App\Models\Programme;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProgrammeController extends Controller
{
    /**
     * Display a listing of programmes.
     */
    public function index()
    {
        $programmes = Programme::all();

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
    public function store(Request $request)
    {
        // Validate input including an optional image
        $data = $request->validate([
            'title'       => 'required|max:255',
            'description' => 'nullable|string',
            'image_path'  => 'nullable|image'
        ]);

        // If an image is provided, store it and set the path
        if ($request->hasFile('image_path')) {
            $data['image_path'] = $request->file('image_path')->store('programmes', 'public');
        }

        Programme::create($data);

        return redirect()->route('programmes.index')
                         ->with('success', 'Programme created successfully.');
    }

    /**
     * Display the specified programme.
     */
    public function show(Programme $programme)
    {
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
    public function update(Request $request, Programme $programme)
    {

        // Validate input including an optional image
        $data = $request->validate([
            'title'       => 'required|max:255',
            'description' => 'nullable|string',
            'image_path'  => 'nullable|image'
        ]);

        // Delete image if exists
        if ($programme->image_path) {
            Storage::disk('public')->delete($programme->image_path);
        }

        // If a new image is provided, store it and update the image_path
        if ($request->hasFile('image_path')) {
            $data['image_path'] = $request->file('image_path')->store('programmes', 'public');
        }

        $programme->update($data);

        return redirect()->route('programmes.index')
                         ->with('success', 'Programme updated successfully.');
    }

    /**
     * Remove the specified programme from storage.
     */
    public function destroy(Programme $programme)
    {
        // Delete image if exists
        if ($programme->image_path) {
            Storage::disk('public')->delete($programme->image_path);
        }
        $programme->delete();

        return redirect()->route('programmes.index')
                         ->with('success', 'Programme deleted successfully.');
    }
}
