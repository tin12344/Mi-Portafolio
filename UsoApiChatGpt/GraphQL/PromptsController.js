const PromptsEdit = require('./models/promptsEditModel');
const PromptsCompletion = require('./models/promptCompletionModel');
const PromptsImage = require('./models/promptsImageModel');

const getUserWithPrompts = async ({ user_id }) => {

  // Obtain all prompts from the user
  const promptsEdit = await PromptsEdit.find({ user_id });
  const promptsCompletion = await PromptsCompletion.find({ user_id });
  const promptsImage = await PromptsImage.find({ user_id });
  
  // Combine all prompts in one array
  const userWithPrompts = [
    ...promptsImage,
    ...promptsEdit,
    ...promptsCompletion,
  ];

  return userWithPrompts;

};


const searchPromptName = async ({user_id, prompt_name }) => {

  // Obtain all prompts from the user and by the prompt_name
  const promptsEdit = await PromptsEdit.find({ user_id ,"prompt_name": { $regex: `${prompt_name}`, $options: 'i' }});
  const promptsCompletion = await PromptsCompletion.find({user_id , "prompt_name": { $regex: `${prompt_name}`, $options: 'i' }});
  const promptsImage = await PromptsImage.find({ user_id ,"prompt_name": { $regex: `${prompt_name}`, $options: 'i' }});
  
  // Combine all prompts in one array
  const userWithPrompts = [
    ...promptsImage,
    ...promptsEdit,
    ...promptsCompletion,
  ];

  return userWithPrompts;

};

const searchPromptTag = async ({user_id, tag }) => {

  // Obtain all prompts from the user and by the tag
  const promptsEdit = await PromptsEdit.find({ user_id ,"tag": { $in: [tag] }});
  const promptsCompletion = await PromptsCompletion.find({user_id , "tag": { $in: [tag] }});
  const promptsImage = await PromptsImage.find({ user_id ,"tag": { $in: [tag] }});
  
  // Combine all prompts in one array
  const userWithPrompts = [
    ...promptsImage,
    ...promptsEdit,
    ...promptsCompletion,
  ];

  return userWithPrompts;

};

module.exports = {getUserWithPrompts, searchPromptName, searchPromptTag};
