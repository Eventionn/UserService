import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken';
import userService from "../services/userService.js";
import mailService from "../services/mailService.js";

const authController = {
    async login(req, res) {
        const { email, password } = req.body;
    
        const user = await userService.findUserByEmail(email);
        if (!user)
          return res.status(400).send("user not found");
    
        if (await bcryptjs.compare(password, user.password)) {
    
          const token = jwt.sign({ username: user.username, email: user.email, userType: user.usertype_id }, process.env.SECRET_KEY, { expiresIn: '1d' });
          return res.status(200).send({ token: token });
    
        } else {
          return res.status(400).send("email/password not match");
        }
      },

      async sendResetToken(req, res) {
        const { email } = req.body;
      
        if (!email) return res.status(400).send("Email is required");
      
        try {
          const user = await userService.findUserByEmail(email);
      
          if (!user) return res.status(404).send("User not found");
      
          const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: "1h" });
      
          await mailService.sendEmail({
            to: email,
            subject: "Password Reset",
            text: `Use this token to reset your password: ${token}`,
          });
      
          return res.status(200).send("Reset token sent to your email");
        } catch (error) {
          console.error(error);
          return res.status(500).send("Error sending reset token");
        }
      },
      
      // 2. Redefinir senha
      async resetPassword(req, res) {
        const { token, newPassword } = req.body;
      
        if (!token || !newPassword) {
          return res.status(400).send("Token and new password are required");
        }
      
        try {
          const decoded = jwt.verify(token, process.env.SECRET_KEY);
          const email = decoded.email;
          const user = await userService.findUserByEmail( email );
      
          if (!user) return res.status(404).send("User not found");
      
          const hashedPassword = await bcryptjs.hash(newPassword, 10);
          await userService.updateUser(user, { password: hashedPassword });
      
          return res.status(200).send("Password reset successfully");
        } catch (error) {
          console.error(error);
          return res.status(400).send("Invalid or expired token");
        }
      }



}



export default authController;