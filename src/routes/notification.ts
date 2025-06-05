import express from "express";
import * as notificationController from "../controllers/notificationControllers";

const router = express.Router();

router.get("/", notificationController.getMyNotifications);
router.patch("/:id/read", notificationController.markAsRead);
router.delete("/:id", notificationController.deleteNotification);

export default router;
