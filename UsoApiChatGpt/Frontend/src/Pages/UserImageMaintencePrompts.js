import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import UserNavigationBar from '../Components/UserNavigationBar.js';
import "./UserPromptsStyles.css";

// Definition of the UserImageMaintencePrompts component, which receives a prop setIsLogged
const UserImageMaintencePrompts = ({ setIsLogged }) => {
    // Get the user ID from sessionStorage
    const userId = sessionStorage.getItem("userId");
    // State variables to manage the prompts, selected prompt, loading state, image data, and prompt data
    const [prompts, setPrompts] = useState([]);
    const [selectedPrompt, setSelectedPrompt] = useState('');
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

    // Function to fetch image prompts from the server
    const fetchImagePrompts = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_PROMPT_IMAGE}?user_id=${userId}`,{
                headers: {
                  'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                }
              });
            if (response.status === 200) {
                // Modify the response data to include image URLs for each response item
                const promptsDataWithResponse = response.data.map(prompt => ({
                    ...prompt,
                    response: prompt.response.map(item => ({ url: item.url }))
                }));
                setPrompts(promptsDataWithResponse);
            }
        } catch (error) {
            console.error('Error to obtain the prompt:', error);
            console.log(error);
        }
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

    // Fetch image prompts on component mount
    useEffect(() => {
        fetchImagePrompts();
    }, []);

    // Log promptData changes whenever promptData changes
    useEffect(() => {
        console.log('promptData has changed:', promptData);
    }, [promptData]);

    // Function to handle changes in the selected prompt
    const handlePromptChange = (e) => {
        const selectedPromptId = e.target.value;
        setSelectedPrompt(selectedPromptId);
        const selectedPromptData = prompts.find(prompt => prompt._id === selectedPromptId);
        if (selectedPromptData) {
            setPromptData(selectedPromptData);
            setTags(selectedPromptData.tag);
        }
    };


    // Function to handle input changes in the form
    const handleInputChange = (e) => {
        setPromptData({ ...promptData, [e.target.id]: e.target.value });
    };

    // Function to handle form submission (editing an existing prompt)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedPrompt === '') {
            return;
        }

        try {
            const updatedPrompt = {
                ...promptData,
                user_id: userId,
                tag: tags,
            };

            // Send a PATCH request to update the selected prompt
            const response = await axios.patch(`${process.env.REACT_APP_PROMPT_IMAGE}?id=${selectedPrompt}`, updatedPrompt,{
                headers: {
                  'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                }
              });
            if (response.status === 200) {
                console.log('Prompt edited successfully');
                fetchImagePrompts();
                setImageData([]);
                clearForm();
                setTags([]);
            }

        } catch (error) {
            console.error('Error to edit the prompt:', error);
        }
    };

    // Function to handle deleting the selected prompt
    const handleDelete = async () => {
        if (selectedPrompt === '') {
            return;
        }

        try {
            // Send a DELETE request to delete the selected prompt
            const response = await axios.delete(`${process.env.REACT_APP_PROMPT_IMAGE}?id=${selectedPrompt}`,{
                headers: {
                  'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                }
              });
            if (response.status === 200) {
                console.log('Prompt deleted successfully');
                fetchImagePrompts();
                setImageData([]);
                clearForm();
                setTags([]);
            }
        } catch (error) {
            console.error('Error to delete the prompt:', error);
        }
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
                const newPromptData = { ...promptData, response: imagesData };
                setPromptData(newPromptData);
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
            console.error('Error to generate the Image:', error);
            setIsLoading(false);
        }
    };

    // Function to clear the form fields and selected prompt
    const clearForm = () => {
        setSelectedPrompt('');
        setPromptData({
            prompt: '',
            prompt_name: '',
            n: '',
            size: '',
            tag: '',
            response: [],
        });
    };

    return (
        <div className="user-prompts-container">
            <div className="user-prompts-wrapper">
                {/* Display the UserNavigationBar component to show the user side navigation bar */}
                <UserNavigationBar setIsLogged={setIsLogged} />
                <h1 className="user-prompts-title">Edit Image Prompt</h1>
                <div className="user-prompts-form">
                    <form onSubmit={handleSubmit}>
                        {/* Dropdown to select the prompt */}
                        <div className="user-prompts-form-group">
                            <label htmlFor="prompt">Prompt:</label>
                            <select
                                id="prompt" name="prompt" className="user-prompts-select" value={selectedPrompt} onChange={handlePromptChange}>
                                <option value="">Prompt name</option>
                                {prompts.map(prompt => (
                                    <option key={prompt._id} value={prompt._id}>{prompt.prompt_name}</option>
                                ))}
                            </select>
                        </div>
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
                            <input type="number" value={promptData.n} name="n" id="n" className="user-prompts-input" min={1} max={2} onChange={handleInputChange} />
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
                                    <p>Generating image...</p>
                                ) : (
                                    promptData.response.map((image, index) => (
                                        <img key={index} src={image.url} alt={`Generated Image ${index + 1}`} />
                                    ))
                                )}
                            </div>
                        </div>
                        {/* Button to submit the form and edit the prompt */}
                        <button type="submit" className="user-prompts-button">Edit Prompt</button>
                        {/* Button to delete the prompt */}
                        <button type="button" className="user-prompts-button" onClick={handleDelete}>Delete Prompt</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserImageMaintencePrompts;
