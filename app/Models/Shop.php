<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Shop extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'country', 'city', 'address',
        'phone_whatsapp', 'attendant_id', 'is_active', 'description',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function attendant()
    {
        return $this->belongsTo(User::class, 'attendant_id');
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function services()
    {
        return $this->hasMany(Service::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function getWhatsappUrlAttribute()
    {
        $phone = preg_replace('/[^0-9]/', '', $this->phone_whatsapp);
        return "https://wa.me/{$phone}";
    }
}
