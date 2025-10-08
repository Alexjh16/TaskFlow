<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    protected $fillable = [
        'category_id',
        'title',
        'description',
        'is_completed'
    ];

    protected $casts = [
        'is_completed' => 'boolean'
    ];

    /**
     * Relación: Una tarea pertenece a una categoría
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
