import User from "../models/userModel.js";
import { userValidationSchema } from "../validation/userValidation.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const result = userValidationSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.message });
    }

    const existingUser = await User.findOne({ username: result.data.username });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = new User(result.data);
    const savedUser = await newUser.save();

    const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET);
    return res.status(201).json({
      message: "User created successfully",
      user: savedUser,
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Server error while creating user" });
  }
};

export const signin = async (req, res) => {
  try {
    const result = req.body;
    if (!result) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const user = await User.findOne({
      username: req.body.username,
      password: req.body.password,
    });

    if (user) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      return res.status(200).json({
        message: "User signed in successfully",
        user,
        token,
      });
    }
    res.status(401).json({ error: "Invalid credentials" });
  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({ error: "Server error while creating user" });
  }
};

export const updateUser = async (req, res) => {
  const { password, firstName, lastName } = req.body;

  // Check if at least one field is provided
  if (!password && !firstName && !lastName) {
    return res.status(400).json({ error: "No update fields provided" });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.userId },
      { $set: req.body },
      { new: true } // return updated doc
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ error: "Server error while updating user" });
  }
};


export const findingUser = async(req,res)=>{
    const filter = req.query.filter||'';
    const user = await User.find({
        $or:[{
            firstName:{
                '$regex':filter,
            }
        },{
            lastName:{
                '$regex':filter
            }
        }]
    })
    res.json({
        user:user.map((user)=>({
            username:user.username,
            firstName:user.firstName,
            lastName:user.lastName
        }))
    })
}
