<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Magasin extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'societe_id'];

    public function societe()
    {
        return $this->belongsTo(Societe::class);
    }

    public function users()
    {   
        return $this->hasMany(User::class);
    }
}

