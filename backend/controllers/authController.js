const User = require("../models/User");
const bcrypt = require("bcrypt");

const sendToken = (user, statusCode, res) => {
  const token = user.generateJwtToken();

  //Set cookie option
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    maxAge: 2 * 60 * 60 * 60,
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: "true",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({
        status: failed,
        message: "Please provide a valid email and password",
      });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({
        status: "Failed",
        message: "There is no user with this email",
      });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({
        status: "Failed",
        message: "Please provide the valid email",
        isMatch,
      });

    sendToken(user, 200, res);
  } catch (error) {}
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !name || !password)
      return res.status(400).json({
        status: "Failed",
        message: "Please provide name, email and password",
      });

    // Await the user lookup
    const prevuser = await User.findOne({ email });

    if (prevuser)
      return res.status(400).json({
        status: "Failed",
        message: "This user already exists. Please login to continue",
      });

    const newUser = await User.create({ name, email, password });
    sendToken(newUser, 201, res);
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Something went wrong. Please try again later.",
    });
  }
};
