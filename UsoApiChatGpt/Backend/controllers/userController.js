const bcrypt = require('bcrypt');
const Mailjet = require('node-mailjet');
const jwt = require('jsonwebtoken');
const User = require("../model/userModel");
const mailjet = Mailjet.apiConnect(
  process.env.SEND_EMAIL_PUBLIC_KEY,
  process.env.SEND_EMAIL_SECRET_KEY
);


const userPost = async (req, res) => {
  try {
    const { password, ...userData } = req.body;
    
    const users = await User.findOne({email: userData.email});
    if (users) {
      return res.status(500).json({ error: 'The email Exist' });
    }

    const userName = await User.findOne({user_name: userData.user_name});
    if (userName) {
      return res.status(500).json({ error: 'The email Exist' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new User instance with the hashed password
    const user = new User({
      ...userData,
      password: hashedPassword
    });

    // Save the user data to the database
    const savedUser = await user.save();

    // Respond with the saved user data
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: 'Error to save the user' });
  }
};


const userPostSendEmail = async (req, res) => {
  try {
    const { password, email, ...userData } = req.body;
    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);    
    const users = await User.findOne({email: email});
    if (users) {
      return res.status(500).json({ error: 'The email Exist' });
    }

    const userName = await User.findOne({user_name: userData.user_name});
    if (userName) {
      return res.status(500).json({ error: 'The email Exist' });
    }

    // Create a new User instance with the hashed password
    const user = new User({
      ...userData,
      password: hashedPassword,
      email: email,
    });
    // Save the user data to the database
    const savedUser = await user.save();

    // Generate a token for email verification
    const emailToken = jwt.sign({ user: user.user_name, email: user.email, state: user.state }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
    const verificationLink = `${process.env.SEND_EMAIL_TOKEN}?token=${emailToken}`;

    const request = await mailjet
      .post("send", { 'version': 'v3.1' })
      .request({
        "Messages": [
          {
            "From": {
              "Email": "vargasquesada16@hotmail.com",
              "Name": "aipromptsnoreply"
            },
            "To": [
              {
                "Email": user.email,
                "Name": user.user_name
              }
            ],
            "Subject": "Verification Email",
            "TextPart": "Click on the following link to verify your email:" + verificationLink,
            "HTMLPart": "Click on the following link to verify your email: <a href=" + verificationLink + ">" + verificationLink + "</a>",
            "CustomID": "AppGettingStartedTest"
          }
        ]
      })
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: 'Error to save the user' });
    console.log(error);
  }
};


const userResetSendEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const users = await User.findOne({email: email});
    
    // Generate a token for email verification
    const emailToken = jwt.sign({ user: users.user_name, email: email }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
    const verificationLink = `${process.env.SEND_RESET_TOKEN}?token=${emailToken}`;

    const request = await mailjet
      .post("send", { 'version': 'v3.1' })
      .request({
        "Messages": [
          {
            "From": {
              "Email": "vargasquesada16@hotmail.com",
              "Name": "aipromptsnoreply"
            },
            "To": [
              {
                "Email": users.email,
                "Name": users.user_name 
              }
            ],
            "Subject": "Reset Password",
            "TextPart": "Click on the following link to reset your password:" + verificationLink,
            "HTMLPart": "Click on the following link to reset your password: <a href=" + verificationLink + ">" + verificationLink + "</a>",
            "CustomID": "AppGettingStartedTest"
          }
        ]
      })
  } catch (error) {
    res.status(500).json({ error: 'Error to save the user' });
    console.log(error);
  }
};

const userGet = async (req, res) => {
  try {
    // Retrieve all users from the database
    const users = await User.find();
    // Respond with the list of users
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error to obtain users' });
  }
};

const userGetByID = async (req, res) => {
  try {
    const userId = req.query.id;
    // Find all prompts associated with the specified user ID in the database
    const user = await User.findById(userId);
    // Respond with the list of users
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error to obtain users' });
  }
};

const userDelete = async (req, res) => {
  try {
    // Get the user ID to delete from the query parameters
    const userId = req.query.id;
    // Check if the user exists in the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User does not exist' });
    }

    // Delete the user from the database
    await user.deleteOne();

    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error to delete the user' });
  }
};

const updateUser = async (req, res) => {
  try {
    // Get the user ID to update from the query parameters
    const userId = req.query.id;
    // Check if the user exists in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User does not exist' });
    }

    // Get the updated fields from the request body
    const updatedFields = req.body;

    // Check if the password is being updated
    if (updatedFields.password) {
      // Hash the new password before saving
      const hashedPassword = await bcrypt.hash(updatedFields.password, 10);
      updatedFields.password = hashedPassword;
    }

    // Update the user fields with the provided values
    Object.assign(user, updatedFields);

    // Save the changes to the database
    const savedUser = await user.save();

    res.status(200).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: 'Error to update user' });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Verify the token
    if (!token) {
      return res.status(400).json({ error: 'Token not provided' });
    }

    // Verify the token by jwt
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decodedToken) => {
      if (err) {
        return res.status(400).json({ error: 'Invalid or expired token' });
      }

      // Search the user
      const user = await User.findOne({email: decodedToken.email});
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Update the state of the user
      user.password = hashedPassword;
      await user.save();

      return res.status(200).json({ message: 'Email verified successfully' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error verifying email' });
  }
};


module.exports = {
  userPost,
  userGet,
  userDelete,
  userPostSendEmail,
  userResetSendEmail,
  userGetByID,
  updateUser,
  updatePassword
};  
