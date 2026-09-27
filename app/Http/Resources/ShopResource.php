<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShopResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'country'        => $this->country,
            'city'           => $this->city,
            'phone_whatsapp' => $this->phone_whatsapp,
            'whatsapp_url'   => $this->whatsapp_url,
        ];
    }
}
