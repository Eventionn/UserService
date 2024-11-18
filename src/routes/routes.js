import { Router } from "express";
import userController from "../controllers/userController.js";

const router = Router();

router.get('/Users', userController.getAllUsers);
router.post('/Users', userController.createUser);

export default router;