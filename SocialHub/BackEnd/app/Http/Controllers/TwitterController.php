<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use GuzzleHttp\Client;
use App\Models\SocialMedia;
use App\Models\Post;
use Auth;

class TwitterController extends Controller
{
    public function loginTwitter()
    {
        $client_id = env('TWITTER_CLIENT_ID');
        $redirect_uri = env('TWITTER_REDIRECT_URI');

        return response()->json(["link" => "https://twitter.com/i/oauth2/authorize?response_type=code&client_id={$client_id}&redirect_uri={$redirect_uri}&scope=tweet.read%20tweet.write%20users.read%20&state=state&code_challenge=challenge&code_challenge_method=plain"]);
    }

    public function publishTwitter($post_id)
    {
        $post = Post::find($post_id);
        $social_media = SocialMedia::where('user_id', $post->user_id)
            ->where('name', 'TWITTER')->get()->first();


        $consumer_key = env('TWITTER_API_KEY_CONSUMER');
        $consumer_secret = env('TWITTER_API_KEY_SECRET_CONSUMER');
        $access_token = env('TWITTER_ACCESS_TOKEN');
        $access_token_secret = env('TWITTER_ACCESS_TOKEN_SECRET');
        $timestamp = time();
        $oauth_nonce = md5(uniqid(rand(), true));
        $http_method = "POST";
        $base_url = "https://api.twitter.com/2/tweets";
        $params = [
            "oauth_consumer_key" => $consumer_key,
            "oauth_token" => $access_token,
            "oauth_signature_method" => "HMAC-SHA1",
            "oauth_timestamp" => $timestamp,
            "oauth_nonce" => $oauth_nonce,
            "oauth_version" => "1.0",
        ];

        ksort($params);
        $base_string = $http_method . "&" . rawurlencode($base_url) . "&" . rawurlencode(http_build_query($params));
        $secret_key = rawurlencode($consumer_secret) . '&' . rawurlencode($access_token_secret);
        $oauth_signature =  urlencode( base64_encode(hash_hmac('sha1', $base_string, $secret_key, true)));

        $response = Http::withHeaders([
            "Authorization" => "OAuth oauth_consumer_key={$consumer_key},oauth_token={$access_token},oauth_signature_method=HMAC-SHA1,oauth_timestamp={$timestamp},oauth_nonce={$oauth_nonce},oauth_version=1.0,oauth_signature={$oauth_signature}",
        ])->post('https://api.twitter.com/2/tweets', [
                    "text" => $post->post,
                ]);
       

        $post->status = "PUBLISHED";
        $post->save();

        return $response->json();
    }

    public function signature(Request $request)
    {
        $consumer_key = env('TWITTER_API_KEY_CONSUMER');
        $consumer_secret = env('TWITTER_API_KEY_SECRET_CONSUMER');
        $access_token = env('TWITTER_ACCESS_TOKEN');
        $access_token_secret = env('TWITTER_ACCESS_TOKEN_SECRET');
        $oauth_nonce = "2rbXFwEEhqK";
        $timestamp = 1701383119;

        $http_method = "POST";
        $base_url = "https://api.twitter.com/2/tweets";
        $params = [
            "oauth_consumer_key" => $consumer_key,
            "oauth_token" => $access_token,
            "oauth_signature_method" => "HMAC-SHA1",
            "oauth_timestamp" => $timestamp,
            "oauth_nonce" => $oauth_nonce,
            "oauth_version" => "1.0",
        ];

        ksort($params);
        $base_string = $http_method . "&" . rawurlencode($base_url) . "&" . rawurlencode(http_build_query($params));
        $secret_key = rawurlencode($consumer_secret) . '&' . rawurlencode($access_token_secret);
        $oauth_signature = base64_encode(hash_hmac('sha1', $base_string, $secret_key, true));

        $user_info = $this->getUserInfoTwitter();

        $social_media_exists = SocialMedia::where('user_id', Auth::user()->id)
            ->where('name', 'TWITTER')->get()->first();
        if ($social_media_exists) {
            $social_media_exists->access_token = $request['code'];
            $social_media_exists->signature = urlencode($oauth_signature);
            $social_media_exists->save();
        } else {
            $social_media = new SocialMedia();
            $social_media->name = 'TWITTER';
            $social_media->user_name = $user_info['name'];
            $social_media->access_token = $request->input('code');
            $social_media->signature = urlencode($oauth_signature);
            $social_media->user_id = Auth::user()->id;
            $social_media->save();
        }

        return urlencode($oauth_signature);
    }

    private function getUserInfoTwitter()
    {
        $consumer_key = env('TWITTER_API_KEY_CONSUMER');
        $consumer_secret = env('TWITTER_API_KEY_SECRET_CONSUMER');
        $access_token = env('TWITTER_ACCESS_TOKEN');
        $access_token_secret = env('TWITTER_ACCESS_TOKEN_SECRET');

        $credentials = [
            'oauth_consumer_key' => $consumer_key,
            'oauth_nonce' => md5(uniqid(rand(), true)),
            'oauth_signature_method' => 'HMAC-SHA1',
            'oauth_timestamp' => time(),
            'oauth_token' => $access_token,
            'oauth_version' => '1.0',
        ];

        ksort($credentials);
        $baseString = strtoupper('GET') . '&' . rawurlencode('https://api.twitter.com/1.1/account/verify_credentials.json') . '&' . rawurlencode(http_build_query($credentials));
        $signingKey = rawurlencode($consumer_secret) . '&' . rawurlencode($access_token_secret);
        $credentials['oauth_signature'] = base64_encode(hash_hmac('sha1', $baseString, $signingKey, true));
        $authHeader = 'OAuth ' . implode(', ', array_map(function ($k, $v) {
            return rawurlencode($k) . '="' . rawurlencode($v) . '"';
        }, array_keys($credentials), $credentials));
        $context = stream_context_create([
            'http' => [
                'header' => "Authorization: $authHeader\r\n",
            ],
        ]);
        $response = file_get_contents('https://api.twitter.com/1.1/account/verify_credentials.json', false, $context);
        $userInfo = json_decode($response, true);

        return $userInfo;
    }
}