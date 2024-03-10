import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import tokenRequestComponent from './tokenRequestComponent';

const linkedinButtonSignIn = () => {
    const api_url = import.meta.env.VITE_API_URL;

    const login = async () => {
        try {
          const response = await tokenRequestComponent.get("/linkedin_login");
          window.location.href = response.data.link;
        } catch (error) {
          console.log(error);
        }
      }

    return (
        <div>
            <button type="button" onClick={login} className="text-white bg-[#1da1f2] focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 me-2 mb-2">
                <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 17">
                    <FontAwesomeIcon icon={faLinkedin} />
                </svg>
                Sign in with Linkedin
            </button>
        </div>
    );
};

export default linkedinButtonSignIn;