import { Router } from "express";
import userController from "../controllers/userController.js";
import {verifyToken }from "../middlewares/authMiddleware.js";
import { verifyAdmin } from "../middlewares/adminMiddleware.js";
import {verifyAdvertiser} from "../middlewares/advertiserMiddleware.js";

const router = Router();

router.get('/', verifyToken, verifyAdmin, userController.getAllUsers);
router.post('/', userController.createUser);
router.post('/login', userController.login);
router.get('/:id', userController.getUserById); 
router.get('/byemail', userController.getUserByEmail); 
router.put('/:id', verifyToken, userController.updateUser);
router.put('/change-password', verifyToken,userController.changePassword);
router.patch('/softdelete/:id', userController.softdeleteUser);
router.delete('/:id', userController.deleteUser);

export default router;