<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\SocialMediaPost;
use App\Models\SocialMedia;
use Auth;
class PostsController extends Controller
{
  public function create(Request $request)
  {
    $validated = $request->validate([
      'post' => 'required|string',
      'type' => 'required|string'
    ]);

    $post = new Post();
    $post->post = $request->post;
    $post->type = $request->type;
    $post->status = 'PENDING';
    $post->schedule_post_id = $request->schedule_post_id;
    $post->user_id = Auth::user()->id;
    $post->save();

    foreach ($request->social_media_ids as $socialMediaId) {
      $social_media_id = SocialMedia::where('name', $socialMediaId)->where('user_id', Auth::user()->id)->get() ? SocialMedia::where('name', $socialMediaId)->where('user_id', Auth::user()->id)->get()->first()->id : null;
      SocialMediaPost::create([
          'post_id' => $post->id,
          'social_media_id' => $social_media_id,
          'user_id' => Auth::user()->id
      ]);
    }

    return response()->json($post, 201);
  }

  public function index()
  {
    $posts = Post::where('user_id', Auth::user()->id)->with(['schedule_post', 'social_media_posts.social_media'])->get();
    return response()->json($posts);
  }
  
  public function show($id)
  {
    $post = Post::find($id);
    if (!$post) {
      return response()->json(['message' => 'Post not found'], 404);
    }

    return response()->json($post);
  }

}