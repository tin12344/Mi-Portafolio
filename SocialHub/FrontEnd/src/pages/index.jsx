import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const index = () => {
  const api_url = import.meta.env.VITE_API_URL;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email === '' || password === '') {
      setError('Fill all spaces.');
      return;
    }
  
    // Send the data to the backend
    await axios.post(api_url + '/login', {
      email: email,
      password
    }).then((response) => {
      console.log(response.data.user);
      sessionStorage.setItem('user', JSON.stringify(response.data.user));
      Cookies.set('token', response.data.token);
      window.location.href = '/Posts';
    }).catch((error) => {
      setError(error.data.statusText);
    });
  };

  return (
    <div>
      <div className="flex flex-col justify-center min-h-full px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-2xl font-bold leading-9 tracking-tight text-center text-gray-900">Sign in to your account</h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="#" method="POST">
            <div>
              <label className="flex items-center justify-between">Email</label>
              <div className="mt-2">
                <input id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full px-3 py-2 text-gray-900 border-0 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 placeholder-text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
              </div>
              <div className="mt-2">
                <input id="password" name="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full px-3 py-2 text-gray-900 border-0 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 placeholder-text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
              </div>
            </div>
            <div>
              <button onClick={handleSubmit} className="w-full py-3 my-1 text-center text-white bg-black rounded hover:bg-green-dark focus:outline-none">
                  Sign in
              </button>
              {error && <p className="mt-2 text-red-500">{error}</p>}
            </div>
          </form>
          <p className="mt-10 text-sm text-center text-gray-500">
            Not a member?  
            <Link className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500" to="/Register">
               Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default index;
