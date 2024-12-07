import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url'; 
import userService from "../services/userService.js";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userController = {


  async changePassword(req, res) {
    const token = req.headers['token'];
    const { oldPassword, newPassword } = req.body;

    
    if (!token || !oldPassword || !newPassword) {
      return res.status(400).send("token, old password and new password are required");
    }
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      console.log("teste", decoded)
      const user = await userService.findUserByEmail({ email: decoded.email });

      if (!user) {
        return res.status(400).send("user not found");
      }

      if (await bcryptjs.compare(oldPassword, user.password)) {
        const passwordHash = await bcryptjs.hash(newPassword, 10);

        await userService.updateUser(user, { username: user.username }, { password: passwordHash });

        return res.status(200).send("password changed");
      } else {
        return res.status(400).send("old password not match");
      }
    } catch (error) {
      console.log(error);
      return res.status(400).send("invalid token");
    }
  },

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

      if (users == null)
        res.status(400).json("Not Found Any User");
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching users' });
    }
  },
  //
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const user = await userService.findUserById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching user by ID" });
    }
  },


  async getUserByEmail(req, res) {
    try {
      const { email } = req.params;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const user = await userService.findUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching user by email" });
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
        return res.status(400).send("Field missing");
      }
      if (!req.body.password || req.body.password.length < 8) {
        return res.status(400).send("password must be at least 8 characters");
      }
      const existingUser = await userService.findUserByEmail(req.body.email);
      if (existingUser) {
        return res.status(400).send("Email Already Exists");
      }
      const passwordHash = await bcryptjs.hash(req.body.password, 10);

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
      const { username, phone, email } = req.body;
    
      const phoneNumber = phone ? parseInt(phone, 10) : null;
      console.log("phone", phoneNumber)
      if (!id) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const existingUser = await userService.findUserById(id);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }

      let profilePicturePath = existingUser.profilePicture;

      if (req.files && req.files.profilePicture) {
        const profilePicture = req.files.profilePicture;
  
        const allowedExtensions = /png|jpeg|jpg|webp/;
        const fileExtension = path.extname(profilePicture.name).toLowerCase();
        if (!allowedExtensions.test(fileExtension)) {
          return res.status(400).json({ message: "Invalid file type. Only PNG, JPEG, and JPG are allowed." });
        }
  
        if (profilePicturePath && fs.existsSync(path.join(__dirname, '../public', profilePicturePath))) {
          fs.unlinkSync(path.join(__dirname, '../public', profilePicturePath));
        }

        const uploadPath = path.join(__dirname, '../public/uploads/profile_pictures', `${id}-${Date.now()}${fileExtension}`);
        await profilePicture.mv(uploadPath); 
  
        profilePicturePath = `/uploads/profile_pictures/${path.basename(uploadPath)}`;
      }

      const updatedUser = await userService.updateUser(existingUser, { username, phone: phoneNumber, email,profilePicture: profilePicturePath });
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating user" });
    }
  },

  async softdeleteUser(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const existingUser = await userService.findUserById(id);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }

      await userService.updateUser(id, { status: false });
      res.status(200).json({ message: "User deactivated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deactivating user" });
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

      await userService.deleteUserById(id);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting user" });
    }
  },


}



export default userController;