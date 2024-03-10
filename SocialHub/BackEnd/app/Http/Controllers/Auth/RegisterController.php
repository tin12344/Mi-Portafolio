<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class RegisterController extends Controller
{
  public function __construct()
  {
    $this->middleware('guest');
  }

  public function register(Request $request)
  {
    // Validar los datos del formulario
    $this->validate($request, [
      'name' => ['required', 'string', 'min:5'],
      'email' => ['required', 'string', 'email', 'unique:users'],
      'password' => ['required', 'string', 'min:6'],
    ]);

    // Crear un nuevo usuario
    $user = new User();
    $user->name = $request->name;
    $user->email = $request->email;
    $user->password = bcrypt($request->password);
    $user->save();

    // Redireccionar al usuario a la página de inicio
    return [ $user ];
  }
}
