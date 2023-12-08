import { ValidationError } from '../middlewares/error.middleware.js';
import { ProductsRepository } from '../repositories/products.repository.js';

export class ProductsService {
  productsRepository = new ProductsRepository;

  createProduct = async (userId, productName, contents) => {

    if (!productName || !contents) {
      throw new ValidationError("상품 정보를 모두 입력해주세요.", 400)
    };

    const product = await this.productsRepository.createProduct(
      userId,
      productName,
      contents
    );

    return {
      productId: product.productId,
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
    }
    return products.map((product) => {
      return {
        productId: product.productId,
        UserId: product.UserId,
        productName: product.productName,
        contents: product.contents,
        status: product.status,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        userName: product.Users.userName
      }
    })
  };


  findProductById = async (productId) => {
    const product = await this.productsRepository.findProductById(productId)

    if (!product) {
      throw new ValidationError("존재하는 상품이 없습니다.", 404);
    };


    return {
      productId: product.productId,
      productName: product.productName,
      contents: product.contents,
      status: product.status,
      UserId: product.UserId,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      userName: product.Users.userName
    };
  };

  updateProduct = async (productId, userId, productName, contents, status) => {
    const product = await this.productsRepository.findProductById(productId);

    if (!product) {
      throw new ValidationError("존재하는 상품이 없습니다.", 404);
    };

    // 로그인 한 유저가 다른 사람의 상품을 수정할 때
    if (product.UserId !== userId) {
      throw new ValidationError("권한이 없습니다.", 403);
    };

    if (status !== "FOR_SALE" || status !== "SOLD_OUT") {
      throw new ValidationError("상태값을 확인해주세요.", 400);
    };

    const updatedProduct = await this.productsRepository.updateProduct(productId, userId, productName, contents, status);


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
      throw new ValidationError("존재하는 상품이 없습니다.", 404);
    };

    if (product.UserId !== userId) {
      throw new ValidationError("권한이 없습니다.", 403);
    };

    await this.productsRepository.deleteProduct(productId)

    // 삭제한 상품을 리턴해준다.
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