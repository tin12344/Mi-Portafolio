import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import UserNavigationBar from '../Components/UserNavigationBar.js';
import "./UserPromptsStyles.css";

// Definition of the UserMaintencePrompts component, which receives a prop setIsLogged
const UserMaintencePrompts = ({ setIsLogged }) => {
    const userId = sessionStorage.getItem("userId");
    // State variables to manage the form data and loading state
    const [prompts, setPrompts] = useState([]);
    const [selectedPrompt, setSelectedPrompt] = useState('');
    const [tags, setTags] = useState([]);
    const inputRef = useRef(null);
    const [editData, setEditData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [promptData, setPromptData] = useState({
        prompt_name: '',
        model: '',
        input: '',
        instruction: '',
        response: '',
        temperature: 0,
        tag: '',
    });

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


    // Function to fetch edit prompts from the server
    const fetchEditPrompts = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_PROMPT_EDIT}?user_id=${userId}`,{
                headers: {
                  'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                }
              });
            if (response.status === 200) {
                const promptsData = response.data;
                setPrompts(promptsData);
            }
        } catch (error) {
            console.error('Error to obtain the prompts:', error);
        }
    };

    useEffect(() => {
        fetchEditPrompts();
    }, []);

    // Function to handle changing the selected prompt
    const handlePromptChange = (e) => {
        const selectedPromptId = e.target.value;
        setSelectedPrompt(selectedPromptId);

        const selectedPromptData = prompts.find(prompt => prompt._id === selectedPromptId);
        if (selectedPromptData) {
            setPromptData(selectedPromptData);
            setTags(selectedPromptData.tag);
        }
    };

     // Function to handle running the edit model
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
                setPromptData({ ...promptData, response: editData });
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
            console.error('Error to generate the completion:', error);
            setIsLoading(false);
        }
    };


    // Function to handle input changes in the form
    const handleInputChange = (e) => {
        setPromptData({ ...promptData, [e.target.id]: e.target.value });
    };

    // Function to handle form submission (editing a prompt)
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

            // Send a PATCH request to edit the selected prompt
            const response = await axios.patch(`${process.env.REACT_APP_PROMPT_EDIT}?id=${selectedPrompt}`, updatedPrompt,{
                headers: {
                  'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                }
              });
            if (response.status === 200) {
                console.log('Prompt edited successfully');
                fetchEditPrompts();
                clearForm();
                setTags([]);
            }

        } catch (error) {
            console.error('Error to edit the prompt:', error);
        }
    };

    // Function to handle deleting a prompt
    const handleDelete = async () => {
        if (selectedPrompt === '') {
            return;
        }

        try {
            // Send a DELETE request to delete the selected prompt
            const response = await axios.delete(`${process.env.REACT_APP_PROMPT_EDIT}?id=${selectedPrompt}`,{
                headers: {
                  'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                }
              });
            if (response.status === 200) {
                console.log('Prompt deleted successfully');
                fetchEditPrompts();
                clearForm();
            }
        } catch (error) {
            console.error('Error to delete the prompt:', error);
        }
    };

    // Function to clear the form fields
    const clearForm = () => {
        setSelectedPrompt("");
        setEditData("");
        setPromptData({
            prompt_name: '',
            model: '',
            input: '',
            instruction: '',
            response: '',
            temperature: '',
            tag: '',
        });
    };

    return (
        <div className="user-prompts-container">
            <div className="user-prompts-wrapper">
                {/* Display the UserNavigationBar component to show the user side navigation bar */}
                <UserNavigationBar setIsLogged={setIsLogged} />
                <h1 className="user-prompts-title">Edit Prompt</h1>
                <div className="user-prompts-form">
                    <form onSubmit={handleSubmit}>
                        {/* Dropdown to select a prompt */}
                        <div className="user-prompts-form-group">
                            <label htmlFor="prompt_name">Prompt Name:</label>
                            <select
                                id="prompt_name" name="prompt_name" className="user-prompts-select" value={selectedPrompt} onChange={handlePromptChange}>
                                <option value="">Prompt Name</option>
                                {prompts.map(prompt => (
                                    <option key={prompt._id} value={prompt._id}>{prompt.prompt_name}</option>
                                ))}
                            </select>
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
                            <input id="instruction" type="text" className="user-prompts-input" value={promptData.instruction} onChange={handleInputChange} />
                        </div>
                        {/* Input field for the temperature */}
                        <div className="user-prompts-form-group">
                            <label htmlFor="temperature">Temperature:</label>
                            <input type="number" id="temperature" className="user-prompts-input" value={promptData.temperature} min={0} max={2} onChange={handleInputChange} />
                        </div>
                        {/* Tags input */}
                        <div className="user-prompts-form-group">
                            <label htmlFor="tag">Tags:</label>
                            <div className="tag-container">
                                <div>
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
                        <div className="user-prompts-form-group">
                            <label htmlFor="response">Response:</label>
                            {isLoading ? (
                                <p>Genereting Edit...</p>
                            ) : (
                                <textarea id="response" value={promptData.response} className="user-prompts-textarea" readOnly onChange={handleInputChange} />
                            )}
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

export default UserMaintencePrompts;