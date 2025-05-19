import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "./s3Client";
import { Request } from "express";
import { S3Client } from "@aws-sdk/client-s3";

const bucketName = process.env.S3_BUCKET_NAME;
if (!bucketName) {
  throw new Error("S3_BUCKET_NAME 환경변수가 설정되지 않았습니다.");
}

const uploadPublic = multer({
  storage: multerS3({
    s3: s3 as S3Client,
    bucket: bucketName,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: any, key?: string) => void
    ) => {
      const folder = String(req.query.folder || "public");
      const fileName = `${Date.now()}_${file.originalname}`;

      console.log("[key]", folder, fileName); // 확인용

      cb(null, `${folder}/${fileName}`);
    },
  }),
});

export default uploadPublic;
