import React from 'react';
import AdminSideNavigationBar from '../Components/AdminNavigationBar';

// Definition of the Admin component, which receives a prop setIsLogged
const Admin = ({ setIsLogged }) => {
    // Rendering of the component
    return (
            <div>
                <AdminSideNavigationBar setIsLogged={setIsLogged}/>
            </div>
    );
};

export default Admin;
