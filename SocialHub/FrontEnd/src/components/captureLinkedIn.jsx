import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import tokenRequestComponent from './tokenRequestComponent';

const captureLinkedIn = () => {
    const navigate = useNavigate();

    useEffect(() => {

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const code = urlParams.get('code');

        const getAccessToken = async () => {
            const body = { code: code }
            try {
                await tokenRequestComponent.post('/linkedin_getAccessToken', body);
            } catch (error) {
                console.log(error);
            } finally {
              navigate('/PublishPosts');
            }
        }

        getAccessToken();

    }, []);

    return (
        <div>

        </div>
    );
};

export default captureLinkedIn;