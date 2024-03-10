<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\SocialMedia;
use App\Models\Post;
use Auth;

class LinkedInController extends Controller
{
    public function loginLinkedin()
    {
        $client = env('LINKEDIN_CLIENT_ID');
        $url_redirect = env('LINKEDIN_REDIRECT_URL');

        return response() -> json(["link" => "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id={$client}&redirect_uri={$url_redirect}&scope=email,openid,profile,w_member_social"]);
    }

    public function getAccessToken(Request $request)
    {
        $client = env('LINKEDIN_CLIENT_ID');
        $url_redirect = env('LINKEDIN_REDIRECT_URL');
        $clientSecret = env('LINKEDIN_SECRET_ID');

        $response = Http::asForm()->post('https://www.linkedin.com/oauth/v2/accessToken', [
            'code' => $request->input('code'),
            'client_id' => $client,
            'client_secret' => $clientSecret,
            'redirect_uri' => $url_redirect,
            'grant_type' => 'authorization_code'
        ]);

        $user_info = Http::withToken($response['access_token'])->get('https://api.linkedin.com/v2/userinfo');
        
        $social_media_exists = SocialMedia::where('user_id', Auth::user()->id)
        ->where('name', 'LINKEDIN')->get()->first();
        if($social_media_exists){
          $social_media_exists->access_token = $response['access_token'];
          $social_media_exists->signature = $user_info['sub'];
          $social_media_exists->save();
        } else {
          $social_media = new SocialMedia();
          $social_media->name = 'LINKEDIN';
          $social_media->user_name = $user_info['name'];
          $social_media->access_token = $response['access_token'];
          $social_media->signature = $user_info['sub'];
          $social_media->user_id = Auth::user()->id;
          $social_media->save();
        }

        return response()->json(["message" => "Linkedin account authorized!"], 200);
    }
    public function postLinkedin($post_id)
    {
        $post = Post::find($post_id);
        $social_media = SocialMedia::where('user_id', $post->user_id)
        ->where('name', 'LINKEDIN')->get()->first();
        $author = $social_media->signature;
        $response = Http::withToken($social_media->access_token)->post('https://api.linkedin.com/v2/ugcPosts', [

            'author' => "urn:li:person:{$author}",
            'lifecycleState' => "PUBLISHED",
            'specificContent' => [
                'com.linkedin.ugc.ShareContent' => [
                    'shareCommentary' => [
                        'text' => $post->post,
                    ],
                    'shareMediaCategory' => 'NONE'
                ]
            ],
            'visibility' => [
                'com.linkedin.ugc.MemberNetworkVisibility' => 'PUBLIC'
            ]
        ]);

        $post->status = "PUBLISHED";
        $post->save();

        return $response->json();
    }
}
