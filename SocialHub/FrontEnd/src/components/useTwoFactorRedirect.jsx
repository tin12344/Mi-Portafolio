import { useState, useEffect } from 'react';
import tokenRequestComponent from './tokenRequestComponent';

const useTwoFactorRedirect = () => {

    useEffect(() => {

        const checkAndRedirect = async () => {
          const resp = await tokenRequestComponent.get(`/get_user`);
          sessionStorage.setItem('user', JSON.stringify(resp.data.user));
          const path = window.location.pathname;
      
          if (resp.data.user.two_fa_enabled === 0 && path !== '/Enable2FA' && path !== '/Verify2FA') {
              window.location.href = '/Enable2FA';
          } else if (resp.data.user.two_fa_verified === 0 && path !== '/Verify2FA' && path !== '/Enable2FA') {
              window.location.href = '/Verify2FA';
          }
        };

        checkAndRedirect();
    }, []);

    return {
    };
};

export default useTwoFactorRedirect;
