<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Post;
use App\Http\Controllers\LinkedInController;
use App\Http\Controllers\RedditController;
use App\Http\Controllers\TwitterController;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class PostProcessing extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:post-processing';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Processing posts';

    /**
     * Execute the console command.
     */
    public function handle()
    {
      Log::info("Running process....");
      $centralAmericanTime = Carbon::now('America/Costa_Rica');
      $currentDay = strtolower($centralAmericanTime->format('l'));
      $currentTime = $centralAmericanTime->format('H:i');
      $posts = Post::where(function ($query) {
        $query->where('type', 'INSTANT')->where('status', 'PENDING');
      })->orWhere(function ($query) {
          $query->where('type', 'SCHEDULED')->where('status', 'PENDING');
      })->with(['schedule_post', 'social_media_posts.social_media'])->get();
        foreach($posts as $post){
          $post_params = ['post_id' => $post->id];
          foreach ($post->social_media_posts as $social_media_post) {
            $social_media_name = $social_media_post->social_media->name;
            Log::info("LocalDay:" . $currentDay);
            Log::info("LocalTime:" .$currentTime);
            if ($social_media_name == 'LINKEDIN') {
              if($post->type == "INSTANT"){
                app()->call(LinkedInController::class . '@postLinkedin', $post_params);
              } else {
                Log::info(strtolower($post->schedule_post->day));
                Log::info($post->schedule_post->hour);
                if(strtolower($post->schedule_post->day) == $currentDay && $post->schedule_post->hour == $currentTime){
                  app()->call(LinkedInController::class . '@postLinkedin', $post_params);
                }
              }
            }

            else if ($social_media_name == 'TWITTER') {
              if($post->type == "INSTANT"){
                app()->call(TwitterController::class . '@publishTwitter', $post_params);
              } else {
                Log::info(strtolower($post->schedule_post->day));
                Log::info($post->schedule_post->hour);
                if(strtolower($post->schedule_post->day) == $currentDay && $post->schedule_post->hour == $currentTime){
                  app()->call(TwitterController::class . '@publishTwitter', $post_params);
                }
              }
            }

            else if ($social_media_name == 'REDDIT') {
              if($post->type == "INSTANT"){
                app()->call(RedditController::class . '@publishPost', $post_params);
              } else {
                Log::info(strtolower($post->schedule_post->day));
                Log::info($post->schedule_post->hour);
                if(strtolower($post->schedule_post->day) == $currentDay && $post->schedule_post->hour == $currentTime){
                  app()->call(RedditController::class . '@publishPost', $post_params);
                }
              }
            }
          }
        }
    }
}
