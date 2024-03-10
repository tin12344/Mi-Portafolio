<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Auth;

class LoginController extends Controller
{
  public function login(Request $request)
  {
    $request->validate([
      'email' => 'required',
      'password' => 'required'
    ]);

    $user = User::where('email', $request->email)->first();
    if ($user) {
      //$sendGridEmail = new SendGridEmail($user->name, (string)"Con este codigo puedes iniciar sesion $twoFactorCode");
      //Mail::to($user->email)->send($sendGridEmail);

      if (!$user || !Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
          'email' => ['The provided credentials are incorrect.'],
        ]);
      }

      return ["user" => $user, "token" => $user->createToken($request->email)->plainTextToken];
    }

    return response()->json(["statusText" => "User doesn't exist"], 404);
  }

  public function logout(Request $request)
  {
      $user = User::find(Auth::user()->id);
      $user->two_fa_verified = False;
      $user->save();
      $request->user()->tokens()->delete();

      return response()->json(['message' => 'Successfully logged out']);
  }
}
