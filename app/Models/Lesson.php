<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    /** @use HasFactory<\Database\Factories\LessonFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'video_path',
        'image_path',
    ];

    public function programme()
    {
        return $this->belongsTo(Programme::class);
    }

    public function quizze()
    {
        return $this->hasOne(Quizze::class);
    }
}
