<?php

namespace App\Http\Traits;

use Illuminate\Support\Facades\Storage;

trait HandlesFileUploads
{
    /**
     * Upload a file and return the path
     *
     * @param \Illuminate\Http\UploadedFile $file
     * @param string $directory
     * @param string|null $oldPath Optional path to old file to delete
     * @return string
     */
    protected function uploadFile($file, string $directory, ?string $oldPath = null): string
    {
        // Delete old file if exists
        if ($oldPath && Storage::disk('public')->exists($oldPath)) {
            Storage::disk('public')->delete($oldPath);
        }

        // Upload new file
        return $file->store($directory, 'public');
    }

    /**
     * Delete a file from storage
     *
     * @param string|null $path
     * @return bool
     */
    protected function deleteFile(?string $path): bool
    {
        if ($path && Storage::disk('public')->exists($path)) {
            return Storage::disk('public')->delete($path);
        }

        return false;
    }

    /**
     * Handle multiple file uploads
     *
     * @param array $files Array of uploaded files
     * @param string $directory
     * @return array Array of file paths
     */
    protected function uploadMultipleFiles(array $files, string $directory): array
    {
        $paths = [];

        foreach ($files as $file) {
            $paths[] = $file->store($directory, 'public');
        }

        return $paths;
    }
}
