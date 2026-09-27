<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FoodResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'shop_id'     => $this->shop_id,
            'category_id' => $this->category_id,
            'name'        => $this->name,
            'slug'        => $this->slug,
            'price_eur'   => $this->price_eur,
            'price_ghs'   => $this->price_ghs,
            'stock'       => $this->stock,
            'main_image'  => $this->main_image,
            'shop'        => ShopResource::make($this->whenLoaded('shop')),
            'category'    => $this->whenLoaded('category', fn () => [
                'id'   => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ]),
        ];
    }
}
