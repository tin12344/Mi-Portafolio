<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\SocialMedia;
use App\Models\Post;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SocialMediaPost extends Model
{
    use HasFactory;

    protected $table = 'social_media_posts';

    protected $fillable = [        
        'post_id',
        'social_media_id',
        'user_id'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    public function social_media(): BelongsTo
    {
        return $this->belongsTo(SocialMedia::class);
    }
}
