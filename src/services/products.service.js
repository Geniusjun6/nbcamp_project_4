import { ProductsRepository } from '../repositories/products.repository.js';

export class ProductsService {
  productsRepository = new ProductsRepository;

  createProduct = async (userId, productName, contents) => {
    const product = await this.productsRepository.createProduct(
      userId,
      productName,
      contents
    );

    return {
      UserId: product.UserId,
      productName: product.productName,
      contents: product.contents,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    };
  };


  findAllProducts = async (sortValue) => {
    const products = await this.productsRepository.findAllproducts();

    // 정렬값 결정하기
    if (sortValue === 'ASC') { // sortValue가 있고, 정렬값이 정해진 경우
      products.sort((a, b) => {
        return a.createdAt - b.createdAt
      });
    } else if (sortValue === 'DESC') { // 아니면 내림차순(최신순)으로 정렬한다.
      products.sort((a, b) => {
        return b.createdAt - a.createdAt
      });
    } else {
      products.sort((a, b) => {
        return b.createdAt - a.createdAt
      });
    }
    return products.map((product) => {
      return {
        productId: product.productId,
        UserId: product.UserId,
        productName: product.productName,
        contents: product.contents,
        status: product.status,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      }
    })
  };


  findProductById = async (productId) => {
    const product = await this.productsRepository.findProductById(productId)

    if (!product) {
      throw new Error("존재하는 상품이 없습니다.");
    };


    return {
      productId: product.productId,
      productName: product.productName,
      contents: product.contents,
      status: product.status,
      UserId: product.UserId,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    };
  };

  updateProduct = async (productId, userId, productName, contents, status) => {

    const product = await this.productsRepository.findProductById(productId);

    if (!product) {
      throw new Error("존재하는 상품이 없습니다.");
    };

    if (product.UserId !== userId) {
      throw new Error("권한이 없습니다.");
    }

    await this.productsRepository.updateProduct(productName, contents, status);

    const updatedProduct = await this.productsRepository.findProductById(productId);

    return {
      productId: updatedProduct.productId,
      productName: updatedProduct.productName,
      contents: updatedProduct.contents,
      status: updatedProduct.status,
      UserId: updatedProduct.UserId,
      createdAt: updatedProduct.createdAt,
      updatedAt: updatedProduct.updatedAt
    };
  };


  deleteProduct = async (productId, userId) => {
    const product = await this.productsRepository.findProductById(productId);

    if (!product) {
      throw new Error("존재하는 상품이 없습니다.");
    };

    if (product.UserId !== userId) {
      throw new Error("권한이 없습니다.");
    };

    await this.productsRepository.deleteProduct(postId)

    return {
      productId: product.productId,
      productName: product.productName,
      contents: product.contents,
      status: product.status,
      UserId: product.UserId,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    };
  };

};