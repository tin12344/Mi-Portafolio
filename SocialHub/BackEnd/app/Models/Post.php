<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\SchedulePost;
use App\Models\SocialMediaPost;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
    protected $table = 'posts';
    protected $fillable = [        
        'post',
        'type',
        'status',
        'user_id',
        'schedule_post_id'
    ];
  
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function schedule_post(): BelongsTo
    {
        return $this->belongsTo(SchedulePost::class);
    }
    
    public function social_media_posts(): HasMany
    {
        return $this->hasMany(SocialMediaPost::class);
    }
}
