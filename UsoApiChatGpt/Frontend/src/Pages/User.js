import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserNavigationBar from '../Components/UserNavigationBar.js';
import "./UserStyless.css";

const User = ({ setIsLogged }) => {
    const userId = sessionStorage.getItem("userId");
    const [promptsData, setPromptsData] = useState([]);

    const loadPrompts = async () => {
        try {
            // Send a POST request to the GraphQL API
            const response = await axios.post(process.env.REACT_APP_SEARCH_NAME, {
                query: `
                query{
                    getUserWithPrompts(user_id: "${userId}"){
                      _id,
                      tag,
                      prompt_name
                    }
                  }
                `
            },{
                headers: {
                  'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                }
              });
            // Update the state with the data obtained from the GraphQL response
            setPromptsData(response.data.data.getUserWithPrompts);
        } catch (error) {
            console.log(error.message);
            console.error('Error to generate the prompt:', error);
        }
    };

    const searchName = async () => {
        try {
            const promptName = document.getElementById("search-box-name").value;
            // Send a POST request to the GraphQL API
            const response = await axios.post(process.env.REACT_APP_SEARCH_NAME, {
                query: `
                    query{
                        searchPromptName(user_id: "${userId}", prompt_name: "${promptName}") {
                          _id,
                          tag,
                          prompt_name
                        }
                      }
                `
            },{
                headers: {
                  'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                }
              });
            // Update the state with the data obtained from the GraphQL response
            setPromptsData(response.data.data.searchPromptName);
        } catch (error) {
            console.log(error.message);
            console.error('Error to generate the prompt:', error);
        }
    };

    const searchTag = async () => {
        try {
            const promptTag = document.getElementById("search-box-tag").value;
            // Send a POST request to the GraphQL API
            const response = await axios.post(process.env.REACT_APP_SEARCH_NAME, {
                query: `
                    query{
                        searchPromptTag(user_id: "${userId}", tag: "${promptTag}") {
                          _id,
                          tag,
                          prompt_name
                        }
                      }
                `
            },{
                headers: {
                  'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                }
              });
            // Update the state with the data obtained from the GraphQL response
            setPromptsData(response.data.data.searchPromptTag);
        } catch (error) {
            console.log(error.message);
            console.error('Error to generate the prompt:', error);
        }
    };

    useEffect(() => {
        loadPrompts();
    }, []);

    return (
        <div>
            <UserNavigationBar setIsLogged={setIsLogged} />
            <h2>Prompts</h2>
            <div className="search-container">
                <label htmlFor="search-box-name" className="search-tittle">Search by name</label>
                <input id="search-box-name" className="search-box-name" placeholder="Search"></input>
                <button id="search-prompt" className="search-prompt" onClick={searchName}>Search prompt by name</button>
            </div>
            <div className="search-container">
                <label htmlFor="search-box-tag" className="search-tittle">Search by tag</label>
                <input id="search-box-tag" className="search-box-tag" placeholder="Search"></input>
                <button id="search-prompt" className="search-prompt" onClick={searchTag}>Search prompt by tag</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Prompt Name</th>
                        <th>Tag</th>
                    </tr>
                </thead>
                <tbody>
                    {promptsData.map((prompt, index) => (
                        <tr key={index}>
                            <td>{prompt.prompt_name}</td>
                            <td>{prompt.tag}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default User;
