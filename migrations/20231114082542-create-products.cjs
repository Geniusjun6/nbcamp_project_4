'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Users", // Users 모델을 참조한다.
          key: "id", // Users 모델의 id를 참조한다.
        },
        onDelete: 'CASCADE' // 만약 Users 모델의 userId가 삭제되면, Products 모델의 데이터가 삭제된다.
      },
      productName: {
        type: Sequelize.STRING
      },
      contents: {
        type: Sequelize.STRING
      },
      contents: {
        type: Sequelize.STRING
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM("FOR_SALE", "SOLD_OUT"),
        defaultValue: "FOR_SALE"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now")
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now")
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};