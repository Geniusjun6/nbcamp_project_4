import mongoose from 'mongoose';
import dotenv from 'dotenv'; // .env 패키지를 사용하기 위해 불러오고 실행함
dotenv.config();

const connect = () => {
  // mongoose.connect는 MongoDB 서버에 연결하는 메서드입니다.
  mongoose // **** mongoose 패키지를 설치했을 때 Puny코드 관련 문구가 뜹니다.. 맞나요..? 
    .connect(
      // 빨간색으로 표시된 부분은 대여한 ID, Password, 주소에 맞게끔 수정해주세요!
      `mongodb+srv://12345:${process.env.DB_PASSWORD}@geniusjun6.zouu4ec.mongodb.net/?retryWrites=true&w=majority`,
      {
        dbName: 'node_lv1', // node_lv1 데이터베이스명을 사용합니다.
      },
    )
    .then(() => console.log('MongoDB 연결에 성공하였습니다.'))
    .catch((err) => console.log(`MongoDB 연결에 실패하였습니다. ${err}`));
};

mongoose.connection.on('error', (err) => {
  console.error('MongoDB 연결 에러', err);
});

export default connect;
