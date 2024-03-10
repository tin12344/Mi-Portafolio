import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import UserNavigationBar from '../Components/UserNavigationBar.js';
import "./UserPromptsStyles.css";

// Definition of the UserCompletionMaintancePrompt component, which receives a prop setIsLogged
const UserCompletionMaintancePrompt = ({ setIsLogged }) => {
    // Get the user ID from the sessionStorage
    const userId = sessionStorage.getItem("userId");
    // State variables to manage prompts and selected prompt data in the form
    const [prompts, setPrompts] = useState([]);
    const [selectedPrompt, setSelectedPrompt] = useState('');
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

    // Function to fetch completion prompts from the server
    const fetchCompletionPrompts = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_PROMPT_COMPLETION}?user_id=${userId}`,{
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

    // Fetch completion prompts when the component mounts
    useEffect(() => {
        fetchCompletionPrompts();
    }, []);

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

    // Function to handle the selection of a prompt from the dropdown
    const handlePromptChange = (e) => {
        const selectedPromptId = e.target.value;
        setSelectedPrompt(selectedPromptId);

        // Find the selected prompt data from the prompts array
        const selectedPromptData = prompts.find(prompt => prompt._id === selectedPromptId);
        if (selectedPromptData) {
            setPromptData(selectedPromptData);
            setTags(selectedPromptData.tag);
        }
    };

    // Function to handle form input changes
    const handleInputChange = (e) => {
        setPromptData({ ...promptData, [e.target.id]: e.target.value });
    };

    // Function to handle form submission (prompt editing)
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
            const response = await axios.patch(`${process.env.REACT_APP_PROMPT_COMPLETION}?id=${selectedPrompt}`, updatedPrompt,{
                headers: {
                  'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                }
              });
            if (response.status === 200) {
                console.log('Prompt edited correctly');
                fetchCompletionPrompts();
                clearForm();
                setTags([]);
            }

        } catch (error) {
            console.error('Error to edit the prompt:', error);
        }
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
            console.error('Error al generar las imágenes:', error);
            setIsLoading(false);
        }
    };

    // Function to handle prompt deletion
    const handleDelete = async () => {
        if (selectedPrompt === '') {
            return;
        }

        try {
            // Send a DELETE request to delete the selected prompt
            const response = await axios.delete(`${process.env.REACT_APP_PROMPT_COMPLETION}?id=${selectedPrompt}`,{
                headers: {
                  'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                }
              });
            if (response.status === 200) {
                console.log('Prompt eliminado exitosamente');
                fetchCompletionPrompts();
                clearForm();
                setTags([]);
            }
        } catch (error) {
            console.error('Error al eliminar el prompt:', error);
        }
    };

    // Function to clear the form fields
    const clearForm = () => {
        setSelectedPrompt('');
        setPromptData({
            model: '',
            prompt: '',
            max_tokens: '',
            temperature: '',
            response: '',
            tag: '',
        });
    };

    return (
        <div className="user-prompts-container">
            <div className="user-prompts-wrapper">
                {/* Display the UserNavigationBar component to show the user side navigation bar */}
                <UserNavigationBar setIsLogged={setIsLogged} />
                <h1 className="user-prompts-title">Edit Completion Prompt</h1>
                <div className="user-prompts-form">
                    <form onSubmit={handleSubmit}>
                        {/* Dropdown to select a prompt */}
                        <div className="user-prompts-form-group">
                            <label htmlFor="prompt_name">Prompt Name:</label>
                            <select
                                id="model" name="model" className="user-prompts-select" value={selectedPrompt} onChange={handlePromptChange}>
                                <option value="">Model</option>
                                {prompts.map(prompt => (
                                    <option key={prompt._id} value={prompt._id}>{prompt.prompt_name}</option>
                                ))}
                            </select>
                        </div>
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
                        {/* Input field for the max tokens */}
                        <div className="user-prompts-form-group">
                            <label htmlFor="max_tokens"> Max tokens:</label>
                            <input type="number" value={promptData.max_tokens} name='max_tokens' id="max_tokens" className="user-prompts-input" min={0} max={7} onChange={handleInputChange} />
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
                        {/* Input field for the temperature and a button to run the model */}
                        <div className="user-prompts-form-group">
                            <label htmlFor="temperature">Temperature:</label>
                            <input type="number" value={promptData.temperature} name='temperature' id="temperature" className="user-prompts-input" min={0} max={2} onChange={handleInputChange} />
                            <button type="button" className="user-prompts-button-Send" onClick={handleRun}>Run</button>
                        </div>
                        {/* Textarea to display the response from the completion model */}
                        <div className="user-prompts-form-group">
                            <label htmlFor="response">Response:</label>
                            {isLoading ? (
                                <p>Generating Edit...</p>
                            ) : (
                                <textarea id="response" value={promptData.response} className="user-prompts-textarea" readOnly />
                            )}
                        </div>
                        {/* Buttons to submit the form, delete the prompt, and clear the form */}
                        <button type="submit" className="user-prompts-button">Edit Prompt</button>
                        <button type="button" className="user-prompts-button" onClick={handleDelete}>Delete Prompt</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserCompletionMaintancePrompt;