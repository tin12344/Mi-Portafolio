const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});

const createImage = async (req, res) => {
  // Create a new instance of OpenAIApi with the provided configuration
  const openai = new OpenAIApi(configuration);
  try {
    // Extract necessary data from the request body
    const prompt = req.body.prompt;
    const n = parseInt(req.body.n);

    // Validate if 'n' is a valid number
    if (isNaN(n)) {
      res.status(422);
      res.json({
        message: "The 'n' value is not a valid number",
      });
      return;
    }

    // Use the OpenAI API to create images based on the prompt and number 'n'
    const response = await openai.createImage({
      prompt: prompt,
      n: n,
      size: req.body.size,
    });

    if (response) {
      // Return the response from the API as JSON
      res.status(201);
      res.json(response.data);
    } else {
      res.status(422);
      res.json({
        message: "There was an error executing the OpenAI method",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};


const createEdit = async (req, res) => {
  const openai = new OpenAIApi(configuration);
  try {
    // Extract necessary data from the request body
    const model = req.body.model;
    // Use the OpenAI API to create an edit based on the provided input and instruction
    const response = await openai.createEdit({
      model: model,
      input: req.body.input,
      instruction: req.body.instruction,
    });

    if (response) {
      // Return the response from the API as JSON
      res.status(201);
      res.json(response.data);
    } else {
      res.status(422);
      res.json({
        message: "There was an error executing the OpenAI method",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};


const createCompletion = async (req, res) => {
  const openai = new OpenAIApi(configuration);
  try {
    // Extract necessary data from the request body
    const model = req.body.model;
    const max_tokens = parseInt(req.body.max_tokens);
    const temperature = parseInt(req.body.temperature);
    // Use the OpenAI API to generate completions based on the provided prompt and options
    const response = await openai.createCompletion({
      model: model,
      prompt: req.body.prompt,
      max_tokens: max_tokens,
      temperature: temperature,
    });

    if (response) {
      // Return the response from the API as JSON
      res.status(201);
      res.json(response.data);
    } else {
      res.status(422);
      res.json({
        message: "There was an error executing the OpenAI method",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  createImage,
  createEdit,
  createCompletion
}