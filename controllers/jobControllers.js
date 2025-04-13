import Job from "../models/Job.js";
import { verifyTokenFromHeader } from "../utils/jwt.js";

// 전체 조회
export const getAll = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const total = await Job.countDocuments();
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;

  const jobs = await Job.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

  res.json({
    total,
    page,
    limit,
    totalPages,
    hasNextPage,
    data: jobs,
  });
};

// 상세 조회
export const getOne = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job)
    return res.status(404).json({ message: "채용공고를 찾을 수 없습니다." });
  res.json(job);
};

// 등록
export const create = async (req, res) => {
  const tokenData = await verifyTokenFromHeader(req);
  const newJob = await Job.create({
    ...req.body,
    companyId: tokenData.id, // 기업 사용자 ID 저장
  });
  res.status(201).json(newJob);
};

// 수정
export const update = async (req, res) => {
  const tokenData = await verifyTokenFromHeader(req);
  const job = await Job.findById(req.params.id);
  if (!job)
    return res.status(404).json({ message: "채용공고를 찾을 수 없습니다." });
  if (job.companyId.toString() !== tokenData.id)
    return res.status(403).json({ message: "수정 권한이 없습니다." });
  Object.assign(job, req.body);
  await job.save();
  res.json(job);
};

// 삭제
export const remove = async (req, res) => {
  const tokenData = await verifyTokenFromHeader(req);
  const job = await Job.findById(req.params.id);
  if (!job)
    return res.status(404).json({ message: "채용공고를 찾을 수 없습니다." });
  if (job.companyId.toString() !== tokenData.id)
    return res.status(403).json({ message: "삭제 권한이 없습니다." });
  await Job.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
};
