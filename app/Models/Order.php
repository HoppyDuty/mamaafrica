<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'shop_id', 'type', 'status',
        'whatsapp_sent_at', 'items', 'total_eur', 'total_ghs',
        'customer_name', 'customer_phone', 'customer_email', 'notes',
    ];

    protected $casts = [
        'items'            => 'array',
        'whatsapp_sent_at' => 'datetime',
        'total_eur'        => 'decimal:2',
        'total_ghs'        => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    public function getStatusBadgeAttribute(): string
    {
        return match($this->status) {
            'pending'   => 'bg-yellow-100 text-yellow-800',
            'confirmed' => 'bg-green-100 text-green-800',
            'cancelled' => 'bg-red-100 text-red-800',
            default     => 'bg-gray-100 text-gray-800',
        };
    }
}
