<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'shop_id', 'category_id', 'name', 'slug', 'description',
        'price_eur', 'price_ghs', 'stock', 'is_active', 'images',
    ];

    protected $casts = [
        'images'    => 'array',
        'is_active' => 'boolean',
        'price_eur' => 'decimal:2',
        'price_ghs' => 'decimal:2',
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
        return $this->images[0] ?? 'https://placehold.co/400x400/8B4513/FFFFFF?text=Mama+Africa';
    }

    public function getPriceAttribute()
    {
        return $this->price_eur;
    }

    public function isInStock(): bool
    {
        return $this->stock > 0;
    }
}
