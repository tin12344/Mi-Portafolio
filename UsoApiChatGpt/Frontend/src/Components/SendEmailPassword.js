import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "./ResetPasswordStyles.css"

const SendEmailPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleReset = async (e) => {
        e.preventDefault();

        try {
            // Create an object with the username and email to reset the password
            const reset = {
                email,
            };
            // Send a POST request to the server to initiate a new session (login)
            const responseSession = await axios.post(
                process.env.REACT_APP_SEND_PASSWORD_EMAIL,
                reset
            );
            setEmail("");
        } catch (error) {
            console.error(error);
            setError('An error occurred');
        }
    };

    return (
        <div>
            <div className="form-container">
                <h2>Reset Password</h2>
                {/* Display the error message if there is an error */}
                {error && <p className="error-message">{error}</p>}
                <form className="login-form" onSubmit={handleReset}>
                    <div>
                        {/* Input field for the Email */}
                        <input type="email" id="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    {/* Submit button to send the email*/}
                    <button type="submit">Send Email</button>
                    {/* Link to the login page */}
                    <Link to="/" className="login-link">
                        Login
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default SendEmailPassword;