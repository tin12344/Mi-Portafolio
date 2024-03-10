const { buildSchema } = require('graphql');
exports.graphQLschema = buildSchema(`  
  type Prompt {
    _id: ID!
    prompt_name: String
    tag: [String]
  }
  
  type Query {
    getUserWithPrompts(user_id: ID!): [Prompt]
    searchPromptName(user_id: ID!, prompt_name: String!): [Prompt]
    searchPromptTag(user_id: ID!, tag: String!): [Prompt]
  }`);