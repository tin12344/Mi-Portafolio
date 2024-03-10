import React, { useState } from 'react';
import './RegisterStyles.css';
import axios from 'axios';
import { Link } from "react-router-dom";
import ModalCompleteData from '../Components/ModalCompleteData.js';

// Definition of the Register component
const Register = () => {

    // State variables to manage the display of the modal and user data in the form
    const [showModal, setShowModal] = useState(false);
    const [userData, setUserData] = useState({
        user_name: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
    });

    // Function to handle form input changes
    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.id]: e.target.value });
    };

    // Function to close the modal
    const closeModal = () => {
        setShowModal(false);
    };

    // Function to handle form submission (user registration)
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if any required fields are empty and show the modal if necessary
        if (
            userData.user_name === '' ||
            userData.first_name === '' ||
            userData.last_name === '' ||
            userData.email === '' ||
            userData.phone === '' ||
            userData.password === ''
        ) {
            setShowModal(true);
            return;
        }
        try {
            // Create a new user object from the form data
            const newUser = {
                ...userData,
                role: 'user',
                state: false,
                two_factor: true
            };

            // Send a POST request to the server to register the new user
            const response = await axios.post(process.env.REACT_APP_USER_REGISTER, newUser);
            console.log(response);
            // Reset the form fields after successful registration
            setUserData({
                user_name: '',
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                password: '',
                two_factor: true,
            });
        } catch (error) {
            console.log(error.response.data);
        }
    };

    return (
        <div className="form-container">
            {/* Registration form */}
            <form className="register-form" onSubmit={handleSubmit}>
                <h2>Register</h2>
                <div>
                    {/* Input field for the username */}
                    <input type="text" id="user_name" placeholder="User Name" value={userData.user_name} onChange={handleChange} />
                </div>
                <div>
                    {/* Input field for the first name */}
                    <input type="text" id="first_name" placeholder="First Name" value={userData.first_name} onChange={handleChange} />
                </div>
                <div>
                    {/* Input field for the last name */}
                    <input type="text" id="last_name" placeholder="Last Name" value={userData.last_name} onChange={handleChange} />
                </div>
                <div>
                    {/* Input field for the email */}
                    <input type="email" id="email" placeholder="Email" value={userData.email} onChange={handleChange} />
                </div>
                <div>
                    {/* Input field for the phone number */}
                    <input type="tel" id="phone" placeholder="Phone number" value={userData.phone} onChange={handleChange} />
                </div>
                <div>
                    {/* Input field for the password */}
                    <input type="password" id="password" placeholder="Password" value={userData.password} onChange={handleChange} />
                </div>
                {/* Submit button for the registration form */}
                <button type="submit">Register</button>
                {/* Link to the login page */}
                <Link to="/" className="login-link">
                    Login
                </Link>
            </form>
            {/* Display the ModalCompleteData component when showModal is true */}
            {showModal && <ModalCompleteData closeModal={closeModal} />}
        </div>
    );
};

export default Register;
