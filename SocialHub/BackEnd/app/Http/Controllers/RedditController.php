<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use GuzzleHttp\Client;
use App\Models\SocialMedia;
use App\Models\Post;
use Auth;

class RedditController extends Controller
{

  public function loginReddit()
  {
    $state = bin2hex(random_bytes(16));
    $query = http_build_query([
      'client_id' => env('REDDIT_CLIENT_ID'),
      'response_type' => 'code',
      'state' => $state,
      'redirect_uri' => env('REDDIT_REDIRECT_URI'),
      'duration' => 'permanent',
      'scope' => 'identity,submit',
    ]);

    $link = "https://www.reddit.com/api/v1/authorize?$query";

    return response()->json(['link' => $link], 200);
  }

  public function getToken(Request $request)
  {
    $reddit_client_id = env('REDDIT_CLIENT_ID');
    $reddit_client_secret = env('REDDIT_CLIENT_ID_SECRET');
    $redirect_uri = env('REDDIT_REDIRECT_URI');
    $response = Http::asForm()
      ->withBasicAuth($reddit_client_id, $reddit_client_secret)
      ->post('https://www.reddit.com/api/v1/access_token', [
        'grant_type' => 'authorization_code',
        'code' => $request->input('code'),
        'redirect_uri' => $redirect_uri,
      ]);

      $user_info = Http::withToken($response['access_token'])
      ->get('https://oauth.reddit.com/api/v1/me');
    
      $social_media_exists = SocialMedia::where('user_id', Auth::user()->id)
        ->where('name', 'REDDIT')->get()->first();
      if($social_media_exists){
        $social_media_exists->access_token = $response['access_token'];
        $social_media_exists->save();
      } else {
        $social_media = new SocialMedia();
        $social_media->name = 'REDDIT';
        $social_media->user_name = $user_info['name'];
        $social_media->access_token = $response['access_token'];
        $social_media->user_id = Auth::user()->id;
        $social_media->save();
      }

    return $response->json();
  }

  public function publishPost($post_id)
  {
    $post = Post::find($post_id);
    $social_media = SocialMedia::where('user_id', $post->user_id)
      ->where('name', 'REDDIT')->get()->first();
    $access_token = $social_media->access_token;
    
    $client = new Client([
      'base_uri' => 'https://oauth.reddit.com/',
      'headers' => [
        'Authorization' => 'Bearer ' . $access_token,
        'User-Agent' => 'TrodoTC',
      ],
    ]);

    $response = $client->post('api/submit', [
      'form_params' => [
        'kind' => 'self',
        "sr" => "socialhubtest",
        "title" => "Social Hub",
        'text' => $post->post
      ],
    ]);

    $post->status = "PUBLISHED";
    $post->save();

    return response() -> json(["Post publish"] , 200);
  }

}