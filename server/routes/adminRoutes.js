import express from 'express';
import { adminLogin } from "../controllers/adminController.js";

const adminRouter = express.Router();

// Định nghĩa route POST cho login
adminRouter.post('/login', adminLogin);

export default adminRouter;