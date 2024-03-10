const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.SMS_SECRET_KEY;
const client = require('twilio')(accountSid, authToken);
const User = require("../model/userModel");

function generateRandomNumber() {
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const sendMessage = async (req, res) => {
  const randomNumber = generateRandomNumber();

  try {
    // Get the user ID to update from the query parameters
    const userId = req.query.id;
    // Check if the user exists in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User does not exist' });
    }

    // Get the updated fields from the request body
    const updatedFields = {two_factor_code: randomNumber.toString()};

    // Update the user fields with the provided values
    Object.assign(user, updatedFields);

    // Save the changes to the database
    const savedUser = await user.save();

   client.messages
    .create({
      body: 'Verification token ' + randomNumber,
      to:  '+506' + user.phone,
      from: '+14706191610'
    })
    .then(message => console.log(message.sid))

    res.status(200).json({ message: 'Token created' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error to update user' });
  }
};

const verifyCode = async (req, res) => {
  try {
    // Get the user ID to update from the query parameters
    const userId = req.query.id;
    // Check if the user exists in the database
    const user = await User.findById(userId);
    const code = req.body.code;
    if (!user) {
      return res.status(404).json({ error: 'User does not exist' });
    }
    if (code === user.two_factor_code) {
      res.status(200).json({ message: 'Two Factor verification succesfully' });  
    }
  } catch (error) {
    res.status(500).json({ error: 'Error to login' });
  }
};

module.exports = {
  sendMessage,
  verifyCode
};