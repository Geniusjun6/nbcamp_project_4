import express from 'express';
import db from '../models/index.cjs';
import authMiddleware from '../middlwares/need-signin.middlware.js';
import { Op } from 'sequelize';

const { Products } = db;
const { Users } = db;
const router = express.Router();


// Create 상품 등록 //
router.post('/products', authMiddleware, async (req, res) => {
  try {
    const { id } = res.locals.user;
    const { productName, contents } = req.body;

    // 데이터 형식이 바르지 않을 경우
    if (!req.body) { return res.status(400).json({ errorMessage: " 데이터 형식이 올바르지 않습니다. " }) };

    // 데이터가 모두 입력되지 않았을 경우
    if (!productName || !contents) {
      return res.status(400).json({ errorMessage: "데이터를 모두 입력해주세요." });
    }

    // 상품 생성 (생성 시 userId는 res.locals.user의 id값을 가져온다.)
    await Products.create({ userId: id, productName, contents })

    res.status(201).json({ message: "상품등록에 성공하였습니다." });
  } catch (error) {
    console.error("상품 등록 실패", error);
    res.status(500).json({ errorMessage: "상품 등록에 실패했습니다." });
  }
});



// Read 전체 상품 조회//
router.get('/products', authMiddleware, async (req, res) => {
  try {
    const sortValue = req.query.sort; // query string에서 정렬값 받아오기
    let sort

    // 정렬값 결정하기
    if (sortValue && (sortValue.toUpperCase() === 'ASC' || sortValue.toUpperCase() === 'DESC')) { // sortValue가 있고, 정렬값이 정해진 경우
      sort = sortValue.toUpperCase(); // 정해진 정렬값을 사용하고 
    } else { // 아니면 내림차순(최신순)으로 정렬한다.
      sort = 'DESC';
    };

    const products = await Products.findAll({
      attributes: { exclude: ["updatedAt"] },
      include: [{
        model: Users,
        attributes: ["userName"]
      }],
      order: [['createdAt', sort]]
    });
    res.status(200).json([{ products }]);

  } catch (error) {
    console.error('데이터를 가져오는 중 에러 발생', error);
    res.status(500).json({ errorMessage: "상품을 조회하는데 실패했습니다." });
  }
});



// Read 상품 상세 조회 // 
router.get('/products/detail/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const detailProduct = await Products.findOne({
      where: { id: productId },
      include: [{
        model: Users,
        attributes: ["userName"]
      }]
    });

    if (!detailProduct) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    };

    res.status(200).json({ detailProduct });

  } catch (error) {
    console.error('상품조회 실패', error);
    res.status(500).json({ errorMessage: '상품조회에 실패했습니다.' });
  }
});


// Update 상품 수정 // 
router.put("/products/detail/:productId", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;
    const { id: userId } = res.locals.user; // 로컬 유저에 들어있는 id 키값을 userId 변수로 받는다.
    const { productName, contents, status } = req.body;

    const existsProduct = await Products.findOne({ where: { id: productId } });

    // 수정할 상품이 존재하지 않을 경우 에러메시지 변환
    if (!existsProduct) {
      return res.status(404).json({ errorMessage: "상품을 찾을 수 없습니다." });
    };

    // 기존 작성한 상품이 본인 것이 아닐 경우
    if (existsProduct.userId !== userId) {
      return res.status(403).json({ errorMessage: "상품을 수정할 권한이 없습니다." });
    };

    // 상품 수정하기
    await Products.update(
      { productName, contents, status },
      {
        where: {
          [Op.and]: [{ id: productId }, { userId }]
        }
      }
    );
    res.status(200).json({ message: '상품 수정이 완료되었습니다.' });

  } catch (error) {
    console.error('상품 수정 실패', error);

    if (error.name === 'SequelizeValidationError') { // 모델에서 validate 기능 활용해보기 !!!!
      return res.status(400).json(error.message);
    }

    res.status(500).json({ errorMessage: "상품 수정에 실패했습니다." });
  };
});


// Delete 상품 삭제 //
router.delete("/products/detail/:productId", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;
    const { id: userId } = res.locals.user; // 로컬 유저에 들어있는 id 키값을 userId 변수로 받는다.

    const existsProduct = await Products.findOne({ where: { id: productId } });

    // 해당 상품을 찾을 수 없을 경우
    if (!existsProduct) {
      return res.status(404).json({ message: "상품 조회에 실패하였습니다." })
    }

    // 기존 작성한 상품이 본인 것이 아닐 경우
    if (existsProduct.userId !== userId) {
      return res.status(403).json({ errorMessage: "상품을 삭제할 권한이 없습니다." });
    };

    // 상품 아이디와 유저 아이디가 일치할 경우
    await Products.destroy({
      where: {
        [Op.and]: [{ id: productId }, { userId }]
      }
    });
    res.status(200).json({ message: "상품이 삭제되었습니다." })


  } catch (error) {
    console.error('상품 삭제 실패', error);
    res.status(500).json('상품 삭제에 실패했습니다.');
  }
});

export default router; 