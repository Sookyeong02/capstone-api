import { Request, Response } from "express";
import Portfolio from "../models/Portfolio";
import User from "../models/User";
import Notification from "../models/Notification";
import { verifyToken } from "../utils/jwt";
import nodemailer from "nodemailer";

// 포트폴리오 기반
export const sendHireRequestByPortfolioId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const tokenData = await verifyToken(req);
    const company = await User.findById(tokenData.id);

    if (!company || company.role !== "company") {
      res.status(403).json({ message: "권한이 없습니다." });
      return;
    }

    const portfolio = await Portfolio.findById(req.params.id).populate(
      "userId"
    );
    if (
      !portfolio ||
      !portfolio.userId ||
      typeof portfolio.userId === "string"
    ) {
      res
        .status(404)
        .json({ message: "포트폴리오 작성자를 찾을 수 없습니다." });
      return;
    }

    const targetUser = portfolio.userId as any;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const emailText = `[빌드폴리오] 기업 채용 제안 안내

'${company.companyName}'에서 회원님의 포트폴리오를 보고 채용 제안을 보냈습니다.

이메일: ${company.email}

안녕하세요, 채용 제안 드리고자 연락드립니다. 해당 이메일로 회신 부탁드립니다.

감사합니다.`;

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: targetUser.email,
      subject: `[빌드폴리오] ${company.companyName}에서 채용 제안이 도착했습니다`,
      text: emailText,
    });

    await Notification.create({
      userId: targetUser._id,
      message: `'${company.companyName}'에서 채용 제안을 발송했습니다.`,
    });

    res.json({ message: "채용 제안 이메일이 성공적으로 전송되었습니다." });
  } catch (err: any) {
    console.error("채용 제안 이메일 전송 실패:", err);
    res.status(500).json({ message: "이메일 전송 실패", error: err.message });
  }
};

// 프로필 기반
export const sendHireRequestByUserId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const tokenData = await verifyToken(req);
    const company = await User.findById(tokenData.id);

    if (!company || company.role !== "company") {
      res.status(403).json({ message: "권한이 없습니다." });
      return;
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser || targetUser.role !== "personal") {
      res.status(404).json({ message: "개인 사용자를 찾을 수 없습니다." });
      return;
    }

    await Notification.create({
      userId: targetUser._id,
      message: `'${company.companyName}'에서 채용 제안을 발송했습니다.`,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const emailText = `[빌드폴리오] 기업 채용 제안 안내

'${company.companyName}'에서 회원님의 포트폴리오를 보고 채용 제안을 보냈습니다.

이메일: ${company.email}

안녕하세요, 채용 제안 드리고자 연락드립니다. 해당 이메일로 회신 부탁드립니다.

감사합니다.`;

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: targetUser.email,
      subject: `[빌드폴리오] ${company.companyName}에서 채용 제안이 도착했습니다`,
      text: emailText,
    });

    res.json({ message: "채용 제안 이메일이 성공적으로 전송되었습니다." });
  } catch (err: any) {
    console.error("채용 제안 이메일 전송 실패:", err);
    res.status(500).json({ message: "이메일 전송 실패", error: err.message });
  }
};
