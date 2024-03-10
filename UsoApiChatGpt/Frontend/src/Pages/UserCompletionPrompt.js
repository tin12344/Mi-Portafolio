import React, { useState, useRef } from 'react';
import axios from 'axios';
import UserNavigationBar from '../Components/UserNavigationBar.js';
import ModalCompleteData from '../Components/ModalCompleteData.js';
import "./UserPromptsStyles.css"

// Definition of the UserCompletionPrompt component, which receives a prop setIsLogged
const UserCompletionPrompt = ({ setIsLogged }) => {
    const userId = sessionStorage.getItem("userId")
    // State variables to manage the form data and loading state
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [tags, setTags] = useState([]);
    const inputRef = useRef(null);
    const [promptData, setPromptData] = useState({
        model: '',
        prompt_name: '',
        prompt: '',
        max_tokens: '',
        temperature: '',
        tags: '',
        response: '',
    });

    // Function to handle input changes in the form
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


    // Function to clear the form fields
    const clearSpaces = () => {
        setPromptData({
            model: '',
            prompt_name: '',
            prompt: '',
            max_tokens: '',
            temperature: '',
            tag: '',
            response: '',
        });
    };

    // Function to handle running the completion model
    const handleRun = async () => {
        setIsLoading(true);
        try {
            // Send a POST request to the completion model API
            const response = await axios.post(process.env.REACT_APP_RUN_COMPLETION, {
                model: promptData.model,
                prompt: promptData.prompt,
                max_tokens: promptData.max_tokens,
                temperature: promptData.temperature
            },{
                headers: {
                  'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                }
              });
            console.log(response);
            if (response.status === 201) {
                const completionData = response.data.choices[0].text;
                setPromptData({ ...promptData, response: completionData });
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
            console.error('Error to generete the completion:', error);
            setIsLoading(false);
        }
    };

    // Function to handle form submission (adding a new prompt)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            promptData.model === '' ||
            promptData.prompt === '' ||
            promptData.max_tokens === '' ||
            promptData.temperature === ''
        ) {
            setShowModal(true);
            return;
        }

        try {
            const newPrompt = {
                ...promptData,
                user_id: userId,
                tag: tags,
            };

            // Send a POST request to add the new prompt
            const response = await axios.post(process.env.REACT_APP_PROMPT_COMPLETION, newPrompt,{
                headers: {
                  'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                }
              });
            if (response.status === 201) {
                console.log('Prompt save correctly');
                clearSpaces();
                setTags([]);
            }

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
                <h1 className="user-prompts-title">Add new Completion Prompt</h1>
                <div className="user-prompts-form">
                    <form onSubmit={handleSubmit}>
                        {/* Input field for the prompt name */}
                        <div className="user-prompts-form-group">
                            <label htmlFor="prompt_name">Prompt name:</label>
                            <input id="prompt_name" type="text" className="user-prompts-input" value={promptData.prompt_name} onChange={handleInputChange} />
                        </div>
                        {/* Dropdown to select a model */}
                        <div className="user-prompts-form-group">
                            <label htmlFor="model">Model:</label>
                            <select
                                id="model" name="model" className="user-prompts-select" value={promptData.model} onChange={handleInputChange}>
                                <option value="">Select a model</option>
                                <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                                <option value="gpt-3.5-turbo-16k">gpt-3.5-turbo-16k</option>
                                <option value="gpt-3.5-turbo-0613">gpt-3.5-turbo-0613</option>
                                <option value="gpt-3.5-turbo-16k-0613">gpt-3.5-turbo-16k-0613</option>
                                <option value="text-davinci-003">text-davinci-003</option>
                                <option value="text-davinci-002">text-davinci-002</option>
                                <option value="code-davinci-002">code-davinci-002</option>
                            </select>
                        </div>
                        {/* Input field for the prompt */}
                        <div className="user-prompts-form-group">
                            <label htmlFor="prompt">Prompt:</label>
                            <input type="text" value={promptData.prompt} name='prompt' id="prompt" className="user-prompts-input" onChange={handleInputChange} />
                        </div>
                        {/* Input field for the prompt */}
                        <div className="user-prompts-form-group">
                            <label htmlFor="max_tokens"> Max tokens:</label>
                            <input type="number" value={promptData.max_tokens} name='max_tokens' id="max_tokens" min={0} max={7} className="user-prompts-input" onChange={handleInputChange} />
                        </div>
                        {/* Input field for the temperature and a button to run the model */}
                        <div className="user-prompts-form-group">
                            <label htmlFor="temperature">Temperature:</label>
                            <input type="number" value={promptData.temperature} name='temperature' id="temperature" className="user-prompts-input" min={0} max={2} onChange={handleInputChange} />
                            <button type="button" className="user-prompts-button-Send" onClick={handleRun}>Run</button>
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
                        {/* Display the response generated by the model */}
                        <div className="user-prompts-form-group">
                            <label htmlFor="response">Response:</label>
                            {isLoading ? (
                                <p>Generating Edit...</p>
                            ) : (
                                <textarea id="response" value={promptData.response} className="user-prompts-textarea" readOnly />
                            )}
                        </div>
                        {/* Button to submit the form and add the prompt */}
                        <button type="submit" className="user-prompts-button">Add Prompt</button>
                    </form>
                </div>
                {/* Display the ModalCompleteData component */}
                {showModal && <ModalCompleteData closeModal={closeModal} />}
            </div>
        </div>
    );
};

export default UserCompletionPrompt;
