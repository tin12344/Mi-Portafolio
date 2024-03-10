const PromptsImage = require("../model/promptsImageModel");

const promptImagePost = async (req, res) => {
  try {
    // Create a new instance of the PromptsImage model with data from the request body
    const prompt = new PromptsImage(req.body);
    // Save the new prompt to the database
    const savedPrompt = await prompt.save();
    // Respond with the saved prompt as JSON
    res.status(201).json(savedPrompt);
  } catch (error) {
    res.status(500).json({ error: 'Error to save prompt' });
  }
};

const promptImageGet = async (req, res) => {
  try {
    // Get the user ID from the route parameters
    const userId = req.query.user_id;  
    // Find all prompts associated with the specified user ID in the database
    const prompts = await PromptsImage.find({ user_id: userId });
    // Respond with the prompts obtained as JSON
    res.status(200).json(prompts);
  } catch (error) {
    res.status(500).json({ error: 'Error to obtain prompts' });
  }
};


const promptImageDelete = async (req, res) => {
  try {
    // Get the prompt ID to delete from the route parameters
    const promptId = req.query.id; 
    // Check if the prompt exists in the database
    const prompt = await PromptsImage.findById(promptId);

    if (!prompt) {
      return res.status(404).json({ error: 'Prompt does not exist' });
    }

    // Delete the prompt from the database
    await prompt.deleteOne(); 
    // Respond with a success message as JSON
    res.status(200).json({ message: 'Prompt delete succesfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error to delete prompt' });
  }
};

const promptImageUpdate = async (req, res) => {
  try {
    // Get the prompt ID to update from the route parameters
    const promptId = req.query.id; 
    // Check if the prompt exists in the database
    const prompt = await PromptsImage.findById(promptId);
    if (!prompt) {
      return res.status(404).json({ error: 'Prompr does not exist' });
    }

     // Get the updated fields from the request body
    const updatedFields = req.body;
    // Update the fields of the prompt with the provided values
    Object.assign(prompt, updatedFields);

    // Save the changes to the prompt in the database
    const savedPrompt = await prompt.save();
    // Respond with the saved prompt as JSON
    res.status(200).json(savedPrompt);
  } catch (error) {
    res.status(500).json({ error: 'Error to delete prompt' });
  }
};

module.exports = {
  promptImagePost,
  promptImageGet,
  promptImageDelete,
  promptImageUpdate
};
