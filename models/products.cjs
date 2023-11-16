'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    static associate(models) {
      // 1. Posts 모델에서
      this.belongsTo(models.Users, { // 2. Users 모델에게 N:1 관계를 설정
        targetKey: "id", // 3. Users 모델의 id 컬럼을
        foreignKey: "userId" // 4. Posts 모델의 UserId 컬럼과 연결
      });
    };
  };

  Products.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    productName: {
      allowNull: false,
      type: DataTypes.STRING
    },
    contents: {
      type: DataTypes.STRING
    },
    status: {
      allowNull: false,
      type: DataTypes.ENUM("FOR_SALE", "SOLD_OUT"),
      defaultValue: "FOR_SALE",
      validate: {
        isIn: {
          args: [["FOR_SALE", "SOLD_OUT"]],
          msg: "상품 상태를 정확하게 입력하세요."
        }
      },
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Products',
  });
  return Products;
};