import React, { useState, useEffect } from 'react';
import ViewPosts from './viewPosts';
import tokenRequestComponent from './tokenRequestComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faReddit, faTwitter } from '@fortawesome/free-brands-svg-icons';

const TablePosts = () => {
  const [showView, setShowView] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    try {
      const response = await tokenRequestComponent.get(`/posts`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleViewClick = (post) => {
    setSelectedPost(post);
    setShowView(true);
  };

  const handleCloseView = () => {
    setShowView(false);
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  const publishedPosts = posts.filter((post) => post.status === 'PUBLISHED');
  const pendingPosts = posts.filter((post) => post.status === 'PENDING');

  return (
    <div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Post
              </th>
              <th scope="col" className="px-6 py-3">
                Social Media
              </th>
              <th scope="col" className="px-6 py-3">
                Type
              </th>
              <th scope="col" className="px-6 py-3">
                Day
              </th>
              <th scope="col" className="px-6 py-3">
                Hour
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                View
              </th>
            </tr>
          </thead>
          <tbody>
            {pendingPosts.map((post) => (
              <tr key={post.id} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {truncateText(post.post, 11)}
                </th>
                <td className="px-6 py-4" style={{ minWidth: '100px' }}>
                  {post.social_media_posts.map((social_media_post, index) => (
                    <span key={index} style={{ marginRight: '3px', fontSize: '22px' }}>
                      {social_media_post.social_media.name === 'LINKEDIN' && <FontAwesomeIcon icon={faLinkedin} />}
                      {social_media_post.social_media.name === 'REDDIT' && <FontAwesomeIcon icon={faReddit} />}
                      {social_media_post.social_media.name === 'TWITTER' && <FontAwesomeIcon icon={faTwitter} />}
                      </span>
                  ))}
                </td>
                <td className="px-6 py-4">
                  {post.type}
                </td>
                <td className="px-6 py-4">
                  {post.schedule_post?.day}
                </td>
                <td className="px-6 py-4">
                  {post.schedule_post?.hour}
                </td>
                <td className="px-6 py-4">
                  {post.status}
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => handleViewClick(post)}><a className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View</a></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <br /><br />
      <h1 className="mb-8 text-lg font-bold text-gray-900 sm:text-x2 md:text-3xl dark:text-gray-900">Posts History</h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Post
              </th>
              <th scope="col" className="px-6 py-3">
                Social Media
              </th>
              <th scope="col" className="px-6 py-3">
                Type
              </th>
              <th scope="col" className="px-6 py-3">
                Day
              </th>
              <th scope="col" className="px-6 py-3">
                Hour
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                View
              </th>
            </tr>
          </thead>
          <tbody>
            {publishedPosts.map((post) => (
              <tr key={post.id} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {truncateText(post.post, 11)}
                </th>
                <td className="px-6 py-4" style={{ minWidth: '100px' }}>
                  {post.social_media_posts.map((social_media_post, index) => (
                    <span key={index} style={{ marginRight: '3px', fontSize: '22px' }}>
                      {social_media_post.social_media.name === 'LINKEDIN' && <FontAwesomeIcon icon={faLinkedin} />}
                      {social_media_post.social_media.name === 'REDDIT' && <FontAwesomeIcon icon={faReddit} />}
                      {social_media_post.social_media.name === 'TWITTER' && <FontAwesomeIcon icon={faTwitter} />}
                      </span>
                  ))}
                </td>
                <td className="px-6 py-4">
                  {post.type}
                </td>
                <td className="px-6 py-4">
                  {post.schedule_post?.day}
                </td>
                <td className="px-6 py-4">
                  {post.schedule_post?.hour}
                </td>
                <td className="px-6 py-4">
                  {post.status}
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => handleViewClick(post)}><a className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View</a></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showView &&
        <ViewPosts
          post={selectedPost}
          onClose={handleCloseView}
        />
      }
    </div>
  );
};
export default TablePosts;
