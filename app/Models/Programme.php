<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Programme extends Model
{
    /** @use HasFactory<\Database\Factories\ProgrammeFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'image_path',
        'controle',
        'date_debut',
        'date_fin',
    ];

    public function lessons()
{
    return $this->hasMany(Lesson::class);
}

}
