import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserNavigationBar from '../Components/UserNavigationBar.js';
import "./UserProfileStyle.css"

const UserProfile = ({ setIsLogged }) => {
    const [userData, setUserData] = useState({
        user_name: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        two_factor: false
    });
    const userId = sessionStorage.getItem('userId');

    // Function to fetch user data from the server
    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_USER_ID}?id=${userId}`,{
                headers: {
                  'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                }
              });
            if (response.status === 200) {
                const userData = response.data;
                setUserData(userData);
            }
        } catch (error) {
            console.error('Error to obtain the prompts:', error);
        }
    };

    // Fetch user data on component mount
    useEffect(() => {
        fetchUserData();
    }, []);

    const handleChange = (event) => {
        const { name, value, type } = event.target;
        const newValue = type === 'radio' ? event.target.value === 'true' : value;
        setUserData({ ...userData, [name]: newValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const updatedUser = {
                ...userData,
                id: userId,
            };

            // Send a PATCH request to update the User
            const response = await axios.patch(`${process.env.REACT_APP_USER}?id=${userId}`, updatedUser,{
                headers: {
                  'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                }
              });
            if (response.status === 200) {
                console.log('User Edited');
            }

        } catch (error) {
            console.error('Error to edit the prompt:', error);
        }
    };

    return (
        <div>
            <UserNavigationBar setIsLogged={setIsLogged} />
            <form id="register" method="post" onSubmit={handleSubmit}>
                <h2 id="profile-title">Profile data</h2>
                <div className="register_box">
                    <label htmlFor="user_name">User Name</label>
                    <input id="user_name" name='user_name' type="text" className="profile-input" value={userData.user_name} required onChange={handleChange}></input>
                </div>
                <div className="register_box">
                    <label htmlFor="first_name">Name</label>
                    <input id="first_name" name='first_name' type="text" className="profile-input" value={userData.first_name} required onChange={handleChange}></input>
                </div>
                <div className="register_box">
                    <label htmlFor="last_name">Last name</label>
                    <input id="last_name" type="text" name='last_name' required className="profile-input" value={userData.last_name} onChange={handleChange}></input>
                </div>
                <div className="register_box">
                    <label htmlFor="email">E-mail</label>
                    <input id="email" type="email" name='email' required className="profile-input" value={userData.email} onChange={handleChange}></input>
                </div>
                <div className="register_box">
                    <label htmlFor="phone">Phone</label>
                    <input id="phone" type="tel" name='phone' required className="profile-input" value={userData.phone} onChange={handleChange}></input>
                </div>
                <div className="register_box">
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" name="password" required className="profile-input" placeholder='Type old password or type a new one' onChange={handleChange}></input>
                </div>
                <div className="combo_container">
                    <label htmlFor="two_factor">Two factorautentification</label>
                    <div className="register_combo">
                        <div>
                            <input name="two_factor" checked={userData.two_factor === true} value={true} type="radio" onChange={handleChange}></input>
                            <label htmlFor="enable">Enable</label>
                        </div>
                        <div>
                            <input name="two_factor" checked={userData.two_factor === false} value={false} type="radio" onChange={handleChange}></input>
                            <label htmlFor="disable">Disable</label>
                        </div>
                    </div>
                </div>
                <button type="submit" className="profile-button" >Save Changes</button>
            </form>
        </div>
    );
};

export default UserProfile;