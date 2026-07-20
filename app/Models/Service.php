<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'shop_id', 'category_id', 'name', 'slug', 'description',
        'price_eur', 'price_ghs', 'duration_minutes', 'is_active', 'images',
    ];

    protected $casts = [
        'images'           => 'array',
        'is_active'        => 'boolean',
        'price_eur'        => 'decimal:2',
        'price_ghs'        => 'decimal:2',
        'duration_minutes' => 'integer',
    ];

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function getMainImageAttribute()
    {
        return $this->images[0] ?? 'https://placehold.co/400x400/D4AF37/FFFFFF?text=Service';
    }

    public function getDurationLabelAttribute(): string
    {
        $h = intdiv($this->duration_minutes, 60);
        $m = $this->duration_minutes % 60;
        if ($h && $m) return "{$h}h {$m}min";
        if ($h) return "{$h}h";
        return "{$m}min";
    }
}
