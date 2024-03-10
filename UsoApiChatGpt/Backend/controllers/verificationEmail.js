const jwt = require('jsonwebtoken');
const User = require("../model/userModel");

const verifyEmail = async (req, res) => {
    try {
      const { token } = req.body;
  
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
        const user = await User.findOne({user_name: decodedToken.user});
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
  
        // Verify that the state is false
        if (user.state) {
          return res.status(400).json({ error: 'Email already verified' });
        }
  
        // Update the state of the user
        user.state = true;
        await user.save();
  
        return res.status(200).json({ message: 'Email verified successfully' });
      });
    } catch (error) {
      res.status(500).json({ error: 'Error verifying email' });
    }
  };

module.exports = {
    verifyEmail
};