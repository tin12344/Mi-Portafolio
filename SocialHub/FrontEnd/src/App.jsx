import React, {useEffect} from 'react';
import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from './pages/index.jsx';
import Register from './pages/register.jsx';
import Posts from './pages/posts.jsx';
import ProgramPost from './pages/programPost.jsx';
import PublishPosts from './pages/publishPosts.jsx';
import CaptureLinkedIn from './components/captureLinkedIn.jsx';
import CaptureReddit from './components/captureReddit.jsx';
import CaptureTwitter from './components/captureTwitter.jsx';
import Cookies from 'js-cookie';
import Enable2FA from './pages/enable2FA.jsx';
import Verify2FA from './pages/verify2FA.jsx';

function App() {

  useEffect(() => {
    const token = Cookies.get('token');
    const path = window.location.pathname;

    if (!token && path !== '/' && path !== '/Register') {
      window.location.href = '/';
    } else if (token && (path === '/' || path === '/Register')) {
      window.location.href = '/Posts';
    }
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Index />,
    }, {
      path: "/Register",
      element: <Register />,
    }, {
      path: "/Posts",
      element: <Posts />,
    }, {
      path: "/ProgramPost",
      element: <ProgramPost />,
    }, {
      path: "/PublishPosts",
      element: <PublishPosts />,
    }, {
      path: "/CaptureLinkedIn",
      element: <CaptureLinkedIn />,
    }, {
      path: "/CaptureReddit",
      element: <CaptureReddit />,
    }, {
      path: "/CaptureTwitter",
      element: <CaptureTwitter />,
    },
    {
      path: "/Enable2FA",
      element: <Enable2FA />,
    },
    {
      path: "/Verify2FA",
      element: <Verify2FA />,
    },
  ]);

  return (
      <RouterProvider router={router} />
  )
}

export default App
