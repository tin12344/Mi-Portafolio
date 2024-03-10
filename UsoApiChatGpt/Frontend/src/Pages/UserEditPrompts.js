import React, { useState, useRef } from "react";
import axios from 'axios';
import UserNavigationBar from '../Components/UserNavigationBar.js';
import ModalCompleteData from '../Components/ModalCompleteData.js';
import "./UserPromptsStyles.css"


// Definition of the UserPrompts component, which receives a prop setIsLogged
const UserPrompts = ({ setIsLogged }) => {
    // Get the user name and user ID from sessionStorage
    const userName = sessionStorage.getItem("user")
    const userId = sessionStorage.getItem("userId")
    // State variables to manage the modal, tags, edit data, and loading state
    const [showModal, setShowModal] = useState(false);
    const [tags, setTags] = useState([]);
    const [editData, setEditData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef(null);

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


    // State variable to manage the prompt data
    const [promptData, setPromptData] = useState({
        prompt_name: '',
        input: '',
        instruction: '',
        temperature: '',
        tag: '',
    });

    // Function to handle input changes in the form
    const handleInputChange = (e) => {
        setPromptData({ ...promptData, [e.target.id]: e.target.value });
    };

    // Function to clear the form fields and edit data
    const clearSpaces = () => {
        setEditData("");
        setPromptData({
            prompt_name: '',
            model: '',
            input: '',
            instruction: '',
            response: editData,
            temperature: '',
            tag: '',
        });
    };

    // Function to run the edit model
    const handleRun = async () => {
        setIsLoading(true);
        try {
            // Send a POST request to the edit model API
            const response = await axios.post(process.env.REACT_APP_RUN_EDIT, {
                model: promptData.model,
                input: promptData.input,
                instruction: promptData.instruction
            },{
                headers: {
                  'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                }
              });
            if (response.status === 201) {
                const editData = response.data.choices[0].text;
                setEditData(editData);
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
            console.error('Error to generate the prompt:', error);
            setIsLoading(false);
        }
    };

    // Function to handle form submission (adding a new prompt)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            promptData.prompt_name === '' ||
            promptData.model === '' ||
            promptData.instruction === '' ||
            promptData.temperature === ''
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
                response: "",
            };

            // Send a POST request to add the new prompt
            const response = await axios.post(process.env.REACT_APP_PROMPT_EDIT, newPrompt,{
                headers: {
                  'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                }
              });
            if (response.status === 201) {
                console.log('Prompt saved successfully');
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
                <h1 className="user-prompts-title">Add new Edit Prompt</h1>
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
                                <option value="text-davinci-edit-001">text-davinci-edit-001</option>
                                <option value="code-davinci-edit-001">code-davinci-edit-001</option>
                            </select>
                        </div>
                         {/* Input field for the prompt input */}
                         <div className="user-prompts-form-group">
                            <label htmlFor="input">Input:</label>
                            <input id="input" type="text" className="user-prompts-input" value={promptData.input} onChange={handleInputChange} />
                        </div>
                        {/* Input field for the prompt instruction */}
                        <div className="user-prompts-form-group">
                            <label htmlFor="instruction">Instructions:</label>
                            <input id="instruction" value={promptData.instruction} type="text" className="user-prompts-input" onChange={handleInputChange} />
                        </div>
                        {/* Input field for the temperature */}
                        <div className="user-prompts-form-group">
                            <label htmlFor="temperature">Temperature:</label>
                            <input type="number" value={promptData.temperature} name='temperature' id="temperature" className="user-prompts-input" min={0} max={2} onChange={handleInputChange} />
                        </div>
                        {/* Tags input */}
                        <div className="user-prompts-form-group">
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
                            {/* Button to run the edit model */}
                            <button type="button" className="user-prompts-button-Send" onClick={handleRun}>Run</button>
                        </div>
                        {/* Display the response generated by the edit model */}
                        <div className="user-prompts-form-group">
                            <label htmlFor="response">Response:</label>
                            {isLoading ? (
                                <p>Genereting Edit...</p>
                            ) : (
                                <textarea id="response" value={editData} className="user-prompts-textarea" readOnly onChange={handleInputChange} />
                            )}
                        </div>
                        {/* Button to submit the form and add the new prompt */}
                        <button type="submit" className="user-prompts-button">Add Prompt</button>
                    </form>
                </div>
                {/* Display the ModalCompleteData component when showModal state is true */}
                {showModal && <ModalCompleteData closeModal={closeModal} />}
            </div>
        </div>
    );
};

export default UserPrompts;
