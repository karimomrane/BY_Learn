<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssignUserQuiz extends Model
{
    use HasFactory;

    protected $table = 'assign_user_quiz'; // Nom de la table

    protected $fillable = [
        'user_id',
        'quizze_id',
    ];

    /**
     * Relation avec l'utilisateur.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relation avec le quiz.
     */
    public function quizze()
    {
        return $this->belongsTo(Quizze::class, 'quizze_id');
    }
}
