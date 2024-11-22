import userService from "../services/userService.js";
import bcryptjs from "bcryptjs";

const userController = {
/**
 * Get All user
 * @auth none
 * @route {POST} /users
 * @bodyparam user User
 * @returns user User
 */
  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);

      if(users == null)
        res.status(400).json("Not Found Any User");
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching users' });
    }
  },

/**
 * Create an user
 * @auth none
 * @route {POST} /users
 * @bodyparam user User
 * @returns user User
 */
  async createUser(req, res) {
    try {
      const defaultUserTypeId = '2c6aab42-7274-424e-8c10-e95441cb95c3';

      if (!req.body.email || !req.body.password || !req.body.username) {
        return res.status(userMessage.error.fieldMissing.http).send(userMessage.error.fieldMissing);
    }
    if (!req.body.password || req.body.password.length < 8) {
      return res.status(400).send("password must be at least 8 characters");
  }
  const existingUser = await userService.findUserByEmail(req.body.email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const passwordHash = await bcryptjs.hash(req.body.password, 10);

console.log(passwordHash)
      const userData = {
        ...req.body,
        password: passwordHash,
        usertype_id: defaultUserTypeId, 
        status: true,
        createdAt: new Date(),
        loginType: "simple"
      };

      
      const newUser = await userService.createUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      
      console.error(error);
      res.status(500).json({ message: 'Error creating user' });
    }
  },


  /**
 * Update a user
 * @auth required
 * @route {PUT} /users/:id
 * @bodyparam user Partial<User>
 * @returns user User
 */
async updateUser(req, res) {
  try {
    const { id } = req.params;
    const { username, phone, email, usertype_id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const existingUser = await userService.findUserById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (updates.password) {
      if (updates.password.length < 8) {
        return res.status(400).send("Password must be at least 8 characters");
      }
      updates.password = await bcryptjs.hash(updates.password, 10);
    }

    const updatedUser = await userService.updateUser(id, { username, phone, email, usertype_id });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user" });
  }
},



async deleteUser(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const existingUser = await userService.findUserById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await userService.updateUser(id, { status: false }); // Define o status como false
    res.status(200).json({ message: "User deactivated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deactivating user" });
  }
},

}



  export default userController;