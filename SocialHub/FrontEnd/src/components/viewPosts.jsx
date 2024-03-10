import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faReddit, faTwitter } from '@fortawesome/free-brands-svg-icons';

const ViewPosts = ({ post, onClose }) => {
  if (!post) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
      <div className="p-8 bg-white rounded-md">
        <div className="w-full max-w-lg">
          <h1 className="block mb-3 text-lg font-bold tracking-wide text-gray-700 uppercase">
            View Post
          </h1>
          <div className="flex flex-wrap mb-6 -mx-3">
            <div className="w-full px-3 mb-6">
              <label className="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase">
                Post Content
              </label>
              <textarea
                value={post.post}
                readOnly
                className="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none resize-none"
                rows="4"
              />
            </div>
            <div className="w-full px-3 mb-6">
              <label className="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase">
                Social Media
              </label>
              <div className="inline-flex justify-center mr-3">
                  {post.social_media_posts.map((social_media_post, index) => (
                    <span key={index} style={{ marginRight: '3px', fontSize: '22px' }}>
                      {social_media_post.social_media.name === 'LINKEDIN' && <FontAwesomeIcon icon={faLinkedin} />}
                      {social_media_post.social_media.name === 'REDDIT' && <FontAwesomeIcon icon={faReddit} />}
                      {social_media_post.social_media.name === 'TWITTER' && <FontAwesomeIcon icon={faTwitter} />}
                      </span>
                  ))}
              </div>
            </div>
            <div className="w-full px-3 mb-6">
              <label className="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase">
                Type
              </label>
              <input
                value={post.type}
                readOnly
                className="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none"
                type="text"
              />
            </div>
            <div className="w-full px-3 mb-6">
              <label className="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase">
                Schedule Post
              </label>
              {post.type === 'SCHEDULED' && post.schedule_post ? (
                <div className="flex justify-center">
                  <div className="form-control">{`${post.schedule_post.day} - ${post.schedule_post.hour}`}</div>
                </div>
              ) : (
                <div>No schedule available</div>
              )}
            </div>
            <div className="w-full px-3 mb-6">
              <label className="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase">
                Status
              </label>
              <input
                value={post.status}
                readOnly
                className="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none"
                type="text"
              />
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 mr-3 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewPosts;
