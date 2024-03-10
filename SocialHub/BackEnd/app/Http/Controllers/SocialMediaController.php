<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SocialMedia;
use Auth;

class SocialMediaController extends Controller
{
  public function index()
  {
    $social_media_list = SocialMedia::where('user_id', Auth::user()->id)->get();
    return response()->json($social_media_list);
  }
}
