<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Review extends Model
{
    use HasFactory;

    protected $fillable = ['rating', 'comment', 'reviewer_name', 'reviewer_avatar', 'is_active'];

    protected $casts = [
        'rating'    => 'integer',
        'is_active' => 'boolean',
    ];
}
