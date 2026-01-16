<?php

namespace App\Policies;

use App\Models\Quizze;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class QuizzePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true; // All authenticated users can view quizzes
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Quizze $quizze): bool
    {
        return true; // All authenticated users can view a quiz
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Quizze $quizze): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Quizze $quizze): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Quizze $quizze): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Quizze $quizze): bool
    {
        return false;
    }
}
