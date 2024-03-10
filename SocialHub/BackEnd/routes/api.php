<?php

use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\SchedulePostsController;
use App\Http\Controllers\PostsController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TwoFactorController;
use App\Http\Controllers\LinkedInController;
use App\Http\Controllers\TwitterController;
use App\Http\Controllers\RedditController;
use App\Http\Controllers\SocialMediaController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('register', [RegisterController::class, 'register']);
Route::post('login', [LoginController::class, 'login']);

Route::post('publishPost', [RedditController::class, 'publishPost']);
Route::post('table_posts', [PostsController::class, 'create']);
Route::post('getUserInfoReddit', [RedditController::class, 'getUserInfo']);
Route::post('getAccessTokenTwitter', [TwitterController::class, 'getAccessToken']);
Route::post('publishTwitter/{post_id}', [TwitterController::class, 'publishTwitter']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('get_user', [TwoFactorController::class, 'get_user']);
    Route::post('logout', [LoginController::class, 'logout']);
    Route::post('verify2fa', [TwoFactorController::class, 'verify2FA']);
    Route::post('enable2fa', [TwoFactorController::class, 'enable2FA']);

    Route::post('schedule_posts', [SchedulePostsController::class, 'create']);
    Route::put('schedule_posts/{id}', [SchedulePostsController::class, 'update']);
    Route::delete('schedule_posts/{id}', [SchedulePostsController::class, 'destroy']);
    Route::get('schedule_posts', [SchedulePostsController::class, 'index']);

    Route::post('posts', [PostsController::class, 'create']);
    Route::get('posts', [PostsController::class, 'index']);
    Route::get('posts/{id}', [PostsController::class, 'show']);

    Route::get('linkedin_login', [LinkedInController::class, 'loginLinkedin']);
    Route::post('linkedin_getAccessToken', [LinkedInController::class, 'getAccessToken']);
    Route::post('postLinkedin', [LinkedInController::class, 'postLinkedin']);
    
    Route::get('loginReddit', [RedditController::class, 'loginReddit']);
    Route::post('getToken', [RedditController::class, 'getToken']);
    
    Route::get('loginTwitter', [TwitterController::class, 'loginTwitter']);
    Route::post('getSignature', [TwitterController::class, 'signature']);
    Route::get('social_media', [SocialMediaController::class, 'index']);
});