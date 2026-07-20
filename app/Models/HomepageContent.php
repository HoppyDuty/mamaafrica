<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomepageContent extends Model
{
    protected $table = 'homepage_content';

    protected $fillable = ['section', 'content', 'is_active', 'sort_order'];

    protected $casts = [
        'content'   => 'array',
        'is_active' => 'boolean',
    ];

    public static function getSection(string $section): ?self
    {
        return static::where('section', $section)->where('is_active', true)->first();
    }

    public static function getAllActive(): \Illuminate\Support\Collection
    {
        return static::where('is_active', true)->orderBy('sort_order')->get()->keyBy('section');
    }
}
