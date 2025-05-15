"use strict";
// import express from "express";
// // import mockPortfolios from "./data/mock.js";
// import mongoose from "mongoose";
// // import { DATABASE_URL } from "./env.js";
// import * as dotenv from "dotenv";
// dotenv.config();
// import Portfolio from "./models/Portfolio.js";
// import cors from "cors";
// const app = express();
// // const corsOptions = {
// //   origin: ['http://127.0.0.1:3000', 'https://buildfolio-2025.netlify.app/'],
// // };
// app.use(cors());
// // app.use(cors(corsOptions));
// app.use(express.json()); // 앱 전체에서 express 사용하겠다는 의미
// // asyncHandler: 라우터에 들어가는 함수를 파라미터로 받아서 또 다른 핸들러 함수를 리턴
// function asyncHandler(handler) {
//   return async function (req, res) {
//     // 리턴하는 핸들러 함수는 파라미터로 전달되는 핸들러 함수와 똑같음
//     try {
//       await handler(req, res);
//     } catch (e) {
//       // console.log(e.name);
//       // console.log(e.message);
//       if (e.name === "ValidationError") {
//         res.status(400).send({ message: e.message });
//       } else if (e.name === "CastError") {
//         res.status(404).send({ message: "Cannot find given id." });
//       } else {
//         res.status(500).send({ message: e.message });
//       }
//     }
//   };
// }
// // GET
// // app.get("/portfolios", (req, res) => {
// // app.get("/portfolios", async (req, res) => {
// app.get(
//   "/portfolios",
//   asyncHandler(async (req, res) => {
//     /**
//      * 쿼리 파라미터
//      * - sort: 'oldest'인 경우 오래된 태스크 기준, 나머지 경우 새로운 태스크 기준
//      * - count: 태스크 개수
//      */
//     const sort = req.query.sort;
//     const count = Number(req.query.count) || 0;
//     const sortOption = { createdAt: sort === "oldest" ? "asc" : "desc" };
//     const portfolios = await Portfolio.find().sort(sortOption).limit(count);
//     // const compareFn =
//     //   sort === "oldest"
//     //     ? (a, b) => a.createdAt - b.createdAt
//     //     : (a, b) => b.createdAt - a.createdAt;
//     // let newPortfolios = mockPortfolios.sort(compareFn);
//     // if (count) {
//     //   newPortfolios = newPortfolios.slice(0, count);
//     // }
//     // res.send(newPortfolios);
//     res.send(portfolios);
//   })
// );
// // 다이나믹 URL 처리
// // app.get("/portfolios/:id", (req, res) => {
// //   const id = Number(req.params.id);
// //   const portfolio = mockPortfolios.find((portfolio) => portfolio.id === id);
// app.get("/portfolios/:id", async (req, res) => {
//   const id = req.params.id;
//   const portfolio = await Portfolio.findById(id);
//   if (portfolio) {
//     res.send(portfolio);
//   } else {
//     res.status(404).send({ message: "Cannot find given id. " });
//   }
// });
// // POST
// // app.post("/portfolios", (req, res) => {
// // app.post("/portfolios", async (req, res) => {
// app.post(
//   "/portfolios",
//   asyncHandler(async (req, res) => {
//     // const newPortfolio = req.body;
//     // const ids = mockPortfolios.map((portfolio) => portfolio.id);
//     // newPortfolio.id = Math.max(...ids) + 1;
//     // newPortfolio.isComplete = false;
//     // newPortfolio.createdAt = new Date();
//     // newPortfolio.updatedAt = new Date();
//     // mockPortfolios.push(newPortfolio);
//     const newPortfolio = await Portfolio.create(req.body);
//     res.status(201).send(newPortfolio);
//   })
// );
// //PATCH
// // app.patch("/portfolios/:id", (req, res) => {
// app.patch(
//   "/portfolios/:id",
//   asyncHandler(async (req, res) => {
//     // const id = Number(req.params.id);
//     // const portfolio = mockPortfolios.find((portfolio) => portfolio.id === id);
//     const id = req.params.id;
//     const portfolio = await Portfolio.findById(id);
//     if (portfolio) {
//       Object.keys(req.body).forEach((key) => {
//         portfolio[key] = req.body[key];
//       });
//       // portfolio.updatedAt = new Date();
//       await portfolio.save();
//       res.send(portfolio);
//     } else {
//       res.status(404).send({ message: "Cannot find given id. " });
//     }
//   })
// );
// // DELETE
// // app.delete("/portfolios/:id", (req, res) => {
// // const id = Number(req.params.id);
// // const idx = mockPortfolios.findIndex((portfolio) => portfolio.id === id);
// app.delete(
//   "/portfolios/:id",
//   asyncHandler(async (req, res) => {
//     const id = req.params.id;
//     const portfolio = await Portfolio.findByIdAndDelete(id);
//     // if (idx >= 0) {
//     if (portfolio) {
//       // mockPortfolios.splice(idx, 1); // idx에서 시작해서 요소 1개를 지우라는 의미
//       res.sendStatus(204); // 상태 코드만 보낼 때 사용
//     } else {
//       res.status(404).send({ message: "Cannot find given id. " });
//     }
//   })
// );
// // app.listen(3000, () => console.log("Server Started"));
// app.listen(process.env.PORT || 3000, () => console.log("Server Started"));
// // mongoose.connect(DATABASE_URL).then(() => console.log("Connected to DB"));
// mongoose
//   .connect(process.env.DATABASE_URL)
//   .then(() => console.log("Connected to DB"));
