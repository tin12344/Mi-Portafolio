import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./TableAdminUser.css";
import AdminNavigationBar from './AdminNavigationBar';

// Definition of the TableUserAdmin component, which receives a prop setIsLogged
const TableUserAdmin = ({ setIsLogged }) => {
    // State to store the list of users
    const [users, setUsers] = useState([]);

    // useEffect hook to fetch users data when the component mounts
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Fetch user data from the server using an API endpoint specified in the environment variable
                const response = await axios.get(process.env.REACT_APP_USER,{
                    headers: {
                      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                    }
                  });
                if (response.status === 200) {
                    // Filter the users data to get only the ones with the role 'user'
                    const usersData = response.data;
                    const filteredUsers = usersData.filter(user => user.role === 'user');
                    // Update the state with the filtered users data
                    setUsers(filteredUsers);
                }
            } catch (error) {
                console.error('Error to obtain the user:', error);
            }
        };

        fetchUsers();
    }, []);

    // Function to handle state change for a user
    const handleStateChange = async (userId, newState) => {
        try {
            // Update the user's state in the server using a PATCH request with the user ID and the new state value
            const response = await axios.patch(`${process.env.REACT_APP_USER}?id=${userId}`, { state: newState },{
                headers: {
                  'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                }
              });
            if (response.status === 200) {
                // Update the state locally with the updated user's state
                setUsers(prevUsers => {
                    const updatedUsers = prevUsers.map(user => {
                        if (user._id === userId) {
                            return { ...user, state: newState };
                        }
                        return user;
                    });
                    return updatedUsers;
                });
            }
        } catch (error) {
            console.error('Error to update the state:', error);
        }
    };

    // Function to handle deleting a user
    const handleDeleteUser = async (userId) => {
        try {
            // Delete the user from the server using a DELETE request with the user ID
            const response = await axios.delete(`${process.env.REACT_APP_USER}?id=${userId}`,{
                headers: {
                  'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                }
              });
            if (response.status === 200) {
                // Update the state locally by removing the deleted user from the users list
                setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
            }
        } catch (error) {
            console.error('Error to delete the user:', error);
        }
    };

    return (
        <div>
            <AdminNavigationBar setIsLogged={setIsLogged} />
            <h2>User List</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>State</th>
                        <th>Control</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Map through the users and display each user's data in a table row */}
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.first_name + " " + user.last_name}</td>
                            <td>
                                {/* Display a dropdown menu to change the user's state */}
                                <select
                                    className="select-field" value={user.state.toString()} onChange={(e) => handleStateChange(user._id, e.target.value === 'true')}
                                >
                                    <option value="true">True</option>
                                    <option value="false">False</option>
                                </select>
                            </td>
                            <td>
                                {/* Display a button to delete the user */}
                                <button className="button_delete" onClick={() => handleDeleteUser(user._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableUserAdmin;
