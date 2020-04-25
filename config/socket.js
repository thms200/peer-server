const { arrangeCustomerRoom, removeCustomerRoom } = require('./rooms');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('joinCustomer', (nickname, mode, consultant, callback) => {
      try {
        const room = arrangeCustomerRoom(nickname, mode, consultant);
        socket.join(room);
        callback(`${nickname}님, 잠시만 기다려주시면 상담을 시작하겠습니다.`);
      } catch (error) {
        console.warn(error);
      }
    });

    socket.on('disconnectionCustomer', (nickname, consultant, callback) => {
      try {
        const customer = removeCustomerRoom(nickname, consultant);
        callback(`${customer}님, 이용해 주셔서 감사합니다.`);
      } catch (error) {
        console.warn(error);
      }
    });
  });
};
