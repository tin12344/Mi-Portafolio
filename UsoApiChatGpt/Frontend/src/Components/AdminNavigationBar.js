// Required imports for the component
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./SideNavigatioBar.css";

// Definition of the AdminNavigationBar component, which receives a prop setIsLogged
const AdminNavigationBar = ({ setIsLogged }) => {
    // Get the admin's name from the browser's session
    const adminName = sessionStorage.getItem('user');
    // Get the first letter of the admin's name or an empty string if the name is null or empty
    const firstLetter = adminName ? adminName[0] : '';
    // Use the useNavigate function provided by React Router for navigation between routes
    const navigate = useNavigate();

    // Function to sign out
    const signOut = () => {
        // Set 'false' for the 'auth' key in the browser's session to indicate that the user is not authenticated
        sessionStorage.setItem('auth', false);
        // Call the setIsLogged function to change the login state in the parent component to 'false'
        setIsLogged(false);
        // Navigate to the home page ("/") after signing out
        navigate("/");
    }

    // Rendering of the component
    return (
        <div className="sidebar">
            {/* Navigation bar logo */}
            <div className="brand">
                <p>A<span>dministration</span></p>
            </div>
            {/* Navigation links list */}
            <ul className="nav-list">
                <li className="nav-item">
                    {/* Link to view the admin user page */}
                    <Link to="/adminUser" className="nav-link">
                        <span className="nav-item__icon">
                        </span>
                        <span className="nav-item__text">
                            User
                        </span>
                    </Link>
                    {/* Link to view the admin user table */}
                    <Link to="/tableUserAdmin" className="nav-link">
                        <span className="nav-item__icon">
                        </span>
                        <span className="nav-item__text">
                            Edit
                        </span>
                    </Link>
                </li>
            </ul>
            {/* Admin details and logout link */}
            <ul className="nav-list">
                <li className="nav-item">
                    {/* Admin's avatar (first letter of their name) */}
                    <span className="nav-item__icon avatar">{firstLetter}</span>
                    {/* Admin's name */}
                    <span className="nav-item__text">
                        {adminName}
                    </span>
                </li>
                <li className="nav-item">
                    {/* Link to sign out, onClick will execute the signOut function */}
                    <Link to="/" onClick={signOut} className="nav-link">
                        <span className="nav-item__icon logout">
                        </span>
                        <span className="nav-item__text">
                            Logout
                        </span>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default AdminNavigationBar;
