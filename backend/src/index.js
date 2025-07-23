import "reflect-metadata";
import express from "express";
import { DataSource } from "typeorm";
import { User } from "./Entities/User.js";
import { Product } from "./Entities/Product.js";
import { Category } from "./Entities/Category.js";
import routes from "./Controllers/routes.js";
import cors from "cors";

const app = express();
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: false,
  })
);

app.use(express.json());

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3309,
  username: "root",
  password: "",
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
      console.log(`Backend lancer : http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
