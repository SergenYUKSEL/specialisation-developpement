import { EntitySchema } from "typeorm";

export const Category = new EntitySchema({
    name: "Category",
    tableName: "categories",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        name: {
            type: "varchar",
            length: 255,
            unique: true
        },
        product_count: {
            type: "int",
            default: 0
        }
    },
    relations: {
        products: {
            target: "Product",
            type: "one-to-many",
            inverseSide: "category"
        }
    }
});