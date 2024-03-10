<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SchedulePost;
use Auth;

class SchedulePostsController extends Controller
{
  public function create(Request $request)
  {
    $validated = $request->validate([
      'day' => 'required|string',
      'hour' => 'required|string',
    ]);

    $schedule = new SchedulePost();
    $schedule->hour = $request->hour;
    $schedule->day = $request->day;
    $schedule->user_id = Auth::user()->id;
    $schedule->save();

    return response()->json(['message' => 'Horario creado'], 201);
  }
  public function index(Request $request)
  {
    // Retrieve all schedule posts
    $schedules = SchedulePost::where('user_id', Auth::user()->id)->get();
    return response()->json($schedules);
  }

  public function destroy($id)
  {
    $schedule = SchedulePost::find($id);
    $schedule->delete();
    return response()->json([ "message" => "Schedule Deleted!" ], 200);
  }

  public function update($id, Request $request)
  {
    $this->validate($request, [
      'day' => ['required'],
      'hour' => ['required'] 
    ]);

    $schedule = SchedulePost::findOrFail($id);

    $schedule->day = $request->day;
    $schedule->hour = $request->hour;
    $schedule->user_id = Auth::user()->id;
    $schedule->save();

    return response()->json([
      "message" => "Schedule updated!"
    ], 200);
  }
}