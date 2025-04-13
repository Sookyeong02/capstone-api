import Portfolio from "../models/Portfolio.js";
import Like from "../models/Like.js";
import { verifyTokenFromHeader } from "../utils/jwt.js";

// 전체 조회
export const getAll = async (req, res) => {
  const { category, sort = "latest", page = 1, limit = 9, search } = req.query;

  // const filter = category ? { category } : {};
  const skip = (page - 1) * limit;

  let filter = {};
  if (category) filter.category = category;

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
      { "contentBlocks.content": { $regex: search, $options: "i" } },
    ];
  }

  const total = await Portfolio.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = Number(page) < totalPages;

  let portfolios = await Portfolio.find(filter)
    .sort(sort === "likes" ? {} : { createdAt: -1 })
    .skip(Number(skip))
    .limit(Number(limit))
    .lean();

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
export const getOne = async (req, res) => {
  const portfolio = await Portfolio.findById(req.params.id);
  if (!portfolio)
    return res.status(404).json({ message: "포트폴리오를 찾을 수 없습니다." });
  res.json(portfolio);
};

// 등록
export const create = async (req, res) => {
  const tokenData = await verifyTokenFromHeader(req);
  const newPortfolio = await Portfolio.create({
    ...req.body,
    userId: tokenData.id,
  });
  res.status(201).json(newPortfolio);
};

// 수정
export const update = async (req, res) => {
  const tokenData = await verifyTokenFromHeader(req);
  const portfolio = await Portfolio.findById(req.params.id);
  if (!portfolio)
    return res.status(404).json({ message: "포트폴리오를 찾을 수 없습니다." });

  if (portfolio.userId.toString() !== tokenData.id)
    return res.status(403).json({ message: "수정 권한이 없습니다." });

  Object.assign(portfolio, req.body);
  await portfolio.save();
  res.json(portfolio);
};

// 삭제
export const remove = async (req, res) => {
  const tokenData = await verifyTokenFromHeader(req);
  const portfolio = await Portfolio.findById(req.params.id);
  if (!portfolio)
    return res.status(404).json({ message: "포트폴리오를 찾을 수 없습니다." });

  if (portfolio.userId.toString() !== tokenData.id)
    return res.status(403).json({ message: "삭제 권한이 없습니다." });

  await Portfolio.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
};

// 좋아요
export const toggleLike = async (req, res) => {
  const tokenData = await verifyTokenFromHeader(req);
  const { id: portfolioId } = req.params;
  const userId = tokenData.id;

  const existingLike = await Like.findOne({ userId, portfolioId });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    return res.json({ liked: false, message: "좋아요 취소됨" });
  } else {
    await Like.create({ userId, portfolioId });
    return res.json({ liked: true, message: "좋아요 추가됨" });
  }
};

// 좋아요 수 가져오기
export const getLikeCount = async (req, res) => {
  const { id: portfolioId } = req.params;
  const count = await Like.countDocuments({ portfolioId });
  res.json({ portfolioId, likeCount: count });
};

// 내가 좋아요한 포트폴리오 목록
export const getLikedPortfolios = async (req, res) => {
  const tokenData = await verifyTokenFromHeader(req);
  const likes = await Like.find({ userId: tokenData.id }).select("portfolioId");
  const portfolioIds = likes.map((like) => like.portfolioId);
  const portfolios = await Portfolio.find({ _id: { $in: portfolioIds } });
  res.json(portfolios);
};
