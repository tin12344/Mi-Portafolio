import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import './LoginStyles.css';

// Definition of the Login component, which receives a prop setIsLogged
const Login = ({ setIsLogged }) => {
  // State variables to store the username, password, and error message
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // Use the useNavigate function provided by React Router for navigation between routes
  const navigate = useNavigate();

  const sendVerificationCode = async(userId) => {
    try {
      console.log(sessionStorage.getItem('token'));
      await axios.post(`${process.env.REACT_APP_SEND_MESSAGE}?id=${userId}`, {} ,{
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        }
      });
    } catch (error) {
      console.error('Error to send message', error);
      throw error;
    }
  };

  // Function to handle the login process
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Create an object with the username and password for the login session
      const newSession = {
        user_name: username,
        password,
      };
      // Send a POST request to the server to initiate a new session (login)
      const responseSession = await axios.post(
        process.env.REACT_APP_SESSION,
        newSession,{
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
          }
        }
      );

      // Decode the token received from the server to extract user information
      const decodedToken = jwtDecode(responseSession.data.token);
      // Store user details and authentication status in browser's session storage
      sessionStorage.setItem('user', decodedToken.username);
      sessionStorage.setItem('userId', decodedToken.id);
      sessionStorage.setItem('auth', true);
      sessionStorage.setItem('token', responseSession.data.token);

      // Check user role and state to determine which page to navigate
      if (decodedToken.role === 'admin' && decodedToken.state === true) {
        setIsLogged(true);
        // Navigate to the admin page
        navigate('/admin');
      } else if (decodedToken.role === 'user' && decodedToken.state === true && decodedToken.two_factor === true) {
        await sendVerificationCode(decodedToken.id);
        setIsLogged(true);
        // Navigate to the verification page and pass setIsLogged as a prop
        navigate('/verification', { setIsLogged });
      }
      else if (decodedToken.role === 'user' && decodedToken.state === true && decodedToken.two_factor === false) {
        setIsLogged(true);
        // Navigate to the user page
        navigate('/user');
      }
      else {
        // If the user's role or state is invalid, display an error message
        setError('Invalid username or password');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred');
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      {/* Display the error message if there is an error */}
      {error && <p className="error-message">{error}</p>}
      <form className="login-form" onSubmit={handleLogin}>
        <div>
          {/* Input field for the username */}
          <input type="text" id="username" placeholder="Username" required value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          {/* Input field for the password */}
          <input type="password" id="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {/* Submit button for the login form */}
        <button type="submit">Login</button>
        {/* Link to the registration page */}
        <Link to="/register" className="register-link">
          Register
        </Link>
        {/* Link to the send email for reset password */}
        <Link to="/sendEmailPassword" className="register-link">
          Reset your password
        </Link>
      </form>
    </div>
  );
};

export default Login;
