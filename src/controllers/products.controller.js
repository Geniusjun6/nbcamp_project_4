import { ProductsService } from '../services/products.service.js'

export class ProductsController {
  productsService = new ProductsService();

  createProduct = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      const { productName, contents } = req.body

      const createdPost = await this.productsService.createProduct(
        userId,
        productName,
        contents,
      );

      return res.status(201).json({ data: createdPost })
    } catch (error) {
      next(error);
    };
  };


  getProducts = async (req, res, next) => {
    try {
      const sortValue = (req.query.sort).toUpperCase(); // query string에서 정렬값 받아오기
      const products = await this.productsService.findAllProducts(sortValue);

      return res.status(200).json({ products });
    } catch (error) {
      next(error);
    };
  };


  getProductById = async (req, res, next) => {
    try {
      const { productId } = req.params;

      const product = await this.productsService.findProductById(productId);

      return res.status(200).json({ product });
    } catch (error) {
      next(error);
    };
  };


  updateProduct = async (req, res, next) => {
    try {
      const { productId } = req.params;
      const { userId } = res.locals.user; // 로컬 유저에 들어있는 id 키값을 userId 변수로 받는다.
      const { productName, contents, status } = req.body;

      const updatedProduct = await this.productsService.updateProduct(
        productId,
        userId,
        productName,
        contents,
        status
      );

      return res.status(200).json(updatedProduct);

    } catch (error) {
      next(error);
    };
  };


  deleteProduct = async (req, res, next) => {
    try {
      const { productId } = req.params;
      const { userId } = res.locals.user;

      const deletedProduct = await this.productsService.deleteProduct(productId, userId);

      return res.status(200).json(deletedProduct);
    } catch (error) {
      next(error);
    };
  };

};