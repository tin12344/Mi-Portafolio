const PromptsEdit = require("../model/promptsEditModel");

const promptEditPost = async (req, res) => {
  try {
    // Create a new instance of the PromptsCompletion model with data from the request body
    const prompt = new PromptsEdit(req.body);
    // Save the new prompt to the database
    const savedPrompt = await prompt.save();

    // Successful request
    res.status(201).json(savedPrompt);
  } catch (error) {
    res.status(500).json({ error: 'Error to save the prompt' });
  }
};

const promptEditGet = async (req, res) => {
  try {
    // Get the user ID from the route parameters
    const userId = req.query.user_id; 
    // Find all prompts associated with the specified user ID in the database
    const prompts = await PromptsEdit.find({ user_id: userId });
    res.status(200).json(prompts);
  } catch (error) {
    res.status(500).json({ error: 'Error to obtain the prompts' });
  }
};


const promptEditDelete = async (req, res) => {
  try {
    // Get the prompt ID to delete from the route parameters
    const promptId = req.query.id;  
    // Check if the prompt exists in the database
    const prompt = await PromptsEdit.findById(promptId);

    if (!prompt) {
      return res.status(404).json({ error: 'Prompr does not exist' });
    }
    // Delete the prompt from the database
    await prompt.deleteOne(); // Elimina el prompt de la base de datos

    // Respond with a success message as JSON
    res.status(200).json({ message: 'Prompt deleted succesfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error to delete prompt' });
  }
};

const promptEditUpdate = async (req, res) => {
  try {
    // Get the prompt ID to update from the route parameters
    const promptId = req.query.id; 
    // Check if the prompt exists in the database
    const prompt = await PromptsEdit.findById(promptId);
    if (!prompt) {
      return res.status(404).json({ error: 'Prompt does not exist' });
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
    res.status(500).json({ error: 'Error to update the prompt' });
  }
};

module.exports = {
  promptEditPost,
  promptEditGet,
  promptEditDelete,
  promptEditUpdate
};
