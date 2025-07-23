import { EntitySchema } from "typeorm";

export const Product = new EntitySchema({
  name: "Product",
  tableName: "products",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    libelle: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    description: {
      type: "varchar",
      length: 500,
    },
    image_url: {
      type: "varchar",
      length: 500,
      nullable: true,
    },
    prix: {
      type: "decimal",
      precision: 10,
      scale: 2,
    },
    category_name: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    created_at: {
      type: "timestamp",
      createDate: true,
    },
    updated_at: {
      type: "timestamp",
      updateDate: true,
    },
  },
  relations: {
    category: {
      target: "Category",
      type: "many-to-one",
      joinColumn: {
        name: "category_name",
        referencedColumnName: "name",
      },
      onDelete: "SET NULL",
    },
  },
});
