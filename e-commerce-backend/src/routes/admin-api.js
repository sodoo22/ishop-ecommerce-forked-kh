import express from "express";
import ProductCategory from "../models/ProductCategory";

const Router = express.Router();

Router.get("/categories", async (request, response) => {
  const categories = await ProductCategory.find({});
  console.log(categories);
  response.status(200).send(categories);
});

Router.post("/category/add", async (request, response) => {
  const body = request.body;
  console.log(body);
  const category = new ProductCategory();
  category.product_category_name = body.categoryName;
  category.product_category_description = body.categoryDescription;

  const savedCategory = await category.save();

  response.status(200).send({ data: savedCategory });
});

Router.delete("/category/del", async (request, response) => {
  const body = request.body;
  const deletedCategory = await ProductCategory.deleteOne({ id: body.id });

  response.status(200).send({ data: deletedCategory });
});

// module.exports = Router;
export default Router;
