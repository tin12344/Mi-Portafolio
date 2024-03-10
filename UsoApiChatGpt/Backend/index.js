const express = require('express');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const app = express();
// database connection
const mongoose = require("mongoose");
const db = mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors({
  domains: '*',
  methods: "*"
}));


const verifyToken = async(req, res, next) => {
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

//Users
const {
  userPost,
  userGet,
  userDelete,
  updateUser,
  userGetByID,
  userPostSendEmail,
  userResetSendEmail,
  updatePassword
} = require("./controllers/userController.js");

app.get("/api/user", verifyToken, userGet);
app.get("/api/userById",verifyToken, userGetByID);
app.post("/api/user",verifyToken, userPost);
app.post("/api/registerUser", userPostSendEmail);
app.post("/api/resetPassword", userResetSendEmail);
app.delete("/api/user",verifyToken, userDelete);
app.patch("/api/user",verifyToken, updateUser);
app.post("/api/updatePassword", updatePassword);

//Session
const {
  sessionPost,
} = require("./controllers/sessionController.js");

app.post("/api/session", sessionPost);


//Prompts Edit
const {
  promptEditPost,
  promptEditGet,
  promptEditDelete,
  promptEditUpdate,
} = require("./controllers/promptsEditController.js");

app.get("/api/promptEdit",verifyToken, promptEditGet);
app.post("/api/promptEdit",verifyToken, promptEditPost);
app.patch("/api/promptEdit",verifyToken, promptEditUpdate);
app.delete("/api/promptEdit",verifyToken, promptEditDelete);


//Prompts Image
const {
  promptImagePost,
  promptImageGet,
  promptImageDelete,
  promptImageUpdate,
} = require("./controllers/promptsImageController.js");

app.get("/api/promptImage",verifyToken, promptImageGet);
app.post("/api/promptImage",verifyToken, promptImagePost);
app.patch("/api/promptImage",verifyToken, promptImageUpdate);
app.delete("/api/promptImage",verifyToken, promptImageDelete);


//Prompts Completion
const {
  promptCompletionPost,
  promptCompletionGet,
  promptCompletionDelete,
  promptCompletionUpdate,
} = require("./controllers/promptsCompletionController.js");

app.get("/api/promptCompletion",verifyToken, promptCompletionGet);
app.post("/api/promptCompletion",verifyToken, promptCompletionPost);
app.patch("/api/promptCompletion",verifyToken, promptCompletionUpdate);
app.delete("/api/promptCompletion",verifyToken, promptCompletionDelete);

//Prompts
const {
  createImage,
  createEdit,
  createCompletion
} = require("./controllers/openaAiResponseController.js");

app.post("/api/openAiCreateImage",verifyToken, createImage);
app.post("/api/openAiCreateEdit",verifyToken, createEdit);
app.post("/api/openAiCreateCompletion",verifyToken, createCompletion);

//Message
const {
  sendMessage,
  verifyCode
} = require("./controllers/twoFactorAutentication.js");

app.post("/api/sendMessage",verifyToken, sendMessage);
app.post("/api/verifyMessage",verifyToken, verifyCode);

//Email
const {
  verifyEmail
} = require("./controllers/verificationEmail.js");

app.post("/api/verifyEmail", verifyEmail);

app.listen(3002, () => console.log(`Example app listening on port 3002!`))