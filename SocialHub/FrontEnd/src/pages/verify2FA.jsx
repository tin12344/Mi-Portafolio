import React, { useState } from 'react';
import tokenRequestComponent from '../components/tokenRequestComponent';
import useTwoFactorRedirect from '../components/useTwoFactorRedirect';

const Verify2FA = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const { enabled2fa, verified2fa } = useTwoFactorRedirect(); 

  const handleVerification = async () => {
      await tokenRequestComponent.post('/verify2fa', { code }).then(response => {
        console.log('Verification successful');
        window.location.href = '/Posts';
      })
      .catch(error => {
        setError(error);
      });
  };

  return (
    <div className="max-w-md p-6 mx-auto bg-white rounded-lg shadow-md">
      <label className="block mb-2 text-lg font-semibold">Verification Code</label>
      <p className="mb-4 text-xs">
        Enter the verification code from your authenticator app:
      </p>
      <input type="text" value={code} onChange={(e) => setCode(e.target.value)} className="w-full px-4 py-2 mb-4 border rounded-md"/>
      <button onClick={handleVerification} className="w-full py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700">Verify</button>

      {error && <div className="mt-4 text-red-500">{error}</div>}
    </div>
  );
};

export default Verify2FA;
