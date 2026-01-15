import User from "../model/User.js";
import bcrypt from "bcryptjs";

export const forgotPassword = async (req, res, next) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password || password.length < 6) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  let existingUser;
  try {
    existingUser = await User.finHigh({ email });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }

  if (!existingUser) {
    return res.status(404).json({
      message: "Email does not exist",
    });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  existingUser.password = hashedPassword;

  try {
    await existingUser.save();
  } catch (err) {
    return res.status(500).json({ message: "Failed to update password" });
  }

  return res.status(200).json({
    message: "Password updated successfully",
  });
};
