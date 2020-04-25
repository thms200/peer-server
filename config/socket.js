const {
  arrangeCustomerRoom,
  removeCustomerRoom,
  getCustomers,
  arrangeConsultantRoom
} = require('./rooms');

const {
  addConsultants,
  findConsultant,
  removeConsultant,
} = require('./consultant');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('joinCustomer', (nickname, mode, consultant, callback) => {
      try {
        const room = arrangeCustomerRoom(nickname, mode, consultant);
        socket.join(room);

        const consultantId = findConsultant(consultant);
        if(consultantId) {
          const currentCustomers = getCustomers(consultant);
          socket.to(consultantId).emit('currentCustomers', currentCustomers);
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
        callback(`${leaveCustomer}님, 이용해 주셔서 감사합니다.`);
      } catch (error) {
        console.warn(error);
      }
    });

    socket.on('onConsultant', (consultant, callback) => {
      try {
        addConsultants(consultant, socket.id);
        const currentCustomers = getCustomers(consultant);
        socket.to(socket.id).emit('currentCustomers', currentCustomers);
        callback('상담모드가 시작되었습니다. Start를 누르시면 상담이 시작됩니다.');
      } catch (error) {
        console.warn(error);
      }
    });

    socket.on('startConsulting', (consultant, callback) => {
      try {
        const customer = arrangeConsultantRoom(consultant);
        socket.join(customer);
        callback(`${customer}님과 연결되었습니다.`);
      } catch (error) {
        console.warn(error);
      }
    });

    socket.on('endConsulting', (customer, callback) => {
      try {
        socket.leave(customer);
        callback(`${customer}님과의 상담이 종료되었습니다. 다음 상담을 진행하시려면 Start를 클릭하세요.`);
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
  });
};
