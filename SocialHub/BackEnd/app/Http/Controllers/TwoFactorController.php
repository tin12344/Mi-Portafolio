<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request; 
use PragmaRX\Google2FALaravel\Support\Authenticator;
use Auth;
use PragmaRX\Google2FA\Google2FA;
use App\Models\User;
class TwoFactorController extends Controller
{
  public function verify2FA(Request $request)
  {
      $request->validate([
          'code' => 'required|digits:6',
      ]);

      $user = Auth::user();
      // Create an instance of the Authenticator class
      $authenticator = app(Authenticator::class);
      $valid = $authenticator->verifyKey($user->google2fa_secret, $request->input('code'));

      if ($valid) {
        $user->update([
          'two_fa_enabled' => True,
          'two_fa_verified' => True,
        ]);
        $user = User::find(Auth::user()->id);
        // The code is valid, you might log in the user or perform other actions
        return response()->json(['message' => 'Verification successful', "user" => $user]);
      } else {
          // The code is invalid
          return response()->json(['error' => 'Invalid verification code'], 422);
      }
  }

    public function enable2FA()
    {
        $user = Auth()->user();

        $google2FA = new Google2FA();
        $secretKey = $google2FA->generateSecretKey();

        $qrCodeUrl = $google2FA->getQRCodeUrl(env('APP_NAME'), $user->email, $secretKey);

        // Save the secret key for the user
        $user->google2fa_secret = $secretKey;
        $user->two_fa_verified = False;
        $user->save();

        // Pass $google2faUrl to your frontend to display the QR code
        return response()->json(['google2faUrl' => $qrCodeUrl, "user" => $user]);
    }

    public function get_user() {
      return response()->json([ "user" => User::find(Auth::user()->id)]);
    }
}
