<?php

namespace App\Policies;

use App\Models\User;
use App\Models\User_progress;
use Illuminate\Auth\Access\Response;

class UserProgressPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->role === 'admin'; // Only admins can view all progress
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, User_progress $userProgress): bool
    {
        return $user->id === $userProgress->user_id || $user->role === 'admin';
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true; // Users can create their own progress
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, User_progress $userProgress): bool
    {
        return $user->id === $userProgress->user_id || $user->role === 'admin';
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, User_progress $userProgress): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, User_progress $userProgress): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, User_progress $userProgress): bool
    {
        return false;
    }
}
