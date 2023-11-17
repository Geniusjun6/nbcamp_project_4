'use strict';
const bcrypt = require('bcryptjs'); // 비밀번호 암호화

const {
  Sequelize, DataTypes, Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {

      // 1. Users 모델에서 Products 모델의 Id 값 넘겨주기
      this.hasMany(models.Products, { // 2. Products 모델에게 1:N 관계 설정
        sourceKey: "id", // 3. Users 모델의 id 컬럼을
        foreignKey: "userId" // 4. Products 모델의 UserId 컬럼과 연결
      });
    };
  };


  Users.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userName: {
      allowNull: false,
      foreignKey: true,
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
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
    modelName: 'Users',
  });

  Users.beforeCreate(async (user, options) => { // Hook 사용하여 비밀번호 저장 전에 암호화 진행
    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    };
  });

  return Users;
};
