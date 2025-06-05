import { Request, Response } from "express";
import Notification from "../models/Notification";
import { verifyToken } from "../utils/jwt";

// 알림 조회
export const getMyNotifications = async (req: Request, res: Response) => {
  try {
    const tokenData = await verifyToken(req);
    const notifications = await Notification.find({
      userId: tokenData.id,
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err: any) {
    res.status(500).json({ message: "알림 조회 실패", error: err.message });
  }
};

// 알림 읽음, 안읽음 처리
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const tokenData = await verifyToken(req);
    await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: tokenData.id },
      { isRead: true }
    );
    res.json({ message: "읽음 처리 완료" });
  } catch (err: any) {
    res.status(500).json({ message: "읽음 처리 실패", error: err.message });
  }
};

// 알림 삭제
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const tokenData = await verifyToken(req);
    await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: tokenData.id,
    });
    res.json({ message: "알림 삭제 완료" });
  } catch (err: any) {
    res.status(500).json({ message: "알림 삭제 실패", error: err.message });
  }
};
