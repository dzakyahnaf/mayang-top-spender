<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reward extends Model
{
    protected $fillable = [
        'rank_start',
        'rank_end',
        'title',
        'description',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'rank_start' => 'integer',
            'rank_end' => 'integer',
            'sort_order' => 'integer',
        ];
    }

    public function rankLabel(): string
    {
        return $this->rank_start === $this->rank_end
            ? "Peringkat {$this->rank_start}"
            : "Peringkat {$this->rank_start}-{$this->rank_end}";
    }
}
