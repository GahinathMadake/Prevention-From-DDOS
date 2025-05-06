const User = require('../models/User');

const getuser = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Log to check the user information attached by the auth middleware
    console.log("Requested for get-user");
    console.log("User from JWT:", req.user);

    // Now, fetch the full user data from the database
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: {
        id:user._id,
        name:user.name,
        email: user.email,
        image: user.image,
      },
    });
  }
  catch(error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const logoutUser = (req, res) => {
  console.log("Logging out!");
  res.clearCookie('authToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.status(200).json({ message: 'Logout successful' });
};

module.exports = { logoutUser };


module.exports = { getuser, logoutUser };
