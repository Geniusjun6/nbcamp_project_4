import express from 'express';
import db from '../models/index.cjs';
import authMiddleware from '../middlwares/need-signin.middlware.js';
import { Op } from 'sequelize';

const { Products } = db;
const router = express.Router();


// Create 
router.post('/products', authMiddleware, async (req, res) => {
  try {
    const { id } = res.locals.user;
    console.log('id: ', typeof id);
    const { productName, contents } = req.body;
    if (!req.body) { return res.status(400).json({ errorMessage: " 데이터 형식이 올바르지 않습니다. " }) };

    if (!productName || !contents) {
      return res.status(400).json({ errorMessage: " 데이터를 모두 입력해주세요. " });
    }

    await Products.create({ userId: id, productName, contents })

    res.status(201).json({ message: "상품등록에 성공하였습니다." });
  } catch (error) {
    console.error("상품 등록 실패", error);
    res.status(500).json({ errorMessage: "상품 등록에 실패했습니다." });
  }
});



//Read
// /products에 모든 상품조회
// 몽고db에 있는 데이터를 불러오는 API
router.get('/products', async (req, res) => {
  try {
    const products = await Products.find({}, 'productName creatorName productStatus createDate _id').sort({ createDate: -1 });
    res.status(200).json([{ success: true }, { message: "상품 조회에 성공했습니다." }, { products }]);
  } catch (error) { // 에러 핸들링을 위해 try...catch 사용
    console.error('데이터를 가져오는 중 에러 발생', error);
    res.status(500).json({ errorMessage: "상품을 조회하는데 실패했습니다." });
  }
});

// /products/productDetail/:각 상품 id  
//상품 상세 조회
router.get('/products/detail/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const detailProduct = await Products.findOne({ _id: productId }, '-password -__v');

    if (!detailProduct) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    };

    res.status(200).json({ detailProduct });
  } catch (error) {
    console.error('상품조회 실패', error);
    res.status(500).json({ errorMessage: '상품조회에 실패했습니다.' });
  }
});


//Update
//상품 수정
// 상품 수정
router.put("/products/detail/:productId", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;
    const { id: userId } = res.locals.user; // 로컬 유저에 들어있는 id 키값을 userId 변수로 받는다.
    const { productName, contents, status } = req.body;

    const existsProduct = await Products.findOne({ where: { id: productId } });

    if (!existsProduct) {
      return res.status(404).json({ errorMessage: "상품을 찾을 수 없습니다." });
    };

    if (existsProduct.id !== userId) {
      return res.status(401).json({ errorMessage: "상품을 수정할 권한이 없습니다." });
    };

    await Products.update(
      { productName, contents, status },
      {
        where: {
          [Op.and]: [{ id: productId }, { userId }]
        }
      }
    );


    // 수정 성공 시 200 상태 코드 반환
    res.status(200).json({ message: '상품 수정이 완료되었습니다.' });
  } catch (error) {
    console.error('상품 수정 실패', error);

    if (error.name === 'SequelizeValidationError') { // 모델에서 validate 기능 활용해보기 !!!!
      return res.status(401).json(error.message);
    }

    res.status(500).json({ errorMessage: "상품 수정에 실패했습니다." });
  };
});


// Delete
// 상품 삭제
router.delete("/products/detail/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const { password } = req.body;

    const existsProduct = await Products.findOne({ _id: productId });

    if (!existsProduct) {
      return res.status(404).json({ message: "상품 조회에 실패하였습니다." })
    }

    if (existsProduct.password !== password) {
      return res.status(401).json({ message: "비밀번호를 확인해주세요." });
    }

    // 비밀번호가 일치하고 상품이 존재하는 경우에만 삭제 수행
    await Products.deleteOne({ _id: productId })
    res.status(200).json({ message: "상품이 삭제되었습니다." })
  } catch (error) {
    console.error('상품 삭제 실패', error);
    res.status(500).json('상품 삭제에 실패했습니다.');
  }
});

export default router; 