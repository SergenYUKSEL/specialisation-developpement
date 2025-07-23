import { EntitySchema } from "typeorm";

export const User = new EntitySchema({
    name: "User",
    tableName: "users",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        email: {
            type: "varchar",
            length: 63,
            unique: true
        },
        pseudo: {
            type: "varchar",
            length: 50,
            unique: true
        },
        password: {
            type: "varchar",
            length: 255
        }
    }
});