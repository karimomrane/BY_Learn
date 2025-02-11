<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    /** @use HasFactory<\Database\Factories\QuestionFactory> */
    use HasFactory;

    protected $fillable = ['quizze_id', 'question_text'];

    public function answers()
    {
        return $this->hasMany(Answer::class);
    }

    public function quizze()
    {
        return $this->belongsTo(Quizze::class);
    }
}
