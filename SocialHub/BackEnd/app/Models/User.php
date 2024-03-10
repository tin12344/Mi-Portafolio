<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Post;
use App\Models\SocialMediaPost;
use App\Models\SocialMedia;
use App\Models\SchedulePost;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'two_fa_enabled',
        'google2fa_secret',
        'two_fa_verified'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'password' => 'hashed',
    ];

    public function post(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    public function schedule_post(): HasMany
    {
        return $this->hasMany(SchedulePost::class);
    }

    public function social_media(): HasMany
    {
        return $this->hasMany(SocialMedia::class);
    }

    public function social_media_post(): HasMany
    {
        return $this->hasMany(SocialMediaPost::class);
    }
}
