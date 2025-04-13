import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.JWT_SECRET || "my-secret";

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, secret, { expiresIn: "7d" });
};

export const verifyTokenFromHeader = (req) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) throw new Error("No token");

  const token = auth.split(" ")[1];
  return jwt.verify(token, secret);
};
