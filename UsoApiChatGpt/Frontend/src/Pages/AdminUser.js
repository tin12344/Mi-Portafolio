import React, { useState } from 'react';
import SideNavigationBar from '../Components/AdminNavigationBar';
import ModalCompleteData from '../Components/ModalCompleteData.js';
import axios from 'axios';
import "./AdminUser.css";

// Definition of the AdminUser component, which receives a prop setIsLogged
const AdminUser = ({ setIsLogged }) => {
    // State to manage the display of the modal
    const [showModal, setShowModal] = useState(false);
    // State to manage user data in the form
    const [userData, setUserData] = useState({
        user_name: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        state: false,
        role: 'user',
        two_factor: true
    });

    // Function to handle form input changes
    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.id]: e.target.value });
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if any required fields are empty and show the modal if necessary
        if (
            userData.user_name === '' ||
            userData.first_name === '' ||
            userData.last_name === '' ||
            userData.email === '' ||
            userData.phone === '' ||
            userData.state === ''
        ) {
            setShowModal(true);
            return;
        }

        try {
            // Create a new user object from the form data
            const newUser = {
                ...userData,
            };

            // Send a POST request to the server to add the new user
            const response = await axios.post(process.env.REACT_APP_USER, newUser,{
                headers: {
                  'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                }
              });
            // Reset the form fields after successful submission
            setUserData({
                user_name: '',
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                password: '',
                state: false,
                role: 'user',
                two_factor: true
            });
        } catch (error) {
            console.log(error.response.data);
        }
    };

    // Function to close the modal
    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div>
            {/* Display the SideNavigationBar component to show the admin side navigation bar */}
            <SideNavigationBar setIsLogged={setIsLogged} />
            {/* Main container for the admin user page */}
            <div className="admin-user-container">
                <div className="admin-user-wrapper">
                    {/* Form section to add a new user */}
                    <div className="admin-user-form">
                        <h1 className="admin-user-title">Add new User</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="admin-user-form-group">
                                <label htmlFor="user_name">User name:</label>
                                <input id="user_name" type="text" className="admin-user-input" value={userData.user_name} onChange={handleChange} />
                            </div>
                            <div className="admin-user-form-group">
                                <label htmlFor="first_name">First name:</label>
                                <input id="first_name" type="text" className="admin-user-input" value={userData.first_name} onChange={handleChange} />
                            </div>
                            <div className="admin-user-form-group">
                                <label htmlFor="last_name">Last Name:</label>
                                <input id="last_name" type="text" className="admin-user-input" value={userData.last_name} onChange={handleChange} />
                            </div>
                            <div className="admin-user-form-group">
                                <label htmlFor="email">Email:</label>
                                <input type="email" id="email" className="admin-user-input" value={userData.email} onChange={handleChange} />
                            </div>
                            <div className="admin-user-form-group">
                                <label htmlFor="phone">Phone:</label>
                                <input type="tel" id="phone" className="admin-user-input" value={userData.phone} onChange={handleChange} placeholder="Enter phone number" />
                            </div>
                            <div className="admin-user-form-group">
                                <label htmlFor="password">Password:</label>
                                <input type="password" id="password" className="admin-user-input" value={userData.password} onChange={handleChange} placeholder="Enter a password" />
                            </div>
                            <div className="admin-user-form-group">
                                <label htmlFor="state">State:</label>
                                <select id="state" name="state" className="admin-user-select" value={userData.state} onChange={handleChange}>
                                    <option value={true}>True</option>
                                    <option value={false}>False</option>
                                </select>
                            </div>
                            <button type="submit" className="admin-user-button">Add User</button>
                        </form>
                    </div>
                    {/* Display the ModalCompleteData component when showModal is true */}
                    {showModal && <ModalCompleteData closeModal={closeModal} />}
                </div>
            </div>
        </div>
    );
};

export default AdminUser;
