const  {getUserWithPrompts, searchPromptName, searchPromptTag} = require('./PromptsController');

const resolvers = {
    getUserWithPrompts: getUserWithPrompts,
    searchPromptName: searchPromptName,
    searchPromptTag: searchPromptTag
};

module.exports = resolvers;
