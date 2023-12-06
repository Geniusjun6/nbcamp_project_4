import { prisma } from "../utils/prisma/index.js"

export class ProductsRepository {
  findAllproducts = async () => {
    const products = await prisma.Products.findMany();
    return products;
  };


  createProduct = async (userId, productName, contents) => {
    const createdProduct = await prisma.Products.create({
      data: {
        UserId: userId,
        productName,
        contents
      }
    });
    return createdProduct;
  }


  findProductById = async (productId) => {
    const post = await prisma.Products.findFirst({
      where: { productId: +productId }
    });
    return post;
  };


  updateProduct = async (productId, userId, productName, contents, status) => {
    const updatedPost = await prisma.Products.update({
      where: {
        productId: +productId,
        UserId: userId
      },
      data: {
        title,
        contents,
        status
      }
    });

    return updatedPost;
  };


  deleteProduct = async (productId, userId) => {
    const deletePost = await prisma.Products.delete({
      where: {
        productId: +productId,
        UserId: userId
      }
    });
  };
};