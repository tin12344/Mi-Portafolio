<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\SocialMediaPost;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SocialMedia extends Model
{
    use HasFactory;
    protected $table = 'social_media';

    protected $fillable = [        
        'name',
        'access_token',
        'is_authenticated',
        'user_id',
        'user_name',
        'signature'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function social_media_post(): BelongsTo
    {
        return $this->belongsTo(SocialMediaPost::class);
    }
}
