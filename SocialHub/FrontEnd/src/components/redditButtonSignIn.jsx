import { faReddit } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import tokenRequestComponent from './tokenRequestComponent';
import React from 'react';

const redditButtonSignIn = () => {


    const login = async () => {
        try {
          const response = await tokenRequestComponent.get('/loginReddit');
          const linkLogin = response.data.link;
          window.location.href = linkLogin;
        } catch (error) {
          console.log(error);
        }
      };

    return (
        <div>
            <div>
                <button type="button" onClick={login} className="text-white bg-[#f2791d] hover:bg-[#1da1f2]/90 focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 me-2 mb-2">
                    <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 17">
                        <FontAwesomeIcon icon={faReddit} />
                    </svg>
                    Sign in with Reddit
                </button>
            </div>
        </div>
    );
};

export default redditButtonSignIn;