import "reflect-metadata";
import express from "express";
import routes from "./Controllers/routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import "dotenv/config";
import helmet from "helmet";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Shop Backend API");
});

app.use("/api", routes);
app.use("/images", express.static(path.join(path.resolve(), "src/images")));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
      },
    },
  })
);

export default app;
