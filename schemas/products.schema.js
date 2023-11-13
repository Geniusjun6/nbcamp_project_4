import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const productsSchemas = new mongoose.Schema({
  productName: { // 상품명
    type: String,
    required: true,
  },
  creatorName: { // 작성자명
    type: String,
    required: true,
  },
  productStatus: { // 상품 상태
    type: String,
    required: true,
    enum: ["FOR_SALE", "SOLD_OUT"],
    default: "FOR_SALE" // 상품의 기본 상태는 FOR_SALE 
  },
  createDate: { // 작성 날짜
    type: Date,
    default: Date.now // 상품을 등록한 시점 타임스탬프 
  },
  password: { // 비밀번호
    type: String,
    required: true,
    trim: true // 비밀번호의 공백 제거
  },
  contents: { // 작성 내용
    type: String
  },
  productId: {
    type: Number,
    unique: true // productId를 고유하게 설정
  },
})

// 게시글이 하나씩 늘어날 때마다 productId 자동으로 추가 (chatGPT..)
productsSchemas.pre('save', async function (next) {
  if (!this.productId) {
    try {
      const latestProduct = await productsModel.findOne({}, {}, { sort: { 'productId': -1 } });
      const nextProductId = (latestProduct ? latestProduct.productId : 0) + 1;
      this.productId = nextProductId;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

const productsModel = mongoose.model("Products", productsSchemas); // 위에서 정의한 스키마들을 Products 이름으로 사용한다.
export default productsModel;