import "reflect-metadata";
import express from "express";
import { DataSource } from "typeorm";
import { User } from "./Entities/User.js";
import { Product } from "./Entities/Product.js";
import { Category } from "./Entities/Category.js";
import routes from "./Controllers/routes.js";
import cors from "cors";
import path from "path";
import 'dotenv/config';
import cookieParser from "cookie-parser";

const app = express();
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());


export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "admin_shop",
  password: "dev12345",
  database: "db_shop",
  entities: [User, Product, Category],
});

app.get("/", (req, res) => {
  res.send("Shop Backend API");
});

app.use("/api", routes);

AppDataSource.initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Backend démarré" : http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

app.use("/images", express.static(path.join(path.resolve(), "src/images")));
