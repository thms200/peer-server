const { arrangeRoom } = require('./rooms');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('joinCustomer', (nickname, mode, consultant) => {
      try {
        const room = arrangeRoom(nickname, mode, consultant);
        socket.join(room);
      } catch (error) {
        console.warn(error);
      }
    });
  });
};
