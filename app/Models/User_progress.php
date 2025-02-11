<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User_progress extends Model
{
    /** @use HasFactory<\Database\Factories\UserProgressFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'lesson_id',
        'quiz_id',
        'score',
        'completed_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
