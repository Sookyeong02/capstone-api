import Portfolio, { ContentBlock } from "../models/Portfolio";
import Like from "../models/Like";
import { verifyToken } from "../utils/jwt";
import { Request, Response } from "express";

export interface PortfolioResponse {
  _id: string;
  userId: string;
  title: string;
  category?: string;
  tags?: string[];
  contentBlocks: ContentBlock[];
  thumbnail?: string;
  likesCount: number;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// 전체 조회
export const getAll = async (req: Request, res: Response) => {
  const { category, sort = "latest", page = 1, limit = 9, search } = req.query;

  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

  let filter: Record<string, any> = {};
  if (category) filter.category = category;

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
      { "contentBlocks.content": { $regex: search, $options: "i" } },
    ];
  }

  const total = await Portfolio.countDocuments(filter);
  const totalPages = Math.ceil(total / parseInt(limit as string));
  const hasNextPage = Number(page) < totalPages;

  let portfolios = await Portfolio.find(filter)
    .sort(sort === "likes" ? {} : { createdAt: -1 })
    .skip(Number(skip))
    .limit(Number(limit))
    .lean<PortfolioResponse[]>();

  if (sort === "likes") {
    const likeCounts = await Like.aggregate([
      { $group: { _id: "$portfolioId", count: { $sum: 1 } } },
    ]);
    const likeMap = Object.fromEntries(
      likeCounts.map((l) => [l._id.toString(), l.count])
    );

    portfolios.forEach((p) => {
      p.likeCount = likeMap[p._id.toString()] || 0;
    });

    portfolios.sort((a, b) => b.likeCount - a.likeCount);
  }

  res.json({
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages,
    hasNextPage,
    data: portfolios,
  });
};

// 상세 조회
export const getOne = async (req: Request, res: Response): Promise<void> => {
  const portfolio = await Portfolio.findById(req.params.id);
  if (!portfolio)
    res.status(404).json({ message: "포트폴리오를 찾을 수 없습니다." });
  res.json(portfolio);
};

// 등록
export const create = async (req: Request, res: Response) => {
  const tokenData = await verifyToken(req);
  const newPortfolio = await Portfolio.create({
    ...req.body,
    userId: tokenData.id,
  });
  res.status(201).json(newPortfolio);
};

// 수정
export const update = async (req: Request, res: Response): Promise<void> => {
  const tokenData = await verifyToken(req);
  const portfolio = await Portfolio.findById(req.params.id);
  if (!portfolio) {
    res.status(404).json({ message: "포트폴리오를 찾을 수 없습니다." });
    return;
  }

  if (portfolio.userId.toString() !== tokenData.id) {
    res.status(403).json({ message: "수정 권한이 없습니다." });
    return;
  }

  Object.assign(portfolio, req.body);
  await portfolio.save();
  res.json(portfolio);
};

// 삭제
export const remove = async (req: Request, res: Response): Promise<void> => {
  const tokenData = await verifyToken(req);
  const portfolio = await Portfolio.findById(req.params.id);
  if (!portfolio) {
    res.status(404).json({ message: "포트폴리오를 찾을 수 없습니다." });
    return;
  }

  if (portfolio.userId.toString() !== tokenData.id) {
    res.status(403).json({ message: "삭제 권한이 없습니다." });
    return;
  }

  await Portfolio.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
};

// 좋아요
export const toggleLike = async (
  req: Request,
  res: Response
): Promise<void> => {
  const tokenData = await verifyToken(req);
  const { id: portfolioId } = req.params;
  const userId = tokenData.id;

  const existingLike = await Like.findOne({ userId, portfolioId });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    res.json({ liked: false, message: "좋아요 취소됨" });
  } else {
    await Like.create({ userId, portfolioId });
    res.json({ liked: true, message: "좋아요 추가됨" });
  }
};

// 좋아요 수 가져오기
export const getLikeCount = async (req: Request, res: Response) => {
  const { id: portfolioId } = req.params;
  const count = await Like.countDocuments({ portfolioId });
  res.json({ portfolioId, likeCount: count });
};

// 내가 좋아요한 포트폴리오 목록
export const getLikedPortfolios = async (req: Request, res: Response) => {
  const tokenData = await verifyToken(req);
  const likes = await Like.find({ userId: tokenData.id }).select("portfolioId");
  const portfolioIds = likes.map((like) => like.portfolioId);
  const portfolios = await Portfolio.find({ _id: { $in: portfolioIds } });
  res.json(portfolios);
};
