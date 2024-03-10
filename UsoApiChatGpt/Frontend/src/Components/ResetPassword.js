import React, { useState } from 'react';
import axios from 'axios';
import "./ResetPasswordStyles.css"
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [newPassword, setnewPassword] = useState('');
    const [error, setError] = useState('');
    const tokenUrl = new URLSearchParams(window.location.search);
    const verifyPassword = tokenUrl.get('token');
    const navigateTo = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();
        

        try {
            // Create an object with the username and email to reset the password
            const reset = {
                token: verifyPassword,
                password,
            };
            // Send a POST request to the server to initiate a new session (login)
            const responseSession = await axios.post(
                process.env.REACT_APP_UPDATE_PASSWORD, reset
            );
            setPassword("");
            setnewPassword("");
            navigateTo("/");
        } catch (error) {
            console.error(error);
            setError('An error occurred');
        }
    };


    return (
        <div>
            <div className="form-container">
                <h2>New Password</h2>
                {/* Display the error message if there is an error */}
                {error && <p className="error-message">{error}</p>}
                <form className="login-form" onSubmit={handleReset}>
                    <div>
                        {/* Input field for the username */}
                        <input type="password" id="username" placeholder="New Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div>
                        {/* Input field for the Email */}
                        <input type="password" id="email" placeholder="Repeat Password" required value={newPassword} onChange={(e) => setnewPassword(e.target.value)} />
                    </div>
                    {/* Submit button to send the email*/}
                    <button type="submit">
                            Reset
                    </button>
                </form>
            </div>

        </div>
    );
};

export default ResetPassword;