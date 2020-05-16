const {
  arrangeCustomerRoom,
  removeCustomerRoom,
  getCustomers,
  arrangeConsultantRoom,
  disconnectCustomer,
} = require('./rooms');

const {
  addConsultants,
  findConsultant,
  removeConsultant,
} = require('./consultant');

module.exports = (io) => {
  io.listen(3030);
  io.on('connection', (socket) => {
    socket.on('joinCustomer', (customerInfo, callback) => {
      try {
        const { nickname, consultant } = customerInfo;
        const room = arrangeCustomerRoom(customerInfo, socket.id);
        socket.join(room);

        const consultantId = findConsultant(consultant);
        if (consultantId) {
          const currentCustomers = getCustomers(consultant);
          io.to(consultantId).emit('currentCustomers', currentCustomers);
        }

        callback(`${nickname}님, 잠시만 기다려주시면 상담을 시작하겠습니다.`);
      } catch (error) {
        console.warn(error);
      }
    });

    socket.on('leaveCustomer', (nickname, consultant, callback) => {
      try {
        const customer = removeCustomerRoom(nickname, consultant);
        const leaveCustomer = customer || nickname.trim();
        socket.leave(leaveCustomer);

        const consultantId = findConsultant(consultant);
        if (consultantId) {
          const currentCustomers = getCustomers(consultant);
          io.to(consultantId).emit('currentCustomers', currentCustomers);
        }

        callback(`${leaveCustomer}님, 이용해 주셔서 감사합니다.`);
      } catch (error) {
        console.warn(error);
      }
    });

    socket.on('onConsulting', (consultant, callback) => {
      try {
        addConsultants(consultant, socket.id);
        const currentCustomers = getCustomers(consultant);
        io.to(socket.id).emit('currentCustomers', currentCustomers);
        callback('상담모드가 시작되었습니다. Start를 누르시면 상담이 시작됩니다.');
      } catch (error) {
        console.warn(error);
      }
    });

    socket.on('startConsulting', (consultant, callback) => {
      try {
        const customerInfo = arrangeConsultantRoom(consultant);
        if (customerInfo === null) return callback({ message: '더이상 대기 중인 고객이 없습니다.' });
        socket.join(customerInfo.nickname);

        const currentCustomers = getCustomers(consultant);
        io.to(socket.id).emit('currentCustomers', currentCustomers);
        callback({ customerInfo, message: `${customerInfo.nickname}님과 연결되었습니다.` });
      } catch (error) {
        console.warn(error);
      }
    });

    socket.on('acceptCustomer', (data) => {
      try {
        io.to(data.to).emit('acceptConsultant', data.signal);
      } catch (error) {
        console.warn(error);
      }
    });

    socket.on('endConsulting', (nickname, callback) => {
      try {
        socket.leave(nickname);
        callback(`${nickname}님과의 상담이 종료되었습니다. 다음 상담을 진행하시려면 Start를 클릭하세요.`);
      } catch (error) {
        console.warn(error);
      }
    });

    socket.on('offConsulting', (consultant, callback) => {
      try {
        removeConsultant(consultant);
        callback('상담 모드가 종료되었습니다. on 버튼을 누르시면 다시 상담 모드가 됩니다.');
      } catch (error) {
        console.warn(error);
      }
    });

    socket.on('disconnect', () => {
      const consultant = disconnectCustomer(socket.id);

      const consultantId = findConsultant(consultant);
      if (consultantId) {
        const currentCustomers = getCustomers(consultant);
        io.to(consultantId).emit('currentCustomers', currentCustomers);
      }
    });
  });
};
