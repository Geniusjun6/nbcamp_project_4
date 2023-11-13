import mongoose from 'mongoose';
const Schema = mongoose.Schema;



const UserSchemas = new mongoose.Schema({

  email: { // email 필드
    type: String,
    required: true,
    unique: true,
  },
  nickname: { // nickname 필드
    type: String,
    required: true,
    unique: true,
  },
  password: { // password 필드
    type: String,
    required: true,
  }

});

UserSchemas.virtual("userId").get(function () {
  return this._id.toHexString();
});

UserSchemas.set("toJSON", {
  virtuals: true,
});

const userModel = mongoose.model("Users", UserSchemas);
export default userModel;