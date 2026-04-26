const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const { allowOrigins } = require("./src/configs/cors.config");

const app = express();
const server = http.createServer(app);

//  CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      // const allowOrigins = allowOrigins;

      if (!origin || allowOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-signin-type"],
  })
);

// middlewares
app.use(express.json()); // application/json --body parser
app.use(express.urlencoded({ extended: true })); // application/x-www-form-urlencoded --body parser

// static path
app.use(express.static(path.join(__dirname, "public")));

// routers
const emailRoutes = require("./src/routes/email.routes");

// routes
app.use("/email", emailRoutes);

// open API swagger UI setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// default route
app.use("/", (req, res) => { res.sendFile(path.join(__dirname, "public", "index.html")); });

// server setup
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
