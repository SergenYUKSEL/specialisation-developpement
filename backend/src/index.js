import app from "./app.js";
import { DataSource } from "typeorm";
import { User } from "./Entities/User.js";
import { Product } from "./Entities/Product.js";
import { Category } from "./Entities/Category.js";
import "dotenv/config";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: "db_shop",
  entities: [User, Product, Category],
});

const port = 3000;

AppDataSource.initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Backend démarré : http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
