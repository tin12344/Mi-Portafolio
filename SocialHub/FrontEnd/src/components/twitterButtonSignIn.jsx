import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import tokenRequestComponent from './tokenRequestComponent';


const twitterButtonSignIn = () => {

    const login = async () => {
        try {
          const response = await tokenRequestComponent.get("/loginTwitter");
          window.location.href = response.data.link;
        } catch (error) {
          console.log(error);
        }
      }

    return (
        <div>
            <button type="button" onClick={login} className="text-white bg-[#1da1f2] focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 me-2 mb-2">
                <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 17">
                    <FontAwesomeIcon icon={faTwitter} />
                </svg>
                Sign in with Twitter
            </button>
        </div>
    );
};

export default twitterButtonSignIn;