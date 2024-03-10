import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import tokenRequestComponent from './tokenRequestComponent';

const captureReddit = () => {
  const navigate = useNavigate();
  const api_url = import.meta.env.VITE_API_URL;

  useEffect(() => {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get('code');
    const body = { code };

    const getAccessToken = async () => {
      try {
        await tokenRequestComponent.post('/getToken', body);
      } catch (error) {
        console.log(error);
      } finally {
        navigate('/PublishPosts');
      }
    };

    getAccessToken();

  }, []);


  return (
    <div>

    </div>
  );
};

export default captureReddit;