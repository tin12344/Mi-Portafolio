import React from 'react';
import SideBar from '../components/sideBar.jsx';
import Table from '../components/tablePosts.jsx';
import useTwoFactorRedirect from '../components/useTwoFactorRedirect';

const posts = () => {
    const { enabled2fa, verified2fa } = useTwoFactorRedirect(); 
    return (
        <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/4">
                <SideBar />
            </div>
            <div className="w-full md:w-3/4">
                <h1 className="mb-8 text-lg font-bold text-gray-900 sm:text-x2 md:text-3xl dark:text-gray-900">Posts on Queue</h1>
                <Table />
            </div>
        </div>
    );
};

export default posts;