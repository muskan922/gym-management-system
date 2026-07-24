import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { protect,authorize } from '../middlewares/auth.js';

const router = express.Router();

router.get(
    "/stats",
    protect,
    authorize("ADMIN", "TRAINER"),
    getDashboardStats
);

export default router;
