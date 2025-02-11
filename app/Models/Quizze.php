<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quizze extends Model
{
    /** @use HasFactory<\Database\Factories\QuizzeFactory> */
    use HasFactory;

    protected $fillable = [
        'instructions',
        'lesson_id',
    ];

    public function questions()
    {
        return $this->hasMany(Question::class);
    }

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }
}
