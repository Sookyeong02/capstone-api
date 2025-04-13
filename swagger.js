import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Buildfolio API",
      version: "1.0.0",
    },
    // Authorize 버튼
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js"], // 라우터 주석 기반으로 문서화
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
