// swagger.js
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Transfer Student API",
      version: "1.0.0",
      description: "API documentation for the Student/Faculty/Major/User system",
    },
    servers: [
      {
        url: "http://localhost:3001",
      },
    ],
    components: {
      schemas: {
        Semester: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            year: { type: "integer", example: 2024 },
            term: { type: "integer", example: 1 },
            startDate: {
              type: "string",
              format: "date-time",
              example: "2024-06-01T00:00:00.000Z",
            },
            endDate: {
              type: "string",
              format: "date-time",
              example: "2024-10-01T00:00:00.000Z",
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"], // adjust path as needed
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
