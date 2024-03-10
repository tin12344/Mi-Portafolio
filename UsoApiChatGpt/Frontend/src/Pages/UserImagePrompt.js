import React, { useState, useRef } from 'react';
import axios from 'axios';
import UserNavigationBar from '../Components/UserNavigationBar.js';
import ModalCompleteData from '../Components/ModalCompleteData.js';
import "./UserPromptsStyles.css"

// Definition of the UserImagePrompt component, which receives a prop setIsLogged
const UserImagePrompt = ({ setIsLogged }) => {
  // Get the user name and ID from sessionStorage
  const userName = sessionStorage.getItem("user");
  const userId = sessionStorage.getItem("userId");
  // State variables to manage the modal visibility, loading state, image data, and prompt data
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageData, setImageData] = useState([]);
  const [tags, setTags] = useState([]);
  const inputRef = useRef(null);
  const [promptData, setPromptData] = useState({
    prompt: '',
    prompt_name: '',
    n: '',
    size: '',
    tag: '',
    response: [],
  });

  // Function to handle changes in the input fields of the form
  const handleInputChange = (e) => {
    setPromptData({ ...promptData, [e.target.id]: e.target.value });
  };

  // Function to handle Enter key press in the tag input field
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (newTag !== "") {
        setTags([...tags, newTag]);
        e.target.value = "";
      }
    }
  };

  // Function to handle removing a tag from the list
  const handleRemoveTag = (removedTag) => {
    const updatedTags = tags.filter((tag) => tag !== removedTag);
    setTags(updatedTags);
  };

  // Function to clear the form fields and image data
  const clearSpaces = () => {
    setImageData([]);
    setPromptData({
      prompt: '',
      prompt_name: '',
      n: 0,
      size: '',
      tag: '',
      response: [],
    });
  };

  // Function to run the image model
  const handleRun = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(process.env.REACT_APP_RUN_IMAGE, {
        prompt: promptData.prompt,
        n: promptData.n,
        size: promptData.size
      },{
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        }
      });
      if (response.status === 201) {
        const imagesData = response.data.data;
        setImageData(imagesData);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      console.error('Error to generate the images:', error);
      setIsLoading(false);
    }
  };

  // Function to handle form submission (adding a new image prompt)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      promptData.prompt === '' ||
      promptData.n === '' ||
      promptData.size === ''
    ) {
      setShowModal(true);
      return;
    }

    try {
      const newPrompt = {
        ...promptData,
        user_id: userId,
        user_name: userName,
        tag: tags,
        response: imageData,
      };

      // Send a POST request to add the new image prompt
      await axios.post(process.env.REACT_APP_PROMPT_IMAGE, newPrompt,{
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        }
      });
      console.log('Prompt saved successfully');
      clearSpaces();
      setTags([]);

    } catch (error) {
      console.error('Error to save the prompt:', error);
    }
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="user-prompts-container">
      <div className="user-prompts-wrapper">
        {/* Display the UserNavigationBar component to show the user side navigation bar */}
        <UserNavigationBar setIsLogged={setIsLogged} />
        <h1 className="user-prompts-title">Add new Image Prompt</h1>
        <div className="user-prompts-form">
          <form onSubmit={handleSubmit}>
            {/* Input field for the prompt name */}
            <div className="user-prompts-form-group">
              <label htmlFor="prompt_name">Prompt name:</label>
              <input id="prompt_name" type="text" className="user-prompts-input" value={promptData.prompt_name} onChange={handleInputChange} />
            </div>
            {/* Input field for the prompt */}
            <div className="user-prompts-form-group">
              <label htmlFor="prompt">Prompt:</label>
              <input id="prompt" type="text" className="user-prompts-input" value={promptData.prompt} onChange={handleInputChange} />
            </div>
            {/* Input field for the number of images */}
            <div className="user-prompts-form-group">
              <label htmlFor="n">Number of images:</label>
              <input type="number" value={promptData.n} name='n' id="n" className="user-prompts-input" min={1} max={2} onChange={handleInputChange} />
            </div>
            <label htmlFor="tag">Tags:</label>
            <div className="tag-container">
              <div>
                {/* Display existing tags */}
                {tags.map((tag, index) => (
                  <div key={index} className="tag">
                    {tag}
                    <span className="tag-remove" onClick={() => handleRemoveTag(tag)}>
                      x
                    </span>
                  </div>
                ))}
              </div>
              {/* Input field to add new tags */}
              <div className="input-container">
                <input type="text" ref={inputRef} onKeyDown={handleKeyDown} placeholder="Type ypur tag" />
              </div>
            </div>
            {/* Dropdown to select the size */}
            <div className="user-prompts-form-group">
              <label htmlFor="size">Size:</label>
              <select
                id="size" name="size" className="user-prompts-select" value={promptData.size} onChange={handleInputChange}>
                <option value="">Select Size</option>
                <option value="256x256">256x256</option>
                <option value="512x512">512x512</option>
                <option value="1024x1024">1024x1024</option>
              </select>
              {/* Button to run the image model */}
              <button type="button" className="user-prompts-button-Send" onClick={handleRun}>Run</button>
            </div>
            {/* Display the generated images */}
            <div className="user-prompts-form-group">
              <label htmlFor="response">Response:</label>
              <div className="gallery">
                {isLoading ? (
                  <p>Genereting image...</p>
                ) : (
                  imageData.map((image, index) => (
                    <img key={index} src={image.url} alt={`Generated Image ${index + 1}`} />
                  ))
                )}
              </div>
            </div>
            {/* Button to submit the form and add the new prompt */}
            <button type="submit" className="user-prompts-button">Add Prompt</button>
          </form>
        </div>
        {/* Display the modal when needed */}
        {showModal && <ModalCompleteData closeModal={closeModal} />}
      </div>
    </div>
  );
};

export default UserImagePrompt;
