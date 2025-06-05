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
  const { category, sort = "latest", page = 1, limit = 12, search } = req.query;

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
    .populate("userId", "nickname profileImage")
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

  portfolios = portfolios.map((p: any) => ({
    ...p,
    id: p._id,
    nickname: p.userId?.nickname || null,
    profileImageUrl: p.userId?.profileImage || null,
  }));

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
  try {
    const portfolio = await Portfolio.findById(req.params.id)
      .populate("userId", "_id nickname profileImage")
      .lean();

    if (!portfolio) {
      res.status(404).json({ message: "포트폴리오를 찾을 수 없습니다." });
      return;
    }

    const { userId, ...rest } = portfolio;
    const user = userId as any;

    res.json({
      ...rest,
      id: portfolio._id,
      userId: user._id,
      nickname: user.nickname,
      profileImageUrl: user.profileImage,
    });
  } catch (err) {
    console.error("포트폴리오 상세 조회 오류:", err);
    res.status(500).json({ message: "서버 오류" });
  }
};

// 공개용 특정 포트폴리오 조회
export const getPublicPortfoliosByUserId = async (
  req: Request,
  res: Response
) => {
  const { userId } = req.params;

  try {
    const portfolios = await Portfolio.find({ userId })
      .sort({ createdAt: -1 })
      .populate("userId", "nickname");

    const mapped = portfolios.map((p) => ({
      id: p._id,
      title: p.title,
      thumbnail: p.thumbnail,
      likesCount: p.likesCount,
      nickname: (p.userId as any).nickname,
    }));

    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: "포트폴리오 조회 실패", error: err });
  }
};

// 등록
export const create = async (req: Request, res: Response) => {
  try {
    const tokenData = await verifyToken(req);

    const firstImageBlock = req.body.contentBlocks?.find(
      (block: any) => block.type === "image"
    );

    const newPortfolio = await Portfolio.create({
      ...req.body,
      userId: tokenData.id,
      thumbnail: req.body.thumbnail || firstImageBlock?.content || null,
    });

    const populated = await newPortfolio.populate("userId", "_id nickname");

    const portfolioWithNickname = populated.toJSON() as {
      userId: { id: string; nickname: string };
      [key: string]: any;
    };

    res.status(201).json({
      ...portfolioWithNickname,
      userId: portfolioWithNickname.userId.id,
      nickname: portfolioWithNickname.userId.nickname,
    });
  } catch (error) {
    console.error("포트폴리오 생성 실패:", error);
    res
      .status(500)
      .json({ message: "포트폴리오 생성 중 오류가 발생했습니다." });
  }
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
