const Session = require("../model/sessionModel");
const User = require("../model/userModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const sessionPost = async (req, res) => {
  const { user_name, password } = req.body;

  try {
    // Use findOne, a method of Mongoose, to check if the user exists in the database
    const user = await User.findOne({ user_name });

    // Check if the user with the specified username exists in the database
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify if the provided password matches the hashed password stored in the database
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Generate a token using the sign method of the jsonwebtoken library
    const token = jwt.sign({ id: user._id, username: user.user_name, role: user.role, state: user.state,  two_factor: user.two_factor, two_factor_code: user.two_factor_code, phone: user.phone }, process.env.JWT_SECRET_KEY);

    // Calculate the token's expiration date (in this case, 1 hour from the time of login)
    const expireDate = new Date();
    expireDate.setHours(expireDate.getHours() + 1);

    const session = new Session({
      user: user.user_name,
      token: token,
      expire: expireDate
    });

    // Save the session in the database
    await session.save();
    console.log('Session saved');

    // Send the token and user information to the client as JSON
    res.json({ token: token, id: user._id, role: user.role });
  } catch (error) {
    console.error('Error at login', error);
    res.status(500).json({ error: 'Error at login' });
  }
};

module.exports = {
  sessionPost
};  