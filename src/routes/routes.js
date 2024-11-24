import { Router } from "express";
import userController from "../controllers/userController.js";
import authController from "../controllers/authenticationController.js";
import {verifyToken }from "../middlewares/authMiddleware.js";
import { verifyAdmin } from "../middlewares/adminMiddleware.js";
import {verifyAdvertiser} from "../middlewares/advertiserMiddleware.js";

const router = Router();

router.get('/', verifyToken, verifyAdmin, userController.getAllUsers);
router.post('/', userController.createUser);
router.post('/login', authController.login);
router.post('/send-reset-token', authController.sendResetToken);
router.post('/reset-password', authController.resetPassword);
router.get('/:id', userController.getUserById); 
router.get('/byemail', userController.getUserByEmail); 
router.put('/:id', verifyToken, userController.updateUser);
router.put('/change-password', verifyToken,userController.changePassword);
router.patch('/softdelete/:id', userController.softdeleteUser);
router.delete('/:id', userController.deleteUser);

export default router;