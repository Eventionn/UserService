import { Router } from "express";
import userController from "../controllers/userController.js";

const router = Router();

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.post('/login', userController.login);
router.get('/:id', userController.getUserById); 
router.get('/byemail', userController.getUserByEmail); 
router.put('/:id', userController.updateUser);
router.put('/change-password', userController.changePassword);
router.patch('/softdelete/:id', userController.softdeleteUser);
router.delete('/:id', userController.deleteUser);

export default router;