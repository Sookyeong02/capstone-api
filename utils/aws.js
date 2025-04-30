import AWS from "aws-sdk";
import multer from "multer"; // multipart/form-data (파일 업로드) 처리를 위한 미들웨어
import multerS3 from "multer-s3"; // multer가 S3와 직접 연동되도록 도와주는 어댑터

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3(); //  s3 객체를 생성

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: "public-read", // 업로드된 파일의 권한 설정
    key: function (req, file, cb) {
      const fileName = `${Date.now()}_${file.originalname}`; // 고유한 파일명 생성
      cb(null, fileName); // S3에 저장할 키(파일명) 설정
    },
  }),
});

export default upload;
