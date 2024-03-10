import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';


const register = () => {
  const api_url = import.meta.env.VITE_API_URL;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [redirect, setRedirect] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name === '' || email === '' || password === '' || confirmPassword === '') {
      setError('Fill all spaces.');
      return;
    }

    if (password !== confirmPassword) {
      setError('There is no match on the passwords.');
      return;
    }

    // Enviar los datos del formulario al backend
    const response = await fetch(api_url + '/register', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    }).then((res) => res.json());;
    setRedirect(true);
  };


  return (
    <div className="flex flex-col min-h-screen bg-grey-lighter">
      <div className="container flex flex-col items-center justify-center flex-1 max-w-sm px-2 mx-auto">
        <div className="w-full px-6 py-8 text-black bg-white rounded shadow-md">
          <h1 className="mb-8 text-3xl text-center">Sign up</h1>
          <input type="text" className="block w-full p-3 mb-4 border rounded border-grey-light" name="name" placeholder="User Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="text" className="block w-full p-3 mb-4 border rounded border-grey-light" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" className="block w-full p-3 mb-4 border rounded border-grey-light" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <input type="password" className="block w-full p-3 mb-4 border rounded border-grey-light" name="confirmPassword" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          <button type='submit' onClick={handleSubmit} className="w-full py-3 my-1 text-center text-white bg-black rounded hover:bg-green-dark focus:outline-none">
            Create Account
            {redirect && <Navigate to="/" />}
          </button>
          {error && <p className="mt-2 text-red-500">{error}</p>}
        </div>
        <div className="mt-6 text-grey-dark">
          Already have an account?
          <Link className="no-underline border-b border-blue text-blue" to="/">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default register;