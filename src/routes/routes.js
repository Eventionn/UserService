import { Router } from "express";
import fileUpload from "express-fileupload";
import userController from "../controllers/userController.js";
import authController from "../controllers/authenticationController.js";
import {verifyToken }from "../middlewares/authMiddleware.js";
import { verifyAdmin } from "../middlewares/adminMiddleware.js";
import {verifyAdvertiser} from "../middlewares/advertiserMiddleware.js";

const router = Router();
router.use(fileUpload());

router.get('/', verifyToken, verifyAdmin, userController.getAllUsers);
router.post('/', userController.createUser);
router.get('/paginated', verifyToken, userController.getUsersPaginated);
router.post('/createG', userController.registerGoogle);
router.put('/change-password', verifyToken, userController.changePassword);
router.get('/my-profile', verifyToken, userController.getMyProfile);
router.post('/login', authController.login);
router.post('/loginG', authController.loginGoogle);
router.post('/logout', authController.logout);
router.post('/send-reset-token', authController.sendResetToken);
router.post('/reset-password', authController.resetPassword);
router.get('/:id', userController.getUserById); 
router.get('/byemail/:email', userController.getUserByEmail); 
router.put('/:id', verifyToken, userController.updateUser);
router.patch('/softdelete/:id', userController.softdeleteUser);
router.delete('/:id', userController.deleteUser);

export default router;