require('dotenv').config();
const { graphqlHTTP } = require('express-graphql');
const { graphQLschema } = require('./graphql-schema.js');
const resolvers = require('./Resolvers.js');
const jwt = require('jsonwebtoken');

const express = require('express');
const app = express();
// database connection
const mongoose = require("mongoose");
const db = mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


// parser for the request body (required for the POST and PUT methods)
const bodyParser = require("body-parser");
const cors = require("cors");


// Middlewares
app.use(bodyParser.json());
// check for cors
app.use(cors({
  domains: '*',
  methods: "*"
}));

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'].split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decoded.id){
      next();
    }
  } catch (error) {
    return res.status(401).json({ message: 'Token JWT invalid' });
  }
};

app.use('/graphql',verifyToken, graphqlHTTP({
  schema: graphQLschema,
  rootValue: resolvers,
  graphiql: true,
}));

app.listen(3003, () => console.log(`Example app listening on port 3003!`))