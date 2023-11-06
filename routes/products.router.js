import express from 'express';
export const router = express.Router();

import Products from '../schemas/products.schema.js'


// Create 
// 몽고db에 데이터 넣기
router.post('/', async (req, res) => {
  const { productName, createrName, password, contents } = req.body; // status, createDate 스키마 값은 defalut로 설정

  const createdProduct = await Products.create({ productName, createrName, password, contents })
  res.json({ product: createdProduct });
});


//Read
// /products에 모든 상품조회
// 몽고db에 있는 데이터를 불러오는 API
router.get('/', async (req, res) => {
  try {
    const products = await Products.find({}, 'productName createrName productStatus createDate productId -_id').sort({ createDate: -1 });
    res.status(200).json(products);
  } catch (err) { // 에러 핸들링을 위해 try...catch 사용
    console.error('데이터를 가져오는 중 에러 발생', err);
    res.status(500).send('데이터를 가져오는데 실패했습니다.');
  }
});

// /products/productDetail/:각 상품 id  
//상품 상세 조회
router.get('/detail/:productid', async (req, res) => {
  try {
    const { productid } = req.params;
    const detailProduct = await Products.findOne({ productId: Number(productid) }, '-password -__v -_id');
    res.status(200).json({ detailProduct });
  } catch (err) {
    console.error('상품조회 실패', err);
    res.status(400).send('상품조회에 실패했습니다.');
  }
});


//Update
//상품 수정
// 상품 수정
router.put("/detail/:productid", async (req, res) => {
  try {
    const { productid } = req.params;
    const { productName, contents, productStatus, password } = req.body;

    const existsProduct = await Products.findOne({ productId: Number(productid) });

    if (!existsProduct) {
      return res.status(400).send({ message: "상품 조회에 실패하였습니다." });
    }

    if (existsProduct.password !== password) {
      return res.status(500).send({ message: "비밀번호를 확인해주세요." });
    }

    // 비밀번호가 일치하고 상품이 존재하는 경우에만 수정을 수행
    await Products.updateOne({ productId: Number(productid) }, { $set: { productName, contents, productStatus } });

    // 수정 성공 시 200 상태 코드 반환
    res.status(200).send('상품 수정이 완료되었습니다.');
  } catch (err) {
    console.error('상품 수정 실패', err);
    res.status(400).send('상품 수정에 실패했습니다.');
  }
});



// Delete
// 상품 삭제

router.delete("/detail/:productid", async (req, res) => {
  try {
    const { productid } = req.params;
    const { password } = req.body;

    const existsProduct = await Products.findOne({ productId: Number(productid) });

    if (!existsProduct) {
      return res.status(400).send({ message: "상품 조회에 실패하였습니다." })
    }

    if (existsProduct.password !== password) {
      return res.status(500).send({ message: "비밀번호를 확인해주세요." });
    }

    // 비밀번호가 일치하고 상품이 존재하는 경우에만 삭제 수행
    await Products.deleteOne({ productId: productid })
    res.status(200).send({ message: "상품이 삭제되었습니다." })
  } catch {
    console.error('상품 삭제 실패', err);
    res.status(400).send('상품 삭제에 실패했습니다.');
  }
})

export default router; 