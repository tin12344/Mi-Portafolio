import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import tokenRequestComponent from '../components/tokenRequestComponent';
import { useNavigate } from 'react-router-dom';
import useTwoFactorRedirect from '../components/useTwoFactorRedirect';

const Enable2FA = () => {
  const [google2faUrl, setGoogle2faUrl] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { enabled2fa, verified2fa } = useTwoFactorRedirect(); 

  useEffect(() => {
    tokenRequestComponent.post('/enable2fa')
      .then(response => {
        setGoogle2faUrl(response.data.google2faUrl);
      })
      .catch(error => {
        setError(error);
      });
  }, []);

  const handleVerifyClick = () => {
    navigate('/Verify2FA');
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      {google2faUrl && (
        <div className="w-full max-w-md p-6 space-y-4 bg-white rounded-lg shadow-md">
          <label className="block mb-2 text-lg font-semibold">Two Factor Authentication</label>
          <p className="text-center text-gray-600">
            To enable two-factor authentication, install{' '}
            <a
              href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              Google Authenticator
            </a>{' '}
            or{' '}
            <a
              href="https://www.microsoft.com/en-us/account/authenticator"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              Microsoft Authenticator
            </a>{' '}
            on your device. Open the app and scan the QR code above.
          </p>
          <div className="flex items-center justify-center">
            <QRCode value={google2faUrl} />
          </div>
          <button
            onClick={handleVerifyClick}
            className="block w-full py-2 text-center text-white bg-indigo-600 rounded hover:bg-indigo-700"
          >
            Verify 2FA
          </button>
          {error && <div className="text-center text-red-500">{error}</div>}
        </div>
      )}
    </div>
  );
};

export default Enable2FA;
