import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./SideNavigatioBar.css";

// Definition of the UserNavigationBar component, which receives a prop setIsLogged
const UserNavigationBar = ({ setIsLogged }) => {
    // Get the user's name from the browser's session
    const userName = sessionStorage.getItem('user');
    // Get the first letter of the user's name or an empty string if the name is null or empty
    const primeraLetra = userName ? userName[0] : '';
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

    return (
        <div className="sidebar">
            {/* Navigation bar logo */}
            <div className="brand">
                <Link to="/user">
                    <p>P<span>rompt</span></p>
                </Link>
            </div>
            {/* Navigation links list */}
            <ul className="nav-list">
                <div className="nav-item__text__separate">
                    {/* Title for Edit Prompt section */}
                    <span className="nav-item__text">
                        Edit Prompt
                    </span>
                    <li className="nav-item">
                        {/* Link to Create Prompt page */}
                        <Link to="/UserEditPrompts" className="nav-link">
                            <span className="nav-item__icon logout">
                            </span>
                            <span className="nav-item__text">
                                Create
                            </span>
                        </Link>
                        {/* Link to Edit Prompt page */}
                        <Link to="/userEditMaintencePrompts" className="nav-link">
                            <span className="nav-item__icon logout">
                            </span>
                            <span className="nav-item__text">
                                Edit
                            </span>
                        </Link>
                    </li>
                </div>
                {/* Section for Image Prompt */}
                <div className="nav-item__text__separate">
                    {/* Title for Image Prompt section */}
                    <span className="nav-item__text">
                        Image Prompt
                    </span>
                    <li className="nav-item">
                        {/* Link to Create Image Prompt page */}
                        <Link to="/userImagePrompt" className="nav-link">
                            <span className="nav-item__icon logout">
                            </span>
                            <span className="nav-item__text">
                                Create
                            </span>
                        </Link>
                        {/* Link to Edit Image Prompt page */}
                        <Link to="/userImageMaintencePrompt" className="nav-link">
                            <span className="nav-item__icon logout">
                            </span>
                            <span className="nav-item__text">
                                Edit
                            </span>
                        </Link>
                    </li>
                </div>
                {/* Section for Completion Prompt */}
                <div className="nav-item__text__separate">
                    <span className="nav-item__text">
                        Completion Prompt
                    </span>
                    <li className="nav-item">
                        {/* Link to Create Completion Prompt page */}
                        <Link to="/userCompletionPrompt" className="nav-link">
                            <span className="nav-item__icon logout">
                            </span>
                            <span className="nav-item__text">
                                Create
                            </span>
                        </Link>
                        {/* Link to Edit Completion Prompt page */}
                        <Link to="/userCompletionMaintancePrompt" className="nav-link">
                            <span className="nav-item__icon logout">
                            </span>
                            <span className="nav-item__text">
                                Edit
                            </span>
                        </Link>
                    </li>
                </div>
            </ul>
            {/* User details and logout link */}
            <ul className="nav-list">
                <li className="nav-item">
                    {/* User's avatar (first letter of their name) */}
                    <span className="nav-item__icon avatar">
                        {primeraLetra}
                    </span>
                    {/* User's name */}
                    <span className="nav-item__text">
                        <Link to="/userProfile" className="nav-link">
                            {userName}
                        </Link>
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

export default UserNavigationBar;