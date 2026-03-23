import User from "../models/User.js";
import jwt from "jsonwebtoken";

// export const register = async (req, res) => {
//   const { name, email, password } = req.body;

//   const userExists = await User.findOne({ email });
//   if (userExists)
//     return res.status(400).json({ message: "User already exists" });

//   const user = await User.create({ name, email, password });

//   res.status(201).json({ message: "User registered successfully" });
// };

export const register = async (req, res) => {
  try {
    console.log("BODY:", req.body); // debug

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    console.error("REGISTER ERROR:", err); // 🔥 VERY IMPORTANT
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
// export const login = async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email }).select("+password");
//   if (!user || !(await user.comparePassword(password))) {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }

//   const token = jwt.sign(
//     { id: user._id, role: user.role },
//     process.env.JWT_SECRET,
//     { expiresIn: "1d" }
//   );

//   res.json({
//     token,
//     user: {
//       id: user._id,
//       name: user.name,
//       role: user.role,
//     },
//   });
// };
