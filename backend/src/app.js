import "reflect-metadata";
import express from "express";
import routes from "./Controllers/routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import "dotenv/config";
import helmet from "helmet";

const app = express();

// CORS config
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Parsing middlewares
app.use(express.json());
app.use(cookieParser());

// Static files
app.use("/images", express.static(path.join(path.resolve(), "src/images")));


app.use((req, res, next) => {
  res.setHeader(
    "Report-To",
    JSON.stringify({
      group: "csp-endpoint",
      max_age: 10886400,
      endpoints: [{ url: "http://localhost:3000/api/csp-report" }],
      include_subdomains: true,
    })
  );
  next();
});


app.use(helmet());

// Helmet CSP + reporting
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
    },
    reportTo: "csp-endpoint", 
    reportOnly: false,
  })
);

app.get("/", (req, res) => {
  res.send("Shop Backend API");
});
app.use("/api", routes);

export default app;
