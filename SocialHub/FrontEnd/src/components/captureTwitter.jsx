import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import tokenRequestComponent from './tokenRequestComponent';

const captureTwitter = () => {
    const navigate = useNavigate();

    useEffect(() => {

        const getSignature = async () => {
            try {
                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);
                const code = urlParams.get('code');
                await tokenRequestComponent.post('/getSignature', {'code': code});
            } catch (error) {
                console.log(error);
            } finally {
                navigate('/PublishPosts');
            }
        };

        getSignature();
    }, []);

    return (
        <div>

        </div>
    );
};

export default captureTwitter;