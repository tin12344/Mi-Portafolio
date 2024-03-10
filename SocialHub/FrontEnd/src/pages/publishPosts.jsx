import React, { useEffect, useState } from 'react';
import Sidebar from '../components/sideBar.jsx';
import ButtonLinkedin from '../components/linkedinButtonSignIn.jsx';
import ButtonReddit from '../components/redditButtonSignIn.jsx';
import ButtonTwitter from '../components/twitterButtonSignIn.jsx';
import tokenRequestComponent from '../components/tokenRequestComponent.jsx';
import useTwoFactorRedirect from '../components/useTwoFactorRedirect';

const publishPosts = () => {
    const { enabled2fa, verified2fa } = useTwoFactorRedirect();
    const [isScheduled, setIsScheduled] = useState(false);
    const [selectedSocialMedia, setSelectedSocialMedia] = useState([]);
    const [linkedinName, setLinkedinName] = useState();
    const [redditName, setRedditName] = useState();
    const [twitterName, setTwitterName] = useState();
    const [schedulePosts, setSchedulePosts] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState({
      post: '',
      type: 'INSTANT',
      socialMedia: [],
      scheduleId: null,
    });

    const handleScheduleChange = (e) => {
      setFormData({
        ...formData,
        scheduleId: e.target.value,
      });
      setSelectedSchedule(e.target.value);
    };
  
    const handleSchedule = () => {
      setFormData({
        ...formData,
        type: formData.type === 'INSTANT' ? 'SCHEDULED' : 'INSTANT',
      });

      setIsScheduled(formData.type);
    };
    

    useEffect(() => {
      const getSocialMedia = async () => {
        try {
          const response = await tokenRequestComponent.get(`/social_media`);
          response.data.map((item) => {
            if (item.name == 'LINKEDIN') {
              setLinkedinName(item.user_name);
            } else if (item.name == 'TWITTER') {
              setTwitterName(item.user_name);
            } else if (item.name == 'REDDIT') {
              setRedditName(item.user_name);
            }
          });
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      };

      const getSchedules = async () => {
        try {
          const response = await tokenRequestComponent.get(`/schedule_posts`);
          setSchedulePosts(response.data);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      };

      getSocialMedia();
      getSchedules();
    }, []);

    const handleChange = (e) => {
      const { value } = e.target;
      const selectedCopy = [...formData.socialMedia];
  
      if (e.target.checked) {
        selectedCopy.push(value);
      } else {
        selectedCopy.splice(selectedCopy.indexOf(value), 1);
      }
  
      setFormData({
        ...formData,
        socialMedia: selectedCopy,
      });
  
      setSelectedSocialMedia(selectedCopy);
    };
  
    const handleSubmit = async () => {
      try {
        const postData = {
          post: document.getElementById('post').value,
          type: isScheduled ? 'SCHEDULED' : 'INSTANT',
          social_media_ids: formData.socialMedia,
          schedule_post_id: isScheduled ? selectedSchedule : null,
        };
  
        const response = await tokenRequestComponent.post('/posts', postData);
        console.log('Post created successfully:', response.data);
  
        // Reset the form and set success message
        setFormData({
          post: '',
          type: 'INSTANT',
          socialMedia: [],
          scheduleId: null,
        });
  
        setSuccessMessage('Post created!');
  
        // Optionally, reset the selectedSchedule state if needed
        setSelectedSchedule(null);
        window.location.href = '/PublishPosts';
      } catch (error) {
        console.error('Error creating post:', error);
      }
    };

    return (
        <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/4">
                <Sidebar />
            </div>
            <div className="w-full md:w-3/4">
                <h1 className="text-lg font-bold text-gray-900 sm:text-x2 md:text-3xl dark:text-gray-900">Publish your posts</h1>
                <h2 className="block mt-3 mb-2 font-bold text-gray-900 dark:text-gray-900">First log in with your account to publish a post</h2>
                <div className="flex justify-center">
                    <div className="inline-block mr-5 text-center">
                        <ButtonLinkedin />
                        { linkedinName && <p>{linkedinName} is logged</p> }
                    </div>
                    <div className="inline-block mr-8 text-center">
                        <ButtonReddit />
                        { redditName && <p>{redditName} is logged</p> }
                    </div>
                    <div className="inline-block text-center">
                        <ButtonTwitter />
                        { twitterName && <p>{twitterName} is logged</p> }
                    </div>
                </div>
                <br>
                </br>
                <label className="block mt-3 mb-2 text-sm font-medium text-gray-900 dark:text-gray-900">Post</label>
                <textarea id="post" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Leave your Post"></textarea>
                <label className="block mt-3 mb-2 text-sm font-medium text-gray-900">Choose social media:</label>
                <div className="flex justify-center">
                  <br></br>
                    <div className="inline-flex justify-center mr-3">
                        <div className="flex items-center mb-4">
                            <input type="checkbox" value="LINKEDIN" onChange={handleChange} />
                            <label className="ms-2">LinkedIn</label>
                        </div>
                    </div>
                    <div className="inline-flex justify-center mr-3">
                        <div className="flex items-center mb-4">
                            <input type="checkbox" value="REDDIT" onChange={handleChange} />
                            <label className="ms-2">Reddit</label>
                        </div>
                    </div>
                    <div className="inline-flex justify-center mr-3">
                        <div className="flex items-center mb-4">
                            <input type="checkbox" value="TWITTER" onChange={handleChange} />
                            <label className="ms-2">Twitter</label>
                        </div>
                    </div>
                  </div>
                  <br></br>
                  <div className="flex justify-center">
                  <div className="flex flex-col mt-5 md:flex-row">
                    <div className="inline-flex justify-center mr-3">
                      <div className="flex items-center mb-4">
                        <span style={{ marginRight: '10px' }} className="text-sm font-medium text-gray-900 ms-3 dark:text-black">
                          Instant Post
                        </span>
                        <label className="relative inline-flex items-center mr-4 cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={formData.type === 'SCHEDULED'} onChange={handleSchedule} />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[0.2rem] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          <span style={{ marginLeft: '10px' }} className="text-sm font-medium text-gray-900 ms-3 dark:text-black">
                            Scheduled Post
                          </span>
                        </label>
                      </div>
                      <br></br>
                      {isScheduled && (
                        <div className="flex items-center mb-4 ml-5">
                          <select value={selectedSchedule} onChange={handleScheduleChange} className="form-control">
                            <option value="na">Select Schedule</option>
                            {schedulePosts.map((schedule, index) => (
                              <option key={schedule.id} value={`${schedule.id}`}>
                                {`${schedule.day} - ${schedule.hour}`}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                  </div>
                  <div className="flex justify-center">
                  <div className="inline-flex justify-center mr-3">
                      <div className="flex items-center mb-4">
                        <button type="submit" onClick={handleSubmit} className="px-3 py-3 my-1 mr-5 text-center text-white bg-black rounded hover:bg-green-dark focus:outline-none w-fit">
                            Create Post
                        </button>
                      </div>
                  </div>
                </div>
                {successMessage && <p className="text-green-500">{successMessage}</p>}
            </div>
        </div>
    );
};

export default publishPosts;