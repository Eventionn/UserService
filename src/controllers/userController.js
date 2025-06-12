import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import userService from "../services/userService.js";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken';
import { OAuth2Client } from "google-auth-library";

const oAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userController = {

  async changePassword(req, res) {
    const token = req.headers['authorization'];
    const { oldPassword, newPassword } = req.body;


    if (!token || !oldPassword || !newPassword) {
      return res.status(400).send("token, old password and new password are required");
    }
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      console.log("teste", decoded)
      const user = await userService.findUserByEmail(decoded.email);

      if (!user) {
        return res.status(400).send("user not found");
      }

      if (await bcryptjs.compare(oldPassword, user.password)) {
        const passwordHash = await bcryptjs.hash(newPassword, 10);

        //await userService.updateUser(user, { username: user.username }, { password: passwordHash });
        await userService.updateUser(user, { password: passwordHash });


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
      res.status(200).json(users ?? []);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching users' });
    }
  },

  /**
  * Get all users by page
  * @route {GET} /usersPaginated
  * @returns {Array} List of events
  * @description Fetches users from the database.
  */
  async getUsersPaginated(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || null;

    try {
      const result = await userService.findUsersPaginated(page, limit, search);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching users' });
    }
  },


  async getMyProfile(req, res) {

    const userID = req.user.userID;
    console.log("USERID", userID);
    try {
      const user = await userService.findUserById(userID);

      if (!user) {
        return res.status(400).send("User not found");
      }


      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Server Error");
    }
  },

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

  async registerGoogle(req, res) {
    try {
      const { token } = req.body;
      const ticket = await oAuth2Client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const { sub, email, name, picture } = payload;

      const existingUser = await userService.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).send("User already registered");
      }

      const newUser = await userService.createUser({
        username: name,
        email,
        profilePicture: picture,
        loginType: 'google',
        usertype_id: defaultUserTypeId,
        status: true,
        createdAt: new Date(),
      });

      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error registering with Google' });
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
      const { username, phone, email, usertype_id, status } = req.body;

      const phoneNumber = phone ? parseInt(phone, 10) : null;

      if (!id) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const existingUser = await userService.findUserById(id);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }

      let profilePicturePath = existingUser.profilePicture;
      const basePath = '/usr/src/app/public/uploads/profile_pictures';

      if (req.files && req.files.profilePicture) {
        const profilePicture = req.files.profilePicture;

        const allowedExtensions = /png|jpeg|jpg|webp/;
        const fileExtension = path.extname(profilePicture.name).toLowerCase();
        if (!allowedExtensions.test(fileExtension)) {
          return res.status(400).json({ message: "Invalid file type. Only PNG, JPEG, JPG and WEBP are allowed." });
        }

        if (profilePicturePath) {
          const oldPath = path.join(basePath, path.basename(profilePicturePath));
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }

        if (!fs.existsSync(basePath)) {
          fs.mkdirSync(basePath, { recursive: true });
        }

        const uniqueName = `${id}-${Date.now()}${fileExtension}`;
        const uploadPath = path.join(basePath, uniqueName);
        await profilePicture.mv(uploadPath);

        profilePicturePath = `/uploads/profile_pictures/${uniqueName}`;
      }

      const parsedStatus = (typeof status !== 'undefined')
        ? (status === 'true' || status === true)
        : undefined;

      const updatedUser = await userService.updateUser(existingUser, {
        username,
        phone: phone ? parseInt(phone, 10) : null,
        email,
        profilePicture: profilePicturePath,
        usertype_id,
        ...(typeof parsedStatus !== 'undefined' && { status: parsedStatus })
      });

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