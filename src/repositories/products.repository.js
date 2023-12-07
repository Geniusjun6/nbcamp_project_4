import { prisma } from "../utils/prisma/index.js"

export class ProductsRepository {
  findAllproducts = async () => {
    const products = await prisma.Products.findMany(
      {
        select: {
          UserId: true,
          productId: true,
          productName: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          Users: {
            select: { // 중첩 select 문으로 유저 이름 추가 
              userName: true,
            }
          }
        }
      }
    );
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
  };


  findProductById = async (productId) => {
    const product = await prisma.Products.findFirst({
      where: { productId: +productId },
      select: {
        UserId: true,
        productId: true,
        productName: true,
        status: true,
        contents: true,
        createdAt: true,
        updatedAt: true,
        Users: {
          select: { // 중첩 select 문으로 유저 이름 추가 
            userName: true,
          }
        }
      }
    }
    );
    return product;
  };


  updateProduct = async (productId, userId, productName, contents, status) => {
    const updatedProduct = await prisma.Products.update({
      where: {
        productId: +productId,
        UserId: userId
      },
      data: {
        productName,
        contents,
        status,
        updatedAt: new Date()
      }
    });

    return updatedProduct;
  };


  deleteProduct = async (productId, userId) => {
    await prisma.Products.delete({
      where: {
        productId: +productId,
        UserId: userId
      }
    });
  };
};